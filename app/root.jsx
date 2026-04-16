import {
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
  data,
  isRouteErrorResponse,
  useLoaderData,
  useRouteError,
} from 'react-router'
import { AuthProvider } from '../src/contexts/AuthContext'
import { getSession } from './lib/auth.server'
import '../src/styles/global.css'

export async function loader({ request }) {
  const { session, headers } = await getSession(request)
  return data({ session }, { headers })
}

export function links() {
  return [
    { rel: 'icon', href: '/favicon.svg', type: 'image/svg+xml' },
    { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
    { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
    {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap',
    },
  ]
}

export function meta() {
  return [
    { title: 'Asset Performance Management' },
    { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
  ]
}

export function Layout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <Meta />
        <Links />
      </head>
      <body>
        {children}
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  )
}

export default function App() {
  const { session } = useLoaderData()
  return (
    <AuthProvider initialSession={session}>
      <Outlet />
    </AuthProvider>
  )
}

export function ErrorBoundary() {
  const error = useRouteError()
  const isResponse = isRouteErrorResponse(error)
  const status = isResponse ? error.status : 500
  const title = isResponse
    ? status === 404
      ? 'Not found'
      : 'Something went wrong'
    : 'Something went wrong'
  const body = isResponse
    ? error.data?.message || error.statusText || 'Unexpected error.'
    : error?.message || 'An unexpected error occurred.'

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--color-bg)',
        color: 'var(--color-text-primary)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 'var(--spacing-24)',
      }}
    >
      <div className="card" style={{ maxWidth: 480 }}>
        <p className="type-meta" style={{ color: 'var(--color-text-helper)' }}>
          {status}
        </p>
        <h1 className="type-heading" style={{ marginTop: 'var(--spacing-8)' }}>
          {title}
        </h1>
        <p className="type-body" style={{ marginTop: 'var(--spacing-16)', color: 'var(--color-text-secondary)' }}>
          {body}
        </p>
      </div>
    </div>
  )
}
