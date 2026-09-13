import { useState } from 'react';

interface CodeSample {
  id: string;
  title: string;
  category: string;
  tech: string;
  code: string;
}

export default function CodeViewer() {
  const [activeId, setActiveId] = useState<string>('elysia');

  const samples: CodeSample[] = [
    {
      id: 'elysia',
      title: 'ElysiaJS WebSocket Sub-50ms Frame Decoder',
      category: 'Real-Time WebSockets',
      tech: 'ElysiaJS / Bun / Protobuf',
      code: `import { Elysia } from 'elysia'
import { ProtobufEncoder } from './protocol/protobuf'
import { TradeNettingEngine } from './services/netting'

export const tradingStreamApp = new Elysia()
  .ws('/stream/ticks', {
    open(ws) {
      ws.subscribe('market-depth-live')
      console.log('Client connected to real-time tick stream:', ws.id)
    },
    async message(ws, binaryData) {
      // Decode Protocol Buffers frame sub-50ms latency
      const parsedOrder = ProtobufEncoder.decodeOrderTick(binaryData)
      
      // Execute Netting & Hedging business rule check
      const result = await TradeNettingEngine.evaluate(parsedOrder)

      ws.send({
        type: 'EXECUTION_ACK',
        orderId: parsedOrder.id,
        status: result.status, // EXEC_NETTED | HEDGED
        executedAt: Date.now(),
        latencyMs: Date.now() - parsedOrder.timestamp
      })
    }
  })`
    },
    {
      id: 'kafka',
      title: 'Kafka Consumer & Order Netting Workflow',
      category: 'Event Streaming',
      tech: 'Kafka / Node.js Cluster',
      code: `import { KafkaConsumer, OrderEvent } from '../events/kafka-client'
import { RedisCluster } from '../cache/redis'
import { db } from '../db/prisma'

export async function startOrderNettingListener() {
  const consumer = KafkaConsumer.group({ groupId: 'netting-engine-v2' })
  await consumer.subscribe({ topic: 'trading.orders.incoming' })

  await consumer.run({
    eachMessage: async ({ message }) => {
      const order: OrderEvent = JSON.parse(message.value.toString())
      
      // Atomic Redis lock to prevent double execution across workers
      const acquiredLock = await RedisCluster.setnx(\`lock:order:\${order.id}\`, '1', 5000)
      if (!acquiredLock) return

      // Aggregate Netting Position
      await db.$transaction([
        db.order.update({
          where: { id: order.id },
          data: { status: 'EXEC_NETTED', executedPrice: order.price }
        }),
        db.tradingSession.update({
          where: { id: order.sessionId },
          data: { netExposure: { increment: order.netAmount } }
        })
      ])
    }
  })
}`
    },
    {
      id: 'prisma',
      title: 'PostgreSQL N+1 Query Fix (-60% Query Load)',
      category: 'Database Optimization',
      tech: 'PostgreSQL / Prisma ORM / TimescaleDB',
      code: `import { db } from '../db/client'

/**
 * FIXED: Replaced N+1 single query iteration with unified batch join + cursor pagination.
 * Result: Reduced query count from N+1 (240 SQL calls) to 2 queries (-60% DB load).
 */
export async function getInstrumentGroupReport(groupId: string, page = 1, limit = 50) {
  const skip = (page - 1) * limit

  const [group, symbolStats] = await Promise.all([
    db.tradingGroup.findUnique({
      where: { id: groupId },
      include: {
        symbolAssignments: {
          select: { symbol: true, riskLimit: true, marginRate: true }
        }
      }
    }),
    
    // Batch aggregate time-series query on TimescaleDB
    db.$queryRaw\`
      SELECT 
        symbol,
        COUNT(id) AS total_orders,
        SUM(amount) AS volume,
        AVG(latency_ms) AS avg_latency
      FROM "OrderTick"
      WHERE group_id = \${groupId}
      GROUP BY symbol
      LIMIT \${limit} OFFSET \${skip}
    \`
  ])

  return { group, symbolStats }
}`
    }
  ];

  const current = samples.find((s) => s.id === activeId) || samples[0];

  return (
    <section
      id="code-snippets"
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
          Production Code Quality
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Backend Architecture <span className="gradient-text">Code Snippets</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '10px auto 0', fontSize: '1rem' }}>
          Inspect actual production backend logic written for WebSockets frame decoding, Kafka message consumers, and SQL query optimization.
        </p>
      </div>

      {/* Code Console */}
      <div
        className="glass-card"
        style={{
          borderRadius: '20px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: '#090e17',
          overflow: 'hidden',
        }}
      >
        {/* Top Tab Bar */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            background: 'rgba(15, 23, 42, 0.9)',
            padding: '12px 20px',
            borderBottom: '1px solid var(--border-glass)',
            flexWrap: 'wrap',
            gap: '12px',
          }}
        >
          <div style={{ display: 'flex', gap: '8px' }}>
            {samples.map((s) => (
              <button
                key={s.id}
                onClick={() => setActiveId(s.id)}
                style={{
                  background: activeId === s.id ? 'var(--gradient-btn)' : 'rgba(30, 41, 59, 0.6)',
                  color: '#ffffff',
                  border: 'none',
                  padding: '8px 16px',
                  borderRadius: '8px',
                  fontSize: '0.82rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  transition: 'all 0.25s ease',
                }}
              >
                {s.title}
              </button>
            ))}
          </div>

          <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>
            {current.tech}
          </span>
        </div>

        {/* Code Content */}
        <div style={{ padding: '24px', overflowX: 'auto' }}>
          <pre
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.88rem',
              color: '#38bdf8',
              lineHeight: 1.6,
            }}
          >
            <code>{current.code}</code>
          </pre>
        </div>
      </div>
    </section>
  );
}
