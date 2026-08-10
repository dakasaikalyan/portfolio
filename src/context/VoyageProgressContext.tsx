import { createContext, useContext, type ReactNode } from 'react'
import type { VoyageProgress } from '../hooks/useScrollProgress'

const VoyageProgressContext = createContext<VoyageProgress | null>(null)

export function VoyageProgressProvider({
  value,
  children,
}: {
  value: VoyageProgress
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
