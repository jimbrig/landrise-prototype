/*
  # Initial schema for LandRise

  1. New Tables
    - users
    - properties
    - saved_searches
    - property_financials
    - parcel_data
    
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  name text,
  subscription text DEFAULT 'free',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Properties table
CREATE TABLE IF NOT EXISTS properties (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  address text NOT NULL,
  city text NOT NULL,
  state text NOT NULL,
  zip text NOT NULL,
  county text NOT NULL,
  price numeric NOT NULL,
  acres numeric NOT NULL,
  zoning text NOT NULL,
  latitude numeric NOT NULL,
  longitude numeric NOT NULL,
  description text,
  images text[],
  features text[],
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Property financials
CREATE TABLE IF NOT EXISTS property_financials (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  development_costs jsonb NOT NULL,
  revenue jsonb NOT NULL,
  financing jsonb NOT NULL,
  roi jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Parcel data
CREATE TABLE IF NOT EXISTS parcel_data (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  property_id uuid REFERENCES properties(id) ON DELETE CASCADE,
  elevation jsonb NOT NULL,
  water jsonb NOT NULL,
  soil jsonb NOT NULL,
  metrics jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Saved searches
CREATE TABLE IF NOT EXISTS saved_searches (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES users(id) ON DELETE CASCADE,
  name text NOT NULL,
  filters jsonb NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;
ALTER TABLE property_financials ENABLE ROW LEVEL SECURITY;
ALTER TABLE parcel_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE saved_searches ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can read own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Public can read properties"
  ON properties
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read property financials"
  ON property_financials
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can read parcel data"
  ON parcel_data
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users can manage own saved searches"
  ON saved_searches
  FOR ALL
  TO authenticated
  USING (auth.uid() = user_id);