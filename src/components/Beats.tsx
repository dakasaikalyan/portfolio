import Beat from './Beat'
import Finale from './Finale'
import Pipeline from './Pipeline.tsx'
import Stats from './Stats'
import beatStyles from './Beat.module.css'
import styles from './Voyage.module.css'

export default function Beats() {
  return (
    <div className={styles.beats}>
      {/* Tall spacer — scroll distance for pinned intro (sky → brand → tag → lead) */}
      <section className={styles.introSpacer} data-stage={0} aria-label="Origin intro" />

      <Beat stage={1}>
        <p className={beatStyles.kicker}>
          <span>01</span> The Channel
        </p>
        <h2 className={beatStyles.title}>GPS, AIS, radar, satcom — believed by default.</h2>
        <p className={beatStyles.body}>
          Between sky and bridge there is no authentication gate. Whoever transmits is accepted as
          real. <span className={beatStyles.accent}>Anemoi Matrix</span> exists for that gap.
        </p>
      </Beat>

      <Beat stage={2} variant="alarm" align="right">
        <p className={beatStyles.kicker}>
          <span>02</span> The Attack
        </p>
        <h2 className={beatStyles.title}>Spoofed RF slips into the same channel.</h2>
        <p className={beatStyles.body}>
          Malicious signals blend with the legitimate waveform — near-identical, silent, and aimed
          at the ship’s instruments before anyone notices.
        </p>
      </Beat>

      <Beat stage={3} variant="alarm">
        <p className={beatStyles.kicker}>
          <span>03</span> Deception
        </p>
        <h2 className={beatStyles.title}>The bridge still reads “normal.”</h2>
        <p className={beatStyles.body}>
          Autopilot, ECDIS, and collision systems keep running — on a lie the vessel cannot see.
          That is the failure mode our services are built to close.
        </p>
      </Beat>

      <Beat stage={4} variant="mint">
        <p className={beatStyles.kicker} id="capability">
          <span>04</span> Ambastion Intercepts
        </p>
        <h2 className={beatStyles.title}>Fake signals stopped. Trust restored.</h2>
        <p className={beatStyles.body}>
          <span className={beatStyles.accent}>Anemoi Matrix</span> sits between raw RF and the
          ship — capture, authenticate, filter, then deliver only genuine signals.
        </p>
        <Pipeline />
      </Beat>

      <Beat stage={5} variant="gold" align="right">
        <p className={beatStyles.kicker}>
          <span>05</span> Protected Voyage
        </p>
        <h2 className={beatStyles.title}>Authenticated RF becomes the new normal.</h2>
        <p className={beatStyles.body}>
          Clean mint signal reaches navigation and comms. Spoofing is stripped before it can steer
          the ship — engineered as an always-on service layer.
        </p>
        <Stats />
      </Beat>

      <Beat stage={6} variant="cta">
        <Finale />
      </Beat>
    </div>
  )
}
