import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './Ship.module.css'

export default function Ship() {
  const { journeyProgress, introComplete, corruption, authGlow } = useVoyageProgress()
  // Ship only after intro has faded — same handoff as The Channel
  const underway = introComplete
  const left = 6 + journeyProgress * 78
  const bottom = 18 + Math.sin(journeyProgress * 60) * 6
  const pulse = 0.4 + (Math.sin(journeyProgress * 300) * 0.5 + 0.5) * 0.6
  const hue =
    corruption > 0.2 ? '255, 77, 87' : authGlow > 0.35 ? '47, 217, 154' : '62, 207, 228'

  return (
    <div
      className={`${styles.ship} ${underway ? styles.live : styles.hidden}`}
      style={{ left: `${left}%`, bottom: `${bottom}%` }}
      aria-hidden={!underway}
    >
      <div className={styles.wake} style={{ borderColor: `rgba(${hue}, 0.28)` }} />
      <svg viewBox="0 0 180 100" className={styles.svg}>
        <defs>
          <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(238,244,249,0.95)" />
            <stop offset="100%" stopColor="rgba(155,176,196,0.75)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        <path d="M22 68 L48 50 L138 54 L162 68 L145 78 L30 78 Z" fill="url(#hull)" />
        <path d="M78 50 L78 18 L108 44 Z" fill={`rgba(${hue},0.55)`} filter="url(#glow)" />
        <rect x="76" y="16" width="4" height="38" fill="rgba(155,176,196,0.95)" />
        <circle
          cx="78"
          cy="14"
          r="3.6"
          fill={`rgba(${hue},${pulse})`}
          style={{ filter: `drop-shadow(0 0 ${5 + pulse * 8}px rgba(${hue},0.85))` }}
        />
        <path
          d="M54 58 H120"
          stroke={`rgba(${hue},0.45)`}
          strokeWidth="1.5"
          strokeDasharray="3 4"
        />
      </svg>
    </div>
  )
}
