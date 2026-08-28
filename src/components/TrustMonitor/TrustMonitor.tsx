import { useState } from 'react'
import { useVoyageProgress } from '../../context/VoyageProgressContext'
import StatsOverview from './StatsOverview'
import RadarMap from './RadarMap'
import LogsStream from './LogsStream'
import SimulationControl from './SimulationControl'
import DetailsInspector from './DetailsInspector'
import styles from './TrustMonitor.module.css'

export default function TrustMonitor() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'radar' | 'logs' | 'sim'>('radar')
  const { selectedEntityId, simulatedEntities } = useVoyageProgress()

  const selectedEntity = simulatedEntities.find((e) => e.id === selectedEntityId)

  // Calculate live statistics
  const totalProcessed = 2415082 + Math.floor(Date.now() / 3600000) * 12
  const verifiedCount = simulatedEntities.filter((e) => e.trustStatus === 'VERIFIED').length
  const warningCount = simulatedEntities.filter((e) => e.trustStatus === 'WARNING').length
  const suspiciousCount = simulatedEntities.filter((e) => e.trustStatus === 'SUSPICIOUS').length
  const rejectedCount = simulatedEntities.filter((e) => e.trustStatus === 'REJECTED').length

  const systemConfidence = Math.max(
    65,
    Math.round(
      (simulatedEntities.reduce((acc, curr) => acc + curr.trustScore, 0) / simulatedEntities.length) * 10
    ) / 10
  )

  return (
    <div className={styles.container}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h3>INTEL CONSOLE</h3>
          <span>SIGNAL AUTH CONSOLE</span>
        </div>
        <nav className={styles.navMenu}>
          <button 
            className={`${styles.navItem} ${activeTab === 'dashboard' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('dashboard')}
          >
            <span className={styles.icon}>📊</span> Dashboard Overview
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'radar' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('radar')}
          >
            <span className={styles.icon}>📡</span> Virtual Sky / Globe
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'logs' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('logs')}
          >
            <span className={styles.icon}>📝</span> Event Log Stream
          </button>
          <button 
            className={`${styles.navItem} ${activeTab === 'sim' ? styles.navItemActive : ''}`}
            onClick={() => setActiveTab('sim')}
          >
            <span className={styles.icon}>⚡</span> Threat Simulator
          </button>
        </nav>
        <div className={styles.systemStatus}>
          <label>SYSTEM HEALTH</label>
          <strong className={styles.confidenceText}>{systemConfidence}% CONFIDENCE</strong>
          <span className={styles.statusLabel}>
            {systemConfidence > 85 ? '🟢 SECURE INTEGRITY' : systemConfidence > 70 ? '🟡 UNSTABLE INTEGRITY' : '🔴 THREAT CORRUPTION'}
          </span>
        </div>
      </aside>

      <main className={styles.content}>
        {activeTab === 'dashboard' && (
          <StatsOverview 
            totalProcessed={totalProcessed}
            verifiedCount={verifiedCount}
            warningCount={warningCount}
            suspiciousCount={suspiciousCount}
            rejectedCount={rejectedCount}
            systemConfidence={systemConfidence}
          />
        )}
        {activeTab === 'radar' && <RadarMap />}
        {activeTab === 'logs' && <LogsStream />}
        {activeTab === 'sim' && <SimulationControl />}
      </main>

      {selectedEntity && (
        <aside className={styles.inspector}>
          <DetailsInspector entity={selectedEntity} />
        </aside>
      )}
    </div>
  )
}
