import type { RefObject, ReactNode } from 'react'
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

export default function Voyage({
  voyageRef,
  chrome,
}: {
  voyageRef: RefObject<HTMLElement | null>
  chrome?: ReactNode
}) {
  return (
    <>
      {chrome}
      <section className={styles.voyage} id="top" ref={voyageRef}>
        <StickyStage />
        <Beats />
        <ScrollCue />
      </section>
    </>
  )
}


