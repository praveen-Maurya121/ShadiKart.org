#!/bin/bash

# Shadikart EC2 Deployment Script
# Run this script on your EC2 instance after cloning the repository

set -e

echo "🚀 Starting Shadikart deployment..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo -e "${RED}Please do not run as root${NC}"
   exit 1
fi

# Update system
echo -e "${YELLOW}📦 Updating system packages...${NC}"
sudo apt update && sudo apt upgrade -y

# Install Node.js if not installed
if ! command -v node &> /dev/null; then
    echo -e "${YELLOW}📦 Installing Node.js...${NC}"
    curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
    sudo apt install -y nodejs
else
    echo -e "${GREEN}✓ Node.js already installed${NC}"
fi

# Install PostgreSQL if not installed
if ! command -v psql &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PostgreSQL...${NC}"
    sudo apt install -y postgresql postgresql-contrib
    sudo systemctl start postgresql
    sudo systemctl enable postgresql
else
    echo -e "${GREEN}✓ PostgreSQL already installed${NC}"
fi

# Install PM2 if not installed
if ! command -v pm2 &> /dev/null; then
    echo -e "${YELLOW}📦 Installing PM2...${NC}"
    sudo npm install -g pm2
else
    echo -e "${GREEN}✓ PM2 already installed${NC}"
fi

# Install nginx if not installed
if ! command -v nginx &> /dev/null; then
    echo -e "${YELLOW}📦 Installing nginx...${NC}"
    sudo apt install -y nginx
    sudo systemctl start nginx
    sudo systemctl enable nginx
else
    echo -e "${GREEN}✓ nginx already installed${NC}"
fi

# Get current directory
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# Get public IP early
PUBLIC_IP=$(curl -s ifconfig.me || curl -s http://169.254.169.254/latest/meta-data/public-ipv4)

# Check if .env exists
if [ ! -f .env ]; then
    echo -e "${YELLOW}⚠️  .env file not found. Creating template...${NC}"
    
    # Check if database exists, if not create it
    if ! sudo -u postgres psql -lqt | cut -d \| -f 1 | grep -qw shadikart; then
        echo -e "${YELLOW}📦 Creating PostgreSQL database...${NC}"
        echo -e "${YELLOW}⚠️  You'll need to set a PostgreSQL password.${NC}"
        read -sp "Enter password for PostgreSQL 'postgres' user: " POSTGRES_PASSWORD
        echo ""
        
        sudo -u postgres psql << EOF
ALTER USER postgres PASSWORD '$POSTGRES_PASSWORD';
CREATE DATABASE shadikart;
EOF
        DB_PASSWORD=$POSTGRES_PASSWORD
    else
        echo -e "${GREEN}✓ Database 'shadikart' already exists${NC}"
        read -sp "Enter PostgreSQL 'postgres' user password: " DB_PASSWORD
        echo ""
    fi
    
    NEXTAUTH_SECRET=$(openssl rand -base64 32)
    
    cat > .env << EOF
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://postgres:${DB_PASSWORD}@localhost:5432/shadikart?schema=public"

# NextAuth
NEXTAUTH_SECRET="${NEXTAUTH_SECRET}"
NEXTAUTH_URL="http://${PUBLIC_IP}"

# Node Environment
NODE_ENV=production
EOF
    echo -e "${GREEN}✓ .env file created with Public IP: ${PUBLIC_IP}${NC}"
else
    # Update NEXTAUTH_URL if it's not set correctly
    if ! grep -q "NEXTAUTH_URL" .env || grep -q "localhost:3000" .env; then
        echo -e "${YELLOW}⚠️  Updating NEXTAUTH_URL in .env file...${NC}"
        if grep -q "NEXTAUTH_URL" .env; then
            sed -i "s|NEXTAUTH_URL=.*|NEXTAUTH_URL=\"http://${PUBLIC_IP}\"|" .env
        else
            echo "NEXTAUTH_URL=\"http://${PUBLIC_IP}\"" >> .env
        fi
        echo -e "${GREEN}✓ Updated NEXTAUTH_URL to http://${PUBLIC_IP}${NC}"
    fi
fi

# Install npm dependencies
echo -e "${YELLOW}📦 Installing npm dependencies...${NC}"
npm install

# Update Prisma schema for PostgreSQL if DATABASE_URL is PostgreSQL
if grep -q "postgresql://" .env; then
    echo -e "${YELLOW}🔧 Updating Prisma schema for PostgreSQL...${NC}"
    sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
fi

# Generate Prisma Client
echo -e "${YELLOW}🔧 Generating Prisma Client...${NC}"
npx prisma generate

# Check database connection
echo -e "${YELLOW}🔍 Checking database connection...${NC}"
if npx prisma db pull &> /dev/null; then
    echo -e "${GREEN}✓ Database connection successful${NC}"
else
    echo -e "${RED}✗ Database connection failed. Please check your DATABASE_URL in .env${NC}"
    exit 1
fi

# Run migrations
echo -e "${YELLOW}🗄️  Running database migrations...${NC}"
npx prisma migrate deploy || npx prisma db push

# Build the application
echo -e "${YELLOW}🏗️  Building Next.js application...${NC}"
npm run build

# Stop existing PM2 process if running
if pm2 list | grep -q "shadikart"; then
    echo -e "${YELLOW}🛑 Stopping existing PM2 process...${NC}"
    pm2 stop shadikart || true
    pm2 delete shadikart || true
fi

# Create logs directory
mkdir -p logs

# Make scripts executable
chmod +x scripts/*.sh 2>/dev/null || true

# Start with PM2 using ecosystem config
echo -e "${YELLOW}🚀 Starting application with PM2...${NC}"
if [ -f ecosystem.config.js ]; then
    pm2 start ecosystem.config.js
else
    pm2 start npm --name "shadikart" -- start
fi
pm2 save

# Setup PM2 startup
echo -e "${YELLOW}⚙️  Setting up PM2 startup...${NC}"
STARTUP_CMD=$(pm2 startup | grep -oP 'sudo.*')
if [ ! -z "$STARTUP_CMD" ]; then
    eval $STARTUP_CMD
fi

# Get public IP (already set earlier, but ensure it's available)
if [ -z "$PUBLIC_IP" ]; then
    PUBLIC_IP=$(curl -s ifconfig.me || curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
fi

# Configure nginx
echo -e "${YELLOW}⚙️  Configuring nginx...${NC}"
sudo tee /etc/nginx/sites-available/shadikart > /dev/null << EOF
server {
    listen 80;
    server_name $PUBLIC_IP _;

    # Increase body size limit for file uploads
    client_max_body_size 10M;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
        proxy_cache_bypass \$http_upgrade;
        
        # Timeouts
        proxy_connect_timeout 60s;
        proxy_send_timeout 60s;
        proxy_read_timeout 60s;
    }
}
EOF

# Enable nginx site
sudo ln -sf /etc/nginx/sites-available/shadikart /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t && sudo systemctl restart nginx

echo -e "${GREEN}✅ Deployment complete!${NC}"
echo -e "${GREEN}🌐 Access your application at: http://$PUBLIC_IP${NC}"
echo -e "${YELLOW}📊 View logs: pm2 logs shadikart${NC}"
echo -e "${YELLOW}🔄 Restart: pm2 restart shadikart${NC}"
echo ""
echo -e "${YELLOW}⚠️  IMPORTANT: Make sure your EC2 Security Group allows HTTP (port 80) traffic!${NC}"
echo -e "${YELLOW}   Go to: AWS Console → EC2 → Security Groups → Edit Inbound Rules${NC}"
echo -e "${YELLOW}   Add: Type=HTTP, Port=80, Source=0.0.0.0/0${NC}"

