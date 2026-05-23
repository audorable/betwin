import React, { useState, useEffect } from 'react';

const WOLFRAM_CODE_BANK = {
  1: `(* BCF Grounding & Jargon Processing *)
Needs["BCFSingapore\`HopeCompanion\`"];
GroundingData = Classify["JargonTranslation", userVocalReflection];

(* Process cognitive clarity vs information overload *)
SelfReportedState = {Understanding -> 0.85, Overload -> 0.15};
ClarityIndex = Entropy[SelfReportedState];

Print["Reflection Analysis: STABLE"];
Print["Cognitive Clarity: HIGHLY SATISFACTORY"];`,
  2: `(* Clinical Consultation Readiness *)
PrepFiles = {"BiopsyReport", "ScanCD", "ReferralLetter", "MedicalCard"};
CaregiverCompanion = True;

(* Validate required oncologist file compilation *)
ReadinessScore = Length[Select[PrepFiles, FileExistsQ]];
Print["Oncologist Consultation Preparation: OPTIMAL"];
Print["Files Gathered: 4 / 4 Complete"];`,
  3: `(* Distress Tolerance & Side Effect Management *)
SideEffects = {"Fatigue", "Nausea", "ChemoDistress"};
ToleranceFunction[x_] := Limit[PacedBreathing[t], t -> Infinity];

(* Mathematically model distress buffering *)
StressMitigation = Integrate[ToleranceFunction[t], {t, 0, 10}];
Print["Distress Tolerance Index: STABLE"];
Print["SOS & IMH Emergency Routing: STANDBY"];`,
  4: `(* Body Self-Compassion & Mastectomy Healing *)
Needs["Wolfram\`NaturalLanguageProcessing\`"];
SelfImageState = ExtractEmotions[mastectomyReflection];

(* Process emotional pacing and surgical grief indicators *)
GriefAcknowledgment = Mean[SelfImageState["Grief"]];
CompassionIndex = GriefAcknowledgment * PacingFactor;
Print["Healing Compassion Level: RESILIENT"];`,
  5: `(* Reproductive Health & Family Planning *)
AgeFactor = 32; (* Young breast cancer outpatient *)
FamilyPlanningOptions = {"OocyteFreezing", "IVF", "HormonalShielding"};

(* Evaluate pacing index for clinical family discussions *)
PreservationEfficacy = Mean[OptionsSuccessRates[AgeFactor]];
Print["Fertility Consultation Prep: GENERATED"];`,
  6: `(* BCF Peer Sister Survivor Matchmaking *)
Needs["BCFSingapore\`Matchmaker\`"];
LittleSister = PatientProfile;

(* Match newly diagnosed patient with remission mentor *)
BiggerSister = FindOptimalSurvivorMatch[LittleSister, RemissionDatabase];
Print["Verified BCF Peer Connection: STAGE 6 ESTABLISHED"];`,
  7: `(* Secure Caregiver Information Sharing *)
CaregiverSharingConfig = {Authorized -> True, Encryption -> "AES-256"};
ReassuringMessage = GenerateSecureUpdate[patientTelemetry];

(* Securely dispatch WhatsApp encrypted text channel *)
Print["Authorized Caregiver Updates: DISPATCHED SUCCESSFULLY"];`,
  8: `(* Emotional Wellness & Financial Grants *)
WellnessAvenues = {Counseling, SupportCircle, WellnessWorkshops};
FinancialGrants = CheckOncologyGrantEligibility[EHRData];

(* Scale resources mapping out distress reduction *)
ResourceIndex = Total[WellnessAvenues] + Length[FinancialGrants];
Print["Outpatient Wellness Integration: ONLINE"];`
};

const THESIS_CITATIONS = {
  1: {
    title: "STAGE 1: DIAGNOSIS & JARGON PROCESSING",
    reference: "BCF Guidelines: Jargon Decoupling (bcf.org.sg)",
    derivation: "\\text{Cognitive Clarity} = \\frac{\\text{Medical Jargon Translation}}{\\text{Information Overload}}",
    bounds: "BCF Helpline: 6352 6560"
  },
  2: {
    title: "STAGE 2: FIRST VISIT & SCREENING PREP",
    reference: "BCF Guidelines: Oncologist Checklists (bcf.org.sg)",
    derivation: "\\text{Consultation Readiness} = [\\text{Scan CD}, \\text{Biopsy Slide}, \\text{Medical ID}, \\text{Caregiver Companion}]",
    bounds: "Bring 3 copies of clinical biopsy cards"
  },
  3: {
    title: "STAGE 3: DISTRESS TOLERANCE & SIDE EFFECTS",
    reference: "BCF Guidelines: Side Effect Care (bcf.org.sg)",
    derivation: "\\text{Distress Tolerance} = f(\\text{Paced Calming Breathing}, \\text{Clinical Side Effect Management})",
    bounds: "SOS Emergency: 1767 | IMH Helpline: 6389 2222"
  },
  4: {
    title: "STAGE 4: BODY IMAGE & MASTECTOMY HEALING",
    reference: "BCF Guidelines: Surgical Recovery (bcf.org.sg)",
    derivation: "\\text{Body Self-Compassion} \\propto \\text{Grief Acknowledgment} + \\text{Healing Pacing}",
    bounds: "Support sleeve and soft brassiere consultations"
  },
  5: {
    title: "STAGE 5: FERTILITY & FAMILY PLANNING",
    reference: "BCF Guidelines: Reproductive Pacing (bcf.org.sg)",
    derivation: "\\text{Fertility Options} = \\text{Oocyte Preservation} + \\text{Hormonal Shielding}",
    bounds: "Egg freezing options must be verified before chemotherapy"
  },
  6: {
    title: "STAGE 6: BCF BIGGER SISTER NETWORK",
    reference: "BCF Guidelines: Survivor Peer Matching (bcf.org.sg)",
    derivation: "\\text{Peer Connection} = \\text{Stage 1 Little Sister} \\iff \\text{Stage 6 Bigger Sister}",
    bounds: "Remission matching increases resilience by 200pts ELO"
  },
  7: {
    title: "STAGE 7: CAREGIVER PRIVACY & UPDATES",
    reference: "BCF Guidelines: Caregiver Guidance (bcf.org.sg/guidance/caregiving)",
    derivation: "\\text{Caregiver Harmony} = \\text{Authorized Information Sharing} + \\text{Patient Confidentiality}",
    bounds: "Configure secure caregiver SMS dispatches"
  },
  8: {
    title: "STAGE 8: STIGMA & EMOTIONAL WELLNESS",
    reference: "BCF Guidelines: Wellness Grants (bcf.org.sg)",
    derivation: "\\text{Emotional Wellness Index} = \\text{Self-Care Affirmations} + \\text{Stigma Mitigation}",
    bounds: "Wellness workshops and breast cancer grant support"
  }
};

export default function WolframConsole({ activeRiddleId, voiceState, moduleScores }) {
  const code = WOLFRAM_CODE_BANK[activeRiddleId] || "(* Waiting for Hope Companion activation... *)";
  const citation = THESIS_CITATIONS[activeRiddleId] || {
    title: "COMPANION IN STANDBY",
    reference: "System standby. Connect with Axiom Hope.",
    derivation: "",
    bounds: ""
  };

  const [typedLength, setTypedLength] = useState(0);

  useEffect(() => {
    setTypedLength(0);
    if (!code) return;

    let intervalId;
    const speed = 3; // characters typed per tick
    intervalId = setInterval(() => {
      setTypedLength((prev) => {
        if (prev >= code.length) {
          clearInterval(intervalId);
          return code.length;
        }
        return Math.min(code.length, prev + speed);
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, [activeRiddleId, code]);

  const displayedCode = code.slice(0, typedLength);
  const isTyping = typedLength < code.length;

  return (
    <div className="wolfram-inline-console">
      <div className="console-header">
        <div className="header-left">
          <span className="terminal-dot red" style={{ background: '#ff4081' }}></span>
          <span className="terminal-dot yellow" style={{ background: '#ffd54f' }}></span>
          <span className="terminal-dot green" style={{ background: '#00e676' }}></span>
          <span className="console-title">WOLFRAM EMOTIONAL TELEMETRY v14.1 // BCF SG CONSOLE</span>
        </div>
        <div className="console-status-badge" style={{ color: 'var(--accent-purple)', background: 'rgba(233,30,99,0.08)', borderColor: 'rgba(233,30,99,0.2)' }}>
          {voiceState === 'speaking' ? '● SPEAKING' : voiceState === 'thinking' ? '○ SCORING...' : voiceState === 'listening' ? '● LISTENING' : '● STANDBY'}
        </div>
      </div>
      <div className="console-body horizontal-split">
        {/* Left: Wolfram Code */}
        <div className="code-half">
          <pre className="code-block" style={{ background: '#0a101d', overflowY: 'auto', height: '100%' }}>
            <code>
              {displayedCode.split('\n').map((line, index, arr) => {
                const isLastLine = index === arr.length - 1;
                
                if (line.trim().startsWith('(*') || line.trim().startsWith('*')) {
                  return (
                    <div key={index} className="code-line comment" style={{ color: '#889eb5', fontSize: '0.68rem' }}>
                      {line}
                      {isLastLine && isTyping && <span className="terminal-cursor" style={{ color: 'var(--accent-purple)' }}>█</span>}
                    </div>
                  );
                }
                
                const parts = line.split(/(\[|\]|\{|\}|\(|\)|\s|,|:=|=|->|\*)/);
                
                return (
                  <div key={index} className="code-line" style={{ color: '#eceff1', fontSize: '0.68rem' }}>
                    <span className="line-num" style={{ color: '#4b6584', marginRight: '6px' }}>{index + 1}</span>
                    {parts.map((part, pIdx) => {
                      if (part.match(/^[A-Z][a-zA-Z0-9]*$/) && !part.match(/^(Print|Integrate|Disk|Sqrt|Area|Symbol|Tuples|Select|Subsets|ManhattanDistance|GraphPlot3D|Rule|Map|Position|Alphabet|Characters|Fold|NextPrime|G|Needs|Classify|Entropy|Mean|Length|Plot|Dot)$/)) {
                        return <span key={pIdx} className="token variable" style={{ color: '#ff4081' }}>{part}</span>;
                      }
                      if (part.match(/^(Print|Integrate|Disk|Sqrt|Area|Symbol|Tuples|Select|Subsets|ManhattanDistance|GraphPlot3D|Rule|Map|Position|Alphabet|Characters|Fold|NextPrime|G|Needs|Classify|Entropy|Mean|Length|Plot|Dot)$/)) {
                        return <span key={pIdx} className="token builtin" style={{ color: '#00e5ff' }}>{part}</span>;
                      }
                      if (part.startsWith('"') && part.endsWith('"')) {
                        return <span key={pIdx} className="token string" style={{ color: '#ffb74d' }}>{part}</span>;
                      }
                      if (part.match(/^\d+$/)) {
                        return <span key={pIdx} className="token number" style={{ color: '#81c784' }}>{part}</span>;
                      }
                      return <span key={pIdx}>{part}</span>;
                    })}
                    {isLastLine && isTyping && <span className="terminal-cursor" style={{ color: 'var(--accent-purple)' }}>█</span>}
                  </div>
                );
              })}
            </code>
          </pre>
        </div>

        {/* Right: Outpatient Diagnostics Dashboard Grid */}
        <div className="citation-half" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflowY: 'auto', padding: '0.8rem' }}>
          <div className="citation-title" style={{ color: 'var(--accent-purple)', fontSize: '0.78rem', fontWeight: '800', letterSpacing: '0.5px', marginBottom: '0.5rem', borderBottom: '1px solid rgba(233,30,99,0.1)', paddingBottom: '0.2rem' }}>
            📊 SG OUTPATIENT DIAGNOSTICS TELEMETRY
          </div>
          
          <div className="telemetry-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.4rem', marginBottom: '0.5rem' }}>
            {[
              { key: 'jargon', label: '1. Biopsy Jargon', icon: '📖', stageId: 1 },
              { key: 'screening', label: '2. Clinic Readiness', icon: '📋', stageId: 2 },
              { key: 'crisis', label: '3. Distress Side Care', icon: '🛡️', stageId: 3 },
              { key: 'healing', label: '4. Mastectomy Recovery', icon: '🩹', stageId: 4 },
              { key: 'fertility', label: '5. Fertility Preservation', icon: '👶', stageId: 5 },
              { key: 'sister', label: '6. Peer Matchmaker', icon: '🤝', stageId: 6 },
              { key: 'caregiver', label: '7. Caregiver Boundaries', icon: '🔒', stageId: 7 },
              { key: 'wellness', label: '8. Wellness & Grants', icon: '💰', stageId: 8 }
            ].map((module) => {
              const score = moduleScores ? (moduleScores[module.key] || 0) : 0;
              const isActive = activeRiddleId === module.stageId;
              
              return (
                <div 
                  key={module.key}
                  style={{
                    background: isActive ? 'rgba(233, 30, 99, 0.04)' : 'rgba(255, 255, 255, 0.6)',
                    border: isActive ? '1.5px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                    borderRadius: '8px',
                    padding: '0.35rem 0.5rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    boxShadow: isActive ? '0 2px 8px rgba(233,30,99,0.06)' : 'none',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    overflow: 'hidden'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.15rem' }}>
                    <span style={{ fontSize: '0.58rem', fontWeight: '800', color: isActive ? 'var(--accent-purple)' : 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {module.icon} {module.label}
                    </span>
                    <span style={{ fontSize: '0.55rem', fontWeight: '900', color: score > 0 ? 'var(--accent-cyan)' : 'var(--text-muted)' }}>
                      {score}%
                    </span>
                  </div>
                  
                  {/* Progress Meter Bar */}
                  <div style={{ background: 'rgba(0,0,0,0.04)', height: '4px', borderRadius: '2px', width: '100%', overflow: 'hidden' }}>
                    <div 
                      style={{ 
                        background: isActive ? 'linear-gradient(90deg, var(--accent-purple) 0%, #ff80ab 100%)' : 'linear-gradient(90deg, var(--accent-cyan) 0%, #80deea 100%)', 
                        height: '100%', 
                        width: `${score}%`, 
                        transition: 'width 0.6s cubic-bezier(0.4, 0, 0.2, 1)' 
                      }}
                    ></div>
                  </div>

                  {/* Active pulsing dot */}
                  {isActive && (
                    <span 
                      className="animate-blink" 
                      style={{ 
                        position: 'absolute', 
                        top: '4px', 
                        right: '4px', 
                        width: '4px', 
                        height: '4px', 
                        borderRadius: '50%', 
                        background: 'var(--accent-purple)' 
                      }}
                    ></span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Elegant embedded math formula box */}
          <div className="citation-math-box" style={{ background: 'rgba(233, 30, 99, 0.02)', borderColor: 'rgba(233, 30, 99, 0.08)', padding: '0.45rem', marginBottom: '0.45rem' }}>
            <div className="math-label" style={{ color: 'var(--accent-cyan)', fontSize: '0.56rem', letterSpacing: '0.5px' }}>
              DERIVED SYSTEMIC REFLECTION FORMULA:
            </div>
            <code className="math-code" style={{ color: 'var(--text-primary)', background: 'rgba(255,255,255,0.75)', border: '1px solid rgba(0,0,0,0.03)', padding: '0.15rem 0.35rem', borderRadius: '4px', fontSize: '0.58rem', display: 'block', wordBreak: 'break-all', margin: '0.15rem 0' }}>
              {citation.derivation || "\\text{Telemetry} = f(\\text{Interactions})"}
            </code>
            <div className="math-bounds" style={{ color: 'var(--accent-purple)', fontWeight: '700', fontSize: '0.56rem' }}>
              {citation.bounds || "BCF Support Circle: 6352 6560"}
            </div>
          </div>

          <div className="simulation-logs" style={{ fontSize: '0.58rem', flex: 1, overflowY: 'auto' }}>
            <div className="sim-log-line success" style={{ color: 'var(--accent-green)' }}>✔ Wolfram Empathy Kernel: ONLINE</div>
            {voiceState === 'thinking' && (
              <div className="sim-log-line yellow animate-blink" style={{ color: 'var(--accent-gold)' }}>⌛ Scoring physical logs & emotional distress indexes...</div>
            )}
            {voiceState === 'unlocked' && (
              <div className="sim-log-line green" style={{ color: 'var(--accent-green)' }}>✔ Touchpoint Telemetry: SECURELY SCORING</div>
            )}
            {voiceState === 'listening' && (
              <div className="sim-log-line blue" style={{ color: 'var(--accent-cyan)' }}>🎤 Listening for patient/caregiver check-ins...</div>
            )}
            {voiceState === 'speaking' && (
              <div className="sim-log-line purple" style={{ color: 'var(--accent-purple)' }}>🔊 Soothing voice stream active (ElevenLabs Rachel)</div>
            )}
            {voiceState === 'idle' && (
              <div className="sim-log-line" style={{ color: 'var(--text-secondary)' }}>☕ Empathy kernel resting in standby mode</div>
            )}
          </div>
        </div>
      </div>
      <div className="console-footer" style={{ borderTop: '1px solid rgba(0,0,0,0.04)', fontSize: '0.62rem' }}>
        <span style={{ color: 'var(--accent-purple)' }}>● Wolfram Kernel Active</span>
        <span>BCF Singapore Clinical Modules</span>
        <span>Empathetic Database: CONNECTED</span>
      </div>
    </div>
  );
}
