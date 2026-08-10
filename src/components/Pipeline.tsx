import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './Pipeline.module.css'

const STEPS = [
  {
    title: 'Capture',
    body: 'All inbound RF intercepted before bridge systems.',
  },
  {
    title: 'Authenticate',
    body: 'Correlation, residuals, anomaly checks.',
  },
  {
    title: 'Filter',
    body: 'Spoofed and jammed traffic stripped live.',
  },
  {
    title: 'Deliver',
    body: 'Only genuine signals reach nav & comms.',
  },
]

export default function Pipeline() {
  const { stage, localProgress } = useVoyageProgress()

  return (
    <ol className={styles.flow}>
      <span className={styles.wire} aria-hidden="true" />
      {STEPS.map((step, index) => {
        const active = stage === 4 && localProgress >= (index + 1) / 4
        return (
          <li key={step.title} className={active ? styles.active : undefined}>
            <span className={styles.node} aria-hidden="true" />
            <span className={styles.num}>{String(index + 1).padStart(2, '0')}</span>
            <h3>{step.title}</h3>
            <p>{step.body}</p>
          </li>
        )
      })}
    </ol>
  )
}
