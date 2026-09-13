import React, { useState, useEffect } from 'react';
import resumePdf from '../assets/Sai_Kalyan_Daka_Resume.pdf';

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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
        padding: scrolled ? '12px 20px' : '16px 24px',
        background: scrolled || mobileMenuOpen ? 'rgba(9, 13, 22, 0.95)' : 'transparent',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        borderBottom: scrolled || mobileMenuOpen ? '1px solid rgba(255, 255, 255, 0.08)' : '1px solid transparent',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
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
            <span style={{ fontWeight: 700, fontSize: '1.05rem', letterSpacing: '-0.02em', color: '#fff' }}>
              SAI KALYAN DAKA
            </span>
            <span style={{ display: 'block', fontSize: '0.7rem', color: '#06b6d4', fontWeight: 600 }}>
              Senior MERN & Backend Engineer
            </span>
          </div>
        </a>

        {/* Desktop Nav Links */}
        <nav className="nav-desktop-links" style={{ display: 'flex', alignItems: 'center', gap: '22px' }}>
          <a href="#overview" style={linkStyle}>Overview</a>
          <a href="#architecture" style={linkStyle}>Architecture</a>
          <a href="#demo" style={linkStyle}>Trading Demo</a>
          <a href="#benchmarks" style={linkStyle}>Benchmarks</a>
          <a href="#code-snippets" style={linkStyle}>Code</a>
          <a href="#experience" style={linkStyle}>Experience</a>
          <a href="#skills" style={linkStyle}>Skills</a>
          <a href="#projects" style={linkStyle}>Projects</a>
        </nav>

        {/* Action Buttons & Mobile Toggle */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a
            href={resumePdf}
            target="_blank"
            rel="noopener noreferrer"
            className="btn-primary"
            style={{ padding: '8px 16px', fontSize: '0.82rem' }}
          >
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 15V3m0 12l-4-4m4 4l4-4M2 17l.621 2.485A2 2 0 004.561 21h14.878a2 2 0 001.94-1.515L22 17" />
            </svg>
            Resume PDF
          </a>

          {/* Mobile Hamburger Toggle Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="nav-mobile-menu"
            style={{
              display: 'none',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid var(--border-glass)',
              color: '#ffffff',
              padding: '8px',
              borderRadius: '8px',
              cursor: 'pointer',
            }}
            aria-label="Toggle Navigation Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              {mobileMenuOpen ? (
                <path d="M18 6L6 18M6 6l12 12" />
              ) : (
                <path d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Navigation Menu */}
      {mobileMenuOpen && (
        <div
          style={{
            marginTop: '16px',
            paddingTop: '16px',
            borderTop: '1px solid var(--border-glass)',
            display: 'flex',
            flexDirection: 'column',
            gap: '12px',
          }}
        >
          <a href="#overview" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Overview</a>
          <a href="#architecture" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Architecture</a>
          <a href="#demo" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Trading Demo</a>
          <a href="#benchmarks" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Benchmarks</a>
          <a href="#code-snippets" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Code Snippets</a>
          <a href="#experience" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Experience</a>
          <a href="#skills" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Skills</a>
          <a href="#projects" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Projects</a>
          <a href="#contact" onClick={() => setMobileMenuOpen(false)} style={mobileLinkStyle}>Contact</a>
        </div>
      )}
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

const mobileLinkStyle: React.CSSProperties = {
  color: '#f8fafc',
  textDecoration: 'none',
  fontSize: '1rem',
  fontWeight: 600,
  padding: '8px 12px',
  borderRadius: '8px',
  background: 'rgba(30, 41, 59, 0.4)',
};
