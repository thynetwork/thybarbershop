-- ============================================================
-- PHASE 2 — Connection table additions
-- Run this in Supabase SQL Editor
-- ============================================================

-- Source field: how the rider registered
-- Values: 'invite', 'find_a_driver', 'manual'
ALTER TABLE connections ADD COLUMN IF NOT EXISTS source TEXT CHECK (source IN ('invite', 'find_a_driver', 'manual'));

-- Note from rider to driver (appears on notifications)
ALTER TABLE connections ADD COLUMN IF NOT EXISTS note_to_driver TEXT;

-- Pre-set amount accepted by rider during invite registration
ALTER TABLE connections ADD COLUMN IF NOT EXISTS accepted_set_amount NUMERIC(10,2);

-- 2-hour approval window tracking
ALTER TABLE connections ADD COLUMN IF NOT EXISTS expires_at TIMESTAMPTZ;
ALTER TABLE connections ADD COLUMN IF NOT EXISTS extended_hours INTEGER DEFAULT 0;

-- ============================================================
-- Users table: note_to_driver (stored per-user for notifications)
-- ============================================================
ALTER TABLE users ADD COLUMN IF NOT EXISTS note_to_driver TEXT;

-- ============================================================
-- Drivers table: pre_set_amount for share code flow
-- ============================================================
ALTER TABLE drivers ADD COLUMN IF NOT EXISTS pre_set_amount NUMERIC(10,2);
