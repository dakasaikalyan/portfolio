const CHAPTERS = [
  { id: 'top', label: 'Origin' },
  { id: 'threat', label: 'Threat' },
  { id: 'gap', label: 'Evidence' },
  { id: 'void', label: 'Gap' },
  { id: 'iq', label: 'Thesis' },
  { id: 'pipeline', label: 'Pipeline' },
  { id: 'capabilities', label: 'Unlock' },
  { id: 'research', label: 'Sovereign' },
  { id: 'collaborate', label: 'Alliance' },
]

export default function StoryRail({ progress, chapter }) {
  return (
    <aside className="story-rail" aria-label="Story progress">
      <div className="story-rail-track">
        <span className="story-rail-fill" style={{ transform: `scaleY(${progress})` }} />
      </div>
      <ol>
        {CHAPTERS.map((item, index) => (
          <li key={item.id}>
            <a
              href={`#${item.id}`}
              className={index === chapter ? 'is-current' : index < chapter ? 'is-done' : ''}
              aria-current={index === chapter ? 'true' : undefined}
            >
              <i />
              <span>{item.label}</span>
            </a>
          </li>
        ))}
      </ol>
      <p className="mono story-rail-pct">{Math.round(progress * 100)}%</p>
    </aside>
  )
}
