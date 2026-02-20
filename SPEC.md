# Ramadan Sehri Coordination Portal - Specification

## 1. Project Overview

**Project Name:** Ramadan Sehri Coordination Portal  
**Type:** Full-stack Web Application (PWA-ready)  
**Core Functionality:** Islamic-themed web app for PG residents to register Sehri food requests, replacing WhatsApp spam with organized database-driven submissions  
**Target Users:** PG residents (seekers), Admin (coordinator)

---

## 2. UI/UX Specification

### 2.1 Layout Structure

**Pages:**
1. Landing Page (`/`) - Hero + CTA
2. Registration Page (`/register`) - PG selection + form
3. Success Page (`/success`) - Confirmation with request ID
4. Admin Dashboard (`/admin`) - Protected admin area
5. Admin Login (`/admin/login`)

**Responsive Breakpoints:**
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

### 2.2 Visual Design

**Color Palette:**
- `--bg-primary`: #0a1628 (Dark Navy)
- `--bg-secondary`: #111d32 (Slightly lighter navy)
- `--bg-card`: #162442 (Card background)
- `--primary`: #065f46 (Deep Emerald Green)
- `--primary-light`: #059669 (Light green)
- `--accent`: #d4a853 (Islamic Gold)
- `--accent-light`: #f0c95e (Bright gold)
- `--text-primary`: #f1f5f9 (Soft white)
- `--text-secondary`: #94a3b8 (Muted text)
- `--success`: #22c55e
- `--error`: #ef4444
- `--border`: rgba(212, 168, 83, 0.2)

**Typography:**
- Headings: "Amiri" (Arabic-style) + "Cinzel" for English
- Body: "Inter" / "DM Sans"
- Arabic text: "Amiri" or "Noto Naskh Arabic"

**Spacing System:**
- Base unit: 4px
- Section padding: 64px (desktop), 32px (mobile)
- Card padding: 24px
- Gap between cards: 16px

**Visual Effects:**
- Lantern glow animation (CSS)
- Crescent moon SVG
- Islamic geometric pattern overlay (CSS)
- Glass-morphism cards
- Subtle gold shimmer on hover

### 2.3 Components

**Landing Page:**
- Animated hero with floating lanterns
- Geometric pattern background
- Primary CTA button with glow

**PG Selection Cards:**
- 3-column grid (desktop), 2-column (tablet), 1-column (mobile)
- Card states: default, hover (glow), selected (gold border)
- "Others" card with special styling

**Form Components:**
- Floating label inputs
- Numeric stepper for people count
- Textarea with character count
- Validation error states
- Submit button with loading state

**Admin Dashboard:**
- Stats cards row
- Filterable data table
- PG-wise pie chart
- Search bar
- Export CSV button
- Date range picker

---

## 3. Functionality Specification

### 3.1 Core Features

**Registration Flow:**
1. User lands on homepage
2. Clicks "Register for Sehri"
3. Selects PG from grid (or "Others")
4. Fills form based on selection
5. Validates inputs
6. Prevents duplicate phone submission
7. Shows success modal with request ID
8. Stores in database with timestamp

**Admin Features:**
1. Login with password
2. View all submissions in table
3. Filter by PG name
4. Search by phone number
5. Filter by date
6. See total counts per PG
7. See total food required
8. Mark entries as delivered
9. Export to CSV

### 3.2 Data Handling

**Supabase/Firebase Schema:**

```typescript
// Table: registrations
interface Registration {
  id: string;              // UUID
  fullName: string;
  phoneNumber: string;     // 10 digits
  pgName: string;
  pgId: string;
  roomNumber?: string;
  address: string;
  numberOfPeople: number;
  landmark?: string;
  additionalNotes?: string;
  requestId: string;      // Generated unique ID
  status: 'pending' | 'delivered';
  createdAt: string;     // ISO timestamp
  date: string;          // YYYY-MM-DD for filtering
}
```

### 3.3 Edge Cases

- Duplicate phone number: Show warning, allow update
- Empty required fields: Show validation errors
- Network error: Show retry option
- After Sehri time: Disable submission, show countdown
- Invalid phone format: Real-time validation

---

## 4. Acceptance Criteria

### Visual Checkpoints:
- [x] Dark navy background with emerald green + gold accents
- [x] Crescent moon visible in hero
- [x] Lantern glow animation working
- [x] PG cards show hover glow effect
- [x] Selected card has gold border
- [x] Form inputs have floating labels
- [x] Success modal shows request ID
- [x] Admin dashboard has stats cards
- [x] Responsive on all breakpoints

### Functional Checkpoints:
- [x] Can select PG from grid
- [x] Form validates required fields
- [x] Phone number must be 10 digits
- [x] Number of people has stepper (+/-)
- [x] Duplicate submission blocked (logic ready)
- [x] Success modal appears after submit
- [x] Admin can view all submissions
- [x] Filter by PG works
- [x] Search by phone works
- [x] Export CSV downloads file

---

## 5. Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **Animations:** Framer Motion
- **Database:** Supabase (PostgreSQL)
- **Charts:** Recharts
- **Icons:** Lucide React
- **PWA:** next-pwa

---

## 6. File Structure

```
ramadan-sehri-portal/
├── app/
│   ├── layout.tsx
│   ├── page.tsx
│   ├── globals.css
│   ├── register/
│   │   └── page.tsx
│   ├── admin/
│   │   ├── page.tsx
│   │   └── login/
│   │       └── page.tsx
│   └── api/
│       ├── registrations/
│       │   └── route.ts
│       └── admin/
│           └── route.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   ├── Textarea.tsx
│   │   ├── Card.tsx
│   │   ├── Modal.tsx
│   │   ├── NumericStepper.tsx
│   │   └── index.ts
│   ├── landing/
│   │   ├── Hero.tsx
│   │   ├── CrescentMoon.tsx
│   │   ├── Lantern.tsx
│   │   └── index.ts
│   ├── registration/
│   │   ├── PGSelector.tsx
│   │   ├── RegistrationForm.tsx
│   │   ├── RegistrationSteps.tsx
│   │   ├── SuccessModal.tsx
│   │   └── index.ts
│   └── admin/
│       ├── StatsCard.tsx
│       ├── DataTable.tsx
│       ├── PGChart.tsx
│       ├── FilterBar.tsx
│       └── index.ts
├── lib/
│   ├── supabase.ts
│   ├── utils.ts
│   └── constants.ts
├── types/
│   └── index.ts
├── public/
├── tailwind.config.ts
├── next.config.js
├── package.json
└── tsconfig.json
```

---

## 7. Deployment Guide

### Prerequisites:
- Node.js 18+ 
- npm or yarn
- Supabase account (or Firebase)

### Setup Steps:

1. **Clone the repository**
2. **Install dependencies:** `npm install`
3. **Configure Supabase:**
   - Create a new Supabase project
   - Create table `registrations` with the schema
   - Get URL and anon key
   - Add to `.env.local`:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
     ```
4. **Run development:** `npm run dev`
5. **Build:** `npm run build`
6. **Deploy:** Deploy to Vercel, Netlify, or any Node.js hosting

### Admin Access:
- Default password: `ramadan2024` (change in `lib/constants.ts`)
