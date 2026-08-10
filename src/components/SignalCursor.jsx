import { useEffect, useState } from 'react'
import { useReducedMotion } from '../hooks/useMotion'

export default function SignalCursor() {
  const reduced = useReducedMotion()
  const [pos, setPos] = useState({ x: -100, y: -100 })
  const [active, setActive] = useState(false)
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    const fine = window.matchMedia('(pointer: fine)').matches
    setEnabled(fine && !reduced)
  }, [reduced])

  useEffect(() => {
    if (!enabled) return

    const onMove = (event) => {
      setPos({ x: event.clientX, y: event.clientY })
      setActive(true)
    }
    const onLeave = () => setActive(false)

    window.addEventListener('pointermove', onMove)
    document.documentElement.addEventListener('mouseleave', onLeave)
    document.body.classList.add('has-signal-cursor')

    return () => {
      window.removeEventListener('pointermove', onMove)
      document.documentElement.removeEventListener('mouseleave', onLeave)
      document.body.classList.remove('has-signal-cursor')
    }
  }, [enabled])

  if (!enabled) return null

  return (
    <div
      className={`signal-cursor${active ? ' is-active' : ''}`}
      style={{ transform: `translate3d(${pos.x}px, ${pos.y}px, 0)` }}
      aria-hidden="true"
    >
      <span className="signal-cursor-ring" />
      <span className="signal-cursor-core" />
      <span className="signal-cursor-x" />
      <span className="signal-cursor-y" />
    </div>
  )
}
