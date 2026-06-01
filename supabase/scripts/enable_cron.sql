CREATE EXTENSION IF NOT EXISTS pg_cron;

select cron.schedule(
  'reset-counter',
  '* * * * *',
  $$
  update counters
  set value = 0
  where
    value <> 0
    and now() - last_updated_at >= interval '20 minutes';
  $$
);
