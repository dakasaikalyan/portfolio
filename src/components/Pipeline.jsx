import { useEffect, useRef, useState } from 'react'
import Reveal from './Reveal'
import { useInView, useReducedMotion } from '../hooks/useMotion'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  AnimatedLede,
  HoverScramble,
} from './TextAnimate'

const layers = [
  {
    name: 'PhantomTime',
    out: 'Shared GPS / UTC / scenario clock',
    role: 'Temporal authority so every entity stays coherent.',
  },
  {
    name: 'PhantomGen',
    out: 'Satellites · vessels · aircraft · attackers',
    role: 'Behavioural entities with state, intent, and message duty.',
  },
  {
    name: 'PhantomProtocol',
    out: 'IS-GPS-200H · AIS · ADS-B',
    role: 'Protocol-correct encoding that spoofing can weaponise.',
  },
  {
    name: 'PhantomSignal',
    out: 'Complex IQ baseband streams',
    role: 'PRN spreading, modulation, Doppler, carrier synthesis.',
  },
  {
    name: 'PhantomSky',
    out: 'Propagated mixed IQ per receiver',
    role: 'Ionosphere, troposphere, multipath, path loss, noise.',
  },
  {
    name: 'PhantomSDR',
    out: 'Tracking · RAIM · PVT',
    role: 'Full E/P/L correlator chain — or bring your own via ZMQ.',
  },
  {
    name: 'PhantomShield',
    out: 'Detection reports · scenario IDs',
    role: 'Ground-truth interface for algorithm evaluation.',
  },
  {
    name: 'PhantomViz',
    out: 'Live constellation · cascade timeline',
    role: 'Makes drift, tracking, and consequence readable in real time.',
  },
]

export default function Pipeline() {
  const listRef = useRef(null)
  const [active, setActive] = useState(0)
  const [ref, inView] = useInView({ threshold: 0.2 })
  const reduced = useReducedMotion()

  useEffect(() => {
    if (!inView || reduced) return
    const id = window.setInterval(() => {
      setActive((value) => (value + 1) % layers.length)
    }, 1600)
    return () => window.clearInterval(id)
  }, [inView, reduced])

  return (
    <section className="block" id="pipeline" ref={ref}>
      <div className="shell">
        <div className="block-head">
          <AnimatedEyebrow text="03 — System Pipeline" />
          <AnimatedHeading
            text="Eight layers. One closed loop. No RF."
            accentWords={['Eight', 'closed', 'RF']}
          />
          <AnimatedLede text="From behavioural threat entities to detection ground truth — modular interfaces so NavIC protocols, regional atmospheres, and new receivers slot in without redesigning the core." />
        </div>

        <ol className={`pipeline${inView ? ' is-live' : ''}`} ref={listRef}>
          {layers.map((layer, index) => (
            <li
              key={layer.name}
              className={index === active ? 'is-active' : ''}
              style={{ '--i': index }}
              onMouseEnter={() => setActive(index)}
            >
              <span className="mono">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <h3>
                  <HoverScramble text={layer.name} />
                </h3>
                <p>{layer.role}</p>
              </div>
              <code>{layer.out}</code>
              <span className="pipeline-scan" aria-hidden="true" />
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
