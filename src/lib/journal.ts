/**
 * Supabase implementation of saveJournalToCloud / getJournal.
 *
 * Mirrors the exact signature of saveJournalToCloud() in src/firebase.js
 * so either backend can be swapped in without touching useVoiceAgent.js.
 *
 * Table: journals
 *   user_id (TEXT, unique)  — same as Firebase document ID (singpass_uid)
 *   All other columns map 1-to-1 with the Firebase payload.
 */

import { supabase } from './supabase';
import type { ModuleScores } from '@/hooks/useProfile';

export interface JournalPayload {
  patientName:         string;
  userRole:            string;
  primaryEmotion:      string;
  clinicalQuestions:   string;
  patientNotes:        string;
  doctorName:          string;
  doctorEmail:         string;
  doctorHospital:      string;
  caregiverAuthorized: boolean;
  elo:                 number;
  moduleScores:        ModuleScores;
}

/** Upsert a patient's care journal. Matches the Firebase saveJournalToCloud() signature. */
export async function saveJournalToCloud(
  userId: string,
  data: JournalPayload,
): Promise<void> {
  const { error } = await supabase.from('journals').upsert(
    {
      user_id:              userId,
      patient_name:         data.patientName,
      user_role:            data.userRole,
      primary_emotion:      data.primaryEmotion,
      clinical_questions:   data.clinicalQuestions,
      patient_notes:        data.patientNotes,
      doctor_name:          data.doctorName,
      doctor_email:         data.doctorEmail,
      doctor_hospital:      data.doctorHospital,
      caregiver_authorized: data.caregiverAuthorized,
      elo:                  data.elo,
      module_scores:        data.moduleScores,
      updated_at:           new Date().toISOString(),
    },
    { onConflict: 'user_id' },
  );

  if (error) {
    console.error('[betwin] saveJournalToCloud error:', error.message);
    throw error;
  }
}

/** Fetch the latest journal row for a patient. Returns null if not yet created. */
export async function getJournal(userId: string): Promise<JournalPayload | null> {
  const { data, error } = await supabase
    .from('journals')
    .select('*')
    .eq('user_id', userId)
    .single();

  // PGRST116 = row not found — not a real error for a new user
  if (error && error.code !== 'PGRST116') {
    console.error('[betwin] getJournal error:', error.message);
    throw error;
  }

  if (!data) return null;

  return {
    patientName:         data.patient_name,
    userRole:            data.user_role,
    primaryEmotion:      data.primary_emotion,
    clinicalQuestions:   data.clinical_questions,
    patientNotes:        data.patient_notes,
    doctorName:          data.doctor_name,
    doctorEmail:         data.doctor_email,
    doctorHospital:      data.doctor_hospital,
    caregiverAuthorized: data.caregiver_authorized,
    elo:                 data.elo,
    moduleScores:        data.module_scores,
  };
}
