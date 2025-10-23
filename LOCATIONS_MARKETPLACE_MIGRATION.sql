-- =====================================================
-- LOCATIONS MARKETPLACE MIGRATION
-- =====================================================
-- Fügt Marketplace-Felder zur locations Table hinzu
-- Datum: 2025-01-23
-- Zweck: Erweitert locations für Marketplace-Model

-- Neue Felder für Marketplace Model
ALTER TABLE locations 
ADD COLUMN IF NOT EXISTS listing_tier TEXT DEFAULT 'basic' CHECK (listing_tier IN ('basic', 'premium', 'featured')),
ADD COLUMN IF NOT EXISTS is_verified BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true,
ADD COLUMN IF NOT EXISTS booking_email TEXT,
ADD COLUMN IF NOT EXISTS booking_lead_time INTEGER DEFAULT 3,
ADD COLUMN IF NOT EXISTS phone TEXT,
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS postal_code TEXT,
ADD COLUMN IF NOT EXISTS images TEXT[],
ADD COLUMN IF NOT EXISTS tags TEXT[];

-- Setze alle bestehenden Locations auf basic
UPDATE locations 
SET listing_tier = 'basic',
    is_verified = false,
    is_active = true
WHERE listing_tier IS NULL;

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_locations_listing_tier ON locations(listing_tier);
CREATE INDEX IF NOT EXISTS idx_locations_is_active ON locations(is_active);
CREATE INDEX IF NOT EXISTS idx_locations_is_verified ON locations(is_verified);
CREATE INDEX IF NOT EXISTS idx_locations_city ON locations(city);

-- Zeige Ergebnis
SELECT 
  id, 
  name, 
  city, 
  listing_tier, 
  is_active, 
  is_verified,
  booking_lead_time
FROM locations 
LIMIT 5;

-- Zeige Schema
SELECT 
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'locations'
ORDER BY ordinal_position;
