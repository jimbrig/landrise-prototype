/*
  # Create properties table and add sample data

  1. New Tables
    - `properties`
      - `id` (uuid, primary key)
      - `address` (text)
      - `city` (text)
      - `state` (text)
      - `zip` (text)
      - `county` (text)
      - `price` (numeric)
      - `acres` (numeric)
      - `zoning` (text)
      - `latitude` (numeric)
      - `longitude` (numeric)
      - `description` (text)
      - `images` (text[])
      - `features` (text[])
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on properties table
    - Add policy for public read access
*/

-- Create properties table
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

-- Enable RLS
ALTER TABLE properties ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Allow public read access"
  ON properties
  FOR SELECT
  TO public
  USING (true);

-- Insert sample data
INSERT INTO properties (
  address,
  city,
  state,
  zip,
  county,
  price,
  acres,
  zoning,
  latitude,
  longitude,
  description,
  images,
  features
) VALUES
(
  '1234 Ranch Road',
  'Austin',
  'TX',
  '78701',
  'Travis',
  750000,
  15.5,
  'Agricultural',
  30.2672,
  -97.7431,
  'Beautiful ranch property with rolling hills and natural spring. Perfect for agricultural or residential development.',
  ARRAY['https://images.pexels.com/photos/280229/pexels-photo-280229.jpeg'],
  ARRAY['Natural Spring', 'Rolling Hills', 'Road Frontage', 'Electricity Available']
),
(
  '567 Lake View Drive',
  'Austin',
  'TX',
  '78732',
  'Travis',
  1200000,
  8.2,
  'Residential',
  30.3910,
  -97.9025,
  'Prime lakefront property with stunning views. Ideal for luxury home development.',
  ARRAY['https://images.pexels.com/photos/147411/italy-mountains-dawn-daybreak-147411.jpeg'],
  ARRAY['Lake Access', 'Utilities', 'Paved Road', 'Mountain Views']
),
(
  '789 Commercial Parkway',
  'Round Rock',
  'TX',
  '78664',
  'Williamson',
  2500000,
  5.0,
  'Commercial',
  30.5083,
  -97.6789,
  'Prime commercial lot in fast-growing area. Perfect for retail or office development.',
  ARRAY['https://images.pexels.com/photos/209251/pexels-photo-209251.jpeg'],
  ARRAY['Corner Lot', 'High Traffic', 'All Utilities', 'Highway Access']
);