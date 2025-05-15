/*
  # Add sample properties data

  1. Changes
    - Insert sample property data into the properties table
    
  2. Notes
    - Adds realistic test data for development
    - Includes various property types and locations
*/

INSERT INTO properties (
  id,
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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
  gen_random_uuid(),
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