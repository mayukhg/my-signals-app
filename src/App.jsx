import { useState, useEffect } from 'react'
import config from './config.json'

function App() {
  const [activeSignal, setActiveSignal] = useState(null)
  const [roadmap, setRoadmap] = useState(config.domain_config.roadmap)
  const [missionLog, setMissionLog] = useState(["System Initialized. Awaiting signals..."])

  const handleSignalClick = (signal) => {
    setActiveSignal(signal)
    setMissionLog(prev => [`Scout Agent identified ${signal.label} (Intensity: ${signal.intensity})`, ...prev])
    
    // Simulate Strategist re-ranking
    if (signal.intensity >= 8) {
      setMissionLog(prev => [`Strategist Agent re-ranked roadmap due to high intensity signal.`, ...prev])
      const newRoadmap = [...roadmap].map(item => {
        if (item.id === 'rm-1') return { ...item, status: "Priority 1 (Urgent)" }
        return item;
      })
      setRoadmap(newRoadmap)
    }
  }

  return (
    <div className="app-container">
      {/* 1. Agent Status Panel */}
      <header className="panel">
        <div className="panel-header">Agent Status & Mission Log</div>
        <div style={{ display: 'flex', gap: '2rem', marginBottom: '1rem' }}>
          <div><span style={{color: 'var(--accent-cyan)'}}>●</span> Scout: {activeSignal ? 'Processing' : 'Idle'}</div>
          <div><span style={{color: 'var(--accent-green)'}}>●</span> Strategist: Idle</div>
          <div><span style={{color: 'var(--accent-purple)'}}>●</span> Architect: Idle</div>
          <div><span style={{color: 'orange'}}>●</span> Sentinel: Idle</div>
        </div>
        <div className="mono" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', height: '40px', overflowY: 'hidden' }}>
          {missionLog.map((log, i) => <div key={i} style={{ opacity: 1 - (i * 0.3) }}>&gt; {log}</div>)}
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
                  padding: '0.5rem', 
                  border: `1px solid ${activeSignal?.id === signal.id ? 'var(--accent-cyan)' : 'var(--border-color)'}`,
                  cursor: 'pointer',
                  borderRadius: '4px',
                  backgroundColor: activeSignal?.id === signal.id ? 'var(--accent-cyan-glow)' : 'transparent'
                }}
              >
                <div style={{ fontSize: '0.8rem', color: 'var(--accent-cyan)' }}>[{signal.type}]</div>
                <div>{signal.label}</div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Intensity: {signal.intensity}/10</div>
              </div>
            ))}
          </div>
        </aside>

        <div className="content-area">
          {/* 3. Strategist Prioritizer */}
          <section className="panel" style={{ flex: '0 0 auto' }}>
            <div className="panel-header">Attack-Path Prioritizer (Roadmap)</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {roadmap.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>
                  <div>
                    <div style={{ fontWeight: 'bold' }}>{item.feature}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>Logic: {item.logic}</div>
                  </div>
                  <div style={{ color: item.status.includes('Urgent') ? 'var(--accent-green)' : 'inherit' }}>
                    {item.status}
                  </div>
                </div>
              ))}
            </div>
          </section>

          <div className="bottom-area">
            {/* 4. Architect Accelerator */}
            <section className="split-pane panel">
              <div className="panel-header">Vibe-to-Code Accelerator</div>
              <div className="mono" style={{ fontSize: '0.8rem', whiteSpace: 'pre-wrap', flex: 1, overflowY: 'auto' }}>
                {activeSignal ? `// Architect Agent generating response for: ${activeSignal.label}\n\nexport const mitigate = () => {\n  console.log("Applying mitigation protocols...");\n  // TODO: Vibe code implementation will be generated here\n};` : '// Awaiting signal selection...'}
              </div>
            </section>

            {/* 5. Sentinel Terminal */}
            <section className="split-pane panel">
              <div className="panel-header">Sentinel Terminal (LLM Judge)</div>
              {activeSignal ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                  {config.domain_config.judge_rubrics.map((rubric, idx) => (
                    <div key={idx} style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span>{rubric}:</span>
                      <span style={{ color: 'var(--accent-green)' }}>PASS</span>
                    </div>
                  ))}
                  <div style={{ marginTop: '1rem', color: 'var(--text-secondary)' }}>
                    All technical outputs will be audited for compliance.
                  </div>
                </div>
              ) : (
                <div style={{ color: 'var(--text-secondary)', fontSize: '0.85rem' }}>Awaiting code generation to audit...</div>
              )}
            </section>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
