export default function BenchmarkImpact() {
  const benchmarks = [
    {
      metric: 'Database Response Latency',
      before: '18.9 ms / query',
      after: '2.4 ms / query',
      improvement: '-60% DB Query Volume',
      desc: 'Eliminated N+1 nested loop queries across REST APIs using Prisma eager loading, raw TimescaleDB joins, and index tuning.',
      color: '#34d399',
    },
    {
      metric: 'WebSocket Message Streaming Latency',
      before: '120 ms (JSON Payload)',
      after: 'sub-50 ms (Protobuf Binary)',
      improvement: '2.4x Speedup',
      desc: 'Replaced verbose JSON HTTP polling with binary Protocol Buffers frames over WebSockets, Kafka pub/sub, and Redis state sync.',
      color: '#38bdf8',
    },
    {
      metric: 'Trading Group Admin Config Effort',
      before: '4.5 Hours / Week',
      after: '10 Minutes / Week',
      improvement: '50% Manual Effort Cut',
      desc: 'Built automated administrative tools for symbol groups, trading sessions, risk limits, and financial reporting dashboards.',
      color: '#a78bfa',
    },
  ];

  return (
    <section
      id="benchmarks"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '44px' }}>
        <span className="badge badge-green" style={{ marginBottom: '12px' }}>
          Empirical Engineering Results
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Quantifiable <span className="gradient-text">Performance Benchmarks</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem' }}>
          Proven impact measured in production environments across query optimization, real-time message latency, and operational productivity.
        </p>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '24px',
        }}
      >
        {benchmarks.map((b, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '28px',
              borderTop: `4px solid ${b.color}`,
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{b.metric}</h3>
                <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>{b.improvement}</span>
              </div>

              {/* Before vs After Visual Box */}
              <div
                style={{
                  background: 'rgba(15, 23, 42, 0.7)',
                  borderRadius: '12px',
                  padding: '16px',
                  border: '1px solid var(--border-glass)',
                  marginBottom: '16px',
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '12px',
                  textAlign: 'center',
                }}
              >
                <div style={{ borderRight: '1px solid var(--border-glass)', paddingRight: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#f87171', fontWeight: 600, textTransform: 'uppercase' }}>Before Optimization</div>
                  <div style={{ fontSize: '1.05rem', fontWeight: 700, color: '#94a3b8', marginTop: '4px', textDecoration: 'line-through' }}>
                    {b.before}
                  </div>
                </div>

                <div style={{ paddingLeft: '8px' }}>
                  <div style={{ fontSize: '0.72rem', color: '#34d399', fontWeight: 600, textTransform: 'uppercase' }}>After Optimization</div>
                  <div style={{ fontSize: '1.15rem', fontWeight: 800, color: b.color, marginTop: '4px' }}>
                    {b.after}
                  </div>
                </div>
              </div>

              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.6 }}>
                {b.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
