# BeTwin // Hackathon Pitch & Judging Alignment Specification
## Outpatient Conversational Telemetry Platform (BCF Singapore Companion)

This document maps the **BeTwin Agent** platform's technical implementation and clinical features against the official hackathon judging criteria. It provides our foundational engineering and agentic answers and establishes dedicated placeholders for **JO & AUDREY (Frontend UI-UX & Pitch)**, **GWEN / US (Core Platform & AI Engineers)**, and **RACHAEL (Clinical Research)** to input their specialized alignments for the final pitch.

---

## 1. Problem Relevance & Empathy (30%)
*Does it address a genuine need for the stakeholders? We want to see evidence of real user or stakeholder research, not just assumed understanding of the problem.*

### 🛠️ Foundational Technical & Agentic Answers
*   **The Outpatient Gap**: There is an immense gap *between* active oncologist consultations where patients (like Terry) experience severe physical distress, diagnostic confusion, and emotional isolation. 
*   **The Empathy Loop**: The BeTwin Agent does not act as a cold information portal. It uses a **Soothing, Empathetic Speech CADENCE (0.88x speed)** mimicking paced breathing, and proactively guides the user through the **8 critical lifecycle stages** (Jargon, Readiness, Side Effects, Reconstruction, Fertility, Peer Sisters, Caregiver Privacy, Wellness) so she never feels lost or isolated.
*   **Trauma-Informed Data Isolation**: The system implements a **Dual-Portal View** (Patient View vs. Clinician View) so that Terry never sees threatening, complex clinical diagnostic scores or LaTeX equations that could trigger health anxiety or alarm.

### 👩‍⚕️ Clinical Research Contributions (RACHAEL to complete)
> [!IMPORTANT]
> **RACHAEL (Clinical Lead)**: Please add verified research points, oncologist feedback (e.g., from NCCS, NCIS, or SGH), and patient survey statistics highlighting why outpatients fail to track side effects or struggle to communicate boundaries with their families.
> *   *Placeholder for Rachael's patient research findings...*
> *   *Placeholder for clinician feedback on pre-appointment briefing cards...*

### 📣 Stakeholder Narrative (JO & AUDREY to complete)
> [!TIP]
> **JO & AUDREY (Frontend & Pitch Presentation)**: Please capture the voice of real-life breast cancer survivors in Singapore, outlining the "why" behind the BeTwin platform, Terry's demographic reality, and how we map to the Breast Cancer Foundation's (BCF) core caregiving priorities.
> *   *Placeholder for Terry's persona validation...*
> *   *Placeholder for stakeholder interviews...*

---

## 2. Technical Effectiveness & Guardrails (20%)
*Does the solution actually work? We prioritize technical robustness, followed by thoughtful use of AI. For AI components: are there appropriate guardrails to prevent harmful outputs to vulnerable users?*

### 🛠️ Foundational Technical & Agentic Answers
*   **Decoupled Hook-Based Brain**: All speech analytics, keyword extraction, and steering algorithms are fully encapsulated in a modular React hook (`useVoiceAgent.js`), allowing JO to separate the stateless visual layer from the core state machine.
*   **Vite & Production Stability**: The codebase features 100% build stability with Rolldown compilation, serving a fully functional React client and a standalone HTML sandbox (`public/test.html`).
*   **Trauma-Informed Safety Shield (Crisis Interceptor)**: Hardcoded guardrails intercept suicide, hopelessness, or self-harm keywords, instantly locking clinical dashboards, speaking comfort, and rendering verified 24/7 Singapore helplines:
    *   **Samaritans of Singapore (SOS)**: `1767`
    *   **Institute of Mental Health (IMH)**: `6389 2222`
    *   **BCF Support Circle**: `6352 6560`
*   **Clinical Advice Interceptor**: Captures requests for active medical advice (e.g., medication changes), redirects the user to their oncologist, and automatically files the concern onto their **Doctor Prep Card** so they are prepared for their next checkup.

### 💻 Developer Implementation & Visual Shell (JO & AUDREY to complete)
> [!IMPORTANT]
> **JO & AUDREY (Frontend Devs & Designers)**: Please outline your integration details working with Claude, how you plugged our hooks into your custom design shells, and the visual architecture of the standalone white card components.
> *   *Placeholder for JO & AUDREY's React component structure...*
> *   *Placeholder for HMR, bundler config, and code-splitting integrations...*

---

## 3. User Experience & Sensitivity (20%)
*Is it clear, easy to use, and appropriate in tone? Does the design feel trauma-informed, with language that is non-judgmental and safe for someone in a vulnerable situation?*

### 🛠️ Foundational Technical & Agentic Answers
*   **Warm Breathing Orb**: We completely eliminated intimidating designs (like red HAL eye lenses) and replaced them with a standalone, serene **Blue-Green Gradient Breathing Orb** (`VoiceOrb.jsx`) pulsing dynamically to physical vocal amplitude (`scale(1 + amplitude * 0.16)`).
*   **Paced Guided Meditation**: Renders a dedicated 4-4-4 diaphragmatic breathing visualizer (Inhale, Hold, Exhale) running at a slow rate to induce parasympathetic calming.
*   **Non-Judgmental Captions**: Subtitles type out warm, supportive phrases (e.g. *"Thank you for sharing, brave heart. I have logged your thoughts..."*).
*   **Authorized Care Transmission & Consent Gates**: The patient holds absolute control over their data. Information is never transmitted without explicit toggle permissions inside the **Compilation Center**, offering selective authorizations for oncologist EHR syncs and family caregiver dispatches.

### 🎨 Visual Theme & UX Language (JO & AUDREY to complete)
> [!NOTE]
> **JO & AUDREY (UX & Design Leads)**: Please add descriptions of the frosted-glass Light Theme design language, soft rose/teal color palettes, typography selections, and why this layout reduces cognitive load for oncology outpatients.
> *   *Placeholder for design system color tokens and micro-interactions...*
> *   *Placeholder for user test feedback on card-based layouts...*

---

## 4. Storytelling & Demo (15%)
*Does the live demo work? Can the team communicate the human stakes, not just the technical ones? Judges should feel the real-world impact, not just understand the feature set.*

### 🛠️ Foundational Technical & Agentic Answers
*   **Preloaded Terry Demo Profile**: Pre-calibrates Terry's outpatient profile (41yo, Stage III, 1350 ELO, assigned NCCS clinicians) via simulated Singpass government auth, triggering proactive spoken welcome steering that guides judges straight to her Stage 7 Caregiver boundary conflicts.
*   **Interactive Sandbox Page (`test.html`)**: Mirrors the exact proactive steering, ELO scores, crisis shields, and WhatsApp caregiver update generators in a single drop-in package.
*   **Selective Sync Demonstrations**: Clicking the **DISPATCH SECURE REASSURANCES** button prints realistic, beautiful teletype sync logs in the terminal, demonstrating actual consent-gate checks for both doctors and family members in real-time.

### 🎬 Live Pitch Storytelling Script (JO & AUDREY to complete)
> [!TIP]
> **JO & AUDREY (Presenters)**: Please detail the step-by-step human narrative for the live pitch, showing the contrast between Terry's anxiety at the start and her sense of relief once she syncs her prep cards.
> *   *Stage 1: Introducing Terry Lim and the reality of the Outpatient Gap in Singapore...*
> *   *Stage 2: Voice session demo - letting judges hear the slow 0.88x pacing and see the breathing blue-green bubble...*
> *   *Stage 3: Talk to Action - Showing the Singpass handshake, consent-gate toggles, and dispatching briefs...*

---

## 5. Creativity & Originality (10%)
*Is it a fresh idea, not just a basic chatbot or info page? Does it solve the problem in a genuinely clever or unexpected way?*

### 🛠️ Foundational Technical & Agentic Answers
*   **Proactive Chronological Steering**: Instead of a generic question-and-answer chatbot, the BeTwin Agent actively analyzes patient telemetry, detects their lowest-score lifecycle stages, and programmatically steers the conversation to untouched topics.
*   **Active Stage Event Matching**: Ingests actual localized Singapore BCF events and workshops (e.g. Mastectomy Healing circles at Bishan, Young Outpatients panels at KKH), matching them to active stages and recommending them directly in verbal dialog.
*   **Mathematical Telemetry Derivations**: Uses clinical formulas (e.g., oocyte preservation and distress tolerance integrations) to display a beautiful, professional Outpatient Telemetry Grid, giving healthcare organizations diagnostic depth.

### 💡 Novel Design Concepts (JO/AUDREY & RACHAEL to complete)
> [!NOTE]
> **JO/AUDREY & RACHAEL**: Add details on why a voice-guided, telemetry-tracked Outpatient Companion is superior to traditional static brochures or clinical symptom forms.
> *   *Placeholder for clinical novelty and patient engagement innovations...*
> *   *Placeholder for custom peer sister matchmaking algorithms...*

---

## 6. Feasibility & Next Steps (5%)
*Could a real NGO or healthcare organisation realistically adopt this? Does the team have a clear vision beyond the prototype?*

### 🛠️ Foundational Technical & Agentic Answers
*   **Clinician-Curation Panel (`resources/`)**: Rachael the clinician can edit all emergency helplines, BCF guidelines, and Singapore hospital directories inside `clinical_resources.json` without writing a single line of React code. This makes the system instantly adaptable for any NGO.
*   **NGO Integration Manual (`SKILL.md`)**: A complete, step-by-step developer integration manual is packaged in `skills/betwin-integration/SKILL.md` to show NGOs exactly how to wire their databases to the hook in 10 minutes.
*   **Singpass & HealthHub Compatibility**: Built from the ground up to support Singpass credentials and JSON-based EHR payloads, allowing seamless integration with Singapore's national HealthHub cloud infrastructure.

### 🚀 Future Roadmap & Hospital Integration (RACHAEL & JO/AUDREY to complete)
> [!IMPORTANT]
> **RACHAEL & JO/AUDREY**: Please detail the pilot rollout plan, detailing hospital integrations (e.g., SingHealth NCCS / NUHS NCIS), corporate sponsorships, and plans to recruit and match Bigger Sisters across Singapore.
> *   *Step 1: Pilot testing with 100 outpatients at NCCS Breast Oncology clinic...*
> *   *Step 2: Integration with HealthHub's outpatient care plan module...*
> *   *Step 3: Expanding BCF volunteer matches to 500+ remission survivors...*
