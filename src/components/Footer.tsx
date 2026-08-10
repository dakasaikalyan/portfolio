import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './Footer.module.css'

export default function Footer() {
  const { signalState } = useVoyageProgress()
  const tone =
    signalState === 'CORRUPTED'
      ? styles.corrupted
      : signalState === 'AUTHENTICATED'
        ? styles.authenticated
        : styles.monitoring

  return (
    <footer className={`${styles.footer} ${tone}`}>
      <span className={styles.dot} aria-hidden="true" />
      <span className={styles.label}>SIGNAL STATE</span>
      <strong>{signalState}</strong>
    </footer>
  )
}
