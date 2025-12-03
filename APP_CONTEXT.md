# Shadikart - Complete Application Context

## 📋 Project Overview

**Shadikart** is a wedding package platform that helps customers plan, customize, and manage their wedding bookings. The current version is a **User App (MVP)** that allows customers to browse packages, use an AI planner, create bookings, manage guests, and track their wedding journey.

### Business Model
- **5 Package Categories**: Ultra High, Upper Middle Premium, Upper Middle Standard, Lower Middle, Mass
- **City-based Pricing**: Different prices for METRO, TIER2, and TIER3 cities
- **Customizable Packages**: Base packages + add-ons
- **Zone Management**: Assignments to zone managers for coordination

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL-ready
- **ORM**: Prisma
- **Authentication**: NextAuth.js (JWT)
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui (Radix UI)
- **Validation**: Zod
- **Password Hashing**: bcryptjs

### Project Structure
```
Shadikart/
├── app/                          # Next.js App Router
│   ├── api/                      # API Routes
│   │   ├── auth/                 # Authentication
│   │   │   ├── [...nextauth]/    # NextAuth endpoints
│   │   │   └── register/         # User registration
│   │   ├── packages/             # Package browsing
│   │   ├── planner/              # AI planner
│   │   ├── bookings/             # Booking management
│   │   ├── ratings/              # Rating system
│   │   ├── invite/               # Digital invites
│   │   ├── cities/               # City data
│   │   └── addons/               # Add-on data
│   ├── auth/                     # Auth pages
│   │   ├── login/                # Login page
│   │   └── register/             # Registration page
│   ├── packages/                 # Package pages
│   │   ├── page.tsx              # Package list
│   │   └── [id]/                 # Package details
│   ├── planner/                  # AI Planner
│   │   └── page.tsx              # Planner form & results
│   ├── bookings/                 # Booking management
│   │   ├── page.tsx              # Booking list
│   │   └── [id]/                 # Booking details
│   │       ├── page.tsx          # Main booking page with tabs
│   │       └── rate/              # Rating page
│   ├── invite/                   # Public invite pages
│   │   └── [token]/              # RSVP page
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Landing page
│   ├── providers.tsx             # NextAuth provider
│   └── globals.css               # Global styles
├── components/                    # React Components
│   ├── ui/                       # Reusable UI components
│   │   ├── button.tsx
│   │   ├── card.tsx
│   │   ├── input.tsx
│   │   ├── label.tsx
│   │   ├── select.tsx
│   │   └── tabs.tsx
│   ├── navbar.tsx                # Navigation bar
│   ├── booking-summary.tsx       # Booking summary tab
│   ├── booking-customize.tsx     # Add-ons customization
│   ├── booking-guests.tsx        # Guest management
│   ├── booking-timeline.tsx      # Timeline visualization
│   ├── booking-chat.tsx          # Chat interface
│   ├── booking-media.tsx         # Media gallery
│   └── booking-payment.tsx       # Payment interface
├── lib/                          # Utilities & Services
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth helpers
│   ├── planner.ts                # AI planner logic
│   └── utils.ts                  # Utility functions
├── prisma/                       # Database
│   ├── schema.prisma             # Database schema
│   ├── seed.ts                   # Seed data
│   ├── delete-users.ts           # Delete users script
│   ├── reset-db.ts               # Reset database script
│   └── dev.db                    # SQLite database
└── types/                        # TypeScript types
    └── next-auth.d.ts            # NextAuth type extensions
```

---

## 🗄️ Database Schema

### Models Overview

#### Core Models

**User**
- Customer accounts
- Fields: id, name, email, phone, passwordHash
- Relations: bookings, ratings

**City**
- City information
- Fields: id, name, state, type (METRO/TIER2/TIER3)
- Relations: bookings

**PackageCategory**
- 5 package tiers
- Fields: id, name, description, basePriceMetro/Tier2/Tier3, guest ranges
- Relations: presets, bookings

**PackagePreset**
- Specific package configurations per city type
- Fields: id, packageCategoryId, cityType, includedServices (JSON string), basePrice
- Relations: packageCategory, bookings

**AddOn**
- Customizable add-ons
- Fields: id, name, description, priceType (PER_EVENT/FIXED/PER_GUEST), basePrice, isActive
- Relations: bookingAddOns

#### Booking Models

**Booking**
- Main booking entity
- Fields: id, userId, packageCategoryId, packagePresetId, cityId, eventDate, guestCount, totalPrice, status (DRAFT/PENDING_PAYMENT/CONFIRMED/IN_PROGRESS/COMPLETED/CANCELLED), currentStage (PLANNING/PRE_EVENT/EVENT_DAY/POST_EVENT), aiRecommendationSummary
- Relations: user, packageCategory, packagePreset, city, addOns, guests, liveStreams, mediaAssets, ratings, zoneAssignments, chatMessages

**BookingAddOn**
- Many-to-many: Booking ↔ AddOn
- Fields: id, bookingId, addOnId, quantity, price

**Guest**
- Guest management
- Fields: id, bookingId, name, phone, email, status (INVITED/CONFIRMED/DECLINED/ATTENDED), inviteToken (unique)
- Relations: booking

**LiveStream**
- Live streaming links
- Fields: id, bookingId, platform (YOUTUBE/ZOOM/INSTAGRAM/OTHER), url, isActive
- Relations: booking

**MediaAsset**
- Post-event media
- Fields: id, bookingId, url, type (PHOTO/VIDEO/OTHER), label
- Relations: booking

**Rating**
- Customer ratings
- Fields: id, bookingId (unique), userId, overallScore (1-5), foodScore, decorScore, experienceScore, comments
- Relations: booking, user

#### Management Models

**Zone**
- Zone definitions
- Fields: id, name, description
- Relations: assignments

**ZoneAssignment**
- Booking-zone assignments
- Fields: id, bookingId, zoneId, status (PENDING/ASSIGNED/COMPLETED)
- Relations: booking, zone

**ChatMessage**
- Chat between users and zone managers
- Fields: id, bookingId, senderId (nullable), senderType (USER/ZONE_MANAGER), message, createdAt
- Relations: booking

### Database Notes
- **SQLite-compatible**: All enums converted to String types
- **JSON Storage**: `includedServices` stored as JSON string (parsed in application layer)
- **Foreign Keys**: Proper cascade deletes configured

---

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
  - Body: { email, password, name, phone? }
  - Returns: { id, email, name }

- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints
  - Handles login, session, CSRF

### Packages
- `GET /api/packages` - List packages
  - Query params: cityType?, guestCount?, budgetMin?, budgetMax?
  - Returns: PackageCategory[] with presets

- `GET /api/packages/[id]` - Package details
  - Returns: PackageCategory with all presets

### Planner
- `POST /api/planner` - AI planner recommendation
  - Body: { cityId, cityType, guestCount, budgetMin, budgetMax, weddingDate, preference }
  - Returns: PlanningResult with recommended package, preset, add-ons, estimated price

### Bookings
- `GET /api/bookings` - List user's bookings (authenticated)
  - Returns: Booking[] with relations

- `POST /api/bookings` - Create booking (authenticated)
  - Body: { packageCategoryId, packagePresetId?, cityId, eventDate, guestCount, totalPrice, aiRecommendationSummary? }
  - Returns: Created booking

- `GET /api/bookings/[id]` - Booking details (authenticated, owner only)
  - Returns: Booking with all relations

- `PUT /api/bookings/[id]/addons` - Update add-ons (authenticated, owner only)
  - Body: { addOnIds: string[] }
  - Returns: Updated booking

- `GET /api/bookings/[id]/guests` - List guests (authenticated, owner only)
  - Returns: Guest[]

- `POST /api/bookings/[id]/guests` - Add guest (authenticated, owner only)
  - Body: { name, phone?, email? }
  - Returns: Created guest with inviteToken

- `GET /api/bookings/[id]/chat` - Get messages (authenticated, owner only)
  - Returns: ChatMessage[]

- `POST /api/bookings/[id]/chat` - Send message (authenticated, owner only)
  - Body: { message }
  - Returns: Created message

- `POST /api/bookings/[id]/payment` - Process payment (authenticated, owner only)
  - Returns: { success, booking, message }

### Invites
- `GET /api/invite/[token]` - Get invite details (public)
  - Returns: Guest with booking details

- `PUT /api/invite/[token]` - Update RSVP (public)
  - Body: { status: "CONFIRMED" | "DECLINED" }
  - Returns: Updated guest

### Ratings
- `POST /api/ratings` - Submit rating (authenticated)
  - Body: { bookingId, overallScore, foodScore?, decorScore?, experienceScore?, comments? }
  - Returns: Created rating

### Utilities
- `GET /api/cities` - List all cities
- `GET /api/addons` - List active add-ons

---

## 📄 Pages & Routes

### Public Routes
- `/` - Landing page
  - Features: Package overview, CTAs to planner/browse
  - Components: Navbar, package cards

- `/invite/[token]` - Digital invite page (public)
  - Features: RSVP functionality, booking details
  - No authentication required

### Authentication Routes
- `/auth/login` - Login page
  - Features: Email/password login, redirect to bookings
  - Uses NextAuth signIn

- `/auth/register` - Registration page
  - Features: User registration, redirect to login
  - Validates: email, password (min 6), name (min 2)

### Protected Routes (User)
- `/packages` - Package browsing
  - Features: List all packages, filter by city/guest/budget
  - Shows: Price ranges, guest ranges, descriptions

- `/packages/[id]` - Package details
  - Features: Full package info, included services, pricing by city type
  - Actions: Start planning, use AI planner

- `/planner` - AI Wedding Planner
  - Features: Form inputs (city, guests, budget, date, preference)
  - Output: Recommended package, preset, add-ons, estimated price
  - Actions: Create booking draft

- `/bookings` - Booking list
  - Features: All user bookings, status badges, event dates
  - Actions: View details, create new booking

- `/bookings/[id]` - Booking details (tabs)
  - **Summary Tab**: Booking overview, included services, add-ons, total price, zone assignment, live streams
  - **Customize Tab**: Add/remove add-ons, update total price
  - **Guests Tab**: Add guests, generate invite links, track RSVP status
  - **Timeline Tab**: Visual progress (PLANNING → PRE_EVENT → EVENT_DAY → POST_EVENT)
  - **Chat Tab**: Messaging with zone manager (polling-based)
  - **Media Tab**: Post-event photos/videos gallery
  - **Payment**: Payment interface (demo)

- `/bookings/[id]/rate` - Rating page
  - Features: Rate completed bookings (overall, food, decor, experience)
  - Only available for COMPLETED bookings

---

## 🧩 Components

### UI Components (shadcn/ui)
- `Button` - Primary, secondary, outline, ghost variants
- `Card` - Container with header, content, footer
- `Input` - Text input with validation styling
- `Label` - Form labels
- `Select` - Dropdown select
- `Tabs` - Tab navigation

### Custom Components
- `Navbar` - Navigation with auth state
- `BookingSummary` - Booking overview display
- `BookingCustomize` - Add-on selection interface
- `BookingGuests` - Guest management with invite links
- `BookingTimeline` - Visual timeline with stages
- `BookingChat` - Chat interface (polling every 3s)
- `BookingMedia` - Media gallery (photos/videos)
- `BookingPayment` - Payment interface (demo)

---

## 🧠 Business Logic

### AI Planner (`lib/planner.ts`)

**Input**: City type, guest count, budget range, wedding date, style preference

**Process**:
1. Get all package categories
2. Calculate base price based on city type
3. Match budget to appropriate category
4. Select preset for category + city type
5. Calculate estimated price:
   - Base price × guest factor × style multiplier
6. Suggest add-ons based on preference and category
7. Generate summary text

**Output**: Recommended category, preset, estimated price, suggested add-ons, summary

**Price Calculation**:
- Base price from category (city-type specific)
- Guest factor: `guestCount / defaultGuestRangeMin`
- Style multiplier: Traditional (1.0), Trendy (1.15), Fusion (1.1), Minimal (0.95)

### Add-On Pricing
- **PER_EVENT**: Fixed price per event
- **PER_GUEST**: Price × guest count
- **FIXED**: Fixed price

### Booking Status Flow
1. **DRAFT** - Created from planner, not paid
2. **PENDING_PAYMENT** - Payment initiated
3. **CONFIRMED** - Payment successful
4. **IN_PROGRESS** - Event in progress
5. **COMPLETED** - Event finished
6. **CANCELLED** - Booking cancelled

### Booking Stages
1. **PLANNING** - Initial planning and customization
2. **PRE_EVENT** - Final preparations
3. **EVENT_DAY** - Wedding day
4. **POST_EVENT** - Media delivery and feedback

---

## 🎨 Design System

### Color Scheme (Yellow)
- Primary: `#fdc700` (yellow-400)
- Primary Dark: `#f0b100` (yellow-500)
- Primary Light: `#fff085` (yellow-200)
- Primary Darkest: `#432004` (yellow-950)

### Typography
- Font: Inter (Google Fonts)
- Headings: Bold, large sizes
- Body: Regular weight

### Layout
- Container: Max width with padding
- Cards: Rounded borders, shadows
- Responsive: Mobile-first, grid layouts

---

## 🔐 Authentication Flow

1. **Registration**:
   - User submits email, password, name, phone
   - Password hashed with bcryptjs (12 rounds)
   - User created in database
   - Redirect to login

2. **Login**:
   - User submits email/password
   - NextAuth verifies credentials
   - JWT session created
   - Redirect to `/bookings`

3. **Session Management**:
   - JWT stored in cookies
   - Session includes: id, email, name
   - Protected routes check session

---

## 📊 Current Features Status

### ✅ Implemented
- User registration and login
- Package browsing with filters
- AI planner with recommendations
- Booking creation and management
- Add-on customization
- Guest management with invite links
- Digital invite pages with RSVP
- Timeline visualization
- Chat interface (polling-based)
- Payment flow (demo)
- Media gallery display
- Rating system
- Zone assignment display

### ⚠️ Limitations / Placeholders
- **Payment**: Demo only, needs Razorpay/Stripe/UPI integration
- **Chat**: Polling-based (3s interval), not real-time WebSocket
- **Media Upload**: Display only, no upload interface (admin/zone manager needed)
- **Zone Manager Actions**: Simulated, no actual zone manager login
- **Live Stream**: Display only, no creation interface
- **Timeline Updates**: Static, needs admin/zone manager updates
- **Email Notifications**: Not implemented
- **File Uploads**: Not implemented

---

## 🗂️ Seed Data

### Cities
- Mumbai (METRO)
- Delhi (METRO)
- Pune (TIER2)

### Package Categories
1. Ultra High (₹20L-₹12L base)
2. Upper Middle Premium (₹12L-₹7L base)
3. Upper Middle Standard (₹8L-₹5L base)
4. Lower Middle (₹5L-₹3L base)
5. Mass (₹3L-₹2L base)

### Package Presets
- Ultra High Metro preset
- Upper Middle Premium Metro preset

### Add-Ons
- Drone Photography (₹50k, PER_EVENT)
- Extra Catering Counter (₹30k, PER_EVENT)
- Live Band Performance (₹80k, PER_EVENT)
- Premium Bar Setup (₹500, PER_GUEST)
- Fireworks Display (₹1L, PER_EVENT)

### Zones
- Mumbai Zone
- Delhi Zone
- Pune Zone

---

## 🛠️ Development Scripts

```bash
npm run dev              # Start development server
npm run build           # Build for production
npm run start           # Start production server
npm run lint            # Run ESLint

# Database
npm run db:push         # Push schema to database
npm run db:migrate      # Create migration
npm run db:studio       # Open Prisma Studio
npm run db:seed         # Seed database
npm run db:delete-users # Delete all users
npm run db:reset        # Reset entire database
```

---

## 🔄 Data Flow Examples

### Creating a Booking
1. User fills planner form
2. POST `/api/planner` → AI recommendation
3. User selects add-ons
4. POST `/api/bookings` → Booking created (DRAFT)
5. User customizes add-ons
6. PUT `/api/bookings/[id]/addons` → Add-ons updated, price recalculated
7. POST `/api/bookings/[id]/payment` → Status → PENDING_PAYMENT/CONFIRMED

### Guest Management
1. User adds guest
2. POST `/api/bookings/[id]/guests` → Guest created with inviteToken
3. User shares invite link: `/invite/[token]`
4. Guest visits link → GET `/api/invite/[token]`
5. Guest RSVPs → PUT `/api/invite/[token]` → Status updated

### Chat Flow
1. User sends message
2. POST `/api/bookings/[id]/chat` → Message saved (senderType: USER)
3. Frontend polls GET `/api/bookings/[id]/chat` every 3s
4. Zone manager messages (future) → senderType: ZONE_MANAGER

---

## 🚀 Ready for Enhancement

### Areas for Improvement
1. **Payment Integration**: Razorpay/Stripe/UPI gateway
2. **Real-time Chat**: WebSocket implementation
3. **File Uploads**: Image/video upload for media
4. **Email System**: Invite emails, notifications
5. **Admin Panel**: Package management, zone assignments
6. **Vendor App**: Zone manager interface
7. **Analytics**: Booking analytics, revenue tracking
8. **Search**: Advanced package search
9. **Reviews**: Public review display
10. **Notifications**: In-app notifications
11. **Calendar**: Event calendar view
12. **Documents**: Contract generation, PDFs
13. **Multi-language**: i18n support
14. **Mobile App**: React Native version

### Technical Improvements
1. **Caching**: Redis for sessions, API responses
2. **Rate Limiting**: API rate limiting
3. **Error Tracking**: Sentry integration
4. **Logging**: Structured logging
5. **Testing**: Unit tests, E2E tests
6. **CI/CD**: Automated deployment
7. **Monitoring**: Performance monitoring
8. **Database**: Migrate to PostgreSQL for production

---

## 📝 Environment Variables

```env
DATABASE_URL="file:./dev.db"              # SQLite (dev) or PostgreSQL (prod)
NEXTAUTH_URL="http://localhost:3000"      # App URL
NEXTAUTH_SECRET="your-secret-key-here"    # JWT secret (change in production)
NODE_ENV="development"                    # Environment
```

---

## 🎯 Current User Journey

1. **Landing** → Browse packages or use planner
2. **Planner** → Get AI recommendation
3. **Create Booking** → Booking in DRAFT status
4. **Customize** → Add/remove add-ons
5. **Add Guests** → Generate invite links
6. **Payment** → Pay (demo) → Status: CONFIRMED
7. **Track** → View timeline, chat with zone manager
8. **Event Day** → View live streams
9. **Post-Event** → View media, submit rating

---

This document provides complete context of the Shadikart application. Use it to identify areas for improvement and plan new features!

