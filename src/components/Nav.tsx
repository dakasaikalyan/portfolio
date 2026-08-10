import { useVoyageProgress } from '../context/VoyageProgressContext'
import { STAGE_LABELS } from '../lib/voyageMath'
import styles from './Nav.module.css'

export default function Nav() {
  const { stage } = useVoyageProgress()

  return (
    <header className={styles.nav}>
      <a className={styles.brand} href="#top">
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.brandText}>
          <strong>Anemoi Matrix</strong>
          <em>navigation beyond deception</em>
        </span>
      </a>

      <nav className={styles.links} aria-label="Primary">
        <a href="#capability">Capability</a>
        <a href="#demo">Services</a>
        <a href="#demo">Demo</a>
      </nav>

      <p className={styles.stage}>{STAGE_LABELS[stage] ?? 'VOYAGE'}</p>
    </header>
  )
}
