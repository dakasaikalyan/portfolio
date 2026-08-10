import { useEffect, useRef } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { useReducedMotion } from '../hooks/useInView'
import { lerp } from '../lib/voyageMath'
import styles from './WaveCanvas.module.css'

function mixHex(a: string, b: string, t: number) {
  const pa = a.replace('#', '')
  const pb = b.replace('#', '')
  const ar = parseInt(pa.slice(0, 2), 16)
  const ag = parseInt(pa.slice(2, 4), 16)
  const ab = parseInt(pa.slice(4, 6), 16)
  const br = parseInt(pb.slice(0, 2), 16)
  const bg = parseInt(pb.slice(2, 4), 16)
  const bb = parseInt(pb.slice(4, 6), 16)
  const r = Math.round(lerp(ar, br, t))
  const g = Math.round(lerp(ag, bg, t))
  const bl = Math.round(lerp(ab, bb, t))
  return `rgb(${r}, ${g}, ${bl})`
}

type Packet = { t: number; lane: number; spoof: boolean }

export default function WaveCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { progress, stage, localProgress, corruption, authGlow, introComplete } = useVoyageProgress()
  const reduced = useReducedMotion()
  const stateRef = useRef({ progress, stage, localProgress, corruption, authGlow, introComplete })

  useEffect(() => {
    stateRef.current = { progress, stage, localProgress, corruption, authGlow, introComplete }
  }, [progress, stage, localProgress, corruption, authGlow, introComplete])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let frame = 0
    let w = 0
    let h = 0
    const packets: Packet[] = Array.from({ length: 18 }, (_, i) => ({
      t: Math.random(),
      lane: i % 3,
      spoof: i % 4 === 0,
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

    const waveY = (x: number, baseline: number, amp: number, phase: number, p: number, noise: number) => {
      let y = baseline + Math.sin(x * 0.015 + p * 30 + phase) * amp
      if (noise > 0) {
        const jitterScale = reduced ? 0.2 : 1
        y +=
          Math.sin(x * 0.07 + p * 55 + phase * 2) * amp * 0.45 * noise +
          Math.sin(x * 0.12 + frame * 0.08 + phase) * amp * 0.2 * noise * jitterScale
      }
      return y
    }

    const drawWave = (
      baseline: number,
      amp: number,
      phase: number,
      color: string,
      width: number,
      noise: number,
      glow = false,
    ) => {
      const { progress: p } = stateRef.current
      if (glow) {
        ctx.save()
        ctx.shadowColor = color
        ctx.shadowBlur = 14
      }
      ctx.beginPath()
      for (let x = 0; x <= w; x += 3) {
        const y = waveY(x, baseline, amp, phase, p, noise)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.strokeStyle = color
      ctx.lineWidth = width
      ctx.stroke()
      if (glow) ctx.restore()
    }

    const draw = () => {
      frame += 1
      const {
        progress: p,
        stage: st,
        localProgress: lp,
        corruption: c,
        authGlow: a,
        introComplete: journey,
      } = stateRef.current
      ctx.clearRect(0, 0, w, h)

      const baseline = h * 0.46
      const mainColor = mixHex('#3ECFE4', '#2FD99A', a)
      const amp = journey ? 14 + a * 2 : 7
      const waveAlpha = journey ? 1 : 0.28

      // Satellite-style RF rings drifting down — only after intro
      if (!reduced && journey) {
        for (let i = 0; i < 4; i += 1) {
          const life = (frame * 0.008 + i * 0.25) % 1
          const cx = w * (0.18 + i * 0.2)
          const cy = h * (0.12 + life * 0.28)
          const r = 12 + life * 70
          ctx.beginPath()
          ctx.arc(cx, cy, r, 0, Math.PI * 2)
          const ringTone =
            c > 0.25 && i % 2 === 0
              ? `rgba(255, 77, 87, ${(1 - life) * 0.28})`
              : `rgba(62, 207, 228, ${(1 - life) * (0.22 + a * 0.15)})`
          ctx.strokeStyle = ringTone
          ctx.lineWidth = 1.2
          ctx.stroke()
        }
      }

      if (journey && c > 0.02) {
        drawWave(
          baseline + 12,
          amp * 0.95,
          1.4,
          `rgba(255, 77, 87, ${0.3 + c * 0.55})`,
          2.1,
          c,
          true,
        )
      }

      drawWave(
        baseline,
        amp,
        0,
        journey ? mainColor : `rgba(62, 207, 228, ${0.22})`,
        journey ? 2.4 : 1.4,
        journey ? c * 0.85 : 0,
        journey,
      )

      // Soft fill under main wave
      ctx.beginPath()
      for (let x = 0; x <= w; x += 4) {
        const y = waveY(x, baseline, amp, 0, p, journey ? c * 0.85 : 0)
        if (x === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.lineTo(w, baseline + 80)
      ctx.lineTo(0, baseline + 80)
      ctx.closePath()
      const fill = ctx.createLinearGradient(0, baseline - 20, 0, baseline + 80)
      fill.addColorStop(0, `rgba(62, 207, 228, ${(0.08 + a * 0.1) * waveAlpha})`)
      fill.addColorStop(1, 'rgba(62, 207, 228, 0)')
      ctx.fillStyle = fill
      ctx.fill()

      if (journey && st === 4) {
        const gateX = w * 0.5
        const opacity = Math.max(0.2, lp)
        ctx.save()
        ctx.strokeStyle = `rgba(232, 184, 74, ${opacity})`
        ctx.lineWidth = 2
        ctx.setLineDash([6, 8])
        ctx.beginPath()
        ctx.moveTo(gateX, h * 0.2)
        ctx.lineTo(gateX, h * 0.74)
        ctx.stroke()
        ctx.setLineDash([])

        const gateGlow = ctx.createLinearGradient(gateX - 40, 0, gateX + 40, 0)
        gateGlow.addColorStop(0, 'rgba(232, 184, 74, 0)')
        gateGlow.addColorStop(0.5, `rgba(232, 184, 74, ${opacity * 0.16})`)
        gateGlow.addColorStop(1, 'rgba(232, 184, 74, 0)')
        ctx.fillStyle = gateGlow
        ctx.fillRect(gateX - 40, h * 0.2, 80, h * 0.54)

        for (let i = 0; i < 10; i += 1) {
          const yy = h * (0.28 + ((frame * 0.01 + i * 0.09) % 0.4))
          const side = i % 2 === 0 ? -1 : 1
          ctx.fillStyle =
            i % 3 === 0
              ? `rgba(255, 77, 87, ${0.35 * (1 - lp)})`
              : `rgba(47, 217, 154, ${0.45 * lp})`
          ctx.beginPath()
          ctx.arc(gateX + side * (8 + (i % 4) * 5), yy, 2.2, 0, Math.PI * 2)
          ctx.fill()
        }
        ctx.restore()
      }

      if (journey) {
        drawWave(
          baseline + 28,
          amp * 0.38,
          2.2,
          `rgba(62, 207, 228, ${0.14 + a * 0.18})`,
          1.25,
          c * 0.35,
        )

        const speed = reduced ? 0.0015 : 0.0035
        packets.forEach((pkt) => {
          pkt.t += speed * (1 + pkt.lane * 0.15)
          if (pkt.t > 1) {
            pkt.t = 0
            pkt.spoof = Math.random() < 0.28 + c * 0.5
          }

          const x = pkt.t * w
          const y = waveY(
            x,
            baseline + pkt.lane * 10,
            amp * (0.7 + pkt.lane * 0.1),
            pkt.lane,
            p,
            c * 0.5,
          )

          if (st >= 4 && pkt.spoof && x > w * 0.5) return

          const isSpoof = pkt.spoof && c > 0.15
          ctx.beginPath()
          ctx.fillStyle = isSpoof
            ? `rgba(255, 77, 87, ${0.55 + c * 0.35})`
            : `rgba(${a > 0.4 ? '47, 217, 154' : '62, 207, 228'}, 0.9)`
          ctx.arc(x, y, isSpoof ? 2.8 : 2.2, 0, Math.PI * 2)
          ctx.fill()

          ctx.beginPath()
          ctx.strokeStyle = isSpoof
            ? `rgba(255, 77, 87, ${0.2 + c * 0.25})`
            : `rgba(62, 207, 228, ${0.18 + a * 0.2})`
          ctx.lineWidth = 1
          ctx.arc(x, y, 7 + Math.sin(frame * 0.1 + pkt.lane) * 2, 0, Math.PI * 2)
          ctx.stroke()
        })
      }

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
