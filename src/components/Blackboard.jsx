import React, { useEffect, useRef } from 'react';
import katex from 'katex';

export default function Blackboard({ equation, questionText, category, difficulty }) {
  const equationRef = useRef(null);

  useEffect(() => {
    if (equationRef.current) {
      if (equation) {
        try {
          katex.render(equation, equationRef.current, {
            throwOnError: false,
            displayMode: true
          });
        } catch (err) {
          console.error("KaTeX failed to render:", err);
          equationRef.current.innerHTML = equation; // Fallback
        }
      } else {
        equationRef.current.innerHTML = "";
      }
    }
  }, [equation]);

  return (
    <div className="blackboard-container">
      <div className="blackboard-header">
        <span className="glow-cyan">{category || "Axiom Core // Solver Matrix"}</span>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <span className="logo-badge" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)', background: 'rgba(189, 0, 255, 0.05)' }}>
            DIFFICULTY: {difficulty || "1"}
          </span>
          <span style={{ color: 'var(--text-secondary)' }}>ONLINE STATUS: ACTIVE</span>
        </div>
      </div>
      <div className="blackboard-content">
        <div className="blackboard-grid-glow"></div>
        {questionText && (
          <p className="math-question-text">{questionText}</p>
        )}
        <div className="math-equation" ref={equationRef}>
          {/* Rendered via KaTeX */}
        </div>
      </div>
    </div>
  );
}
