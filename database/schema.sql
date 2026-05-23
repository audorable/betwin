-- ============================================================
-- betwin – Supabase Schema
-- Run this in the Supabase SQL editor to set up all tables.
-- ============================================================

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";


-- ─── users ───────────────────────────────────────────────────
-- One row per patient. uid mirrors the Singpass / auth provider UID.

CREATE TABLE IF NOT EXISTS users (
  id            UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  singpass_uid  TEXT        UNIQUE NOT NULL,
  display_name  TEXT        NOT NULL,
  email         TEXT,
  role          TEXT        DEFAULT 'Breast Cancer Patient',
  primary_emotion TEXT      DEFAULT 'Anxious / Overwhelmed',
  elo           INTEGER     DEFAULT 1000,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);


-- ─── journals ────────────────────────────────────────────────
-- One row per patient (upsert on user_id).
-- Mirrors saveJournalToCloud() from firebase.js exactly so the
-- same call works against both Firebase and Supabase.

CREATE TABLE IF NOT EXISTS journals (
  id                   UUID        PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id              TEXT        NOT NULL UNIQUE,   -- = singpass_uid
  patient_name         TEXT,
  user_role            TEXT,
  primary_emotion      TEXT,
  clinical_questions   TEXT,
  patient_notes        TEXT,
  doctor_name          TEXT,
  doctor_email         TEXT,
  doctor_hospital      TEXT,
  caregiver_authorized BOOLEAN     DEFAULT FALSE,
  elo                  INTEGER     DEFAULT 1000,
  -- 8-module telemetry scores stored as JSON
  -- { jargon, screening, crisis, healing, fertility, sister, caregiver, wellness }
  module_scores        JSONB       DEFAULT '{}',
  created_at           TIMESTAMPTZ DEFAULT NOW(),
  updated_at           TIMESTAMPTZ DEFAULT NOW()
);

-- Auto-update updated_at on every write
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS journals_updated_at ON journals;
CREATE TRIGGER journals_updated_at
  BEFORE UPDATE ON journals
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS users_updated_at ON users;
CREATE TRIGGER users_updated_at
  BEFORE UPDATE ON users
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();


-- ─── doctors ─────────────────────────────────────────────────
-- Mirrors mockRecipients.json → doctors array.

CREATE TABLE IF NOT EXISTS doctors (
  id          TEXT PRIMARY KEY,      -- e.g. "dr_tan"
  name        TEXT NOT NULL,
  title       TEXT,
  hospital    TEXT,
  email       TEXT,
  biography   TEXT
);


-- ─── caregivers ──────────────────────────────────────────────
-- Mirrors mockRecipients.json → caregivers array.

CREATE TABLE IF NOT EXISTS caregivers (
  id           TEXT PRIMARY KEY,     -- e.g. "care_spouse"
  name         TEXT NOT NULL,
  relationship TEXT,
  phone        TEXT,
  email        TEXT,
  notes        TEXT
);


-- ─── Row Level Security ───────────────────────────────────────

-- Journals: allow anon key full access (keyed by user_id in app logic).
-- TODO: tighten to JWT sub claim once Supabase Auth is integrated.
ALTER TABLE journals ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "patients_own_journal" ON journals;
DROP POLICY IF EXISTS "journals_anon_all"    ON journals;
CREATE POLICY "journals_anon_all" ON journals
  FOR ALL USING (true) WITH CHECK (true);

-- Doctors and caregivers are public reference data (read-only).
ALTER TABLE doctors    ENABLE ROW LEVEL SECURITY;
ALTER TABLE caregivers ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "doctors_public_read"    ON doctors;
DROP POLICY IF EXISTS "caregivers_public_read" ON caregivers;
CREATE POLICY "doctors_public_read"    ON doctors    FOR SELECT USING (true);
CREATE POLICY "caregivers_public_read" ON caregivers FOR SELECT USING (true);
