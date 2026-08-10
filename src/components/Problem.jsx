import Reveal from './Reveal'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  AnimatedLede,
  HoverScramble,
} from './TextAnimate'

const incidents = [
  {
    code: 'INC-465',
    title: 'Border interference',
    body: '465 documented GPS interference and spoofing incidents across India’s border regions between Nov 2023 and Feb 2025.',
  },
  {
    code: 'INC-APT',
    title: 'Civil aviation',
    body: 'Parliament-confirmed spoofing reports affecting approach procedures at Delhi, and regular reports from major Indian airports.',
  },
  {
    code: 'INC-OPS',
    title: 'Operational theatre',
    body: 'GPS spoofing conditions reported during Operation Brahma, forcing fallback navigation for airlift crews.',
  },
]

export default function Problem() {
  return (
    <section className="block" id="gap">
      <div className="shell">
        <div className="block-head">
          <AnimatedEyebrow text="01 — The Gap" />
          <AnimatedHeading
            text="The threat is known. The sovereign testbed is not."
            accentWords={['sovereign', 'testbed']}
          />
          <AnimatedLede text="GNSS signals arrive at −160 dBW with no physical-layer authentication. Spoofing does not jam — it feeds trusted, incorrect PNT into autopilots, AIS, ATC displays, and timing infrastructure. India is investing in NavIC. The indigenous validation infrastructure has not kept pace." />
        </div>

        <div className="incident-rail">
          {incidents.map((item, index) => (
            <Reveal as="article" className="incident" key={item.code} delay={index * 120}>
              <HoverScramble className="mono" text={item.code} as="span" />
              <h3>
                <HoverScramble text={item.title} />
              </h3>
              <p>{item.body}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="gap-matrix" delay={180}>
          <div className="gap-copy">
            <AnimatedHeading
              as="h3"
              className="gap-question-title"
              text="Three questions every resilience team still cannot answer"
              accentWords={['cannot', 'answer']}
            />
            <ol className="question-list">
              <li>
                <span className="q-mark">Q1</span>
                Does my system actually detect spoofing?
              </li>
              <li>
                <span className="q-mark">Q2</span>
                How bad is the operational cascade if it does not?
              </li>
              <li>
                <span className="q-mark">Q3</span>
                Does my mitigation genuinely improve resilience?
              </li>
            </ol>
          </div>
          <div className="gap-compare">
            <div>
              <HoverScramble as="span" text="Hardware labs" />
              <p>Multi-crore, shielded, generic atmospheres — inaccessible for routine research.</p>
            </div>
            <div>
              <HoverScramble as="span" text="Open-source SDR scripts" />
              <p>Vacuum geometry. No atmospheric physics. Static attackers. Publication-fragile.</p>
            </div>
            <div className="gap-compare-accent">
              <HoverScramble as="span" text="PhantomLayer" />
              <p>Desktop-deployable IQ ecosystem with physics, ground truth, and adaptive threat entities.</p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  )
}
