-- ============================================================
-- betwin – Seed Data
-- Run AFTER schema.sql. Safe to re-run (ON CONFLICT DO NOTHING).
-- ============================================================

-- ─── Doctors (from src/data/mockRecipients.json) ─────────────

INSERT INTO doctors (id, name, title, hospital, email, biography)
VALUES
  (
    'dr_tan',
    'Dr. Evelyn Tan',
    'Senior Consultant Breast Oncologist',
    'National Cancer Centre Singapore (NCCS)',
    'evelyn.tan@nccs.com.sg',
    'Speaks English & Mandarin. Specializes in early-stage breast cancer management and endocrine therapy pacing.'
  ),
  (
    'dr_lim',
    'Dr. Marcus Lim',
    'Associate Professor in Oncology',
    'National University Cancer Institute, Singapore (NCIS)',
    'marcus.lim@ncis.com.sg',
    'Speaks English & Tamil. Head of NCIS breast cancer clinical trial panels.'
  ),
  (
    'dr_nair',
    'Dr. Preetha Nair',
    'Director of Gynaecological & Breast Care',
    'Singapore General Hospital (SGH) Oncology',
    'preetha.nair@sgh.com.sg',
    'Speaks English, Malay & Hindi. Leads SGH outpatient emotional distress support groups.'
  )
ON CONFLICT (id) DO NOTHING;


-- ─── Caregivers (from src/data/mockRecipients.json) ──────────

INSERT INTO caregivers (id, name, relationship, phone, email, notes)
VALUES
  (
    'care_spouse',
    'David D.',
    'Spouse / Husband',
    '+65 9123 4567',
    'david.d@care.betwin.sg',
    'Authorized to receive reassuring daily recovery ELO updates via secure WhatsApp link.'
  ),
  (
    'care_mother',
    'Mdm. Florence G.',
    'Mother',
    '+65 9876 5432',
    'florence.g@care.betwin.sg',
    'Prefers slow SMS dispatches and BCF guidance summaries.'
  ),
  (
    'care_friend',
    'Cheryl Tan',
    'Best Friend',
    '+65 9345 6789',
    'cheryl.t@care.betwin.sg',
    'Assists with note-taking during oncologist consultations.'
  )
ON CONFLICT (id) DO NOTHING;


-- ─── Terry Demo Profile (for hackathon / QA testing) ─────────
-- Mirrors loadTerryDemoProfile() in src/hooks/useVoiceAgent.js

INSERT INTO journals (
  user_id,
  patient_name,
  user_role,
  primary_emotion,
  clinical_questions,
  patient_notes,
  doctor_name,
  doctor_email,
  doctor_hospital,
  caregiver_authorized,
  elo,
  module_scores
)
VALUES (
  'terry_singpass_uid_9987',
  'Terry Lim',
  'Breast Cancer Patient',
  'Anxious / Overwhelmed',
  E'- Ask Dr. Tan: "Are the physical side effects of chemotherapy cycle 2 normal?"\n- Ask Dr. Tan: "When should we schedule my post-surgical sleeve check?"',
  E'-[Stage 1 Diagnosis]: Biopsy results processed. HER2 Positive. Staging confirmed.\n-[Stage 2 Prep]: Prepared all scans, biopsies, and Singpass cards. Checked in with NCCS nurse.\n-[Stage 3 Distress]: Experiencing heavy fatigue and mild nausea from active chemo.',
  'Dr. Evelyn Tan',
  'evelyn.tan@nccs.com.sg',
  'National Cancer Centre Singapore (NCCS)',
  true,
  1350,
  '{"jargon":85,"screening":100,"crisis":45,"healing":10,"fertility":0,"sister":0,"caregiver":20,"wellness":30}'
)
ON CONFLICT (user_id) DO NOTHING;
