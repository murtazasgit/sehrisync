-- Run this in Supabase SQL Editor to fix RLS issues

-- First, disable RLS temporarily to test
ALTER TABLE entries DISABLE ROW LEVEL SECURITY;

-- Or if you want to keep RLS, use these policies:
ALTER TABLE entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies
DROP POLICY IF EXISTS "Allow public read" ON entries;
DROP POLICY IF EXISTS "Allow public insert" ON entries;
DROP POLICY IF EXISTS "Allow public update" ON entries;
DROP POLICY IF EXISTS "Allow public delete" ON entries;

-- Create permissive policies
CREATE POLICY "Allow all" ON entries FOR ALL USING (true) WITH CHECK (true);
