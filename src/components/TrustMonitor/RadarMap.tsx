import { useEffect, useRef, useState } from 'react'
import { useVoyageProgress } from '../../context/VoyageProgressContext'
import { useReducedMotion } from '../../hooks/useInView'

// Define Tokyo Bay shorelines coordinates to draw a high-tech tactical map backdrop
const SHORELINES = [
  // Boso Peninsula side
  [
    { lat: 35.52, lon: 140.12 },
    { lat: 35.32, lon: 139.98 },
    { lat: 35.15, lon: 139.92 },
    { lat: 34.90, lon: 139.82 },
    { lat: 34.94, lon: 140.00 },
    { lat: 35.10, lon: 140.15 }
  ],
  // Miura Peninsula / Yokohama / Tokyo side
  [
    { lat: 35.14, lon: 139.62 },
    { lat: 35.28, lon: 139.68 },
    { lat: 35.35, lon: 139.63 },
    { lat: 35.45, lon: 139.68 },
    { lat: 35.58, lon: 139.80 },
    { lat: 35.68, lon: 139.98 },
    { lat: 35.65, lon: 140.08 }
  ],
  // Sagami Bay island outline (Oshima)
  [
    { lat: 34.78, lon: 139.38 },
    { lat: 34.75, lon: 139.44 },
    { lat: 34.69, lon: 139.42 },
    { lat: 34.72, lon: 139.36 }
  ]
]

export default function RadarMap() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const { simulatedEntities, selectedEntityId, setSelectedEntityId, anomalyViewEnabled, setAnomalyViewEnabled, useLiveApi, setUseLiveApi } = useVoyageProgress()
  const reduced = useReducedMotion()

  const [dimensions, setDimensions] = useState({ w: 800, h: 550 })

  // Geographic boundaries mapping Kanto/Tokyo Bay to canvas projection
  const minLat = 34.82
  const maxLat = 35.68
  const minLon = 139.15
  const maxLon = 140.22

  const toCanvasCoords = (lat: number, lon: number, w: number, h: number) => {
    const x = ((lon - minLon) / (maxLon - minLon)) * w
    const y = (1 - (lat - minLat) / (maxLat - minLat)) * h
    return { x, y }
  }

  // Handle canvas sizing on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const parent = canvas.parentElement
      if (!parent) return
      const rect = parent.getBoundingClientRect()
      setDimensions({
        w: Math.max(400, rect.width - 24),
        h: Math.max(350, rect.height - 40)
      })
    }

    handleResize()
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  // Canvas loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf = 0
    let frame = 0

    const { w, h } = dimensions
    const dpr = Math.min(window.devicePixelRatio || 1, 2)
    canvas.width = w * dpr
    canvas.height = h * dpr
    canvas.style.width = `${w}px`
    canvas.style.height = `${h}px`
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

    const draw = () => {
      frame += 1
      ctx.clearRect(0, 0, w, h)

      // 1. Draw grid projection lines
      ctx.save()
      ctx.strokeStyle = 'rgba(62, 207, 228, 0.05)'
      ctx.lineWidth = 0.6
      const gridIntervals = 5

      // Latitude lines
      for (let i = 0; i <= gridIntervals; i++) {
        const latVal = minLat + (maxLat - minLat) * (i / gridIntervals)
        const { y } = toCanvasCoords(latVal, minLon, w, h)
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(w, y)
        ctx.stroke()

        // Lat labels
        ctx.fillStyle = 'rgba(155, 176, 196, 0.28)'
        ctx.font = '7px IBM Plex Mono'
        ctx.fillText(`${latVal.toFixed(2)}°N`, 8, y - 4)
      }

      // Longitude lines
      for (let i = 0; i <= gridIntervals; i++) {
        const lonVal = minLon + (maxLon - minLon) * (i / gridIntervals)
        const { x } = toCanvasCoords(minLat, lonVal, w, h)
        ctx.beginPath()
        ctx.moveTo(x, 0)
        ctx.lineTo(x, h)
        ctx.stroke()

        // Lon labels
        ctx.fillStyle = 'rgba(155, 176, 196, 0.28)'
        ctx.font = '7px IBM Plex Mono'
        ctx.fillText(`${lonVal.toFixed(2)}°E`, x + 4, h - 8)
      }
      ctx.restore()

      // 2. Draw high-tech geographic shorelines backdrop
      ctx.save()
      ctx.strokeStyle = 'rgba(155, 176, 196, 0.09)'
      ctx.lineWidth = 1.0
      ctx.setLineDash([3, 4])
      SHORELINES.forEach((shore) => {
        ctx.beginPath()
        shore.forEach((pt, idx) => {
          const { x, y } = toCanvasCoords(pt.lat, pt.lon, w, h)
          if (idx === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        })
        ctx.stroke()
      })
      ctx.restore()

      // 3. Draw concentric radar sweeps
      ctx.save()
      const cx = w / 2
      const cy = h / 2
      ctx.strokeStyle = 'rgba(62, 207, 228, 0.04)'
      ctx.lineWidth = 0.8
      for (let r = 80; r < w; r += 120) {
        ctx.beginPath()
        ctx.arc(cx, cy, r, 0, Math.PI * 2)
        ctx.stroke()
      }

      // Sweep arm line
      if (!reduced) {
        const sweepAngle = (frame * 0.012) % (Math.PI * 2)
        const sweepGrad = ctx.createRadialGradient(cx, cy, 10, cx, cy, w * 0.7)
        sweepGrad.addColorStop(0, 'rgba(62, 207, 228, 0.06)')
        sweepGrad.addColorStop(1, 'rgba(62, 207, 228, 0)')
        ctx.fillStyle = sweepGrad
        ctx.beginPath()
        ctx.moveTo(cx, cy)
        ctx.arc(cx, cy, w * 0.6, sweepAngle - 0.2, sweepAngle)
        ctx.closePath()
        ctx.fill()
      }
      ctx.restore()

      // 4. Draw Simulated Entities
      simulatedEntities.forEach((entity) => {
        const isSelected = entity.id === selectedEntityId
        const { x, y } = toCanvasCoords(entity.latitude, entity.longitude, w, h)

        // Anomaly View mode subdues non-compromised entities
        let entityOpacity = 1.0
        if (anomalyViewEnabled) {
          entityOpacity = entity.trustStatus === 'WARNING' || entity.trustStatus === 'SUSPICIOUS' || entity.trustStatus === 'REJECTED' ? 1.0 : 0.18
        }

        ctx.save()
        ctx.globalAlpha = entityOpacity

        // Render targeted spoof coordinate differentials (how we tackle it visualization)
        if (entity.isSpoofed && entity.actualLat && entity.actualLon) {
          const actualCoords = toCanvasCoords(entity.actualLat, entity.actualLon, w, h)
          const spoofCoords = toCanvasCoords(entity.spoofLat ?? entity.latitude, entity.spoofLon ?? entity.longitude, w, h)

          ctx.beginPath()
          ctx.moveTo(actualCoords.x, actualCoords.y)
          ctx.lineTo(spoofCoords.x, spoofCoords.y)
          ctx.strokeStyle = 'rgba(255, 77, 87, 0.55)'
          ctx.lineWidth = 0.8
          ctx.setLineDash([2, 4])
          ctx.stroke()
          ctx.setLineDash([])

          if (entity.isPolicyFiltered) {
            // Isolated spoof target
            ctx.beginPath()
            ctx.arc(spoofCoords.x, spoofCoords.y, 4, 0, Math.PI * 2)
            ctx.strokeStyle = 'rgba(255, 77, 87, 0.55)'
            ctx.stroke()

            ctx.fillStyle = 'rgba(255, 77, 87, 0.65)'
            ctx.font = '6px IBM Plex Mono'
            ctx.fillText('SPOOF FILTERED', spoofCoords.x + 10, spoofCoords.y + 2)
          } else {
            // Un-tackled spoof target
            ctx.beginPath()
            ctx.arc(actualCoords.x, actualCoords.y, 4, 0, Math.PI * 2)
            ctx.strokeStyle = 'var(--clean-mint)'
            ctx.stroke()

            ctx.fillStyle = 'var(--clean-mint)'
            ctx.font = '6px IBM Plex Mono'
            ctx.fillText('INERTIAL BACKUP', actualCoords.x + 10, actualCoords.y + 2)
          }
        }

        // Pick color matching trust status
        let tone = 'var(--signal-cyan)'
        if (entity.trustStatus === 'VERIFIED') tone = 'var(--clean-mint)'
        else if (entity.trustStatus === 'TRUSTED') tone = 'var(--fog)'
        else if (entity.trustStatus === 'WARNING') tone = 'var(--auth-gold)'
        else if (entity.trustStatus === 'SUSPICIOUS' || entity.trustStatus === 'REJECTED') tone = 'var(--alarm-red)'

        ctx.fillStyle = tone
        ctx.strokeStyle = tone

        // Draw selection highlight ring
        if (isSelected) {
          ctx.beginPath()
          ctx.arc(x, y, 22, 0, Math.PI * 2)
          ctx.strokeStyle = 'var(--paper)'
          ctx.lineWidth = 1
          ctx.setLineDash([2, 3])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Draw Verification Halo Ring
        ctx.beginPath()
        const pulseRatio = !reduced ? 1 + Math.sin(frame * 0.08 + entity.trustScore) * 0.15 : 1
        const baseRadius = entity.trustStatus === 'WARNING' || entity.trustStatus === 'SUSPICIOUS' ? 15 : 10
        ctx.arc(x, y, baseRadius * pulseRatio, 0, Math.PI * 2)
        ctx.strokeStyle = tone
        ctx.lineWidth = 0.8
        ctx.stroke()

        // If Rejected, draw additional red "UNTRUSTED POSITION" ghost elements
        if (entity.trustStatus === 'REJECTED') {
          ctx.beginPath()
          ctx.arc(x, y, 28, 0, Math.PI * 2)
          ctx.strokeStyle = 'rgba(255, 77, 87, 0.45)'
          ctx.lineWidth = 0.5
          ctx.setLineDash([1, 4])
          ctx.stroke()
          ctx.setLineDash([])
        }

        // Draw Entity Icon (Swept wing plane vs wedge boat)
        ctx.save()
        ctx.translate(x, y)
        ctx.rotate((entity.heading * Math.PI) / 180)
        ctx.beginPath()
        if (entity.type === 'aircraft') {
          // Delta shape flight icon
          ctx.moveTo(0, -9)
          ctx.lineTo(6, 6)
          ctx.lineTo(2, 4)
          ctx.lineTo(0, 7)
          ctx.lineTo(-2, 4)
          ctx.lineTo(-6, 6)
          ctx.closePath()
        } else {
          // Marine wedge boat shape
          ctx.moveTo(0, -7)
          ctx.lineTo(4, 3)
          ctx.lineTo(4, 7)
          ctx.lineTo(-4, 7)
          ctx.lineTo(-4, 3)
          ctx.closePath()
        }
        ctx.fill()
        ctx.restore()

        // Draw Telemetry Tags next to node
        ctx.fillStyle = isSelected ? 'var(--paper)' : 'rgba(238, 244, 249, 0.72)'
        ctx.font = '8px IBM Plex Mono'
        ctx.fillText(entity.callsign, x + 16, y - 4)

        ctx.fillStyle = tone
        ctx.font = '7px IBM Plex Mono'
        const labelText =
          entity.trustStatus === 'REJECTED'
            ? 'UNTRUSTED POSITION'
            : entity.type === 'aircraft'
              ? `${Math.round(entity.altitude / 100)}FL | ${entity.speed}KT`
              : `${entity.speed}KT | COG ${Math.round(entity.heading)}°`
        ctx.fillText(labelText, x + 16, y + 5)

        ctx.restore()
      })

      raf = requestAnimationFrame(draw)
    }

    draw()
    return () => cancelAnimationFrame(raf)
  }, [dimensions, simulatedEntities, selectedEntityId, anomalyViewEnabled])

  // Click handler to select entities on the canvas
  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return
    const rect = canvas.getBoundingClientRect()
    const clickX = e.clientX - rect.left
    const clickY = e.clientY - rect.top

    // Find closest target within 25px tolerance
    let closestId: string | null = null
    let minDist = 25

    simulatedEntities.forEach((entity) => {
      const { x, y } = toCanvasCoords(entity.latitude, entity.longitude, dimensions.w, dimensions.h)
      const dist = Math.hypot(clickX - x, clickY - y)
      if (dist < minDist) {
        minDist = dist
        closestId = entity.id
      }
    })

    setSelectedEntityId(closestId)
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <h2 style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: '1.25rem', color: 'var(--paper)' }}>
            VIRTUAL SKY & MARITIME RADAR
          </h2>
          <span style={{ fontSize: '0.78rem', color: 'var(--fog)', fontFamily: 'var(--font-mono)' }}>
            TOKYO BAY NAVIGATIONAL SECTOR OVERVIEW
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.65rem', alignItems: 'center' }}>
          {/* Source Toggle */}
          <div style={{ display: 'flex', border: '1px solid var(--hairline)', borderRadius: '4px', overflow: 'hidden', background: 'rgba(4, 9, 20, 0.45)' }}>
            <button
              onClick={() => setUseLiveApi(false)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                padding: '0.35rem 0.65rem',
                border: 'none',
                background: !useLiveApi ? 'var(--signal-cyan-soft)' : 'none',
                color: !useLiveApi ? 'var(--signal-cyan)' : 'var(--fog)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              LOCAL SIMULATOR
            </button>
            <button
              onClick={() => setUseLiveApi(true)}
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '0.58rem',
                padding: '0.35rem 0.65rem',
                border: 'none',
                background: useLiveApi ? 'var(--signal-cyan-soft)' : 'none',
                color: useLiveApi ? 'var(--signal-cyan)' : 'var(--fog)',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🛰️ LIVE ADS-B (OPENSKY)
            </button>
          </div>

          {/* Anomaly Button */}
          <button
            onClick={() => setAnomalyViewEnabled(!anomalyViewEnabled)}
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '0.58rem',
              letterSpacing: '0.05em',
              padding: '0.35rem 0.65rem',
              borderRadius: '4px',
              border: '1px solid',
              borderColor: anomalyViewEnabled ? 'var(--alarm-red)' : 'var(--hairline)',
              background: anomalyViewEnabled ? 'var(--alarm-soft)' : 'rgba(4, 9, 20, 0.45)',
              color: anomalyViewEnabled ? 'var(--alarm-red)' : 'var(--fog)',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            {anomalyViewEnabled ? '⚠️ EXCLUDE NOMINAL' : '🔍 ANOMALY FOCUS'}
          </button>
        </div>
      </div>

      <div 
        style={{ 
          flex: 1, 
          background: 'rgba(4, 9, 20, 0.55)', 
          border: '1px solid var(--hairline)', 
          borderRadius: 'var(--radius)', 
          position: 'relative',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          cursor: 'crosshair',
          overflow: 'hidden'
        }}
      >
        <canvas 
          ref={canvasRef} 
          onClick={handleCanvasClick}
        />
        
        {/* Map Legend Overlay */}
        <div 
          style={{ 
            position: 'absolute', 
            bottom: '10px', 
            left: '10px', 
            background: 'rgba(4, 9, 20, 0.85)', 
            border: '1px solid var(--hairline)', 
            borderRadius: '4px', 
            padding: '8px', 
            display: 'flex', 
            flexDirection: 'column', 
            gap: '4px',
            pointerEvents: 'none'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--clean-mint)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--clean-mint)' }} />
            VERIFIED (CONFIDENCE 90+)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--fog)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--fog)' }} />
            TRUSTED (CONFIDENCE 70-89)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--auth-gold)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--auth-gold)' }} />
            WARNING (CONFIDENCE 40-69)
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.6rem', fontFamily: 'var(--font-mono)', color: 'var(--alarm-red)' }}>
            <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--alarm-red)' }} />
            SPOOFED (CONFIDENCE &lt;40)
          </div>
        </div>
      </div>
    </div>
  )
}
