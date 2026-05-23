/**
 * React Native adapter that surfaces the voice-agent data model
 * (user profile, module scores, voice state, doctor info) without
 * using any web-only APIs from useVoiceAgent.js.
 *
 * Sources of truth (friend's files — not modified):
 *   src/hooks/useVoiceAgent.js   – data model & Terry demo profile
 *   src/data/mockRecipients.json – doctor / caregiver records
 *   src/data/journeyCorpus.json  – 8-module journey data
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import journeyCorpus from '../data/journeyCorpus.json';
import mockRecipients from '../data/mockRecipients.json';
import { saveJournalToCloud } from '../lib/journal';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'unlocked';

export type ModuleKey =
  | 'jargon' | 'screening' | 'crisis' | 'healing'
  | 'fertility' | 'sister' | 'caregiver' | 'wellness';

export type ModuleScores = Record<ModuleKey, number>;

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoInitials: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

// Mirrors loadTerryDemoProfile() from useVoiceAgent.js exactly
const TERRY_PROFILE: UserProfile = {
  uid: 'terry_singpass_uid_9987',
  displayName: 'Terry Lim',
  email: 'terry.lim@healthhub.sg',
  photoInitials: 'TL',
};

const TERRY_SCORES: ModuleScores = {
  jargon: 85,
  screening: 100,
  crisis: 45,
  healing: 10,
  fertility: 0,
  sister: 0,
  caregiver: 20,
  wellness: 30,
};

const TERRY_ELO = 1350;

// The 6 phases shown in the grid (first 6 modules from journeyCorpus)
const PHASE_MODULE_KEYS: ModuleKey[] = [
  'jargon', 'screening', 'crisis', 'healing', 'fertility', 'sister',
];

// VoiceOrb state colours (translated from VoiceOrb.jsx — unchanged logic)
export const VOICE_STATE_COLORS: Record<VoiceState, string> = {
  idle:      '#E8768A', // mochi pink (brand softRose) for idle
  listening: '#00b8d4', // oceanic teal  (from VoiceOrb.jsx)
  thinking:  '#26a69a', // sage teal     (from VoiceOrb.jsx)
  speaking:  '#00BCD4', // cyan          (from VoiceOrb.jsx — softened for RN)
  unlocked:  '#00e676', // healing green (from VoiceOrb.jsx)
};

// Subtitles for each state (mirrors useVoiceAgent.js subtitle progression)
const STATE_SUBTITLES: Record<VoiceState, string> = {
  idle:      'Tap to speak with BeTwin Agent',
  listening: 'Listening… share what\'s on your mind',
  thinking:  'Processing your reflections…',
  speaking:  'I\'ve logged your thoughts, brave heart.',
  unlocked:  '✔ Telemetry recorded',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useProfile() {
  const [user, setUser] = useState<UserProfile>(TERRY_PROFILE);
  const [elo, setElo] = useState(TERRY_ELO);
  const [moduleScores, setModuleScores] = useState<ModuleScores>(TERRY_SCORES);
  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [subtitles, setSubtitles] = useState(STATE_SUBTITLES.idle);
  const [selectedDoctorId, setSelectedDoctorId] = useState('dr_tan');

  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Derive active doctor from mockRecipients (mirrors useVoiceAgent's useEffect)
  const doctor = mockRecipients.doctors.find(d => d.id === selectedDoctorId)
    ?? mockRecipients.doctors[0];

  // Derive phase data from journeyCorpus for the 6 grid squares
  const phases = PHASE_MODULE_KEYS.map((key, i) => ({
    id: String(i + 1),
    moduleKey: key,
    label: (journeyCorpus as Record<string, { title: string }>)[key].title
      .split(' & ')[0]   // shorten "Diagnosis & Jargon Processing" → "Diagnosis"
      .replace(' Checklist', '')
      .replace(' Processing', ''),
    score: moduleScores[key],
  }));

  const clearTimer = () => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // RN voice state machine — mirrors useVoiceAgent's startAgentSession / handleEndCall
  const startAgentSession = useCallback(() => {
    clearTimer();
    setVoiceState('listening');
    setSubtitles(STATE_SUBTITLES.listening);

    // listening → thinking after 4s
    sessionTimerRef.current = setTimeout(() => {
      setVoiceState('thinking');
      setSubtitles(STATE_SUBTITLES.thinking);

      // thinking → speaking after 2s
      sessionTimerRef.current = setTimeout(() => {
        setVoiceState('speaking');
        setSubtitles(STATE_SUBTITLES.speaking);

        // speaking → unlocked after 3s
        sessionTimerRef.current = setTimeout(() => {
          setVoiceState('unlocked');
          setSubtitles(STATE_SUBTITLES.unlocked);
          const newElo = elo + 150;
          setElo(newElo);

          // Persist to Supabase — mirrors handleBCFSubmit in useVoiceAgent.js
          const doc = mockRecipients.doctors.find(d => d.id === selectedDoctorId)
            ?? mockRecipients.doctors[0];
          saveJournalToCloud(user.uid, {
            patientName:         user.displayName,
            userRole:            'Breast Cancer Patient',
            primaryEmotion:      'Anxious / Overwhelmed',
            clinicalQuestions:   '',
            patientNotes:        '',
            doctorName:          doc.name,
            doctorEmail:         doc.email,
            doctorHospital:      doc.hospital,
            caregiverAuthorized: false,
            elo:                 newElo,
            moduleScores,
          }).catch(err => console.warn('[betwin] journal sync failed:', err));

          // unlocked → back to listening after 2s
          sessionTimerRef.current = setTimeout(() => {
            setVoiceState('listening');
            setSubtitles(STATE_SUBTITLES.listening);
          }, 2000);
        }, 3000);
      }, 2000);
    }, 4000);
  }, []);

  const endAgentSession = useCallback(() => {
    clearTimer();
    setVoiceState('idle');
    setSubtitles(STATE_SUBTITLES.idle);
  }, []);

  const toggleVoiceSession = useCallback(() => {
    if (voiceState === 'idle') {
      startAgentSession();
    } else {
      endAgentSession();
    }
  }, [voiceState, startAgentSession, endAgentSession]);

  // Cleanup on unmount
  useEffect(() => () => clearTimer(), []);

  // Derivation and mapping of the 5 Core Clinical Pillars from the 8 modules
  const pillars = [
    {
      id: '1',
      key: 'cognitive',
      label: 'Pillar 1: Cognitive Processing',
      icon: '📖',
      score: Math.min(100, Math.round((moduleScores.jargon + moduleScores.screening) / 2)),
      description: 'Deconstructs medical terminology and oncological staging. Measures cognitive clarity against informational overload.',
      formula: '\\text{Cognitive Clarity} = \\frac{\\text{Medical Jargon Translation}}{\\text{Information Overload}}',
      bounds: 'BCF Singapore Helpline: 6352 6560',
    },
    {
      id: '2',
      key: 'body',
      label: 'Pillar 2: Body Reconnection',
      icon: '🩹',
      score: Math.min(100, Math.round((moduleScores.healing + moduleScores.fertility) / 2)),
      description: 'Tracks surgical recovery, mastectomy self-compassion, and early young-outpatient fertility preservation.',
      formula: '\\text{Body Image Recovery} \\propto \\text{Surgical Grief} + \\text{Oocyte Preservation}',
      bounds: 'Support bra consultations: KKH / NCCS',
    },
    {
      id: '3',
      key: 'distress',
      label: 'Pillar 3: Distress Side Effects',
      icon: '🛡️',
      score: Math.min(100, moduleScores.crisis),
      description: 'Scores active chemotherapy distress tolerances, somatic fatigue indexes, nausea, and physical coping buffers.',
      formula: '\\text{Distress Mitigation} = \\int_{0}^{10} PacingFactor[t] \\, dt',
      bounds: 'SOS 24/7 Hotline: 1767 | IMH Helpline: 6389 2222',
    },
    {
      id: '4',
      key: 'caregiver',
      label: 'Pillar 4: Caregiver Support',
      icon: '🔒',
      score: Math.min(100, Math.round((moduleScores.caregiver + moduleScores.sister) / 2)),
      description: 'Measures patient-caregiver boundaries, WhatsApp update pipelines, and matching with peer survivors.',
      formula: '\\text{Caregiver Harmony} = \\text{Authorized Sync} + \\text{Patient Confidentiality}',
      bounds: 'BCF Caregiving Guidelines: bcf.org.sg',
    },
    {
      id: '5',
      key: 'safety',
      label: 'Pillar 5: Distress and Safety',
      icon: '💝',
      score: Math.min(100, Math.round((moduleScores.wellness + (elo - 1000) / 10) / 2)),
      description: 'Continuous emotional safety screening, RAG risk assessment, and clinical escalation safeguards.',
      formula: '\\text{Safety Resilience} = \\lim_{t \\to \\infty} [\\text{Resilience ELO} + \\text{Coping}]',
      bounds: 'Emergency Medical: 995 | BCF Support Circle',
    },
  ];

  return {
    // User
    user,
    elo,
    // Phases (grid)
    phases,
    pillars,
    moduleScores,
    setModuleScores,
    setElo,
    // Voice
    voiceState,
    subtitles,
    toggleVoiceSession,
    endAgentSession,
    // Doctor (from mockRecipients)
    doctor,
    selectedDoctorId,
    setSelectedDoctorId,
    // Full references (in case screens need them)
    allDoctors: mockRecipients.doctors,
    allCaregivers: mockRecipients.caregivers,
  };
}

