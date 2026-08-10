import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './ProgressRail.module.css'

export default function ProgressRail() {
  const { progress } = useVoyageProgress()

  return (
    <div className={styles.rail} aria-hidden="true">
      <span style={{ transform: `scaleX(${progress})` }} />
    </div>
  )
}
