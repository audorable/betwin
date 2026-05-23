# BCF Hope Companion (Axiom Hope) // Agent Feature & Resource Guide
## Outpatient Conversational Steering, Safety Guardrails, and Singapore Resource Directory

This document serves as the comprehensive feature guide for the **BCF Hope Companion (Axiom Hope)**, detailing the active capabilities of the voice agent, its trauma-informed safety architectures, and how it maps to real-life breast cancer support organisations and clinical resources in Singapore.

---

## 1. Executive Summary of Agent Capabilities

The **BCF Hope Companion (Axiom Hope)** is a specialized, trauma-informed conversational agent designed to support breast cancer patients (like Terry) in the critical periods *between* medical appointments. The agent acts as an emotional companion, progress tracker, and information routing hub, ensuring patients are empowered rather than alarmed.

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          🌸 DUAL-PORTAL ARCHITECTURE                    │
├────────────────────────────────────────┬────────────────────────────────┤
│            🌸 PATIENT VIEW             │           🩺 CLINICIAN VIEW    │
│  • Serene Blue-Green Voice Orb        │  • 2x4 Outpatient Telemetry Grid│
│  • Guided Meditative Breathing (4-4-4) │  • Real-time Keyword Diagnostics│
│  • Visual Spoken Subtitles             │  • Dynamic ELO Resilience Trend │
│  • BCF Community Events bulletin board │  • LaTeX Clinical Scoring Specs │
│  • Bigger Sister Matchmaker Profiles   │  • Raw Teletype Permission Logs │
└────────────────────────────────────────┴────────────────────────────────┘
```

---

## 2. Core Functional Features

### A. Serene Standalone Voice Orb (`VoiceOrb.jsx`)
*   **Visual Pacing**: Replaces intimidating designs with a tranquil, breathing oceanic gradient (turquoise, cyan, emerald green).
*   **Vocal Physics**: Pulses and glows dynamically in real-time (`scale(1 + amplitude * 0.16)`) synchronized to active speech.
*   **Guided Breathing Zone**: Features a integrated 4-4-4 diaphragmatic breathing visualizer (Inhale, Hold, Exhale) running at a restorative 0.88x vocal speed to reduce parasympathetic distress.

### B. Proactive Conversational Steering Engine
*   **8 Lifecycle Stages**: Maps the patient's outpatient journey across 8 critical modules (Diagnosis & Jargon, Screening prep, Distress/Side effects, Surgery/Mastectomy healing, Fertility preservation, Bigger Sister peer matching, Caregiver boundaries, and Emotional wellness).
*   **Lowest-Score Pivot**: Rather than waiting for patients to ask, the agent continuously tracks progress across the 8 stages, identifies the lowest score ($<50\%$), and proactively steers the spoken dialogue (e.g. *"I have logged your side effects. Looking at your journey profile, we haven't discussed fertility preservation yet. What questions do you have about egg freezing?"*).
*   **BCF Local Event Ingestion**: Automatically matches and suggests localized Singapore workshops (mapped to each stage in `bcfEvents.json`) during conversation.

### C. Trauma-Informed Clinical Guardrails
*   **Emergency Crisis Safeguard**: Instantly intercepts distress terms (`"suicide"`, `"hopeless"`, `"self harm"`, etc.), speaks an immediate comforting reassurance, locks clinical metrics to avoid panic, and presents one-click hotlines to verified Singapore emergency care.
*   **Medical Advice Interceptor**: Detects queries asking to alter chemo dosages, drugs, or medical diagnoses, gently reminds the patient of its companion boundary, and automatically logs the question onto the **Doctor Prep Card** for their next oncologist visit.

### D. Authorized Care Transmission & Singpass Sync
*   **Singpass EHR Handshake**: Simulates secure authentication (`terry_singpass_uid_9987`) to preload clinical demographics, oncologist assignments, and diagnostic history.
*   **Caregiver WhatsApp Updater**: Lets patients toggle explicit permissions to dispatch supportive, reassuring status templates to caregivers without violating privacy boundaries.
*   **Oncologist Briefing Dossiers**: Allows patients to export their compiled journal notes, active side-effects, and oncologist prep questions into a native pre-formatted briefing email sent directly to their clinician.

---

## 3. Real-Life Singapore Care Directory & Agent Mappings

When patients like Terry encounter complex outpatient challenges—such as wanting to change clinicians, finding peer support circles, or seeking clinical financial grants—the agent maps these needs directly to real-life Singapore resources.

### Scenario A: Terry Wants to Change Her Clinician / Seek a Second Opinion
In Singapore's public oncology network, changing clinicians requires specific pathways. The agent supports this transition by preparing the patient and providing structured data.

*   **Real-Life Singapore Pathway**:
    1.  **Within the Same Institution (e.g., NCCS)**: Patients can request a change of consultant oncologist by contacting their primary nurse coordinator, raising a request with the clinic manager, or asking to speak with an assigned **Medical Social Worker (MSW)**. The Patient Relations / Service Quality department facilitates compatible transfers.
    2.  **Between Public Hospital Systems (e.g., NCCS to NCIS or SGH)**: To maintain government-subsidized care rates, the patient must visit a Polyclinic or a GP clinic under the Community Health Assist Scheme (CHAS) to secure a new official referral letter to the target hospital.
    3.  **Private Sector Transfer**: Patients can schedule direct consultations with private clinics at Mount Elizabeth, Gleneagles, or Raffles Cancer Centre.
*   **How the Agent Facilitates This**:
    *   The agent's **Settings Panel** holds a verified registry of Singapore's leading oncology centres (NCCS, NCIS, SGH, KKH).
    *   The **Medical Advice Interceptor** captures Terry's doubts or clinic concerns, filing them onto her **Doctor Prep Card**.
    *   The **Dispatch Doctor Prep Card** action compiles all typed symptoms, biopsy data, and clinical questions into an exportable, professional email dossier. Terry can bring this clean summary to a new polyclinic, MSW, or second-opinion oncologist, ensuring no critical history is lost.

---

### Scenario B: Terry Wants to Find Support Groups
Outpatient isolation is highly prevalent. Terry is a 41-year-old mother who is worried about being a burden to her husband and aging parents. She needs peer circles where she can speak freely.

*   **Real-Life Singapore Support Groups**:
    1.  **Breast Cancer Foundation (BCF) Singapore**:
        *   *BCF Support Circle*: A weekly peer-led discussion circle, emotional sharing network, and caregiver training program.
        *   *Bigger Sister Peer Mentorship Program*: Pairs newly diagnosed "Little Sisters" with breast cancer survivors in stable remission ("Bigger Sisters") based on age group, clinical staging, and treatment hospital.
        *   *Therapeutic Clubs*: Dragon boating (BCF Paddlers in the Pink), Healing Laughter, and post-surgery sewing circles.
        *   *Helpline*: +65 6352 6560 (Mon-Fri, 9am-6pm) | *Website*: [www.bcf.org.sg](https://www.bcf.org.sg)
    2.  **Singapore Cancer Society (SCS)**:
        *   *Reach to Recovery (RTR)*: A dedicated peer support group specifically for breast cancer patients, providing home/hospital visitation, recovery exercises, and prosthesis guidance.
        *   *SCS Rehabilitation Centre @ Jurong Medical Centre*: Singapore’s premier community facility for post-surgical physical therapy, exercise, and lymphoedema management.
        *   *Helpline*: 1800 727 3333 | *Website*: [www.singaporecancersociety.org.sg](https://www.singaporecancersociety.org.sg)
    3.  **Hospital-Specific Outpatient Groups**:
        *   *Bloom (NCCS)*: In-house breast cancer patient support group organizing educational panels and mindfulness workshops.
        *   *Women’s Support Group (NCIS)*: A nurse-led counseling and discussion group held monthly.
        *   *Alpine Bloom (KKH)*: Designed specifically for women traversing gynaecological and breast oncology treatments.
*   **How the Agent Facilitates This**:
    *   **Bigger Sister Matchmaker**: The agent's dedicated peer search panel matches Terry to survivors in remission who underwent similar treatment paths (e.g. matching her with *Preetha Nair, 45, Stage 1 Survivor, NCIS Clinical Support*).
    *   **Blackboard Notices**: Dynamically displays upcoming BCF workshops corresponding to the current stage, such as the *Mastectomy Healing Circle* at Bishan or the *BCF Bigger Sister Luncheon* at the Singapore Botanic Gardens.

---

### Scenario C: Terry Wants to Find More Information & Financial Aid
As a mother balancing care for her children and aging parents, Terry faces financial and logistical worries.

*   **Real-Life Singapore Information & Financial Resources**:
    1.  **Financial Subsidies & Grants**:
        *   *BCF Financial Assistance Schemes*: Provides one-off compassionate grants and mammogram/prosthesis subsidies for low-income patients.
        *   *SCS Cancer Care Fund*: A one-off welfare grant to assist newly diagnosed, low-to-middle-income cancer patients with immediate living expenses.
        *   *MediShield Life & MediSave*: National health insurance plans that cover surgery, ward costs, and outpatient cancer treatments on the cancer drug list (CDL).
        *   *Medical Social Work (MSW) Depts*: Found in all public hospitals (NCCS, SGH, KKH, NCIS), providing custom financial assessments for MediFund applications.
    2.  **Educational Repositories**:
        *   *HealthHub Singapore*: The national health portal offering verified articles on breast cancer staging, surgical recovery, and nutrition.
        *   *BCF Caregiver Handbook*: A supportive toolkit designed for family members, teaching them boundaries, distress management, and physical care basics.
*   **How the Agent Facilitates This**:
    *   **Clinical Resources Registry (`resources/clinical_resources.json`)**: Rachel the clinician can update clinical guidelines and financial link databases in real-time, which the agent immediately absorbs and presents to the patient.
    *   **Emotional Wellness Stage 8 Guides**: When Terry reaches the Wellness stage, the agent's steering engine recommends the *Stigma Mitigation & Financial Oncology Grant Guide* workshop at Tan Tock Seng Hospital, providing an immediate pathway to cost-saving options.

---

## 4. Current Agent Feature Set Checklist

Here is a verification checklist mapping what the agent currently executes on the dedicated `voice-agent` branch of the `betwin` repository:

*   [x] **Serene breathing orb visualizer** with gradient transitions (no more scary HAL red).
*   [x] **Dual-Portal Mode toggle** completely isolating patient meditation from clinical telemetry.
*   [x] **GovTech Singpass mock credential integration** preloading Terry Lim's profile details.
*   [x] **Proactive steering state machine** pivoting dialog to the lowest-score lifecycle module.
*   [x] **Local 0.88x speech synthesizer fallback** with structured paced breathing text.
*   [x] **Singapore Cancer Emergency guardrails** intercepting crisis/advice queries.
*   [x] **Mock Doctor & Caregiver directories** mapping real-life NCCS, NCIS, and SGH consultants.
*   [x] **Explicit consent-gate sliders** for authorized caregiver WhatsApp and EHR oncological syncing.
*   [x] **Pre-formatted Oncologist email dossier generator** with symptoms, logs, and questions.
*   [x] **Bigger Sister matchmaker engine** pairing Little Sisters with remission mentors.
*   [x] **BCF events calendar registry** displaying real-life Singapore community activities.
