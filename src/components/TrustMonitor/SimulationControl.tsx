import { useVoyageProgress, type SimulationScenario } from '../../context/VoyageProgressContext'

export default function SimulationControl() {
  const { activeScenario, setScenario } = useVoyageProgress()

  const scenarios: { value: SimulationScenario; label: string; desc: string; icon: string }[] = [
    {
      value: 'normal',
      label: 'NOMINAL (SECURE CRUISE)',
      desc: 'All coordinates and identities conform to historical trajectory margins. Validation levels remain near 100%.',
      icon: '🟢'
    },
    {
      value: 'drift',
      label: 'GPS SIGNAL DRIFT',
      desc: 'Injects slow, progressive coordinate deviations. Evaluates inertial reference validation filters, lowering trajectory integrity.',
      icon: '🔵'
    },
    {
      value: 'drop',
      label: 'TRANSPONDER FADE / DROP',
      desc: 'Halts signal updates for designated targets, causing sequence timestamps to grow stale. Prompts timestamp sequence drops.',
      icon: '⚪'
    },
    {
      value: 'jump',
      label: 'TELEPORTATION / JUMP',
      desc: 'Spikes lat/lon parameters to another coordinate quadrant instantly. Triggers acceleration/velocity boundary alerts.',
      icon: '🔴'
    },
    {
      value: 'conflict',
      label: 'IDENTITY SPOOF / DUPLICATION',
      desc: 'Instantiates a secondary duplicate transponder beacon broadcasting on the same callsign. Triggers identity correlation check fails.',
      icon: '⚠️'
    },
    {
      value: 'velocity',
      label: 'VELOCITY ENVELOPE BREACH',
      desc: 'Forces velocities to impossible parameters (e.g. Mach 3 for commercial airliners). Triggers speed plausibility flags.',
      icon: '⚡'
    },
    {
      value: 'timestamp',
      label: 'TIMESTAMP DESYNCHRONIZATION',
      desc: 'Injects scrambled sequencing headers. Triggers frame integrity warnings without immediate trajectory deviation.',
      icon: '🕒'
    }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', height: '100%' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--paper)' }}>
          THREAT SIMULATION SANDBOX
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--fog)' }}>
          Select a defensive validation scenario below to inject synthetic anomalies and observe how the trust validation engine behaves.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto' }}>
        {scenarios.map((scen) => {
          const isActive = activeScenario === scen.value
          return (
            <button
              key={scen.value}
              onClick={() => setScenario(scen.value)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                padding: '1.2rem',
                background: isActive ? 'rgba(62, 207, 228, 0.08)' : 'rgba(8, 21, 38, 0.45)',
                border: '1px solid',
                borderColor: isActive ? 'var(--signal-cyan)' : 'var(--hairline)',
                borderRadius: 'var(--radius)',
                cursor: 'pointer',
                textAlign: 'left',
                width: '100%',
                transition: 'all 0.25s ease'
              }}
            >
              <span style={{ fontSize: '1.8rem' }}>{scen.icon}</span>
              <div style={{ flex: 1 }}>
                <strong style={{ display: 'block', fontFamily: 'var(--font-mono)', fontSize: '0.78rem', color: isActive ? 'var(--signal-cyan)' : 'var(--paper)', marginBottom: '0.25rem' }}>
                  {scen.label} {isActive && '(ACTIVE)'}
                </strong>
                <span style={{ display: 'block', fontSize: '0.72rem', color: 'var(--fog)', lineHeight: 1.4 }}>
                  {scen.desc}
                </span>
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
