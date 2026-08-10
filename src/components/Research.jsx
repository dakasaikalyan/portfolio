import Reveal from './Reveal'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  AnimatedLede,
  HoverScramble,
} from './TextAnimate'

const values = [
  'Algorithm benchmarking across onset speeds and attack classes',
  'Head-to-head detection comparison under identical scenario IDs',
  'RAIM behaviour under attack — chi-squared, residuals, exclusion',
  'Threshold characterisation for designers and policy teams',
]

export default function Research() {
  return (
    <section className="block" id="research">
      <div className="shell research">
        <div>
          <AnimatedEyebrow text="05 — Research Mode" />
          <AnimatedHeading
            text="Built for papers that survive peer review."
            accentWords={['survive', 'review']}
          />
          <AnimatedLede text="Researchers need realistic, parameterised, atmospherically correct spoofing scenarios on demand — with full receiver telemetry and citable scenario IDs. That tool did not exist. PhantomLayer is it." />
          <ul className="research-list">
            {values.map((item, index) => (
              <Reveal as="li" key={item} delay={index * 90}>
                {item}
              </Reveal>
            ))}
          </ul>
        </div>

        <Reveal as="aside" className="research-panel" delay={160}>
          <p className="mono">
            <HoverScramble text="SOVEREIGN PRIORITY" />
          </p>
          <AnimatedHeading
            as="h3"
            className="panel-heading"
            text="NavIC-native validation"
            accentWords={['NavIC-native']}
          />
          <p>
            As NavIC expands across strategic and civilian infrastructure, foreign
            platforms cannot adequately model L5 / S-band against Indian
            subcontinent ionospheric conditions. PhantomLayer is being built to
            close that gap.
          </p>
          <ul className="research-tags">
            <li>GPS L1 C/A live</li>
            <li>NavIC L5 / S-band roadmap</li>
            <li>iDEX-aligned prototype path</li>
          </ul>
        </Reveal>
      </div>
    </section>
  )
}
