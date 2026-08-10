import { useEffect, useRef, useState, useCallback } from 'react'

export function useReducedMotion() {
  const [reduced, setReduced] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    const update = () => setReduced(mq.matches)
    update()
    mq.addEventListener('change', update)
    return () => mq.removeEventListener('change', update)
  }, [])

  return reduced
}

export function useInView(options = {}) {
  const ref = useRef(null)
  const [inView, setInView] = useState(false)

  useEffect(() => {
    const node = ref.current
    if (!node) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true)
          if (options.once !== false) observer.unobserve(node)
        } else if (options.once === false) {
          setInView(false)
        }
      },
      {
        threshold: options.threshold ?? 0.18,
        rootMargin: options.rootMargin ?? '0px 0px -8% 0px',
      },
    )

    observer.observe(node)
    return () => observer.disconnect()
  }, [options.once, options.rootMargin, options.threshold])

  return [ref, inView]
}

export function useLenis(reduced) {
  const lenisRef = useRef(null)

  useEffect(() => {
    if (reduced) return undefined

    let lenis
    let raf = 0
    let cancelled = false

    ;(async () => {
      const { default: Lenis } = await import('lenis')
      if (cancelled) return

      lenis = new Lenis({
        duration: 1.15,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
        smoothWheel: true,
        touchMultiplier: 1.4,
      })
      lenisRef.current = lenis

      const tick = (time) => {
        lenis.raf(time)
        raf = requestAnimationFrame(tick)
      }
      raf = requestAnimationFrame(tick)
    })()

    return () => {
      cancelled = true
      cancelAnimationFrame(raf)
      lenis?.destroy()
      lenisRef.current = null
    }
  }, [reduced])

  return lenisRef
}

export function useChapterProgress(heightVh = 280) {
  const trackRef = useRef(null)
  const [progress, setProgress] = useState(0)
  const [active, setActive] = useState(false)

  useEffect(() => {
    const node = trackRef.current
    if (!node) return

    let raf = 0

    const update = () => {
      const rect = node.getBoundingClientRect()
      const total = rect.height - window.innerHeight
      const raw = total > 0 ? -rect.top / total : 0
      const next = Math.min(1, Math.max(0, raw))
      setProgress(next)
      setActive(rect.top <= 0 && rect.bottom >= window.innerHeight * 0.35)
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
  }, [heightVh])

  return { trackRef, progress, active }
}

export function useGlobalProgress() {
  const [progress, setProgress] = useState(0)
  const [chapter, setChapter] = useState(0)

  const onScroll = useCallback(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight
    setProgress(max > 0 ? window.scrollY / max : 0)

    const nodes = [...document.querySelectorAll('[data-chapter]')]
    let current = 0
    nodes.forEach((node, index) => {
      const rect = node.getBoundingClientRect()
      if (rect.top <= window.innerHeight * 0.45) current = index
    })
    setChapter(current)
  }, [])

  useEffect(() => {
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [onScroll])

  return { progress, chapter }
}

export function clamp(v, min = 0, max = 1) {
  return Math.min(max, Math.max(min, v))
}

export function range(progress, start, end) {
  if (end === start) return progress >= end ? 1 : 0
  return clamp((progress - start) / (end - start))
}

export function lerp(a, b, t) {
  return a + (b - a) * t
}
