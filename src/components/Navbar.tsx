import React, { useState, useEffect } from 'react';
import resumePdf from '../assets/Sai_Kalyan_Daka_Resume.pdf';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? '12px 24px' : '20px 32px',
        background: scrolled ? 'rgba(9, 13, 22, 0.88)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        WebkitBackdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
      }}
    >
      {/* Brand Logo */}
      <a href="#" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            borderRadius: '10px',
            background: 'linear-gradient(135deg, #0284c7 0%, #0d9488 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#fff',
            fontWeight: 800,
            fontSize: '1.1rem',
            boxShadow: '0 0 15px rgba(2, 132, 199, 0.4)',
          }}
        >
          SK
        </div>
        <div>
          <span style={{ fontWeight: 700, fontSize: '1.1rem', letterSpacing: '-0.02em', color: '#fff' }}>
            SAI KALYAN DAKA
          </span>
          <span style={{ display: 'block', fontSize: '0.72rem', color: '#06b6d4', fontWeight: 600 }}>
            Senior MERN & Backend Engineer
          </span>
        </div>
      </a>

      {/* Nav Links */}
      <nav style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
        <a href="#overview" style={linkStyle}>Overview</a>
        <a href="#architecture" style={linkStyle}>Architecture</a>
        <a href="#demo" style={linkStyle}>Trading Demo</a>
        <a href="#benchmarks" style={linkStyle}>Benchmarks</a>
        <a href="#code-snippets" style={linkStyle}>Code</a>
        <a href="#experience" style={linkStyle}>Experience</a>
        <a href="#skills" style={linkStyle}>Skills</a>
        <a href="#projects" style={linkStyle}>Projects</a>
      </nav>

      {/* Resume CTA */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <a
          href={resumePdf}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-primary"
          style={{ padding: '8px 18px', fontSize: '0.85rem' }}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
          </svg>
          Resume PDF
        </a>
      </div>
    </header>
  );
}

const linkStyle: React.CSSProperties = {
  color: '#94a3b8',
  textDecoration: 'none',
  fontSize: '0.88rem',
  fontWeight: 500,
  transition: 'color 0.2s ease',
};
