import { useEffect, useRef } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { useReducedMotion } from '../hooks/useInView'
import styles from './AuthSeal.module.css'

export default function AuthSeal() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { authGlow, corruption } = useVoyageProgress()
  const reduced = useReducedMotion()
  const stateRef = useRef({ authGlow, corruption })

  useEffect(() => {
    stateRef.current = { authGlow, corruption }
  }, [authGlow, corruption])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let frame = 0
    const size = 220
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = size * dpr
    canvas.height = size * dpr
    canvas.style.width = `${size}px`
    canvas.style.height = `${size}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const draw = () => {
      frame += 1
      const { authGlow: a, corruption: c } = stateRef.current
      ctx.clearRect(0, 0, size, size)

      const cx = size / 2
      const cy = size / 2
      const spin = reduced ? 0 : frame * 0.012
      const intensity = Math.max(0.35, a)

      for (let i = 0; i < 4; i += 1) {
        const r = 34 + i * 22
        ctx.beginPath()
        ctx.arc(cx, cy, r, spin + i, spin + i + Math.PI * (1.2 + i * 0.15))
        ctx.strokeStyle =
          c > 0.3
            ? `rgba(255, 77, 87, ${0.2 + intensity * 0.25})`
            : `rgba(47, 217, 154, ${0.18 + intensity * 0.28 - i * 0.03})`
        ctx.lineWidth = 1.4
        ctx.stroke()
      }

      // Sweep wedge
      ctx.save()
      ctx.translate(cx, cy)
      ctx.rotate(spin * 1.6)
      const wedge = ctx.createRadialGradient(0, 0, 8, 0, 0, 96)
      wedge.addColorStop(0, `rgba(47, 217, 154, ${0.28 * intensity})`)
      wedge.addColorStop(1, 'rgba(47, 217, 154, 0)')
      ctx.fillStyle = wedge
      ctx.beginPath()
      ctx.moveTo(0, 0)
      ctx.arc(0, 0, 96, -0.35, 0.55)
      ctx.closePath()
      ctx.fill()
      ctx.restore()

      // Tick marks
      for (let i = 0; i < 24; i += 1) {
        const ang = (i / 24) * Math.PI * 2 + spin * 0.25
        const inner = 88
        const outer = i % 3 === 0 ? 98 : 93
        ctx.beginPath()
        ctx.moveTo(cx + Math.cos(ang) * inner, cy + Math.sin(ang) * inner)
        ctx.lineTo(cx + Math.cos(ang) * outer, cy + Math.sin(ang) * outer)
        ctx.strokeStyle = `rgba(62, 207, 228, ${0.25 + intensity * 0.35})`
        ctx.lineWidth = 1
        ctx.stroke()
      }

      ctx.beginPath()
      ctx.arc(cx, cy, 10, 0, Math.PI * 2)
      ctx.fillStyle = `rgba(47, 217, 154, ${0.55 + intensity * 0.4})`
      ctx.fill()

      ctx.beginPath()
      ctx.arc(cx, cy, 22, 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(238, 244, 249, ${0.35 + intensity * 0.3})`
      ctx.lineWidth = 1.2
      ctx.stroke()

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [reduced])

  return (
    <div className={styles.wrap} aria-hidden="true">
      <canvas ref={canvasRef} className={styles.canvas} />
      <span className={styles.label}>AUTH LAYER</span>
    </div>
  )
}
