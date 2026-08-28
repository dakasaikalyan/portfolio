import Beat from './Beat'
import Finale from './Finale'
import Pipeline from './Pipeline.tsx'
import Stats from './Stats'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import beatStyles from './Beat.module.css'
import styles from './Voyage.module.css'

export default function Beats() {
  const { vehicleType } = useVoyageProgress()
  const isPlane = vehicleType === 'plane'

  return (
    <div className={styles.beats}>
      {/* Tall spacer — scroll distance for pinned intro */}
      <section className={styles.introSpacer} data-stage={0} aria-label="Origin intro" />

      <Beat stage={1}>
        <p className={beatStyles.kicker}>
          <span>01</span> {isPlane ? 'The Flightpath' : 'The Channel'}
        </p>
        <h2 className={beatStyles.title}>
          {isPlane 
            ? 'GPS, ADS-B, radar, satcom — believed by default.' 
            : 'GPS, AIS, radar, satcom — believed by default.'}
        </h2>
        <p className={beatStyles.body}>
          {isPlane ? (
            <>
              Between sky and cockpit there is no authentication gate. Whoever transmits is accepted as
              real. <span className={beatStyles.accent}>Anemoi Matrix</span> exists for that gap.
            </>
          ) : (
            <>
              Between sky and bridge there is no authentication gate. Whoever transmits is accepted as
              real. <span className={beatStyles.accent}>Anemoi Matrix</span> exists for that gap.
            </>
          )}
        </p>
      </Beat>

      <Beat stage={2} variant="alarm" align="right">
        <p className={beatStyles.kicker}>
          <span>02</span> The Attack
        </p>
        <h2 className={beatStyles.title}>Spoofed RF slips into the same channel.</h2>
        <p className={beatStyles.body}>
          {isPlane ? (
            <>
              Malicious signals blend with the legitimate waveform — near-identical, silent, and aimed
              at the aircraft’s avionics before anyone notices.
            </>
          ) : (
            <>
              Malicious signals blend with the legitimate waveform — near-identical, silent, and aimed
              at the ship’s instruments before anyone notices.
            </>
          )}
        </p>
      </Beat>

      <Beat stage={3} variant="alarm">
        <p className={beatStyles.kicker}>
          <span>03</span> Deception
        </p>
        <h2 className={beatStyles.title}>
          {isPlane ? 'The cockpit still reads “normal.”' : 'The bridge still reads “normal.”'}
        </h2>
        <p className={beatStyles.body}>
          {isPlane ? (
            <>
              Autopilot, flight management systems (FMS), and collision avoidance systems (TCAS) keep running — on a lie the aircraft cannot see.
              That is the failure mode our services are built to close.
            </>
          ) : (
            <>
              Autopilot, ECDIS, and collision systems keep running — on a lie the vessel cannot see.
              That is the failure mode our services are built to close.
            </>
          )}
        </p>
      </Beat>

      <Beat stage={4} variant="mint">
        <p className={beatStyles.kicker} id="capability">
          <span>04</span> Ambastion Intercepts
        </p>
        <h2 className={beatStyles.title}>Fake signals stopped. Trust restored.</h2>
        <p className={beatStyles.body}>
          {isPlane ? (
            <>
              <span className={beatStyles.accent}>Anemoi Matrix</span> sits between raw RF and the
              aircraft — capture, authenticate, filter, then deliver only genuine signals.
            </>
          ) : (
            <>
              <span className={beatStyles.accent}>Anemoi Matrix</span> sits between raw RF and the
              ship — capture, authenticate, filter, then deliver only genuine signals.
            </>
          )}
        </p>
        <Pipeline />
      </Beat>

      <Beat stage={5} variant="gold" align="right">
        <p className={beatStyles.kicker}>
          <span>05</span> {isPlane ? 'Protected Flight' : 'Protected Voyage'}
        </p>
        <h2 className={beatStyles.title}>Authenticated RF becomes the new normal.</h2>
        <p className={beatStyles.body}>
          {isPlane ? (
            <>
              Clean signal reaches navigation and avionics. Spoofing is stripped before it can steer
              the aircraft — engineered as an always-on service layer.
            </>
          ) : (
            <>
              Clean mint signal reaches navigation and comms. Spoofing is stripped before it can steer
              the ship — engineered as an always-on service layer.
            </>
          )}
        </p>
        <Stats />
      </Beat>

      <Beat stage={6} variant="cta">
        <Finale />
      </Beat>
    </div>
  )
}

