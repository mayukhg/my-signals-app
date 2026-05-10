import { useState, useEffect } from 'react'
import config from './config.json'

const mockMissionLogData = [
  {
    timestamp: "2026-05-10T14:20:01Z",
    agent: "Scout",
    action: "SIGNAL_DETECTED",
    message: "Detected surge in 'Spring4Shell-V2' exploit discussions on Dark Web forums (Intensity: 9.2). Cross-referencing with ABDM M3 Data Residency update released at 14:00Z.",
    color: "var(--accent-orange)"
  },
  {
    timestamp: "2026-05-10T14:20:05Z",
    agent: "Strategist",
    action: "PRIORITY_SHIFT",
    message: "Risk Score Calculated: 94/100. Overlapping vulnerability found in ABDM Identity Vault schema. Re-ranking Roadmap: 'Emergency Identity Patch' moved to Priority #1. Deprioritizing: 'Social Share UI'.",
    color: "var(--accent-cyan)"
  },
  {
    timestamp: "2026-05-10T14:20:12Z",
    agent: "Architect",
    action: "VIBE_CODING_INITIATED",
    message: "Drafting FHIR-compliant mitigation script for ABDM Identity Vault. Requirements: Zero-Trust decoupling and rotation key automation. Execution will prioritize PII isolation.",
    color: "var(--accent-purple)"
  },
  {
    timestamp: "2026-05-10T14:20:25Z",
    agent: "Sentinel",
    action: "AUDIT_FAILED",
    message: "Audit SEC-X99: FAIL. Reason: Architect utilized 'must' in line 42. Adherence to 'Will Protocol' is mandatory for professional commitment. Secondary Issue: Insecure logging pattern detected.",
    color: "var(--accent-orange)"
  },
  {
    timestamp: "2026-05-10T14:20:30Z",
    agent: "Architect",
    action: "SELF_CORRECTION",
    message: "Correcting script per Sentinel Audit. Replacing 'must' with 'will'. Hardening logging logic to use Secure Vault output. Re-submitting for final audit.",
    color: "var(--accent-purple)"
  },
  {
    timestamp: "2026-05-10T14:20:45Z",
    agent: "Sentinel",
    action: "AUDIT_PASSED",
    message: "Audit SEC-X99: PASS. Clinical Faithfulness: 100%. Security Hardening: Verified. Documentation Standard: Compliant with 'Will' Protocol. Ready for Human-in-the-Loop approval.",
    color: "var(--accent-green)"
  }
];

const formatLogText = (str) => {
  return str.replace(/'will'/gi, "<strong style='color:var(--accent-green)'>'will'</strong>")
            .replace(/'must'/gi, "<strong style='color:var(--accent-orange)'>'must'</strong>")
            .replace(/FAIL/g, "<strong style='color:var(--accent-orange)'>FAIL</strong>")
            .replace(/PASS/g, "<strong style='color:var(--accent-green)'>PASS</strong>");
};

const TypewriterLog = ({ text }) => {
  const [displayedText, setDisplayedText] = useState('');
  
  useEffect(() => {
    setDisplayedText('');
    let i = 0;
    const interval = setInterval(() => {
      setDisplayedText(text.substring(0, i));
      i++;
      if (i > text.length) clearInterval(interval);
    }, 15);
    return () => clearInterval(interval);
  }, [text]);

  return <span dangerouslySetInnerHTML={{ __html: formatLogText(displayedText) }} />;
};

function App() {
  const [domainMode, setDomainMode] = useState('cyber');
  const [activeSignal, setActiveSignal] = useState(null);
  const [roadmap, setRoadmap] = useState(config.domain_config.roadmap);
  const [missionLog, setMissionLog] = useState([
    { timestamp: new Date().toISOString(), agent: "System", message: "System Initialized. Awaiting signals...", color: "var(--text-secondary)" }
  ]);
  const [reRankedItemId, setReRankedItemId] = useState(null);
  const [showOverlay, setShowOverlay] = useState(false);
  
  const [scoutState, setScoutState] = useState('idle');
  const [strategistState, setStrategistState] = useState('idle');
  const [architectState, setArchitectState] = useState('idle');
  const [sentinelState, setSentinelState] = useState('idle');

  const [playbackIndex, setPlaybackIndex] = useState(-1);

  // Agent Orchestration Playback Hook
  useEffect(() => {
    if (playbackIndex >= 0 && playbackIndex < mockMissionLogData.length) {
      const log = mockMissionLogData[playbackIndex];
      
      setScoutState(log.agent === 'Scout' ? 'processing' : 'idle');
      setStrategistState(log.agent === 'Strategist' ? 'processing' : 'idle');
      setArchitectState(log.agent === 'Architect' ? 'processing' : 'idle');
      setSentinelState(log.agent === 'Sentinel' ? 'processing' : 'idle');

      if (log.action === 'PRIORITY_SHIFT') {
        const newRoadmap = [...roadmap].map(item => {
          if (item.id === 'rm-1') return { ...item, status: "Priority 1 (Urgent)", feature: "Emergency Identity Patch" };
          return item;
        });
        setRoadmap(newRoadmap);
        setReRankedItemId('rm-1');
      }

      if (log.action === 'VIBE_CODING_INITIATED') {
        setShowOverlay(true);
      }

      setMissionLog(prev => [log, ...prev]);

      const timer = setTimeout(() => {
        if (log.action === 'PRIORITY_SHIFT') setReRankedItemId(null);
        setPlaybackIndex(playbackIndex + 1);
      }, 4500); // Wait 4.5s between agent actions for demo pacing
      
      return () => clearTimeout(timer);
    } else if (playbackIndex === mockMissionLogData.length) {
      setScoutState('idle');
      setStrategistState('idle');
      setArchitectState('idle');
      setSentinelState('idle');
    }
  }, [playbackIndex]);

  const handleSignalClick = (signal) => {
    setActiveSignal(signal);
    // Kick off the autonomous agent orchestration sequence
    setPlaybackIndex(0);
  }

  const formatTime = (isoString) => {
    const d = new Date(isoString);
    return `${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}:${d.getSeconds().toString().padStart(2, '0')}`;
  };

  return (
    <div className={`app-container ${domainMode === 'health' ? 'theme-health' : ''}`}>
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

      <header className="panel">
        <div className="panel-header">Agent Status & Mission Log</div>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem', fontSize: '0.85rem', fontWeight: 600 }}>
          <div>
            <span className={scoutState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-orange)'}}>●</span> Scout: {scoutState.toUpperCase()}
          </div>
          <div>
            <span className={strategistState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-cyan)'}}>●</span> Strategist: {strategistState.toUpperCase()}
          </div>
          <div>
            <span className={architectState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-purple)'}}>●</span> Architect: {architectState.toUpperCase()}
          </div>
          <div>
            <span className={sentinelState === 'processing' ? 'pulsing-dot' : ''} style={{color: 'var(--accent-green)'}}>●</span> Sentinel: {sentinelState.toUpperCase()}
          </div>
        </div>
        
        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', height: '100px', overflowY: 'hidden' }}>
          {missionLog.map((log, i) => (
            <div key={i} style={{ opacity: 1 - (i * 0.15), marginBottom: '6px' }}>
              <span style={{ color: 'var(--text-secondary)', marginRight: '8px', fontSize: '0.7rem' }}>[{formatTime(log.timestamp)}]</span>
              <span style={{ color: log.color, fontWeight: 'bold', marginRight: '8px', textTransform: 'uppercase' }}>[{log.agent}]</span>
              {i === 0 ? <TypewriterLog text={log.message} /> : <span dangerouslySetInnerHTML={{ __html: formatLogText(log.message) }} />}
            </div>
          ))}
        </div>
      </header>

      <div className="main-content">
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
                  </div>
                </div>
              ))}
            </div>
          </section>
        </div>
      </div>

      {showOverlay && (
        <div className="modal-overlay" onClick={() => setShowOverlay(false)}>
          <div className="panel modal-content" onClick={e => e.stopPropagation()}>
            <div className="panel-header">
              <span>Sentinel Terminal: Automated Audit</span>
              <button className="btn-execute" onClick={() => setShowOverlay(false)}>Close Terminal X</button>
            </div>
            
            <div className="diff-container">
              <div className="diff-pane mono">
                <div style={{ color: 'var(--text-secondary)', marginBottom: '1rem' }}>// Architect Agent: Generated Protocol</div>
                <div className="diff-line diff-add">
                  <span>+</span><span>export const establishZeroTrust = () =&gt; {'{'}</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>  // Initializes ABDM/OWASP compliant vault</span>
                </div>
                {playbackIndex <= 4 ? (
                  <div className="diff-line diff-remove">
                    <span>-</span><span>  const vault = new Vault({'{'} enforce: false {'}'}); // <strong style={{color:'var(--accent-orange)'}}>must</strong> enforce</span>
                  </div>
                ) : (
                  <div className="diff-line diff-add">
                    <span>+</span><span>  const vault = new Vault({'{'} enforce: true {'}'});  // <strong style={{color:'var(--accent-green)'}}>will</strong> enforce</span>
                  </div>
                )}
                <div className="diff-line diff-add">
                  <span>+</span><span>  return vault.lock();</span>
                </div>
                <div className="diff-line diff-add">
                  <span>+</span><span>{'}'}</span>
                </div>
              </div>

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
                      <div className={`health-ring ${playbackIndex <= 4 ? 'health-fail' : 'health-pass'}`}></div>
                      <strong>"Will" Protocol Adherence</strong>
                    </div>
                    <div style={{ fontSize: '0.8rem', color: playbackIndex <= 4 ? 'var(--accent-orange)' : 'var(--accent-green)' }}>
                      {playbackIndex <= 4 
                        ? "Violation detected on Line 4. Generated draft used 'must'. Awaiting self-correction." 
                        : "Violation corrected. Declarative 'will' implemented."}
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
