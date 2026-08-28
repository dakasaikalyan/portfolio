import { useVoyageProgress, type TrackedEntity } from '../../context/VoyageProgressContext'

export default function DetailsInspector({ entity }: { entity: TrackedEntity }) {
  const { setSelectedEntityId, triggerSpoofAttack, applyShieldPolicy } = useVoyageProgress()

  let statusColor = 'var(--signal-cyan)'
  if (entity.trustStatus === 'VERIFIED') statusColor = 'var(--clean-mint)'
  else if (entity.trustStatus === 'TRUSTED') statusColor = 'var(--fog)'
  else if (entity.trustStatus === 'WARNING') statusColor = 'var(--auth-gold)'
  else if (entity.trustStatus === 'SUSPICIOUS' || entity.trustStatus === 'REJECTED') statusColor = 'var(--alarm-red)'

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', height: '100%' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid var(--hairline)', paddingBottom: '0.75rem' }}>
        <div>
          <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>
            {entity.type.toUpperCase()} / {entity.model}
          </span>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.35rem', color: 'var(--paper)', margin: 0 }}>
            {entity.callsign}
          </h2>
          <span style={{ fontSize: '0.68rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>
            ID: {entity.identifier}
          </span>
        </div>
        <button
          onClick={() => setSelectedEntityId(null)}
          style={{ background: 'none', border: 'none', color: 'var(--fog)', fontSize: '0.9rem', cursor: 'pointer' }}
          title="Close inspector"
        >
          ✕
        </button>
      </div>

      {/* Core Telemetry Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', background: 'rgba(8, 21, 38, 0.45)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '0.85rem' }}>
        <div>
          <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>LATITUDE</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--paper)' }}>{entity.latitude.toFixed(4)}°N</span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>LONGITUDE</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--paper)' }}>{entity.longitude.toFixed(4)}°E</span>
        </div>
        {entity.type === 'aircraft' && (
          <div>
            <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>BARO ALTITUDE</label>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--paper)' }}>{entity.altitude.toLocaleString()} FT</span>
          </div>
        )}
        <div>
          <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>SPEED</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--paper)' }}>{entity.speed} KT</span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>HEADING</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.75rem', color: 'var(--paper)' }}>{Math.round(entity.heading)}°</span>
        </div>
        <div>
          <label style={{ display: 'block', fontSize: '0.58rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>SOURCES</label>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--signal-cyan)' }}>{entity.sources.join(', ')}</span>
        </div>
      </div>

      {/* Trust Score Shield Banner */}
      <div 
        style={{ 
          background: entity.trustStatus === 'SUSPICIOUS' || entity.trustStatus === 'REJECTED' ? 'var(--alarm-soft)' : 'rgba(8, 21, 38, 0.6)', 
          border: '1px solid',
          borderColor: statusColor, 
          borderRadius: 'var(--radius)', 
          padding: '1rem',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}
      >
        <div>
          <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>TRUST STATUS</span>
          <strong style={{ fontSize: '0.9rem', fontFamily: 'var(--font-mono)', color: statusColor }}>{entity.trustStatus}</strong>
        </div>
        <div style={{ textAlign: 'right' }}>
          <span style={{ display: 'block', fontSize: '0.55rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>CONFIDENCE SCORE</span>
          <strong style={{ fontSize: '1.25rem', fontFamily: 'var(--font-mono)', color: statusColor }}>{entity.trustScore}/100</strong>
        </div>
      </div>

      {/* Dynamic Targeted Spoof Controls & Action Tacklers */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', borderTop: '1px solid var(--hairline)', paddingTop: '0.85rem' }}>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--paper)' }}>
          TARGET SEC/SPOOF OVERRIDES
        </h4>
        {!entity.isSpoofed ? (
          <button
            onClick={() => triggerSpoofAttack(entity.id)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '0.5rem',
              background: 'rgba(255, 77, 87, 0.08)',
              border: '1px solid var(--alarm-red)',
              color: 'var(--alarm-red)',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease'
            }}
          >
            ⚡ INJECT TARGETED GPS SPOOF
          </button>
        ) : !entity.isPolicyFiltered ? (
          <button
            onClick={() => applyShieldPolicy(entity.id)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.62rem',
              fontWeight: 700,
              padding: '0.5rem',
              background: 'rgba(47, 217, 154, 0.08)',
              border: '1px solid var(--clean-mint)',
              color: 'var(--clean-mint)',
              borderRadius: '4px',
              cursor: 'pointer',
              textAlign: 'center',
              transition: 'all 0.2s ease',
              boxShadow: '0 0 10px rgba(47, 217, 154, 0.15)'
            }}
          >
            🛡️ DEPLOY INERTIAL POLICY SHIELD
          </button>
        ) : (
          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.65rem',
              padding: '0.5rem',
              background: 'rgba(47, 217, 154, 0.05)',
              border: '1px solid rgba(47, 217, 154, 0.25)',
              color: 'var(--clean-mint)',
              borderRadius: '4px',
              textAlign: 'center'
            }}
          >
            🟢 Shield Active. Isolated Spoof Transponders.
          </div>
        )}
      </div>

      {/* Trust Score Breakdown */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--paper)', marginBottom: '0.65rem' }}>
          VALIDATION ENGINE METRICS
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.55rem' }}>
          {[
            { label: 'Identity verification consistency', val: entity.validation.identity },
            { label: 'Position continuity check', val: entity.validation.position },
            { label: 'Velocity plausibility check', val: entity.validation.velocity },
            { label: 'Sequence timeline integrity', val: entity.validation.timestamp },
            { label: 'Cross-source correlation match', val: entity.validation.crossSource },
            { label: 'Inertial trajectory validation', val: entity.validation.trajectory }
          ].map((item) => (
            <div key={item.label}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.62rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)', marginBottom: '0.15rem' }}>
                <span>{item.label}</span>
                <span style={{ color: item.val > 70 ? 'var(--clean-mint)' : item.val > 40 ? 'var(--auth-gold)' : 'var(--alarm-red)' }}>{item.val}%</span>
              </div>
              <div style={{ height: '4px', background: 'rgba(238, 244, 249, 0.05)', borderRadius: '2px', overflow: 'hidden' }}>
                <div 
                  style={{ 
                    height: '100%', 
                    background: item.val > 70 ? 'var(--clean-mint)' : item.val > 40 ? 'var(--auth-gold)' : 'var(--alarm-red)',
                    width: `${item.val}%`, 
                    transition: 'width 0.4s ease' 
                  }} 
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Anomalies Detected */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--paper)', marginBottom: '0.5rem' }}>
          DETECTED ANOMALIES ({entity.anomalies.length})
        </h4>
        {entity.anomalies.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
            {entity.anomalies.map((anom, idx) => (
              <div 
                key={idx}
                style={{ 
                  background: 'var(--alarm-soft)', 
                  border: '1px solid var(--alarm-red)', 
                  borderRadius: '4px', 
                  padding: '0.45rem 0.65rem',
                  fontSize: '0.68rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--alarm-red)'
                }}
              >
                ⚠️ {anom}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ fontSize: '0.68rem', color: 'var(--clean-mint)', fontFamily: 'var(--font-mono)' }}>
            ✓ No active discrepancies or anomalies detected in coordinate logs.
          </p>
        )}
      </div>

      {/* Recommendations */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--paper)', marginBottom: '0.4rem' }}>
          VALIDATION RECOMMENDATION
        </h4>
        <p style={{ fontSize: '0.7rem', color: 'var(--fog)', lineHeight: 1.45, background: 'rgba(8, 21, 38, 0.3)', border: '1px solid var(--hairline)', padding: '0.65rem', borderRadius: '4px' }}>
          {entity.trustStatus === 'VERIFIED' || entity.trustStatus === 'TRUSTED' ? (
            <>This target's positioning is verified by available transponder feeds and matches normal trajectory models. Nominal security level.</>
          ) : entity.trustStatus === 'WARNING' ? (
            <>Discrepancies identified in sequential intervals. Use additional cross-source radar mapping checks to confirm positioning validity.</>
          ) : (
            <strong style={{ color: 'var(--alarm-red)' }}>
              WARNING: Telemetry indices represent impossible velocity or trajectory shifts. DO NOT treat this object's coordinates as authoritative.
            </strong>
          )}
        </p>
      </div>

      {/* Timeline logs */}
      <div>
        <h4 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', letterSpacing: '0.05em', color: 'var(--paper)', marginBottom: '0.5rem' }}>
          SIGNAL HISTORY TIMELINE
        </h4>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', maxHeight: '110px', overflowY: 'auto', paddingRight: '4px' }}>
          {entity.history.map((hist, idx) => (
            <div 
              key={idx} 
              style={{ 
                display: 'flex', 
                gap: '0.5rem', 
                fontSize: '0.62rem', 
                fontFamily: 'var(--font-mono)', 
                borderBottom: '1px solid rgba(155, 176, 196, 0.05)', 
                paddingBottom: '0.25rem' 
              }}
            >
              <span style={{ color: 'var(--fog)' }}>{hist.time}</span>
              <span style={{ color: hist.status === 'VERIFIED' ? 'var(--clean-mint)' : hist.status === 'WARNING' ? 'var(--auth-gold)' : hist.status === 'SUSPICIOUS' || hist.status === 'REJECTED' ? 'var(--alarm-red)' : 'var(--paper)' }}>
                {hist.event}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
