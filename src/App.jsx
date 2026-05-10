import { useState, useEffect, useRef } from 'react'
import config from './config.json'

// Typewriter component for the latest log
const TypewriterLog = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 20); // 20ms per character
    return () => clearInterval(interval);
  }, [text]);

  return <span>{displayedText}</span>;
};

function App() {
  const [domainMode, setDomainMode] = useState('cyber');
  const [activeSignal, setActiveSignal] = useState(null);
  const [roadmap, setRoadmap] = useState(config.domain_config.roadmap);
  const [missionLog, setMissionLog] = useState([
    { text: "System Initialized. Sentinel Audit engine active.", time: "Just now" }
  ]);
  const [reRankedItemId, setReRankedItemId] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  
  // Agent states: idle, processing, complete
  const [scoutState, setScoutState] = useState('idle');
  const [strategistState, setStrategistState] = useState('idle');
  const [architectState, setArchitectState] = useState('idle');
  const [sentinelState, setSentinelState] = useState('idle');

  const addLog = (text) => {
    setMissionLog(prev => [{ text, time: "Just now" }, ...prev.map(l => ({...l, time: "2m ago"}))]);
  };

  const handleSignalClick = (signal) => {
    setActiveSignal(signal);
    setScoutState('processing');
    addLog(`Scout Agent: Ingesting signal '${signal.label}'. Calculated Intensity: ${signal.intensity}.`);
    
    // Simulate flow
    setTimeout(() => {
      setScoutState('idle');
      setStrategistState('processing');
      addLog(`Strategist Agent: Analyzing ${signal.label} intensity... Impact score calculated at 9.2... Re-ranking roadmap.`);
      
      if (signal.intensity >= 8) {
        setTimeout(() => {
          const newRoadmap = [...roadmap].map(item => {
            if (item.id === 'rm-1') return { ...item, status: "Priority 1 (Urgent)" };
            return item;
          });
          setRoadmap(newRoadmap);
          setReRankedItemId('rm-1');
          setStrategistState('idle');
          setTimeout(() => setReRankedItemId(null), 2000); // clear glow
        }, 1500);
      } else {
         setStrategistState('idle');
      }
    }, 2000);
  }

  const handleExecuteMission = () => {
    setShowOverlay(true);
    setArchitectState('processing');
    setSentinelState('processing');
    addLog(`Architect Agent: Generating Vibe-to-Code prototype for current signal context...`);
    setTimeout(() => {
      setArchitectState('idle');
      addLog(`Sentinel Agent: Auditing generated artifacts against security rubrics...`);
      setTimeout(() => setSentinelState('idle'), 2000);
    }, 2500);
  }

  return (
    <div className={`app-container ${domainMode === 'health' ? 'theme-health' : ''}`}>
      {/* Global Impact Header */}
      <div className="panel" style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem 1rem' }}>
        <div style={{ display: 'flex', gap: '2rem' }}>
          <div className="hero-metric">
            <div className="hero-value">{config.global_metrics.mttr_reduction}</div>
            <div className="hero-label">MTTR Reduction</div>
          </div>
          <div className="hero-metric">
            <div className="hero-value">{config.global_metrics.feature_waste}</div>
            <div className="hero-label">Feature Waste</div>
          </div>
          <div className="hero-metric">
            <div className="hero-value">{config.global_metrics.agentic_uplift}</div>
            <div className="hero-label">Agentic Uplift</div>
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ fontSize: '0.75rem', marginRight: '8px', color: 'var(--text-secondary)'}}>Context:</span>
          <button className="btn-execute" onClick={() => setDomainMode(d => d === 'cyber' ? 'health' : 'cyber')}>
            {domainMode === 'cyber' ? 'Cybersecurity' : 'Health-Tech'} ⟳
          </button>
        </div>
      </div>

      {/* 1. Agent Status Panel */}
      <header className="panel">
        <div className="panel-header">Agent Status & Mission Log</div>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <div>
            <span className={scoutState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-cyan)'}}>●</span> Scout: {scoutState.toUpperCase()}
          </div>
          <div>
            <span className={strategistState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-green)'}}>●</span> Strategist: {strategistState.toUpperCase()}
          </div>
          <div>
            <span className={architectState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-purple)'}}>●</span> Architect: {architectState.toUpperCase()}
          </div>
          <div>
            <span className={sentinelState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-orange)'}}>●</span> Sentinel: {sentinelState.toUpperCase()}
          </div>
        </div>
        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', height: '60px', overflowY: 'hidden' }}>
          {missionLog.map((log, i) => (
            <div key={i} style={{ opacity: 1 - (i * 0.3), marginBottom: '4px' }}>
              <span style={{ color: 'var(--accent-cyan)', marginRight: '8px' }}>[{log.time}]</span>
              &gt; {i === 0 ? <TypewriterLog text={log.text} /> : log.text}
            </div>
          ))}
        </div>
      </header>

      <div className="main-content">
        {/* 2. Scout Radar */}
        <aside className="sidebar panel">
          <div className="panel-header">Cyber-Signal Radar</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {config.domain_config.signals.map(signal => (
              <div 
                key={signal.id} 
                onClick={() => handleSignalClick(signal)}
                style={{ 
                  padding: '0.75rem', 
                  border: `1px solid ${activeSignal?.id === signal.id ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: activeSignal?.id === signal.id ? 'var(--accent-cyan-glow)' : 'transparent',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                  <div style={{ fontSize: '0.75rem', color: signal.intensity >= 8 ? 'var(--accent-orange)' : 'var(--accent-cyan)' }}>
                    [{signal.type}]
                  </div>
                  {signal.intensity >= 8 && <div className="badge-danger">Vuln Window</div>}
                </div>
                <div style={{ fontWeight: 600 }}>{signal.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '4px' }}>
                  Intensity: <span style={{ color: signal.intensity >= 8 ? 'var(--accent-orange)' : 'inherit'}}>{signal.intensity}/10</span>
                </div>
              </div>
            ))}
          </div>
        </aside>

        <div className="content-area">
          {/* 3. Strategist Prioritizer */}
          <section className="panel" style={{ flex: '1 0 auto' }}>
            <div className="panel-header">Attack-Path Prioritizer (Roadmap)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {roadmap.map(item => (
                <div 
                  key={item.id} 
                  className={reRankedItemId === item.id ? 'glow-highlight' : ''}
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '0.75rem', 
                    borderBottom: '1px solid var(--border-color)',
                    backgroundColor: reRankedItemId === item.id ? 'var(--bg-tertiary)' : 'transparent',
                    borderRadius: '4px'
                  }}
                >
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.feature}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Strategic Logic: {item.logic}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ color: item.status.includes('Urgent') ? 'var(--accent-green)' : 'inherit', fontWeight: 'bold' }}>
                      {item.status}
                    </div>
                    {item.status.includes('Urgent') && activeSignal && (
                      <button className="btn-execute" onClick={handleExecuteMission}>
                        Execute Mission
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {/* 4. Vibe-to-Code Pop-out Terminal (Overlay) */}
      {showOverlay && (
        <div className="modal-overlay" onClick={() => setShowOverlay(false)}>
          <div className="panel modal-content" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <span>Sentinel Terminal: Automated Audit</span>
              <button className="btn-execute" onClick={() => setShowOverlay(false)}>Close Terminal X</button>
            </div>
            
            <div className="diff-container">
              {/* Architect Pane */}
              <div className="diff-pane mono">
                <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>// Architect Agent: Generated Protocol</div>
                <div className="diff-line diff-add">
                  <span>+</span><span>export const establishZeroTrust = () =&gt; {'{'}</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>  // Initializes ABDM/OWASP compliant vault</span>
                </div>
                <div className="diff-line diff-remove">
                  <span>-</span><span>  const vault = new Vault({'{'} enforce: false {'}'}); // MUST enforce</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>  const vault = new Vault({'{'} enforce: true {'}'});  // WILL enforce</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>  return vault.lock();</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>{'}'}</span>
                </div>
              </div>

              {/* Sentinel Pane */}
              <div className="diff-pane">
                <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem', fontFamily: 'JetBrains Mono' }}>// Sentinel Agent: Quality Gate Report</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  
                  <div className="panel" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <div className="health-ring health-pass"></div>
                      <strong>Security Hardening (OWASP)</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Verification complete. Zero-Trust initialization verified.</div>
                  </div>

                  <div className="panel" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <div className="health-ring health-fail"></div>
                      <strong>"Will" Protocol Adherence</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--accent-orange)' }}>
                      Violation detected on Line 3. Generated draft used "must". Corrected to declarative "will" on Line 4.
                    </div>
                  </div>

                  <div className="panel" style={{ backgroundColor: 'var(--bg-primary)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', marginBottom: '8px' }}>
                      <div className="health-ring health-pass"></div>
                      <strong>Clinical Faithfulness (ABDM)</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Vault decoupled per M3 data residency regulations.</div>
                  </div>

                </div>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  )
}

export default App
