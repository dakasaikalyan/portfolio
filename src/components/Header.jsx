import { useEffect, useState } from 'react'
import { HoverScramble } from './TextAnimate'

const links = [
  { href: '#threat', label: 'Threat' },
  { href: '#gap', label: 'Evidence' },
  { href: '#iq', label: 'Thesis' },
  { href: '#pipeline', label: 'Pipeline' },
  { href: '#briefing', label: 'Briefing' },
]

export default function Header({ chapterLabel = 'Origin' }) {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 18)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return (
    <header className={`site-header${scrolled ? ' is-scrolled' : ''}`}>
      <div className="shell header-inner">
        <a className="brand" href="#top">
          <span className="brand-mark" aria-hidden="true" />
          <span className="brand-text">
            <strong>
              <HoverScramble text="Anemoi Matrix" />
            </strong>
            <em>
              <HoverScramble text="navigation beyond deception" />
            </em>
          </span>
        </a>

        <p className="header-chapter mono">{chapterLabel}</p>

        <button
          className="menu-toggle"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span />
          <span />
        </button>

        <nav className={`nav${open ? ' is-open' : ''}`} aria-label="Primary">
          {links.map((link) => (
            <a key={link.href} href={link.href} onClick={() => setOpen(false)}>
              <HoverScramble text={link.label} />
            </a>
          ))}
          <a
            className="btn btn-signal nav-cta"
            href="#briefing"
            onClick={() => setOpen(false)}
          >
            <span className="btn-label">Request briefing</span>
          </a>
        </nav>
      </div>
    </header>
  )
}
