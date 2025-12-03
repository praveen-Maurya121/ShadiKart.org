# Adding Test Users on EC2

This guide shows you how to add test users (Customer, Admin, and Zone Manager) to your EC2 instance.

## Quick Method (Recommended)

Run this single command on your EC2 instance:

```bash
cd ~/ShadiKart.org && npm run db:create-test-users
```

This will create:
- **Customer**: customer@shadikart.com / customer123 → redirects to `/bookings`
- **Admin**: admin@shadikart.com / admin123 → redirects to `/admin`
- **Zone Manager**: manager1@shadikart.com / manager123 → redirects to `/ops`

## Step-by-Step Instructions

### 1. Connect to your EC2 instance

```bash
ssh -i your-key.pem ubuntu@YOUR_EC2_PUBLIC_IP
```

### 2. Navigate to the project directory

```bash
cd ~/ShadiKart.org
```

### 3. Run the test users creation script

```bash
npm run db:create-test-users
```

### 4. Verify the users were created

The script will output confirmation messages for each user created.

## Alternative: Manual Creation

If you prefer to create users individually:

### Create Customer

```bash
npm run db:create-admin customer@shadikart.com customer123 "Test Customer" CUSTOMER
```

### Create Admin

```bash
npm run db:create-admin admin@shadikart.com admin123 "Admin User" ADMIN
```

### Create Zone Manager

First, check if a zone exists:

```bash
npx prisma studio
# Or check zones in the database
```

Then create the zone manager (replace `ZONE_ID` with an actual zone ID):

```bash
npm run db:create-zone-manager manager1@shadikart.com manager123 "Zone Manager 1" ZONE_ID
```

## Test Users Summary

| Role | Email | Password | Redirects To |
|------|-------|----------|--------------|
| Customer | customer@shadikart.com | customer123 | `/bookings` |
| Admin | admin@shadikart.com | admin123 | `/admin` |
| Zone Manager | manager1@shadikart.com | manager123 | `/ops` |

## Troubleshooting

### Error: "No zone found"

The script will automatically create a default zone if none exists. This is normal.

### Error: "Database connection failed"

Make sure:
1. PostgreSQL is running: `sudo systemctl status postgresql`
2. Your `.env` file has the correct `DATABASE_URL`
3. The database exists: `sudo -u postgres psql -d shadikart -c "SELECT 1;"`

### Users already exist

The script will update existing users with the new passwords and roles, so it's safe to run multiple times.

## Verify Users in Database

You can verify users were created using Prisma Studio:

```bash
npm run db:studio
```

This will open a web interface at `http://localhost:5555` where you can view and edit database records.

## Next Steps

After creating test users:
1. Access your app at `http://YOUR_EC2_PUBLIC_IP`
2. Go to `/auth/login`
3. Test login with each user type
4. Verify redirects work correctly
