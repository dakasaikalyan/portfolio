import { useVoyageProgress } from '../context/VoyageProgressContext'
import styles from './Ship.module.css'

export default function Ship() {
  const { journeyProgress, introComplete, corruption, authGlow, vehicleType } = useVoyageProgress()
  const underway = introComplete
  const left = 6 + journeyProgress * 78
  const bottom = vehicleType === 'plane' ? 24 + Math.sin(journeyProgress * 60) * 8 : 18 + Math.sin(journeyProgress * 60) * 6
  const pulse = 0.4 + (Math.sin(journeyProgress * 300) * 0.5 + 0.5) * 0.6
  const hue =
    corruption > 0.2 ? '255, 77, 87' : authGlow > 0.35 ? '47, 217, 154' : '62, 207, 228'

  return (
    <div
      className={`${styles.ship} ${underway ? styles.live : styles.hidden}`}
      style={{ left: `${left}%`, bottom: `${bottom}%` }}
      aria-hidden={!underway}
    >
      {vehicleType === 'ship' && <div className={styles.wake} style={{ borderColor: `rgba(${hue}, 0.28)` }} />}
      
      <svg viewBox="0 0 180 100" className={styles.svg}>
        <defs>
          <linearGradient id="hull" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(238,244,249,0.95)" />
            <stop offset="100%" stopColor="rgba(155,176,196,0.75)" />
          </linearGradient>
          <linearGradient id="airplaneBody" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(240, 244, 248, 0.98)" />
            <stop offset="100%" stopColor="rgba(140, 160, 180, 0.85)" />
          </linearGradient>
          <linearGradient id="airplaneAcc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="rgba(100, 120, 140, 0.9)" />
            <stop offset="100%" stopColor="rgba(60, 75, 90, 0.8)" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.2" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>
        
        {/* Shield Dome */}
        {underway && (
          <path
            d={vehicleType === 'plane' ? "M 10,52 A 78,78 0 0,1 166,52" : "M 12,68 A 78,78 0 0,1 168,68"}
            fill="none"
            stroke={`rgba(${hue}, ${authGlow > 0.35 ? '0.45' : corruption > 0.2 ? '0.25' : '0.12'})`}
            strokeWidth={authGlow > 0.35 ? '2.5' : '1.2'}
            className={`${styles.shieldDome} ${
              authGlow > 0.35 ? styles.shieldActive : corruption > 0.2 ? styles.shieldGlitched : ''
            }`}
          />
        )}

        {vehicleType === 'plane' ? (
          /* Jet Airplane SVG rendering */
          <>
            {/* Pulsing thruster exhaust flame */}
            {underway && (
              <path
                d="M 8,52 C -2,50 -12,51 -20,53 C -12,55 -2,56 8,54 Z"
                fill={`rgba(${hue}, ${pulse})`}
                filter="url(#glow)"
                className={styles.thrustJet}
              />
            )}
            {/* Jet tail fin */}
            <path d="M 22,48 L 6,18 L 24,18 L 38,48 Z" fill="url(#airplaneAcc)" />
            
            {/* Jet swept-back main wing */}
            <path d="M 68,52 L 86,84 L 102,84 L 84,52 Z" fill="url(#airplaneAcc)" />
            
            {/* Jet body fuselage */}
            <path d="M 12,52 C 30,36 120,40 148,48 C 158,50 168,52 170,52 C 168,52 158,54 148,56 C 120,64 30,68 12,52 Z" fill="url(#airplaneBody)" />
            
            {/* Cockpit Canopy glass */}
            <path d="M 120,48 C 126,42 138,42 144,48 Z" fill="rgba(62, 207, 228, 0.75)" stroke="rgba(255, 255, 255, 0.4)" strokeWidth="0.8" />
            
            {/* Radar Sweep Ring centered on weather cockpit radar */}
            <circle
              cx="132"
              cy="48"
              r="26"
              fill="none"
              stroke={`rgba(${hue}, 0.08)`}
              strokeWidth="1"
              className={styles.radarRing}
            />
            {/* Radar Sweep Hand */}
            <line
              x1="132"
              y1="48"
              x2="150"
              y2="30"
              stroke={`rgba(${hue}, ${corruption > 0.2 ? '0.8' : '0.5'})`}
              strokeWidth="1.5"
              className={styles.radarHand}
              style={{ transformOrigin: '132px 48px' }}
            />
            {/* Cockpit center radar beacon */}
            <circle
              cx="132"
              cy="48"
              r="3.6"
              fill={`rgba(${hue},${pulse})`}
              style={{ filter: `drop-shadow(0 0 ${5 + pulse * 8}px rgba(${hue},0.85))` }}
            />
          </>
        ) : (
          /* Cargo Ship SVG rendering */
          <>
            <path d="M22 68 L48 50 L138 54 L162 68 L145 78 L30 78 Z" fill="url(#hull)" />
            <path d="M78 50 L78 18 L108 44 Z" fill={`rgba(${hue},0.55)`} filter="url(#glow)" />
            <rect x="76" y="16" width="4" height="38" fill="rgba(155,176,196,0.95)" />
            
            {/* Radar Sweep Ring */}
            <circle
              cx="78"
              cy="14"
              r="26"
              fill="none"
              stroke={`rgba(${hue}, 0.08)`}
              strokeWidth="1"
              className={styles.radarRing}
            />
            {/* Radar Sweep Hand */}
            <line
              x1="78"
              y1="14"
              x2="96"
              y2="-4"
              stroke={`rgba(${hue}, ${corruption > 0.2 ? '0.8' : '0.5'})`}
              strokeWidth="1.5"
              className={styles.radarHand}
              style={{ transformOrigin: '78px 14px' }}
            />
            {/* Mast beacon */}
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
          </>
        )}
      </svg>
    </div>
  )
}


