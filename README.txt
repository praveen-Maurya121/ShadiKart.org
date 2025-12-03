SHADIKART - WEDDING PACKAGE PLATFORM
=====================================

QUICK START:
------------
1. Install dependencies:
   npm install

2. Set up environment variables:
   Copy .env.example to .env and update:
   - DATABASE_URL (SQLite for dev: "file:./dev.db")
   - NEXTAUTH_SECRET (generate a random string)
   - NEXTAUTH_URL (http://localhost:3000 for dev)

3. Set up database:
   npx prisma generate
   npx prisma db push
   npm run db:seed

4. Run development server:
   npm run dev

5. Open http://localhost:3000

PROJECT STRUCTURE:
------------------
app/
  (public)/          - Public pages (landing)
  (auth)/            - Authentication pages
  (user)/            - User-protected pages
  api/               - API routes
  bookings/          - Booking management
  packages/          - Package browsing
  planner/           - AI planner

components/          - React components
lib/                 - Utilities and services
prisma/              - Database schema and migrations

KEY FEATURES:
-------------
- User authentication (NextAuth)
- Package browsing and filtering
- AI-powered wedding planner
- Booking management with customization
- Guest management and digital invites
- Live chat with zone managers
- Payment processing (demo)
- Media gallery post-event
- Rating system

TECH STACK:
-----------
- Next.js 14 (App Router)
- TypeScript
- Prisma ORM
- SQLite (dev) / PostgreSQL (production)
- NextAuth
- Tailwind CSS
- Zod validation

