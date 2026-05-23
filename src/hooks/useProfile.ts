/**
 * React Native adapter that surfaces the voice-agent data model
 * (user profile, module scores, voice state, doctor info, personas)
 * without using any web-only APIs from useVoiceAgent.js.
 *
 * Sources of truth (friend's files — not modified):
 *   src/hooks/useVoiceAgent.js   – data model & Terry demo profile
 *   src/data/mockRecipients.json – doctor / caregiver records
 *   src/data/journeyCorpus.json  – 11-module journey data
 */

import { useCallback, useEffect, useRef, useState } from 'react';

import journeyCorpus from '../data/journeyCorpus.json';
import mockRecipients from '../data/mockRecipients.json';
import { saveJournalToCloud } from '../lib/journal';

// ─── Types ────────────────────────────────────────────────────────────────────

export type VoiceState = 'idle' | 'listening' | 'thinking' | 'speaking' | 'unlocked';

export type ModuleKey =
  | 'jargon'
  | 'screening'
  | 'dass21'
  | 'phq9'
  | 'coreom'
  | 'crisis'
  | 'healing'
  | 'fertility'
  | 'sister'
  | 'caregiver'
  | 'wellness';

export type ModuleScores = Record<ModuleKey, number>;

export interface UserProfile {
  uid: string;
  displayName: string;
  email: string;
  photoInitials: string;
  age: number;
  ethnicity: string;
  stage: string;
  notes: string;
  hospital: string;
}

export interface Persona {
  id: string;
  name: string;
  profile: UserProfile;
  elo: number;
  scores: ModuleScores;
  activePillarKey: string;
  selectedDoctorId: string;
}

export interface Pillar {
  id: string;
  key: string;
  label: string;
  icon: string;
  score: number;
  description: string;
  formula: string;
  bounds: string;
}

// ─── Constants & Personas ──────────────────────────────────────────────────────

const PERSONAS: Record<string, Persona> = {
  terry: {
    id: 'terry',
    name: 'Terry Lim',
    profile: {
      uid: 'terry_singpass_uid_9987',
      displayName: 'Terry Lim',
      email: 'terry.lim@healthhub.sg',
      photoInitials: 'TL',
      age: 41,
      ethnicity: 'Chinese Singaporean',
      stage: 'Stage 3 Prep | Cycle 2 fatigue',
      notes: 'Anxious about sharing chemotherapy recovery boundaries with her husband, David, and aging parents.',
      hospital: 'National Cancer Centre Singapore (NCCS)',
    },
    elo: 1350,
    scores: {
      jargon: 85,
      screening: 100,
      dass21: 75,
      phq9: 60,
      coreom: 55,
      crisis: 45,
      healing: 10,
      fertility: 0,
      sister: 0,
      caregiver: 20,
      wellness: 30,
    },
    activePillarKey: 'caregiver',
    selectedDoctorId: 'dr_tan',
  },
  priya: {
    id: 'priya',
    name: 'Priya (Newly Diagnosed)',
    profile: {
      uid: 'priya_singpass_uid_34',
      displayName: 'Priya Pillay',
      email: 'priya.pillay@healthhub.sg',
      photoInitials: 'PP',
      age: 34,
      ethnicity: 'Indian Singaporean',
      stage: 'Stage II, HER2+ | 3 weeks post-diagnosis',
      notes: 'Deciding whether to freeze eggs before chemo starts in 4 days. Experiencing acute decision-making distress.',
      hospital: 'National Cancer Centre Singapore (NCCS)',
    },
    elo: 1120,
    scores: {
      jargon: 90,
      screening: 95,
      dass21: 85,
      phq9: 40,
      coreom: 60,
      crisis: 20,
      healing: 15,
      fertility: 95,
      sister: 10,
      caregiver: 30,
      wellness: 40,
    },
    activePillarKey: 'body',
    selectedDoctorId: 'dr_tan',
  },
  linda: {
    id: 'linda',
    name: 'Linda (Active Treatment)',
    profile: {
      uid: 'linda_singpass_uid_52',
      displayName: 'Linda Ang',
      email: 'linda.ang@healthhub.sg',
      photoInitials: 'LA',
      age: 52,
      ethnicity: 'Chinese Singaporean',
      stage: 'Stage III, Triple Negative | Cycle 4 of 6',
      notes: 'Dealing with heavy hair loss, weight changes, and identity disruption. Divorced, adult children abroad.',
      hospital: 'National University Cancer Institute (NCIS)',
    },
    elo: 1210,
    scores: {
      jargon: 80,
      screening: 90,
      dass21: 65,
      phq9: 80,
      coreom: 70,
      crisis: 85,
      healing: 90,
      fertility: 10,
      sister: 20,
      caregiver: 85,
      wellness: 50,
    },
    activePillarKey: 'cognitive',
    selectedDoctorId: 'dr_lim',
  },
  margaret: {
    id: 'margaret',
    name: 'Margaret (Survivorship)',
    profile: {
      uid: 'margaret_singpass_uid_67',
      displayName: 'Mdm. Margaret Jalil',
      email: 'margaret.j@healthhub.sg',
      photoInitials: 'MJ',
      age: 67,
      ethnicity: 'Malay Singaporean',
      stage: 'Stage I, ER+ | 18 months post-treatment',
      notes: 'On Tamoxifen. Experiencing heavy fatigue, joint pain, and survivor guilt. Struggling with severe scanxiety before surveillance visits.',
      hospital: 'Singapore General Hospital (SGH) Oncology',
    },
    elo: 1290,
    scores: {
      jargon: 95,
      screening: 100,
      dass21: 80,
      phq9: 75,
      coreom: 80,
      crisis: 90,
      healing: 40,
      fertility: 0,
      sister: 50,
      caregiver: 40,
      wellness: 85,
    },
    activePillarKey: 'distress',
    selectedDoctorId: 'dr_nair',
  },
  james: {
    id: 'james',
    name: 'James (Caregiver Spouse)',
    profile: {
      uid: 'james_singpass_uid_46',
      displayName: 'James Ang',
      email: 'james.ang@care.betwin.sg',
      photoInitials: 'JA',
      age: 46,
      ethnicity: 'Chinese Singaporean',
      stage: 'Primary Caregiver & Husband of Linda',
      notes: 'Managing household alone, working full-time, and sole emotional anchor. Feeling intense caregiver distress and anticipatory grief.',
      hospital: 'National University Cancer Institute (NCIS)',
    },
    elo: 1050,
    scores: {
      jargon: 40,
      screening: 50,
      dass21: 90,
      phq9: 85,
      coreom: 90,
      crisis: 30,
      healing: 10,
      fertility: 0,
      sister: 40,
      caregiver: 95,
      wellness: 70,
    },
    activePillarKey: 'caregiver',
    selectedDoctorId: 'dr_lim',
  },
};

// The 9 phases shown in the grid (first 9 modules from journeyCorpus)
const PHASE_MODULE_KEYS: ModuleKey[] = [
  'jargon',
  'screening',
  'dass21',
  'phq9',
  'coreom',
  'crisis',
  'healing',
  'fertility',
  'sister',
];

// VoiceOrb state colours
export const VOICE_STATE_COLORS: Record<VoiceState, string> = {
  idle:      '#E8768A', // softRose
  listening: '#00b8d4', // oceanic teal
  thinking:  '#26a69a', // sage teal
  speaking:  '#00BCD4', // cyan
  unlocked:  '#00e676', // healing green
};

// Subtitles for each state
const STATE_SUBTITLES: Record<VoiceState, string> = {
  idle:      'Tap to speak with BeTwin Agent',
  listening: 'Listening… share what\'s on your mind',
  thinking:  'Processing your reflections…',
  speaking:  'I\'ve logged your thoughts, brave heart.',
  unlocked:  '✔ Telemetry recorded',
};

// ─── Hook ─────────────────────────────────────────────────────────────────────

export default function useProfile() {
  const [selectedPersonaId, setSelectedPersonaId] = useState<string>('terry');
  
  const persona = PERSONAS[selectedPersonaId] || PERSONAS.terry;

  const [user, setUser] = useState<UserProfile>(persona.profile);
  const [elo, setElo] = useState(persona.elo);
  const [moduleScores, setModuleScores] = useState<ModuleScores>(persona.scores);
  const [selectedDoctorId, setSelectedDoctorId] = useState(persona.selectedDoctorId);

  const [voiceState, setVoiceState] = useState<VoiceState>('idle');
  const [subtitles, setSubtitles] = useState(STATE_SUBTITLES.idle);

  const sessionTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync state whenever persona switches
  useEffect(() => {
    setUser(persona.profile);
    setElo(persona.elo);
    setModuleScores(persona.scores);
    setSelectedDoctorId(persona.selectedDoctorId);
    setVoiceState('idle');
    setSubtitles(STATE_SUBTITLES.idle);
  }, [selectedPersonaId]);

  // Derive active doctor
  const doctor = mockRecipients.doctors.find(d => d.id === selectedDoctorId)
    ?? mockRecipients.doctors[0];

  // Derive phase data for grid
  const phases = PHASE_MODULE_KEYS.map((key, i) => ({
    id: String(i + 1),
    moduleKey: key,
    label: (journeyCorpus as Record<string, { title: string }>)[key].title
      .split(' & ')[0]
      .replace(' Checklist', '')
      .replace(' Processing', '')
      .replace(' Screener', ''),
    score: moduleScores[key],
  }));

  const speakText = (text: string) => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        // Clear any stuck paused state immediately
        window.speechSynthesis.resume();
        window.speechSynthesis.cancel();
        
        // Use a short 60ms delay to let the browser clear the queue before speaking,
        // avoiding Chrome's immediate cancel-and-discard race condition.
        setTimeout(() => {
          if (typeof window === 'undefined' || !window.speechSynthesis) return;
          try {
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.88; // grounding pace
            utterance.volume = 1.0;
            utterance.pitch = 1.0;
            
            const voices = window.speechSynthesis.getVoices();
            if (voices && Array.isArray(voices) && voices.length > 0) {
              const priorityNames = [
                "Google US English Female", 
                "Microsoft Aria Online",
                "Microsoft Zira", 
                "Samantha", 
                "Hazel", 
                "Google UK English Female", 
                "English"
              ];
              let selectedVoice = null;
              for (const priority of priorityNames) {
                selectedVoice = voices.find(v => v && v.name && v.name.includes(priority));
                if (selectedVoice) break;
              }
              if (selectedVoice) utterance.voice = selectedVoice;
            }

            window.speechSynthesis.speak(utterance);
            console.log("[BeTwin SDK] Vocalizing phrase:", text);
          } catch (subErr) {
            console.warn("Speech Synthesis play failed:", subErr);
          }
        }, 60);
      } catch (e) {
        console.warn("Speech synthesis init failed:", e);
      }
    }
  };

  const clearTimer = () => {
    if (sessionTimerRef.current) {
      clearTimeout(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }
  };

  // RN voice state machine
  const startAgentSession = useCallback(() => {
    clearTimer();
    setVoiceState('listening');
    
    // Dynamically retrieve active module's question from journeyCorpus based on activePillarKey
    const activeKey = persona.activePillarKey;
    const activeModuleData = (journeyCorpus as any)[activeKey];
    const question = activeModuleData?.question || "Let's focus on setting healthy boundaries and configuring reassuring daily updates together. How are you holding up today?";
    
    setSubtitles(question);
    speakText(question);

    // listening → thinking
    sessionTimerRef.current = setTimeout(() => {
      setVoiceState('thinking');
      setSubtitles(STATE_SUBTITLES.thinking);

      // thinking → speaking
      sessionTimerRef.current = setTimeout(() => {
        setVoiceState('speaking');
        const speakResp = "I have successfully logged your thoughts on your secure patient dashboard, brave heart.";
        setSubtitles(speakResp);
        speakText(speakResp);

        // speaking → unlocked
        sessionTimerRef.current = setTimeout(() => {
          setVoiceState('unlocked');
          setSubtitles(STATE_SUBTITLES.unlocked);
          const newElo = elo + 150;
          setElo(newElo);

          // Persist to Cloud
          saveJournalToCloud(user.uid, {
            patientName:         user.displayName,
            userRole:            user.uid.includes('james') ? 'Caregiver / Family Support' : 'Breast Cancer Patient',
            primaryEmotion:      'Anxious / Overwhelmed',
            clinicalQuestions:   '',
            patientNotes:        user.notes,
            doctorName:          doctor.name,
            doctorEmail:         doctor.email,
            doctorHospital:      doctor.hospital,
            caregiverAuthorized: true,
            elo:                 newElo,
            moduleScores,
          }).catch(err => console.warn('[betwin] journal sync failed:', err));

          // unlocked → back to listening
          sessionTimerRef.current = setTimeout(() => {
            setVoiceState('listening');
            setSubtitles(STATE_SUBTITLES.listening);
          }, 2000);
        }, 3000);
      }, 2000);
    }, 4000);
  }, [elo, user, doctor, moduleScores, persona]);

  const endAgentSession = useCallback(() => {
    clearTimer();
    setVoiceState('idle');
    setSubtitles(STATE_SUBTITLES.idle);
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const toggleVoiceSession = useCallback(() => {
    if (voiceState === 'idle') {
      // Unblock browser Web Speech Synthesis context immediately inside user click gesture
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        try {
          window.speechSynthesis.cancel();
          const silentUtterance = new SpeechSynthesisUtterance(" ");
          silentUtterance.volume = 0;
          window.speechSynthesis.speak(silentUtterance);
        } catch (e) {
          console.warn("Silent utterance unblock failed:", e);
        }
      }
      startAgentSession();
    } else {
      endAgentSession();
    }
  }, [voiceState, startAgentSession, endAgentSession]);

  // Cleanup on unmount
  useEffect(() => () => {
    clearTimer();
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
  }, []);

  // Derivation and mapping of the 5 Core Clinical Pillars from the 11 modules
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
      score: Math.min(100, Math.round((moduleScores.crisis + moduleScores.dass21) / 2)),
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
      score: Math.min(100, Math.round((moduleScores.wellness + moduleScores.phq9 + moduleScores.coreom) / 3)),
      description: 'Continuous emotional safety screening, RAG risk assessment, and clinical escalation safeguards.',
      formula: '\\text{Safety Resilience} = \\lim_{t \\to \\infty} [\\text{Resilience ELO} + \\text{Coping}]',
      bounds: 'Emergency Medical: 995 | BCF Support Circle',
    },
  ];

  return {
    // Personas
    selectedPersonaId,
    setSelectedPersonaId,
    allPersonas: Object.values(PERSONAS),
    activePersonaKey: persona.activePillarKey,
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
    // Doctor
    doctor,
    selectedDoctorId,
    setSelectedDoctorId,
    // Full references
    allDoctors: mockRecipients.doctors,
    allCaregivers: mockRecipients.caregivers,
  };
}
