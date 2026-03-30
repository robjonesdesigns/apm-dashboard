import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlantOverview from './components/PlantOverview'
import AssetInspection from './components/AssetInspection'
import Trends from './components/Trends'
import NotificationsPanel from './components/NotificationsPanel'
import useIsMobile from './hooks/useIsMobile'

// ADR-028: Sidebar shows 4 plant-level screens. Asset Inspection reached via Asset Table row click.
const VIEWS = {
  overview:       PlantOverview,
  events:         PlantOverview,   // placeholder until dedicated screen
  inspection:     AssetInspection,
  workorders:     PlantOverview,   // placeholder until dedicated screen
  investigations: PlantOverview,   // placeholder until dedicated screen
  trends:         Trends,
  settings:       PlantOverview,   // placeholder
}

export default function App() {
  const [view, setView]                     = useState('overview')
  const [selectedAsset, setSelectedAsset]   = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [sidebarOpen, setSidebarOpen]       = useState(false)
  const [dense, setDense]                   = useState(() => localStorage.getItem('apm-dense') === 'true')
  const isMobile = useIsMobile()

  useEffect(() => {
    localStorage.setItem('apm-dense', dense)
  }, [dense])

  const navigate = (target, options = {}) => {
    if (target === 'inspection' && options.asset) {
      setSelectedAsset(options.asset)
    }
    if (target === 'trends' && options.attribute) {
      setSelectedAttribute(options.attribute)
    }
    setView(target)
  }

  const View = VIEWS[view] ?? PlantOverview

  return (
    <div className={dense ? 'dense' : ''} style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      <a className="skip-link" href="#main-content">Skip to main content</a>
      <TopBar
        view={view}
        selectedAsset={selectedAsset}
        onNavigate={navigate}
        onToggleNotifications={() => setNotificationsOpen((prev) => !prev)}
        notificationsOpen={notificationsOpen}
        onToggleSidebar={() => setSidebarOpen((prev) => !prev)}
        isMobile={isMobile}
        dense={dense}
        onToggleDense={() => setDense(prev => !prev)}
      />

      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          marginTop: 'var(--header-height)',
        }}
      >
        <Sidebar
          view={view}
          onNavigate={(id) => { navigate(id); if (isMobile) setSidebarOpen(false) }}
          isMobile={isMobile}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />

        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            overflow: 'hidden',
            marginLeft: isMobile ? 0 : 'var(--sidebar-rail)',
          }}
        >
          <main
            id="main-content"
            {...(isMobile && (sidebarOpen || notificationsOpen) ? { inert: '' } : {})}
            style={{
              flex: '1 1 auto',
              overflowY: 'auto',
              overflowX: 'hidden',
            }}
          >
            <div
              className="page-padding"
              style={{ paddingTop: 'var(--spacing-24)', paddingBottom: 'var(--spacing-24)' }}
            >
              <View
                onNavigate={navigate}
                selectedAsset={selectedAsset}
                selectedAttribute={selectedAttribute}
              />
            </div>
          </main>

          <NotificationsPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            assetFilter={view === 'inspection' ? selectedAsset?.name : null}
            isMobile={isMobile}
          />
        </div>
      </div>
    </div>
  )
}
