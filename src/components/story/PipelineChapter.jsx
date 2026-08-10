import { Chapter, StoryText, StoryWords } from './Chapter'
import { range } from '../../hooks/useMotion'

const layers = [
  {
    name: 'PhantomTime',
    out: 'Shared GPS / UTC clock',
    role: 'Temporal authority so every entity stays coherent.',
  },
  {
    name: 'PhantomGen',
    out: 'Satellites · vessels · attackers',
    role: 'Behavioural entities with state, intent, and message duty.',
  },
  {
    name: 'PhantomProtocol',
    out: 'IS-GPS-200H · AIS · ADS-B',
    role: 'Protocol-correct encoding that spoofing can weaponise.',
  },
  {
    name: 'PhantomSignal',
    out: 'Complex IQ baseband',
    role: 'PRN spreading, modulation, Doppler, carrier synthesis.',
  },
  {
    name: 'PhantomSky',
    out: 'Atmosphere · multipath · noise',
    role: 'Ionosphere, troposphere, multipath, path loss, noise.',
  },
  {
    name: 'PhantomSDR',
    out: 'E/P/L · RAIM · PVT',
    role: 'Full correlator chain — or bring your own via ZMQ.',
  },
  {
    name: 'PhantomShield',
    out: 'Detection · scenario IDs',
    role: 'Ground-truth interface for algorithm evaluation.',
  },
  {
    name: 'PhantomViz',
    out: 'Constellation · cascade',
    role: 'Makes drift, tracking, and consequence readable live.',
  },
]

export default function PipelineChapter() {
  return (
    <Chapter id="pipeline" index={5} label="Pipeline" heightVh={320}>
      {(p) => {
        const active = Math.min(
          layers.length - 1,
          Math.floor(range(p, 0.28, 0.92) * layers.length),
        )
        const current = layers[active]
        const listIn = range(p, 0.2, 0.36)

        return (
          <div className="scene scene-pipeline">
            <div className="pipe-top">
              <p className="scene-index mono" style={{ opacity: range(p, 0, 0.12) }}>
                05 / PIPELINE
              </p>

              <StoryWords
                className="pipe-heading"
                text="Eight layers. One closed loop. No RF."
                progress={p}
                from={0.04}
                to={0.26}
                accent={['Eight', 'closed', 'RF']}
              />

              <StoryText
                className="scene-body pipe-lede"
                text="From behavioural threat entities to detection ground truth — modular so NavIC and regional atmospheres slot in without redesign."
                progress={p}
                from={0.16}
                to={0.3}
              />
            </div>

            <div
              className="pipe-board"
              style={{
                opacity: listIn,
                transform: `translateY(${(1 - listIn) * 24}px)`,
              }}
            >
              <div className="pipe-grid" role="list">
                {layers.map((layer, index) => {
                  const isActive = index === active
                  return (
                    <div
                      key={layer.name}
                      role="listitem"
                      className={`pipe-cell${isActive ? ' is-active' : ''}`}
                    >
                      <span className="mono">{String(index + 1).padStart(2, '0')}</span>
                      <strong>{layer.name}</strong>
                    </div>
                  )
                })}
              </div>

              <aside className="pipe-focus" aria-live="polite">
                <p className="mono">
                  LAYER {String(active + 1).padStart(2, '0')} / 08
                </p>
                <h3>{current.name}</h3>
                <p>{current.role}</p>
                <code>{current.out}</code>
              </aside>
            </div>
          </div>
        )
      }}
    </Chapter>
  )
}
