-- RPC Function für Event Counter Update
-- Führe das in Supabase SQL Editor aus

CREATE OR REPLACE FUNCTION increment_key_events(key_id UUID)
RETURNS VOID AS $$
BEGIN
  UPDATE product_keys 
  SET events_created = events_created + 1
  WHERE id = key_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permission
GRANT EXECUTE ON FUNCTION increment_key_events(UUID) TO authenticated;
