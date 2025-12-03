#!/bin/bash
# Quick deployment script - Copy and paste this entire script into your EC2 instance

set -e

echo "🚀 Quick Deploy Script for Shadikart"
echo "===================================="
echo ""

# Get Public IP
PUBLIC_IP=$(curl -s ifconfig.me || curl -s http://169.254.169.254/latest/meta-data/public-ipv4)
echo "📍 Your Public IP: $PUBLIC_IP"
echo ""

# Clone repository
if [ ! -d "ShadiKart.org" ]; then
    echo "📥 Cloning repository..."
    git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
    cd ShadiKart.org
else
    echo "📁 Repository already exists, updating..."
    cd ShadiKart.org
    git pull
fi

# Run deployment
echo "🚀 Starting deployment..."
chmod +x deploy.sh
./deploy.sh

echo ""
echo "✅ Done! Your app should be available at: http://$PUBLIC_IP"
echo "⚠️  Don't forget to open port 80 in your EC2 Security Group!"
