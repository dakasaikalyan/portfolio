import { useState, useEffect } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { STAGE_LABELS } from '../lib/voyageMath'
import { sonarSynth } from '../lib/sonarAudio'
import styles from './Nav.module.css'

export default function Nav() {
  const { stage, signalState, vehicleType, setVehicleType, activeView, setActiveView } = useVoyageProgress()
  const [isMuted, setIsMuted] = useState(sonarSynth.getMuted())

  // Keep synthesiser state up-to-date with signalState changes
  useEffect(() => {
    if (sonarSynth.isInitialized) {
      sonarSynth.updateState(signalState)
    }
  }, [signalState])

  const handleToggleMute = () => {
    const nextMute = !isMuted
    sonarSynth.setMute(nextMute)
    sonarSynth.updateState(signalState)
    setIsMuted(nextMute)
  }

  const getStageLabel = () => {
    if (activeView === 'monitor') {
      return 'INTELLIGENCE MONITOR'
    }
    if (vehicleType === 'plane') {
      switch (stage) {
        case 0: return 'DEPARTURE'
        case 1: return 'THE FLIGHTPATH'
        case 2: return 'SIGNAL ATTACK'
        case 3: return 'DECEPTION'
        case 4: return 'MITIGATION'
        case 5: return 'SECURED FLIGHT'
        case 6: return 'BEYOND DECEPTION'
        default: return 'FLIGHT'
      }
    } else {
      return STAGE_LABELS[stage] ?? 'VOYAGE'
    }
  }

  return (
    <header className={styles.nav}>
      <a className={styles.brand} href="#top">
        <span className={styles.mark} aria-hidden="true" />
        <span className={styles.brandText}>
          <strong>Anemoi Matrix</strong>
          <em>navigation beyond deception</em>
        </span>
      </a>

      <nav className={styles.links} aria-label="Primary">
        <button
          className={`${styles.navTab} ${activeView === 'story' ? styles.navTabActive : ''}`}
          onClick={() => setActiveView('story')}
        >
          Story Chronicle
        </button>
        <button
          className={`${styles.navTab} ${activeView === 'monitor' ? styles.navTabActive : ''}`}
          onClick={() => setActiveView('monitor')}
        >
          Trust Monitor
        </button>
      </nav>

      <div className={styles.controls}>
        <div className={styles.vehicleSelect}>
          <button 
            className={`${styles.vehicleBtn} ${vehicleType === 'plane' ? styles.vehicleActive : ''}`}
            onClick={() => setVehicleType('plane')}
            title="Switch simulation to Aviation"
          >
            AVIONICS
          </button>
          <button 
            className={`${styles.vehicleBtn} ${vehicleType === 'ship' ? styles.vehicleActive : ''}`}
            onClick={() => setVehicleType('ship')}
            title="Switch simulation to Maritime"
          >
            MARINE
          </button>
        </div>

        <button
          className={styles.audioToggle}
          onClick={handleToggleMute}
          aria-label={isMuted ? 'Unmute soundscape' : 'Mute soundscape'}
        >
          <div className={`${styles.soundIcon} ${isMuted ? '' : styles.playing}`}>
            <span />
            <span />
            <span />
            <span />
          </div>
          <span className={styles.audioLabel}>
            {vehicleType === 'plane' ? 'ALERTS' : 'SONAR'} {isMuted ? 'OFF' : 'ON'}
          </span>
        </button>
        <p className={styles.stage}>{getStageLabel()}</p>
      </div>
    </header>
  )
}


