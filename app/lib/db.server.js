import postgres from 'postgres'

// Module-level Timescale connection pool. Vercel Fluid Compute reuses
// SSR handler instances, so the pool persists across requests on the
// same warm instance.
let sql = null

export function getSql() {
  if (sql) return sql
  const url = process.env.DATABASE_URL
  if (!url) throw new Error('Missing DATABASE_URL')
  sql = postgres(url, {
    ssl: 'require',
    max: 5,
    idle_timeout: 20,
    connect_timeout: 10,
  })
  return sql
}
