import { forwardRef, useEffect, useMemo, useState } from 'react'
import { useInView, useReducedMotion } from '../hooks/useMotion'

const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789░▒▓/<+>*'

export function DecodeText({
  text,
  as: Tag = 'span',
  className = '',
  trigger = true,
  delay = 0,
  ...props
}) {
  const reduced = useReducedMotion()
  const [output, setOutput] = useState(reduced || !trigger ? text : '')

  useEffect(() => {
    if (!trigger) return
    if (reduced) {
      setOutput(text)
      return
    }

    let frame = 0
    let start = null
    let raf = 0
    const duration = Math.min(1400, 280 + text.length * 28)

    const tick = (now) => {
      if (start == null) start = now
      const elapsed = now - start - delay
      if (elapsed < 0) {
        raf = requestAnimationFrame(tick)
        return
      }

      frame += 1
      const progress = Math.min(1, elapsed / duration)
      const locked = Math.floor(progress * text.length)

      const next = text
        .split('')
        .map((char, index) => {
          if (char === ' ' || char === '—' || char === '·') return char
          if (index < locked) return text[index]
          return GLYPHS[(index + frame) % GLYPHS.length]
        })
        .join('')

      setOutput(next)
      if (progress < 1) raf = requestAnimationFrame(tick)
      else setOutput(text)
    }

    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [text, trigger, reduced, delay])

  return (
    <Tag className={className} aria-label={text} {...props}>
      {output}
    </Tag>
  )
}

export const SplitWords = forwardRef(function SplitWords(
  {
    text,
    as: Tag = 'span',
    className = '',
    active = true,
    delay = 0,
    accentWords = [],
    ...props
  },
  ref,
) {
  const words = useMemo(() => text.split(' '), [text])
  const reduced = useReducedMotion()

  return (
    <Tag
      ref={ref}
      className={`split-words${active ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      aria-label={text}
      {...props}
    >
      {words.map((word, index) => {
        const clean = word.replace(/[.,!?]/g, '')
        const accent = accentWords.includes(clean)
        return (
          <span
            className={`split-word${accent ? ' is-accent' : ''}`}
            style={{
              '--i': index,
              '--base-delay': `${delay}ms`,
              ...(reduced
                ? { animation: 'none', opacity: 1, transform: 'none', filter: 'none' }
                : null),
            }}
            key={`${word}-${index}`}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        )
      })}
    </Tag>
  )
})

export function SplitChars({
  text,
  className = '',
  active = true,
  delay = 0,
  accent = false,
}) {
  const reduced = useReducedMotion()
  const chars = useMemo(() => text.split(''), [text])

  return (
    <span
      className={`split-chars${active ? ' is-active' : ''}${accent ? ' is-accent' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {chars.map((char, index) => (
        <span
          className="split-char"
          style={{
            '--i': index,
            '--base-delay': `${delay}ms`,
            ...(reduced
              ? { animation: 'none', opacity: 1, transform: 'none', filter: 'none' }
              : null),
          }}
          key={`${char}-${index}`}
        >
          {char === ' ' ? '\u00A0' : char}
        </span>
      ))}
    </span>
  )
}

export function AnimatedEyebrow({ text, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.4 })

  return (
    <p className={`eyebrow animated-eyebrow${className ? ` ${className}` : ''}`} ref={ref}>
      <DecodeText text={text} trigger={inView} />
    </p>
  )
}

export function AnimatedHeading({
  text,
  as: Tag = 'h2',
  className = '',
  accentWords = [],
  delay = 80,
}) {
  const [ref, inView] = useInView({ threshold: 0.35 })

  return (
    <SplitWords
      as={Tag}
      ref={ref}
      text={text}
      className={`animated-heading${className ? ` ${className}` : ''}`}
      active={inView}
      delay={delay}
      accentWords={accentWords}
    />
  )
}

export function AnimatedLede({ text, className = '' }) {
  const [ref, inView] = useInView({ threshold: 0.3 })
  const sentences = useMemo(
    () => text.match(/[^.!?]+[.!?]+|[^.!?]+$/g)?.map((part) => part.trim()) ?? [text],
    [text],
  )
  const reduced = useReducedMotion()

  return (
    <p
      className={`lede animated-lede${inView ? ' is-active' : ''}${className ? ` ${className}` : ''}`}
      ref={ref}
      aria-label={text}
    >
      {sentences.map((sentence, index) => (
        <span
          className="lede-line"
          style={{
            '--i': index,
            ...(reduced
              ? { animation: 'none', opacity: 1, transform: 'none', filter: 'none' }
              : null),
          }}
          key={sentence}
        >
          {sentence}{' '}
        </span>
      ))}
    </p>
  )
}

export function HoverScramble({ text, as: Tag = 'span', className = '' }) {
  const reduced = useReducedMotion()
  const [value, setValue] = useState(text)
  const [busy, setBusy] = useState(false)

  function scramble() {
    if (reduced || busy) return
    setBusy(true)
    let frame = 0
    const total = 12
    const id = window.setInterval(() => {
      frame += 1
      if (frame >= total) {
        setValue(text)
        setBusy(false)
        window.clearInterval(id)
        return
      }
      setValue(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ' || frame / total > index / text.length) return char
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)]
          })
          .join(''),
      )
    }, 28)
  }

  return (
    <Tag className={className} onMouseEnter={scramble} aria-label={text}>
      {value}
    </Tag>
  )
}
