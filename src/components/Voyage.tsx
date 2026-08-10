import { useRef, type ReactNode } from 'react'
import { VoyageProgressProvider } from '../context/VoyageProgressContext'
import { useScrollProgress } from '../hooks/useScrollProgress'
import Beats from './Beats'
import IntroHero from './IntroHero'
import ScrollCue from './ScrollCue'
import Ship from './Ship'
import SkyCanvas from './SkyCanvas'
import WaveCanvas from './WaveCanvas'
import styles from './Voyage.module.css'

function StickyStage() {
  return (
    <div className={styles.sticky}>
      <SkyCanvas />
      <WaveCanvas />
      <Ship />
      <IntroHero />
    </div>
  )
}

export default function Voyage({ chrome }: { chrome?: ReactNode }) {
  const voyageRef = useRef<HTMLElement | null>(null)
  const progress = useScrollProgress(voyageRef)

  return (
    <VoyageProgressProvider value={progress}>
      {chrome}
      <section className={styles.voyage} id="top" ref={voyageRef}>
        <StickyStage />
        <Beats />
        <ScrollCue />
      </section>
    </VoyageProgressProvider>
  )
}
