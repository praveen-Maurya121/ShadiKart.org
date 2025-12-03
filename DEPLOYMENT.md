# Shadikart EC2 Deployment Guide

This guide will help you deploy Shadikart on an AWS EC2 instance using a public IP address.

## Prerequisites

1. AWS EC2 instance running (Ubuntu 22.04 LTS recommended)
2. SSH access to your EC2 instance
3. GitHub repository URL: `https://github.com/praveen-Maurya121/ShadiKart.org.git`
4. EC2 Security Group configured to allow:
   - SSH (port 22) from your IP
   - HTTP (port 80) from anywhere (0.0.0.0/0)
   - HTTPS (port 443) from anywhere (0.0.0.0/0)
   - Custom port 3000 (if not using nginx)

## Step 1: Connect to EC2 Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

## Step 2: Install Dependencies

Run the setup script on your EC2 instance:

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js 20.x
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs

# Install PostgreSQL (for production database)
sudo apt install -y postgresql postgresql-contrib

# Install PM2 for process management
sudo npm install -g pm2

# Install Git (if not already installed)
sudo apt install -y git

# Install nginx (optional, for reverse proxy)
sudo apt install -y nginx
```

## Step 3: Clone Repository

```bash
cd ~
git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
cd ShadiKart.org
```

## Step 4: Set Up Environment Variables

```bash
# Create .env file
nano .env
```

Add the following content (update with your values):

```env
# Database (PostgreSQL for production)
DATABASE_URL="postgresql://postgres:YOUR_PASSWORD@localhost:5432/shadikart?schema=public"

# NextAuth
NEXTAUTH_SECRET="generate-a-random-secret-here-min-32-chars"
NEXTAUTH_URL="http://YOUR_EC2_PUBLIC_IP:3000"

# Node Environment
NODE_ENV=production
```

Generate a secure secret:
```bash
openssl rand -base64 32
```

## Step 5: Set Up PostgreSQL Database

```bash
# Switch to postgres user
sudo -u postgres psql

# In PostgreSQL prompt:
CREATE DATABASE shadikart;
CREATE USER shadikart_user WITH PASSWORD 'your_secure_password';
GRANT ALL PRIVILEGES ON DATABASE shadikart TO shadikart_user;
\q

# Update DATABASE_URL in .env with the new user credentials
```

## Step 6: Install Project Dependencies

```bash
cd ~/ShadiKart.org
npm install
```

## Step 7: Set Up Database

```bash
# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy

# Seed database (optional)
npm run db:seed

# Create admin user
npm run db:create-admin
```

## Step 8: Build the Application

```bash
npm run build
```

## Step 9: Start with PM2

```bash
# Start the application
pm2 start npm --name "shadikart" -- start

# Save PM2 configuration
pm2 save

# Set up PM2 to start on boot
pm2 startup
# Follow the command it outputs
```

## Step 10: Configure Nginx (Optional but Recommended)

```bash
sudo nano /etc/nginx/sites-available/shadikart
```

Add this configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable the site:
```bash
sudo ln -s /etc/nginx/sites-available/shadikart /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## Step 11: Update NEXTAUTH_URL

If using nginx, update `.env`:
```env
NEXTAUTH_URL="http://YOUR_EC2_PUBLIC_IP"
```

Then restart:
```bash
pm2 restart shadikart
```

## Step 12: Access Your Application

Open in browser:
```
http://YOUR_EC2_PUBLIC_IP
```

## Useful Commands

```bash
# View PM2 logs
pm2 logs shadikart

# Restart application
pm2 restart shadikart

# Stop application
pm2 stop shadikart

# View application status
pm2 status

# View nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Troubleshooting

1. **Port 3000 not accessible**: Check security group rules
2. **Database connection error**: Verify PostgreSQL is running and credentials are correct
3. **Build errors**: Check Node.js version (should be 20.x)
4. **PM2 not starting**: Check logs with `pm2 logs shadikart`

## Security Recommendations

1. Set up SSL certificate with Let's Encrypt (even without domain)
2. Configure firewall (UFW) to only allow necessary ports
3. Keep system and dependencies updated
4. Use strong passwords for database
5. Regularly backup database

