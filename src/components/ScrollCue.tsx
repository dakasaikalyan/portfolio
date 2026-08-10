import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './ScrollCue.module.css'

export default function ScrollCue() {
  const { phase, progress } = useVoyageProgress()
  const atStart = phase === 'sky' || progress <= 0.01
  const duringIntro = phase !== 'sky' && phase !== 'ready' && progress < 0.375

  if (!atStart && !duringIntro) return null

  return (
    <p className={`${styles.cue} ${styles.visible}`} aria-hidden="false">
      <span />
      {atStart ? 'SCROLL TO BEGIN' : 'KEEP SCROLLING'}
    </p>
  )
}
