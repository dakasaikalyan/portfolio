import { useEffect, useRef } from 'react'
import Reveal from './Reveal'
import { useInView, useReducedMotion } from '../hooks/useMotion'
import {
  AnimatedEyebrow,
  AnimatedHeading,
  AnimatedLede,
  HoverScramble,
} from './TextAnimate'

const unlocks = [
  {
    label: 'Atmospheric realism',
    detail: 'Klobuchar + Saastamoinen applied to the IQ stream — not vacuum pseudoranges.',
  },
  {
    label: 'Perfect repeatability',
    detail: 'Every scenario is software-parameterised with a citable scenario ID.',
  },
  {
    label: 'Adaptive attackers',
    detail: 'Behavioural spoofers that observe receiver state and adjust onset, power, and drift.',
  },
  {
    label: 'Zero spectrum risk',
    detail: 'No WPC licence. No shielded chamber. Legally operable on ordinary compute.',
  },
]

function IqScope() {
  const canvasRef = useRef(null)
  const [ref, inView] = useInView({ threshold: 0.3, once: false })
  const reduced = useReducedMotion()

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || !inView) return

    const ctx = canvas.getContext('2d')
    let raf = 0
    let frame = 0

    const resize = () => {
      const rect = canvas.getBoundingClientRect()
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    const draw = () => {
      frame += 1
      const width = canvas.clientWidth
      const height = canvas.clientHeight
      ctx.clearRect(0, 0, width, height)

      ctx.strokeStyle = 'rgba(124, 255, 178, 0.08)'
      ctx.lineWidth = 1
      for (let y = 16; y < height; y += 24) {
        ctx.beginPath()
        ctx.moveTo(0, y)
        ctx.lineTo(width, y)
        ctx.stroke()
      }

      const plot = (color, phase, amp) => {
        ctx.beginPath()
        for (let x = 0; x < width; x += 2) {
          const t = frame * (reduced ? 0.02 : 0.055)
          const y =
            height * 0.52 +
            Math.sin(x * 0.035 + t + phase) * amp +
            Math.sin(x * 0.09 + t * 1.4 + phase) * (amp * 0.35)
          if (x === 0) ctx.moveTo(x, y)
          else ctx.lineTo(x, y)
        }
        ctx.strokeStyle = color
        ctx.lineWidth = 2
        ctx.stroke()
      }

      plot('rgba(124, 255, 178, 0.9)', 0, 28)
      plot('rgba(255, 176, 92, 0.75)', 1.2, 18)

      const sweepX = (frame * 3) % width
      ctx.fillStyle = 'rgba(124, 255, 178, 0.12)'
      ctx.fillRect(sweepX - 18, 0, 36, height)
      ctx.fillStyle = 'rgba(232, 255, 239, 0.85)'
      ctx.fillRect(sweepX, 8, 2, height - 16)

      raf = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [inView, reduced])

  return (
    <div className="iq-panel" ref={ref}>
      <div className="iq-header">
        <HoverScramble text="PRE-ENERGY DOMAIN" />
        <span className="mono">ci16 · ZMQ · LIVE</span>
      </div>
      <canvas className="iq-scope" ref={canvasRef} aria-hidden="true" />
      <div className="iq-meta">
        <span>I</span>
        <span>Q</span>
        <span>before RF</span>
      </div>
    </div>
  )
}

export default function PreEnergy() {
  return (
    <section className="block block-dark" id="iq">
      <div className="shell preenergy">
        <Reveal className="preenergy-visual" aria-hidden="true">
          <IqScope />
        </Reveal>

        <div className="preenergy-copy">
          <AnimatedEyebrow text="02 — Architectural Thesis" />
          <AnimatedHeading
            text="Operate before the signal becomes energy."
            accentWords={['signal', 'energy']}
          />
          <AnimatedLede text="Every legacy testbed crosses into electromagnetic emission. PhantomLayer stays in the complex baseband layer — synthesising legitimate and attack signals as IQ samples that receivers can process, without ever radiating." />

          <div className="unlock-list">
            {unlocks.map((item, index) => (
              <Reveal as="article" key={item.label} delay={index * 90}>
                <h3>
                  <HoverScramble text={item.label} />
                </h3>
                <p>{item.detail}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
