import { useState } from 'react'
import { useVoyageProgress, type TrustStatus } from '../../context/VoyageProgressContext'

export default function LogsStream() {
  const { eventLogs } = useVoyageProgress()
  const [filter, setFilter] = useState<'all' | 'aircraft' | 'vessel' | 'verified' | 'warning' | 'suspicious' | 'rejected'>('all')

  const filteredLogs = eventLogs.filter((log) => {
    if (filter === 'all') return true
    if (filter === 'aircraft') return log.type === 'aircraft'
    if (filter === 'vessel') return log.type === 'vessel'
    if (filter === 'verified') return log.status === 'VERIFIED'
    if (filter === 'warning') return log.status === 'WARNING'
    if (filter === 'suspicious') return log.status === 'SUSPICIOUS'
    if (filter === 'rejected') return log.status === 'REJECTED'
    return true
  })

  const getStatusColor = (status: TrustStatus) => {
    switch (status) {
      case 'VERIFIED': return 'var(--clean-mint)'
      case 'TRUSTED': return 'var(--fog)'
      case 'WARNING': return 'var(--auth-gold)'
      case 'SUSPICIOUS':
      case 'REJECTED':
        return 'var(--alarm-red)'
      default: return 'var(--paper)'
    }
  }

  const filters: { label: string; value: typeof filter }[] = [
    { label: 'ALL LOGS', value: 'all' },
    { label: 'AIRCRAFT', value: 'aircraft' },
    { label: 'VESSELS', value: 'vessel' },
    { label: 'VERIFIED', value: 'verified' },
    { label: 'WARNING', value: 'warning' },
    { label: 'SUSPICIOUS', value: 'suspicious' },
    { label: 'REJECTED', value: 'rejected' }
  ]

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div>
        <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--paper)' }}>
          SIGNAL VERIFICATION LOG STREAM
        </h2>
        <p style={{ fontSize: '0.82rem', color: 'var(--fog)' }}>
          High-frequency real-time audit logs from the signal authentication correlation engine.
        </p>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: 'flex', gap: '0.45rem', flexWrap: 'wrap', borderBottom: '1px solid var(--hairline)', paddingBottom: '0.65rem' }}>
        {filters.map((btn) => (
          <button
            key={btn.value}
            onClick={() => setFilter(btn.value)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.6rem',
              letterSpacing: '0.05em',
              padding: '0.35rem 0.65rem',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: filter === btn.value ? 'var(--signal-cyan)' : 'var(--hairline)',
              background: filter === btn.value ? 'var(--signal-cyan-soft)' : 'rgba(4, 9, 20, 0.45)',
              color: filter === btn.value ? 'var(--signal-cyan)' : 'var(--fog)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {btn.label}
          </button>
        ))}
      </div>

      {/* Logs Table */}
      <div 
        style={{ 
          flex: 1, 
          background: 'rgba(4, 9, 20, 0.55)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--radius)', 
          overflow: 'hidden',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <div 
          style={{ 
            display: 'grid', 
            gridTemplateColumns: '70px 90px 100px 1fr 60px 100px', 
            gap: '1rem', 
            padding: '0.65rem 1rem', 
            background: 'rgba(8, 21, 38, 0.6)', 
            borderBottom: '1px solid var(--hairline)',
            fontFamily: 'var(--font-mono)',
            fontSize: '0.62rem',
            letterSpacing: '0.05em',
            color: 'var(--fog)'
          }}
        >
          <span>TIMESTAMP</span>
          <span>CATEGORY</span>
          <span>IDENTIFIER</span>
          <span>AUDIT EVENT</span>
          <span>SCORE</span>
          <span style={{ textAlign: 'right' }}>TRUST STATUS</span>
        </div>

        <div style={{ flex: 1, overflowY: 'auto', padding: '0.5rem 0' }}>
          {filteredLogs.length > 0 ? (
            filteredLogs.map((log) => (
              <div
                key={log.id}
                style={{
                  display: 'grid',
                  gridTemplateColumns: '70px 90px 100px 1fr 60px 100px',
                  gap: '1rem',
                  padding: '0.6rem 1rem',
                  borderBottom: '1px dashed rgba(155, 176, 196, 0.05)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '0.68rem',
                  alignItems: 'center',
                  color: 'var(--paper-dim)'
                }}
              >
                <span style={{ color: 'var(--fog)' }}>{log.timestamp}</span>
                <span style={{ color: log.type === 'aircraft' ? 'var(--signal-cyan)' : 'var(--auth-gold)' }}>
                  {log.type.toUpperCase()}
                </span>
                <strong style={{ color: 'var(--paper)' }}>{log.identifier}</strong>
                <span style={{ color: log.status === 'SUSPICIOUS' || log.status === 'REJECTED' ? 'var(--alarm-red)' : 'inherit' }}>
                  {log.event}
                </span>
                <strong>{log.score}/100</strong>
                <span style={{ textAlign: 'right', color: getStatusColor(log.status), fontWeight: 700 }}>
                  {log.status}
                </span>
              </div>
            ))
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem', fontSize: '0.72rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>
              No telemetry events match active filters in buffer cache.
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
