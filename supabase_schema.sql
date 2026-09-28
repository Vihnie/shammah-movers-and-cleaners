-- =====================================================================
-- SHAMMAH MOVERS & CLEANERS - SUPABASE BACKEND DDL & STORAGE SETUP
-- Run this script in your Supabase SQL Editor (https://app.supabase.com)
-- =====================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================================
-- 2. STORAGE BUCKETS CONFIGURATION
-- =====================================================================
-- Create public storage buckets for gallery photos, lead attachments, and documents
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
  ('gallery', 'gallery', true, 10485760, ARRAY['image/png', 'image/jpeg', 'image/webp', 'image/gif']),
  ('attachments', 'attachments', true, 20971520, NULL),
  ('documents', 'documents', true, 20971520, ARRAY['application/pdf', 'image/png', 'image/jpeg', 'text/plain'])
ON CONFLICT (id) DO UPDATE SET 
  public = EXCLUDED.public,
  file_size_limit = EXCLUDED.file_size_limit,
  allowed_mime_types = EXCLUDED.allowed_mime_types;

-- Storage RLS Policies
-- Allow anyone to read public files
CREATE POLICY "Public Read Access for Gallery"
ON storage.objects FOR SELECT
USING (bucket_id = 'gallery');

CREATE POLICY "Public Read Access for Attachments"
ON storage.objects FOR SELECT
USING (bucket_id = 'attachments');

CREATE POLICY "Public Read Access for Documents"
ON storage.objects FOR SELECT
USING (bucket_id = 'documents');

-- Allow uploads (anon and authenticated)
CREATE POLICY "Allow Public Upload to Gallery"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'gallery');

CREATE POLICY "Allow Public Upload to Attachments"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'attachments');

CREATE POLICY "Allow Public Upload to Documents"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'documents');

-- Allow deletes and updates for management
CREATE POLICY "Allow Manage Objects in Gallery"
ON storage.objects FOR ALL
USING (bucket_id = 'gallery');

CREATE POLICY "Allow Manage Objects in Attachments"
ON storage.objects FOR ALL
USING (bucket_id = 'attachments');

-- =====================================================================
-- 3. RELATIONAL TABLES
-- =====================================================================

-- SERVICES
CREATE TABLE IF NOT EXISTS public.services (
  id TEXT PRIMARY KEY,
  slug TEXT UNIQUE NOT NULL,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  short_desc TEXT,
  full_desc TEXT,
  starting_price NUMERIC DEFAULT 0,
  pricing_model TEXT DEFAULT 'STARTING_FROM',
  badge TEXT,
  icon TEXT,
  features JSONB DEFAULT '[]'::jsonb,
  active BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- LEADS
CREATE TABLE IF NOT EXISTS public.leads (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  service_type TEXT NOT NULL,
  moving_from TEXT NOT NULL,
  moving_to TEXT NOT NULL,
  move_date TEXT NOT NULL,
  preferred_time TEXT,
  property_type TEXT,
  house_size TEXT,
  floor TEXT,
  has_lift BOOLEAN DEFAULT false,
  parking_available BOOLEAN DEFAULT true,
  packing_required BOOLEAN DEFAULT false,
  unpacking_required BOOLEAN DEFAULT false,
  cleaning_required BOOLEAN DEFAULT false,
  fumigation_required BOOLEAN DEFAULT false,
  furniture_assembly BOOLEAN DEFAULT false,
  decluttering BOOLEAN DEFAULT false,
  estimated_volume TEXT,
  estimated_amount NUMERIC DEFAULT 0,
  message TEXT,
  attachments JSONB DEFAULT '[]'::jsonb,
  status TEXT DEFAULT 'NEW',
  assigned_staff TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- QUOTES
CREATE TABLE IF NOT EXISTS public.quotes (
  id TEXT PRIMARY KEY,
  quote_number TEXT NOT NULL,
  lead_id TEXT REFERENCES public.leads(id) ON DELETE SET NULL,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_type TEXT NOT NULL,
  moving_from TEXT,
  moving_to TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  distance_surcharge NUMERIC DEFAULT 0,
  discount NUMERIC DEFAULT 0,
  total_amount NUMERIC NOT NULL,
  status TEXT DEFAULT 'SENT',
  notes TEXT,
  terms TEXT,
  valid_until TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BOOKINGS
CREATE TABLE IF NOT EXISTS public.bookings (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  customer_phone TEXT NOT NULL,
  customer_email TEXT,
  service_type TEXT NOT NULL,
  tier TEXT NOT NULL,
  tier_name TEXT,
  move_date TEXT NOT NULL,
  time_slot TEXT,
  pickup_address TEXT NOT NULL,
  dropoff_address TEXT NOT NULL,
  pickup_access TEXT,
  dropoff_access TEXT,
  pricing JSONB DEFAULT '{}'::jsonb,
  calculator_state JSONB DEFAULT '{}'::jsonb,
  selected_inventory JSONB DEFAULT '[]'::jsonb,
  special_instructions TEXT,
  contact_via_whatsapp BOOLEAN DEFAULT true,
  payment_method TEXT,
  status TEXT DEFAULT 'confirmed',
  assigned_crew JSONB,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- CUSTOMERS
CREATE TABLE IF NOT EXISTS public.customers (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  email TEXT,
  address TEXT,
  previous_bookings INTEGER DEFAULT 0,
  previous_quotes INTEGER DEFAULT 0,
  total_spent NUMERIC DEFAULT 0,
  last_service TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- STAFF
CREATE TABLE IF NOT EXISTS public.staff (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  phone TEXT NOT NULL,
  role TEXT NOT NULL,
  team TEXT NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- TEAMS
CREATE TABLE IF NOT EXISTS public.teams (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  lead_name TEXT NOT NULL,
  members_count INTEGER DEFAULT 3,
  assigned_truck TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- VEHICLES
CREATE TABLE IF NOT EXISTS public.vehicles (
  id TEXT PRIMARY KEY,
  registration TEXT NOT NULL UNIQUE,
  type TEXT NOT NULL,
  capacity TEXT NOT NULL,
  status TEXT DEFAULT 'AVAILABLE',
  current_assignment TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- INVOICES
CREATE TABLE IF NOT EXISTS public.invoices (
  id TEXT PRIMARY KEY,
  invoice_number TEXT NOT NULL UNIQUE,
  booking_id TEXT,
  customer_name TEXT NOT NULL,
  customer_phone TEXT,
  customer_email TEXT,
  items JSONB DEFAULT '[]'::jsonb,
  subtotal NUMERIC NOT NULL,
  discount NUMERIC DEFAULT 0,
  additional_charges NUMERIC DEFAULT 0,
  total NUMERIC NOT NULL,
  paid_amount NUMERIC DEFAULT 0,
  balance_due NUMERIC DEFAULT 0,
  status TEXT DEFAULT 'SENT',
  payment_status TEXT DEFAULT 'UNPAID',
  due_date TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- PAYMENTS
CREATE TABLE IF NOT EXISTS public.payments (
  id TEXT PRIMARY KEY,
  booking_id TEXT,
  invoice_id TEXT,
  invoice_number TEXT,
  customer_name TEXT NOT NULL,
  amount NUMERIC NOT NULL,
  payment_method TEXT DEFAULT 'M-Pesa',
  transaction_reference TEXT,
  status TEXT DEFAULT 'COMPLETED',
  paid_at TIMESTAMPTZ DEFAULT now()
);

-- REVIEWS
CREATE TABLE IF NOT EXISTS public.reviews (
  id TEXT PRIMARY KEY,
  customer_name TEXT NOT NULL,
  rating INTEGER NOT NULL,
  comment TEXT NOT NULL,
  service TEXT NOT NULL,
  location TEXT,
  date TEXT,
  verified BOOLEAN DEFAULT true,
  approved BOOLEAN DEFAULT true,
  featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GALLERY
CREATE TABLE IF NOT EXISTS public.gallery (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  category TEXT NOT NULL,
  image_url TEXT NOT NULL,
  caption TEXT,
  is_before_after BOOLEAN DEFAULT false,
  before_url TEXT,
  after_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- FAQS
CREATE TABLE IF NOT EXISTS public.faqs (
  id TEXT PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- BUSINESS SETTINGS
CREATE TABLE IF NOT EXISTS public.business_settings (
  id TEXT PRIMARY KEY DEFAULT 'primary',
  company_name TEXT NOT NULL,
  tagline TEXT,
  phone TEXT NOT NULL,
  phone2 TEXT,
  whatsapp TEXT NOT NULL,
  email TEXT NOT NULL,
  email2 TEXT,
  support_email TEXT,
  physical_address TEXT,
  working_hours TEXT,
  service_areas JSONB DEFAULT '[]'::jsonb,
  currency TEXT DEFAULT 'KES',
  mpesa_till TEXT,
  mpesa_paybill TEXT,
  mpesa_account_name TEXT,
  facebook_url TEXT,
  instagram_url TEXT,
  tiktok_url TEXT,
  linkedin_url TEXT,
  announcement_text TEXT,
  announcement_active BOOLEAN DEFAULT false,
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- CLICK EVENTS & TELEMETRY
CREATE TABLE IF NOT EXISTS public.click_events (
  id TEXT PRIMARY KEY,
  label TEXT NOT NULL,
  category TEXT NOT NULL,
  path TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- GOOGLE SHEETS SYNC AUDIT
CREATE TABLE IF NOT EXISTS public.sheets_sync (
  id SERIAL PRIMARY KEY,
  spreadsheet_id TEXT NOT NULL,
  spreadsheet_url TEXT NOT NULL,
  sheet_title TEXT NOT NULL,
  last_synced_at TIMESTAMPTZ DEFAULT now(),
  synced_by TEXT DEFAULT 'Admin'
);

-- =====================================================================
-- 4. ROW LEVEL SECURITY (RLS) POLICIES
-- =====================================================================
ALTER TABLE public.services ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.quotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.staff ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.gallery ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_events ENABLE ROW LEVEL SECURITY;

-- Allow public read of active services, approved reviews, FAQs, gallery, settings
CREATE POLICY "Public Read Services" ON public.services FOR SELECT USING (true);
CREATE POLICY "Public Read Reviews" ON public.reviews FOR SELECT USING (approved = true);
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Gallery" ON public.gallery FOR SELECT USING (true);
CREATE POLICY "Public Read Settings" ON public.business_settings FOR SELECT USING (true);

-- Allow public users to submit leads, quotes, bookings, reviews, clicks
CREATE POLICY "Public Insert Leads" ON public.leads FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Quotes" ON public.quotes FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Bookings" ON public.bookings FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Reviews" ON public.reviews FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Insert Clicks" ON public.click_events FOR INSERT WITH CHECK (true);

-- Allow full access for anon/authenticated in this setup (can be tightened with admin auth)
CREATE POLICY "Allow All on Services" ON public.services FOR ALL USING (true);
CREATE POLICY "Allow All on Leads" ON public.leads FOR ALL USING (true);
CREATE POLICY "Allow All on Quotes" ON public.quotes FOR ALL USING (true);
CREATE POLICY "Allow All on Bookings" ON public.bookings FOR ALL USING (true);
CREATE POLICY "Allow All on Customers" ON public.customers FOR ALL USING (true);
CREATE POLICY "Allow All on Staff" ON public.staff FOR ALL USING (true);
CREATE POLICY "Allow All on Teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Allow All on Vehicles" ON public.vehicles FOR ALL USING (true);
CREATE POLICY "Allow All on Invoices" ON public.invoices FOR ALL USING (true);
CREATE POLICY "Allow All on Payments" ON public.payments FOR ALL USING (true);
CREATE POLICY "Allow All on Reviews" ON public.reviews FOR ALL USING (true);
CREATE POLICY "Allow All on Gallery" ON public.gallery FOR ALL USING (true);
CREATE POLICY "Allow All on FAQs" ON public.faqs FOR ALL USING (true);
CREATE POLICY "Allow All on Settings" ON public.business_settings FOR ALL USING (true);
CREATE POLICY "Allow All on Clicks" ON public.click_events FOR ALL USING (true);
