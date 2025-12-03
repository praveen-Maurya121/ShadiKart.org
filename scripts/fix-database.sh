#!/bin/bash

# Fix Database Connection Script
# Run this if database connection fails during deployment

set -e

echo "🔧 Fixing database connection..."

# Check if .env exists
if [ ! -f .env ]; then
    echo "❌ .env file not found!"
    exit 1
fi

# Get database password from .env
DB_PASSWORD=$(grep DATABASE_URL .env | sed -n 's/.*postgres:\([^@]*\)@.*/\1/p')

if [ -z "$DB_PASSWORD" ]; then
    echo "❌ Could not extract database password from .env"
    exit 1
fi

echo "📝 Configuring PostgreSQL authentication..."

# Update pg_hba.conf to allow password authentication
sudo sed -i 's/local   all             postgres                                peer/local   all             postgres                                md5/' /etc/postgresql/*/main/pg_hba.conf
sudo sed -i 's/local   all             all                                     peer/local   all             all                                     md5/' /etc/postgresql/*/main/pg_hba.conf

# Restart PostgreSQL
echo "🔄 Restarting PostgreSQL..."
sudo systemctl restart postgresql

# Wait a moment for PostgreSQL to start
sleep 2

# Test connection
echo "🔍 Testing database connection..."
export PGPASSWORD="$DB_PASSWORD"
if psql -h localhost -U postgres -d shadikart -c "SELECT 1;" > /dev/null 2>&1; then
    echo "✅ Database connection successful!"
    
    # Test with Prisma
    echo "🔍 Testing Prisma connection..."
    if npx prisma db pull > /dev/null 2>&1; then
        echo "✅ Prisma connection successful!"
        echo ""
        echo "✅ Database is ready! You can continue with deployment."
    else
        echo "⚠️  Prisma connection failed, but PostgreSQL works."
        echo "💡 Try running: npx prisma db push"
    fi
else
    echo "❌ Database connection still failing."
    echo "💡 Try manually:"
    echo "   sudo -u postgres psql -c \"ALTER USER postgres PASSWORD '$DB_PASSWORD';\""
    echo "   sudo -u postgres psql -c \"CREATE DATABASE shadikart;\""
fi

unset PGPASSWORD
