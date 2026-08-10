import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

export default function ThreatChapter() {
  return (
    <Chapter id="threat" index={1} label="Threat" heightVh={260}>
      {(p) => (
        <div className="scene scene-threat">
          <p
            className="scene-index mono"
            style={{ opacity: range(p, 0, 0.15) }}
          >
            01 / DECEPTION
          </p>

          <StoryWords
            text="Spoofing does not jam the sky. It steals trust."
            progress={p}
            from={0.05}
            to={0.4}
            accent={['trust']}
          />

          <StoryText
            className="scene-body"
            text="GNSS arrives at −160 dBW with no physical-layer authentication. A calibrated false signal can capture tracking loops and feed trusted, incorrect PNT into every downstream system."
            progress={p}
            from={0.28}
            to={0.5}
          />

          <div className="threat-grid">
            {[
              { label: 'Autopilots', t0: 0.42, t1: 0.58 },
              { label: 'AIS / ECDIS', t0: 0.48, t1: 0.64 },
              { label: 'ATC displays', t0: 0.54, t1: 0.7 },
              { label: 'Timing infra', t0: 0.6, t1: 0.76 },
            ].map((item) => {
              const t = range(p, item.t0, item.t1)
              return (
                <div
                  key={item.label}
                  className="threat-node"
                  style={{
                    opacity: t,
                    transform: `translateY(${(1 - t) * 24}px) scale(${0.96 + t * 0.04})`,
                  }}
                >
                  <span className="mono">CASCADE</span>
                  <strong>{item.label}</strong>
                </div>
              )
            })}
          </div>

          <div
            className="threat-orb"
            aria-hidden="true"
            style={{
              opacity: range(p, 0.2, 0.45) * (1 - range(p, 0.85, 1)),
              transform: `scale(${0.7 + range(p, 0.2, 0.8) * 0.55}) rotate(${p * 40}deg)`,
            }}
          />
        </div>
      )}
    </Chapter>
  )
}
