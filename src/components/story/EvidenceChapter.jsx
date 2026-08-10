import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const incidents = [
  {
    code: 'INC-465',
    title: 'Border regions',
    body: '465 documented GPS interference and spoofing incidents between Nov 2023 and Feb 2025.',
    a: 0.18,
    b: 0.4,
  },
  {
    code: 'INC-APT',
    title: 'Civil aviation',
    body: 'Parliament-confirmed reports affecting Delhi approaches and major Indian airports.',
    a: 0.32,
    b: 0.54,
  },
  {
    code: 'INC-OPS',
    title: 'Operation Brahma',
    body: 'Spoofing conditions forced airlift crews onto fallback navigation procedures.',
    a: 0.46,
    b: 0.68,
  },
]

export default function EvidenceChapter() {
  return (
    <Chapter id="gap" index={2} label="Evidence" heightVh={280}>
      {(p) => (
        <div className="scene scene-evidence">
          <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
            02 / EVIDENCE
          </p>

          <StoryWords
            text="The threat is known. The sovereign testbed is not."
            progress={p}
            from={0.04}
            to={0.32}
            accent={['sovereign', 'testbed']}
          />

          <StoryText
            className="scene-body"
            text="India is investing in NavIC. Accessible, indigenous infrastructure to validate resilience against spoofing has not kept pace."
            progress={p}
            from={0.22}
            to={0.4}
          />

          <div className="evidence-rail">
            {incidents.map((item) => {
              const t = range(p, item.a, item.b)
              return (
                <article
                  key={item.code}
                  className="evidence-card"
                  style={{
                    opacity: t,
                    transform: `translate3d(${(1 - t) * -40}px, ${(1 - t) * 20}px, 0)`,
                    borderColor: `rgba(124, 255, 178, ${0.08 + t * 0.35})`,
                  }}
                >
                  <span className="mono">{item.code}</span>
                  <h3>{item.title}</h3>
                  <p>{item.body}</p>
                </article>
              )
            })}
          </div>
        </div>
      )}
    </Chapter>
  )
}
