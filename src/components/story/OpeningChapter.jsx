import { Chapter, StoryChars, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

export default function OpeningChapter() {
  return (
    <Chapter id="top" index={0} label="Origin" heightVh={220}>
      {(p) => {
        const exit = 1 - range(p, 0.72, 1)
        return (
          <div className="scene scene-opening" style={{ opacity: exit }}>
            <p
              className="scene-kicker mono"
              style={{
                opacity: range(p, 0, 0.18),
                transform: `translateY(${(1 - range(p, 0, 0.18)) * 20}px)`,
              }}
            >
              CONCEPT EXPERIENCE · ANEMOI MATRIX
            </p>

            <h1 className="scene-brand" aria-label="Anemoi Matrix">
              <StoryChars text="Anemoi" progress={p} from={0.05} to={0.32} />
              <span className="scene-brand-gap" />
              <StoryChars text="Matrix" progress={p} from={0.14} to={0.42} accent />
            </h1>

            <StoryText
              as="p"
              className="scene-tag"
              text="navigation beyond deception"
              progress={p}
              from={0.3}
              to={0.52}
            />

            <div
              className="scene-hint mono"
              style={{ opacity: range(p, 0.45, 0.65) * (1 - range(p, 0.78, 0.95)) }}
            >
              <span className="hint-line" />
              scroll to enter the signal
            </div>
          </div>
        )
      }}
    </Chapter>
  )
}
