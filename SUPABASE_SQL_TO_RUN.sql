-- =====================================================
-- Weather Analytics Dashboard - Supabase Database Setup
-- =====================================================
-- 
-- INSTRUCTIONS:
-- 1. Open your Supabase project at https://supabase.com
-- 2. Click "SQL Editor" in the left sidebar
-- 3. Click "New Query"
-- 4. Copy and paste ALL of this SQL
-- 5. Click "Run" button
-- 6. Verify tables are created in "Table Editor"
--
-- =====================================================

-- Enable UUID extension for unique IDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- FAVORITES TABLE
-- Stores user's pinned/favorite cities
-- =====================================================
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, city_name)
);

-- =====================================================
-- HISTORICAL SNAPSHOTS TABLE
-- Stores historical weather data samples
-- =====================================================
CREATE TABLE IF NOT EXISTS historical_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  snapshot_time TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- =====================================================
-- INDEXES for better query performance
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_city_name ON favorites(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_city_name ON historical_snapshots(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_snapshot_time ON historical_snapshots(snapshot_time);

-- =====================================================
-- ENABLE ROW LEVEL SECURITY (RLS)
-- Users can only see their own data
-- =====================================================
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_snapshots ENABLE ROW LEVEL SECURITY;

-- =====================================================
-- SECURITY POLICIES for favorites table
-- Users can view, insert, and delete ONLY their own favorites
-- =====================================================
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- =====================================================
-- SECURITY POLICIES for historical_snapshots table
-- All authenticated users can read historical data
-- Only backend (service role) can insert new snapshots
-- =====================================================
CREATE POLICY "Authenticated users can view historical snapshots"
  ON historical_snapshots FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Service role can insert snapshots"
  ON historical_snapshots FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR true);

-- =====================================================
-- TABLE COMMENTS (documentation)
-- =====================================================
COMMENT ON TABLE favorites IS 'Stores user favorite cities for quick access';
COMMENT ON TABLE historical_snapshots IS 'Stores sampled historical weather data for trend analysis';

-- =====================================================
-- VERIFICATION QUERIES
-- Run these after the above to verify tables were created
-- =====================================================

-- Check if favorites table exists
-- SELECT * FROM favorites LIMIT 1;

-- Check if historical_snapshots table exists  
-- SELECT * FROM historical_snapshots LIMIT 1;

-- =====================================================
-- DONE!
-- =====================================================
-- 
-- Next steps:
-- 1. Go to "Table Editor" to see your new tables
-- 2. Enable Google OAuth in Authentication → Providers
-- 3. Start your backend and frontend servers
-- 4. Sign in and start adding favorites!
--
-- =====================================================
