import { useVoyageProgress } from '../context/VoyageProgressContext'
import { useReducedMotion } from '../hooks/useInView'
import type { IntroPhase } from '../lib/voyageMath'
import styles from './IntroHero.module.css'

const PHASE_RANK: Record<IntroPhase, number> = {
  sky: 0,
  brand: 1,
  tagline: 2,
  lead: 3,
  ready: 4,
}

function RevealWords({ text, active }: { text: string; active: boolean }) {
  const words = text.split(' ')
  return (
    <p className={`${styles.lead} ${active ? styles.on : ''}`} aria-hidden={!active}>
      {words.map((word, index) => (
        <span
          key={`${word}-${index}`}
          style={{ transitionDelay: active ? `${100 + index * 50}ms` : '0ms' }}
        >
          {word}
          {index < words.length - 1 ? '\u00A0' : ''}
        </span>
      ))}
    </p>
  )
}

export default function IntroHero() {
  const { phase, introComplete, introT, vehicleType } = useVoyageProgress()
  const reduced = useReducedMotion()
  const rank = reduced && !introComplete ? 3 : PHASE_RANK[phase]
  const showBrand = rank >= 1 && rank < 4
  const showTag = rank >= 2 && rank < 4
  const showLead = rank >= 3 && rank < 4
  // Fade in the short ready window — Channel/ship follow immediately after
  const exiting = phase === 'ready' || introComplete || introT >= 0.92
  const gone = introComplete

  const leadText = vehicleType === 'plane'
    ? 'Aviation RF authentication for aircraft fleets that cannot afford a lie in the cockpit.'
    : 'Maritime RF authentication for fleets that cannot afford a lie on the bridge.'

  return (
    <div
      className={[styles.intro, exiting ? styles.exit : '', gone ? styles.gone : '']
        .filter(Boolean)
        .join(' ')}
      data-phase={phase}
      aria-hidden={exiting}
    >
      <p className={`${styles.eyebrow} ${showBrand ? styles.visible : ''}`} aria-hidden={!showBrand}>
        Concept experience · Anemoi Matrix
      </p>

      <h1
        className={`${styles.brand} ${showBrand ? styles.visible : ''}`}
        aria-hidden={!showBrand}
      >
        <span className={styles.anemoi}>Anemoi</span>
        <span className={styles.matrix}>Matrix</span>
      </h1>

      <p className={`${styles.tagline} ${showTag ? styles.visible : ''}`} aria-hidden={!showTag}>
        navigation beyond deception
      </p>

      <RevealWords text={leadText} active={showLead} />
    </div>
  )
}

