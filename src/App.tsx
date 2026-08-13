import ProgressRail from './components/ProgressRail'
import Nav from './components/Nav'
import Voyage from './components/Voyage'
import Footer from './components/Footer.tsx'
import DemoDock from './components/DemoDock'

export default function App() {
  return (
    <>
      <Voyage
        chrome={
          <>
            <ProgressRail />
            <Nav />
            <Footer />
          </>
        }
      />
      <DemoDock />
    </>
  )
}
