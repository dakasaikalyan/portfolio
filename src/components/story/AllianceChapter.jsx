import { useState } from 'react'
import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const phases = [
  {
    phase: '01',
    title: 'Validation & advisory',
    body: 'Architecture review and atmospheric model validation against real NavIC/GPS telemetry.',
  },
  {
    phase: '02',
    title: 'Prototype & joint research',
    body: 'Co-develop PhantomShield, scenario libraries, and a joint iDEX path.',
  },
  {
    phase: '03',
    title: 'Founding partnership',
    body: 'Institution as founding research partner with roadmap influence and NavIC priority.',
  },
]

function BriefingCard() {
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
    <section className="briefing-dock" id="briefing" aria-labelledby="briefing-title">
      <div className="shell briefing-dock-inner">
        <div className="briefing-copy">
          <p className="mono">NEXT STEP</p>
          <h2 id="briefing-title">Request a technical briefing</h2>
          <p>
            Share your institution and interest area. We’ll respond with a briefing
            package and a proposed Phase 1 scope.
          </p>
          <a className="direct-mail" href="mailto:Meghamshpirangi10@gmail.com">
            Meghamshpirangi10@gmail.com
          </a>
        </div>

        <form className="briefing-form briefing-form-complete" onSubmit={handleSubmit}>
          <p className="mono form-label">REQUEST TECHNICAL BRIEFING</p>

          <label>
            Name
            <input name="name" type="text" required autoComplete="name" placeholder="Your name" />
          </label>

          <label>
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="you@institution.edu"
            />
          </label>

          <label>
            Institution / organisation
            <input
              name="org"
              type="text"
              required
              placeholder="University, lab, or organisation"
            />
          </label>

          <label>
            Interest
            <textarea
              name="message"
              required
              rows={4}
              placeholder="Atmospheric validation, detection framework, NavIC, iDEX…"
            />
          </label>

          <button className="btn btn-signal" type="submit">
            Request briefing
          </button>

          <p className="form-status" role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>
    </section>
  )
}

export default function AllianceChapter() {
  return (
    <>
      <Chapter id="collaborate" index={8} label="Alliance" heightVh={260}>
        {(p) => (
          <div className="scene scene-alliance">
            <p
              className="scene-index mono"
              style={{ opacity: range(p, 0, 0.12) }}
            >
              08 / ALLIANCE
            </p>

            <StoryWords
              className="alliance-heading"
              text="Not a funding ask. A research partnership."
              progress={p}
              from={0.04}
              to={0.3}
              accent={['research', 'partnership']}
            />

            <StoryText
              className="scene-body alliance-lede"
              text="TRL 2/3 — concept formulated, core pipeline prototype live. Seeking an Indian academic partner to validate atmosphere and co-develop detection frameworks."
              progress={p}
              from={0.2}
              to={0.38}
            />

            <div className="phase-rail phase-rail-inline">
              {phases.map((item, index) => {
                const t = range(p, 0.32 + index * 0.1, 0.48 + index * 0.1)
                return (
                  <article
                    key={item.phase}
                    style={{
                      opacity: t,
                      transform: `translateY(${(1 - t) * 24}px)`,
                    }}
                  >
                    <span className="mono">PHASE {item.phase}</span>
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                )
              })}
            </div>

            <p
              className="alliance-continue mono"
              style={{ opacity: range(p, 0.75, 0.9) }}
            >
              <span className="hint-line" />
              continue for briefing request
            </p>
          </div>
        )}
      </Chapter>

      <BriefingCard />
    </>
  )
}
