import { useState } from 'react';

export default function ContactFooter() {
  const [copied, setCopied] = useState(false);
  const email = 'sai.kalyandaka11@gmail.com';

  const copyEmail = () => {
    navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <footer
      id="contact"
      style={{
        paddingTop: '80px',
        paddingBottom: '40px',
        maxWidth: '1200px',
        margin: '0 auto',
        paddingLeft: '24px',
        paddingRight: '24px',
      }}
    >
      {/* Contact Glass Banner */}
      <div
        className="glass-card"
        style={{
          padding: '48px',
          textAlign: 'center',
          borderRadius: '24px',
          background: 'linear-gradient(135deg, rgba(15, 23, 42, 0.9) 0%, rgba(30, 41, 59, 0.7) 100%)',
          border: '1px solid rgba(56, 189, 248, 0.3)',
          marginBottom: '60px',
        }}
      >
        <span className="badge badge-green" style={{ marginBottom: '16px' }}>
          Let's Connect
        </span>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '12px' }}>
          Ready to Build <span className="gradient-text">High-Impact Systems?</span>
        </h2>
        <p style={{ color: '#94a3b8', maxWidth: '600px', margin: '0 auto 32px', fontSize: '1.05rem' }}>
          Currently open to Senior Software Engineer, Backend Engineer, and Lead MERN Developer positions in Hyderabad & Remote.
        </p>

        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px', flexWrap: 'wrap' }}>
          <button onClick={copyEmail} className="btn-primary" style={{ padding: '14px 28px', fontSize: '1rem' }}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
            </svg>
            {copied ? 'Email Copied to Clipboard! ✓' : 'Copy Email Address'}
          </button>

          <a
            href="https://linkedin.com/in/sai-kalyan-daka/"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '14px 24px', fontSize: '1rem' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/>
            </svg>
            LinkedIn Profile
          </a>

          <a
            href="/Sai_Kalyan_Daka_Resume.pdf"
            target="_blank"
            rel="noopener noreferrer"
            className="btn-secondary"
            style={{ padding: '14px 24px', fontSize: '1rem' }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            Download Resume PDF
          </a>
        </div>
      </div>

      {/* Education & Bottom Info */}
      <div
        style={{
          borderTop: '1px solid var(--border-glass)',
          paddingTop: '32px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          color: '#64748b',
          fontSize: '0.88rem',
        }}
      >
        <div>
          <strong style={{ color: '#cbd5e1' }}>B.Tech in Computer Science</strong> | Gurunanak Institute of Engineering and Technology (2022)
        </div>
        <div>
          © {new Date().getFullYear()} Sai Kalyan Daka. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
