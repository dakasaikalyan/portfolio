import { useEffect, useRef } from 'react'
import { useVoyageProgress } from '../context/VoyageProgressContext'
import { useReducedMotion } from '../hooks/useInView'
import { STAGE_PALETTES } from '../lib/palettes'
import { lerp, lerpColor, rgb } from '../lib/voyageMath'
import styles from './SkyCanvas.module.css'

type Star = { x: number; y: number; s: number; tw: number; sp: number }
type Streak = { x: number; y: number; len: number; speed: number; a: number }
type Bolt = {
  x1: number
  y1: number
  x2: number
  y2: number
  opacity: number
  segments: { x: number; y: number }[]
}
type Particle = {
  x: number
  y: number
  vx: number
  vy: number
  size: number
  life: number
  maxLife: number
  color: string
}

export default function SkyCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { progress, stage, localProgress, corruption, authGlow, journeyProgress, introComplete, vehicleType } = useVoyageProgress()
  const reduced = useReducedMotion()
  const stateRef = useRef({ progress, stage, localProgress, corruption, authGlow, journeyProgress, introComplete, vehicleType })

  useEffect(() => {
    stateRef.current = { progress, stage, localProgress, corruption, authGlow, journeyProgress, introComplete, vehicleType }
  }, [progress, stage, localProgress, corruption, authGlow, journeyProgress, introComplete, vehicleType])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let frame = 0
    let w = 0
    let h = 0
    let activeBolts: Bolt[] = []
    let particles: Particle[] = []

    const clouds = [
      { startX: 0.05, startY: 0.16, scale: 1.1, speed: 0.16, opacity: 0.05 },
      { startX: 0.32, startY: 0.26, scale: 0.75, speed: 0.1, opacity: 0.04 },
      { startX: 0.58, startY: 0.12, scale: 1.4, speed: 0.22, opacity: 0.06 },
      { startX: 0.82, startY: 0.32, scale: 0.6, speed: 0.08, opacity: 0.03 },
      { startX: 0.18, startY: 0.44, scale: 0.9, speed: 0.35, opacity: 0.09 },
      { startX: 0.48, startY: 0.52, scale: 1.35, speed: 0.42, opacity: 0.11 },
      { startX: 0.76, startY: 0.36, scale: 0.85, speed: 0.26, opacity: 0.08 },
      { startX: 0.92, startY: 0.2, scale: 1.05, speed: 0.14, opacity: 0.05 }
    ]


    const generateLightningSegments = (x1: number, y1: number, x2: number, y2: number, disp: number): { x: number; y: number }[] => {
      const points: { x: number; y: number }[] = []
      const recurse = (sx1: number, sy1: number, sx2: number, sy2: number, d: number) => {
        if (d < 4) {
          points.push({ x: sx2, y: sy2 })
          return
        }
        const midX = (sx1 + sx2) / 2
        const midY = (sy1 + sy2) / 2
        const jitterX = (Math.random() - 0.5) * d
        const jitterY = (Math.random() - 0.5) * d
        const nx = midX + jitterX
        const ny = midY + jitterY
        recurse(sx1, sy1, nx, ny, d / 2)
        recurse(nx, ny, sx2, sy2, d / 2)
      }
      points.push({ x: x1, y: y1 })
      recurse(x1, y1, x2, y2, disp)
      return points
    }

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
      const {
        progress: p,
        stage: st,
        localProgress: lp,
        corruption: c,
        authGlow: a,
        journeyProgress: jp,
        introComplete: journey,
        vehicleType: vt,
      } = stateRef.current
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

      // Parallax Clouds (Drifting at speed based on vehicle type)
      ctx.save()
      clouds.forEach((cloud) => {
        const scrollFactor = vt === 'plane' ? 6 : 0.8
        const cx = (cloud.startX * w - frame * cloud.speed * scrollFactor) % (w + 300)
        const finalX = cx < -200 ? cx + (w + 300) : cx
        const cy = cloud.startY * h

        ctx.beginPath()
        ctx.arc(finalX, cy, 32 * cloud.scale, 0, Math.PI * 2)
        ctx.arc(finalX + 22 * cloud.scale, cy - 8 * cloud.scale, 26 * cloud.scale, 0, Math.PI * 2)
        ctx.arc(finalX - 22 * cloud.scale, cy - 4 * cloud.scale, 22 * cloud.scale, 0, Math.PI * 2)
        
        ctx.fillStyle = `rgba(238, 244, 248, ${cloud.opacity * (vt === 'plane' ? 1.0 : 0.45)})`
        ctx.fill()
      })
      ctx.restore()


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

      let shipX = 0
      let shipBottomPercent = 0
      let shipWidth = 0
      let shipHeight = 0

      if (journey) {
        // Calculate vehicle coordinate parameters dynamically
        shipX = w * (0.06 + jp * 0.78)
        shipBottomPercent = vt === 'plane' ? 0.24 + Math.sin(jp * 60) * 0.08 : 0.18 + Math.sin(jp * 60) * 0.06
        shipWidth = w < 700 ? Math.min(0.38 * w, 150) : Math.min(0.2 * w, 200)
        shipHeight = (100 / 180) * shipWidth
        
        const targetX = shipX + shipWidth * (vt === 'plane' ? 132/180 : 78/180)
        const targetY = h - shipBottomPercent * h - shipHeight * (vt === 'plane' ? 0.48 : 0.86)
        const domeCenterX = shipX + shipWidth * (vt === 'plane' ? 88/180 : 78/180)
        const domeCenterY = h - shipBottomPercent * h - shipHeight * (vt === 'plane' ? 0.48 : 0.86)
        const shieldRadius = (78 / 180) * shipWidth

        // 1. Authenticated Signal Beams (Green lasers from Satellites)
        if (a > 0.05) {
          const satellites = [
            { x: w * 0.22, y: h * 0.08 },
            { x: w * 0.52, y: h * 0.05 },
            { x: w * 0.82, y: h * 0.1 }
          ]

          satellites.forEach((sat, satIndex) => {
            // Draw connection laser path
            ctx.beginPath()
            ctx.moveTo(sat.x, sat.y)
            ctx.lineTo(targetX, targetY)
            ctx.strokeStyle = `rgba(47, 217, 154, ${a * 0.16})`
            ctx.lineWidth = 1.0
            ctx.stroke()

            // Draw flowing data packets
            const packetCount = 3
            for (let i = 0; i < packetCount; i++) {
              const offset = i / packetCount
              const t = (frame * 0.015 + offset) % 1
              const px = lerp(sat.x, targetX, t)
              const py = lerp(sat.y, targetY, t)

              ctx.beginPath()
              ctx.fillStyle = `rgba(47, 217, 154, ${(1 - t) * 0.85})`
              ctx.arc(px, py, 2.5, 0, Math.PI * 2)
              ctx.fill()
            }

            // Draw satellite node blinking rings
            ctx.beginPath()
            ctx.arc(sat.x, sat.y, 4, 0, Math.PI * 2)
            ctx.fillStyle = `rgba(47, 217, 154, ${a * 0.95})`
            ctx.fill()

            ctx.beginPath()
            ctx.arc(sat.x, sat.y, 7 + Math.sin(frame * 0.06 + satIndex) * 2.5, 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(47, 217, 154, ${a * 0.4})`
            ctx.lineWidth = 1
            ctx.stroke()
          })
        }

        // 2. Corrupted Spoofing Lightning Bolts (Red fractal lightning)
        if (c > 0.05) {
          if (Math.random() < 0.06 + c * 0.09) {
            const boltX = shipX + (Math.random() - 0.5) * w * 0.6
            const boltY = Math.random() * h * 0.22
            
            // Strike coordinates hitting the shield dome
            const angle = Math.atan2(boltY - domeCenterY, boltX - domeCenterX)
            const targetXContact = domeCenterX + Math.cos(angle) * shieldRadius
            const targetYContact = domeCenterY + Math.sin(angle) * shieldRadius

            const segments = generateLightningSegments(boltX, boltY, targetXContact, targetYContact, 32)
            activeBolts.push({
              x1: boltX,
              y1: boltY,
              x2: targetXContact,
              y2: targetYContact,
              opacity: 0.95,
              segments
            })
            window.dispatchEvent(new CustomEvent('radar-lightning-strike'))
          }
        }

        // Draw and update active lightning bolts
        activeBolts = activeBolts.filter((bolt) => {
          bolt.opacity -= reduced ? 0.22 : 0.095
          if (bolt.opacity <= 0) return false

          // Render bolt glow
          ctx.beginPath()
          ctx.moveTo(bolt.segments[0].x, bolt.segments[0].y)
          for (let i = 1; i < bolt.segments.length; i++) {
            ctx.lineTo(bolt.segments[i].x, bolt.segments[i].y)
          }
          ctx.strokeStyle = `rgba(255, 77, 87, ${bolt.opacity * c * 0.72})`
          ctx.lineWidth = reduced ? 1.5 : 3.5
          ctx.stroke()

          // Render bolt core
          ctx.strokeStyle = `rgba(255, 230, 230, ${bolt.opacity * 0.95})`
          ctx.lineWidth = 1
          ctx.stroke()

          // Draw impact splash ripple ring on the shield
          if (!reduced) {
            ctx.beginPath()
            ctx.arc(bolt.x2, bolt.y2, 16 * (1 - bolt.opacity), 0, Math.PI * 2)
            ctx.strokeStyle = `rgba(255, 77, 87, ${bolt.opacity * 0.65})`
            ctx.lineWidth = 1.2
            ctx.stroke()
          }

          return true
        })
      }

      // 3. Update and draw engine exhaust / bubble particles
      if (journey) {
        const vt = stateRef.current.vehicleType
        const vtPlane = vt === 'plane'
        const emitX = shipX + shipWidth * (vtPlane ? 8 / 180 : 22 / 180)
        const emitY = vtPlane 
          ? h - shipBottomPercent * h - shipHeight * 0.52 
          : h - shipBottomPercent * h - shipHeight * 0.72

        // Emit new particles
        const emitCount = vtPlane ? 2 : 1
        for (let i = 0; i < emitCount; i++) {
          particles.push({
            x: emitX,
            y: emitY + (Math.random() - 0.5) * (vtPlane ? 5 : 3),
            vx: vtPlane ? -3.5 - Math.random() * 3.5 : -0.8 - Math.random() * 1.0,
            vy: vtPlane ? (Math.random() - 0.5) * 1.2 : -0.15 - Math.random() * 0.35,
            size: vtPlane ? 2.2 + Math.random() * 3.8 : 1.2 + Math.random() * 2.5,
            life: 0,
            maxLife: vtPlane ? 22 + Math.random() * 14 : 38 + Math.random() * 18,
            color: vtPlane 
              ? (c > 0.2 ? '255, 85, 95' : a > 0.35 ? '47, 217, 154' : '255, 120, 45')
              : (c > 0.2 ? '255, 120, 130' : '230, 245, 255')
          })
        }

        // Draw and update active particles
        particles = particles.filter(p => {
          p.life++
          if (p.life >= p.maxLife) return false
          
          p.x += p.vx
          p.y += p.vy
          
          const alpha = 1 - (p.life / p.maxLife)
          ctx.beginPath()
          ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.7})`
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
          ctx.fill()
          
          // Glow effect for jet engine heat trail
          if (vtPlane && !reduced && p.life < p.maxLife * 0.4) {
            ctx.beginPath()
            ctx.fillStyle = `rgba(${p.color}, ${alpha * 0.2})`
            ctx.arc(p.x, p.y, p.size * 2.6, 0, Math.PI * 2)
            ctx.fill()
          }
          return true
        })
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
