import { useEffect, useState, type RefObject } from 'react'
import {
  clamp,
  deriveSignalMetrics,
  mapProgress,
  type IntroPhase,
  type SignalState,
} from '../lib/voyageMath'

export type VoyageProgress = {
  progress: number
  stage: number
  localProgress: number
  corruption: number
  authGlow: number
  signalState: SignalState
  phase: IntroPhase
  introComplete: boolean
  journeyProgress: number
  introT: number
}

const INITIAL: VoyageProgress = {
  progress: 0,
  stage: 0,
  localProgress: 0,
  corruption: 0,
  authGlow: 0,
  signalState: 'MONITORING',
  phase: 'sky',
  introComplete: false,
  journeyProgress: 0,
  introT: 0,
}

export function useScrollProgress(voyageRef: RefObject<HTMLElement | null>): VoyageProgress {
  const [state, setState] = useState<VoyageProgress>(INITIAL)

  useEffect(() => {
    const el = voyageRef.current
    if (!el) return

    let raf = 0

    const update = () => {
      const total = Math.max(1, el.offsetHeight - window.innerHeight)
      const scrolled = clamp(-el.getBoundingClientRect().top, 0, total)
      const progress = scrolled / total
      const mapped = mapProgress(progress)
      const metrics = deriveSignalMetrics(mapped.progress, mapped.stage, mapped.localProgress)
      setState({ ...mapped, ...metrics })
      raf = 0
    }

    const onScroll = () => {
      if (raf) return
      raf = requestAnimationFrame(update)
    }

    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (raf) cancelAnimationFrame(raf)
    }
  }, [voyageRef])

  return state
}
