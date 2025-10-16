-- Add dietary preference columns to team_members table
-- This script adds support for dietary preferences and notes

-- Add dietary_preference column
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS dietary_preference VARCHAR(50);

-- Add dietary_notes column for additional information
ALTER TABLE team_members 
ADD COLUMN IF NOT EXISTS dietary_notes TEXT;

-- Add comment to document the new columns
COMMENT ON COLUMN team_members.dietary_preference IS 'Dietary preference: omnivor, vegetarisch, vegan, kein_schweinefleisch, sonstiges';
COMMENT ON COLUMN team_members.dietary_notes IS 'Additional dietary notes when preference is "sonstiges"';

-- Update RLS policies to allow dietary information
-- (The existing policies should already cover this, but let's make sure)

-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'team_members';

-- The existing policies should already allow INSERT and SELECT for team_members
-- No additional RLS changes needed as the existing policies are broad enough
