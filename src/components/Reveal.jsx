import { useInView } from '../hooks/useMotion'

export default function Reveal({
  as: Tag = 'div',
  children,
  className = '',
  delay = 0,
  ...props
}) {
  const [ref, inView] = useInView()

  return (
    <Tag
      ref={ref}
      className={`reveal${inView ? ' is-inview' : ''}${className ? ` ${className}` : ''}`}
      style={{ '--reveal-delay': `${delay}ms` }}
      {...props}
    >
      {children}
    </Tag>
  )
}
