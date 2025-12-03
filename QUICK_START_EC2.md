# Quick Start: Deploy to EC2 with Public IP

This guide will help you deploy Shadikart to your EC2 instance using only the Public IPv4 address (no domain needed).

## Prerequisites

- EC2 instance running (Ubuntu 20.04 or 22.04)
- SSH access to your EC2 instance
- Your EC2 Public IPv4 address

## Step-by-Step Deployment

### Step 1: Connect to Your EC2 Instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

Replace:
- `your-key.pem` with your actual key file path
- `YOUR_EC2_PUBLIC_IP` with your actual EC2 Public IPv4 address

### Step 2: Clone the Repository

```bash
cd ~
git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
cd ShadiKart.org
```

### Step 3: Set Up PostgreSQL Database

First, set a password for the PostgreSQL `postgres` user and create the database:

```bash
# Set PostgreSQL password (remember this password!)
sudo -u postgres psql -c "ALTER USER postgres PASSWORD 'YOUR_SECURE_PASSWORD';"

# Create the database
sudo -u postgres psql -c "CREATE DATABASE shadikart;"
```

**Important:** Replace `YOUR_SECURE_PASSWORD` with a strong password and remember it!

### Step 4: Configure Environment Variables

```bash
# Copy the example file
cp .env.example .env

# Edit the .env file
nano .env
```

Update the `.env` file with these values:

```env
# Database - Replace YOUR_SECURE_PASSWORD with the password you set above
DATABASE_URL="postgresql://postgres:YOUR_SECURE_PASSWORD@localhost:5432/shadikart?schema=public"

# NextAuth - Replace YOUR_EC2_PUBLIC_IP with your actual EC2 Public IP
NEXTAUTH_SECRET="$(openssl rand -base64 32)"
NEXTAUTH_URL="http://YOUR_EC2_PUBLIC_IP"

# Node Environment
NODE_ENV=production
```

**To get your Public IP:**
```bash
curl -s ifconfig.me
```

**To generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

Save the file: `Ctrl+X`, then `Y`, then `Enter`

### Step 5: Run the Deployment Script

```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Install Node.js, PostgreSQL, PM2, and nginx
- Set up the database
- Build the application
- Start the app with PM2
- Configure nginx as reverse proxy

### Step 6: Configure EC2 Security Group

**IMPORTANT:** You need to allow HTTP traffic in your EC2 Security Group:

1. Go to AWS Console → EC2 → Security Groups
2. Select your instance's security group
3. Click "Edit inbound rules"
4. Add rule:
   - **Type:** HTTP
   - **Port:** 80
   - **Source:** 0.0.0.0/0 (or your IP for better security)
5. Click "Save rules"

### Step 7: Access Your Application

Open your browser and go to:
```
http://YOUR_EC2_PUBLIC_IP
```

That's it! Your app should be running.

## Troubleshooting

### Can't access the app?

1. **Check if the app is running:**
   ```bash
   pm2 status
   pm2 logs shadikart
   ```

2. **Check nginx:**
   ```bash
   sudo systemctl status nginx
   sudo nginx -t
   ```

3. **Check firewall:**
   ```bash
   sudo ufw status
   # If needed, allow HTTP:
   sudo ufw allow 80/tcp
   ```

4. **Verify Security Group** - Make sure port 80 is open in AWS Console

### Database connection errors?

```bash
# Check if PostgreSQL is running
sudo systemctl status postgresql

# Test database connection
sudo -u postgres psql -d shadikart -c "SELECT 1;"
```

### App not starting?

```bash
# Check logs
pm2 logs shadikart --lines 50

# Restart the app
pm2 restart shadikart
```

## Useful Commands

```bash
# View app logs
pm2 logs shadikart

# Restart app
pm2 restart shadikart

# Stop app
pm2 stop shadikart

# Check app status
pm2 status

# View nginx logs
sudo tail -f /var/log/nginx/error.log
```

## Next Steps

After deployment, you can:

1. **Create an admin user:**
   ```bash
   npm run db:create-admin
   ```

2. **Seed initial data (optional):**
   ```bash
   npm run db:seed
   ```

3. **Access Prisma Studio (database GUI):**
   ```bash
   npm run db:studio
   ```

## Need Help?

- Check PM2 logs: `pm2 logs shadikart`
- Check nginx logs: `sudo tail -f /var/log/nginx/error.log`
- Verify environment: `cat .env`
- Test database: `sudo -u postgres psql -d shadikart`
