import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const caps = [
  {
    title: 'Scenario Injector',
    body: 'Drift, meaconing, replay — onset, severity, duration fully parameterised.',
  },
  {
    title: 'Physics-faithful IQ',
    body: 'Official PRN polynomials with ionosphere, troposphere, multipath, Doppler.',
  },
  {
    title: 'Receiver observability',
    body: 'Tracking loops, C/N0, residuals, RAIM, PVT beside ground truth.',
  },
  {
    title: 'Cascade modelling',
    body: 'Spoofed fixes propagate into AIS, autopilot, and collision avoidance.',
  },
]

export default function UnlockChapter() {
  return (
    <Chapter id="capabilities" index={6} label="Unlock" heightVh={260}>
      {(p) => (
        <div className="scene scene-unlock">
          <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
            06 / UNLOCK
          </p>

          <StoryWords
            text="What the desktop testbed finally makes possible."
            progress={p}
            from={0.05}
            to={0.35}
            accent={['desktop', 'possible']}
          />

          <div className="cap-grid">
            {caps.map((item, index) => {
              const t = range(p, 0.3 + index * 0.08, 0.48 + index * 0.08)
              return (
                <article
                  key={item.title}
                  style={{
                    opacity: t,
                    transform: `translateY(${(1 - t) * 36}px) scale(${0.96 + t * 0.04})`,
                  }}
                >
                  <span className="mono">/{String(index + 1).padStart(2, '0')}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              )
            })}
          </div>

          <StoryText
            className="scene-body"
            text="Reproducible research. Measurable detection. Consequence you can see."
            progress={p}
            from={0.75}
            to={0.9}
          />
        </div>
      )}
    </Chapter>
  )
}
