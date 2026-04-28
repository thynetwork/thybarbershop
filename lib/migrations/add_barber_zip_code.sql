-- ThyBarberShop · add zip + location columns to drivers (barbers) for FA1 Pool Search
-- Run once against the ThyBarberShop Supabase project.

-- Columns are added IF NOT EXISTS so re-running is safe.
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS zip_code      text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS city          text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS state         text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS service_areas text[];

-- Enforce 5-digit zip format at the DB level (NULL allowed for legacy rows).
ALTER TABLE drivers DROP CONSTRAINT IF EXISTS drivers_zip_code_format;
ALTER TABLE drivers
  ADD CONSTRAINT drivers_zip_code_format
  CHECK (zip_code IS NULL OR zip_code ~ '^[0-9]{5}$');

-- Public URL for the barber's pre-generated invite QR (Supabase storage).
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS qr_code_url text;

-- Indexes that power the FA1 pool query:
--   barber.zip_code = $1
--   OR $1 = ANY(barber.service_areas)
CREATE INDEX IF NOT EXISTS drivers_zip_code_idx       ON drivers (zip_code);
CREATE INDEX IF NOT EXISTS drivers_service_areas_gin  ON drivers USING GIN (service_areas);

-- Helpful sort/filter indexes used downstream by the pool ranker.
CREATE INDEX IF NOT EXISTS drivers_city_state_idx     ON drivers (state, city);
