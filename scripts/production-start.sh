#!/bin/bash

# Production Start Script for Shadikart
# This script ensures the app is ready for production and starts it

set -e

echo "🚀 Starting Shadikart in production mode..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found. Please create it from .env.example"
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "DATABASE_URL" .env; then
    echo "❌ DATABASE_URL not found in .env file"
    exit 1
fi

# Check if NEXTAUTH_SECRET is set
if ! grep -q "NEXTAUTH_SECRET" .env; then
    echo "⚠️  NEXTAUTH_SECRET not found. Generating one..."
    SECRET=$(openssl rand -base64 32)
    echo "NEXTAUTH_SECRET=\"$SECRET\"" >> .env
fi

# Generate Prisma Client
echo "🔧 Generating Prisma Client..."
npx prisma generate

# Check database connection
echo "🔍 Checking database connection..."
if npx prisma db pull &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed. Please check your DATABASE_URL in .env"
    exit 1
fi

# Run migrations
echo "🗄️  Running database migrations..."
npx prisma migrate deploy || npx prisma db push

# Build the application
echo "🏗️  Building Next.js application..."
npm run build

# Start with PM2
echo "🚀 Starting application with PM2..."
if command -v pm2 &> /dev/null; then
    pm2 start ecosystem.config.js
    pm2 save
    echo "✅ Application started with PM2"
    echo "📊 View logs: pm2 logs shadikart"
    echo "🔄 Restart: pm2 restart shadikart"
else
    echo "⚠️  PM2 not found. Starting with npm..."
    npm start
fi
