import React, { useState, useEffect } from 'react';

export default function SettingsPanel({ isOpen, onClose, onSave }) {
  const [elevenLabsKey, setElevenLabsKey] = useState('');
  const [geminiKey, setGeminiKey] = useState('');
  const [wolframKey, setWolframKey] = useState('');
  const [voiceIdMentor, setVoiceIdMentor] = useState('EXAVITQu4vr4xnSDxMaL'); // Bella
  const [voiceIdCoach, setVoiceIdCoach] = useState('pNInz6obpgq5paNs9W5D'); // Mitchell
  const [voiceIdAI, setVoiceIdAI] = useState('21m00Tcm4TlvDq8ikWAM'); // Rachel

  useEffect(() => {
    setElevenLabsKey(localStorage.getItem('AXIOM_ELEVEN_LABS_KEY') || '');
    setGeminiKey(localStorage.getItem('AXIOM_GEMINI_KEY') || '');
    setWolframKey(localStorage.getItem('AXIOM_WOLFRAM_KEY') || '');
    setVoiceIdMentor(localStorage.getItem('AXIOM_VOICE_MENTOR') || 'EXAVITQu4vr4xnSDxMaL');
    setVoiceIdCoach(localStorage.getItem('AXIOM_VOICE_COACH') || 'pNInz6obpgq5paNs9W5D');
    setVoiceIdAI(localStorage.getItem('AXIOM_VOICE_AI') || '21m00Tcm4TlvDq8ikWAM');
  }, [isOpen]);

  const handleSave = () => {
    localStorage.setItem('AXIOM_ELEVEN_LABS_KEY', elevenLabsKey);
    localStorage.setItem('AXIOM_GEMINI_KEY', geminiKey);
    localStorage.setItem('AXIOM_WOLFRAM_KEY', wolframKey);
    localStorage.setItem('AXIOM_VOICE_MENTOR', voiceIdMentor);
    localStorage.setItem('AXIOM_VOICE_COACH', voiceIdCoach);
    localStorage.setItem('AXIOM_VOICE_AI', voiceIdAI);
    
    onSave({
      elevenLabsKey,
      geminiKey,
      wolframKey,
      voiceIdMentor,
      voiceIdCoach,
      voiceIdAI
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <span className="glow-cyan">⚙️ AXIOM TERMINAL CONFIG</span>
          <button className="modal-close" onClick={onClose}>×</button>
        </div>
        <div className="modal-body">
          
          <div className="form-group">
            <label>
              ELEVENLABS API KEY
              <span className="logo-badge" style={{ fontSize: '0.55rem' }}>REQUIRED FOR TTS</span>
            </label>
            <input 
              type="password" 
              placeholder="Enter your ElevenLabs API Key..." 
              value={elevenLabsKey}
              onChange={(e) => setElevenLabsKey(e.target.value)}
            />
            <span className="help-text">
              Saved locally in your browser storage. Your key is sent directly to api.elevenlabs.io.
            </span>
          </div>

          <div className="form-group">
            <label>
              GEMINI API KEY (OPTIONAL)
              <span className="logo-badge" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)', fontSize: '0.55rem' }}>FALLBACK READY</span>
            </label>
            <input 
              type="password" 
              placeholder="Enter your Google Gemini API Key..." 
              value={geminiKey}
              onChange={(e) => setGeminiKey(e.target.value)}
            />
            <span className="help-text">
              Used to generate advanced, custom math challenges in real-time. If blank, Axiom uses its built-in advanced offline math matrix.
            </span>
          </div>

          <div className="form-group">
            <label>WOLFRAM|ALPHA APP ID (OPTIONAL)</label>
            <input 
              type="password" 
              placeholder="Enter your Wolfram|Alpha App ID..." 
              value={wolframKey}
              onChange={(e) => setWolframKey(e.target.value)}
            />
            <span className="help-text">
              For complex equation parsing. Axiom includes a built-in algebraic tokenizer to evaluate mathematical verbal inputs offline if not provided.
            </span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.8rem' }}>
            <div className="form-group">
              <label>ARIA VOICE ID</label>
              <select value={voiceIdMentor} onChange={(e) => setVoiceIdMentor(e.target.value)}>
                <option value="EXAVITQu4vr4xnSDxMaL">Bella (Sweet/Clear)</option>
                <option value="AZnzlk1XvdvUeBnXmlld">Domi (Warm/Sensible)</option>
                <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Professional)</option>
              </select>
            </div>
            <div className="form-group">
              <label>MARCUS VOICE ID</label>
              <select value={voiceIdCoach} onChange={(e) => setVoiceIdCoach(e.target.value)}>
                <option value="pNInz6obpgq5paNs9W5D">Mitchell (Energetic/Spunky)</option>
                <option value="ErXwobaYiN019PkySvjV">Antoni (Expressive/Cool)</option>
                <option value="N2lVSClvYn3eP8y74413">Gigi (Lively)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>NEWTON VOICE ID</label>
            <select value={voiceIdAI} onChange={(e) => setVoiceIdAI(e.target.value)}>
              <option value="21m00Tcm4TlvDq8ikWAM">Rachel (Calm Robot)</option>
              <option value="TX38sp0aOMBrz2cR1jLv">Eric (Declamatory AI)</option>
              <option value="VR6AHRvjWBbahRxUNhoa">Adam (Deep Technical)</option>
            </select>
          </div>

        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={onClose}>CANCEL</button>
          <button className="btn-primary" onClick={handleSave}>INITIALIZE AGENT</button>
        </div>
      </div>
    </div>
  );
}
