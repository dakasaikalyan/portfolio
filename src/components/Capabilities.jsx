import Reveal from './Reveal'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  HoverScramble,
} from './TextAnimate'

const capabilities = [
  {
    title: 'Scenario Injector',
    body: 'Position drift, velocity spoofing, meaconing, replay — configurable onset, severity, duration. Fully reproducible runs.',
  },
  {
    title: 'Physics-faithful IQ',
    body: 'Official GPS PRN polynomials, Klobuchar ionosphere, Saastamoinen troposphere, multipath, Doppler, thermal noise.',
  },
  {
    title: 'Receiver observability',
    body: 'Tracking loops, C/N0, pseudorange residuals, RAIM flags, and PVT exposed alongside ground truth.',
  },
  {
    title: 'Cascade modelling',
    body: 'When a vessel accepts a spoofed fix, AIS, autopilot, and collision avoidance inherit the corrupted state.',
  },
]

export default function Capabilities() {
  return (
    <section className="block block-band" id="capabilities">
      <div className="shell">
        <div className="block-head">
          <AnimatedEyebrow text="04 — Capability Surface" />
          <AnimatedHeading
            text="What the desktop testbed finally makes possible."
            accentWords={['desktop', 'possible']}
          />
        </div>

        <div className="capability-grid">
          {capabilities.map((item, index) => (
            <Reveal
              as="article"
              key={item.title}
              delay={index * 100}
              className="capability-item"
            >
              <span className="mono">/{String(index + 1).padStart(2, '0')}</span>
              <h3>
                <HoverScramble text={item.title} />
              </h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  )
}
