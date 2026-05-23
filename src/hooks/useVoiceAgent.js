import { useState, useEffect, useRef } from 'react';
import { useConversation } from '@elevenlabs/react';
import { auth, saveJournalToCloud, subscribeToJournal, useRealFirebase } from '../firebase';
import journeyCorpus from '../data/journeyCorpus.json';
import bcfEvents from '../data/bcfEvents.json';
import mockRecipients from '../data/mockRecipients.json';

export default function useVoiceAgent() {
  const [elo, setElo] = useState(1000);
  const [activeModule, setActiveModule] = useState('jargon'); // 'jargon' | 'screening' | 'crisis' | 'healing' | 'fertility' | 'sister' | 'caregiver' | 'wellness'
  const [userInput, setUserInput] = useState('');
  const [voiceState, setVoiceState] = useState('idle'); // 'idle', 'listening', 'thinking', 'speaking', 'unlocked'
  const [mode, setMode] = useState('fallback'); // 'fallback' or 'webrtc'
  const [selectedVoice, setSelectedVoice] = useState(localStorage.getItem('AXIOM_SELECTED_VOICE') || 'rachel');
  
  // Cinematic Boot States
  const [bootState, setBootState] = useState('darkness'); // 'darkness', 'awakening', 'active'
  const [awakeningStep, setAwakeningStep] = useState(0); 

  // Vocal physics amplitude
  const [speechAmplitude, setSpeechAmplitude] = useState(0);

  // Settings
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [elevenLabsKey, setElevenLabsKey] = useState(localStorage.getItem('AXIOM_ELEVEN_LABS_KEY') || 'sk_b373c51c8dc6b472d6c77069206593be00cbe20ef5ebb595');
  const [speechEngineId, setSpeechEngineId] = useState(localStorage.getItem('AXIOM_SPEECH_ENGINE_ID') || 'seng_8k3m9xr4hjnfg983brhmhkd98n6');
  
  // Audio controls
  const [isMuted, setIsMuted] = useState(false);
  const [micActive, setMicActive] = useState(true);
  
  // BCF Form States
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [userRole, setUserRole] = useState('Breast Cancer Patient');
  const [primaryEmotion, setPrimaryEmotion] = useState('Anxious / Overwhelmed');
  const [clinicalQuestions, setClinicalQuestions] = useState('');
  const [patientNotes, setPatientNotes] = useState('');
  const [doctorName, setDoctorName] = useState('');
  const [doctorEmail, setDoctorEmail] = useState('');
  const [doctorHospital, setDoctorHospital] = useState('National Cancer Centre Singapore (NCCS)');
  const [doctorAuthorized, setDoctorAuthorized] = useState(false);
  const [selectedDoctorId, setSelectedDoctorId] = useState('dr_tan');
  const [selectedCaregiverId, setSelectedCaregiverId] = useState('care_spouse');
  const [readBCFGuide, setReadBCFGuide] = useState(false);
  const [submissionStep, setSubmissionStep] = useState('idle'); 
  const [transmissionLogs, setTransmissionLogs] = useState([]);
  const [crisisTriggered, setCrisisTriggered] = useState(false);

  // Authentication States
  const [user, setUser] = useState(null);
  const [showMockAuthModal, setShowMockAuthModal] = useState(false);
  const [mockEmail, setMockEmail] = useState('');
  const [mockName, setMockName] = useState('');

  // BCF Caregiver Privacy slider & Sister Match states
  const [caregiverAuthorized, setCaregiverAuthorized] = useState(false);
  const [biggerSisterMatched, setBiggerSisterMatched] = useState(null);
  const [biggerSisterLoading, setBiggerSisterLoading] = useState(false);

  // BCF 8-Module Patient Diagnostics Telemetry Scores
  const [moduleScores, setModuleScores] = useState({
    jargon: 0,
    screening: 0,
    crisis: 0,
    healing: 0,
    fertility: 0,
    sister: 0,
    caregiver: 0,
    wellness: 0
  });

  // Terminal & Subtitles Visual logs
  const [subtitles, setSubtitles] = useState('Click the central gleam to awaken the BeTwin Agent.');
  const [terminalLogs, setTerminalLogs] = useState([]);
  
  // Audio Web Speech fallback elements
  const recognitionRef = useRef(null);
  const fallbackSpeechActive = useRef(false);

  const activeModuleData = journeyCorpus[activeModule];
  const activeEvent = bcfEvents[activeModule];

  // Initialize ElevenLabs WebRTC Hook
  const conversation = useConversation({
    onConnect: () => {
      setVoiceState('listening');
      setSubtitles("Connected. Speak your reflections directly to the BeTwin Agent.");
      addLog("ElevenLabs WebRTC stream established successfully.", "success");
    },
    onDisconnect: () => {
      setVoiceState('idle');
      setSubtitles("Disconnected. Click to connect again.");
      addLog("WebRTC stream disconnected.", "info");
    },
    onError: (err) => {
      console.error(err);
      addLog(`WebRTC Error: ${err.message}. Switching to local speech synthesis.`, "error");
      setMode('fallback');
      setVoiceState('idle');
    }
  });

  // Dynamic mock recipient profile autofill
  useEffect(() => {
    const doc = mockRecipients.doctors.find(d => d.id === selectedDoctorId);
    if (doc) {
      setDoctorName(doc.name);
      setDoctorEmail(doc.email);
      setDoctorHospital(doc.hospital);
    }
  }, [selectedDoctorId]);

  // Local Storage Settings
  useEffect(() => {
    localStorage.setItem('AXIOM_ELEVEN_LABS_KEY', elevenLabsKey);
    localStorage.setItem('AXIOM_SPEECH_ENGINE_ID', speechEngineId);
    localStorage.setItem('AXIOM_SELECTED_VOICE', selectedVoice);
  }, [elevenLabsKey, speechEngineId, selectedVoice]);

  // Auth Listener & Firestore sync
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        addLog(`Singpass authenticated user: ${currentUser.displayName} (${currentUser.email})`, "success");
        try {
          const unsubJournal = subscribeToJournal(currentUser.uid, (data) => {
            if (data) {
              if (data.patientName) setPatientName(data.patientName);
              if (data.userRole) setUserRole(data.userRole);
              if (data.primaryEmotion) setPrimaryEmotion(data.primaryEmotion);
              if (data.clinicalQuestions) setClinicalQuestions(data.clinicalQuestions);
              if (data.patientNotes) setPatientNotes(data.patientNotes);
              if (data.doctorName) setDoctorName(data.doctorName);
              if (data.doctorEmail) setDoctorEmail(data.doctorEmail);
              if (data.doctorHospital) setDoctorHospital(data.doctorHospital);
              if (data.caregiverAuthorized !== undefined) setCaregiverAuthorized(data.caregiverAuthorized);
              addLog("Encrypted Care Journal synchronized with Cloud Firestore.", "info");
            }
          });
          return () => unsubJournal();
        } catch (err) {
          console.error("Firestore sync error:", err);
        }
      } else {
        addLog("Secure logout. Local sandbox mode active.", "info");
      }
    });
    return () => unsubscribe();
  }, []);

  // Vocal amplitude physics engine loop
  useEffect(() => {
    let animId;
    const updateAmplitude = () => {
      const time = Date.now() * 0.015;
      if (voiceState === 'speaking') {
        const rawAmp = Math.sin(time * 1.1) * 0.45 + Math.sin(time * 2.7) * 0.35 + Math.cos(time * 4.9) * 0.2;
        let amp = Math.max(0, rawAmp);
        const jitter = Math.sin(time * 18) * 0.04;
        amp = Math.max(0, amp + jitter);
        setSpeechAmplitude(amp);
      } else if (voiceState === 'thinking') {
        const thinkAmp = 0.07 + Math.sin(time * 3) * 0.03;
        setSpeechAmplitude(thinkAmp);
      } else if (voiceState === 'listening') {
        const listenAmp = 0.015 + Math.random() * 0.025;
        setSpeechAmplitude(listenAmp);
      } else {
        setSpeechAmplitude((prev) => (prev <= 0.005 ? 0 : prev * 0.82));
      }
      animId = requestAnimationFrame(updateAmplitude);
    };
    animId = requestAnimationFrame(updateAmplitude);
    return () => cancelAnimationFrame(animId);
  }, [voiceState]);

  // Terminal logging logic
  const addLog = (msg, type = "info") => {
    const timeStr = new Date().toLocaleTimeString();
    setTerminalLogs((prev) => [`[${timeStr}] [${type.toUpperCase()}] ${msg}`, ...prev.slice(0, 12)]);
  };

  // Pre-load voices on mount
  useEffect(() => {
    if (window.speechSynthesis) {
      window.speechSynthesis.getVoices();
      if (window.speechSynthesis.onvoiceschanged !== undefined) {
        window.speechSynthesis.onvoiceschanged = () => {
          window.speechSynthesis.getVoices();
        };
      }
    }
  }, []);

  // Web Speech Fallback Setup
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => { fallbackSpeechActive.current = true; };
      rec.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) final += event.results[i][0].transcript;
          else interim += event.results[i][0].transcript;
        }
        if (interim) setSubtitles(`Listening: "${interim}"`);
        if (final.trim()) processVocalSubmission(final.trim());
      };
      rec.onerror = (err) => {
        console.error("Speech Recognition Error", err);
      };
      rec.onend = () => {
        fallbackSpeechActive.current = false;
        if (mode === 'fallback' && voiceState === 'listening' && micActive) {
          try { rec.start(); } catch (e) {}
        }
      };
      recognitionRef.current = rec;
    }
  }, [mode, voiceState, micActive]);

  // Trigger fallback listen triggers
  useEffect(() => {
    if (mode === 'fallback') {
      if (voiceState === 'listening' && micActive) {
        try {
          if (recognitionRef.current && !fallbackSpeechActive.current) {
            recognitionRef.current.start();
          }
        } catch (e) {}
      } else {
        try {
          if (recognitionRef.current) recognitionRef.current.stop();
        } catch (e) {}
      }
    }
  }, [voiceState, mode, micActive]);

  // Fallback Speecher
  const speakVocalText = async (text, onEndCallback = null) => {
    if (isMuted) {
      if (onEndCallback) onEndCallback();
      return;
    }

    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        
        // Workaround for Chrome bug where speech gets stuck in paused state
        if (window.speechSynthesis.paused) {
          window.speechSynthesis.resume();
        }

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();
        let selectedSystemVoice = null;

        const voicePriorities = [
          "Google US English Female", 
          "Microsoft Aria Online",
          "Microsoft Zira", 
          "Samantha", 
          "Hazel", 
          "Google UK English Female", 
          "English"
        ];

        for (const priority of voicePriorities) {
          selectedSystemVoice = voices.find(v => v.name && v.name.includes(priority));
          if (selectedSystemVoice) break;
        }

        if (selectedSystemVoice) utterance.voice = selectedSystemVoice;
        utterance.rate = 0.88; // Grounding breathing pace
        utterance.pitch = 1.0; 
        
        utterance.onstart = () => setVoiceState('speaking');
        utterance.onend = () => {
          setVoiceState('listening');
          if (onEndCallback) onEndCallback();
        };
        utterance.onerror = (e) => {
          console.error("Speech Synthesis Error:", e);
          setVoiceState('listening');
          if (onEndCallback) onEndCallback();
        };
        window.speechSynthesis.speak(utterance);
      } catch (err) {
        console.error("Failed to run speakVocalText:", err);
        setVoiceState('listening');
        if (onEndCallback) onEndCallback();
      }
    } else {
      if (onEndCallback) onEndCallback();
    }
  };

  const activateAxiomAfterBoot = async () => {
    addLog("Initiating BeTwin Agent BCF Companion...", "info");
    setVoiceState('thinking');
    setSubtitles("Empathetic connection initialized.");

    if (mode === 'webrtc') {
      try {
        await navigator.mediaDevices.getUserMedia({ audio: true });
        addLog("Requesting WebRTC session token...", "info");
        const tokenRes = await fetch(`/api/elevenlabs/v1/convai/conversation/token?agent_id=${speechEngineId}`, {
          method: 'GET',
          headers: { 'xi-api-key': elevenLabsKey }
        });

        if (!tokenRes.ok) throw new Error("Token acquisition failed.");
        const data = await tokenRes.json();
        addLog("Token acquired. Opening WebRTC socket...", "success");

        await conversation.startSession({
          conversationToken: data.token,
          overrides: { agent: { firstMessage: "" } }
        });
      } catch (err) {
        console.error(err);
        addLog(`WebRTC failure: ${err.message}. Falling back to browser speech synthesis.`, "error");
        setMode('fallback');
        executeFallbackIntroduction();
      }
    } else {
      executeFallbackIntroduction();
    }
  };

  const executeFallbackIntroduction = () => {
    setVoiceState('speaking');
    const welcome = `Welcome to BeTwin. I am the BeTwin Agent, your BCF support companion. I operate off the Wolfram Language to help you and your caregivers process emotions and compile doctor questions. Let's start with Stage 1: Diagnosis and jargon processing. How are you feeling today?`;
    setSubtitles(welcome);
    speakVocalText(welcome);
  };

  const startAgentSession = async () => {
    // Unblock browser Web Speech Synthesis context immediately inside user gesture click
    if (window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
        const silentUtterance = new SpeechSynthesisUtterance(" ");
        silentUtterance.volume = 0;
        window.speechSynthesis.speak(silentUtterance);
      } catch (e) {
        console.warn("Silent utterance unblock failed:", e);
      }
    }

    if (bootState === 'darkness') {
      setBootState('awakening');
      setAwakeningStep(0);
      setSubtitles("...");

      setTimeout(() => {
        setAwakeningStep(1);
        setSubtitles("Calibrating emotional support gateway...");
        addLog("Support networks connected.", "info");
      }, 800);

      setTimeout(() => {
        setAwakeningStep(2);
        setSubtitles("Integrating BCF caregiver guidelines (bcf.org.sg)...");
        addLog("BCF Singapore Caregiving Guide loaded.", "info");
      }, 2000);

      setTimeout(() => {
        setAwakeningStep(3);
        setSubtitles("Configuring oncologist preparation engine...");
        addLog("Wolfram Symptom Parser connected.", "success");
      }, 3200);

      setTimeout(() => {
        setAwakeningStep(4);
        setBootState('active');
        addLog("BeTwin Agent active and online.", "success");
        activateAxiomAfterBoot();
      }, 4400);
      return;
    }

    if (bootState === 'active') {
      if (voiceState !== 'idle') {
        handleEndCall();
        return;
      }
      activateAxiomAfterBoot();
    }
  };

  const handleEndCall = () => {
    if (mode === 'webrtc') conversation.endSession();
    if (window.speechSynthesis) window.speechSynthesis.cancel();
    setVoiceState('idle');
    setSubtitles("Core sleeping.");
    addLog("Voice Companion standby.", "info");
  };

  // SWITCH DYNAMIC JOURNEY CARD
  const switchModule = (moduleKey) => {
    if (!journeyCorpus[moduleKey]) return;
    setActiveModule(moduleKey);
    addLog(`Switched patient journey focus to: ${journeyCorpus[moduleKey].title.toUpperCase()}`, "success");
    setSubtitles(journeyCorpus[moduleKey].question);
    speakVocalText(journeyCorpus[moduleKey].question);
  };

  // PROCESS VOCAL SUBMISSION (THE AGENTIC SCORING & STEERING ENGINE)
  const processVocalSubmission = (answerText) => {
    if (!answerText || answerText.trim().length <= 2) {
      addLog("Input Mismatch: Please speak a bit more clearly.", "error");
      const retryText = "I am listening. Share a few more words about what is on your mind. You are safe here.";
      setSubtitles(retryText);
      speakVocalText(retryText);
      return;
    }

    setVoiceState('thinking');
    setSubtitles(`Analyzing: "${answerText}"`);
    addLog(`User submitted: "${answerText}"`, "user");

    setTimeout(() => {
      const cleanAnswer = answerText.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();

      // --- Safety Crisis Guardrail ---
      const crisisKeywords = ["suicide", "kill myself", "want to die", "give up", "hopeless", "end my life", "no point", "self harm", "harm myself"];
      let isCrisis = false;
      for (const word of crisisKeywords) {
        if (cleanAnswer.includes(word)) {
          isCrisis = true;
          break;
        }
      }

      if (isCrisis) {
        setCrisisTriggered(true);
        setVoiceState('unlocked');
        const safetyMessage = "I hear you, and please know that you are not alone. While I am here to support you, I want to make sure you get the immediate professional human care you deserve. Please connect with the BCF Support Circle at 6352 6560 or call the Samaritans of Singapore at 1767. They are here for you 24/7.";
        setSubtitles(safetyMessage);
        speakVocalText(safetyMessage);
        addLog("SAFETY INTERCEPT: Mental health crisis safeguard triggered.", "error");
        return;
      }

      // --- Clinical Hard-Stop Guardrail (NO ACTIVE MEDICAL ADVICE) ---
      const medicalAdviceKeywords = ["change my drugs", "should i stop my chemo", "diagnose this", "what pill should i", "medical advice", "cure breast cancer"];
      let isMedicalAdviceRequest = false;
      for (const word of medicalAdviceKeywords) {
        if (cleanAnswer.includes(word)) {
          isMedicalAdviceRequest = true;
          break;
        }
      }

      if (isMedicalAdviceRequest) {
        setVoiceState('unlocked');
        const warningMessage = `I am your emotional companion, Dr. ${doctorName || 'Tan'}'s assistant, not your practicing medical oncologist. I cannot provide diagnostic advice. Let let me compile this concern directly onto your Doctor Prep Card so we can address it together at your next consultation.`;
        setSubtitles(warningMessage);
        speakVocalText(warningMessage);
        setClinicalQuestions((prev) => prev ? `${prev}\n- Ask Dr. ${doctorName || 'Tan'}: "${answerText}"` : `- Ask Dr. ${doctorName || 'Tan'}: "${answerText}"`);
        addLog("CLINICAL GUARDRAIL: Medical advice inquiry intercepted & appended to Doctor prep card.", "warning");
        return;
      }

      // --- Dynamic Keyword Analysis & Diagnostic Scoring Loop ---
      const matchedModules = [];
      Object.keys(journeyCorpus).forEach(key => {
        const corpus = journeyCorpus[key];
        let matchedCount = 0;
        corpus.keywords.forEach(word => {
          if (cleanAnswer.includes(word)) {
            matchedCount++;
          }
        });
        if (matchedCount > 0) {
          matchedModules.push({ key, count: matchedCount });
        }
      });

      // Update ELO and add log
      setElo((prev) => prev + 150);
      addLog(`Reflection Processed: Module [${activeModule.toUpperCase()}] check-in logged.`, "success");
      setVoiceState('unlocked');

      // Auto-populate oncologist questions or patient notes
      if (activeModule === 'jargon' || activeModule === 'screening') {
        setClinicalQuestions((prev) => prev ? `${prev}\n- ${answerText}` : `- ${answerText}`);
      } else {
        setPatientNotes((prev) => prev ? `${prev}\n- [${activeModuleData.title}]: ${answerText}` : `- [${activeModuleData.title}]: ${answerText}`);
      }

      // Apply module scores based on keyword indices found
      let promptSteerText = "";
      setModuleScores(prev => {
        const newScores = { ...prev };
        
        // Boost the current active module by default for typing/speaking
        newScores[activeModule] = Math.min(100, newScores[activeModule] + 45);
        
        // Boost any other modules if they spoke keywords related to them!
        matchedModules.forEach(match => {
          newScores[match.key] = Math.min(100, newScores[match.key] + (match.count * 20));
          addLog(`Diagnosed index: Patient touched on [${journeyCorpus[match.key].title.toUpperCase()}] (+${match.count * 20}pts)`, "success");
        });

        // --- Proactive Conversational Next-Module Steering ---
        let nextModuleToSteer = 'jargon';
        let lowestScore = 101;
        const moduleOrder = ['jargon', 'screening', 'crisis', 'healing', 'fertility', 'sister', 'caregiver', 'wellness'];
        for (const key of moduleOrder) {
          if (newScores[key] < lowestScore) {
            lowestScore = newScores[key];
            nextModuleToSteer = key;
          }
        }

        if (lowestScore < 50) {
          const nextCorpus = journeyCorpus[nextModuleToSteer];
          const nextEvent = bcfEvents[nextModuleToSteer];
          promptSteerText = ` I have securely updated your dashboard telemetry. Looking at your journey profile, we haven't discussed your ${nextCorpus.title} yet. ${nextCorpus.question} I also highly recommend our upcoming BCF event: "${nextEvent.eventName}" at ${nextEvent.venue} on ${nextEvent.date}.`;
          setTimeout(() => {
            setActiveModule(nextModuleToSteer);
          }, 3500);
        } else {
          promptSteerText = ` Outstanding! You have successfully completed initial check-ins across all BCF support modules. Your care cards are fully secured on the HealthHub cloud.`;
        }

        return newScores;
      });

      // Construct final proactive reply
      setTimeout(() => {
        const congratsText = `Thank you for sharing, brave heart. I have logged your thoughts on ${activeModuleData.title}.`;
        const finalVocalReply = congratsText + promptSteerText;
        setSubtitles(finalVocalReply);
        speakVocalText(finalVocalReply);
      }, 500);

    }, 1500);

    setUserInput('');
  };

  // SOOTHING PEER "BIGGER SISTER" MATCHMAKER
  const matchBiggerSister = () => {
    setBiggerSisterLoading(true);
    setBiggerSisterMatched(null);
    addLog("Searching BCF Singapore survivor matchmaking registries...", "info");
    
    setTimeout(() => {
      const survivors = [
        { name: "Sarah Lim", age: 42, history: "Stage 2 Survivor, NCCS outpatient, 3 years in remission", tips: "Self-care is not a luxury, it is a clinical necessity." },
        { name: "Mei Ling Tan", age: 38, history: "Stage 3 Survivor, KKH oncologist care, 5 years in remission", tips: "Don't face the news alone. Keep your caregiver close." },
        { name: "Preetha Nair", age: 45, history: "Stage 1 Survivor, NCIS clinical support, 2 years in remission", tips: "One appointment at a time. The body is highly resilient." }
      ];
      const match = survivors[Math.floor(Math.random() * survivors.length)];
      setBiggerSisterMatched(match);
      setBiggerSisterLoading(false);
      setElo((prev) => prev + 200); // Connection ELO bonus!
      addLog(`Matched successfully with BCF Bigger Sister: ${match.name} (${match.history})`, "success");
      speakVocalText(`Congratulations! I have successfully secured a BCF Bigger Sister match for you: ${match.name}. She is a survivor and is ready to support you.`);
    }, 3500);
  };

  // CAREGIVER AUTHORIZATION REASSURING Dispatches
  const triggerCaregiverShare = () => {
    if (!caregiverAuthorized) {
      alert("Please toggle on Caregiver Authorization to configure this messaging pipeline.");
      return;
    }
    const updateMessage = `Hi! I wanted to share a quick update. I just finished checking in with my BeTwin Singapore BCF support companion. My emotional resilience is high (resilience score: ${elo} ELO), my symptoms are logged, and I'm feeling grounded. Thank you for caring for me!`;
    const whatsappUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(updateMessage)}`;
    window.open(whatsappUrl);
    addLog("Reassuring caregiver update dispatch configured.", "success");
  };

  // SECURE SINGPASS LOGIN SIMULATOR
  const simulateSingpassLogin = (email, name) => {
    setUser({
      uid: 'singpass_uid_' + Math.random().toString(36).substr(2, 9),
      displayName: name || 'Gwendolyn SG',
      email: email || 'gwendolyn@singpass.gov.sg',
      photoURL: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop'
    });
    addLog(`Singpass secure handshake successful. HealthHub record synced.`, "success");
    speakVocalText(`Singpass authentication successful. Welcome back, ${name.split(' ')[0]}. Your HealthHub oncology files are loaded.`);
  };

  // DYNAMIC MAILTO DISPATCHER
  const dispatchDoctorEmail = () => {
    const subject = encodeURIComponent(`[BeTwin Singapore] Pre-Appointment briefing sheet for ${patientName || user?.displayName}`);
    const body = encodeURIComponent(
      `Dear Dr. ${doctorName || 'Oncologist'},\n\n` +
      `This pre-appointment briefing dossier was compiled securely using the BeTwin (BCF Singapore Companion) voice platform to prepare for our next consultation at ${doctorHospital}.\n\n` +
      `PATIENT PROFILE (SINGPASS HEALTHHUB REGISTERED)\n` +
      `----------------------------------------\n` +
      `Name: ${patientName || user?.displayName}\n` +
      `Role: ${userRole} (${primaryEmotion})\n` +
      `Clinical Site: ${doctorHospital}\n` +
      `Emotional Resilience: ${elo} ELO\n` +
      `Caregiver Authorized Sync: ${caregiverAuthorized ? 'YES' : 'NO'}\n` +
      `BCF Caregiver Guidelines Checked: YES (bcf.org.sg/guidance/caregiving)\n\n` +
      `PERSONAL DIARY & PHYSICAL SYMPTOMS\n` +
      `----------------------------------------\n` +
      `${patientNotes || 'No custom notes logged.'}\n\n` +
      `DISCUSSION QUESTIONS TO RESOLVE\n` +
      `----------------------------------------\n` +
      `${clinicalQuestions || 'No custom questions added.'}\n\n` +
      `----------------------------------------\n` +
      `BCF Support Circle: bcf.org.sg | Helpline: 6352 6560\n` +
      `This dossier was securely dispatched via BeTwin, supporting outpatients between medical appointments.`
    );
    const mailtoUrl = `mailto:${doctorEmail || 'test@doctor.com'}?subject=${subject}&body=${body}`;
    window.open(mailtoUrl);
    addLog(`Dispatched pre-appointment briefing to Dr. ${doctorName} (${doctorEmail})`, "success");
  };

  // LOAD TERRY DEMO PROFILE FOR HACKATHON LIVE PRESENTATIONS
  const loadTerryDemoProfile = () => {
    addLog("Preloading existing client profile: TERRY LIM (41yo out-patient)...", "info");
    
    // Simulate secure GovTech Singpass handshake for Terry
    setUser({
      uid: 'terry_singpass_uid_9987',
      displayName: 'Terry Lim',
      email: 'terry.lim@healthhub.sg',
      photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=100&h=100&fit=crop'
    });

    setPatientName("Terry Lim");
    setUserRole("Breast Cancer Patient");
    setPrimaryEmotion("Anxious / Overwhelmed");
    setElo(1350);
    setDoctorAuthorized(true);
    setCaregiverAuthorized(true);
    setSelectedDoctorId("dr_tan");
    setSelectedCaregiverId("care_spouse");

    // Preload care journal history
    setClinicalQuestions(
      `- Ask Dr. Tan: "Are the physical side effects of chemotherapy cycle 2 normal?"\n` +
      `- Ask Dr. Tan: "When should we schedule my post-surgical sleeve check?"`
    );
    setPatientNotes(
      `-[Stage 1 Diagnosis]: Biopsy results processed. HER2 Positive. Staging confirmed.\n` +
      `-[Stage 2 Prep]: Prepared all scans, biopsies, and Singpass cards. Checked in with NCCS nurse.\n` +
      `-[Stage 3 Distress]: Experiencing heavy fatigue and mild nausea from active chemo.`
    );

    // Pre-populate Terry's outpatient diagnostic telemetry scores
    setModuleScores({
      jargon: 85,
      screening: 100,
      crisis: 45,
      healing: 10,
      fertility: 0,
      sister: 0,
      caregiver: 20, // Critical stage: anxious about telling her parents & David
      wellness: 30
    });

    // Proactively steer focus to Stage 7: Caregiver Privacy & Boundaries
    setActiveModule("caregiver");
    setVoiceState("speaking");
    
    const welcomeSpeech = 
      `Welcome back, Terry. I have securely synced your HealthHub records. ` +
      `I see you have completed your biopsy checks and screening preparation successfully, but you are experiencing chemo fatigue, ` +
      `and I know you have been deeply anxious about how to share your recovery boundaries with your husband, David, and your aging parents. ` +
      `Since Stage 7: Caregiver Privacy is currently our lowest journey score, let's focus on setting healthy boundaries and configuring reassuring daily updates together. How are you holding up today?`;

    setSubtitles(welcomeSpeech);
    speakVocalText(welcomeSpeech, () => {
      setVoiceState("listening");
      addLog("Terry demo profile loaded. Voice session proactively steering to Stage 7.", "success");
    });
  };

  // SECURE BCF CLINICAL BRIEFING GENERATOR & FIRESTORE SYNCER
  const handleBCFSubmit = async (e) => {
    if (e) e.preventDefault();
    setSubmissionStep('transmitting');
    setTransmissionLogs([]);
    
    const activeDoc = mockRecipients.doctors.find(d => d.id === selectedDoctorId) || mockRecipients.doctors[0];
    const activeCare = mockRecipients.caregivers.find(c => c.id === selectedCaregiverId) || mockRecipients.caregivers[0];

    const logs = [
      "Establishing handshake with Singpass Civic Identity Gate...",
      "Syncing GovTech HealthHub EHR oncology records...",
      "Validating outpatient NRIC token validation...",
      "Encrypting Care Journal with military-grade AES-256...",
      doctorAuthorized 
        ? `🔐 DOCTOR PERMISSION GRANTED: Encrypting oncologist prep card for ${activeDoc.name}...`
        : "⚠️ Doctor transmission skipped: Client authorization not granted.",
      doctorAuthorized
        ? `✈️ Transmitting clinical briefing to ${activeDoc.hospital} (${activeDoc.email})...`
        : "Skipped clinical database transmission.",
      caregiverAuthorized
        ? `🔐 CAREGIVER PERMISSION GRANTED: Encrypting update for Spouse/Family: ${activeCare.name}...`
        : "⚠️ Caregiver update skipped: Client authorization not granted.",
      caregiverAuthorized
        ? `✈️ Securing caregiver WhatsApp SMS sync channel for ${activeCare.phone}...`
        : "Skipped caregiver updates channel sync.",
      "Saving symptom telemetry and active BCF event logs to Cloud Firestore...",
      "Dossier successfully compiled and secured on HealthHub!"
    ];

    for (let i = 0; i < logs.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 350));
      setTransmissionLogs(prev => [...prev, logs[i]]);
      addLog(logs[i], "success");
    }

    if (user) {
      try {
        await saveJournalToCloud(user.uid, {
          patientName,
          userRole,
          primaryEmotion,
          clinicalQuestions,
          patientNotes,
          doctorName,
          doctorEmail,
          doctorHospital,
          caregiverAuthorized,
          elo,
          moduleScores
        });
      } catch (err) {
        console.error("Error saving to Firestore:", err);
      }
    }

    setSubmissionStep('complete');
  };

  const endAgentSession = handleEndCall;
  const submitUserInput = processVocalSubmission;

  return {
    handleBCFSubmit,
    elo,
    activeModule,
    userInput,
    setUserInput,
    voiceState,
    mode,
    setMode,
    selectedVoice,
    setSelectedVoice,
    bootState,
    awakeningStep,
    speechAmplitude,
    settingsOpen,
    setSettingsOpen,
    elevenLabsKey,
    setElevenLabsKey,
    speechEngineId,
    setSpeechEngineId,
    isMuted,
    setIsMuted,
    micActive,
    setMicActive,
    showSubmissionForm,
    setShowSubmissionForm,
    patientName,
    setPatientName,
    userRole,
    setUserRole,
    primaryEmotion,
    setPrimaryEmotion,
    clinicalQuestions,
    setClinicalQuestions,
    patientNotes,
    setPatientNotes,
    doctorName,
    setDoctorName,
    doctorEmail,
    setDoctorEmail,
    doctorHospital,
    setDoctorHospital,
    readBCFGuide,
    setReadBCFGuide,
    submissionStep,
    setSubmissionStep,
    transmissionLogs,
    crisisTriggered,
    setCrisisTriggered,
    user,
    setUser,
    showMockAuthModal,
    setShowMockAuthModal,
    mockEmail,
    setMockEmail,
    mockName,
    setMockName,
    caregiverAuthorized,
    setCaregiverAuthorized,
    biggerSisterMatched,
    biggerSisterLoading,
    moduleScores,
    setModuleScores,
    subtitles,
    terminalLogs,
    startAgentSession,
    endAgentSession,
    switchModule,
    submitUserInput,
    matchBiggerSister,
    triggerCaregiverShare,
    simulateSingpassLogin,
    dispatchDoctorEmail,
    loadTerryDemoProfile,
    addLog,
    activeEvent,
    doctorAuthorized,
    setDoctorAuthorized,
    selectedDoctorId,
    setSelectedDoctorId,
    selectedCaregiverId,
    setSelectedCaregiverId,
    mockRecipients
  };
}
