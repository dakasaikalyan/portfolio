import type { TrackedEntity, SimulationScenario, TrustStatus, SignalEventLog } from '../context/VoyageProgressContext'

// Helper to format timestamps for histories
export function formatTime(date: Date): string {
  const h = String(date.getHours()).padStart(2, '0')
  const m = String(date.getMinutes()).padStart(2, '0')
  const s = String(date.getSeconds()).padStart(2, '0')
  return `${h}:${m}:${s}`
}

// Generate base entities
export const createInitialEntities = (): TrackedEntity[] => [
  {
    id: 'air-1',
    type: 'aircraft',
    callsign: 'AIC402',
    identifier: 'AIC402',
    model: 'B777-300ER',
    latitude: 35.120,
    longitude: 139.420,
    targetLat: 35.120,
    targetLon: 139.420,
    heading: 85.4,
    altitude: 35000,
    speed: 485,
    timestamp: Date.now(),
    sources: ['ADS-B', 'GNSS', 'Ground Station'],
    validation: { identity: 98, position: 96, velocity: 95, timestamp: 100, crossSource: 96, trajectory: 98 },
    anomalies: [],
    trustScore: 97,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 30000)), event: 'ADS-B validation handshake verified', status: 'VERIFIED' },
      { time: formatTime(new Date(Date.now() - 15000)), event: 'GNSS positioning verification locked', status: 'VERIFIED' }
    ]
  },
  {
    id: 'air-2',
    type: 'aircraft',
    callsign: 'BAW119',
    identifier: 'BAW119',
    model: 'A350-1000',
    latitude: 35.340,
    longitude: 139.280,
    targetLat: 35.340,
    targetLon: 139.280,
    heading: 260.5,
    altitude: 31000,
    speed: 462,
    timestamp: Date.now(),
    sources: ['ADS-B', 'GNSS'],
    validation: { identity: 95, position: 94, velocity: 92, timestamp: 98, crossSource: 91, trajectory: 94 },
    anomalies: [],
    trustScore: 93,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 40000)), event: 'Cruising flight level established', status: 'TRUSTED' },
      { time: formatTime(new Date(Date.now() - 10000)), event: 'ADS-B identity verified', status: 'VERIFIED' }
    ]
  },
  {
    id: 'air-3',
    type: 'aircraft',
    callsign: 'DLH452',
    identifier: 'DLH452',
    model: 'B747-8',
    latitude: 35.020,
    longitude: 139.550,
    targetLat: 35.020,
    targetLon: 139.550,
    heading: 140.2,
    altitude: 27500,
    speed: 470,
    timestamp: Date.now(),
    sources: ['ADS-B', 'GNSS', 'Ground Station'],
    validation: { identity: 96, position: 95, velocity: 95, timestamp: 99, crossSource: 95, trajectory: 96 },
    anomalies: [],
    trustScore: 95,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 20000)), event: 'Inbound signal stream connected', status: 'TRUSTED' }
    ]
  },
  {
    id: 'air-4',
    type: 'aircraft',
    callsign: 'QTR801',
    identifier: 'QTR801',
    model: 'A380-800',
    latitude: 35.480,
    longitude: 139.680,
    targetLat: 35.480,
    targetLon: 139.680,
    heading: 42.8,
    altitude: 18000,
    speed: 380,
    timestamp: Date.now(),
    sources: ['ADS-B', 'GNSS'],
    validation: { identity: 94, position: 91, velocity: 93, timestamp: 96, crossSource: 90, trajectory: 92 },
    anomalies: [],
    trustScore: 92,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 12000)), event: 'Initial ADS-B telemetry stream verified', status: 'VERIFIED' }
    ]
  },
  {
    id: 'ship-1',
    type: 'vessel',
    callsign: 'OCEANIC MAJESTY',
    identifier: 'IMO 2441020',
    model: 'Container Carrier',
    latitude: 35.180,
    longitude: 139.750,
    targetLat: 35.180,
    targetLon: 139.750,
    heading: 182.4,
    altitude: 0,
    speed: 18.4,
    timestamp: Date.now(),
    sources: ['AIS', 'GNSS'],
    validation: { identity: 95, position: 94, velocity: 95, timestamp: 96, crossSource: 92, trajectory: 94 },
    anomalies: [],
    trustScore: 94,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 60000)), event: 'AIS transponder signal active', status: 'TRUSTED' },
      { time: formatTime(new Date(Date.now() - 30000)), event: 'Marine collision safety protocol linked', status: 'VERIFIED' }
    ]
  },
  {
    id: 'ship-2',
    type: 'vessel',
    callsign: 'PACIFIC EXPLORER',
    identifier: 'IMO 3671040',
    model: 'LNG Tanker',
    latitude: 35.080,
    longitude: 139.880,
    targetLat: 35.080,
    targetLon: 139.880,
    heading: 295.1,
    altitude: 0,
    speed: 16.2,
    timestamp: Date.now(),
    sources: ['AIS', 'GNSS', 'Ground Station'],
    validation: { identity: 96, position: 95, velocity: 94, timestamp: 98, crossSource: 95, trajectory: 96 },
    anomalies: [],
    trustScore: 95,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 45000)), event: 'MMSI registration correlation verified', status: 'VERIFIED' }
    ]
  },
  {
    id: 'ship-3',
    type: 'vessel',
    callsign: 'SEAWIND SPIRIT',
    identifier: 'IMO 4132040',
    model: 'Bulk Carrier',
    latitude: 34.950,
    longitude: 139.480,
    targetLat: 34.950,
    targetLon: 139.480,
    heading: 15.6,
    altitude: 0,
    speed: 12.8,
    timestamp: Date.now(),
    sources: ['AIS', 'GNSS'],
    validation: { identity: 92, position: 91, velocity: 90, timestamp: 94, crossSource: 89, trajectory: 91 },
    anomalies: [],
    trustScore: 91,
    trustStatus: 'VERIFIED',
    history: [
      { time: formatTime(new Date(Date.now() - 15000)), event: 'Signal normalized via Tokyo Bay receiver port', status: 'TRUSTED' }
    ]
  }
]

// Determine trust status based on score
export function getTrustStatus(score: number): TrustStatus {
  if (score >= 90) return 'VERIFIED'
  if (score >= 70) return 'TRUSTED'
  if (score >= 40) return 'WARNING'
  if (score >= 1) return 'SUSPICIOUS'
  return 'REJECTED'
}

// Tick simulation to process drifts, anomalies, and logs
export function processSimulationTick(
  entities: TrackedEntity[],
  scenario: SimulationScenario,
  onLogGenerated: (type: 'aircraft' | 'vessel', identifier: string, event: string, score: number, status: TrustStatus) => void
): TrackedEntity[] {
  return entities.map((entity) => {
    let lat = entity.latitude
    let lon = entity.longitude
    let targetLat = entity.targetLat
    let targetLon = entity.targetLon
    let heading = entity.heading
    let altitude = entity.altitude
    let speed = entity.speed
    let anomalies = [...entity.anomalies]
    let validation = { ...entity.validation }
    let timestamp = Date.now()
    let history = [...entity.history]

    // Check targeted spoof parameters
    if (entity.isSpoofed) {
      const speedFactor = entity.type === 'aircraft' ? 0.0006 : 0.00004
      const headingRad = (heading * Math.PI) / 180
      const latDelta = Math.cos(headingRad) * speedFactor
      const lonDelta = Math.sin(headingRad) * speedFactor

      const actualLat = (entity.actualLat ?? entity.latitude) + latDelta
      const actualLon = (entity.actualLon ?? entity.longitude) + lonDelta

      // The false spoof coordinates keep drifting or jumping
      const spoofLat = (entity.spoofLat ?? entity.latitude) + latDelta + (Math.random() - 0.5) * 0.0008
      const spoofLon = (entity.spoofLon ?? entity.longitude) + lonDelta + (Math.random() - 0.5) * 0.0008

      if (entity.isPolicyFiltered) {
        lat += (actualLat - lat) * 0.12
        lon += (actualLon - lon) * 0.12
        targetLat = actualLat
        targetLon = actualLon
      } else {
        lat += (spoofLat - lat) * 0.12
        lon += (spoofLon - lon) * 0.12
        targetLat = spoofLat
        targetLon = spoofLon
      }

      return {
        ...entity,
        latitude: lat,
        longitude: lon,
        targetLat,
        targetLon,
        actualLat,
        actualLon,
        spoofLat,
        spoofLon,
        timestamp,
        trustScore: entity.isPolicyFiltered ? 95 : 28,
        trustStatus: entity.isPolicyFiltered ? 'VERIFIED' : 'SUSPICIOUS'
      }
    }

    // 1. Move/Crawl elements along heading
    const speedFactor = entity.type === 'aircraft' ? 0.0006 : 0.00004
    const headingRad = (heading * Math.PI) / 180
    const latDelta = Math.cos(headingRad) * speedFactor
    const lonDelta = Math.sin(headingRad) * speedFactor

    targetLat += latDelta
    targetLon += lonDelta

    // 2. Apply scenario-specific drifts/glitches
    if (scenario === 'drift' && (entity.id === 'air-1' || entity.id === 'ship-1')) {
      // Accumulate drift offset on the target position (raw transponder claims coordinate shifts)
      targetLat += (Math.random() - 0.2) * 0.005
      targetLon += (Math.random() - 0.2) * 0.005
      
      // Reduce validation scores
      validation.position = Math.max(12, validation.position - 12)
      validation.trajectory = Math.max(15, validation.trajectory - 10)
      validation.crossSource = Math.max(18, validation.crossSource - 14)
      
      if (!anomalies.includes('GNSS drift offset detected')) {
        anomalies.push('GNSS drift offset detected')
        history.unshift({ time: formatTime(new Date()), event: 'Alert: GNSS residuals drifting from inertial timeline', status: 'WARNING' })
        onLogGenerated(entity.type, entity.callsign, 'Signal residuals drift anomaly detected', 64, 'WARNING')
      }
    } 
    
    else if (scenario === 'drop' && entity.id === 'air-2') {
      // transponder stops sending data
      timestamp = entity.timestamp // Freeze update time
      validation.timestamp = Math.max(5, validation.timestamp - 20)
      validation.crossSource = Math.max(0, validation.crossSource - 18)

      if (Date.now() - timestamp > 8000 && !anomalies.includes('Transponder stream stale')) {
        anomalies.push('Transponder stream stale')
        history.unshift({ time: formatTime(new Date()), event: 'Alert: Telemetry age limits exceeded', status: 'SUSPICIOUS' })
        onLogGenerated(entity.type, entity.callsign, 'Telemetry drop: Transponder stream stale', 32, 'SUSPICIOUS')
      }
    }

    else if (scenario === 'jump' && entity.id === 'air-3') {
      // Jump position coordinates suddenly
      if (!anomalies.includes('Impossible position discontinuity')) {
        targetLat += 0.09
        targetLon -= 0.08
        validation.position = 8
        validation.trajectory = 10
        validation.velocity = 15
        anomalies.push('Impossible position discontinuity')
        history.unshift({ time: formatTime(new Date()), event: 'Alert: Delta coordinates exceed physical speed boundaries (+98km/s)', status: 'SUSPICIOUS' })
        onLogGenerated(entity.type, entity.callsign, 'Impossible trajectory jump detected', 22, 'SUSPICIOUS')
      }
    }

    else if (scenario === 'conflict' && entity.id === 'air-1') {
      // Identity conflict logic
      validation.identity = 12
      validation.crossSource = 20
      if (!anomalies.includes('Duplicate identity broadcast')) {
        anomalies.push('Duplicate identity broadcast')
        history.unshift({ time: formatTime(new Date()), event: 'Alert: Secondary conflicting transponder detected on callsign AIC402', status: 'SUSPICIOUS' })
        onLogGenerated(entity.type, entity.callsign, 'Identity conflict: Duplicate transponder logs', 31, 'SUSPICIOUS')
      }
    }

    else if (scenario === 'velocity' && (entity.id === 'air-4' || entity.id === 'ship-3')) {
      if (!anomalies.includes('Cruising velocity envelope violation')) {
        speed = entity.type === 'aircraft' ? 1420 : 75
        validation.velocity = 6
        validation.trajectory = 22
        anomalies.push('Cruising velocity envelope violation')
        history.unshift({ time: formatTime(new Date()), event: `Alert: Velocity reading (${speed} KT) exceeds vehicle parameters`, status: 'SUSPICIOUS' })
        onLogGenerated(entity.type, entity.callsign, 'Cruising velocity envelope violation', 28, 'SUSPICIOUS')
      }
    }

    else if (scenario === 'timestamp' && entity.id === 'ship-2') {
      validation.timestamp = 45
      if (!anomalies.includes('Desynchronized timestamp sequence')) {
        anomalies.push('Desynchronized timestamp sequence')
        history.unshift({ time: formatTime(new Date()), event: 'Alert: Sequence frame header mismatch', status: 'WARNING' })
        onLogGenerated(entity.type, entity.callsign, 'Desynchronized signal headers detected', 74, 'WARNING')
      }
    }

    else if (scenario === 'normal') {
      // Revert anomalies slowly
      if (anomalies.length > 0) {
        anomalies = []
        validation = { identity: 95, position: 94, velocity: 94, timestamp: 98, crossSource: 94, trajectory: 95 }
        history.unshift({ time: formatTime(new Date()), event: 'Signal state normalized', status: 'VERIFIED' })
        onLogGenerated(entity.type, entity.callsign, 'Signal state normalized. Verification locked.', 95, 'VERIFIED')
      }
    }

    // Interpolate positions smoothly toward targets
    const lerpRate = scenario === 'drop' && entity.id === 'air-2' ? 0 : 0.12
    lat += (targetLat - lat) * lerpRate
    lon += (targetLon - lon) * lerpRate

    // Calculate dynamic trust score
    const scoreSum = validation.identity + validation.position + validation.velocity + validation.timestamp + validation.crossSource + validation.trajectory
    const trustScore = Math.round(scoreSum / 6)
    const trustStatus = getTrustStatus(trustScore)

    return {
      ...entity,
      latitude: lat,
      longitude: lon,
      targetLat,
      targetLon,
      heading,
      altitude,
      speed,
      timestamp,
      validation,
      anomalies,
      trustScore,
      trustStatus,
      history
    }
  })
}

// Generate sample log array on load
export const createInitialLogs = (): SignalEventLog[] => [
  {
    id: 'log-1',
    timestamp: formatTime(new Date(Date.now() - 45000)),
    type: 'aircraft',
    identifier: 'AIC402',
    event: 'Multi-source handshake success',
    score: 97,
    status: 'VERIFIED'
  },
  {
    id: 'log-2',
    timestamp: formatTime(new Date(Date.now() - 35000)),
    type: 'vessel',
    identifier: 'IMO 2441020',
    event: 'Port verification channel lock',
    score: 94,
    status: 'VERIFIED'
  },
  {
    id: 'log-3',
    timestamp: formatTime(new Date(Date.now() - 25000)),
    type: 'aircraft',
    identifier: 'BAW119',
    event: 'FMS trajectory alignment check pass',
    score: 93,
    status: 'VERIFIED'
  }
]
