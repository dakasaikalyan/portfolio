import Navbar from './components/Navbar';
import Hero from './components/Hero';
import ArchitectureDiagram from './components/ArchitectureDiagram';
import TradingPlatformDemo from './components/TradingPlatformDemo';
import BenchmarkImpact from './components/BenchmarkImpact';
import CodeViewer from './components/CodeViewer';
import TechMatrix from './components/TechMatrix';
import Experience from './components/Experience';
import Projects from './components/Projects';
import ContactFooter from './components/ContactFooter';

export default function App() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-dark)' }}>
      <Navbar />
      <main>
        <Hero />
        <ArchitectureDiagram />
        <TradingPlatformDemo />
        <BenchmarkImpact />
        <CodeViewer />
        <Experience />
        <TechMatrix />
        <Projects />
      </main>
      <ContactFooter />
    </div>
  );
}
