import { clamp, range, useChapterProgress } from '../../hooks/useMotion'

export function Chapter({
  id,
  index,
  label,
  heightVh = 260,
  children,
}) {
  const { trackRef, progress, active } = useChapterProgress(heightVh)

  return (
    <section
      className={`chapter${active ? ' is-active' : ''}`}
      id={id}
      data-chapter={index}
      data-label={label}
      ref={trackRef}
      style={{ '--chapter-h': `${heightVh}vh`, '--p': progress }}
    >
      <div className="chapter-stage">
        {typeof children === 'function' ? children(progress, active) : children}
      </div>
    </section>
  )
}

export function StoryText({
  text,
  progress,
  from = 0,
  to = 0.35,
  className = '',
  as: Tag = 'p',
}) {
  const t = range(progress, from, to)
  return (
    <Tag
      className={`story-text${className ? ` ${className}` : ''}`}
      style={{
        opacity: t,
        transform: `translate3d(0, ${lerpPx(28, 0, t)}px, 0)`,
        filter: `blur(${(1 - t) * 8}px)`,
      }}
    >
      {text}
    </Tag>
  )
}

function lerpPx(a, b, t) {
  return a + (b - a) * t
}

export function StoryWords({
  text,
  progress,
  from = 0.05,
  to = 0.45,
  className = '',
  as: Tag = 'h2',
  accent = [],
}) {
  const words = text.split(' ')
  const t = range(progress, from, to)

  return (
    <Tag className={`story-words${className ? ` ${className}` : ''}`} aria-label={text}>
      {words.map((word, index) => {
        const local = clamp((t * words.length - index) / 1.15)
        const clean = word.replace(/[.,!?]/g, '')
        const isAccent = accent.includes(clean)
        return (
          <span
            key={`${word}-${index}`}
            className={isAccent ? 'is-accent' : undefined}
            style={{
              opacity: local,
              transform: `translate3d(0, ${(1 - local) * 36}px, 0) rotateX(${(1 - local) * 40}deg)`,
              filter: `blur(${(1 - local) * 6}px)`,
            }}
          >
            {word}
            {index < words.length - 1 ? '\u00A0' : ''}
          </span>
        )
      })}
    </Tag>
  )
}

export function StoryChars({
  text,
  progress,
  from = 0,
  to = 0.4,
  className = '',
  accent = false,
}) {
  const chars = text.split('')
  const t = range(progress, from, to)

  return (
    <span
      className={`story-chars${accent ? ' is-accent' : ''}${className ? ` ${className}` : ''}`}
      aria-hidden="true"
    >
      {chars.map((char, index) => {
        const local = clamp((t * (chars.length + 2) - index) / 2.2)
        return (
          <span
            key={`${char}-${index}`}
            style={{
              opacity: local,
              transform: `translate3d(0, ${(1 - local) * 50}px, 0) scale(${0.86 + local * 0.14})`,
              filter: `blur(${(1 - local) * 10}px)`,
            }}
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </span>
  )
}
