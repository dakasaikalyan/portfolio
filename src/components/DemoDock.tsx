import { useState, type FormEvent } from 'react'
import styles from './DemoDock.module.css'

const SERVICES = [
  {
    title: 'RF Trust Assessment',
    body: 'Map GNSS, AIS, radar, and satcom exposure across your fleet stack.',
  },
  {
    title: 'Ambastion Integration',
    body: 'Deploy the authentication layer between raw RF and bridge systems.',
  },
  {
    title: 'Continuous Monitoring',
    body: 'Ongoing spoof/jam detection with authenticated signal delivery.',
  },
]

export default function DemoDock() {
  const [status, setStatus] = useState('')

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

  return (
    <section className={styles.dock} id="demo">
      <div className={styles.glow} aria-hidden="true" />
      <div className={styles.inner}>
        <div className={styles.copy}>
          <p className={styles.brand}>Anemoi Matrix</p>
          <p className={styles.tagline}>navigation beyond deception</p>
          <h2>Professional RF authentication services</h2>
          <p>
            Engage our team for assessment, Ambastion deployment, and continuous protection —
            engineered so spoofed signals never become bridge truth.
          </p>

          <ul className={styles.services}>
            {SERVICES.map((service) => (
              <li key={service.title}>
                <strong>{service.title}</strong>
                <span>{service.body}</span>
              </li>
            ))}
          </ul>

          <a className={styles.mail} href="mailto:office@ambastion.com">
            office@ambastion.com
          </a>
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
              placeholder="Fleet size, GNSS/AIS stack, pilot timeline…"
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
