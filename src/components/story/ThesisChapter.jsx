import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const unlocks = [
  { title: 'Atmospheric realism', body: 'Klobuchar + Saastamoinen on the IQ stream' },
  { title: 'Perfect repeatability', body: 'Citable scenario IDs, identical every run' },
  { title: 'Adaptive attackers', body: 'Behavioural spoofers that read receiver state' },
  { title: 'Zero spectrum risk', body: 'No licence. No chamber. No emissions' },
]

export default function ThesisChapter() {
  return (
    <Chapter id="iq" index={4} label="Thesis" heightVh={300}>
      {(p) => {
        const sweep = range(p, 0.15, 0.85)
        return (
          <div className="scene scene-thesis">
            <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
              04 / PRE-ENERGY
            </p>

            <StoryWords
              text="Operate before the signal becomes energy."
              progress={p}
              from={0.05}
              to={0.35}
              accent={['signal', 'energy']}
            />

            <StoryText
              className="scene-body"
              text="PhantomLayer stays in the complex baseband layer — synthesising legitimate and attack signals as IQ samples receivers can process, without ever radiating a milliwatt."
              progress={p}
              from={0.25}
              to={0.45}
            />

            <div
              className="iq-live"
              aria-hidden="true"
              style={{
                opacity: range(p, 0.3, 0.5) * (1 - range(p, 0.9, 1)),
              }}
            >
              <div className="iq-live-header mono">
                <span>I / Q SCOPE</span>
                <span>{(sweep * 100).toFixed(0)}% LOCK</span>
              </div>
              <div className="iq-bars">
                {Array.from({ length: 40 }, (_, i) => {
                  const wave =
                    0.25 +
                    Math.abs(Math.sin(i * 0.35 + sweep * 8)) * 0.55 +
                    Math.abs(Math.sin(i * 0.11 + sweep * 3)) * 0.2
                  return (
                    <i
                      key={i}
                      style={{
                        height: `${wave * 100}%`,
                        background:
                          i % 3 === 0
                            ? 'linear-gradient(180deg, #ffb05c, transparent)'
                            : 'linear-gradient(180deg, #7cffb2, transparent)',
                      }}
                    />
                  )
                })}
              </div>
            </div>

            <div className="unlock-grid">
              {unlocks.map((item, index) => {
                const t = range(p, 0.55 + index * 0.07, 0.7 + index * 0.07)
                return (
                  <article
                    key={item.title}
                    style={{
                      opacity: t,
                      transform: `translateY(${(1 - t) * 28}px)`,
                    }}
                  >
                    <h3>{item.title}</h3>
                    <p>{item.body}</p>
                  </article>
                )
              })}
            </div>
          </div>
        )
      }}
    </Chapter>
  )
}
