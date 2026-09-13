import { useState } from 'react';

interface SkillItem {
  name: string;
  category: 'backend' | 'frontend' | 'database' | 'messaging' | 'security' | 'devops';
  desc: string;
  badgeText: string;
}

export default function TechMatrix() {
  const [activeTab, setActiveTab] = useState<string>('all');

  const skills: SkillItem[] = [
    { name: 'Node.js', category: 'backend', desc: 'Asynchronous event loop, custom middleware, stream pipelines, and clustering', badgeText: 'Expert' },
    { name: 'ElysiaJS & Bun', category: 'backend', desc: 'High-performance TypeScript microservices with sub-millisecond route resolution', badgeText: 'Modern Stack' },
    { name: 'Express.js', category: 'backend', desc: 'RESTful API routing, rate-limiting, request validation, and error handling', badgeText: 'Core Backend' },
    { name: 'React.js & Redux', category: 'frontend', desc: 'Component architecture, state normalization, custom hooks, and dynamic dashboards', badgeText: 'Advanced UI' },
    { name: 'TypeScript & JavaScript', category: 'backend', desc: 'Strict typing, generics, ES6+ features, clean code abstractions', badgeText: 'Language' },
    { name: 'PostgreSQL & TimescaleDB', category: 'database', desc: 'Relational data modeling, time-series indexing, N+1 query optimization', badgeText: 'Relational & Time-Series' },
    { name: 'MongoDB & Cassandra', category: 'database', desc: 'NoSQL document models, column-family schemas, high-write scaling', badgeText: 'NoSQL' },
    { name: 'Kafka & Redis', category: 'messaging', desc: 'Distributed event streaming, pub/sub channels, cache layer, session persistence', badgeText: 'Pub/Sub & Streaming' },
    { name: 'WebSockets & Protocol Buffers', category: 'messaging', desc: 'Binary protocol frames, bi-directional real-time communication', badgeText: 'Real-Time' },
    { name: 'Prisma ORM', category: 'database', desc: 'Type-safe database client, schema migrations, complex joins & query optimization', badgeText: 'ORM' },
    { name: 'RBAC, Auth & Encryption', category: 'security', desc: 'Role-based access control, JWT authentication, bcrypt hashing, API security', badgeText: 'Security' },
    { name: 'Docker & Git', category: 'devops', desc: 'Containerization, environment isolation, Git branching strategies, deployment', badgeText: 'DevOps' }
  ];

  const filteredSkills = activeTab === 'all' ? skills : skills.filter((s) => s.category === activeTab);

  return (
    <section
      id="skills"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div style={{ textAlign: 'center', marginBottom: '40px' }}>
        <span className="badge badge-green" style={{ marginBottom: '12px' }}>
          Technical Stack & System Capabilities
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Skills & <span className="gradient-text">Architecture Matrix</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem' }}>
          Comprehensive engineering skill set built over 4.6+ years across backend services, real-time data layers, and frontend interfaces.
        </p>
      </div>

      {/* Filter Tabs */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          flexWrap: 'wrap',
          marginBottom: '36px',
        }}
      >
        {[
          { key: 'all', label: 'All Technologies' },
          { key: 'backend', label: 'Backend & APIs' },
          { key: 'frontend', label: 'Frontend & UI' },
          { key: 'database', label: 'Databases & Storage' },
          { key: 'messaging', label: 'Real-Time & Messaging' },
          { key: 'security', label: 'Security & Auth' },
          { key: 'devops', label: 'DevOps & Tools' }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={activeTab === tab.key ? 'btn-primary' : 'btn-secondary'}
            style={{ padding: '8px 18px', fontSize: '0.85rem', borderRadius: '20px' }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Skills Grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px',
        }}
      >
        {filteredSkills.map((s, idx) => (
          <div
            key={idx}
            className="glass-card"
            style={{
              padding: '22px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#f8fafc' }}>{s.name}</h3>
                <span className="badge badge-purple" style={{ fontSize: '0.72rem' }}>{s.badgeText}</span>
              </div>
              <p style={{ fontSize: '0.88rem', color: '#94a3b8', lineHeight: 1.5 }}>
                {s.desc}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
