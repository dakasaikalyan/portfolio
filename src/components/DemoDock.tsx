import { useState, type FormEvent } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { sonarSynth } from '../lib/sonarAudio'
import styles from './DemoDock.module.css'


export default function DemoDock() {
  const [status, setStatus] = useState('')
  const { signalState, isSimulated, setSimulation, vehicleType } = useVoyageProgress()
  const isPlane = vehicleType === 'plane'

  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') || '').trim()
    setStatus(
      name
        ? `Thanks, ${name}. We’ll follow up with a technical briefing.`
        : 'Thanks — we’ll follow up shortly.',
    )
    event.currentTarget.reset()
  }

  // Generate dynamic, ticking metrics depending on signal status
  const getMetrics = () => {
    switch (signalState) {
      case 'CORRUPTED':
        return {
          cn0: `${(27.8 + Math.random() * 2.8).toFixed(1)} dB-Hz`,
          jitter: `${(11.5 + Math.random() * 4.5).toFixed(2)} m`,
          auth: `${(4.5 + Math.random() * 5.5).toFixed(1)} %`,
        }
      case 'AUTHENTICATED':
        return {
          cn0: `45.2 dB-Hz`,
          jitter: `< 0.02 m`,
          auth: `99.9 %`,
        }
      default:
        return {
          cn0: `${(44.4 + Math.random() * 0.9).toFixed(1)} dB-Hz`,
          jitter: `${(0.04 + Math.random() * 0.02).toFixed(2)} m`,
          auth: `100.0 %`,
        }
    }
  }

  const m = getMetrics()

  return (
    <section className={styles.dock} id="demo">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.brand}>Anemoi Matrix</p>
          <p className={styles.tagline}>navigation beyond deception</p>
          <h2>Professional RF authentication services</h2>
          <p>
            {isPlane ? (
              <>
                Engage our team for assessment, Ambastion deployment, and continuous protection —
                engineered so spoofed signals never become cockpit truth.
              </>
            ) : (
              <>
                Engage our team for assessment, Ambastion deployment, and continuous protection —
                engineered so spoofed signals never become bridge truth.
              </>
            )}
          </p>

          <ul className={styles.services}>
            <li>
              <strong>RF Trust Assessment</strong>
              <span>
                {isPlane 
                  ? 'Map GNSS, ADS-B, radar, and satcom exposure across your avionics stack.' 
                  : 'Map GNSS, AIS, radar, and satcom exposure across your fleet stack.'}
              </span>
            </li>
            <li>
              <strong>Ambastion Integration</strong>
              <span>
                {isPlane 
                  ? 'Deploy the authentication layer between raw RF and cockpit telemetry.' 
                  : 'Deploy the authentication layer between raw RF and bridge systems.'}
              </span>
            </li>
            <li>
              <strong>Continuous Monitoring</strong>
              <span>
                Ongoing spoof/jam detection with authenticated signal delivery.
              </span>
            </li>
          </ul>

          <a className={styles.mail} href="mailto:office@ambastion.com">
            office@ambastion.com
          </a>

          <div className={`${styles.sandbox} ${signalState === 'CORRUPTED' ? styles.sandboxCorrupted : signalState === 'AUTHENTICATED' ? styles.sandboxAuthenticated : ''}`}>
            <p className={styles.sandboxTitle}>Ambastion RF Tactical Sandbox</p>
            
            <div className={styles.metricsGrid}>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Carrier-to-Noise (C/N₀)</span>
                <strong className={styles.metricValue}>{m.cn0}</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Residual Jitter</span>
                <strong className={styles.metricValue}>{m.jitter}</strong>
              </div>
              <div className={styles.metricCard}>
                <span className={styles.metricLabel}>Signal Authenticity</span>
                <strong className={styles.metricValue}>{m.auth}</strong>
              </div>
            </div>

            <div className={styles.simControls}>
              <button 
                type="button"
                className={`${styles.simBtn} ${styles.attackBtn} ${signalState === 'CORRUPTED' ? styles.activeBtn : ''}`}
                onClick={() => {
                  setSimulation({ corruption: 1, authGlow: 0, signalState: 'CORRUPTED' })
                  sonarSynth.playClickSound('attack')
                }}
              >
                SPOOF ATTACK
              </button>
              <button 
                type="button"
                className={`${styles.simBtn} ${styles.defendBtn} ${signalState === 'AUTHENTICATED' ? styles.activeBtn : ''}`}
                onClick={() => {
                  setSimulation({ corruption: 0, authGlow: 1, signalState: 'AUTHENTICATED' })
                  sonarSynth.playClickSound('defend')
                }}
              >
                DEPLOY SHIELD
              </button>
              {isSimulated && (
                <button 
                  type="button"
                  className={`${styles.simBtn} ${styles.resetBtn}`}
                  onClick={() => {
                    setSimulation(null)
                    sonarSynth.playClickSound('reset')
                  }}
                >
                  RESET
                </button>
              )}
            </div>
          </div>
        </div>



        <form className={styles.form} onSubmit={onSubmit}>
          <p className={styles.formTitle}>Request a technical demo</p>
          <label>
            Name
            <input name="name" required autoComplete="name" />
          </label>
          <label>
            Email
            <input name="email" type="email" required autoComplete="email" />
          </label>
          <label>
            Organisation
            <input name="org" required />
          </label>
          <label>
            Interest
            <textarea
              name="message"
              rows={4}
              required
              placeholder={isPlane ? "Fleet size, GNSS/avionics stack, test flight timeline…" : "Fleet size, GNSS/AIS stack, pilot timeline…"}
            />
          </label>
          <button type="submit">Request a technical demo</button>
          <p className={styles.status} role="status" aria-live="polite">
            {status}
          </p>
        </form>
      </div>

      <div className={styles.foot}>
        <strong>Anemoi Matrix</strong>
        <span>navigation beyond deception</span>
        <span>© {new Date().getFullYear()}</span>
      </div>
    </section>
  )
}
