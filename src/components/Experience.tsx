export default function Experience() {
  return (
    <section
      id="experience"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
          Career Track Record
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Professional <span className="gradient-text">Experience</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem' }}>
          4.6+ years of production experience architecting scalable backend services and user-facing web applications.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
        {/* Company 1 */}
        <div
          className="glass-card"
          style={{
            padding: '32px',
            borderLeft: '4px solid #06b6d4',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span className="badge badge-green" style={{ marginBottom: '8px' }}>March 2026 – Present</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                MERN Stack Developer / Software Engineer
              </h3>
              <div style={{ fontSize: '1rem', color: '#38bdf8', fontWeight: 600 }}>
                9X Technology Pvt. Ltd. &nbsp;|&nbsp; Hyderabad, India
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge">Trading Domain</span>
              <span className="badge badge-purple">High Throughput</span>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
            Contributed across backend, frontend, database, and integration layers of a high-concurrency trading platform spanning core trading, administration, instrument/symbol-group management, accounts, and financial reporting.
          </p>

          {/* Metric Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>40+ Production APIs</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Node.js, ElysiaJS, Bun, PostgreSQL</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>sub-50ms Latency</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>WebSockets, Kafka, Redis, Protobuf</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.2rem' }}>35% Reliability Gain</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Order, Netting & Hedging logic</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.2rem' }}>50% Admin Effort Cut</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Trading group & symbol config</div>
            </div>
          </div>

          <ul style={{ color: '#94a3b8', paddingLeft: '20px', fontSize: '0.92rem', lineHeight: 1.7 }}>
            <li>Architected real-time WebSocket pub/sub message pipelines handling 10,000+ concurrent trading sessions.</li>
            <li>Collaborated on React.js and Redux administrative dashboards serving 500+ active internal traders and compliance managers.</li>
            <li>Leveraged Docker, TimescaleDB, and optimized SQL queries, reducing average query response time by 40%.</li>
          </ul>
        </div>

        {/* Company 2 */}
        <div
          className="glass-card"
          style={{
            padding: '32px',
            borderLeft: '4px solid #10b981',
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px', marginBottom: '16px' }}>
            <div>
              <span className="badge" style={{ marginBottom: '8px' }}>May 2022 – February 2026</span>
              <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#ffffff' }}>
                MERN Stack Developer
              </h3>
              <div style={{ fontSize: '1rem', color: '#34d399', fontWeight: 600 }}>
                ALTAI Solutions Private Limited &nbsp;|&nbsp; Hyderabad, India
              </div>
            </div>
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              <span className="badge badge-purple">Enterprise Web Apps</span>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', marginBottom: '20px', lineHeight: 1.6 }}>
            Owned backend development and RESTful API architecture for 5+ production-grade enterprise web applications across 12+ core business modules using Node.js, Express.js, PostgreSQL, and Prisma ORM.
          </p>

          {/* Metric Highlights Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '14px',
              marginBottom: '24px',
            }}
          >
            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#34d399', fontWeight: 800, fontSize: '1.2rem' }}>60% Query Load Cut</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>N+1 Query resolution across APIs</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#38bdf8', fontWeight: 800, fontSize: '1.2rem' }}>45% Speedup</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Database & code refactoring</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#a78bfa', fontWeight: 800, fontSize: '1.2rem' }}>5+ Production Apps</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>Node.js, Express, PostgreSQL, Prisma</div>
            </div>

            <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
              <div style={{ color: '#f59e0b', fontWeight: 800, fontSize: '1.2rem' }}>End-to-End Security</div>
              <div style={{ color: '#94a3b8', fontSize: '0.8rem' }}>RBAC, JWT, Encryption, Sanitization</div>
            </div>
          </div>

          <ul style={{ color: '#94a3b8', paddingLeft: '20px', fontSize: '0.92rem', lineHeight: 1.7 }}>
            <li>Engineered role-based access control (RBAC) and authentication workflows across customer-facing modules.</li>
            <li>Conducted peer code reviews, enforced API design standards, and optimized complex SQL joins.</li>
          </ul>
        </div>
      </div>
    </section>
  );
}
