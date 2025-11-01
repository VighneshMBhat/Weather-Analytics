-- Supabase Schema for Weather Analytics Dashboard
-- Run this SQL in your Supabase SQL Editor to create the required tables

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Favorites table
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, city_name)
);

-- Historical snapshots table
CREATE TABLE IF NOT EXISTS historical_snapshots (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  city_name TEXT NOT NULL,
  lat NUMERIC NOT NULL,
  lon NUMERIC NOT NULL,
  snapshot_time TIMESTAMPTZ NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_favorites_user_id ON favorites(user_id);
CREATE INDEX IF NOT EXISTS idx_favorites_city_name ON favorites(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_city_name ON historical_snapshots(city_name);
CREATE INDEX IF NOT EXISTS idx_historical_snapshot_time ON historical_snapshots(snapshot_time);

-- Enable Row Level Security
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE historical_snapshots ENABLE ROW LEVEL SECURITY;

-- Policies for favorites table
CREATE POLICY "Users can view their own favorites"
  ON favorites FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own favorites"
  ON favorites FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own favorites"
  ON favorites FOR DELETE
  USING (auth.uid() = user_id);

-- Policies for historical_snapshots (read-only for authenticated users)
CREATE POLICY "Authenticated users can view historical snapshots"
  ON historical_snapshots FOR SELECT
  USING (auth.role() = 'authenticated');

-- Service role can insert snapshots (backend only)
CREATE POLICY "Service role can insert snapshots"
  ON historical_snapshots FOR INSERT
  WITH CHECK (auth.jwt() ->> 'role' = 'service_role' OR true);

-- Comments
COMMENT ON TABLE favorites IS 'Stores user favorite cities';
COMMENT ON TABLE historical_snapshots IS 'Stores historical weather data snapshots';

-- Example query to view favorites
-- SELECT * FROM favorites WHERE user_id = auth.uid();

-- Example query to view historical data
-- SELECT * FROM historical_snapshots 
-- WHERE city_name = 'London, GB' 
-- AND snapshot_time >= NOW() - INTERVAL '7 days'
-- ORDER BY snapshot_time DESC;
