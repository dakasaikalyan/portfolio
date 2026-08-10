import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '../hooks/useMotion'
import { DecodeText, SplitChars } from './TextAnimate'

function MagneticButton({ href, className, children }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()

  function onMove(event) {
    if (reduced || !ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const x = event.clientX - rect.left - rect.width / 2
    const y = event.clientY - rect.top - rect.height / 2
    ref.current.style.transform = `translate(${x * 0.22}px, ${y * 0.28}px)`
  }

  function onLeave() {
    if (!ref.current) return
    ref.current.style.transform = 'translate(0, 0)'
  }

  return (
    <a
      ref={ref}
      href={href}
      className={className}
      onPointerMove={onMove}
      onPointerLeave={onLeave}
    >
      <span className="btn-label">{children}</span>
    </a>
  )
}

export default function Hero() {
  const reduced = useReducedMotion()
  const [ready, setReady] = useState(false)
  const [tagDone, setTagDone] = useState(false)

  useEffect(() => {
    const boot = window.setTimeout(() => setReady(true), 100)
    return () => window.clearTimeout(boot)
  }, [])

  useEffect(() => {
    if (!ready) return
    const done = window.setTimeout(() => setTagDone(true), reduced ? 0 : 2200)
    return () => window.clearTimeout(done)
  }, [ready, reduced])

  return (
    <section className="hero" id="top">
      <div className={`shell hero-inner${ready ? ' is-ready' : ''}`}>
        <h1 className="hero-brand" aria-label="Anemoi Matrix">
          <SplitChars text="Anemoi" active={ready} delay={120} />
          <span className="hero-gap" aria-hidden="true">
            {' '}
          </span>
          <SplitChars text="Matrix" active={ready} delay={420} accent />
        </h1>

        <p className="hero-tag">
          {ready ? (
            <DecodeText text="navigation beyond deception" trigger={ready} delay={700} />
          ) : null}
          <span className={`caret${tagDone ? ' is-done' : ''}`}>_</span>
        </p>

        <div className="hero-actions">
          <MagneticButton className="btn btn-signal" href="#collaborate">
            Start collaboration
          </MagneticButton>
          <MagneticButton className="btn btn-ghost" href="#pipeline">
            Inspect PhantomLayer
          </MagneticButton>
        </div>

        <a className="scroll-cue" href="#gap" aria-label="Scroll to content">
          <span />
          <DecodeText text="scroll the spectrum" trigger={ready} delay={1400} />
        </a>
      </div>
    </section>
  )
}
