import { useState } from 'react'
import Sidebar from './components/Sidebar'
import TopBar from './components/TopBar'
import AssetHealth from './components/AssetHealth'
import AssetDetails from './components/AssetDetails'
import Trends from './components/Trends'
import NotificationsPanel from './components/NotificationsPanel'

const VIEWS = {
  health: AssetHealth,
  details: AssetDetails,
  trends: Trends,
}

export default function App() {
  const [view, setView] = useState('health')
  const [selectedAsset, setSelectedAsset] = useState(null)
  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [selectedAttribute, setSelectedAttribute] = useState(null)

  const navigate = (target, options = {}) => {
    if (target === 'details' && options.asset) {
      setSelectedAsset(options.asset)
    }
    if (target === 'trends' && options.attribute) {
      setSelectedAttribute(options.attribute)
    }
    setView(target)
  }

  const View = VIEWS[view]

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar view={view} onNavigate={navigate} />
      <div className="flex-1 flex flex-col min-w-0">
        <TopBar
          view={view}
          selectedAsset={selectedAsset}
          onNavigate={navigate}
          onToggleNotifications={() => setNotificationsOpen(!notificationsOpen)}
          notificationsOpen={notificationsOpen}
        />
        <div className="flex-1 flex overflow-hidden">
          <div className="flex-1 overflow-y-auto overflow-x-hidden" style={{ transition: 'flex 0.2s ease' }}>
            <div className="page-padding" style={{ paddingTop: 'var(--spacing-24)', paddingBottom: 'var(--spacing-24)' }}>
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
            assetFilter={view === 'details' ? selectedAsset?.name : null}
          />
        </div>
      </div>
    </div>
  )
}
