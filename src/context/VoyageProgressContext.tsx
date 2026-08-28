import { createContext, useContext, type ReactNode } from 'react'
import type { VoyageProgress } from '../hooks/useScrollProgress'
import type { SignalState } from '../lib/voyageMath'

export type SimulationState = {
  corruption: number
  authGlow: number
  signalState: SignalState
} | null

export type TrustStatus = 'VERIFIED' | 'TRUSTED' | 'WARNING' | 'SUSPICIOUS' | 'REJECTED'

export type TrackedEntity = {
  id: string
  type: 'aircraft' | 'vessel'
  callsign: string
  identifier: string
  model: string
  latitude: number
  longitude: number
  targetLat: number
  targetLon: number
  heading: number
  altitude: number
  speed: number
  timestamp: number
  sources: string[]
  validation: {
    identity: number
    position: number
    velocity: number
    timestamp: number
    crossSource: number
    trajectory: number
  }
  anomalies: string[]
  trustScore: number
  trustStatus: TrustStatus
  history: { time: string; event: string; status: TrustStatus }[]
  isSpoofed?: boolean
  spoofLat?: number
  spoofLon?: number
  actualLat?: number
  actualLon?: number
  isPolicyFiltered?: boolean
}

export type SignalEventLog = {
  id: string
  timestamp: string
  type: 'aircraft' | 'vessel'
  identifier: string
  event: string
  score: number
  status: TrustStatus
}

export type SimulationScenario = 'normal' | 'drift' | 'drop' | 'jump' | 'conflict' | 'velocity' | 'timestamp'

export type ExtendedVoyageProgress = VoyageProgress & {
  isSimulated: boolean
  simulation: SimulationState
  setSimulation: (sim: SimulationState) => void
  vehicleType: 'ship' | 'plane'
  setVehicleType: (type: 'ship' | 'plane') => void
  activeView: 'story' | 'monitor'
  setActiveView: (view: 'story' | 'monitor') => void
  simulatedEntities: TrackedEntity[]
  selectedEntityId: string | null
  setSelectedEntityId: (id: string | null) => void
  eventLogs: SignalEventLog[]
  activeScenario: SimulationScenario
  setScenario: (scen: SimulationScenario) => void
  anomalyViewEnabled: boolean
  setAnomalyViewEnabled: (enabled: boolean) => void
  triggerSpoofAttack: (id: string) => void
  applyShieldPolicy: (id: string) => void
  useLiveApi: boolean
  setUseLiveApi: (enabled: boolean) => void
}

const VoyageProgressContext = createContext<ExtendedVoyageProgress | null>(null)

export function VoyageProgressProvider({
  value,
  children,
}: {
  value: ExtendedVoyageProgress
  children: ReactNode
}) {
  return (
    <VoyageProgressContext.Provider value={value}>{children}</VoyageProgressContext.Provider>
  )
}

export function useVoyageProgress() {
  const ctx = useContext(VoyageProgressContext)
  if (!ctx) throw new Error('useVoyageProgress must be used within VoyageProgressProvider')
  return ctx
}

