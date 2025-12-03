# EC2 Deployment Guide for Shadikart

This guide will help you deploy Shadikart to an AWS EC2 instance.

## Prerequisites

- AWS EC2 instance (Ubuntu 20.04 or 22.04 recommended)
- SSH access to your EC2 instance
- Domain name (optional, for custom domain setup)

## Step 1: Initial EC2 Setup

### 1.1 Connect to your EC2 instance

```bash
ssh -i your-key.pem ubuntu@your-ec2-public-ip
```

### 1.2 Update system packages

```bash
sudo apt update && sudo apt upgrade -y
```

### 1.3 Install Node.js 20.x

```bash
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # Should show v20.x.x
```

### 1.4 Install PostgreSQL

```bash
sudo apt install -y postgresql postgresql-contrib
sudo systemctl start postgresql
sudo systemctl enable postgresql
```

### 1.5 Install PM2 (Process Manager)

```bash
sudo npm install -g pm2
```

### 1.6 Install nginx (Reverse Proxy)

```bash
sudo apt install -y nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

## Step 2: Clone and Setup Repository

### 2.1 Clone the repository

```bash
cd ~
git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
cd ShadiKart.org
```

### 2.2 Set up PostgreSQL database

```bash
chmod +x scripts/setup-postgres.sh
./scripts/setup-postgres.sh
```

This will:
- Create a `shadikart` database
- Create a `shadikart` user
- Set up proper permissions

### 2.3 Configure environment variables

```bash
cp .env.example .env
nano .env
```

Update the `.env` file with:

```env
# Database (PostgreSQL)
DATABASE_URL="postgresql://shadikart:YOUR_PASSWORD@localhost:5432/shadikart?schema=public"

# NextAuth
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://YOUR_EC2_PUBLIC_IP"

# Node Environment
NODE_ENV=production
```

**Important:** 
- Replace `YOUR_PASSWORD` with the password you set during PostgreSQL setup
- Replace `YOUR_EC2_PUBLIC_IP` with your actual EC2 public IP
- Generate a secure `NEXTAUTH_SECRET` using: `openssl rand -base64 32`

### 2.4 Update Prisma schema for PostgreSQL

The deploy script will automatically update the schema, but you can also do it manually:

```bash
sed -i 's/provider = "sqlite"/provider = "postgresql"/' prisma/schema.prisma
```

## Step 3: Deploy the Application

### Option A: Automated Deployment (Recommended)

```bash
chmod +x deploy.sh
./deploy.sh
```

This script will:
- Install all dependencies
- Set up the database
- Build the application
- Start with PM2
- Configure nginx

### Option B: Manual Deployment

```bash
# Install dependencies
npm install

# Generate Prisma Client
npx prisma generate

# Run migrations
npx prisma migrate deploy || npx prisma db push

# Build the application
npm run build

# Start with PM2
pm2 start ecosystem.config.js
pm2 save

# Setup PM2 startup
pm2 startup
# Follow the instructions shown
```

## Step 4: Configure nginx

### 4.1 Create nginx configuration

```bash
sudo nano /etc/nginx/sites-available/shadikart
```

Add the following configuration:

```nginx
server {
    listen 80;
    server_name YOUR_EC2_PUBLIC_IP;  # or your domain name

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

### 4.2 Enable the site

```bash
sudo ln -sf /etc/nginx/sites-available/shadikart /etc/nginx/sites-enabled/
sudo rm -f /etc/nginx/sites-enabled/default
sudo nginx -t  # Test configuration
sudo systemctl restart nginx
```

## Step 5: Configure Firewall

### 5.1 Allow HTTP and HTTPS traffic

```bash
sudo ufw allow 22/tcp   # SSH
sudo ufw allow 80/tcp   # HTTP
sudo ufw allow 443/tcp  # HTTPS
sudo ufw enable
```

### 5.2 Update EC2 Security Group

In AWS Console:
1. Go to EC2 → Security Groups
2. Select your instance's security group
3. Add inbound rules:
   - Type: HTTP, Port: 80, Source: 0.0.0.0/0
   - Type: HTTPS, Port: 443, Source: 0.0.0.0/0
   - Type: SSH, Port: 22, Source: Your IP (for security)

## Step 6: Verify Deployment

1. **Check PM2 status:**
   ```bash
   pm2 status
   pm2 logs shadikart
   ```

2. **Check nginx status:**
   ```bash
   sudo systemctl status nginx
   ```

3. **Access your application:**
   Open your browser and navigate to: `http://YOUR_EC2_PUBLIC_IP`

## Step 7: Post-Deployment Setup

### 7.1 Create admin user

```bash
npm run db:create-admin
```

### 7.2 Seed initial data (optional)

```bash
npm run db:seed
```

## Useful Commands

### PM2 Commands

```bash
pm2 status                    # Check app status
pm2 logs shadikart           # View logs
pm2 restart shadikart        # Restart app
pm2 stop shadikart           # Stop app
pm2 delete shadikart         # Remove from PM2
pm2 monit                    # Monitor resources
```

### Database Commands

```bash
npm run db:studio            # Open Prisma Studio
npx prisma migrate deploy    # Run migrations
npx prisma db push           # Push schema changes
```

### Update Application

```bash
# Pull latest changes
git pull origin main

# Install new dependencies (if any)
npm install

# Run migrations (if any)
npx prisma migrate deploy

# Rebuild and restart
npm run build
pm2 restart shadikart
```

## Troubleshooting

### Application not starting

1. Check PM2 logs: `pm2 logs shadikart`
2. Check environment variables: `cat .env`
3. Verify database connection: `npx prisma db pull`

### Database connection errors

1. Verify PostgreSQL is running: `sudo systemctl status postgresql`
2. Check database credentials in `.env`
3. Test connection: `psql -U shadikart -d shadikart`

### nginx errors

1. Test configuration: `sudo nginx -t`
2. Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
3. Verify nginx is running: `sudo systemctl status nginx`

### Port already in use

```bash
# Find process using port 3000
sudo lsof -i :3000

# Kill the process
sudo kill -9 <PID>
```

## SSL/HTTPS Setup (Optional)

For production, you should set up SSL using Let's Encrypt:

```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

This will automatically configure nginx with SSL.

## Monitoring

### Set up PM2 monitoring

```bash
pm2 install pm2-logrotate
pm2 set pm2-logrotate:max_size 10M
pm2 set pm2-logrotate:retain 7
```

### Set up system monitoring

Consider installing monitoring tools like:
- `htop` for system monitoring
- `netdata` for real-time monitoring
- CloudWatch (AWS native monitoring)

## Backup Strategy

### Database backups

```bash
# Create backup
pg_dump -U shadikart shadikart > backup_$(date +%Y%m%d).sql

# Restore backup
psql -U shadikart shadikart < backup_YYYYMMDD.sql
```

Set up automated backups using cron:

```bash
crontab -e
# Add: 0 2 * * * pg_dump -U shadikart shadikart > /home/ubuntu/backups/shadikart_$(date +\%Y\%m\%d).sql
```

## Security Best Practices

1. **Keep system updated:**
   ```bash
   sudo apt update && sudo apt upgrade -y
   ```

2. **Use strong passwords** for database and admin accounts

3. **Restrict SSH access** to your IP in security groups

4. **Set up fail2ban** to prevent brute force attacks:
   ```bash
   sudo apt install fail2ban
   ```

5. **Regular backups** of database and application files

6. **Monitor logs** regularly for suspicious activity

## Support

For issues or questions, please refer to:
- [GitHub Issues](https://github.com/praveen-Maurya121/ShadiKart.org/issues)
- [README.md](./README.md)
