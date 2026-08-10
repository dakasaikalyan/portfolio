import { useEffect, useRef } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { useReducedMotion } from '../hooks/useInView'
import { STAGE_PALETTES } from '../lib/palettes'
import { lerp, lerpColor, rgb } from '../lib/voyageMath'
import styles from './SkyCanvas.module.css'

type Star = { x: number; y: number; s: number; tw: number; sp: number }
type Streak = { x: number; y: number; len: number; speed: number; a: number }

export default function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { progress, stage, localProgress, corruption, authGlow } = useVoyageProgress()
  const reduced = useReducedMotion()
  const stateRef = useRef({ progress, stage, localProgress, corruption, authGlow })

  useEffect(() => {
    stateRef.current = { progress, stage, localProgress, corruption, authGlow }
  }, [progress, stage, localProgress, corruption, authGlow])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let frame = 0
    let w = 0
    let h = 0

    const stars: Star[] = Array.from({ length: 110 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.58,
      s: 0.6 + Math.random() * 2.1,
      tw: Math.random() * Math.PI * 2,
      sp: 0.015 + Math.random() * 0.03,
    }))

    const streaks: Streak[] = Array.from({ length: 28 }, () => ({
      x: Math.random(),
      y: Math.random() * 0.7,
      len: 18 + Math.random() * 42,
      speed: 0.002 + Math.random() * 0.006,
      a: 0.15 + Math.random() * 0.45,
    }))

    const resize = () => {
      w = window.innerWidth
      h = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = w * dpr
      canvas.height = h * dpr
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      frame += 1
      const { progress: p, stage: st, localProgress: lp, corruption: c, authGlow: a } =
        stateRef.current
      const current = STAGE_PALETTES[st] ?? STAGE_PALETTES[0]
      const next = STAGE_PALETTES[Math.min(6, st + 1)] ?? current
      const mix = lp * 0.55

      const skyTop = lerpColor(current.skyTop, next.skyTop, mix)
      const skyBottom = lerpColor(current.skyBottom, next.skyBottom, mix)
      const sea = lerpColor(current.sea, next.sea, mix)

      const grad = ctx.createLinearGradient(0, 0, 0, h)
      grad.addColorStop(0, rgb(skyTop))
      grad.addColorStop(0.55, rgb(skyBottom))
      grad.addColorStop(1, rgb(sea))
      ctx.fillStyle = grad
      ctx.fillRect(0, 0, w, h)

      // Soft atmospheric bloom near horizon
      const bloom = ctx.createRadialGradient(w * 0.5, h * 0.58, 20, w * 0.5, h * 0.62, w * 0.55)
      const bloomColor =
        c > 0.2
          ? `rgba(255, 77, 87, ${0.08 + c * 0.18})`
          : a > 0.2
            ? `rgba(47, 217, 154, ${0.06 + a * 0.14})`
            : `rgba(62, 207, 228, ${0.08 + (1 - p) * 0.06})`
      bloom.addColorStop(0, bloomColor)
      bloom.addColorStop(1, 'rgba(0,0,0,0)')
      ctx.fillStyle = bloom
      ctx.fillRect(0, 0, w, h)

      // Distant orb
      const orbX = w * lerp(0.78, 0.62, p)
      const orbY = h * lerp(0.18, 0.28, Math.min(1, p * 1.4))
      const orbR = Math.min(w, h) * 0.045
      const orb = ctx.createRadialGradient(orbX - orbR * 0.3, orbY - orbR * 0.3, 1, orbX, orbY, orbR)
      orb.addColorStop(0, `rgba(238, 244, 249, ${0.85 - c * 0.4})`)
      orb.addColorStop(0.45, `rgba(62, 207, 228, ${0.35 + a * 0.25})`)
      orb.addColorStop(1, 'rgba(62, 207, 228, 0)')
      ctx.fillStyle = orb
      ctx.beginPath()
      ctx.arc(orbX, orbY, orbR * 2.2, 0, Math.PI * 2)
      ctx.fill()

      const starAlpha = Math.max(0, 1 - p / 0.22)
      if (starAlpha > 0.02) {
        stars.forEach((star) => {
          const twinkle = 0.45 + Math.sin(frame * star.sp + star.tw) * 0.55
          ctx.beginPath()
          ctx.fillStyle = `rgba(238, 244, 249, ${starAlpha * twinkle * 0.9})`
          ctx.arc(star.x * w, star.y * h, star.s * 0.55, 0, Math.PI * 2)
          ctx.fill()
        })
      }

      // Auth aurora bands
      if (a > 0.05 && !reduced) {
        for (let i = 0; i < 3; i += 1) {
          const y = h * (0.18 + i * 0.08)
          ctx.beginPath()
          for (let x = 0; x <= w; x += 8) {
            const yy =
              y +
              Math.sin(x * 0.004 + frame * 0.012 + i) * 18 +
              Math.sin(x * 0.01 + frame * 0.02 + i * 2) * 8
            if (x === 0) ctx.moveTo(x, yy)
            else ctx.lineTo(x, yy)
          }
          ctx.strokeStyle = `rgba(47, 217, 154, ${0.05 + a * 0.12})`
          ctx.lineWidth = 10 - i * 2
          ctx.stroke()
        }
      }

      // Interference streaks during corruption
      if (c > 0.05) {
        streaks.forEach((s) => {
          if (!reduced) s.y += s.speed * (0.6 + c)
          if (s.y > 1) {
            s.y = -0.05
            s.x = Math.random()
          }
          const x = s.x * w
          const y = s.y * h
          const g = ctx.createLinearGradient(x, y, x, y + s.len)
          g.addColorStop(0, `rgba(255, 77, 87, 0)`)
          g.addColorStop(0.5, `rgba(255, 77, 87, ${s.a * c})`)
          g.addColorStop(1, `rgba(255, 77, 87, 0)`)
          ctx.strokeStyle = g
          ctx.lineWidth = 1.2
          ctx.beginPath()
          ctx.moveTo(x, y)
          ctx.lineTo(x + 4, y + s.len)
          ctx.stroke()
        })
      }

      const seaY = h * 0.68
      const t = frame * (reduced ? 0.01 : 0.028) + p * 20

      ctx.beginPath()
      ctx.moveTo(0, h)
      ctx.lineTo(0, seaY)
      for (let x = 0; x <= w; x += 4) {
        const y =
          seaY +
          Math.sin(x * 0.012 + t) * (reduced ? 3 : 8) +
          Math.sin(x * 0.028 + t * 1.4) * (reduced ? 1.5 : 3.8)
        ctx.lineTo(x, y)
      }
      ctx.lineTo(w, h)
      ctx.closePath()
      const seaGrad = ctx.createLinearGradient(0, seaY - 20, 0, h)
      seaGrad.addColorStop(0, rgb(sea, 0.92))
      seaGrad.addColorStop(1, rgb([Math.max(0, sea[0] - 8), Math.max(0, sea[1] - 6), sea[2]], 1))
      ctx.fillStyle = seaGrad
      ctx.fill()

      const shimmerCount = reduced ? 2 : 6
      for (let i = 0; i < shimmerCount; i += 1) {
        ctx.beginPath()
        const base = seaY + 12 + i * 12
        for (let x = 0; x <= w; x += 5) {
          const y =
            base +
            Math.sin(x * 0.018 + t * 1.2 + i) * (reduced ? 1.2 : 3.4) +
            Math.sin(x * 0.04 + t + i * 0.7) * 1.5
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        const tone =
          a > 0.3
            ? `rgba(47, 217, 154, ${0.07 + i * 0.02})`
            : c > 0.3
              ? `rgba(255, 77, 87, ${0.06 + i * 0.02})`
              : `rgba(62, 207, 228, ${0.08 + i * 0.022})`
        ctx.strokeStyle = tone
        ctx.lineWidth = 1.15
        ctx.stroke()
      }

      // Vignette for cinematic depth
      const vig = ctx.createRadialGradient(w * 0.5, h * 0.45, h * 0.2, w * 0.5, h * 0.5, h * 0.85)
      vig.addColorStop(0, 'rgba(0,0,0,0)')
      vig.addColorStop(1, 'rgba(4, 9, 20, 0.45)')
      ctx.fillStyle = vig
      ctx.fillRect(0, 0, w, h)

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [reduced])

  return <canvas className={styles.canvas} ref={canvasRef} aria-hidden="true" />
}
