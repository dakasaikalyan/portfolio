import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useInView'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './SignalCursor.module.css'

export default function SignalCursor() {
  const { signalState, introComplete } = useVoyageProgress()
  const reduced = useReducedMotion()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  // Only enable custom cursor on fine pointers (laptops/desktops) and after intro starts
  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced && introComplete)
  }, [reduced, introComplete])

  useEffect(() => {
    if (!enabled) return

    const onMove = (event: PointerEvent) => {
      setPos({ x: event.clientX, y: event.clientY })
      setActive(true)
    }
    const onLeave = () => setActive(false)

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.body.classList.add('has-signal-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-signal-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`${styles.cursor} ${active ? styles.active : ''} ${
        signalState === 'CORRUPTED'
          ? styles.corrupted
          : signalState === 'AUTHENTICATED'
            ? styles.authenticated
            : ''
      }`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden="true"
    >
      <span className={styles.ring} />
      <span className={styles.core} />
      <span className={styles.axisX} />
      <span className={styles.axisY} />
      <span className={styles.label}>
        {signalState === 'AUTHENTICATED' ? 'LOCK' : signalState === 'CORRUPTED' ? 'ERR' : 'TRK'}
      </span>
    </div>
  )
}
