#!/bin/bash

# PostgreSQL Setup Script for Shadikart
# Run this script to set up PostgreSQL database for production

set -e

echo "🗄️  Setting up PostgreSQL database for Shadikart..."

# Check if running as root
if [ "$EUID" -eq 0 ]; then 
   echo "❌ Please do not run as root"
   exit 1
fi

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "❌ PostgreSQL is not installed. Please install it first:"
    echo "   sudo apt update && sudo apt install -y postgresql postgresql-contrib"
    exit 1
fi

# Prompt for database password
read -sp "Enter PostgreSQL password for 'postgres' user: " POSTGRES_PASSWORD
echo ""

# Create database and user
sudo -u postgres psql << EOF
-- Create database
CREATE DATABASE shadikart;

-- Create user (if not exists)
DO \$\$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_user WHERE usename = 'shadikart') THEN
        CREATE USER shadikart WITH PASSWORD '$POSTGRES_PASSWORD';
    END IF;
END
\$\$;

-- Grant privileges
GRANT ALL PRIVILEGES ON DATABASE shadikart TO shadikart;
ALTER DATABASE shadikart OWNER TO shadikart;
EOF

echo "✅ PostgreSQL database 'shadikart' created successfully!"
echo ""
echo "📝 Update your .env file with:"
echo "   DATABASE_URL=\"postgresql://shadikart:$POSTGRES_PASSWORD@localhost:5432/shadikart?schema=public\""
