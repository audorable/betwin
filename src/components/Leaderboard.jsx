import React, { useState, useEffect } from 'react';

export default function Leaderboard({ elo, solvedCount, totalTime }) {
  const [logs, setLogs] = useState([]);
  
  // High-fidelity historical mathematician competitors
  const competitors = [
    { name: "Srinivasa Ramanujan", elo: 3200, tier: "Gödel's Conjecture", rank: 1 },
    { name: "Leonhard Euler", elo: 3120, tier: "Hilbert's Space", rank: 2 },
    { name: "Carl Friedrich Gauss", elo: 3080, tier: "Hilbert's Space", rank: 3 },
    { name: "Terence Tao", elo: 2950, tier: "Riemann's Dimension", rank: 4 },
    { name: "Ada Lovelace", elo: 2820, tier: "Newton's Lab", rank: 5 },
    { name: "Alan Turing", elo: 2750, tier: "Newton's Lab", rank: 6 },
    { name: "You (Genius Prospect)", elo: elo, tier: getTierName(elo), rank: 7, isUser: true },
    { name: "Blaise Pascal", elo: 980, tier: "Euler's Playground", rank: 8 },
    { name: "Fibonacci", elo: 920, tier: "Euler's Playground", rank: 9 }
  ].sort((a, b) => b.elo - a.elo);

  // Assign updated ranks after sorting
  competitors.forEach((c, idx) => {
    c.rank = idx + 1;
  });

  function getTierName(rating) {
    if (rating >= 3000) return "Gödel's Conjecture";
    if (rating >= 2500) return "Hilbert's Space";
    if (rating >= 2000) return "Riemann's Dimension";
    if (rating >= 1500) return "Newton's Lab";
    if (rating >= 1200) return "Gauss's Chamber";
    return "Euler's Playground";
  }

  // Simulated real-time system logs
  useEffect(() => {
    const historicalLogs = [
      "Srinivasa Ramanujan discovered a new modular equation of degree 7.",
      "Carl Friedrich Gauss solved 17-gon construction challenge verbally in 4s.",
      "Leonhard Euler completed the Königsberg Bridge graph logic in Tier 3.",
      "Ada Lovelace bypassed Bernoulli number iteration loops in 12s.",
      "Alan Turing cracked the Hilbert Decidability riddle.",
      "Terence Tao completed a prime progression set challenge.",
      "Newton-9000 validated Euler's constant approximation."
    ];

    const interval = setInterval(() => {
      const randomMsg = historicalLogs[Math.floor(Math.random() * historicalLogs.length)];
      setLogs((prev) => [
        `[${new Date().toLocaleTimeString()}] ${randomMsg}`,
        ...prev.slice(0, 4)
      ]);
    }, 8000);

    return () => clearInterval(interval);
  }, []);

  const averageTime = solvedCount > 0 ? (totalTime / solvedCount).toFixed(1) : "0.0";

  return (
    <div className="side-panel right">
      <div className="panel-header">
        <span>🏆 COGNITIVE METRICS</span>
        <span className="logo-badge" style={{ borderColor: 'var(--accent-purple)', color: 'var(--accent-purple)' }}>ELITE</span>
      </div>
      
      <div className="panel-content">
        {/* User stats overview */}
        <div className="stat-group">
          <div className="stat-card">
            <div className="stat-label">YOUR ELO RATING</div>
            <div className="stat-val glow-cyan">{elo}</div>
          </div>
          <div className="stat-card">
            <div className="stat-label">SOLVED TIERS</div>
            <div className="stat-val glow-purple">{solvedCount}</div>
          </div>
        </div>

        <div className="stat-group">
          <div className="stat-card" style={{ gridColumn: 'span 2' }}>
            <div className="stat-label">AVG VERBAL REASONING SPEED</div>
            <div className="stat-val glow-gold" style={{ fontSize: '1.1rem' }}>{averageTime}s <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>per challenge</span></div>
          </div>
        </div>

        {/* Dynamic Geniuses Leaderboard */}
        <div style={{ marginTop: '1rem' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.8rem', marginBottom: '0.6rem', color: 'var(--accent-cyan)' }}>
            LEADERBOARD MATRIX
          </h4>
          <div className="leaderboard-list">
            {competitors.map((c) => (
              <div 
                key={c.name} 
                className={`leaderboard-card ${c.isUser ? 'current-user' : ''}`}
              >
                <span className="leaderboard-rank">{c.rank}</span>
                <div className="leaderboard-profile">
                  <span className="leaderboard-name">
                    {c.isUser ? '⚡ ' : ''}{c.name}
                  </span>
                  <span className="leaderboard-tier">{c.tier}</span>
                </div>
                <span className={`leaderboard-score ${c.isUser ? 'xp' : ''}`}>{c.elo}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Global matrix updates */}
        <div style={{ marginTop: '0.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
          <h4 style={{ fontFamily: 'var(--font-display)', fontSize: '0.75rem', marginBottom: '0.4rem', color: 'var(--text-dim)' }}>
            COGNITIVE TELEMETRY FEED
          </h4>
          <div className="terminal-monitor" style={{ height: '110px', flex: 'none', background: 'rgba(0,0,0,0.5)', padding: '0.5rem', fontSize: '0.65rem' }}>
            {logs.length === 0 ? (
              <div className="terminal-line system">
                System standing by. Monitoring global cognitive matrix...<span className="terminal-cursor"></span>
              </div>
            ) : (
              logs.map((log, idx) => (
                <div key={idx} className="terminal-line system" style={{ marginBottom: '4px' }}>
                  {log}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
