import { useVoyageProgress } from '../context/VoyageProgressContext'
import AuthSeal from './AuthSeal'
import styles from './Finale.module.css'

const CHAIN = ['ATTACK', 'DETECT', 'AUTHENTICATE', 'PROTECT'] as const

export default function Finale() {
  const { vehicleType } = useVoyageProgress()
  const isPlane = vehicleType === 'plane'

  return (
    <div className={styles.finale}>
      <div className={styles.rail} aria-hidden="true">
        <span />
        <span />
        <span />
      </div>

      <div className={styles.copy}>
        <p className={styles.brand}>
          <span>Anemoi</span>
          <span>Matrix</span>
        </p>
        <p className={styles.tag}>navigation beyond deception</p>

        <h2 className={styles.headline}>
          <span>The verification layer</span>
          <span>between raw signal</span>
          <span>{isPlane ? 'and every flight.' : 'and every voyage.'}</span>
        </h2>

        <p className={styles.body}>
          {isPlane ? (
            <>
              Attack. Detection. Authentication. Protection — delivered as a professional RF trust
              service for modern aviation fleets.
            </>
          ) : (
            <>
              Attack. Detection. Authentication. Protection — delivered as a professional RF trust
              service for modern maritime fleets.
            </>
          )}
        </p>

        <div className={styles.chain} aria-label="Service chain">
          {CHAIN.map((step, index) => (
            <span key={step} className={styles.step} style={{ animationDelay: `${0.08 * index}s` }}>
              <em>{String(index + 1).padStart(2, '0')}</em>
              {step}
              {index < CHAIN.length - 1 ? <i aria-hidden="true" /> : null}
            </span>
          ))}
        </div>

        <div className={styles.actions}>
          <a className={styles.primary} href="#demo">
            <span className={styles.glyph} aria-hidden="true" />
            Request a technical demo
          </a>
          <a className={styles.secondary} href="mailto:office@ambastion.com">
            Talk to our team
            <span aria-hidden="true">↗</span>
          </a>
        </div>
      </div>

      <AuthSeal />
    </div>
  )
}
