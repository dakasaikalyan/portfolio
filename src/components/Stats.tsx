import styles from './Stats.module.css'

const STATS = [
  {
    label: 'Detection latency',
    value: '< 40 ms',
    note: 'auth decision to policy',
  },
  {
    label: 'Spoof detection',
    value: '99.2%',
    note: 'lab scenario suite',
  },
  {
    label: 'Compliance path',
    value: 'IEC 61162',
    note: 'IMO cyber-risk aligned',
  },
]

export default function Stats() {
  return (
    <div className={styles.strip}>
      {STATS.map((stat, index) => (
        <article key={stat.label} className={styles.item} style={{ animationDelay: `${index * 0.1}s` }}>
          <span className={styles.label}>{stat.label}</span>
          <strong>{stat.value}</strong>
          <p>{stat.note}</p>
        </article>
      ))}
    </div>
  )
}
