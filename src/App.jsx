import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import PlantOverview from './components/PlantOverview'
import AssetInspection from './components/AssetInspection'
import Trends from './components/Trends'
import NotificationsPanel from './components/NotificationsPanel'

const VIEWS = {
  // Current screens
  health:   PlantOverview,
  details:  AssetInspection,
  trends:   Trends,
  // New screen IDs (map to same components until dedicated screens are built)
  overview:       PlantOverview,
  inspection:     AssetInspection,
  rootcause:      PlantOverview,   // placeholder
  workorders:     PlantOverview,   // placeholder
  investigations: PlantOverview,   // placeholder
  settings:       PlantOverview,   // placeholder
}

export default function App() {
  const [view, setView]                     = useState('health')
  const [selectedAsset, setSelectedAsset]   = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState(null)
  const [sidebarExpanded, setSidebarExpanded]     = useState(false)

  const navigate = (target, options = {}) => {
    if ((target === 'details' || target === 'inspection') && options.asset) {
      setSelectedAsset(options.asset)
    }
    if (target === 'trends' && options.attribute) {
      setSelectedAttribute(options.attribute)
    }
    setView(target)
  }

  const View = VIEWS[view] ?? PlantOverview

  return (
    <div style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
      {/* Fixed top bar — rendered at z-index 10000 */}
      <TopBar
        view={view}
        selectedAsset={selectedAsset}
        onNavigate={navigate}
        onToggleNotifications={() => setNotificationsOpen((prev) => !prev)}
        notificationsOpen={notificationsOpen}
        onToggleSidebar={() => setSidebarExpanded((prev) => !prev)}
      />

      {/* Body below fixed top bar */}
      <div
        style={{
          display: 'flex',
          flex: '1 1 auto',
          overflow: 'hidden',
          marginTop: 'var(--header-height)',
        }}
      >
        {/* Fixed sidebar — leaves a matching space via the margin-left on the content */}
        <Sidebar
          view={view}
          onNavigate={navigate}
          expanded={sidebarExpanded}
          onToggle={() => setSidebarExpanded((prev) => !prev)}
        />

        {/* Scrollable content — pushes right by the sidebar width */}
        <div
          style={{
            flex: '1 1 auto',
            display: 'flex',
            overflow: 'hidden',
            marginLeft: sidebarExpanded ? 'var(--sidebar-width)' : 'var(--sidebar-rail)',
            transition: `margin-left var(--motion-moderate) var(--ease-productive)`,
          }}
        >
          <div
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
          </div>

          <NotificationsPanel
            open={notificationsOpen}
            onClose={() => setNotificationsOpen(false)}
            assetFilter={(view === 'details' || view === 'inspection') ? selectedAsset?.name : null}
          />
        </div>
      </div>
    </div>
  )
}
