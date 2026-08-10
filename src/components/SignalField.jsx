import { useEffect, useRef } from 'react'
import { useReducedMotion } from '../hooks/useMotion'

export default function SignalField({ progress = 0, chapter = 0 }) {
  const canvasRef = useRef(null)
  const reduced = useReducedMotion()
  const stateRef = useRef({ progress, chapter })

  useEffect(() => {
    stateRef.current = { progress, chapter }
  }, [progress, chapter])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    let frame = 0
    let raf = 0
    let width = 0
    let height = 0
    const pointer = { x: 0.7, y: 0.4, tx: 0.7, ty: 0.4 }

    const satellites = Array.from({ length: 26 }, (_, i) => ({
      angle: (i / 26) * Math.PI * 2,
      radius: 0.16 + (i % 7) * 0.055,
      speed: 0.00025 + (i % 5) * 0.00012,
      size: 1.1 + (i % 3) * 0.5,
      spoof: i % 6 === 0,
    }))

    const resize = () => {
      width = window.innerWidth
      height = window.innerHeight
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const onPointer = (event) => {
      pointer.tx = event.clientX / Math.max(width, 1)
      pointer.ty = event.clientY / Math.max(height, 1)
    }

    const draw = () => {
      frame += 1
      const { progress: gp, chapter: ch } = stateRef.current
      pointer.x += (pointer.tx - pointer.x) * 0.05
      pointer.y += (pointer.ty - pointer.y) * 0.05

      ctx.clearRect(0, 0, width, height)

      const cx = width * (0.62 + (pointer.x - 0.5) * 0.1 + Math.sin(gp * Math.PI) * 0.05)
      const cy = height * (0.4 + (pointer.y - 0.5) * 0.08 - gp * 0.05)
      const scale = Math.min(width, height)
      const energy = 0.35 + gp * 0.65
      const spoofBias = ch >= 1 && ch <= 3 ? 1 : ch >= 4 ? 0.35 : 0.15

      const pulse = 0.5 + Math.sin(frame * 0.03) * 0.5
      ctx.beginPath()
      ctx.arc(cx, cy, (24 + pulse * 22) * (0.8 + energy * 0.4), 0, Math.PI * 2)
      ctx.strokeStyle = `rgba(124, 255, 178, ${0.06 + pulse * 0.1 * energy})`
      ctx.lineWidth = 1.5
      ctx.stroke()

      for (let r = 60; r < 480; r += 52) {
        ctx.beginPath()
        ctx.arc(cx, cy, r + Math.sin(frame * 0.012 + r + gp * 4) * 6, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(124, 255, 178, ${0.03 + energy * 0.03})`
        ctx.stroke()
      }

      satellites.forEach((sat, index) => {
        const speed = sat.speed * (reduced ? 0.35 : 1) * (1 + gp * 0.8)
        const a = sat.angle + frame * speed
        const x = cx + Math.cos(a) * sat.radius * scale * (0.9 + energy * 0.25)
        const y = cy + Math.sin(a) * sat.radius * scale * 0.55
        const spoof = sat.spoof && (index / satellites.length < spoofBias || ch === 1)

        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.lineTo(x, y)
        ctx.strokeStyle = spoof
          ? `rgba(255, 176, 92, ${0.05 + energy * 0.06})`
          : `rgba(124, 255, 178, ${0.04 + energy * 0.04})`
        ctx.stroke()

        ctx.beginPath()
        ctx.arc(x, y, sat.size * (0.9 + energy * 0.3), 0, Math.PI * 2)
        ctx.fillStyle = spoof ? 'rgba(255, 176, 92, 0.92)' : 'rgba(232, 255, 239, 0.88)'
        ctx.fill()
      })

      const waveY = height * (0.72 - gp * 0.08)
      const drawWave = (amp1, amp2, phase, color, lineW) => {
        ctx.beginPath()
        for (let x = 0; x < width; x += 3) {
          const y =
            waveY +
            Math.sin(x * 0.012 + frame * 0.04 + phase + gp * 2) * amp1 * energy +
            Math.sin(x * 0.004 + frame * 0.02 + phase) * amp2 * energy
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = lineW
        ctx.stroke()
      }

      drawWave(18, 28, 0, `rgba(124, 255, 178, ${0.12 + energy * 0.12})`, 1.6)
      drawWave(12, 18, 1.4, `rgba(255, 176, 92, ${0.08 + spoofBias * 0.12})`, 1.25)

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', onPointer, { passive: true })

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', onPointer)
    }
  }, [reduced])

  return <canvas className="signal-field" ref={canvasRef} aria-hidden="true" />
}
