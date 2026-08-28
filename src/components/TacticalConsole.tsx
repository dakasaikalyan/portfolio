import { useState, useEffect } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { sonarSynth } from '../lib/sonarAudio'
import styles from './TacticalConsole.module.css'

export default function TacticalConsole() {
  const { introComplete, signalState, isSimulated, setSimulation, vehicleType } = useVoyageProgress()
  const [lat, setLat] = useState(34.5980)
  const [lon, setLon] = useState(139.8683)
  const [signalBars, setSignalBars] = useState([4, 4, 3, 4, 3])
  const [alt, setAlt] = useState(24500)
  const [speed, setSpeed] = useState(vehicleType === 'plane' ? 485 : 18.6)
  const [heading, setHeading] = useState(284.2)

  // Synchronize speed default value when vehicle type toggles
  useEffect(() => {
    setSpeed(vehicleType === 'plane' ? 485 : 18.6)
  }, [vehicleType])

  // Trigger coordinate drift based on signalState
  useEffect(() => {
    let intervalId: number
    
    const updateCoordinates = () => {
      if (signalState === 'CORRUPTED') {
        setLat(34.5980 + 0.15 * (Math.random() - 0.2) + 0.12 * Math.sin(Date.now() / 2000))
        setLon(139.8683 + 0.22 * (Math.random() - 0.2) + 0.18 * Math.cos(Date.now() / 2500))
      } else if (signalState === 'MONITORING') {
        setLat(34.5980 + 0.00015 * Math.sin(Date.now() / 1500))
        setLon(139.8683 + 0.00012 * Math.cos(Date.now() / 1800))
      } else {
        setLat(34.5980)
        setLon(139.8683)
      }
    }

    intervalId = window.setInterval(updateCoordinates, signalState === 'CORRUPTED' ? 120 : 500)
    return () => clearInterval(intervalId)
  }, [signalState])

  // Fluctuate signal bar heights randomly based on signal quality
  useEffect(() => {
    let intervalId: number
    const updateBars = () => {
      if (signalState === 'CORRUPTED') {
        setSignalBars(Array.from({ length: 5 }, () => (Math.random() < 0.35 ? 2 : 1)))
      } else if (signalState === 'MONITORING') {
        setSignalBars(Array.from({ length: 5 }, () => Math.floor(Math.random() * 2) + 3))
      } else {
        setSignalBars([5, 5, 5, 5, 5])
      }
    }
    intervalId = window.setInterval(updateBars, signalState === 'CORRUPTED' ? 80 : 300)
    return () => clearInterval(intervalId)
  }, [signalState])

  // Track aviation barometric altitude drift
  useEffect(() => {
    if (vehicleType !== 'plane') return
    let intervalId: number

    const updateAltitude = () => {
      if (signalState === 'CORRUPTED') {
        setAlt(Math.round(24500 + 4200 * Math.sin(Date.now() / 4000) + 350 * (Math.random() - 0.5)))
      } else if (signalState === 'MONITORING') {
        setAlt(Math.round(24500 + 20 * Math.sin(Date.now() / 2500) + 4 * (Math.random() - 0.5)))
      } else {
        setAlt(24500)
      }
    }

    intervalId = window.setInterval(updateAltitude, 150)
    return () => clearInterval(intervalId)
  }, [signalState, vehicleType])

  // Track speed and heading telemetry drift
  useEffect(() => {
    let intervalId: number
    const updateTelemetry = () => {
      if (signalState === 'CORRUPTED') {
        // Speed jumps erratically (spoofed GPS velocity vectors)
        if (vehicleType === 'plane') {
          setSpeed(Math.round(485 + 160 * Math.sin(Date.now() / 1200) + 35 * (Math.random() - 0.5)))
        } else {
          setSpeed(Number((18.6 + 6.4 * Math.sin(Date.now() / 1500) + 1.1 * (Math.random() - 0.5)).toFixed(1)))
        }
        // Compass heading spins chaotically under spoofing
        setHeading(Number(((284.2 + (Date.now() / 15) % 360) % 360).toFixed(1)))
      } else if (signalState === 'MONITORING') {
        // Subtle standard environmental fluctuations
        if (vehicleType === 'plane') {
          setSpeed(Math.round(485 + 2 * Math.sin(Date.now() / 1800) + 0.6 * (Math.random() - 0.5)))
        } else {
          setSpeed(Number((18.6 + 0.12 * Math.sin(Date.now() / 2000) + 0.04 * (Math.random() - 0.5)).toFixed(1)))
        }
        setHeading(Number((284.2 + 0.35 * Math.sin(Date.now() / 2500)).toFixed(1)))
      } else {
        // AUTHENTICATED: Locked, absolute precision speed and gyro heading
        setSpeed(vehicleType === 'plane' ? 485 : 18.6)
        setHeading(284.2)
      }
    }
    intervalId = window.setInterval(updateTelemetry, 150)
    return () => clearInterval(intervalId)
  }, [signalState, vehicleType])

  if (!introComplete) return null

  // Format helpers
  const formatLat = (v: number) => {
    const deg = Math.floor(v)
    const min = ((v - deg) * 60).toFixed(3)
    return `${deg}° ${min}' N`
  }

  const formatLon = (v: number) => {
    const deg = Math.floor(v)
    const min = ((v - deg) * 60).toFixed(3)
    return `${deg}° ${min}' E`
  }

  const formatAlt = (v: number) => {
    return `${v.toLocaleString()} FT`
  }

  const formatSpeed = (v: number) => {
    return `${v} KTS`
  }

  const formatHeading = (v: number) => {
    const card = v >= 337.5 || v < 22.5 ? 'N' :
                 v >= 22.5 && v < 67.5 ? 'NE' :
                 v >= 67.5 && v < 112.5 ? 'E' :
                 v >= 112.5 && v < 157.5 ? 'SE' :
                 v >= 157.5 && v < 202.5 ? 'S' :
                 v >= 202.5 && v < 247.5 ? 'SW' :
                 v >= 247.5 && v < 292.5 ? 'W' : 'NW'
    return `${v.toFixed(1)}° ${card}`
  }

  return (
    <div className={`${styles.console} ${signalState === 'CORRUPTED' ? styles.corrupted : signalState === 'AUTHENTICATED' ? styles.authenticated : ''}`}>
      <div className={styles.header}>
        <span className={styles.dot} />
        <span className={styles.title}>RF TELEMETRY HUD</span>
        {isSimulated && <span className={styles.simBadge}>SIMULATED</span>}
      </div>

      <div className={styles.grid}>
        <div className={styles.telemetry}>
          <div className={styles.metric}>
            <label>GPS LATITUDE</label>
            <span className={styles.value}>{formatLat(lat)}</span>
          </div>
          <div className={styles.metric}>
            <label>GPS LONGITUDE</label>
            <span className={styles.value}>{formatLon(lon)}</span>
          </div>
          {vehicleType === 'plane' && (
            <div className={styles.metric}>
              <label>BARO ALTITUDE</label>
              <span className={styles.value}>{formatAlt(alt)}</span>
            </div>
          )}
          <div className={styles.metric}>
            <label>GROUND SPEED</label>
            <span className={styles.value}>{formatSpeed(speed)}</span>
          </div>
          <div className={styles.metric}>
            <label>TRUE HEADING</label>
            <span className={styles.value}>{formatHeading(heading)}</span>
          </div>
          <div className={styles.metric}>
            <label>RF SIGNAL STATUS</label>
            <div className={styles.statusRow}>
              <svg viewBox="0 0 24 24" className={styles.lockIcon} fill="none" stroke="currentColor">
                {signalState === 'AUTHENTICATED' ? (
                  <>
                    <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2" />
                    <path d="M8 11V7a4 4 0 0 1 8 0v4" strokeWidth="2" />
                    <circle cx="12" cy="16" r="1.5" fill="currentColor" />
                  </>
                ) : signalState === 'CORRUPTED' ? (
                  <>
                    <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2" />
                    <path d="M8 11V8a4 4 0 0 1 4.5 -4" strokeWidth="2" strokeDasharray="3 2" />
                    <path d="M12 15v3" strokeWidth="2" />
                    <line x1="3" y1="3" x2="21" y2="21" strokeWidth="2" className={styles.slashLine} />
                  </>
                ) : (
                  <>
                    <rect x="5" y="11" width="14" height="10" rx="2" strokeWidth="2" />
                    <path d="M8 11V7a4 4 0 0 1 7.5 -2.5" strokeWidth="2" />
                    <circle cx="12" cy="16" r="1.2" fill="currentColor" />
                  </>
                )}
              </svg>
              <span className={`${styles.value} ${styles.statusText}`}>
                {signalState === 'AUTHENTICATED' ? 'SECURED' : signalState === 'CORRUPTED' ? 'COMPROMISED' : 'UNSECURED'}
              </span>
            </div>
          </div>
        </div>

        <div className={styles.constellationWrap}>
          <svg viewBox="0 0 100 100" className={styles.constellation}>
            <defs>
              <linearGradient id="sweepGradMon" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(62, 207, 228, 0.28)" />
                <stop offset="100%" stopColor="rgba(62, 207, 228, 0)" />
              </linearGradient>
              <linearGradient id="sweepGradAttack" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255, 77, 87, 0.35)" />
                <stop offset="100%" stopColor="rgba(255, 77, 87, 0)" />
              </linearGradient>
              <linearGradient id="sweepGradDefend" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(47, 217, 154, 0.35)" />
                <stop offset="100%" stopColor="rgba(47, 217, 154, 0)" />
              </linearGradient>
            </defs>

            <circle cx="50" cy="50" r="45" className={styles.gridLine} />
            <circle cx="50" cy="50" r="30" className={styles.gridLine} />
            <circle cx="50" cy="50" r="15" className={styles.gridLine} />
            <line x1="50" y1="5" x2="50" y2="95" className={styles.gridLine} />
            <line x1="5" y1="50" x2="95" y2="50" className={styles.gridLine} />
            
            {/* Sonar Sweep */}
            <g className={styles.sweepGroup}>
              <path
                d="M 50 50 L 50 5 A 45 45 0 0 1 81.8 18.2 Z"
                fill={
                  signalState === 'CORRUPTED'
                    ? 'url(#sweepGradAttack)'
                    : signalState === 'AUTHENTICATED'
                      ? 'url(#sweepGradDefend)'
                      : 'url(#sweepGradMon)'
                }
              />
              <line
                x1="50"
                y1="50"
                x2="50"
                y2="5"
                stroke={
                  signalState === 'CORRUPTED'
                    ? 'var(--alarm-red)'
                    : signalState === 'AUTHENTICATED'
                      ? 'var(--clean-mint)'
                      : 'var(--signal-cyan)'
                }
                strokeWidth="1.2"
              />
            </g>

            {/* Satellites with precision-synced sweep delays */}
            <circle
              cx="28"
              cy="22"
              r="3"
              className={`${styles.sat} ${signalState === 'CORRUPTED' ? styles.satSpoofed : signalState === 'AUTHENTICATED' ? styles.satFiltered : ''}`}
              style={{ animationDelay: '-0.42s' }}
            />
            <circle
              cx="75"
              cy="30"
              r="3"
              className={`${styles.sat} ${signalState === 'AUTHENTICATED' ? styles.satSecured : ''}`}
              style={{ animationDelay: '-3.43s' }}
            />
            <circle
              cx="45"
              cy="78"
              r="3"
              className={`${styles.sat} ${signalState === 'CORRUPTED' ? styles.satSpoofed : signalState === 'AUTHENTICATED' ? styles.satFiltered : ''}`}
              style={{ animationDelay: '-1.89s' }}
            />
            <circle
              cx="18"
              cy="65"
              r="3"
              className={`${styles.sat} ${signalState === 'AUTHENTICATED' ? styles.satSecured : ''}`}
              style={{ animationDelay: '-1.28s' }}
            />
            <circle
              cx="82"
              cy="72"
              r="3"
              className={`${styles.sat} ${signalState === 'AUTHENTICATED' ? styles.satSecured : ''}`}
              style={{ animationDelay: '-2.62s' }}
            />
            <circle
              cx="50"
              cy="28"
              r="3"
              className={`${styles.sat} ${signalState === 'AUTHENTICATED' ? styles.satSecured : ''}`}
              style={{ animationDelay: '0s' }}
            />

            {/* Center Vehicle Tracker Dot */}
            <circle 
              cx="50" 
              cy="50" 
              r="2.5" 
              fill={signalState === 'CORRUPTED' ? 'var(--alarm-red)' : signalState === 'AUTHENTICATED' ? 'var(--clean-mint)' : 'var(--signal-cyan)'} 
              style={{ filter: `drop-shadow(0 0 3px currentColor)` }}
            />

            {/* Distant Steady Verified Targets */}
            <g opacity="0.35">
              <polygon points="32,40 34,44 30,44" fill="var(--signal-cyan)" />
              <polygon points="72,62 74,66 70,66" fill="var(--signal-cyan)" />
            </g>

            {/* Decoy Ghost Targets (cluttering radar screen under active GPS spoofing) */}
            {signalState === 'CORRUPTED' && (
              <>
                <g className={styles.ghostTarget} style={{ animationDelay: '0.1s' }}>
                  <circle cx="66" cy="46" r="2" fill="var(--alarm-red)" />
                  <circle cx="66" cy="46" r="5" stroke="var(--alarm-red)" strokeWidth="0.5" fill="none" className={styles.ghostRing} />
                </g>
                <g className={styles.ghostTarget} style={{ animationDelay: '0.4s' }}>
                  <circle cx="36" cy="58" r="2" fill="var(--alarm-red)" />
                  <circle cx="36" cy="58" r="5" stroke="var(--alarm-red)" strokeWidth="0.5" fill="none" className={styles.ghostRing} />
                </g>
                <g className={styles.ghostTarget} style={{ animationDelay: '0.7s' }}>
                  <circle cx="58" cy="74" r="2" fill="var(--alarm-red)" />
                  <circle cx="58" cy="74" r="5" stroke="var(--alarm-red)" strokeWidth="0.5" fill="none" className={styles.ghostRing} />
                </g>
                <g className={styles.ghostTarget} style={{ animationDelay: '1.2s' }}>
                  <circle cx="48" cy="34" r="2" fill="var(--alarm-red)" />
                  <circle cx="48" cy="34" r="5" stroke="var(--alarm-red)" strokeWidth="0.5" fill="none" className={styles.ghostRing} />
                </g>
              </>
            )}
          </svg>
          <div className={styles.constellationLabel}>GNSS VECTOR RADAR</div>
        </div>

        <div className={styles.rssiWrap}>
          <div className={styles.barGraph}>
            {signalBars.map((val, idx) => (
              <div key={idx} className={styles.barColumn}>
                {Array.from({ length: 5 }, (_, bIdx) => {
                  const active = 5 - bIdx <= val
                  return (
                    <div 
                      key={bIdx} 
                      className={`${styles.barBlock} ${active ? styles.barActive : ''}`} 
                    />
                  )
                })}
              </div>
            ))}
          </div>
          <div className={styles.rssiLabel}>RSSI</div>
        </div>
      </div>


      <div className={styles.actions}>
        <button 
          className={`${styles.btn} ${styles.btnAttack} ${signalState === 'CORRUPTED' ? styles.btnActive : ''}`}
          onClick={() => {
            setSimulation({ corruption: 1, authGlow: 0, signalState: 'CORRUPTED' })
            sonarSynth.playClickSound('attack')
          }}
        >
          SPOOF ATTACK
        </button>
        <button 
          className={`${styles.btn} ${styles.btnDefend} ${signalState === 'AUTHENTICATED' ? styles.btnActive : ''}`}
          onClick={() => {
            setSimulation({ corruption: 0, authGlow: 1, signalState: 'AUTHENTICATED' })
            sonarSynth.playClickSound('defend')
          }}
        >
          DEPLOY SHIELD
        </button>
        {isSimulated && (
          <button 
            className={`${styles.btn} ${styles.btnReset}`}
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
  )
}

