import { Outlet, useOutletContext } from 'react-router'

// Nested routes under /assets/:id. The index route renders Asset Inspection.
// Deeper paths (trends, performance, fault-tree, attributes) render their
// own components via the <Outlet />.
export default function AssetRoute() {
  const ctx = useOutletContext()
  return <Outlet context={ctx} />
}
