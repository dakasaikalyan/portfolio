export default function Projects() {
  const projectList = [
    {
      title: 'High-Frequency Trading Engine & Dashboard',
      category: 'FinTech / Trading System',
      tech: ['Node.js', 'ElysiaJS', 'Bun', 'React', 'TimescaleDB', 'Kafka', 'Redis', 'WebSockets', 'Docker'],
      desc: 'Distributed backend microservices & real-time pub/sub event streaming pipelines processing high-frequency tick updates, netting/hedging order rules, and live trading analytics.',
      highlights: ['Sub-50ms event latency', 'Kafka & Redis pub/sub', '10,000+ concurrent sessions', 'TimescaleDB time-series queries'],
      badgeColor: 'badge-purple'
    },
    {
      title: 'POS & Attendance Management System',
      category: 'Enterprise SaaS',
      tech: ['MongoDB', 'Express.js', 'React.js', 'Node.js', 'Redux'],
      desc: 'Integrated Point-of-Sale (POS) and staff attendance management platform featuring automated leave tracking, inventory workflows, and sales analytics dashboards.',
      highlights: ['20% productivity gain', 'Automated leave tracking', 'Real-time billing analytics'],
      badgeColor: 'badge-green'
    },
    {
      title: 'YANTRA Enterprise Platform',
      category: 'Backend Microservices',
      tech: ['Node.js', 'Express.js', 'PostgreSQL', 'REST APIs', 'RBAC'],
      desc: 'Scalable backend API architecture for merchant and customer-facing workflows, ensuring 99.9% uptime and high availability during traffic surges.',
      highlights: ['High availability', 'Optimized payload serialization', 'Sub-100ms API response'],
      badgeColor: 'badge'
    },
    {
      title: 'Storefront & Retailer Web Suite',
      category: 'E-Commerce Platform',
      tech: ['React.js', 'Redux', 'Node.js', 'Express.js', 'JWT Auth'],
      desc: 'Responsive customer-facing storefront for product discovery, checkout, and inventory tracking paired with merchant administration tools.',
      highlights: ['Role-based access control', 'Cross-browser accessibility', 'Secure checkout API'],
      badgeColor: 'badge-purple'
    }
  ];

  return (
    <section
      id="projects"
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
        <span className="badge badge-green" style={{ marginBottom: '12px' }}>
          Portfolio Projects
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Featured <span className="gradient-text">Engineering Projects</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem' }}>
          Key systems and web platforms designed and deployed with focus on high performance, security, and scalability.
        </p>
      </div>

      <div
        className="projects-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '24px',
        }}
      >
        {projectList.map((p, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <span className={`badge ${p.badgeColor}`}>{p.category}</span>
              </div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc', marginBottom: '12px' }}>
                {p.title}
              </h3>
              <p style={{ color: '#94a3b8', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '20px' }}>
                {p.desc}
              </p>

              {/* Highlights Pill Row */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
                {p.highlights.map((h, i) => (
                  <span
                    key={i}
                    style={{
                      fontSize: '0.78rem',
                      background: 'rgba(15, 23, 42, 0.8)',
                      color: '#34d399',
                      padding: '4px 10px',
                      borderRadius: '6px',
                      border: '1px solid rgba(52, 211, 153, 0.2)',
                    }}
                  >
                    ✓ {h}
                  </span>
                ))}
              </div>
            </div>

            {/* Tech Badges */}
            <div
              style={{
                borderTop: '1px solid var(--border-glass)',
                paddingTop: '14px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '6px',
              }}
            >
              {p.tech.map((t, i) => (
                <span key={i} className="badge" style={{ fontSize: '0.72rem' }}>
                  {t}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
