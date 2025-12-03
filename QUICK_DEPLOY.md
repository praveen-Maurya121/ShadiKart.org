# Quick EC2 Deployment Guide

## 🚀 Fast Deployment (5 Steps)

### 1. Launch EC2 Instance
- Choose Ubuntu 22.04 LTS
- Instance type: t2.micro or t3.small (minimum)
- Configure Security Group:
  - SSH (22) from your IP
  - HTTP (80) from anywhere
  - HTTPS (443) from anywhere

### 2. Connect to EC2
```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 3. Clone Repository
```bash
cd ~
git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
cd ShadiKart.org
```

### 4. Run Deployment Script
```bash
chmod +x deploy.sh
./deploy.sh
```

The script will:
- Install Node.js, PostgreSQL, PM2, nginx
- Set up database
- Build and start the application
- Configure nginx reverse proxy

**Note:** When prompted, edit `.env` file with your database password:
```bash
nano .env
# Update DATABASE_URL with your PostgreSQL password
# Update NEXTAUTH_URL with your EC2 public IP
```

### 5. Set Up Database (if script prompts)

```bash
# Create database and user
sudo -u postgres psql
CREATE DATABASE shadikart;
CREATE USER shadikart_user WITH PASSWORD 'your_password';
GRANT ALL PRIVILEGES ON DATABASE shadikart TO shadikart_user;
\q

# Update .env DATABASE_URL:
# DATABASE_URL="postgresql://shadikart_user:your_password@localhost:5432/shadikart?schema=public"
```

Then run the script again:
```bash
./deploy.sh
```

## ✅ Access Your App

Open in browser:
```
http://YOUR_EC2_PUBLIC_IP
```

## 📝 Manual Setup (Alternative)

If you prefer manual setup, see `DEPLOYMENT.md` for detailed step-by-step instructions.

## 🔧 Useful Commands

```bash
# View application logs
pm2 logs shadikart

# Restart application
pm2 restart shadikart

# Check application status
pm2 status

# View nginx logs
sudo tail -f /var/log/nginx/error.log
```

## 🐛 Troubleshooting

**Port not accessible?**
- Check EC2 Security Group allows port 80/3000
- Check if application is running: `pm2 status`

**Database connection error?**
- Verify PostgreSQL is running: `sudo systemctl status postgresql`
- Check database credentials in `.env`

**Build fails?**
- Check Node.js version: `node -v` (should be 20.x)
- Check logs: `pm2 logs shadikart`

