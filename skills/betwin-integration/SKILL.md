---
name: betwin-integration
description: Provides detailed, step-by-step instructions for Claude to seamlessly integrate the BeTwin voice companion (Axiom Hope) React hook, states, and telemetry data into custom visual components.
---

# Skill: BeTwin Singapore Voice Companion Integration Manual

This skill manual instructs **Claude** (or any AI coding assistant) on how to instantly integrate the stateful voice agent ("brain") and diagnostics dashboard of **BeTwin (Axiom Hope)** into JO's custom visual frontend designs in React.

---

## 1. Context & Codebase Mapping
The repository contains the following core files under the `voice-agent` branch:
1.  **`src/hooks/useVoiceAgent.js`**: The master stateful hook. Manages ElevenLabs WebRTC conversational sockets, SpeechRecognition fallback systems, calming speech pacing, secure Singpass authentication, and symptom telemetry scores.
2.  **`src/data/journeyCorpus.json`**: Clinician-curated research database containing the 8 stages of the breast cancer life-journey, keywords, comforting prompts, and clinical math LaTeX formulas.
3.  **`resources/clinical_resources.json`**: Clinical directories listing validated public/private Singapore hospitals (NCCS, NCIS, SGH, KKH), BCF guidelines, and crisis helplines.

---

## 2. Core Hook API: `useVoiceAgent` Mappings

Feed this state definition directly to Claude to ensure correct props are referenced:

```javascript
import useVoiceAgent from '../hooks/useVoiceAgent';

const agent = useVoiceAgent();
```

### Stateful Variables:
*   `agent.elo` (`Number`): The emotional resilience ELO score. Start: `1000`.
*   `agent.activeModule` (`String`): Active stage key (`'jargon'`, `'screening'`, `'crisis'`, `'healing'`, `'fertility'`, `'sister'`, `'caregiver'`, `'wellness'`).
*   `agent.voiceState` (`String`): Voice status (`'idle'`, `'listening'`, `'thinking'`, `'speaking'`).
*   `agent.subtitles` (`String`): spoken teletype captions showing what Axiom or user is saying.
*   `agent.speechAmplitude` (`Number`): Dynamic audio amplitude (0.0 to 1.0) synced to spoken speech, perfect for scaling orb graphics.
*   `agent.moduleScores` (`Object`): 0-100 progress scores mapping the 8 stages (`{ jargon: 0, screening: 0, ... }`).
*   `agent.crisisTriggered` (`Boolean`): Set to `true` if crisis keywords are spoken, triggering the helpline card.
*   `agent.caregiverAuthorized` (`Boolean`): Caregiver slider toggle.
*   `agent.biggerSisterMatched` (`Object`): Matched BCF remission peer details.
*   `agent.user` (`Object`): Singpass profile details (`displayName`, `email`, `photoURL`) if authenticated.

### Action Controllers:
*   `agent.startAgentSession()`: Awakens Axiom Hope. Starts speech socket.
*   `agent.endAgentSession()`: Places Axiom Hope in standby.
*   `agent.submitUserInput(text)`: Submits written symptom check-ins.
*   `agent.switchModule(key)`: Manually shifts journey focus.
*   `agent.handleBCFSubmit(e)`: Compiles Care Journal form and saves to Firestore.
*   `agent.matchBiggerSister()`: Triggers BCF peer search.
*   `agent.dispatchDoctorEmail()`: Opens oncologist pre-appointment briefing mail window.

---

## 3. Step-by-Step Integration Instructions for Claude

### Step 1: Initialize Dual-Portal Workspace
Establish a state variable inside your main layout component to divide the view. This hides complex scores from patients to prevent alarm:
```javascript
const [portalView, setPortalView] = React.useState('patient'); // 'patient' | 'clinician'
```
Add a toggle button inside the navbar:
*   **Patient Care View**: Shows the meditating voice orb, subtitles, simple chat input, and Care Journal card.
*   **Doctor Telemetry Dashboard**: Shows the clinical Wolfram console and progress grid.

### Step 2: Mount the Calming Voice Orb (Patient View)
You do not need to construct SVG oscilloscopes or styling rules from scratch. A fully pre-styled standalone **VoiceOrb** is available in the codebase. It renders a warm, serene **blue-green breathing gradient orb** inside an elegant **white card** container:

```javascript
import VoiceOrb from '../components/VoiceOrb';

// Inside your Patient View JSX:
<VoiceOrb 
  voiceState={agent.voiceState}
  bootState={agent.bootState}
  speechAmplitude={agent.speechAmplitude}
  onOrbClick={agent.startAgentSession}
/>
```
*   **Animations**: The component automatically handles scaling transitions (`scale(1 + amplitude * 0.16)`) and serene green/teal glow shadows synced to speech.
*   **Click Handler**: The `onOrbClick` callback handles awakening or silencing Axiom Hope dynamically when clicked.

### Step 3: Wire the 8-Module Progress Grid (Clinician View)
Map the `agent.moduleScores` object into a beautifully structured 2x4 telemetry grid for oncology nurses or oncologists:
```javascript
const modulesList = [
  { key: 'jargon', label: '1. Biopsy Jargon', icon: '📖' },
  { key: 'screening', label: '2. Clinic Readiness', icon: '📋' },
  { key: 'crisis', label: '3. Distress Side Care', icon: '🛡️' },
  { key: 'healing', label: '4. Mastectomy Recovery', icon: '🩹' },
  { key: 'fertility', label: '5. Fertility Preserv', icon: '👶' },
  { key: 'sister', label: '6. Peer Matchmaker', icon: '🤝' },
  { key: 'caregiver', label: '7. Caregiver Bounds', icon: '🔒' },
  { key: 'wellness', label: '8. Wellness & Grants', icon: '💰' }
];

// Inside Clinician view JSX:
<div className="telemetry-grid">
  {modulesList.map(mod => {
    const score = agent.moduleScores[mod.key] || 0;
    const isActive = agent.activeModule === mod.key;
    return (
      <div key={mod.key} className={`telemetry-card ${isActive ? 'active-glow' : ''}`}>
        <span>{mod.icon} {mod.label}</span>
        <span className="score">{score}%</span>
        <div className="progress-track">
          <div className="progress-bar-fill" style={{ width: `${score}%` }} />
        </div>
      </div>
    );
  })}
</div>
```

### Step 4: Handle Singpass Authentication
Provide a trigger button in the navbar for mock GovTech Singpass scans:
```javascript
<button onClick={() => agent.setShowMockAuthModal(true)}>
  🇸🇬 SINGPASS LOGIN
</button>
```

### Step 5: Mount Safety Helplines Redirection
Always check for `agent.crisisTriggered`. If true, mount a fullscreen absolute overlay blocking other cards, prompting with direct-call links:
*   BCF Support: `6352 6560`
*   SOS 24/7 Helpline: `1767`
*   IMH Mental Wellness: `6389 2222`

---

## 4. Troubleshooting & Bundle Correctness
*   **Firestore Sandbox Mode**: If `agent.user` is signed out, the hook automatically stores symptom telemetry inside a local `localStorage` sandbox, allowing fully functional presentations even without internet access.
*   **Pacing Cadence**: The local voice synthesis uses a slower 0.88x speed pacing to regulate patients' breathing. Ensure that `speechSynthesis` is unblocked in the client's browser permissions.
