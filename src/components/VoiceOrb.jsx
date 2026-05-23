import React from 'react';
import GhostAvatar from './GhostAvatar';

export default function VoiceOrb({ voiceState, bootState, speechAmplitude = 0, onOrbClick }) {
  // Determine the color profile and glowing box-shadow for each state (Blue-Green theme)
  let orbGradient = 'linear-gradient(135deg, #80deea 0%, #a5d6a7 100%)'; // Idle soft mint gradient
  let glowColor = 'rgba(128, 222, 234, 0.2)';
  let glowIntensity = 15;
  let statusText = '○ STANDBY // CLICK TO AWAKEN';
  let statusColor = 'var(--text-muted)';

  if (bootState === 'active') {
    if (voiceState === 'speaking') {
      orbGradient = 'linear-gradient(135deg, #00e5ff 0%, #00e676 100%)'; // Vibrant cyan to emerald green
      glowColor = 'rgba(0, 229, 255, 0.55)';
      glowIntensity = 25 + speechAmplitude * 65; // scales dynamically with the patient's and agent's voice
      statusText = '● BETWIN AGENT SPEAKING...';
      statusColor = 'var(--accent-purple)';
    } else if (voiceState === 'listening') {
      orbGradient = 'linear-gradient(135deg, #00b8d4 0%, #4db6ac 100%)'; // Oceanic turquoise to deep sage teal
      glowColor = 'rgba(0, 184, 212, 0.45)';
      glowIntensity = 20 + Math.random() * 15;
      statusText = '🎤 LISTENING FOR REFLECTIONS...';
      statusColor = 'var(--accent-cyan)';
    } else if (voiceState === 'thinking') {
      orbGradient = 'linear-gradient(135deg, #26a69a 0%, #80deea 100%)'; // Soothing teal transition
      glowColor = 'rgba(38, 166, 154, 0.35)';
      glowIntensity = 18;
      statusText = '○ BETWIN AGENT REFLECTING...';
      statusColor = 'var(--accent-gold)';
    } else if (voiceState === 'unlocked') {
      orbGradient = 'linear-gradient(135deg, #00e676 0%, #b9f6ca 100%)'; // Healing light-green success glow
      glowColor = 'rgba(0, 230, 118, 0.5)';
      glowIntensity = 20;
      statusText = '✔ TELEMETRY RECORDED';
      statusColor = 'var(--accent-green)';
    } else {
      orbGradient = 'linear-gradient(135deg, #80deea 0%, #c8e6c9 100%)'; // Active standby soft mint
      glowColor = 'rgba(128, 222, 234, 0.25)';
      glowIntensity = 15;
      statusText = '● BETWIN AGENT ACTIVE';
      statusColor = 'var(--accent-cyan)';
    }
  }

  const scaleFactor = bootState === 'active' ? 1 + speechAmplitude * 0.16 : 1;

  return (
    <div 
      className="voice-orb-card"
      style={{
        background: '#ffffff',
        border: '1px solid rgba(0, 0, 0, 0.05)',
        borderRadius: '16px',
        padding: '1.4rem',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.03)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%',
        transition: 'all 0.3s ease'
      }}
    >
      <div 
        className="orb-header-tag"
        style={{
          fontSize: '0.62rem',
          fontWeight: '800',
          color: 'var(--text-muted)',
          letterSpacing: '1px',
          marginBottom: '1rem',
          textTransform: 'uppercase'
        }}
      >
        🌸 BCF Singapore Support Companion
      </div>

      <div 
        className="orb-interactive-area"
        style={{
          position: 'relative',
          width: '100%',
          height: '180px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer'
        }}
        onClick={onOrbClick}
        title={bootState === 'darkness' ? "Awaken Voice Companion" : "Disconnect session"}
      >
        {/* Soft, dotted, breathing outer audio ring */}
        <div 
          className={`dotted-audio-ring ${voiceState !== 'idle' ? 'active' : ''}`}
          style={{
            position: 'absolute',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            border: '1.5px dashed ' + (voiceState === 'listening' ? 'var(--accent-cyan)' : 'var(--accent-purple)'),
            opacity: voiceState !== 'idle' ? '0.3' : '0.08',
            animation: voiceState !== 'idle' ? 'spin 18s linear infinite' : 'none',
            transition: 'all 0.6s ease'
          }}
        ></div>

        {/* Serene organic Blue-Green spherical glow capsule */}
        <div 
          className="orb-sphere"
          style={{
            width: '120px',
            height: '120px',
            borderRadius: '50%',
            background: orbGradient,
            boxShadow: `0 0 ${glowIntensity}px ${glowColor}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            transform: `scale(${scaleFactor})`,
            transition: 'transform 0.15s cubic-bezier(0.25, 0.8, 0.25, 1), background 0.5s ease, box-shadow 0.2s ease',
            overflow: 'hidden'
          }}
        >
          {/* Internal soft lens reflection for depth */}
          <div 
            style={{
              position: 'absolute',
              top: '6px',
              left: '12px',
              width: '26px',
              height: '13px',
              background: 'rgba(255, 255, 255, 0.38)',
              borderRadius: '50%',
              transform: 'rotate(-15deg)',
              pointerEvents: 'none'
            }}
          ></div>

          {/* Concentric digital oscilloscope waves inside the orb core */}
          <GhostAvatar 
            amplitude={speechAmplitude} 
            active={bootState === 'active' && voiceState !== 'idle'} 
          />
        </div>
      </div>

      <div 
        className="orb-status-text"
        style={{
          fontSize: '0.65rem',
          fontFamily: 'var(--font-mono)',
          fontWeight: '700',
          color: statusColor,
          letterSpacing: '0.5px',
          marginTop: '0.8rem',
          transition: 'color 0.3s ease'
        }}
      >
        {statusText}
      </div>
    </div>
  );
}
