import { useState } from 'react';

interface ArchNode {
  id: string;
  name: string;
  type: string;
  tech: string;
  role: string;
  throughput: string;
  latency: string;
  icon: string;
  color: string;
}

export default function ArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<string>('gateway');

  const nodes: ArchNode[] = [
    {
      id: 'client',
      name: 'Client Interfaces & Admin UI',
      type: 'Frontend Tier',
      tech: 'React 19, Redux Toolkit, WebSockets',
      role: 'Render trading workspace, order entry forms, symbol administration, and real-time execution logs for 500+ active users.',
      throughput: '60 FPS UI Render',
      latency: '< 16ms frame time',
      icon: '💻',
      color: '#38bdf8',
    },
    {
      id: 'gateway',
      name: 'API Gateway & Load Balancer',
      type: 'Edge & Microservice Router',
      tech: 'ElysiaJS, Bun, Node.js',
      role: 'Sub-millisecond route resolution, JWT authentication, RBAC authorization middleware, and API rate limiting.',
      throughput: '40+ Production Endpoints',
      latency: 'sub-5ms route resolution',
      icon: '🛡️',
      color: '#06b6d4',
    },
    {
      id: 'kafka',
      name: 'Kafka Event Streaming Bus',
      type: 'Distributed Message Broker',
      tech: 'Apache Kafka, Protocol Buffers',
      role: 'Decoupled pub/sub event pipeline streaming execution ticks, risk checks, and position updates across services.',
      throughput: '100,000+ events/sec',
      latency: 'sub-20ms broker ack',
      icon: '⚡',
      color: '#34d399',
    },
    {
      id: 'engine',
      name: 'Netting & Hedging Engine',
      type: 'Core Business Logic',
      tech: 'Node.js Cluster, Custom Rules Engine',
      role: 'Executes position aggregation, netting buy/sell exposures, automated hedging business rules, and trade lifecycle checks.',
      throughput: '35% reliability gain',
      latency: 'sub-15ms rule execution',
      icon: '📈',
      color: '#a78bfa',
    },
    {
      id: 'database',
      name: 'Persistence & Time-Series DB',
      type: 'Data Storage Tier',
      tech: 'PostgreSQL, TimescaleDB, Prisma ORM',
      role: 'High-speed historical tick query execution, order book persistence, N+1 query optimized joins (-60% DB load).',
      throughput: '40% response speedup',
      latency: '2.4ms avg query time',
      icon: '🗄️',
      color: '#f59e0b',
    },
    {
      id: 'redis',
      name: 'Redis Cache & Session State',
      type: 'In-Memory State Store',
      tech: 'Redis Pub/Sub, In-Memory KV',
      role: 'Synchronizes active trading session state for 10,000+ concurrent users and caches hot market depth snapshots.',
      throughput: '10,000+ concurrent sessions',
      latency: '< 1ms cache lookup',
      icon: '🚀',
      color: '#ef4444',
    },
  ];

  const active = nodes.find((n) => n.id === selectedNode) || nodes[1];

  return (
    <section
      id="architecture"
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
        <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
          System Architecture Visualizer
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Trading Platform <span className="gradient-text">Microservices Topology</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '10px auto 0', fontSize: '1rem' }}>
          Click any microservice component in the topology map below to inspect technical specifications, data flow, and throughput metrics.
        </p>
      </div>

      {/* Topology Map */}
      <div
        className="glass-card"
        style={{
          padding: '24px',
          borderRadius: '20px',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          background: 'rgba(11, 17, 30, 0.85)',
          marginBottom: '28px',
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: '14px',
            position: 'relative',
          }}
        >
          {nodes.map((node) => {
            const isSelected = node.id === selectedNode;
            return (
              <button
                key={node.id}
                onClick={() => setSelectedNode(node.id)}
                style={{
                  background: isSelected ? 'rgba(30, 41, 59, 0.95)' : 'rgba(15, 23, 42, 0.6)',
                  border: isSelected ? `2px solid ${node.color}` : '1px solid var(--border-glass)',
                  borderRadius: '14px',
                  padding: '16px 12px',
                  textAlign: 'center',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  boxShadow: isSelected ? `0 0 20px ${node.color}40` : 'none',
                  transform: isSelected ? 'translateY(-4px)' : 'none',
                }}
              >
                <div style={{ fontSize: '1.8rem', marginBottom: '6px' }}>{node.icon}</div>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#f8fafc', marginBottom: '4px' }}>
                  {node.name}
                </div>
                <span
                  style={{
                    fontSize: '0.7rem',
                    color: node.color,
                    fontWeight: 600,
                    textTransform: 'uppercase',
                  }}
                >
                  {node.type}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Drawer */}
      <div
        className="glass-card arch-detail-grid"
        style={{
          padding: '28px',
          borderRadius: '16px',
          borderLeft: `4px solid ${active.color}`,
          display: 'grid',
          gridTemplateColumns: '1.2fr 0.8fr',
          gap: '24px',
          alignItems: 'center',
        }}
      >
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
            <span style={{ fontSize: '1.8rem' }}>{active.icon}</span>
            <div>
              <h3 style={{ fontSize: '1.3rem', fontWeight: 800, color: '#ffffff' }}>{active.name}</h3>
              <div style={{ fontSize: '0.85rem', color: active.color, fontWeight: 600 }}>{active.type}</div>
            </div>
          </div>

          <p style={{ color: '#cbd5e1', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '16px' }}>
            {active.role}
          </p>

          <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
            <strong style={{ color: '#f8fafc' }}>Tech Stack:</strong> {active.tech}
          </div>
        </div>

        {/* Node Metrics Box */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Throughput & Capacity</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: active.color, fontFamily: 'var(--font-mono)' }}>
              {active.throughput}
            </div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.7)', padding: '14px', borderRadius: '10px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Target Execution Latency</div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {active.latency}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
