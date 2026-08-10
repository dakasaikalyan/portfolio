export const INTRO_END = 0.375

/**
 * Stage 0 = pinned brand intro (matches tall hero spacer ~300/800 scroll).
 * Stage 1+ = ship journey / narrative beats — starts immediately after intro fade.
 */
export const STAGE_BOUNDS = [0, INTRO_END, 0.48, 0.58, 0.68, 0.79, 0.9, 1] as const

export const STAGE_LABELS = [
  'ORIGIN',
  'THE CHANNEL',
  'THE ATTACK',
  'DECEPTION',
  'INTERCEPT',
  'PROTECTED',
  'BEYOND DECEPTION',
] as const

export type SignalState = 'MONITORING' | 'CORRUPTED' | 'AUTHENTICATED'
export type IntroPhase = 'sky' | 'brand' | 'tagline' | 'lead' | 'ready'

export function clamp(value: number, min = 0, max = 1) {
  return Math.min(max, Math.max(min, value))
}

export function lerp(a: number, b: number, t: number) {
  return a + (b - a) * t
}

export function lerpColor(a: [number, number, number], b: [number, number, number], t: number) {
  return [
    Math.round(lerp(a[0], b[0], t)),
    Math.round(lerp(a[1], b[1], t)),
    Math.round(lerp(a[2], b[2], t)),
  ] as [number, number, number]
}

export function rgb([r, g, b]: [number, number, number], alpha = 1) {
  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function deriveIntro(progress: number) {
  const p = clamp(progress)
  const introComplete = p >= INTRO_END
  const journeyProgress = introComplete ? clamp((p - INTRO_END) / (1 - INTRO_END)) : 0
  const t = clamp(p / INTRO_END)

  // Short ready window (~last 8%) — fade then Channel/ship with little empty gap
  let phase: IntroPhase = 'sky'
  if (t >= 0.92) phase = 'ready'
  else if (t >= 0.7) phase = 'lead'
  else if (t >= 0.46) phase = 'tagline'
  else if (t >= 0.08) phase = 'brand'

  return { phase, introComplete, journeyProgress, introT: t }
}

export function mapProgress(progress: number) {
  const p = clamp(progress)
  let stage = 0
  for (let i = 0; i < STAGE_BOUNDS.length - 1; i += 1) {
    if (p >= STAGE_BOUNDS[i] && p < STAGE_BOUNDS[i + 1]) {
      stage = i
      break
    }
    if (p >= 1) stage = 6
  }

  const start = STAGE_BOUNDS[stage]
  const end = STAGE_BOUNDS[stage + 1]
  const localProgress = end === start ? 1 : clamp((p - start) / (end - start))
  const intro = deriveIntro(p)

  return { progress: p, stage, localProgress, ...intro }
}

/** Shared visual state derived from scroll progress */
export function deriveSignalMetrics(_progress: number, stage: number, localProgress: number) {
  let corruption = 0
  let authGlow = 0

  if (stage === 2) corruption = localProgress
  else if (stage === 3) corruption = 1
  else if (stage === 4) {
    corruption = 1 - localProgress
    authGlow = localProgress
  } else if (stage >= 5) {
    corruption = 0
    authGlow = 1
  }

  let signalState: SignalState = 'MONITORING'
  if (corruption > 0.15) signalState = 'CORRUPTED'
  else if (authGlow > 0.4) signalState = 'AUTHENTICATED'

  return { corruption, authGlow, signalState }
}
