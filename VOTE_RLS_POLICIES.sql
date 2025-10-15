-- Vote RLS Policies for TeamEvent.ch
-- Run this in Supabase SQL Editor

-- Check existing policies for votes table
SELECT * FROM pg_policies WHERE tablename = 'votes';

-- Check existing policies for team_members table  
SELECT * FROM pg_policies WHERE tablename = 'team_members';

-- Drop old policies if they exist
DROP POLICY IF EXISTS "Public can insert votes" ON votes;
DROP POLICY IF EXISTS "Users can view votes for their events" ON votes;
DROP POLICY IF EXISTS "Anyone can insert votes" ON votes;
DROP POLICY IF EXISTS "Anyone can view votes" ON votes;

DROP POLICY IF EXISTS "Public can insert team_members for voting" ON team_members;
DROP POLICY IF EXISTS "Anyone can view team members" ON team_members;
DROP POLICY IF EXISTS "Anyone can insert team_members" ON team_members;

-- Create comprehensive policies for votes table
CREATE POLICY "Anyone can insert votes"
  ON votes FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view votes"
  ON votes FOR SELECT
  TO anon, authenticated
  USING (true);

-- Create comprehensive policies for team_members table
CREATE POLICY "Anyone can insert team_members"
  ON team_members FOR INSERT
  TO anon, authenticated
  WITH CHECK (true);

CREATE POLICY "Anyone can view team_members"
  ON team_members FOR SELECT
  TO anon, authenticated
  USING (true);

-- Check votes table schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'votes'
ORDER BY ordinal_position;

-- Check team_members table schema
SELECT column_name, data_type, is_nullable, column_default
FROM information_schema.columns
WHERE table_name = 'team_members'
ORDER BY ordinal_position;

-- If date_id column exists and is NOT NULL, make it nullable
-- (Uncomment if needed)
-- ALTER TABLE votes ALTER COLUMN date_id DROP NOT NULL;
-- ALTER TABLE votes ALTER COLUMN date_id SET DEFAULT NULL;
