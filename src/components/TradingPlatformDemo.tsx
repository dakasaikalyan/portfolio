import { useState, useEffect } from 'react';

interface OrderTick {
  id: string;
  symbol: string;
  type: 'BUY' | 'SELL';
  price: string;
  amount: number;
  latencyMs: number;
  status: 'EXEC_NETTED' | 'HEDGED' | 'MATCHED';
  time: string;
}

export default function TradingPlatformDemo() {
  const [isRunning, setIsRunning] = useState(true);
  const [ordersProcessed, setOrdersProcessed] = useState(14820);
  const [activeSessionCount, setActiveSessionCount] = useState(10240);
  const [avgLatency, setAvgLatency] = useState(18.4);
  const [n1Optimized, setN1Optimized] = useState(true);
  const [recentTicks, setRecentTicks] = useState<OrderTick[]>([
    { id: 'ORD-9821', symbol: 'BTC/USD', type: 'BUY', price: '64,250.00', amount: 1.25, latencyMs: 14, status: 'EXEC_NETTED', time: '13:04:12' },
    { id: 'ORD-9822', symbol: 'ETH/USD', type: 'SELL', price: '3,480.50', amount: 8.50, latencyMs: 19, status: 'HEDGED', time: '13:04:13' },
    { id: 'ORD-9823', symbol: 'EUR/USD', type: 'BUY', price: '1.0892', amount: 50000, latencyMs: 11, status: 'MATCHED', time: '13:04:14' },
  ]);

  useEffect(() => {
    if (!isRunning) return;

    const symbols = ['BTC/USD', 'ETH/USD', 'SOL/USD', 'EUR/USD', 'AAPL', 'NVDA'];
    const statuses: ('EXEC_NETTED' | 'HEDGED' | 'MATCHED')[] = ['EXEC_NETTED', 'HEDGED', 'MATCHED'];

    const interval = setInterval(() => {
      const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
      const randomType = Math.random() > 0.5 ? 'BUY' : 'SELL';
      const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
      const latency = Math.floor(12 + Math.random() * 22);
      const orderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;

      const newTick: OrderTick = {
        id: orderId,
        symbol: randomSymbol,
        type: randomType,
        price: (100 + Math.random() * 50000).toFixed(2),
        amount: parseFloat((0.1 + Math.random() * 5).toFixed(2)),
        latencyMs: latency,
        status: randomStatus,
        time: new Date().toLocaleTimeString(),
      };

      setOrdersProcessed((count) => count + 1);
      setActiveSessionCount((count) => count + (Math.random() > 0.5 ? 1 : -1));
      setAvgLatency(() => parseFloat((15 + Math.random() * 8).toFixed(1)));
      setRecentTicks((ticks) => [newTick, ...ticks.slice(0, 5)]);
    }, 1200);

    return () => clearInterval(interval);
  }, [isRunning]);

  return (
    <section
      id="demo"
      style={{
        paddingTop: '60px',
        paddingBottom: '80px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      {/* Section Header */}
      <div style={{ textAlign: 'center', marginBottom: '48px' }}>
        <span className="badge badge-purple" style={{ marginBottom: '12px' }}>
          Interactive Architecture Simulation
        </span>
        <h2 style={{ fontSize: '2.4rem', fontWeight: 800 }}>
          Real-Time <span className="gradient-text">Trading & Event Streaming Engine</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '650px', margin: '12px auto 0', fontSize: '1rem' }}>
          Live demonstration of the order lifecycle, WebSockets event dispatching, Kafka pub/sub message queuing, and netting/hedging business rules engineered for 9X Technology.
        </p>
      </div>

      {/* Main Console Box */}
      <div
        className="glass-card"
        style={{
          padding: '28px',
          borderRadius: '20px',
          border: '1px solid rgba(6, 182, 212, 0.3)',
          background: 'rgba(11, 17, 30, 0.85)',
        }}
      >
        {/* Top Control Bar */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            paddingBottom: '20px',
            marginBottom: '24px',
            borderBottom: '1px solid var(--border-glass)',
            flexWrap: 'wrap',
            gap: '16px',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
            <div style={{ display: 'flex', gap: '6px' }}>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#ef4444' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#f59e0b' }}></div>
              <div style={{ width: '12px', height: '12px', borderRadius: '50%', background: '#10b981' }}></div>
            </div>
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.85rem', color: '#06b6d4', fontWeight: 600 }}>
              WebSocket Cluster: ws://trading.netting-engine.internal:8080/stream
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => setIsRunning(!isRunning)}
              className="btn-secondary"
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {isRunning ? 'Pause Engine' : 'Resume Engine'}
            </button>
            <button
              onClick={() => setN1Optimized(!n1Optimized)}
              className={n1Optimized ? 'btn-primary' : 'btn-secondary'}
              style={{ padding: '6px 14px', fontSize: '0.8rem' }}
            >
              {n1Optimized ? '⚡ N+1 Query Fix Active (-60% DB Load)' : '⚠️ Unoptimized SQL Mode'}
            </button>
          </div>
        </div>

        {/* Dynamic Telemetry Metrics Cards */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '16px',
            marginBottom: '24px',
          }}
        >
          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Total Executed Orders</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
              {ordersProcessed.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#34d399', marginTop: '4px' }}>+120 req/sec</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Avg WebSocket Latency</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#34d399', fontFamily: 'var(--font-mono)' }}>
              {avgLatency} ms
            </div>
            <div style={{ fontSize: '0.75rem', color: '#06b6d4', marginTop: '4px' }}>Protocol Buffers binary frame</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>Active Trading Sessions</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: '#a78bfa', fontFamily: 'var(--font-mono)' }}>
              {activeSessionCount.toLocaleString()}
            </div>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: '4px' }}>Redis Pub/Sub synchronized</div>
          </div>

          <div style={{ background: 'rgba(15, 23, 42, 0.6)', padding: '16px', borderRadius: '12px', border: '1px solid var(--border-glass)' }}>
            <div style={{ fontSize: '0.75rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: 600 }}>DB Query Throughput</div>
            <div style={{ fontSize: '1.6rem', fontWeight: 800, color: n1Optimized ? '#34d399' : '#f87171', fontFamily: 'var(--font-mono)' }}>
              {n1Optimized ? '2.4 ms/q' : '18.9 ms/q'}
            </div>
            <div style={{ fontSize: '0.75rem', color: n1Optimized ? '#34d399' : '#f87171', marginTop: '4px' }}>
              {n1Optimized ? 'TimescaleDB Index Optimized' : 'Warning: High N+1 Query Load'}
            </div>
          </div>
        </div>

        {/* Live Ticking Stream Table */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
            <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#f8fafc' }}>
              ⚡ Live Order Stream & Netting Engine Logs
            </h4>
            <span className="badge badge-green" style={{ fontSize: '0.75rem' }}>Kafka Consumer: Active</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontFamily: 'var(--font-mono)', fontSize: '0.85rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border-glass)', color: '#64748b', fontSize: '0.75rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '10px' }}>Order ID</th>
                  <th style={{ padding: '10px' }}>Time</th>
                  <th style={{ padding: '10px' }}>Instrument</th>
                  <th style={{ padding: '10px' }}>Side</th>
                  <th style={{ padding: '10px' }}>Execution Price</th>
                  <th style={{ padding: '10px' }}>Latency</th>
                  <th style={{ padding: '10px' }}>Engine Action</th>
                </tr>
              </thead>
              <tbody>
                {recentTicks.map((tick) => (
                  <tr key={tick.id} style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.04)', color: '#e2e8f0' }}>
                    <td style={{ padding: '10px', fontWeight: 600, color: '#38bdf8' }}>{tick.id}</td>
                    <td style={{ padding: '10px', color: '#94a3b8' }}>{tick.time}</td>
                    <td style={{ padding: '10px', fontWeight: 600 }}>{tick.symbol}</td>
                    <td style={{ padding: '10px', color: tick.type === 'BUY' ? '#34d399' : '#f87171', fontWeight: 700 }}>
                      {tick.type}
                    </td>
                    <td style={{ padding: '10px' }}>${tick.price}</td>
                    <td style={{ padding: '10px', color: tick.latencyMs < 20 ? '#34d399' : '#f59e0b' }}>
                      {tick.latencyMs} ms
                    </td>
                    <td style={{ padding: '10px' }}>
                      <span
                        className={
                          tick.status === 'EXEC_NETTED'
                            ? 'badge badge-green'
                            : tick.status === 'HEDGED'
                            ? 'badge badge-purple'
                            : 'badge'
                        }
                        style={{ fontSize: '0.72rem' }}
                      >
                        {tick.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </section>
  );
}
