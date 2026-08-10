import { useState } from 'react'
import Reveal from './Reveal'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  AnimatedLede,
  HoverScramble,
} from './TextAnimate'

const phases = [
  {
    phase: 'Phase 01',
    title: 'Validation & advisory',
    body: 'Architectural review + atmospheric model validation against NavIC/GPS telemetry and ionospheric datasets.',
  },
  {
    phase: 'Phase 02',
    title: 'Prototype & joint research',
    body: 'Co-develop PhantomShield, scenario libraries, and a joint iDEX path with co-authored outputs.',
  },
  {
    phase: 'Phase 03',
    title: 'Founding partnership',
    body: 'Institution becomes founding research partner with roadmap influence and priority NavIC access.',
  },
]

export default function Collaborate() {
  const [status, setStatus] = useState('')

  function handleSubmit(event) {
    event.preventDefault()
    const form = event.currentTarget
    const data = new FormData(form)
    const name = String(data.get('name') || '').trim()
    setStatus(
      name
        ? `Received, ${name}. We’ll follow up at your institutional email.`
        : 'Received. We’ll follow up shortly.',
    )
    form.reset()
  }

  return (
    <section className="block block-dark" id="collaborate">
      <div className="shell collaborate">
        <div>
          <AnimatedEyebrow text="06 — Collaboration" />
          <AnimatedHeading
            text="Not a funding ask. A research partnership."
            accentWords={['research', 'partnership']}
          />
          <AnimatedLede text="Anemoi Matrix is seeking an Indian academic partner to validate the atmospheric architecture and co-develop the spoofing detection framework. Current state: TRL 2/3 — concept formulated, core pipeline prototype live." />

          <div className="phase-stack">
            {phases.map((item, index) => (
              <Reveal as="article" key={item.phase} delay={index * 110}>
                <span className="mono">
                  <HoverScramble text={item.phase} />
                </span>
                <h3>
                  <HoverScramble text={item.title} />
                </h3>
                <p>{item.body}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal as="form" className="briefing-form" delay={140} onSubmit={handleSubmit}>
          <p className="mono form-label">
            <HoverScramble text="REQUEST TECHNICAL BRIEFING" />
          </p>
          <label>
            Name
            <input name="name" type="text" required autoComplete="name" />
          </label>
          <label>
            Institution / organisation
            <input name="org" type="text" required />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Interest
            <textarea
              name="message"
              required
              placeholder="Atmospheric validation, detection framework, NavIC, iDEX…"
            />
          </label>
          <button className="btn btn-signal" type="submit">
            <span className="btn-label">Request briefing</span>
          </button>
          <p className="form-status" role="status" aria-live="polite">
            {status}
          </p>
          <a className="direct-mail" href="mailto:Meghamshpirangi10@gmail.com">
            or email Meghamsh Pirangi directly →
          </a>
        </Reveal>
      </div>
    </section>
  )
}
