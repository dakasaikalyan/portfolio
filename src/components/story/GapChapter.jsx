import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const questions = [
  'Does my system actually detect spoofing?',
  'How bad is the operational cascade if it does not?',
  'Does my mitigation genuinely improve resilience?',
]

const tools = [
  { name: 'Hardware labs', fail: 'Shielded, multi-crore, generic atmospheres', tone: 'mute' },
  { name: 'Open-source scripts', fail: 'Vacuum geometry. No physics. Static attackers', tone: 'mute' },
  { name: 'PhantomLayer', fail: 'Desktop IQ ecosystem with ground truth', tone: 'signal' },
]

export default function GapChapter() {
  return (
    <Chapter id="void" index={3} label="The Gap" heightVh={270}>
      {(p) => (
        <div className="scene scene-gap">
          <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
            03 / THE GAP
          </p>

          <StoryWords
            text="Three questions every resilience team still cannot answer."
            progress={p}
            from={0.05}
            to={0.35}
            accent={['cannot', 'answer']}
          />

          <div className="question-stack">
            {questions.map((q, index) => {
              const t = range(p, 0.28 + index * 0.08, 0.45 + index * 0.08)
              return (
                <p
                  key={q}
                  className="question-line"
                  style={{
                    opacity: t,
                    transform: `translateX(${(1 - t) * -30}px)`,
                  }}
                >
                  <span className="mono">Q{index + 1}</span>
                  {q}
                </p>
              )
            })}
          </div>

          <div className="tool-compare">
            {tools.map((tool, index) => {
              const t = range(p, 0.55 + index * 0.08, 0.72 + index * 0.08)
              return (
                <div
                  key={tool.name}
                  className={`tool-row is-${tool.tone}`}
                  style={{
                    opacity: t,
                    transform: `translateY(${(1 - t) * 24}px)`,
                  }}
                >
                  <strong>{tool.name}</strong>
                  <span>{tool.fail}</span>
                </div>
              )
            })}
          </div>

          <StoryText
            className="scene-body"
            text="The gap is not awareness. The gap is sovereign, accessible validation."
            progress={p}
            from={0.78}
            to={0.92}
          />
        </div>
      )}
    </Chapter>
  )
}
