-- Enable Realtime for the counters table
ALTER TABLE counters REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND tablename = 'counters'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE counters;
  END IF;
END $$;
