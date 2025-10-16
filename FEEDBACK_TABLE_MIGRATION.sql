-- Feedback System Table Migration
-- Copy-paste this into Supabase SQL Editor

CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id UUID REFERENCES events(id),
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  feedback_text TEXT,
  would_pay BOOLEAN,
  price_willing INTEGER,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Add RLS policies
ALTER TABLE feedback ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to insert feedback
CREATE POLICY "Users can insert feedback for their events"
  ON feedback FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = feedback.event_id 
      AND events.user_id = auth.uid()
    )
  );

-- Allow users to view feedback for their events
CREATE POLICY "Users can view feedback for their events"
  ON feedback FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM events 
      WHERE events.id = feedback.event_id 
      AND events.user_id = auth.uid()
    )
  );
