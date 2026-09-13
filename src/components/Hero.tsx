import profilePic from '../assets/profile.jpg';
import resumePdf from '../assets/Sai_Kalyan_Daka_Resume.pdf';

export default function Hero() {
  return (
    <section
      id="overview"
      style={{
        paddingTop: '130px',
        paddingBottom: '80px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1.1fr 0.9fr',
          gap: '48px',
          alignItems: 'center',
        }}
      >
        {/* Left Column: Bio & CTAs */}
        <div>
          {/* Availability Badge */}
          <div
            className="badge badge-green"
            style={{ marginBottom: '20px', padding: '6px 14px', fontSize: '0.85rem' }}
          >
            <span className="pulse-dot"></span>
            Available for Senior Full-Stack & Backend Roles
          </div>

          <h1
            style={{
              fontSize: '3.2rem',
              fontWeight: 800,
              lineHeight: 1.1,
              marginBottom: '16px',
              letterSpacing: '-0.03em',
            }}
          >
            Hi, I'm <span className="gradient-text">Sai Kalyan Daka</span>
          </h1>

          <h2
            style={{
              fontSize: '1.4rem',
              fontWeight: 600,
              color: '#38bdf8',
              marginBottom: '20px',
            }}
          >
            Senior MERN Stack Developer & Backend Engineer (4.6+ Yrs Exp)
          </h2>

          <p
            style={{
              fontSize: '1.05rem',
              color: '#94a3b8',
              lineHeight: 1.6,
              marginBottom: '32px',
            }}
          >
            I build high-throughput backend services, real-time data streaming pipelines (WebSockets, Kafka, Redis), and scalable web applications. My recent work includes engineering a production trading platform handling order/position workflows, netting & hedging engines, and sub-50ms message delivery.
          </p>

          {/* Quick Metrics Cards Grid */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(4, 1fr)',
              gap: '16px',
              marginBottom: '36px',
            }}
          >
            <div className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8' }}>4.6+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Years Exp</div>
            </div>
            <div className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#34d399' }}>sub-50ms</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Event Latency</div>
            </div>
            <div className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#a78bfa' }}>40+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Prod Endpoints</div>
            </div>
            <div className="glass-card" style={{ padding: '16px 12px', textAlign: 'center' }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#f59e0b' }}>10k+</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 500, textTransform: 'uppercase' }}>Trading Sessions</div>
            </div>
          </div>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <a href="#demo" className="btn-primary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polygon points="5 3 19 12 5 21 5 3"></polygon>
              </svg>
              View Interactive Demo
            </a>

            <a href={resumePdf} target="_blank" rel="noopener noreferrer" className="btn-secondary">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M14 2H6a2 2 0 0 2-2 2v16a2 2 0 0 2 2h12a2 2 0 0 2 2-2V8z"></path>
                <polyline points="14 2 14 8 20 8"></polyline>
              </svg>
              Download PDF Resume
            </a>

            <a
              href="https://linkedin.com/in/sai-kalyan-daka/"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-secondary"
              style={{ padding: '12px 16px' }}
              title="LinkedIn Profile"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
              </svg>
            </a>
          </div>
        </div>

        {/* Right Column: User Headshot Profile Card */}
        <div style={{ position: 'relative', display: 'flex', justifyContent: 'center' }}>
          {/* Main Card Container with Ambient Glow Ring */}
          <div
            className="glass-card"
            style={{
              padding: '18px',
              borderRadius: '24px',
              maxWidth: '380px',
              width: '100%',
              boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 35px rgba(6, 182, 212, 0.25)',
              border: '1px solid rgba(56, 189, 248, 0.4)',
              background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.75) 100%)',
            }}
          >
            {/* Image Wrapper */}
            <div
              style={{
                borderRadius: '20px',
                overflow: 'hidden',
                position: 'relative',
                aspectRatio: '1 / 1',
                background: '#0f172a',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                boxShadow: 'inset 0 0 20px rgba(0, 0, 0, 0.5)',
              }}
            >
              <img
                src={profilePic}
                alt="Sai Kalyan Daka"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  objectPosition: 'center 15%',
                  display: 'block',
                  transition: 'transform 0.5s ease',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  inset: 0,
                  background: 'linear-gradient(to top, rgba(9, 13, 22, 0.85) 0%, rgba(9, 13, 22, 0.1) 40%, transparent 100%)',
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: '16px',
                  left: '16px',
                  right: '16px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div>
                  <div style={{ color: '#ffffff', fontWeight: 700, fontSize: '1.15rem', letterSpacing: '-0.01em' }}>
                    Sai Kalyan Daka
                  </div>
                  <div style={{ color: '#38bdf8', fontSize: '0.82rem', fontWeight: 500 }}>
                    Hyderabad, India
                  </div>
                </div>
                <span className="badge badge-green" style={{ fontSize: '0.75rem', fontWeight: 600 }}>
                  Senior MERN
                </span>
              </div>
            </div>

            {/* Tech Badges Grid */}
            <div
              style={{
                marginTop: '16px',
                display: 'flex',
                flexWrap: 'wrap',
                gap: '8px',
              }}
            >
              <span className="badge">Node.js</span>
              <span className="badge">React.js</span>
              <span className="badge">TypeScript</span>
              <span className="badge badge-purple">ElysiaJS / Bun</span>
              <span className="badge badge-green">Kafka</span>
              <span className="badge badge-green">Redis</span>
              <span className="badge">PostgreSQL</span>
              <span className="badge">Docker</span>
            </div>
          </div>

          {/* Floating Pill Accent 1 */}
          <div
            className="glass-card"
            style={{
              position: 'absolute',
              top: '-18px',
              left: '-22px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '30px',
              border: '1px solid rgba(16, 185, 129, 0.5)',
              background: 'rgba(15, 23, 42, 0.95)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ fontSize: '1.2rem' }}>⚡</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Message Latency</div>
              <div style={{ fontSize: '0.85rem', color: '#34d399', fontWeight: 700 }}>sub-50ms Protocol Buffers</div>
            </div>
          </div>

          {/* Floating Pill Accent 2 */}
          <div
            className="glass-card"
            style={{
              position: 'absolute',
              bottom: '10px',
              right: '-25px',
              padding: '10px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              borderRadius: '30px',
              border: '1px solid rgba(99, 102, 241, 0.5)',
              background: 'rgba(15, 23, 42, 0.95)',
              boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div style={{ fontSize: '1.2rem' }}>📈</div>
            <div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', fontWeight: 600 }}>Trading Engine</div>
              <div style={{ fontSize: '0.85rem', color: '#a78bfa', fontWeight: 700 }}>Netting & Hedging Workflows</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
