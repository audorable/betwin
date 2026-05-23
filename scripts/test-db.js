/**
 * betwin – Supabase connection test
 * Run from project root:
 *   node --env-file=.env scripts/test-db.js
 */

import { createClient } from '@supabase/supabase-js';

const url  = process.env.EXPO_PUBLIC_SUPABASE_URL;
const key  = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!url || !key) {
  console.error('❌  Missing env vars. Make sure .env has EXPO_PUBLIC_SUPABASE_URL and EXPO_PUBLIC_SUPABASE_ANON_KEY.');
  process.exit(1);
}

const supabase = createClient(url, key);

async function run() {
  console.log('🔌  Connecting to Supabase…\n');

  // ── 1. Read doctors table (seed data check) ───────────────
  const { data: doctors, error: dErr } = await supabase
    .from('doctors')
    .select('id, name, hospital');

  if (dErr) {
    console.error('❌  doctors query failed:', dErr.message);
    process.exit(1);
  }
  console.log(`✅  doctors table (${doctors.length} rows):`);
  doctors.forEach(d => console.log(`    • ${d.name} — ${d.hospital}`));

  // ── 2. Write test — upsert Terry's demo profile ───────────
  console.log('\n📝  Upserting Terry demo profile…');
  const terryPayload = {
    user_id:              'terry_singpass_uid_9987',
    patient_name:         'Terry Lim',
    user_role:            'Breast Cancer Patient',
    primary_emotion:      'Anxious / Overwhelmed',
    clinical_questions:   '- Ask Dr. Tan: "Are the physical side effects of chemotherapy cycle 2 normal?"',
    patient_notes:        '-[Stage 1 Diagnosis]: Biopsy results processed. HER2 Positive.',
    doctor_name:          'Dr. Evelyn Tan',
    doctor_email:         'evelyn.tan@nccs.com.sg',
    doctor_hospital:      'National Cancer Centre Singapore (NCCS)',
    caregiver_authorized: true,
    elo:                  1500,
    module_scores:        { jargon:95, screening:100, crisis:45, healing:10, fertility:0, sister:0, caregiver:20, wellness:30 },
    updated_at:           new Date().toISOString(),
  };

  const { error: wErr } = await supabase
    .from('journals')
    .upsert(terryPayload, { onConflict: 'user_id' });

  if (wErr) {
    console.error('❌  Write failed:', wErr.message);
    console.log('    → Re-run schema.sql in the Supabase SQL editor to fix the RLS policy, then try again.');
    process.exit(1);
  }
  console.log('✅  Write succeeded.');

  // ── 3. Read back to confirm ────────────────────────────────
  const { data: journal, error: jErr } = await supabase
    .from('journals')
    .select('patient_name, elo, module_scores, updated_at')
    .eq('user_id', 'terry_singpass_uid_9987')
    .single();

  if (jErr) {
    console.error('\n❌  Read-back failed:', jErr.message);
    process.exit(1);
  }
  console.log(`\n✅  Read-back confirmed:`);
  console.log(`    Name   : ${journal.patient_name}`);
  console.log(`    ELO    : ${journal.elo}`);
  console.log(`    Scores : ${JSON.stringify(journal.module_scores)}`);
  console.log(`    Updated: ${journal.updated_at}`);
  console.log('\n🎉  All checks passed. Supabase is wired up correctly.\n');
}

run().catch(err => {
  console.error('❌  Unexpected error:', err);
  process.exit(1);
});
