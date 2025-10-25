-- =====================================================
-- CLEAR ALL USER DATA FROM DATABASE
-- =====================================================
-- ⚠️  WARNING: This will delete ALL user-generated data!
-- ⚠️  Use with caution - this cannot be undone!
-- 
-- Datum: 2025-01-23
-- Zweck: Löscht alle Events, Votes, Feedback und User-Daten

-- 1. Delete all votes (includes voter names and emails)
DELETE FROM votes;

-- 2. Delete all feedback (may contain user data)
DELETE FROM feedback;

-- 3. Delete all team members (includes names, emails, dietary preferences)
DELETE FROM team_members;

-- 4. Delete all event locations (junction table)
DELETE FROM event_locations;

-- 5. Delete all events (the main events table)
DELETE FROM events;

-- 6. Delete all votes again (in case of foreign key issues)
--    Actually, let's not do this twice

-- Show remaining data counts
SELECT 
  'events' as table_name, 
  COUNT(*) as remaining_count 
FROM events
UNION ALL
SELECT 
  'team_members' as table_name, 
  COUNT(*) as remaining_count 
FROM team_members
UNION ALL
SELECT 
  'votes' as table_name, 
  COUNT(*) as remaining_count 
FROM votes
UNION ALL
SELECT 
  'feedback' as table_name, 
  COUNT(*) as remaining_count 
FROM feedback
UNION ALL
SELECT 
  'event_locations' as table_name, 
  COUNT(*) as remaining_count 
FROM event_locations;

-- Final confirmation message
SELECT '✅ All user data has been deleted!' as status;
