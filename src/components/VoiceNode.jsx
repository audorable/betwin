import React, { useEffect, useRef, useState } from 'react';

export default function VoiceNode({ 
  voiceState, // 'idle', 'listening', 'thinking', 'speaking'
  onSpeechInput, 
  personality, 
  setPersonality, 
  micAllowed, 
  setMicAllowed,
  errorMessage 
}) {
  const canvasRef = useRef(null);
  const [interimTranscript, setInterimTranscript] = useState('');
  const recognitionRef = useRef(null);
  const [isListening, setIsListening] = useState(false);
  const animationFrameId = useRef(null);

  // Initializing Web Speech API
  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = true;
      rec.interimResults = true;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setMicAllowed(true);
      };

      rec.onresult = (event) => {
        let final = '';
        let interim = '';
        for (let i = event.resultIndex; i < event.results.length; ++i) {
          if (event.results[i].isFinal) {
            final += event.results[i][0].transcript;
          } else {
            interim += event.results[i][0].transcript;
          }
        }
        setInterimTranscript(interim);
        if (final.trim()) {
          onSpeechInput(final.trim());
        }
      };

      rec.onerror = (err) => {
        console.error('Speech recognition error', err);
        if (err.error === 'not-allowed') {
          setMicAllowed(false);
        }
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    } else {
      console.warn("Web Speech API is not supported in this browser.");
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [onSpeechInput, setMicAllowed]);

  // Handle voice state change to trigger mic
  useEffect(() => {
    if (voiceState === 'listening' && recognitionRef.current && !isListening) {
      try {
        recognitionRef.current.start();
      } catch (e) {
        console.error(e);
      }
    } else if (voiceState !== 'listening' && recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
  }, [voiceState, isListening]);

  // Toggle listening manually
  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Speech recognition is not supported in this browser. Please use Google Chrome.");
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
    } else {
      setInterimTranscript('');
      recognitionRef.current.start();
    }
  };

  // Sine wave canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let phase = 0;

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const width = canvas.width;
      const height = canvas.height;
      
      let lines = 3;
      let amplitude = 10;
      let speed = 0.08;

      if (voiceState === 'listening') {
        amplitude = 25;
        speed = 0.15;
        lines = 4;
      } else if (voiceState === 'speaking') {
        amplitude = 20;
        speed = 0.2;
        lines = 5;
      } else if (voiceState === 'thinking') {
        amplitude = 5;
        speed = 0.04;
        lines = 2;
      } else {
        amplitude = 3;
        speed = 0.02;
        lines = 1;
      }

      ctx.lineWidth = 1.5;
      
      for (let i = 0; i < lines; i++) {
        ctx.beginPath();
        const colorRatio = i / lines;
        
        // Dynamic gradient colors
        if (voiceState === 'listening') {
          ctx.strokeStyle = `rgba(57, 255, 20, ${0.8 - colorRatio * 0.5})`;
        } else if (voiceState === 'speaking') {
          ctx.strokeStyle = `rgba(189, 0, 255, ${0.8 - colorRatio * 0.5})`;
        } else {
          ctx.strokeStyle = `rgba(0, 240, 255, ${0.8 - colorRatio * 0.5})`;
        }

        const phaseOffset = i * Math.PI / 4;
        const stretch = 0.015 - i * 0.002;

        for (let x = 0; x < width; x++) {
          const y = height / 2 + Math.sin(x * stretch + phase + phaseOffset) * amplitude * Math.sin(x * Math.PI / width);
          if (x === 0) {
            ctx.moveTo(x, y);
          } else {
            ctx.lineTo(x, y);
          }
        }
        ctx.stroke();
      }

      phase += speed;
      animationFrameId.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId.current);
    };
  }, [voiceState]);

  return (
    <div className="card" style={{ height: '100%' }}>
      <div className="card-header">
        <span className="glow-cyan">Axiom Neural Node // Voice Core</span>
        <span className="logo-badge">{voiceState.toUpperCase()}</span>
      </div>
      <div className="card-content" style={{ justifyContent: 'center', padding: '1rem' }}>
        <div className="voice-node-container">
          <div className="voice-orb-wrapper">
            <div className={`orb-ring orb-ring-1`}></div>
            <div className={`orb-ring orb-ring-2`}></div>
            <div 
              className={`voice-orb ${voiceState}`} 
              onClick={toggleListening}
              title="Click to toggle verbal challenge inputs"
            >
              {voiceState === 'listening' ? '🎤' : voiceState === 'speaking' ? '🔊' : voiceState === 'thinking' ? '🧠' : '👁️'}
            </div>
          </div>

          <div style={{ width: '100%', textAlign: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              {voiceState === 'listening' ? 'Capturing verbal reasoning...' : 
               voiceState === 'speaking' ? 'Newton-9000 speaks...' : 
               voiceState === 'thinking' ? 'Validating concepts...' : 'Axiom standing by...'}
            </span>
            {interimTranscript && (
              <div style={{ fontStyle: 'italic', color: 'var(--accent-cyan)', fontSize: '0.8rem', marginTop: '0.3rem' }}>
                &ldquo;{interimTranscript}&rdquo;
              </div>
            )}
          </div>

          <canvas ref={canvasRef} className="voice-canvas" width={300} height={60}></canvas>

          {/* Voice Personality Control Panel */}
          <div style={{ display: 'flex', gap: '0.5rem', width: '100%', justifyContent: 'center', marginTop: '0.5rem' }}>
            <button 
              className={`header-btn ${personality === 'mentor' ? 'glow-cyan' : ''}`}
              style={{ flex: 1, fontSize: '0.65rem', padding: '4px 6px' }}
              onClick={() => setPersonality('mentor')}
            >
              👩‍🏫 Aria (Mentor)
            </button>
            <button 
              className={`header-btn ${personality === 'coach' ? 'glow-cyan' : ''}`}
              style={{ flex: 1, fontSize: '0.65rem', padding: '4px 6px' }}
              onClick={() => setPersonality('coach')}
            >
              🔥 Marcus (Coach)
            </button>
            <button 
              className={`header-btn ${personality === 'ai' ? 'glow-cyan' : ''}`}
              style={{ flex: 1, fontSize: '0.65rem', padding: '4px 6px' }}
              onClick={() => setPersonality('ai')}
            >
              🤖 Newton-9000 (AI)
            </button>
          </div>

          {!micAllowed && (
            <div style={{ color: 'var(--accent-red)', fontSize: '0.7rem', marginTop: '0.4rem', textAlign: 'center' }}>
              ⚠️ Microphone blocked. Check your browser permissions.
            </div>
          )}
          {errorMessage && (
            <div style={{ color: 'var(--accent-red)', fontSize: '0.7rem', marginTop: '0.4rem', textAlign: 'center' }}>
              ⚠️ {errorMessage}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
