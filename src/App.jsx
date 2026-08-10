import Header from './components/Header'
import Footer from './components/Footer'
import SignalField from './components/SignalField'
import SignalCursor from './components/SignalCursor'
import OpeningChapter from './components/story/OpeningChapter'
import ThreatChapter from './components/story/ThreatChapter'
import EvidenceChapter from './components/story/EvidenceChapter'
import GapChapter from './components/story/GapChapter'
import ThesisChapter from './components/story/ThesisChapter'
import PipelineChapter from './components/story/PipelineChapter'
import UnlockChapter from './components/story/UnlockChapter'
import SovereignChapter from './components/story/SovereignChapter'
import AllianceChapter from './components/story/AllianceChapter'
import StoryRail from './components/story/StoryRail'
import { useGlobalProgress, useLenis, useReducedMotion } from './hooks/useMotion'

const LABELS = [
  'Origin',
  'Threat',
  'Evidence',
  'Gap',
  'Thesis',
  'Pipeline',
  'Unlock',
  'Sovereign',
  'Alliance',
]

export default function App() {
  const reduced = useReducedMotion()
  useLenis(reduced)
  const { progress, chapter } = useGlobalProgress()

  return (
    <div className="story-app">
      <SignalField progress={progress} chapter={chapter} />
      <SignalCursor />
      <Header chapterLabel={LABELS[chapter] || 'Origin'} />
      <StoryRail progress={progress} chapter={chapter} />

      <main className="story-main">
        <OpeningChapter />
        <ThreatChapter />
        <EvidenceChapter />
        <GapChapter />
        <ThesisChapter />
        <PipelineChapter />
        <UnlockChapter />
        <SovereignChapter />
        <AllianceChapter />
      </main>

      <Footer />
    </div>
  )
}
