import { useState, useEffect } from 'react'
import { Outlet, data, useLocation, useNavigate, useParams } from 'react-router'
import Sidebar from '../../src/components/Sidebar'
import TopBar from '../../src/components/TopBar'
import NotificationsPanel from '../../src/components/NotificationsPanel'
import HelpModal from '../../src/components/HelpPanel'
import ErrorBoundary from '../../src/components/ErrorBoundary'
import useIsMobile from '../../src/hooks/useIsMobile'
import { ASSETS } from '../../src/data/baytown'
import { requireAuth } from '../lib/auth.server'

// Map URL path to the `view` identifier existing TopBar/Sidebar components
// expect. As routes get dedicated screens, extend this map.
const PATH_TO_VIEW = {
  '/': 'overview',
  '/events': 'events',
  '/inspections': 'inspections',
  '/work-orders': 'workorders',
  '/investigations': 'investigations',
  '/hmi': 'hmi',
  '/design-system': 'design-system',
}

function viewFromPath(pathname) {
  if (PATH_TO_VIEW[pathname]) return PATH_TO_VIEW[pathname]
  if (pathname.startsWith('/assets/')) {
    if (pathname.endsWith('/trends')) return 'trends'
    if (pathname.endsWith('/performance')) return 'performance'
    if (pathname.endsWith('/fault-tree')) return 'fault-tree'
    if (pathname.endsWith('/attributes')) return 'attributes'
    return 'inspection'
  }
  return 'overview'
}

function viewToPath(target, opts = {}) {
  switch (target) {
    case 'overview': return '/'
    case 'events': return '/events'
    case 'inspections': return '/inspections'
    case 'workorders': return '/work-orders'
    case 'investigations': return '/investigations'
    case 'hmi': return '/hmi'
    case 'design-system': return '/design-system'
    case 'inspection':
      return opts.asset?.id ? `/assets/${opts.asset.id}` : '/'
    case 'trends':
      return opts.asset?.id ? `/assets/${opts.asset.id}/trends` : '/'
    default: return '/'
  }
}

export async function loader({ request }) {
  const auth = await requireAuth(request)
  return data({ auth }, { headers: auth.headers })
}

export default function AppLayout() {
  const location = useLocation()
  const navigate = useNavigate()
  const params = useParams()
  const isMobile = useIsMobile()

  const view = viewFromPath(location.pathname)
  const selectedAsset = params.id ? ASSETS.find((a) => a.id === params.id) || null : null

  const [notificationsOpen, setNotificationsOpen] = useState(false)
  const [helpOpen, setHelpOpen] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [dense, setDense] = useState(() =>
    typeof window === 'undefined' ? true : localStorage.getItem('apm-dense') !== 'false'
  )

  useEffect(() => {
    localStorage.setItem('apm-dense', dense)
  }, [dense])

  useEffect(() => {
    function handleKeyDown(e) {
      if (e.ctrlKey && e.shiftKey && e.key === 'D') {
        e.preventDefault()
        navigate(location.pathname === '/design-system' ? '/' : '/design-system')
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [location.pathname, navigate])

  function handleNavigate(target, options = {}) {
    navigate(viewToPath(target, options))
    if (isMobile) setSidebarOpen(false)
  }

  return (
    <>
      <div
        className={dense ? 'dense' : ''}
        style={{ height: '100vh', overflow: 'hidden', display: 'flex', flexDirection: 'column' }}
      >
        <a className="skip-link" href="#main-content">Skip to main content</a>
        <TopBar
          view={view}
          selectedAsset={selectedAsset}
          onNavigate={handleNavigate}
          onToggleNotifications={() => { setNotificationsOpen((p) => !p); setHelpOpen(false) }}
          notificationsOpen={notificationsOpen}
          onToggleHelp={() => { setHelpOpen((p) => !p); setNotificationsOpen(false) }}
          helpOpen={helpOpen}
          onToggleSidebar={() => setSidebarOpen((p) => !p)}
          isMobile={isMobile}
          dense={dense}
          onToggleDense={() => setDense((p) => !p)}
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
            onNavigate={handleNavigate}
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
              <ErrorBoundary>
                <div
                  className="page-padding"
                  style={{ paddingTop: 'var(--spacing-24)', paddingBottom: 'var(--spacing-24)' }}
                >
                  <Outlet context={{ onNavigate: handleNavigate, selectedAsset, isMobile }} />
                </div>
              </ErrorBoundary>
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

      <HelpModal open={helpOpen} onClose={() => setHelpOpen(false)} />
    </>
  )
}
