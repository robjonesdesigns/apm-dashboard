import { layout, index, route } from '@react-router/dev/routes'

// Two tiers of protection:
// - /signin is public
// - Every other route is wrapped in the `_app` layout, whose clientLoader
//   redirects to /signin if the Supabase session is missing.
//
// Asset-scoped screens (Asset Inspection, Trends, Performance, Fault Tree,
// Attribute Overview) nest under /assets/:id so the URL carries asset
// identity and deep-links work.

export default [
  route('signin', 'routes/signin.jsx'),

  layout('routes/_app.jsx', [
    index('routes/_index.jsx'),
    route('events', 'routes/events.jsx'),
    route('inspections', 'routes/inspections.jsx'),
    route('work-orders', 'routes/work-orders.jsx'),
    route('investigations', 'routes/investigations.jsx'),
    route('hmi', 'routes/hmi.jsx'),
    route('design-system', 'routes/design-system.jsx'),

    route('assets/:id', 'routes/assets.$id.jsx', [
      index('routes/assets.$id._index.jsx'),
      route('trends', 'routes/assets.$id.trends.jsx'),
      route('performance', 'routes/assets.$id.performance.jsx'),
      route('fault-tree', 'routes/assets.$id.fault-tree.jsx'),
      route('attributes', 'routes/assets.$id.attributes.jsx'),
    ]),
  ]),
]
