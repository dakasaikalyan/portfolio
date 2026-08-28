type StatsProps = {
  totalProcessed: number
  verifiedCount: number
  warningCount: number
  suspiciousCount: number
  rejectedCount: number
  systemConfidence: number
}

export default function StatsOverview({
  totalProcessed,
  verifiedCount,
  warningCount,
  suspiciousCount,
  rejectedCount,
  systemConfidence
}: StatsProps) {
  const activeCount = verifiedCount + warningCount + suspiciousCount + rejectedCount

  const statsList = [
    { label: 'SIGNALS PROCESSED', value: totalProcessed.toLocaleString(), color: 'var(--signal-cyan)' },
    { label: 'ACTIVE TRACKS', value: activeCount.toString(), color: 'var(--paper)' },
    { label: 'VERIFIED SIGNALS', value: verifiedCount.toString(), color: 'var(--clean-mint)' },
    { label: 'SYSTEM CONFIDENCE', value: `${systemConfidence}%`, color: 'var(--auth-gold)' },
    { label: 'SUSPICIOUS SPOOFS', value: suspiciousCount.toString(), color: 'var(--alarm-red)' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.4rem', marginBottom: '0.4rem', color: 'var(--paper)' }}>
          INTELLIGENCE DASHBOARD OVERVIEW
        </h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--fog)' }}>
          Real-time statistical evaluation of cumulative RF transponder payloads and identity checks.
        </p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '1rem' }}>
        {statsList.map((stat) => (
          <div 
            key={stat.label}
            style={{ 
              background: 'rgba(8, 21, 38, 0.45)', 
              border: '1px solid var(--hairline)', 
              borderRadius: 'var(--radius)', 
              padding: '1.25rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem'
            }}
          >
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.58rem', letterSpacing: '0.08em', color: 'var(--fog)' }}>
              {stat.label}
            </span>
            <strong style={{ fontFamily: 'var(--font-mono)', fontSize: '1.6rem', color: stat.color }}>
              {stat.value}
            </strong>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem', marginTop: '1rem' }}>
        {/* Confidence Progress bars */}
        <div style={{ background: 'rgba(8, 21, 38, 0.3)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '1.5rem' }}>
          <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--paper)', marginBottom: '1.25rem' }}>
            SIGNAL RECOGNITION MIX
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--clean-mint)', marginBottom: '0.25rem' }}>
                <span>VERIFIED (SCORE 90-100)</span>
                <span>{verifiedCount} ({activeCount ? Math.round((verifiedCount / activeCount) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(238, 244, 249, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--clean-mint)', width: `${activeCount ? (verifiedCount / activeCount) * 100 : 0}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--auth-gold)', marginBottom: '0.25rem' }}>
                <span>WARNINGS (SCORE 40-89)</span>
                <span>{warningCount} ({activeCount ? Math.round((warningCount / activeCount) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(238, 244, 249, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--auth-gold)', width: `${activeCount ? (warningCount / activeCount) * 100 : 0}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--alarm-red)', marginBottom: '0.25rem' }}>
                <span>SUSPICIOUS / GHOST (SCORE 1-39)</span>
                <span>{suspiciousCount} ({activeCount ? Math.round((suspiciousCount / activeCount) * 100) : 0}%)</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(238, 244, 249, 0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'var(--alarm-red)', width: `${activeCount ? (suspiciousCount / activeCount) * 100 : 0}%`, transition: 'width 0.4s ease' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Philosophy declaration card */}
        <div style={{ background: 'rgba(8, 21, 38, 0.3)', border: '1px solid var(--hairline)', borderRadius: 'var(--radius)', padding: '1.5rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <h3 style={{ fontFamily: 'var(--font-mono)', fontSize: '0.8rem', letterSpacing: '0.05em', color: 'var(--signal-cyan)', marginBottom: '0.85rem' }}>
              SECURITY PHILOSOPHY STATEMENT
            </h3>
            <p style={{ fontSize: '0.78rem', color: 'var(--fog)', lineHeight: 1.6 }}>
              <strong>GPS is a positioning transponder input, not an identity guarantee.</strong> The trust engine evaluates cross-referenced signatures, positioning continuity, velocity envelopes, timeline sequencing, and ground station correlations. The system outputs confidence-based security states rather than declaring 100% authenticity.
            </p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', marginTop: '1rem', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(47, 217, 154, 0.25)', color: 'var(--clean-mint)', padding: '0.15rem 0.45rem', borderRadius: '3px', background: 'rgba(47, 217, 154, 0.05)' }}>
              HIGH CONFIDENCE
            </span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(62, 207, 228, 0.25)', color: 'var(--signal-cyan)', padding: '0.15rem 0.45rem', borderRadius: '3px', background: 'rgba(62, 207, 228, 0.05)' }}>
              VERIFIED BY SOURCES
            </span>
            <span style={{ fontSize: '0.58rem', fontFamily: 'var(--font-mono)', border: '1px solid rgba(255, 77, 87, 0.25)', color: 'var(--alarm-red)', padding: '0.15rem 0.45rem', borderRadius: '3px', background: 'rgba(255, 77, 87, 0.05)' }}>
              POTENTIALLY MANIPULATED
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
