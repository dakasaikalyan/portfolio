import type { ReactNode } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './Beat.module.css'

type BeatProps = {
  stage: number
  children: ReactNode
  variant?: 'hero' | 'alarm' | 'mint' | 'gold' | 'cta' | 'default'
  align?: 'left' | 'right'
}

export default function Beat({
  stage,
  children,
  variant = 'default',
  align = 'left',
}: BeatProps) {
  const bare = variant === 'cta'
  const { stage: voyageStage, introComplete } = useVoyageProgress()
  // Narrative beats only after intro has fully handed off
  const active = introComplete && voyageStage === stage

  return (
    <section
      className={[
        styles.beat,
        styles[variant],
        bare ? styles.bare : '',
        align === 'right' ? styles.right : styles.left,
        active ? styles.inView : styles.dormant,
      ]
        .filter(Boolean)
        .join(' ')}
      data-stage={stage}
      aria-label={`Stage ${stage}`}
      aria-hidden={!active}
    >
      {bare ? children : <div className={styles.inner}>{children}</div>}
    </section>
  )
}
