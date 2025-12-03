# Shadikart - Complete Application Context (v2.0)

## 📋 Project Overview

**Shadikart** is a comprehensive wedding package platform with **role-based access control** supporting three user types:
- **Customers** - Browse packages, plan weddings, manage bookings
- **Admins** - Full system management and oversight
- **Zone Managers** - Manage bookings and operations in assigned zones

The platform now includes a complete admin panel and zone operations panel for managing the entire wedding booking lifecycle.

### Business Model
- **5 Package Categories**: Ultra High, Upper Middle Premium, Upper Middle Standard, Lower Middle, Mass
- **City-based Pricing**: Different prices for METRO, TIER2, and TIER3 cities
- **Customizable Packages**: Base packages + add-ons
- **Zone Management**: Assignments to zone managers for coordination
- **Issue Tracking**: Support ticket system for customer issues

---

## 🏗️ Architecture

### Tech Stack
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Database**: SQLite (dev) / PostgreSQL-ready
- **ORM**: Prisma
- **Authentication**: NextAuth.js (JWT) with RBAC
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
│   │   ├── packages/             # Package browsing
│   │   ├── planner/              # AI planner
│   │   ├── bookings/             # Booking management (customer)
│   │   ├── admin/                # Admin API routes
│   │   ├── ops/                  # Zone manager API routes
│   │   ├── issues/               # Issue reporting
│   │   ├── ratings/              # Rating system
│   │   ├── invite/               # Digital invites
│   │   ├── cities/               # City data
│   │   └── addons/               # Add-on data
│   ├── admin/                    # Admin Panel
│   │   ├── layout.tsx            # Admin sidebar
│   │   ├── page.tsx              # Admin dashboard
│   │   ├── bookings/             # Booking management
│   │   ├── packages/             # Package CRUD
│   │   ├── locations/            # Cities & Zones
│   │   ├── planner-config/       # AI planner config
│   │   └── issues/               # Issue management
│   ├── ops/                      # Zone Operations Panel
│   │   ├── layout.tsx            # Ops sidebar
│   │   ├── page.tsx              # Zone dashboard
│   │   ├── bookings/             # Zone bookings
│   │   └── issues/               # Zone issues
│   ├── auth/                     # Auth pages
│   ├── packages/                 # Package pages
│   ├── planner/                  # AI Planner
│   ├── bookings/                 # Booking management (customer)
│   └── invite/                   # Public invite pages
├── components/                    # React Components
│   ├── ui/                       # Reusable UI components
│   ├── navbar.tsx                # Navigation bar (role-aware)
│   ├── booking-*.tsx            # Booking-specific components
│   ├── admin-booking-actions.tsx # Admin booking controls
│   ├── ops-booking-actions.tsx   # Zone manager booking controls
│   └── report-issue.tsx          # Issue reporting
├── lib/                          # Utilities & Services
│   ├── db.ts                     # Prisma client
│   ├── auth.ts                   # Auth helpers
│   ├── auth-helpers.ts           # RBAC helpers (NEW)
│   ├── planner.ts                # AI planner logic (updated)
│   └── utils.ts                  # Utility functions
└── prisma/                       # Database
    ├── schema.prisma             # Database schema (updated)
    ├── seed.ts                   # Seed data
    └── create-*.ts               # User creation scripts
```

---

## 🗄️ Database Schema (Updated)

### Core Models

**User** (Updated)
- Customer accounts + Admin + Zone Managers
- Fields: id, name, email, phone, passwordHash, **role** (CUSTOMER | ADMIN | ZONE_MANAGER)
- Relations: bookings, ratings, zoneManagerProfile, reportedIssues, assignedIssues

**ZoneManagerProfile** (NEW)
- Links users to zones for zone managers
- Fields: id, userId (unique), zoneId, phone, isActive
- Relations: user, zone

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

### Booking Models

**Booking**
- Main booking entity
- Fields: id, userId, packageCategoryId, packagePresetId, cityId, eventDate, guestCount, totalPrice, status, currentStage, aiRecommendationSummary
- Relations: user, packageCategory, packagePreset, city, addOns, guests, liveStreams, mediaAssets, ratings, zoneAssignments, chatMessages, **issues** (NEW)

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

### Management Models

**Zone** (Updated)
- Zone definitions
- Fields: id, name, description
- Relations: assignments, **zoneManagerProfiles** (NEW)

**ZoneAssignment**
- Booking-zone assignments
- Fields: id, bookingId, zoneId, status (PENDING/ASSIGNED/COMPLETED)
- Relations: booking, zone

**ChatMessage** (Updated)
- Chat between users, zone managers, and admins
- Fields: id, bookingId, senderId (nullable), **senderType** (USER | ZONE_MANAGER | ADMIN), message, createdAt
- Relations: booking

**Issue** (NEW)
- Support ticket system
- Fields: id, bookingId, userId (reporter), zoneManagerId (assignee, nullable), title, description, status (OPEN | IN_PROGRESS | RESOLVED | CLOSED), priority (LOW | MEDIUM | HIGH)
- Relations: booking, reporter (User), assignee (User)

**PlannerConfig** (NEW)
- AI planner configuration
- Fields: id, key (unique), value (JSON string), scope (GLOBAL | CATEGORY | CITYTYPE), scopeId
- Used for: Style multipliers, guest factors, category thresholds

---

## 🔐 Role-Based Access Control (RBAC)

### Roles

1. **CUSTOMER** (Default)
   - Browse packages
   - Use AI planner
   - Create and manage bookings
   - Manage guests
   - Report issues
   - Rate completed bookings

2. **ADMIN**
   - Full system access
   - Manage all bookings
   - CRUD packages, cities, zones
   - Configure AI planner
   - Manage issues
   - Assign zones to bookings
   - View all analytics

3. **ZONE_MANAGER**
   - Access only bookings in assigned zone
   - Update booking stages
   - Add live streams and media
   - Chat with customers
   - View issues in their zone
   - Update issue status

### Authentication Flow

1. **Registration**: Creates user with role = "CUSTOMER"
2. **Login**: NextAuth verifies credentials and loads role + zone info
3. **Session**: JWT includes role, zoneManagerProfileId, zoneId
4. **Route Protection**: Server-side checks using `requireAdmin()`, `requireZoneManager()`, `requireUser()`

### Route Protection

- `/admin/**` → `requireAdmin()` - Only ADMIN role
- `/ops/**` → `requireZoneManager()` - Only ZONE_MANAGER with assigned zone
- `/bookings/**` → `requireUser()` - Authenticated users (customer checks ownership)
- `/packages`, `/planner` → Public (but personalized for logged-in users)

---

## 🔌 API Endpoints (Complete)

### Authentication
- `POST /api/auth/register` - Register new user (defaults to CUSTOMER)
- `GET/POST /api/auth/[...nextauth]` - NextAuth endpoints (includes role in session)

### Packages
- `GET /api/packages` - List packages (with filters)
- `GET /api/packages/[id]` - Package details

### Planner
- `POST /api/planner` - AI planner recommendation (reads from PlannerConfig)

### Bookings (Customer)
- `GET /api/bookings` - List user's bookings
- `POST /api/bookings` - Create booking
- `GET /api/bookings/[id]` - Booking details (owner only)
- `PUT /api/bookings/[id]/addons` - Update add-ons
- `GET/POST /api/bookings/[id]/guests` - Guest management
- `GET/POST /api/bookings/[id]/chat` - Chat messages
- `POST /api/bookings/[id]/payment` - Process payment

### Admin API Routes (NEW)
- `PUT /api/admin/bookings/[id]/status` - Update booking status
- `PUT /api/admin/bookings/[id]/stage` - Update booking stage
- `PUT /api/admin/bookings/[id]/zone` - Assign zone to booking
- `PUT /api/admin/issues/[id]` - Update issue (status, priority, assignee)

### Ops API Routes (NEW)
- `PUT /api/ops/bookings/[id]/stage` - Update booking stage (zone-scoped)
- `POST /api/ops/bookings/[id]/livestream` - Add live stream URL
- `POST /api/ops/bookings/[id]/media` - Add media asset
- `POST /api/ops/bookings/[id]/chat` - Send message as zone manager

### Issues (NEW)
- `POST /api/issues` - Create issue (customer)
- `PUT /api/admin/issues/[id]` - Update issue (admin)

### Invites
- `GET /api/invite/[token]` - Get invite details (public)
- `PUT /api/invite/[token]` - Update RSVP (public)

### Ratings
- `POST /api/ratings` - Submit rating

### Utilities
- `GET /api/cities` - List all cities
- `GET /api/addons` - List active add-ons

---

## 📄 Pages & Routes (Complete)

### Public Routes
- `/` - Landing page
- `/invite/[token]` - Digital invite page (public RSVP)

### Authentication Routes
- `/auth/login` - Login page
- `/auth/register` - Registration page

### Customer Routes
- `/packages` - Package browsing
- `/packages/[id]` - Package details
- `/planner` - AI Wedding Planner
- `/bookings` - Booking list
- `/bookings/[id]` - Booking details (tabs: Summary, Customize, Guests, Timeline, Chat, Media)
- `/bookings/[id]/rate` - Rating page

### Admin Routes (NEW)
- `/admin` - Admin dashboard
- `/admin/bookings` - All bookings management
- `/admin/bookings/[id]` - Booking details with admin actions
- `/admin/packages` - Package management
- `/admin/locations` - Cities & Zones management
- `/admin/planner-config` - AI planner configuration
- `/admin/issues` - Issue management

### Zone/Ops Routes (NEW)
- `/ops` - Zone dashboard
- `/ops/bookings` - Zone manager's bookings
- `/ops/bookings/[id]` - Booking details with zone actions
- `/ops/issues` - Issues in zone

---

## 🧩 Components (Complete)

### UI Components (shadcn/ui)
- `Button`, `Card`, `Input`, `Label`, `Select`, `Tabs`

### Custom Components

**Customer Components:**
- `Navbar` - Role-aware navigation
- `BookingSummary` - Booking overview
- `BookingCustomize` - Add-on selection
- `BookingGuests` - Guest management
- `BookingTimeline` - Visual timeline
- `BookingChat` - Chat interface
- `BookingMedia` - Media gallery
- `BookingPayment` - Payment interface
- `ReportIssue` - Issue reporting form

**Admin Components (NEW):**
- `AdminBookingActions` - Admin booking controls (status, stage, zone assignment)

**Ops Components (NEW):**
- `OpsBookingActions` - Zone manager booking controls (stage, livestream, media)

---

## 🧠 Business Logic

### AI Planner (`lib/planner.ts` - Updated)

**Input**: City type, guest count, budget range, wedding date, style preference

**Process**:
1. Get all package categories
2. Calculate base price based on city type
3. Match budget to appropriate category
4. Select preset for category + city type
5. Calculate estimated price:
   - Base price × guest factor × **guest factor multiplier (from config)** × **style multiplier (from config)**
6. Suggest add-ons based on preference and category
7. Generate summary text

**Configuration** (NEW):
- Reads from `PlannerConfig` model
- Style multipliers: Traditional, Trendy, Fusion, Minimal
- Guest factor multiplier
- Falls back to defaults if config not found

### Add-On Pricing
- **PER_EVENT**: Fixed price per event
- **PER_GUEST**: Price × guest count
- **FIXED**: Fixed price

### Booking Status Flow
1. **DRAFT** - Created from planner, not paid
2. **PENDING_PAYMENT** - Payment initiated
3. **CONFIRMED** - Payment successful (admin can change)
4. **IN_PROGRESS** - Event in progress (admin/zone manager can set)
5. **COMPLETED** - Event finished (admin/zone manager can set)
6. **CANCELLED** - Booking cancelled (admin can set)

### Booking Stages
1. **PLANNING** - Initial planning and customization
2. **PRE_EVENT** - Final preparations (zone manager can update)
3. **EVENT_DAY** - Wedding day (zone manager can update)
4. **POST_EVENT** - Media delivery and feedback (zone manager can update)

### Issue Workflow (NEW)
1. **Customer** reports issue from booking page
2. Issue created with status: **OPEN**
3. **Admin** can assign to zone manager
4. **Zone Manager** updates status: **IN_PROGRESS** → **RESOLVED**
5. **Admin** can close issue: **CLOSED**

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
- Sidebars: Admin and Ops panels use sidebar navigation

---

## 🔐 Authentication & Authorization

### Registration Flow
1. User submits email, password, name, phone
2. Password hashed with bcryptjs (12 rounds)
3. User created with role = "CUSTOMER"
4. Redirect to login

### Login Flow
1. User submits email/password
2. NextAuth verifies credentials
3. If ZONE_MANAGER, loads zoneManagerProfile
4. JWT session created with: id, email, name, role, zoneManagerProfileId, zoneId
5. Redirect based on role:
   - CUSTOMER → `/bookings`
   - ADMIN → `/admin`
   - ZONE_MANAGER → `/ops`

### Session Management
- JWT stored in cookies
- Session includes: id, email, name, role, zoneManagerProfileId, zoneId
- Protected routes check session and role

### Authorization Helpers (`lib/auth-helpers.ts`)

```typescript
getCurrentUser()              // Get current user with role
requireUser(role?)            // Require user, optional role check
requireAdmin()                // Require ADMIN role
requireZoneManager()          // Require ZONE_MANAGER with zone
```

---

## 📊 Current Features Status

### ✅ Implemented (Customer)
- User registration and login
- Package browsing with filters
- AI planner with recommendations (configurable)
- Booking creation and management
- Add-on customization
- Guest management with invite links
- Digital invite pages with RSVP
- Timeline visualization
- Chat interface (polling-based)
- Payment flow (demo)
- Media gallery display
- Rating system
- Issue reporting

### ✅ Implemented (Admin) - NEW
- Admin dashboard with analytics
- Booking management (view all, filter, update status/stage)
- Zone assignment to bookings
- Package management (view categories and presets)
- Cities & Zones management
- Zone manager assignment
- AI planner configuration
- Issue management (view, assign, update)

### ✅ Implemented (Zone Manager) - NEW
- Zone dashboard with assigned bookings stats
- My Bookings (filter by status/stage)
- Booking detail view
- Update booking stage
- Add live stream URLs
- Add media assets
- Chat with customers
- View issues in zone

### ⚠️ Limitations / Placeholders
- **Payment**: Demo only, needs Razorpay/Stripe/UPI integration
- **Chat**: Polling-based (3s interval), not real-time WebSocket
- **Media Upload**: URL-based only, no file upload interface
- **Package CRUD**: View-only in admin, needs create/edit forms
- **City/Zone CRUD**: View-only in admin, needs create/edit forms
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

# User Management (NEW)
npm run db:create-admin # Create/update admin user
npm run db:create-zone-manager # Create zone manager
```

### Creating Users

**Admin User:**
```bash
npm run db:create-admin <email> <password> <name> ADMIN
# Example: npm run db:create-admin admin@shadikart.com admin123 "Admin User" ADMIN
```

**Zone Manager:**
```bash
npm run db:create-zone-manager <email> <password> <name> <zoneId>
# Example: npm run db:create-zone-manager manager@shadikart.com manager123 "Zone Manager" zone-1
```

---

## 🔄 Data Flow Examples

### Creating a Booking (Customer)
1. User fills planner form
2. POST `/api/planner` → AI recommendation (reads config)
3. User selects add-ons
4. POST `/api/bookings` → Booking created (DRAFT)
5. User customizes add-ons
6. PUT `/api/bookings/[id]/addons` → Add-ons updated
7. POST `/api/bookings/[id]/payment` → Status → PENDING_PAYMENT/CONFIRMED

### Admin Managing Booking
1. Admin views `/admin/bookings`
2. Clicks booking → `/admin/bookings/[id]`
3. Admin assigns zone → PUT `/api/admin/bookings/[id]/zone`
4. Admin updates status → PUT `/api/admin/bookings/[id]/status`
5. Zone manager now sees booking in `/ops/bookings`

### Zone Manager Operations
1. Zone manager views `/ops/bookings`
2. Clicks booking → `/ops/bookings/[id]`
3. Updates stage → PUT `/api/ops/bookings/[id]/stage`
4. Adds live stream → POST `/api/ops/bookings/[id]/livestream`
5. Adds media → POST `/api/ops/bookings/[id]/media`
6. Sends chat message → POST `/api/ops/bookings/[id]/chat`
7. Customer sees updates in their booking view

### Issue Workflow
1. Customer reports issue → POST `/api/issues`
2. Issue created (status: OPEN)
3. Admin views `/admin/issues`
4. Admin assigns to zone manager → PUT `/api/admin/issues/[id]`
5. Zone manager views `/ops/issues`
6. Zone manager updates status → PUT `/api/admin/issues/[id]` (if allowed)
7. Issue resolved → Status: RESOLVED/CLOSED

---

## 🚀 Ready for Enhancement

### Areas for Improvement

**Payment Integration:**
- Razorpay/Stripe/UPI gateway integration
- Payment status tracking
- Refund handling

**Real-time Features:**
- WebSocket chat implementation
- Real-time booking updates
- Push notifications

**File Management:**
- Image/video upload for media
- Document uploads
- Cloud storage integration

**Communication:**
- Email notifications (invites, updates, reminders)
- SMS notifications
- In-app notifications

**Admin Enhancements:**
- Package CRUD forms (create/edit/delete)
- City/Zone CRUD forms
- Bulk operations
- Advanced analytics
- Export reports

**Zone Manager Enhancements:**
- Calendar view
- Task management
- Vendor coordination
- Document management

**Customer Enhancements:**
- Booking calendar view
- Reminder notifications
- Document downloads
- Payment history

**Technical Improvements:**
- Caching (Redis for sessions, API responses)
- Rate limiting
- Error tracking (Sentry)
- Structured logging
- Unit tests, E2E tests
- CI/CD pipeline
- Performance monitoring
- Database migration to PostgreSQL for production

---

## 📝 Environment Variables

```env
DATABASE_URL="file:./dev.db"              # SQLite (dev) or PostgreSQL (prod)
NEXTAUTH_URL="http://localhost:3000"      # App URL
NEXTAUTH_SECRET="your-secret-key-here"    # JWT secret (change in production)
NODE_ENV="development"                    # Environment
```

---

## 🎯 User Journeys

### Customer Journey
1. **Landing** → Browse packages or use planner
2. **Planner** → Get AI recommendation
3. **Create Booking** → Booking in DRAFT status
4. **Customize** → Add/remove add-ons
5. **Add Guests** → Generate invite links
6. **Payment** → Pay (demo) → Status: CONFIRMED
7. **Track** → View timeline, chat with zone manager
8. **Event Day** → View live streams
9. **Post-Event** → View media, submit rating
10. **Report Issue** → If needed, report from booking page

### Admin Journey
1. **Login** → Redirected to `/admin`
2. **Dashboard** → View stats and overview
3. **Bookings** → View all bookings, filter, assign zones
4. **Booking Detail** → Update status, stage, assign zone
5. **Packages** → View and manage packages
6. **Locations** → Manage cities, zones, zone managers
7. **Planner Config** → Configure AI planner parameters
8. **Issues** → View all issues, assign to zone managers

### Zone Manager Journey
1. **Login** → Redirected to `/ops`
2. **Dashboard** → View assigned bookings, upcoming events, issues
3. **My Bookings** → Filter by status/stage
4. **Booking Detail** → Update stage, add live streams, add media, chat
5. **Issues** → View issues in zone, update status

---

## 🔒 Security Considerations

### Implemented
- Password hashing (bcryptjs, 12 rounds)
- JWT-based sessions
- Role-based route protection
- Zone-scoped access for zone managers
- Owner-only access for customer bookings
- Input validation (Zod)

### Recommended for Production
- Rate limiting on API routes
- CSRF protection
- SQL injection prevention (Prisma handles this)
- XSS prevention (React escapes by default)
- Secure cookie settings
- HTTPS enforcement
- Environment variable security
- Database connection pooling
- Audit logging

---

## 📈 Analytics & Metrics

### Admin Dashboard Metrics
- Total bookings count
- Revenue estimate (sum of confirmed bookings)
- Upcoming events (next 10 days)
- Top cities by bookings
- Bookings by status breakdown
- Issues summary (open vs resolved)

### Zone Dashboard Metrics
- Assigned bookings count
- Bookings by stage breakdown
- Upcoming events for zone
- Open issues count
- In-progress bookings

---

## 🎓 Key Concepts

### Zone Assignment
- Bookings are assigned to zones
- Zone managers are assigned to zones
- Zone managers can only access bookings in their zone
- Admin can assign/reassign zones

### Booking Lifecycle
1. **Creation** (Customer) → DRAFT
2. **Customization** (Customer) → Add-ons, guests
3. **Payment** (Customer) → PENDING_PAYMENT → CONFIRMED
4. **Zone Assignment** (Admin) → Zone manager notified
5. **Planning** (Zone Manager) → PLANNING stage
6. **Pre-Event** (Zone Manager) → PRE_EVENT stage
7. **Event Day** (Zone Manager) → EVENT_DAY stage, live streams
8. **Post-Event** (Zone Manager) → POST_EVENT stage, media upload
9. **Rating** (Customer) → After COMPLETED status

### Issue Management
- Customers report issues from booking page
- Issues linked to specific bookings
- Admin can assign to zone managers
- Zone managers can update status
- Priority levels: LOW, MEDIUM, HIGH
- Status flow: OPEN → IN_PROGRESS → RESOLVED → CLOSED

### AI Planner Configuration
- Style multipliers configurable per preference
- Guest factor multiplier configurable
- Category thresholds can be configured
- Falls back to defaults if config missing
- Admin can update via `/admin/planner-config`

---

## 🔧 Migration Notes

### From v1.0 to v2.0

**Database Changes:**
- Added `role` field to `User` (default: "CUSTOMER")
- New models: `ZoneManagerProfile`, `Issue`, `PlannerConfig`
- Updated `ChatMessage.senderType` to include "ADMIN"
- Updated `Zone` to include `zoneManagerProfiles` relation
- Updated `Booking` to include `issues` relation

**Code Changes:**
- NextAuth config updated to include role
- New route protection utilities
- New admin and ops panels
- Updated planner to read from config
- Updated navbar to show role-based links

**Migration Steps:**
1. Run `npx prisma db push` to update schema
2. Run `npx prisma generate` to regenerate client
3. Create admin user: `npm run db:create-admin`
4. Create zone managers: `npm run db:create-zone-manager`
5. Test each role's access

---

## 📚 API Documentation Summary

### Authentication Required
- Most API routes require authentication
- Admin routes require ADMIN role
- Ops routes require ZONE_MANAGER role
- Customer routes require CUSTOMER role and ownership

### Response Formats
- Success: JSON object with data
- Error: JSON object with `error` and optional `details`
- Status codes: 200 (OK), 201 (Created), 400 (Bad Request), 401 (Unauthorized), 403 (Forbidden), 404 (Not Found), 500 (Server Error)

### Common Patterns
- GET routes: Return data
- POST routes: Create resource, return created resource
- PUT routes: Update resource, return updated resource
- DELETE routes: Delete resource, return success

---

This document provides complete context of the Shadikart application v2.0 with RBAC, Admin Panel, and Zone Operations Panel. Use it to understand the full system architecture and plan further enhancements!

