-- =====================================================
-- CREATE EVENT_LOCATIONS JUNCTION TABLE
-- =====================================================
-- Erstellt die Junction-Tabelle für Events und Locations
-- Datum: 2025-01-23
-- Zweck: Verbindet Events mit Locations

-- Erstelle Junction Table für Events und Locations
CREATE TABLE IF NOT EXISTS event_locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id UUID NOT NULL REFERENCES events(id) ON DELETE CASCADE,
  location_id UUID NOT NULL REFERENCES locations(id) ON DELETE CASCADE,
  order_index INTEGER NOT NULL DEFAULT 0,
  start_time TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  
  -- Verhindere doppelte Zuordnungen
  UNIQUE(event_id, location_id)
);

-- Erstelle Index für bessere Performance
CREATE INDEX IF NOT EXISTS idx_event_locations_event_id ON event_locations(event_id);
CREATE INDEX IF NOT EXISTS idx_event_locations_location_id ON event_locations(location_id);

-- Kommentare für Dokumentation
COMMENT ON TABLE event_locations IS 'Junction table linking events to their selected locations';
COMMENT ON COLUMN event_locations.order_index IS 'Order in which locations were selected (0, 1, 2)';
COMMENT ON COLUMN event_locations.start_time IS 'Starting time for this location (format: HH:MM)';

-- RLS Policies
ALTER TABLE event_locations ENABLE ROW LEVEL SECURITY;

-- Policy: Users can read event_locations for their own events
CREATE POLICY "Users can read event_locations for their own events"
  ON event_locations
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_locations.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Policy: Users can insert event_locations for their own events
CREATE POLICY "Users can insert event_locations for their own events"
  ON event_locations
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_locations.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Policy: Users can update event_locations for their own events
CREATE POLICY "Users can update event_locations for their own events"
  ON event_locations
  FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_locations.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Policy: Users can delete event_locations for their own events
CREATE POLICY "Users can delete event_locations for their own events"
  ON event_locations
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM events
      WHERE events.id = event_locations.event_id
      AND events.user_id = auth.uid()
    )
  );

-- Zeige Ergebnis
SELECT 'event_locations table created successfully' AS status;

-- TEMPORÄR: Erlaube öffentlichen Zugriff für Testing (später entfernen!)
DROP POLICY IF EXISTS "Allow public read for event_locations" ON event_locations;
CREATE POLICY "Allow public read for event_locations"
  ON event_locations
  FOR SELECT
  TO public
  USING (true);

DROP POLICY IF EXISTS "Allow public insert for event_locations" ON event_locations;
CREATE POLICY "Allow public insert for event_locations"
  ON event_locations
  FOR INSERT
  TO public
  WITH CHECK (true);
