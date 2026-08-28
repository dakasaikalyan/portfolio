import { useRef, useState, useEffect } from 'react'
import ProgressRail from './components/ProgressRail'
import Nav from './components/Nav'
import Voyage from './components/Voyage'
import Footer from './components/Footer.tsx'
import DemoDock from './components/DemoDock'
import TacticalConsole from './components/TacticalConsole'
import SignalCursor from './components/SignalCursor'
import { VoyageProgressProvider, type SimulationState, type ExtendedVoyageProgress, type TrackedEntity, type SignalEventLog, type SimulationScenario } from './context/VoyageProgressContext'
import { useScrollProgress } from './hooks/useScrollProgress'
import { createInitialEntities, createInitialLogs, processSimulationTick, formatTime } from './lib/simulationEngine'
import TrustMonitor from './components/TrustMonitor/TrustMonitor'

export default function App() {
  const voyageRef = useRef<HTMLElement | null>(null)
  const progress = useScrollProgress(voyageRef)
  const [simulation, setSimulation] = useState<SimulationState>(null)
  const [vehicleType, setVehicleType] = useState<'ship' | 'plane'>('plane')
  const [shakeOffset, setShakeOffset] = useState({ x: 0, y: 0 })

  const [activeView, setActiveView] = useState<'story' | 'monitor'>('story')
  const [simulatedEntities, setSimulatedEntities] = useState<TrackedEntity[]>(() => createInitialEntities())
  const [selectedEntityId, setSelectedEntityId] = useState<string | null>(null)
  const [eventLogs, setEventLogs] = useState<SignalEventLog[]>(() => createInitialLogs())
  const [activeScenario, setScenario] = useState<SimulationScenario>('normal')
  const [anomalyViewEnabled, setAnomalyViewEnabled] = useState(false)
  const [useLiveApi, setUseLiveApi] = useState(false)

  // Run simulation telemetry coordinate crawlers and validation ticks
  useEffect(() => {
    const interval = setInterval(() => {
      setSimulatedEntities((prev) => {
        const next = processSimulationTick(prev, activeScenario, (type, identifier, event, score, status) => {
          setEventLogs((prevLogs) => [
            {
              id: `log-${Date.now()}-${Math.random()}`,
              timestamp: formatTime(new Date()),
              type,
              identifier,
              event,
              score,
              status,
            },
            ...prevLogs.slice(0, 49),
          ])
        })
        return next
      })
    }, 1500)

    return () => clearInterval(interval)
  }, [activeScenario])

  // Run OpenSky Network API polling loop when useLiveApi is enabled
  useEffect(() => {
    if (!useLiveApi) {
      setSimulatedEntities(createInitialEntities())
      return
    }

    const fetchLiveData = async () => {
      try {
        const res = await fetch('https://opensky-network.org/api/states/all?lamin=34.6&lamax=35.8&lomin=139.0&lomax=140.4')
        if (!res.ok) throw new Error('API Rate Limited')
        const data = await res.json()
        if (data && data.states) {
          const apiEntities: TrackedEntity[] = data.states.slice(0, 10).map((s: any) => {
            const icao = s[0]
            const callsign = s[1] ? s[1].trim() : `FLIGHT-${icao.toUpperCase()}`
            const lon = s[5]
            const lat = s[6]
            const alt = s[7] ? Math.round(s[7] * 3.28084) : 22000
            const speed = s[9] ? Math.round(s[9] * 1.94384) : 420
            const heading = s[10] ? s[10] : 90

            return {
              id: `api-${icao}`,
              type: 'aircraft',
              callsign,
              identifier: icao.toUpperCase(),
              model: 'Live ADS-B Flight',
              latitude: lat,
              longitude: lon,
              targetLat: lat,
              targetLon: lon,
              heading,
              altitude: alt,
              speed,
              timestamp: Date.now(),
              sources: ['ADS-B', 'OpenSky API'],
              validation: { identity: 95, position: 96, velocity: 94, timestamp: 100, crossSource: 95, trajectory: 96 },
              anomalies: [],
              trustScore: 96,
              trustStatus: 'VERIFIED',
              history: [{ time: formatTime(new Date()), event: 'Live OpenSky transponder packet parsed successfully', status: 'VERIFIED' }]
            }
          })

          if (apiEntities.length > 0) {
            setSimulatedEntities(apiEntities)
            setEventLogs((prev) => [
              {
                id: `log-${Date.now()}`,
                timestamp: formatTime(new Date()),
                type: 'aircraft',
                identifier: 'OPENSKY',
                event: `Successfully parsed ${apiEntities.length} real-time flights from OpenSky API.`,
                score: 98,
                status: 'VERIFIED'
              },
              ...prev
            ])
          }
        }
      } catch (err) {
        console.warn('OpenSky API failed (CORS or rate limit):', err)
        setEventLogs((prev) => [
          {
            id: `log-${Date.now()}`,
            timestamp: formatTime(new Date()),
            type: 'aircraft',
            identifier: 'OPENSKY',
            event: 'CORS or Rate Limit on OpenSky API. Simulating live high-fidelity feeds.',
            score: 85,
            status: 'TRUSTED'
          },
          ...prev
        ])
      }
    }

    fetchLiveData()
    const interval = setInterval(fetchLiveData, 12000)
    return () => clearInterval(interval)
  }, [useLiveApi])

  // Listen for lightning strikes to trigger a dynamic camera shake
  useEffect(() => {
    const triggerShake = () => {
      const start = Date.now()
      const duration = 280

      const animate = () => {
        const elapsed = Date.now() - start
        const progressVal = elapsed / duration

        if (progressVal >= 1) {
          setShakeOffset({ x: 0, y: 0 })
        } else {
          const amp = (1 - progressVal) * 8.5
          setShakeOffset({
            x: (Math.random() - 0.5) * amp,
            y: (Math.random() - 0.5) * amp
          })
          requestAnimationFrame(animate)
        }
      }
      requestAnimationFrame(animate)
    }

    window.addEventListener('radar-lightning-strike', triggerShake)
    return () => window.removeEventListener('radar-lightning-strike', triggerShake)
  }, [])

  // Sync threat simulator status with CRT scanline glitched views
  let signalState = progress.signalState
  if (activeView === 'monitor') {
    signalState = activeScenario === 'normal' ? 'MONITORING' : 'CORRUPTED'
  } else if (simulation) {
    signalState = simulation.signalState
  }

  const triggerSpoofAttack = (id: string) => {
    setSimulatedEntities((prev) =>
      prev.map((entity) => {
        if (entity.id !== id) return entity
        const offsetLat = 0.082
        const offsetLon = -0.065
        const actualLat = entity.latitude
        const actualLon = entity.longitude
        const spoofLat = actualLat + offsetLat
        const spoofLon = actualLon + offsetLon

        setEventLogs((prevLogs) => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: formatTime(new Date()),
            type: entity.type,
            identifier: entity.callsign,
            event: `⚠️ INJECTED TARGETED GPS SPOOF: reported path forced off-track.`,
            score: 28,
            status: 'SUSPICIOUS',
          },
          ...prevLogs,
        ])

        return {
          ...entity,
          isSpoofed: true,
          isPolicyFiltered: false,
          actualLat,
          actualLon,
          spoofLat,
          spoofLon,
          latitude: spoofLat,
          longitude: spoofLon,
          targetLat: spoofLat,
          targetLon: spoofLon,
          anomalies: ['Targeted GPS spoofing attack in progress', ...entity.anomalies],
          validation: {
            ...entity.validation,
            position: 12,
            trajectory: 8,
            velocity: 32,
            crossSource: 18,
          },
          trustScore: 28,
          trustStatus: 'SUSPICIOUS',
        }
      })
    )
  }

  const applyShieldPolicy = (id: string) => {
    setSimulatedEntities((prev) =>
      prev.map((entity) => {
        if (entity.id !== id) return entity
        if (!entity.isSpoofed) return entity

        const correctLat = entity.actualLat ?? entity.latitude
        const correctLon = entity.actualLon ?? entity.longitude

        setEventLogs((prevLogs) => [
          {
            id: `log-${Date.now()}-${Math.random()}`,
            timestamp: formatTime(new Date()),
            type: entity.type,
            identifier: entity.callsign,
            event: `🛡️ SHIELD POLICY DEPLOYED: isolated spoof transponders; reverted to inertial sensors.`,
            score: 95,
            status: 'VERIFIED',
          },
          ...prevLogs,
        ])

        return {
          ...entity,
          isPolicyFiltered: true,
          latitude: correctLat,
          longitude: correctLon,
          targetLat: correctLat,
          targetLon: correctLon,
          anomalies: entity.anomalies.filter((a) => a !== 'Targeted GPS spoofing attack in progress'),
          validation: {
            ...entity.validation,
            position: 96,
            trajectory: 95,
            velocity: 94,
            crossSource: 95,
          },
          trustScore: 95,
          trustStatus: 'VERIFIED',
        }
      })
    )
  }

  const extendedValue: ExtendedVoyageProgress = {
    ...progress,
    isSimulated: simulation !== null,
    simulation,
    setSimulation,
    vehicleType,
    setVehicleType,
    activeView,
    setActiveView,
    simulatedEntities,
    selectedEntityId,
    setSelectedEntityId,
    eventLogs,
    activeScenario,
    setScenario,
    anomalyViewEnabled,
    setAnomalyViewEnabled,
    triggerSpoofAttack,
    applyShieldPolicy,
    useLiveApi,
    setUseLiveApi,
    signalState,
  }

  return (
    <VoyageProgressProvider value={extendedValue}>
      <div 
        className={`app-view ${signalState === 'CORRUPTED' ? 'glitched-view' : ''}`}
        style={{ transform: `translate3d(${shakeOffset.x}px, ${shakeOffset.y}px, 0)`, minHeight: '100vh', display: 'flex', flexDirection: 'column' }}
      >
        <div style={{ display: activeView === 'story' ? 'block' : 'none' }}>
          <Voyage
            voyageRef={voyageRef}
            chrome={
              <>
                <ProgressRail />
                <Nav />
                <Footer />
              </>
            }
          />
          <TacticalConsole />
          <DemoDock />
        </div>

        <div style={{ display: activeView === 'monitor' ? 'flex' : 'none', flexDirection: 'column', flex: 1 }}>
          <Nav />
          <TrustMonitor />
        </div>
      </div>
      <SignalCursor />
      {signalState === 'CORRUPTED' && <div className="crt-glitch-overlay" aria-hidden="true" />}
    </VoyageProgressProvider>
  )
}





