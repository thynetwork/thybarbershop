-- ============================================================
-- THYFREELANCER — Complete Database Schema (Supabase / PostgreSQL)
-- Instance: ThyDriver
-- RLS disabled — access controlled at API layer (like ThyID approach)
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ============================================================
-- USERS
-- ============================================================
CREATE TABLE users (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email       TEXT UNIQUE NOT NULL,
  password    TEXT NOT NULL,
  name        TEXT NOT NULL,
  phone       TEXT,
  role        TEXT NOT NULL CHECK (role IN ('rider', 'driver', 'admin')),
  avatar_url  TEXT,
  photo_url   TEXT,
  matching_fee_paid BOOLEAN DEFAULT false,
  rider_id    TEXT UNIQUE,             -- e.g. KIM·2121 (generated for riders)
  preferred_name TEXT,                 -- optional display name
  state       TEXT,                    -- 2-char state code
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_users_email ON users (email);
CREATE INDEX idx_users_role ON users (role);
CREATE INDEX idx_users_rider_id ON users (rider_id);

-- ============================================================
-- DRIVERS
-- ============================================================
CREATE TABLE drivers (
  id                    UUID PRIMARY KEY REFERENCES users (id) ON DELETE CASCADE,
  airport_code          TEXT,                  -- 3-letter IATA airport code (e.g. IAH, LAX)
  code_initials         TEXT NOT NULL,
  code_digits           TEXT NOT NULL,
  bio                   TEXT,
  city                  TEXT,
  banner_url            TEXT,
  avatar_url            TEXT,
  photo_url             TEXT,

  -- Rates
  rate_hourly           NUMERIC(10,2),
  flat_fee_local        NUMERIC(10,2),       -- 10 miles or less
  flat_fee_airport      NUMERIC(10,2),       -- airport run, 50 miles or less
  flat_fee_distance     NUMERIC(10,2),       -- 51+ miles single flat
  empty_return_type     TEXT CHECK (empty_return_type IN ('fixed', 'percent')),
  empty_return_value    NUMERIC(10,2),
  set_amount_default    NUMERIC(10,2),

  -- Vehicle class
  vehicle_class         TEXT CHECK (vehicle_class IN ('comfort', 'xl_mid', 'xl_large', 'black')),

  -- Schedule & policies
  availability_json     JSONB,
  available_24hrs       BOOLEAN DEFAULT false,
  cancellation_policy   TEXT,
  payment_timing        TEXT CHECK (payment_timing IN ('at_booking', 'on_pickup', 'end_of_ride')),

  -- Hire permit
  hire_permit_enabled   BOOLEAN DEFAULT false,
  hire_permit_number    TEXT,

  -- Airport
  airport_permitted     BOOLEAN DEFAULT false,
  airport_permit_number TEXT,
  airport_permit_doc_url TEXT,

  -- Payment
  cash_accepted         BOOLEAN DEFAULT false,

  -- Welcome offer
  welcome_offer_enabled BOOLEAN DEFAULT false,
  welcome_offer_ride    TEXT CHECK (welcome_offer_ride IN ('first', 'second')),

  -- DL
  dl_state              TEXT,
  dl_number_encrypted   TEXT,

  -- Insurance
  insurance_provider    TEXT,
  insurance_policy_number TEXT,
  insurance_type        TEXT CHECK (insurance_type IN ('rideshare', 'commercial', 'personal')),

  -- Status
  is_active             BOOLEAN DEFAULT true,
  subscription_status   TEXT DEFAULT 'trial' CHECK (subscription_status IN ('trial', 'active', 'past_due', 'cancelled', 'waived')),
  subscription_waiver   TEXT CHECK (subscription_waiver IN ('full', 'trial', 'hardship')),

  created_at            TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (airport_code, code_initials, code_digits)
);

CREATE INDEX idx_drivers_code ON drivers (airport_code, code_initials, code_digits);
CREATE INDEX idx_drivers_city ON drivers (city);

-- ============================================================
-- DRIVER CREDENTIALS (encrypted, admin-only access)
-- ============================================================
CREATE TABLE driver_credentials (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id           UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  dl_last4_encrypted  TEXT,
  legal_name          TEXT,
  state               TEXT DEFAULT 'TX',
  verified_at         TIMESTAMPTZ,
  verified_by_admin_id UUID REFERENCES users (id),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driver_id)
);

-- ============================================================
-- RIDER SAFETY PROFILES (encrypted, visible on active booking only)
-- ============================================================
CREATE TABLE rider_safety_profiles (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  rider_id                UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  photo_url               TEXT,
  legal_name              TEXT,
  dob                     DATE,
  id_type                 TEXT CHECK (id_type IN ('drivers_license', 'state_id', 'passport')),
  id_last4_encrypted      TEXT,
  emergency_contact_name  TEXT,
  emergency_contact_phone TEXT,
  home_address            TEXT,
  driver_note             TEXT,
  completed_at            TIMESTAMPTZ,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (rider_id)
);

-- ============================================================
-- CONNECTIONS (driver-client relationship)
-- ============================================================
CREATE TABLE connections (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id           UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  rider_id            UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  status              TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'approved', 'denied', 'revoked')),
  set_amount          NUMERIC(10,2),
  set_amount_agreed_at TIMESTAMPTZ,
  set_amount_set_by   TEXT CHECK (set_amount_set_by IN ('driver', 'rider')),
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driver_id, rider_id)
);

CREATE INDEX idx_connections_driver ON connections (driver_id);
CREATE INDEX idx_connections_rider ON connections (rider_id);
CREATE INDEX idx_connections_status ON connections (status);

-- ============================================================
-- DRIVER PAYMENT METHODS
-- ============================================================
CREATE TABLE driver_payment_methods (
  id           UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id    UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  method       TEXT NOT NULL CHECK (method IN ('zelle', 'venmo', 'cashapp', 'stripe', 'cash')),
  handle       TEXT NOT NULL,
  qr_image_url TEXT,
  is_enabled   BOOLEAN DEFAULT true,
  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_payment_methods_driver ON driver_payment_methods (driver_id);

-- ============================================================
-- VEHICLES
-- ============================================================
CREATE TABLE vehicles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id           UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  make                TEXT NOT NULL,
  model               TEXT NOT NULL,
  year                INTEGER,
  color               TEXT,
  seats               INTEGER DEFAULT 3,
  seatbelt_confirmed  BOOLEAN DEFAULT false,
  photo_urls_json     JSONB,
  created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_vehicles_driver ON vehicles (driver_id);

-- ============================================================
-- BOOKINGS
-- ============================================================
CREATE TABLE bookings (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id               UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  rider_id                UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  date                    DATE NOT NULL,
  time_slot               TEXT NOT NULL,

  -- Route
  pickup_address          TEXT,
  dropoff_address         TEXT,
  estimated_miles         NUMERIC(10,1),

  -- Type
  route_type              TEXT DEFAULT 'standard' CHECK (route_type IN ('standard', 'longhaul')),

  -- Status
  status                  TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'completed', 'cancelled', 'expired')),

  -- Rate
  rate_type               TEXT CHECK (rate_type IN ('set_amount', 'hourly', 'flat_local', 'flat_distance')),
  rate_amount             NUMERIC(10,2),

  -- Long haul / price adjustment
  driver_estimate         NUMERIC(10,2),
  driver_final_price      NUMERIC(10,2),
  driver_adjustment_reason TEXT,
  driver_adjustment_note  TEXT,

  -- Client response
  client_response         TEXT CHECK (client_response IN ('accepted', 'held', 'declined')),
  hold_expires_at         TIMESTAMPTZ,

  -- Payment & confirmation
  payment_timing          TEXT CHECK (payment_timing IN ('at_booking', 'on_pickup', 'end_of_ride')),
  paid_at                 TIMESTAMPTZ,
  driver_confirmed_at     TIMESTAMPTZ,

  -- Cancellation
  cancellation_reason     TEXT,

  created_at              TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX idx_bookings_driver ON bookings (driver_id);
CREATE INDEX idx_bookings_rider ON bookings (rider_id);
CREATE INDEX idx_bookings_status ON bookings (status);
CREATE INDEX idx_bookings_date ON bookings (date);

-- ============================================================
-- RATINGS
-- ============================================================
CREATE TABLE ratings (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings (id) ON DELETE CASCADE,
  driver_id   UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  rider_id    UUID NOT NULL REFERENCES users (id) ON DELETE CASCADE,
  stars       INTEGER NOT NULL CHECK (stars >= 1 AND stars <= 5),
  comment     TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (booking_id)
);

CREATE INDEX idx_ratings_driver ON ratings (driver_id);

-- ============================================================
-- AVAILABILITY
-- ============================================================
CREATE TABLE availability (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id       UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  date            DATE NOT NULL,
  time_slots_json JSONB NOT NULL,
  created_at      TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driver_id, date)
);

CREATE INDEX idx_availability_driver_date ON availability (driver_id, date);

-- ============================================================
-- SUBSCRIPTIONS
-- ============================================================
CREATE TABLE subscriptions (
  id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id               UUID NOT NULL REFERENCES drivers (id) ON DELETE CASCADE,
  stripe_subscription_id  TEXT,
  status                  TEXT DEFAULT 'trial' CHECK (status IN ('trial', 'active', 'past_due', 'cancelled')),
  next_billing_date       DATE,
  waiver_active           BOOLEAN DEFAULT false,
  created_at              TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driver_id)
);

CREATE INDEX idx_subscriptions_driver ON subscriptions (driver_id);
CREATE INDEX idx_subscriptions_status ON subscriptions (status);

-- ============================================================
-- NOTIFICATIONS (In-App Inbox)
-- ============================================================
CREATE TABLE notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  type        TEXT NOT NULL,  -- booking_request, booking_confirmed, booking_denied, booking_expired, client_request, reminder, etc.
  title       TEXT NOT NULL,
  body        TEXT NOT NULL,
  data        JSONB,          -- booking_id, rider_id, driver_id, etc.
  read        BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_notifications_user ON notifications (user_id);
CREATE INDEX idx_notifications_user_read ON notifications (user_id, read);
CREATE INDEX idx_notifications_created ON notifications (created_at);

-- ============================================================
-- NOTIFICATION PREFERENCES (Driver Settings)
-- ============================================================
CREATE TABLE notification_preferences (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  driver_id         UUID NOT NULL REFERENCES drivers(id) ON DELETE CASCADE,
  push_enabled      BOOLEAN DEFAULT true,
  sms_enabled       BOOLEAN DEFAULT true,
  email_enabled     BOOLEAN DEFAULT true,
  reminder_interval TEXT DEFAULT '30min' CHECK (reminder_interval IN ('15min', '30min', '1hr', 'none')),
  created_at        TIMESTAMPTZ NOT NULL DEFAULT now(),

  UNIQUE (driver_id)
);

CREATE INDEX idx_notification_prefs_driver ON notification_preferences (driver_id);

-- ============================================================
-- BOOKING NOTIFICATIONS (Audit Trail)
-- ============================================================
CREATE TABLE booking_notifications (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  booking_id  UUID NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  channel     TEXT NOT NULL CHECK (channel IN ('sms', 'email', 'push', 'in_app')),
  recipient   TEXT NOT NULL,   -- phone, email, or user_id
  status      TEXT NOT NULL DEFAULT 'sent' CHECK (status IN ('sent', 'delivered', 'failed', 'pending')),
  message     TEXT,
  sent_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_booking_notifications_booking ON booking_notifications (booking_id);
CREATE INDEX idx_booking_notifications_channel ON booking_notifications (channel);
