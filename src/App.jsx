import React from 'react';
import WolframConsole from './components/WolframConsole';
import GhostAvatar from './components/GhostAvatar';
import useVoiceAgent from './hooks/useVoiceAgent';
import journeyCorpus from './data/journeyCorpus.json';

export default function App() {
  const agent = useVoiceAgent();

  const activeModuleData = journeyCorpus[agent.activeModule];

  return (
    <div className={`scanlines boot-${agent.bootState} step-${agent.awakeningStep}`} style={{ width: '100vw', height: '100vh', position: 'relative' }}>
      <div className="viewport-container conjecture-layout" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        
        {/* Top Navbar */}
        <header className="top-nav" style={{ padding: '0.5rem 0' }}>
          <div className="brand-section">
            <span className="brand-glow" style={{ color: 'var(--accent-purple)' }}>BETWIN SG</span>
            <span className="brand-divider">//</span>
            <span className="brand-model">BCF SUPPORT COMPANION</span>
          </div>

          <div className="top-nav-riddle" style={{ fontSize: '0.82rem', fontWeight: '800', background: 'rgba(233,30,99,0.06)', padding: '0.35rem 0.8rem', borderRadius: '15px', color: 'var(--accent-purple)' }}>
            ACTIVE MODULE: {activeModuleData.title.toUpperCase()}
          </div>
          
          <div className="nav-actions" style={{ display: 'flex', alignItems: 'center' }}>
            {/* Singpass Government OAuth Portal Badge */}
            {agent.user ? (
              <div className="user-profile-badge" style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', background: 'rgba(255,255,255,0.78)', border: '1.5px solid var(--accent-cyan)', borderRadius: '25px', padding: '0.15rem 0.65rem 0.15rem 0.15rem', marginRight: '0.4rem', backdropFilter: 'blur(10px)', boxShadow: '0 2px 10px rgba(0, 130, 138, 0.08)' }}>
                <img src={agent.user.photoURL} alt={agent.user.displayName} style={{ width: '26px', height: '26px', borderRadius: '50%', border: '1.5px solid var(--accent-cyan)', objectFit: 'cover' }} />
                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                  <span style={{ fontSize: '0.68rem', fontWeight: '800', color: 'var(--accent-cyan)', lineHeight: '1.1' }}>{agent.user.displayName.split(' ')[0]}</span>
                  <span style={{ fontSize: '0.52rem', color: 'var(--text-muted)', lineHeight: '1' }}>Singpass Sync ✔</span>
                </div>
                <button 
                  onClick={() => agent.setUser(null)}
                  style={{ background: 'none', border: 'none', color: 'var(--accent-purple)', fontSize: '0.65rem', cursor: 'pointer', marginLeft: '0.2rem', textDecoration: 'underline', fontWeight: '700' }}
                >
                  OUT
                </button>
              </div>
            ) : (
              <button 
                className="btn-connect"
                style={{
                  background: 'rgba(0, 130, 138, 0.06)',
                  borderColor: 'var(--accent-cyan)',
                  color: 'var(--accent-cyan)',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontWeight: '800',
                  fontSize: '0.72rem',
                  padding: '0.4rem 0.8rem',
                  marginRight: '0.4rem',
                  boxShadow: '0 2px 8px rgba(0, 130, 138, 0.1)'
                }}
                onClick={() => agent.setShowMockAuthModal(true)}
              >
                🇸🇬 SINGPASS LOGIN
              </button>
            )}

            {/* Direct Note & Care Dispatch panel button */}
            <button 
              className="btn-connect"
              style={{
                background: 'rgba(233, 30, 99, 0.06)',
                borderColor: 'var(--accent-purple)',
                color: 'var(--accent-purple)',
                display: 'flex',
                alignItems: 'center',
                gap: '0.3rem',
                fontWeight: '800',
                fontSize: '0.72rem',
                padding: '0.4rem 0.8rem',
                marginRight: '0.4rem',
                boxShadow: '0 2px 8px rgba(233, 30, 99, 0.1)'
              }}
              onClick={() => {
                agent.setShowSubmissionForm(true);
                agent.setSubmissionStep('idle');
              }}
            >
              📋 PORTAL SUMMARY
            </button>

            <span style={{ fontSize: '0.8rem', fontFamily: 'var(--font-mono)', color: 'var(--accent-purple)', letterSpacing: '0.5px', marginRight: '0.8rem', display: 'flex', alignItems: 'center', fontWeight: '700' }}>
              ⚡ RESILIENCE: {agent.elo}
            </span>
            <button 
              className="circle-nav-btn" 
              title="System Settings"
              style={{ width: '36px', height: '36px' }}
              onClick={() => agent.setSettingsOpen(true)}
            >
              ⚙️
            </button>
            <button 
              className="circle-nav-btn" 
              title="Toggle Fallback/Premium WebRTC Mode"
              style={{ width: '36px', height: '36px', color: agent.mode === 'webrtc' ? 'var(--accent-cyan)' : 'var(--text-secondary)' }}
              onClick={() => {
                const nextMode = agent.mode === 'fallback' ? 'webrtc' : 'fallback';
                agent.setMode(nextMode);
                agent.addLog(`Switched system mode to: ${nextMode.toUpperCase()}`, "info");
              }}
            >
              {agent.mode === 'webrtc' ? '💎' : '⚡'}
            </button>
          </div>
        </header>

        {/* Bipartite Main Layout: Journey Grid on Left, Eyeball & Console on Right */}
        <main className="central-workspace" style={{ display: 'flex', flex: 1, gap: '1.2rem', padding: '0.5rem 0', overflow: 'hidden' }}>
          
          {/* Left Column: Interactive 8-Service Journey Grid (Inspired by the Grab App) */}
          <section className="journey-grid-panel" style={{ flex: '1.1', display: 'flex', flexDirection: 'column', background: 'var(--bg-glass)', border: '1px solid var(--border-glass)', borderRadius: '16px', padding: '1rem', backdropFilter: 'blur(10px)', overflowY: 'auto' }}>
            <h3 style={{ fontSize: '0.82rem', letterSpacing: '1px', color: 'var(--accent-purple)', marginBottom: '0.8rem', borderBottom: '1px solid rgba(233,30,99,0.08)', paddingBottom: '0.4rem', fontWeight: '800' }}>
              PATIENT LIFE JOURNEY SECTOR // GRAB ARCHITECTURE
            </h3>
            
            <div className="journey-grid-container" style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.65rem', flex: 1 }}>
              {Object.keys(journeyCorpus).map((moduleKey) => {
                const mData = journeyCorpus[moduleKey];
                const isActive = agent.activeModule === moduleKey;
                
                // Map beautiful micro-services icons
                let mIcon = "🌸";
                if (moduleKey === 'jargon') mIcon = "📖";
                if (moduleKey === 'screening') mIcon = "📋";
                if (moduleKey === 'crisis') mIcon = "🛡️";
                if (moduleKey === 'healing') mIcon = "🩹";
                if (moduleKey === 'fertility') mIcon = "👶";
                if (moduleKey === 'sister') mIcon = "🤝";
                if (moduleKey === 'caregiver') mIcon = "🔒";
                if (moduleKey === 'wellness') mIcon = "💰";

                return (
                  <div 
                    key={moduleKey}
                    className={`service-card ${isActive ? 'active' : ''}`}
                    onClick={() => agent.switchModule(moduleKey)}
                    style={{
                      background: isActive ? 'rgba(233,30,99,0.06)' : 'rgba(255,255,255,0.7)',
                      border: isActive ? '2px solid var(--accent-purple)' : '1px solid var(--border-glass)',
                      borderRadius: '12px',
                      padding: '0.75rem',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease',
                      textAlign: 'left',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      boxShadow: isActive ? '0 4px 12px rgba(233,30,99,0.1)' : '0 2px 6px rgba(0,0,0,0.02)'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '1.4rem' }}>{mIcon}</span>
                      <span style={{ fontSize: '0.55rem', fontWeight: '800', background: isActive ? 'var(--accent-purple)' : 'rgba(0,0,0,0.05)', color: isActive ? '#fff' : 'var(--text-secondary)', padding: '0.15rem 0.4rem', borderRadius: '10px' }}>
                        STAGE {mData.id}
                      </span>
                    </div>
                    <div style={{ marginTop: '0.6rem' }}>
                      <h4 style={{ fontSize: '0.74rem', fontWeight: '800', color: 'var(--text-primary)', marginBottom: '0.15rem' }}>{mData.title}</h4>
                      <p style={{ fontSize: '0.58rem', color: 'var(--text-muted)', lineHeight: '1.2' }}>{mData.question.substring(0, 48)}...</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* Right Column: Sphinx core eyeball, Subtitles, and Wolfram dashboard */}
          <section className="sphinx-core-panel" style={{ flex: '1', display: 'flex', flexDirection: 'column', gap: '0.8rem', justifyContent: 'space-between', overflow: 'hidden' }}>
            
            {/* Colossal Sphinger Orb visualizer casing */}
            <div className="character-area" style={{ position: 'relative', width: '100%', height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto', top: 'unset', left: 'unset', transform: 'unset' }}>
              <div className={`dotted-audio-ring ${agent.voiceState !== 'idle' ? 'active' : ''}`} style={{ width: '150px', height: '150px' }}></div>
              <div 
                className={`hal-eye-unit ${agent.voiceState} ${agent.bootState === 'darkness' ? 'sleeping' : ''}`}
                onClick={agent.startAgentSession}
                style={{ width: '130px', height: '130px', border: '6px solid #e2e8f0' }}
                title={agent.bootState === 'darkness' ? "Awaken Voice Companion" : "Disconnect session"}
              >
                <div className="lens-reflection"></div>
                <div 
                  className="eye-core"
                  style={{
                    width: '60px',
                    height: '60px',
                    transform: agent.bootState === 'active' ? `scale(${1 + agent.speechAmplitude * 0.15})` : undefined,
                    boxShadow: agent.bootState === 'active' 
                      ? `0 0 ${20 + agent.speechAmplitude * 60}px rgba(${agent.voiceState === 'speaking' ? '0, 240, 255' : agent.voiceState === 'thinking' ? '255, 0, 255' : agent.voiceState === 'unlocked' ? '42, 255, 42' : '0, 240, 216'}, ${0.8 + agent.speechAmplitude * 0.2})` 
                      : undefined
                  }}
                >
                  <div 
                    className="aperture" 
                    style={{ 
                      width: '15px',
                      height: '15px',
                      transform: agent.bootState === 'active' ? `scale(${1 - agent.speechAmplitude * 0.25})` : undefined,
                      opacity: agent.voiceState !== 'idle' ? Math.max(0.15, 1 - agent.speechAmplitude * 1.5) : 1
                    }}
                  ></div>
                  <GhostAvatar 
                    amplitude={agent.speechAmplitude} 
                    active={agent.bootState === 'active' && agent.voiceState !== 'idle'} 
                  />
                </div>
                <div className="misted-glass-overlay"></div>
              </div>
            </div>

            {/* Subtitles Console track */}
            <div className="subtitles-container" style={{ minHeight: '60px', padding: '0.6rem 1rem', background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-glass)', borderRadius: '10px' }}>
              <p className="subtitles-text" style={{ fontSize: '0.78rem', lineHeight: '1.4' }}>{agent.subtitles}</p>
            </div>

            {/* Inline Wolfram and Thesis Console */}
            <div className="wolfram-container-wrapper" style={{ flex: 1, overflow: 'hidden' }}>
              <WolframConsole 
                activeRiddleId={activeModuleData.id}
                voiceState={agent.voiceState}
              />
            </div>

          </section>

        </main>

        {/* Persistent Doctor Dispatch Action Dock (Clinician Primary Dispatcher) */}
        <div className="persistent-doctor-dispatch-bar" style={{ zIndex: '500', padding: '0.4rem 0' }}>
          <button 
            onClick={() => {
              agent.setShowSubmissionForm(true);
              agent.setSubmissionStep('idle');
            }}
            style={{
              width: '100%',
              padding: '0.85rem',
              borderRadius: '12px',
              border: '2px solid var(--accent-purple)',
              background: 'linear-gradient(135deg, var(--accent-purple) 0%, #d81b60 100%)',
              color: '#fff',
              fontWeight: '800',
              fontSize: '0.9rem',
              letterSpacing: '1px',
              cursor: 'pointer',
              boxShadow: '0 4px 20px rgba(233, 30, 99, 0.25)',
              transition: 'all 0.3s ease',
              textShadow: '0 1px 3px rgba(0,0,0,0.15)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
          >
            📋 COMPILATION CENTER // SEND CLINICAL CARD TO DR. {agent.doctorName.toUpperCase() || 'ONCOLOGIST'} ✉
          </button>
        </div>

        {/* Simplified Bottom Area with unified control bar */}
        <footer className="bottom-area-simplified" style={{ padding: '0.3rem 0' }}>
          <div className="unified-dock">
            
            <button 
              className={`dock-btn call-toggle ${agent.voiceState !== 'idle' ? 'active' : ''}`}
              title={agent.voiceState === 'idle' ? "Activate BCF Companion" : "Hibernate Companion"}
              onClick={agent.startAgentSession}
            >
              📳
            </button>

            <button 
              className={`dock-btn ${!agent.micActive ? 'muted' : ''}`}
              title={agent.micActive ? "Mute Microphone" : "Unmute Microphone"}
              onClick={() => {
                agent.setMicActive(!agent.micActive);
                agent.addLog(agent.micActive ? "Microphone input muted." : "Microphone input active.", "info");
              }}
            >
              🎤
            </button>

            {/* Sleek Text Input Bar */}
            <div className="chat-bar-container">
              <span className="chat-attach-btn" title="Compassionate Input Mode" style={{ fontSize: '1rem', color: 'var(--accent-purple)' }}>❤</span>
              <input 
                className="chat-bar-input"
                type="text"
                placeholder="Share symptoms, physical notes, or custom oncologist questions..."
                value={agent.userInput}
                onChange={(e) => agent.setUserInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && agent.userInput.trim() && agent.submitUserInput(agent.userInput)}
              />
              <button 
                className="chat-send-btn" 
                style={{ background: 'var(--accent-purple)' }}
                onClick={() => agent.userInput.trim() && agent.submitUserInput(agent.userInput)}
              >
                ➔
              </button>
            </div>

            <button 
              className={`dock-btn ${agent.isMuted ? 'muted' : ''}`}
              title={agent.isMuted ? "Unmute Supercomputer Voice" : "Mute Supercomputer Voice"}
              onClick={() => {
                agent.setIsMuted(!agent.isMuted);
                agent.addLog(agent.isMuted ? "Speech synthesis active." : "Speech synthesis muted.", "info");
              }}
            >
              🔊
            </button>

            <div className="dock-mode-indicator">
              MODE: {agent.mode.toUpperCase()}
            </div>

          </div>
        </footer>

        {/* Elegant Centered Settings Modal Overlay */}
        {agent.settingsOpen && (
          <div className="settings-modal-overlay" onClick={() => agent.setSettingsOpen(false)}>
            <div className="settings-modal-card" onClick={(e) => e.stopPropagation()}>
              <div className="console-header">
                <span className="console-title">COGNITIVE SYSTEM PARAMETERS</span>
                <button className="console-close" onClick={() => agent.setSettingsOpen(false)}>×</button>
              </div>
              <div className="modal-body">
                <div className="input-group">
                  <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>SOOTHING VOICE CALIBRATION</label>
                  <select 
                    value={agent.selectedVoice}
                    onChange={(e) => {
                      agent.setSelectedVoice(e.target.value);
                      agent.addLog(`Calibrated system voice to: ${e.target.value.toUpperCase()}`, "info");
                    }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}
                  >
                    <option value="rachel">Rachel (Warm & Empathetic) 💝</option>
                    <option value="emily">Emily (Soft & Soothing) 🍃</option>
                    <option value="charlotte">Charlotte (Gentle Caregiver) 🌸</option>
                    <option value="browser">System Default (Natural Breathing Cadence) 🧘</option>
                  </select>
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>ELEVENLABS API KEY</label>
                  <input 
                    type="password" 
                    value={agent.elevenLabsKey}
                    onChange={(e) => agent.setElevenLabsKey(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}
                  />
                </div>
                <div className="input-group">
                  <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>SPEECH ENGINE / AGENT ID</label>
                  <input 
                    type="text" 
                    value={agent.speechEngineId}
                    onChange={(e) => agent.setSpeechEngineId(e.target.value)}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}
                  />
                </div>

                <div className="input-group">
                  <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>FIREBASE CLOUD CONFIG (JSON)</label>
                  <textarea 
                    rows="3"
                    placeholder='{"apiKey": "...", "authDomain": "...", "projectId": "..."}'
                    value={localStorage.getItem('AXIOM_FIREBASE_CONFIG') || ''}
                    onChange={(e) => {
                      localStorage.setItem('AXIOM_FIREBASE_CONFIG', e.target.value);
                    }}
                    style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', color: 'var(--text-primary)', fontFamily: 'var(--font-mono)', resize: 'vertical' }}
                  />
                  <small style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem', display: 'block', lineHeight: '1.3' }}>
                    Paste your web app config JSON to enable live Cloud Firestore syncing! Leaving it empty defaults to secure Local Sandbox Mode.
                  </small>
                </div>

                <button 
                  className="btn-connect" 
                  style={{ width: '100%', marginTop: '1.2rem', padding: '0.8rem', background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#fff', fontSize: '0.9rem', fontWeight: '700' }}
                  onClick={() => {
                    agent.setSettingsOpen(false);
                    agent.addLog("Calibrating voice and database components...", "success");
                    window.location.reload();
                  }}
                >
                  SAVE & RELOAD SYSTEM ➔
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Beautiful Centered BCF Singapore Support Credentials & Care Agenda Overlay */}
        {agent.showSubmissionForm && (
          <div className="settings-modal-overlay" onClick={() => { if (agent.submissionStep !== 'transmitting') agent.setShowSubmissionForm(false); }}>
            <div className="settings-modal-card bcf-portal-card" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '560px' }}>
              <div className="console-header bcf-glow-border">
                <span className="console-title" style={{ color: 'var(--accent-purple)' }}>BCF CLINICAL PREP & CARE PORTAL // SG</span>
                {agent.submissionStep !== 'transmitting' && (
                  <button className="console-close" onClick={() => agent.setShowSubmissionForm(false)}>×</button>
                )}
              </div>
              
              <div className="modal-body">
                {agent.submissionStep === 'idle' && (
                  <form onSubmit={agent.handleBCFSubmit} className="bcf-portal-form">
                    <p className="portal-intro-text" style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                      {agent.user ? `Authenticated as ${agent.user.displayName}. Write your clinical notes and oncology details below to sync directly with your private Firestore.` : "Enter your credentials and clinical details below to compile your Personalized Doctor Prep Agenda and access BCF caregiver guidelines."}
                    </p>
                    
                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>PATIENT / CAREGIVER NAME</label>
                      <input 
                        type="text" 
                        required
                        placeholder="Enter your name or caregiver name..."
                        value={agent.patientName || agent.user?.displayName || ''}
                        onChange={(e) => agent.setPatientName(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                      />
                    </div>
                    
                    <div className="form-row-double" style={{ display: 'flex', gap: '0.8rem', margin: '0.8rem 0' }}>
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>YOUR ROLE</label>
                        <select 
                          value={agent.userRole} 
                          onChange={(e) => agent.setUserRole(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        >
                          <option value="Breast Cancer Patient">Breast Cancer Patient</option>
                          <option value="Caregiver / Family Support">Caregiver / Family Support</option>
                          <option value="Survivor">Survivor</option>
                          <option value="BCF Supporter / Volunteer">BCF Supporter / Volunteer</option>
                        </select>
                      </div>
                      
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>PRIMARY EMOTION</label>
                        <select 
                          value={agent.primaryEmotion} 
                          onChange={(e) => agent.setPrimaryEmotion(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        >
                          <option value="Anxious / Overwhelmed">Anxious / Overwhelmed</option>
                          <option value="Hopeful / Resilient">Hopeful / Resilient</option>
                          <option value="Seeking Guidance">Seeking Guidance</option>
                          <option value="Fatigued / Tired">Fatigued / Tired</option>
                          <option value="Calm & Focused">Calm & Focused</option>
                          <option value="Shocked / Newly Diagnosed">Shocked / Newly Diagnosed</option>
                        </select>
                      </div>
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>PERSONAL NOTES & SYMPTOMS DIARY (Captured from Journey modules)</label>
                      <textarea 
                        rows="2"
                        placeholder="Write down physical symptoms, daily feelings, or general notes..."
                        value={agent.patientNotes}
                        onChange={(e) => agent.setPatientNotes(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-text)', resize: 'vertical' }}
                      />
                    </div>
                    
                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>DOCTOR DISCUSSION QUESTIONS (Compiled dynamically via voice)</label>
                      <textarea 
                        rows="2"
                        placeholder="Enter symptoms, concerns or questions you want to discuss with your oncologist..."
                        value={agent.clinicalQuestions}
                        onChange={(e) => agent.setClinicalQuestions(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', fontFamily: 'var(--font-text)', resize: 'vertical' }}
                      />
                    </div>

                    <div className="input-group">
                      <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>ONCOLOGY CENTER / HOSPITAL REGISTRY</label>
                      <select 
                        value={agent.doctorHospital} 
                        onChange={(e) => agent.setDoctorHospital(e.target.value)}
                        style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: '0.8rem' }}
                      >
                        <option value="National Cancer Centre Singapore (NCCS)">National Cancer Centre Singapore (NCCS)</option>
                        <option value="National University Cancer Institute, Singapore (NCIS)">National University Cancer Institute, Singapore (NCIS)</option>
                        <option value="Mount Elizabeth Oncology Clinic">Mount Elizabeth Oncology Clinic</option>
                        <option value="Gleneagles Cancer Centre">Gleneagles Cancer Centre</option>
                        <option value="Singapore General Hospital (SGH) Oncology">Singapore General Hospital (SGH) Oncology</option>
                        <option value="Tan Tock Seng Hospital (TTSH) Oncology">Tan Tock Seng Hospital (TTSH) Oncology</option>
                        <option value="Raffles Cancer Centre">Raffles Cancer Centre</option>
                        <option value="KK Women's and Children's Hospital (KKH)">KK Women's and Children's Hospital (KKH)</option>
                      </select>
                    </div>

                    {/* CAREGIVER TRUST SLIDER */}
                    <div className="checkbox-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', margin: '0.8rem 0', background: 'rgba(0,130,138,0.03)', border: '1px dashed var(--accent-cyan)', padding: '0.65rem', borderRadius: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                        <input 
                          type="checkbox" 
                          id="caregiver-trust-check"
                          checked={agent.caregiverAuthorized}
                          onChange={(e) => agent.setCaregiverAuthorized(e.target.checked)}
                          style={{ width: '16px', height: '16px', accentColor: 'var(--accent-cyan)' }}
                        />
                        <label htmlFor="caregiver-trust-check" style={{ fontSize: '0.78rem', color: 'var(--text-primary)', cursor: 'pointer', fontWeight: '700' }}>
                          Authorize Secure Caregiver Dashboard Update 🔒
                        </label>
                      </div>
                      <span style={{ fontSize: '0.62rem', color: 'var(--text-secondary)', marginLeft: '1.4rem' }}>
                        Generate a secure, privacy-safe message update to your family caregiver.
                      </span>
                    </div>
                    
                    <div className="form-row-double" style={{ display: 'flex', gap: '0.8rem', margin: '0.8rem 0' }}>
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>DOCTOR / ONCOLOGIST NAME</label>
                        <input 
                          type="text" 
                          required
                          placeholder="e.g. Dr. Tan..."
                          value={agent.doctorName}
                          onChange={(e) => agent.setDoctorName(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        />
                      </div>
                      
                      <div className="input-group" style={{ flex: 1 }}>
                        <label style={{ fontSize: '0.7rem', letterSpacing: '1px', fontWeight: '700', color: 'var(--accent-purple)' }}>DOCTOR'S EMAIL ADDRESS</label>
                        <input 
                          type="email" 
                          required
                          placeholder="e.g. doctor@hospital.sg..."
                          value={agent.doctorEmail}
                          onChange={(e) => agent.setDoctorEmail(e.target.value)}
                          style={{ width: '100%', padding: '0.75rem', borderRadius: '8px', border: '1px solid var(--border-glass)', background: 'rgba(255,255,255,0.7)', fontSize: '0.9rem', color: 'var(--text-primary)' }}
                        />
                      </div>
                    </div>
                    
                    <div className="checkbox-group" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', margin: '0.8rem 0' }}>
                      <input 
                        type="checkbox" 
                        id="bcf-guide-check"
                        required
                        checked={agent.readBCFGuide}
                        onChange={(e) => agent.setReadBCFGuide(e.target.checked)}
                        style={{ width: '16px', height: '16px', accentColor: 'var(--accent-purple)' }}
                      />
                      <label htmlFor="bcf-guide-check" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', cursor: 'pointer' }}>
                        I acknowledge the BCF Caregiver Guidelines (<a href="https://www.bcf.org.sg/guidance/caregiving" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--accent-cyan)', textDecoration: 'underline', fontWeight: '600' }}>bcf.org.sg/guidance/caregiving</a>)
                      </label>
                    </div>
                    
                    <button 
                      type="submit"
                      className="btn-connect" 
                      style={{ width: '100%', marginTop: '1rem', padding: '0.9rem', background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#fff', fontSize: '0.9rem', textShadow: '0 0 5px rgba(255,255,255,0.2)', fontWeight: '700' }}
                    >
                      {agent.user ? "SYNC WITH FIRESTORE & GENERATE BRIEFING ➔" : "GENERATE SECURE CLINICAL BRIEFING ➔"}
                    </button>
                  </form>
                )}
                
                {agent.submissionStep === 'transmitting' && (
                  <div className="progress-terminal" style={{ background: '#0b1320', padding: '1rem', borderRadius: '10px', fontFamily: 'var(--font-mono)', border: '1px solid var(--accent-purple)', boxShadow: '0 0 15px rgba(233, 30, 99, 0.15)' }}>
                    <div className="terminal-log-header" style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: '#ff80ab', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.4rem', marginBottom: '0.6rem' }}>
                      <span>SECURE COMPILATION IN PROGRESS...</span>
                      <span className="animate-blink" style={{ color: 'var(--accent-green)' }}>● SYSTEM COMPILING</span>
                    </div>
                    <div className="terminal-log-content" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', height: '150px', overflowY: 'auto', fontSize: '0.68rem', textAlign: 'left' }}>
                      {agent.transmissionLogs.map((log, lIdx) => (
                        <div key={lIdx} style={{ color: '#2aff2a' }}>{log}</div>
                      ))}
                      <div className="animate-blink" style={{ color: '#fff' }}>█</div>
                    </div>
                    <div className="progress-bar-container" style={{ background: 'rgba(255,255,255,0.1)', height: '6px', borderRadius: '3px', marginTop: '0.8rem', overflow: 'hidden' }}>
                      <div className="progress-bar-fill" style={{ background: 'var(--accent-purple)', height: '100%', width: `${(agent.transmissionLogs.length / 9) * 100}%`, transition: 'width 0.4s ease' }}></div>
                    </div>
                  </div>
                )}
                
                {agent.submissionStep === 'complete' && (
                  <div className="victory-success-shield" style={{ textAlign: 'center', padding: '0.5rem' }}>
                    <div className="bcf-ribbon-badge">
                      <svg viewBox="0 0 100 100" style={{ width: '80px', height: '80px', margin: '0 auto 0.8rem auto' }}>
                        <defs>
                          <filter id="ribbon-glow" x="-20%" y="-20%" width="140%" height="140%">
                            <feGaussianBlur stdDeviation="3.5" result="blur" />
                            <feMerge>
                              <feMergeNode in="blur" />
                              <feMergeNode in="SourceGraphic" />
                            </feMerge>
                          </filter>
                        </defs>
                        <path 
                          d="M 50,10 C 35,10 30,30 42,50 C 47,58 53,68 62,85 C 64,89 67,90 69,90 C 72,90 73,87 71,84 C 61,66 53,52 50,44 C 47,36 49,24 55,24 C 61,24 64,36 60,46 C 58,50 56,54 55,57 C 54,60 55,62 57,61 C 60,60 62,56 65,51 C 73,34 68,10 50,10 Z" 
                          fill="var(--accent-purple)" 
                          filter="url(#ribbon-glow)"
                        />
                      </svg>
                    </div>
                    <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--accent-cyan)', fontSize: '1.2rem', marginBottom: '0.5rem', letterSpacing: '0.5px' }}>
                      PERSONAL CLINICAL PREP AGENDA SECURED
                    </h3>
                    <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: '1.4', marginBottom: '1rem' }}>
                      {agent.user ? "Your pre-appointment briefing is securely synced with HealthHub Cloud Firestore." : "Your personalized doctor prep summary has been compiled successfully."} You have unlocked maximum 
                      <strong> BCF CARE RESILIENCE (Score: 1600)</strong>.
                    </p>
                    
                    <div className="agenda-summary-card" style={{ background: 'rgba(233, 30, 99, 0.03)', border: '1px dashed var(--accent-purple)', padding: '0.9rem', borderRadius: '10px', textAlign: 'left', marginBottom: '1.2rem', maxHeight: '180px', overflowY: 'auto' }}>
                      <div style={{ fontSize: '0.72rem', color: 'var(--accent-purple)', fontFamily: 'var(--font-mono)', marginBottom: '0.4rem', borderBottom: '1px solid rgba(233,30,99,0.1)', paddingBottom: '0.2rem', fontWeight: '700' }}>
                        PATIENT / CAREGIVER AGENDA CARD // BCF SINGAPORE
                      </div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Name:</strong> {agent.patientName || agent.user?.displayName}</div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Role:</strong> {agent.userRole} ({agent.primaryEmotion})</div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Clinical Facility:</strong> {agent.doctorHospital}</div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Clinical Care Team:</strong> Dr. {agent.doctorName} ({agent.doctorEmail})</div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Discussion Questions:</strong></div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.85)', padding: '0.45rem', borderRadius: '6px', whiteSpace: 'pre-wrap', border: '1px solid rgba(233,30,99,0.06)', marginBottom: '0.4rem' }}>
                        {agent.clinicalQuestions || "No clinical questions entered."}
                      </div>
                      <div style={{ fontSize: '0.8rem', marginBottom: '0.25rem' }}><strong>Notes & Symptoms Diary:</strong></div>
                      <div style={{ fontSize: '0.76rem', color: 'var(--text-secondary)', background: 'rgba(255,255,255,0.85)', padding: '0.45rem', borderRadius: '6px', whiteSpace: 'pre-wrap', border: '1px solid rgba(233,30,99,0.06)' }}>
                        {agent.patientNotes || "No custom notes written."}
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                      <button 
                        className="btn-connect"
                        style={{ display: 'inline-block', padding: '0.6rem 1.2rem', fontSize: '0.8rem', background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#fff', fontWeight: '700' }}
                        onClick={agent.dispatchDoctorEmail}
                      >
                        SEND TO DR. {agent.doctorName.toUpperCase() || 'DOCTOR'} ✉
                      </button>
                      
                      {/* Optional caregiver dispatch link if authorized */}
                      {agent.caregiverAuthorized && (
                        <button 
                          className="btn-connect" 
                          style={{ display: 'inline-block', padding: '0.6rem 1.2rem', fontSize: '0.8rem', background: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)', color: '#fff', fontWeight: '700' }}
                          onClick={agent.triggerCaregiverShare}
                        >
                          DISPATCH CAREGIVER UPDATE 📱
                        </button>
                      )}

                      <a 
                        href="https://www.bcf.org.sg/guidance/caregiving" 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="btn-connect active" 
                        style={{ display: 'inline-block', textDecoration: 'none', padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
                      >
                        VISIT BCF SG CAREGIVING GUIDE ➔
                      </a>
                      <button 
                        className="btn-connect" 
                        onClick={() => {
                          agent.setShowSubmissionForm(false);
                          agent.setSubmissionStep('idle');
                        }}
                        style={{ padding: '0.6rem 1.2rem', fontSize: '0.8rem' }}
                      >
                        CLOSE PORTAL
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Realistic Simulated Singapore Singpass OAuth / HealthHub Scanner Modal */}
        {agent.showMockAuthModal && (
          <div className="settings-modal-overlay" style={{ zIndex: '3000', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.5)' }}>
            <div className="settings-modal-card" style={{ maxWidth: '390px', borderRadius: '12px', padding: '1.8rem', border: '2px solid #ef3737', boxShadow: '0 8px 30px rgba(239, 55, 55, 0.15)', background: '#fff', color: '#3c4043', textAlign: 'center', fontFamily: 'var(--font-text)' }}>
              
              {/* Singpass Emblem */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem', alignItems: 'center', gap: '0.4rem' }}>
                <div style={{ background: '#ef3737', color: '#fff', padding: '0.35rem 0.8rem', borderRadius: '4px', fontSize: '0.9rem', fontWeight: '900', letterSpacing: '1px' }}>
                  singpass
                </div>
                <span style={{ fontSize: '0.6rem', color: '#ef3737', fontWeight: '800', border: '1px solid #ef3737', padding: '0.15rem 0.3rem', borderRadius: '3px' }}>GOVT SECURE</span>
              </div>
              
              <h3 style={{ fontSize: '1.2rem', fontWeight: '800', color: '#202124', marginBottom: '0.3rem', letterSpacing: '-0.3px' }}>
                Secure National Handshake
              </h3>
              <p style={{ fontSize: '0.78rem', color: '#5f6368', marginBottom: '1.2rem', lineHeight: '1.3' }}>
                Axiom Hope is requesting secure medical credential access via Singpass for Singapore HealthHub EHR drawer integration.
              </p>
              
              <div className="input-group" style={{ textAlign: 'left', marginBottom: '0.9rem' }}>
                <label style={{ fontSize: '0.65rem', color: '#ef3737', fontWeight: '800', letterSpacing: '0.5px' }}>SINGPASS SECURITIES ID / NRIC</label>
                <input 
                  type="text" 
                  placeholder="e.g. S9XXXXXXA"
                  value={agent.mockEmail}
                  onChange={(e) => agent.setMockEmail(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '0.9rem', outline: 'none', background: '#fff', color: '#202124', fontWeight: '700' }}
                />
              </div>

              <div className="input-group" style={{ textAlign: 'left', marginBottom: '1.5rem' }}>
                <label style={{ fontSize: '0.65rem', color: '#ef3737', fontWeight: '800', letterSpacing: '0.5px' }}>FULL REGISTERED NAME (AS IN NRIC)</label>
                <input 
                  type="text" 
                  placeholder="e.g. Gwendolyn Tan"
                  value={agent.mockName}
                  onChange={(e) => agent.setMockName(e.target.value)}
                  style={{ width: '100%', padding: '0.7rem', borderRadius: '6px', border: '1px solid #dadce0', fontSize: '0.9rem', outline: 'none', background: '#fff', color: '#202124', fontWeight: '700' }}
                />
              </div>

              <div style={{ background: '#f5f5f7', padding: '0.65rem', borderRadius: '8px', fontSize: '0.65rem', color: '#5f6368', textAlign: 'left', marginBottom: '1.5rem', lineHeight: '1.3', borderLeft: '3px solid #ef3737' }}>
                🔒 <strong>GovTech Security Standard:</strong> Your personal credentials remain encrypted and local. No PII is shared outside BCF Singapore clinical teams.
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button 
                  onClick={() => agent.setShowMockAuthModal(false)}
                  style={{ background: 'none', border: 'none', color: '#5f6368', fontWeight: '700', fontSize: '0.82rem', cursor: 'pointer' }}
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (!agent.mockEmail.trim() || !agent.mockName.trim()) {
                      alert("Please enter both NRIC/ID and Name to log in.");
                      return;
                    }
                    agent.setShowMockAuthModal(false);
                    agent.addLog("Handshaking with Singapore GovTech OAuth Gateway...", "info");
                    setTimeout(() => {
                      agent.simulateSingpassLogin(agent.mockEmail, agent.mockName);
                      agent.setMockEmail('');
                      agent.setMockName('');
                    }, 1000);
                  }}
                  style={{ background: '#ef3737', border: 'none', color: '#fff', fontWeight: '800', fontSize: '0.82rem', padding: '0.65rem 1.4rem', borderRadius: '6px', cursor: 'pointer', boxShadow: '0 2px 4px rgba(239,55,55,0.25)' }}
                >
                  AUTHENTICATE 🇸🇬
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Dynamic BIGGER SISTER PEER MATCHMAKING OVERLAY MODAL */}
        {agent.activeModule === 'sister' && (agent.biggerSisterLoading || agent.biggerSisterMatched) && (
          <div className="settings-modal-overlay" style={{ zIndex: '3000', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.35)' }}>
            <div className="settings-modal-card bcf-portal-card" style={{ maxWidth: '420px', border: '2px solid var(--accent-cyan)', boxShadow: '0 8px 30px rgba(0, 130, 138, 0.15)' }}>
              
              <div className="console-header" style={{ borderBottom: '1px solid rgba(0,130,138,0.2)' }}>
                <span className="console-title" style={{ color: 'var(--accent-cyan)', fontWeight: '800' }}>
                  🤝 BCF PEER SYSTEM // SISTER MATCHMAKER
                </span>
              </div>

              <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                {agent.biggerSisterLoading && (
                  <div>
                    <div className="animate-spin" style={{ fontSize: '3rem', marginBottom: '1rem', animation: 'spin 2s linear infinite' }}>🔄</div>
                    <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '800' }}>SEARCHING BCF REGISTRIES...</h4>
                    <p style={{ fontSize: '0.74rem', color: 'var(--text-muted)' }}>Matching with verified breast cancer survivors in remission...</p>
                  </div>
                )}

                {agent.biggerSisterMatched && !agent.biggerSisterLoading && (
                  <div style={{ textAlign: 'left' }}>
                    <div style={{ display: 'flex', gap: '0.8rem', alignItems: 'center', marginBottom: '1rem', background: 'rgba(0,130,138,0.04)', padding: '0.8rem', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
                      <div style={{ fontSize: '2.5rem' }}>👩‍❤️‍👩</div>
                      <div>
                        <h4 style={{ color: 'var(--accent-cyan)', fontWeight: '800', fontSize: '0.95rem' }}>{agent.biggerSisterMatched.name}</h4>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Matched Peer Supporter // {agent.biggerSisterMatched.age} Years Old</span>
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', marginBottom: '0.8rem', color: 'var(--text-secondary)' }}>
                      <strong>Outpatient Biography:</strong>
                      <div style={{ fontSize: '0.74rem', background: '#fff', border: '1px solid var(--border-glass)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.2rem' }}>
                        {agent.biggerSisterMatched.history}
                      </div>
                    </div>

                    <div style={{ fontSize: '0.8rem', marginBottom: '1.2rem', color: 'var(--text-secondary)' }}>
                      <strong>Bigger Sister Recovery Tip:</strong>
                      <div style={{ fontSize: '0.74rem', fontStyle: 'italic', background: 'rgba(233,30,99,0.02)', border: '1px dashed var(--accent-purple)', padding: '0.5rem', borderRadius: '6px', marginTop: '0.2rem' }}>
                        "{agent.biggerSisterMatched.tips}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '0.6rem', justifyContent: 'center' }}>
                      <button 
                        className="btn-connect" 
                        onClick={() => {
                          const updateText = `Hello ${agent.biggerSisterMatched.name}! This is ${agent.patientName || 'Gwen'} from BCF. I was matched with you on BeTwin!`;
                          window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(updateText)}`);
                        }}
                        style={{ background: 'var(--accent-cyan)', borderColor: 'var(--accent-cyan)', color: '#fff', fontSize: '0.76rem', padding: '0.5rem 1rem' }}
                      >
                        CONNECT VIA WHATSAPP 📱
                      </button>
                      <button 
                        className="btn-connect" 
                        onClick={agent.matchBiggerSister}
                        style={{ fontSize: '0.76rem', padding: '0.5rem 1rem' }}
                      >
                        RE-MATCH
                      </button>
                      <button 
                        className="btn-connect" 
                        onClick={() => agent.switchModule('jargon')}
                        style={{ fontSize: '0.76rem', padding: '0.5rem 1rem' }}
                      >
                        Close
                      </button>
                    </div>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}

        {/* Dynamic BIGGER SISTER TRIGGER BUTTON (Renders inside Card 6 when active) */}
        {agent.activeModule === 'sister' && !agent.biggerSisterMatched && !agent.biggerSisterLoading && (
          <div className="settings-modal-overlay" style={{ zIndex: '2000', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0,0,0,0.2)' }}>
            <div className="settings-modal-card bcf-portal-card" style={{ maxWidth: '400px', border: '1px solid var(--border-glass)' }}>
              <div className="console-header">
                <span className="console-title">🤝 BIGGER SISTER PEER ACCESS</span>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>👩‍❤️‍👩</div>
                <h4 style={{ color: 'var(--text-primary)', marginBottom: '0.4rem', fontWeight: '800' }}>BCF Peer Outpatient Matching</h4>
                <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginBottom: '1.5rem', lineHeight: '1.4' }}>
                  Connect with experienced breast cancer survivors who are ready to listen, share practical recovery tips, and provide reassurance.
                </p>
                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                  <button 
                    onClick={agent.matchBiggerSister}
                    style={{ background: 'var(--accent-purple)', borderColor: 'var(--accent-purple)', color: '#fff', padding: '0.65rem 1.4rem', fontSize: '0.82rem', fontWeight: '800', cursor: 'pointer', borderRadius: '6px' }}
                  >
                    FIND A BIGGER SISTER MATCH ➔
                  </button>
                  <button 
                    className="btn-connect"
                    onClick={() => agent.switchModule('jargon')}
                    style={{ fontSize: '0.82rem', padding: '0.65rem 1.4rem' }}
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Trauma-Informed AI Crisis Guardrails Overlay Modal */}
        {agent.crisisTriggered && (
          <div className="settings-modal-overlay" style={{ background: 'rgba(12, 2, 4, 0.95)', zIndex: '2000' }}>
            <div className="settings-modal-card bcf-portal-card" style={{ maxWidth: '480px', border: '2px solid var(--accent-red)', boxShadow: '0 0 30px rgba(198, 40, 40, 0.4)' }}>
              <div className="console-header" style={{ borderBottom: '1px solid rgba(198, 40, 40, 0.2)' }}>
                <span className="console-title" style={{ color: 'var(--accent-red)', fontWeight: '800', letterSpacing: '1px' }}>
                  ⚠️ BCF COMPANION CLINICAL SAFETY SHIELD
                </span>
              </div>
              <div className="modal-body" style={{ textAlign: 'center', padding: '1.5rem 1rem 1rem 1rem' }}>
                <div style={{ fontSize: '3rem', marginBottom: '0.8rem' }}>💝</div>
                <h3 style={{ fontFamily: 'var(--font-display)', color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.8rem' }}>
                  You are not alone. Please reach out.
                </h3>
                <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', lineHeight: '1.5', marginBottom: '1.5rem' }}>
                  Axiom Hope is here to provide supportive preparation and reflections, but you deserve immediate professional human care. 
                  Please connect with one of these compassionate, dedicated local services in Singapore. They are ready to listen.
                </p>
                
                <div className="safety-hotlines-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', marginBottom: '1.5rem', textAlign: 'left' }}>
                  
                  <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-glass)', padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>BCF Singapore Support Circle</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>Peer-led support & counseling group</div>
                    </div>
                    <a href="tel:63526560" style={{ color: 'var(--accent-purple)', fontWeight: '700', fontSize: '0.85rem', background: 'rgba(233,30,99,0.08)', padding: '0.35rem 0.75rem', borderRadius: '15px', textDecoration: 'none' }}>
                      📞 6352 6560
                    </a>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-glass)', padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Samaritans of Singapore (SOS)</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>24/7 Suicide Prevention & Crisis Helpline</div>
                    </div>
                    <a href="tel:1767" style={{ color: 'var(--accent-cyan)', fontWeight: '700', fontSize: '0.85rem', background: 'rgba(0,130,138,0.08)', padding: '0.35rem 0.75rem', borderRadius: '15px', textDecoration: 'none' }}>
                      📞 1767
                    </a>
                  </div>

                  <div style={{ background: 'rgba(255,255,255,0.7)', border: '1px solid var(--border-glass)', padding: '0.8rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <strong style={{ fontSize: '0.82rem', color: 'var(--text-primary)' }}>Institute of Mental Health (IMH)</strong>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>24/7 Helpline for urgent mental wellness</div>
                    </div>
                    <a href="tel:63892222" style={{ color: 'var(--accent-gold)', fontWeight: '700', fontSize: '0.85rem', background: 'rgba(216,93,0,0.08)', padding: '0.35rem 0.75rem', borderRadius: '15px', textDecoration: 'none' }}>
                      📞 6389 2222
                    </a>
                  </div>

                </div>

                <div style={{ display: 'flex', gap: '0.8rem', justifyContent: 'center' }}>
                  <button 
                    className="btn-connect" 
                    onClick={() => {
                      agent.setCrisisTriggered(false);
                      agent.addLog("Safety guardrail resolved. Restoring companion workspace.", "info");
                    }}
                    style={{ padding: '0.7rem 1.6rem', fontSize: '0.82rem' }}
                  >
                    RETURN TO COMPANION
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
