# Shadikart - Wedding Package Platform

A comprehensive wedding package management platform built with Next.js 14, featuring role-based access control for Customers, Admins, and Zone Managers.

## 🎯 Features

### Customer Features
- **Package Browsing**: Browse and filter wedding packages by city, guests, and budget
- **AI Wedding Planner**: Get personalized package recommendations
- **Booking Management**: Create, customize, and track wedding bookings
- **Guest Management**: Add guests and send digital invites with RSVP tracking
- **Live Chat**: Communicate with zone managers
- **Payment Processing**: Secure payment integration (demo mode)
- **Media Gallery**: View post-event photos and videos
- **Rating System**: Rate completed weddings

### Admin Features
- **Dashboard**: Overview of all bookings, revenue, and issues
- **Booking Management**: View, assign zones, and manage all bookings
- **Package Management**: Create and manage package categories and presets
- **Location Management**: Manage cities, zones, and zone manager assignments
- **Add-ons Management**: Create and manage add-on services
- **AI Planner Configuration**: Adjust planner parameters
- **Issue Management**: Track and resolve customer issues

### Zone Manager Features
- **Operations Dashboard**: View bookings and events in assigned zone
- **Booking Management**: Update booking stages and status
- **Issue Resolution**: Handle customer issues in their zone
- **Live Stream Management**: Add live stream links
- **Media Management**: Upload post-event media assets
- **Chat**: Communicate with customers

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production) or SQLite (for development)

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd Shadikart
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Create a `.env` file in the root directory:
   ```env
   DATABASE_URL="file:./prisma/dev.db"
   NEXTAUTH_SECRET="your-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   npm run db:seed
   ```

5. **Create admin user** (optional)
   ```bash
   npm run db:create-admin
   ```

6. **Create zone manager** (optional)
   ```bash
   npm run db:create-zone-manager
   ```

7. **Run the development server**
   ```bash
   npm run dev
   ```

8. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: Prisma ORM with SQLite (dev) / PostgreSQL (production)
- **Authentication**: NextAuth.js with JWT
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Validation**: Zod
- **Animations**: Framer Motion

## 📁 Project Structure

```
Shadikart/
├── app/                    # Next.js App Router
│   ├── admin/             # Admin panel pages
│   ├── ops/                # Zone manager panel pages
│   ├── api/                # API routes
│   ├── auth/               # Authentication pages
│   ├── bookings/           # Customer booking pages
│   ├── packages/           # Package browsing pages
│   └── planner/            # AI planner page
├── components/             # React components
│   ├── admin/              # Admin-specific components
│   ├── ops/                 # Zone manager components
│   └── ui/                  # shadcn/ui components
├── lib/                     # Utilities and services
├── prisma/                  # Database schema and migrations
└── public/                  # Static assets
```

## 🔐 User Roles

### Customer (CUSTOMER)
- Default role for registered users
- Access to booking management, planner, and packages

### Admin (ADMIN)
- Full system access
- Manage all bookings, packages, locations, and users
- Access: `/admin`

### Zone Manager (ZONE_MANAGER)
- Manage bookings in assigned zones
- Update booking stages and handle issues
- Access: `/ops`

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint
- `npm run db:push` - Push Prisma schema to database
- `npm run db:seed` - Seed database with sample data
- `npm run db:studio` - Open Prisma Studio
- `npm run db:reset` - Reset database
- `npm run db:create-admin` - Create admin user
- `npm run db:create-zone-manager` - Create zone manager

## 🎨 Design System

The app uses a warm, celebratory design system with:
- **Primary Color**: Yellow/Gold (#FDC700)
- **Typography**: Inter (body) + Playfair Display (headings)
- **Components**: Rounded corners, soft shadows, glassmorphism effects
- **Animations**: Smooth transitions and micro-interactions

## 🔄 Development Workflow

1. Make changes to your code
2. Test locally with `npm run dev`
3. Commit changes: `git add . && git commit -m "Your message"`
4. Push to repository: `git push origin main`

## 📦 Production Deployment

### Environment Variables for Production
```env
DATABASE_URL="postgresql://user:password@host:5432/dbname"
NEXTAUTH_SECRET="your-production-secret"
NEXTAUTH_URL="https://yourdomain.com"
```

### Deployment Options
- **Vercel**: Recommended for Next.js apps
- **Netlify**: Alternative deployment platform
- **Self-hosted**: Docker, PM2, or similar

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Support

For issues and questions, please contact the development team.

---

Built with ❤️ for making wedding planning easier

