# Database Setup Guide

## Supabase Setup

### 1. Create a new Supabase project
Go to [supabase.com](https://supabase.com) and create a new project.

### 2. Create the registrations table

Run the following SQL in the Supabase SQL Editor:

```sql
-- Create the registrations table
CREATE TABLE IF NOT EXISTS registrations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  full_name TEXT NOT NULL,
  phone_number TEXT NOT NULL,
  pg_name TEXT NOT NULL,
  pg_id TEXT NOT NULL,
  room_number TEXT,
  address TEXT NOT NULL,
  number_of_people INTEGER NOT NULL DEFAULT 1,
  landmark TEXT,
  additional_notes TEXT,
  request_id TEXT UNIQUE NOT NULL,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  date TEXT NOT NULL
);

-- Create indexes for faster queries
CREATE INDEX IF NOT EXISTS idx_registrations_phone ON registrations(phone_number);
CREATE INDEX IF NOT EXISTS idx_registrations_pg_id ON registrations(pg_id);
CREATE INDEX IF NOT EXISTS idx_registrations_date ON registrations(date);
CREATE INDEX IF NOT EXISTS idx_registrations_status ON registrations(status);

-- Enable Row Level Security (optional)
ALTER TABLE registrations ENABLE ROW LEVEL SECURITY;

-- Allow public inserts and reads (for demo purposes)
CREATE POLICY "Allow public insert" ON registrations
  FOR INSERT TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Allow public read" ON registrations
  FOR SELECT TO anon, authenticated
  USING (true);

CREATE POLICY "Allow authenticated update" ON registrations
  FOR UPDATE TO authenticated
  USING (true)
  WITH CHECK (true);
```

### 3. Get your credentials

Go to Project Settings > API to find:
- Project URL
- `anon` / `service_role` key

### 4. Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

---

## Firebase Alternative

If using Firebase, create a Firestore collection called `registrations` with the same fields.

---

## Deploy to Vercel

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables
4. Deploy!

---

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```
