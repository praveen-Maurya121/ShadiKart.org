# ShadiKart.org

A comprehensive wedding package platform that helps customers plan, customize, and manage their wedding bookings with AI-powered recommendations.

## 🎯 Features

- **Role-Based Access Control**: Support for Customers, Admins, and Zone Managers
- **AI-Powered Wedding Planner**: Get personalized package recommendations
- **Package Management**: Browse and customize wedding packages
- **Booking Management**: Complete booking lifecycle management
- **Guest Management**: Digital invites with RSVP tracking
- **Live Chat**: Real-time communication with zone managers
- **Payment Processing**: Integrated payment gateway (demo mode)
- **Rating System**: Post-event feedback and ratings
- **Issue Tracking**: Customer support ticket system

## 🚀 Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL (production)
- **ORM**: Prisma
- **Authentication**: NextAuth.js (JWT)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui
- **Validation**: Zod
- **Animations**: Framer Motion

## 📦 Installation

1. Clone the repository:
```bash
git clone https://github.com/praveen-Maurya121/ShadiKart.org.git
cd ShadiKart.org
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Update .env with your configuration
```

4. Set up the database:
```bash
npx prisma generate
npx prisma db push
npm run db:seed
```

5. Run the development server:
```bash
npm run dev
```

6. Open [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Setup

```bash
# Generate Prisma Client
npx prisma generate

# Push schema to database
npx prisma db push

# Seed the database
npm run db:seed

# Create admin user
npm run db:create-admin

# Create zone manager
npm run db:create-zone-manager
```

## 👥 User Roles

### Customer
- Browse packages
- Use AI planner
- Create and manage bookings
- Manage guests and invites
- Chat with zone managers
- Rate completed events

### Admin
- Full system management
- Manage packages, cities, zones
- Assign zone managers
- Handle all bookings
- Manage issues and support

### Zone Manager
- Manage bookings in assigned zones
- Update booking stages
- Handle customer issues
- Upload media and live streams
- Communicate with customers

## 📁 Project Structure

```
Shadikart/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel
│   ├── ops/               # Zone manager panel
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── bookings/          # Booking management
│   ├── packages/          # Package browsing
│   └── planner/           # AI planner
├── components/            # React components
├── lib/                   # Utilities and helpers
├── prisma/                # Database schema
└── public/                # Static assets
```

## 🔐 Environment Variables

```env
DATABASE_URL="file:./dev.db"
NEXTAUTH_SECRET="your-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:seed` - Seed database
- `npm run db:reset` - Reset database
- `npm run db:create-admin` - Create admin user
- `npm run db:create-zone-manager` - Create zone manager

## 🎨 Design System

- **Primary Color**: Warm Yellow (#FDC700)
- **Typography**: Inter + Playfair Display
- **Theme**: Premium, celebratory, wedding-focused
- **Components**: shadcn/ui with custom styling

## 📄 License

This project is private and proprietary.

## 👨‍💻 Author

Praveen Maurya

## 🔗 Links

- Repository: [https://github.com/praveen-Maurya121/ShadiKart.org](https://github.com/praveen-Maurya121/ShadiKart.org)

