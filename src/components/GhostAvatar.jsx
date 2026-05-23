import React, { useEffect, useState } from 'react';

export default function GhostAvatar({ amplitude = 0, active = false }) {
  // Use state-based frame ticker to force re-render for smooth left-to-right propagation
  const [, setTick] = useState(0);

  useEffect(() => {
    let animId;
    const tickLoop = () => {
      setTick((t) => t + 1);
      animId = requestAnimationFrame(tickLoop);
    };
    animId = requestAnimationFrame(tickLoop);
    return () => cancelAnimationFrame(animId);
  }, []);

  // Generate SVG path for a high-fidelity propagating oscilloscope wave
  const getWavePath = (freqMultiplier, ampMultiplier, phaseShift, resolution = 70) => {
    let points = [];
    const width = 100; // SVG viewBox is 0 to 100
    const centerY = 50; // Horizontal center axis
    
    for (let i = 0; i <= resolution; i++) {
      const x = (i / resolution) * width;
      // Envelope to taper wave perfectly to 0 at the left and right edges so it anchors cleanly
      const norm = i / resolution;
      const envelope = Math.sin(norm * Math.PI);
      
      // Calculate dynamic wave amplitude based on vocal physics engine
      const baseAmp = active ? amplitude * 22 * ampMultiplier : 1.2 * ampMultiplier;
      
      // Left-to-right propagation phase shift over time
      const timePhase = Date.now() * 0.007 * freqMultiplier + phaseShift;
      
      // Oscilloscope trigonometric equation
      const angle = (norm * Math.PI * 4 * freqMultiplier) - timePhase;
      const y = centerY + Math.sin(angle) * baseAmp * envelope;
      
      points.push(`${i === 0 ? 'M' : 'L'} ${x.toFixed(2)},${y.toFixed(2)}`);
    }
    return points.join(' ');
  };

  // Generate three overlapping multi-frequency waves
  const cyanPath = getWavePath(1.0, 1.0, 0);
  const magentaPath = getWavePath(1.6, 0.75, Math.PI / 3);
  const greenPath = getWavePath(0.6, 0.5, Math.PI / 1.5);

  return (
    <div className={`ghost-avatar-container ${active ? 'active' : ''}`}>
      <svg 
        viewBox="0 0 100 100" 
        className="ghost-avatar-svg"
      >
        <defs>
          {/* Cyberpunk Neon Glow Filters */}
          <filter id="neon-cyan-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neon-magenta-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.8" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
          <filter id="neon-green-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Concentric Digital Radar Grid */}
        <circle cx="50" cy="50" r="44" className="radar-grid ring-outer" />
        <circle cx="50" cy="50" r="32" className="radar-grid ring-middle" />
        <circle cx="50" cy="50" r="18" className="radar-grid ring-inner" />
        
        {/* Radar Crosshairs */}
        <line x1="50" y1="6" x2="50" y2="94" className="radar-grid grid-line" />
        <line x1="6" y1="50" x2="94" y2="50" className="radar-grid grid-line" />

        {/* High-Fidelity Oscilloscope Wavelengths */}
        <g className="oscilloscope-waves">
          {/* Sub-harmonic Slow Wave (Green) */}
          <path 
            d={greenPath} 
            className="wave-line wave-green" 
            filter="url(#neon-green-glow)" 
          />
          {/* Secondary Fast Wave (Magenta) */}
          <path 
            d={magentaPath} 
            className="wave-line wave-magenta" 
            filter="url(#neon-magenta-glow)" 
          />
          {/* Primary Main Wave (Cyan) */}
          <path 
            d={cyanPath} 
            className="wave-line wave-cyan" 
            filter="url(#neon-cyan-glow)" 
          />
        </g>
      </svg>
    </div>
  );
}
