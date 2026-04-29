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

-- ── Verification document tracking (private bucket: barber-documents) ──
-- ID + license documents uploaded at registration; ThyAdmin reviews these
-- before flipping the barber to active. URLs point at private storage paths
-- that only ThyAdmin staff can read.
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS dl_number              text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS dl_front_url           text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS dl_back_url            text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS barber_license_number  text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS barber_license_url     text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS barber_license_expiry  date;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS shop_license_url       text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS liability_ins_url      text;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS years_experience       text;

-- Per-step verification flags. Used by ThyAdmin's 5-step approval workflow.
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS id_verified            boolean DEFAULT false;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS license_verified       boolean DEFAULT false;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS shop_license_verified  boolean DEFAULT false;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS address_verified       boolean DEFAULT false;

-- Review queue + rejection trail.
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS flagged_for_review     boolean DEFAULT false;
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS disapproval_reason     text;

-- License-expiry watcher hits at 30-day window before this date.
CREATE INDEX IF NOT EXISTS drivers_license_expiry_idx ON drivers (barber_license_expiry);

-- Indexes that power the FA1 pool query:
--   barber.zip_code = $1
--   OR $1 = ANY(barber.service_areas)
CREATE INDEX IF NOT EXISTS drivers_zip_code_idx       ON drivers (zip_code);
CREATE INDEX IF NOT EXISTS drivers_service_areas_gin  ON drivers USING GIN (service_areas);

-- Helpful sort/filter indexes used downstream by the pool ranker.
CREATE INDEX IF NOT EXISTS drivers_city_state_idx     ON drivers (state, city);
