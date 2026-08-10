import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

export default function SovereignChapter() {
  return (
    <Chapter id="research" index={7} label="Sovereign" heightVh={240}>
      {(p) => (
        <div className="scene scene-sovereign">
          <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
            07 / NAVIC
          </p>

          <StoryWords
            text="Built for papers that survive peer review — and a constellation that is ours."
            progress={p}
            from={0.05}
            to={0.4}
            accent={['survive', 'ours']}
          />

          <StoryText
            className="scene-body"
            text="No foreign platform adequately models NavIC L5 / S-band against Indian subcontinent ionospheric conditions. PhantomLayer is being built to close that gap."
            progress={p}
            from={0.3}
            to={0.5}
          />

          <div className="sovereign-tags">
            {['GPS L1 C/A live', 'NavIC L5 roadmap', 'NavIC S-band', 'iDEX-aligned path'].map(
              (tag, index) => {
                const t = range(p, 0.48 + index * 0.07, 0.62 + index * 0.07)
                return (
                  <span
                    key={tag}
                    className="mono"
                    style={{
                      opacity: t,
                      transform: `translateY(${(1 - t) * 18}px)`,
                    }}
                  >
                    {tag}
                  </span>
                )
              },
            )}
          </div>

          <div
            className="sovereign-ring"
            aria-hidden="true"
            style={{
              opacity: range(p, 0.2, 0.45) * (1 - range(p, 0.88, 1)),
              transform: `scale(${0.8 + range(p, 0.2, 0.8) * 0.35}) rotate(${p * -50}deg)`,
            }}
          />
        </div>
      )}
    </Chapter>
  )
}
