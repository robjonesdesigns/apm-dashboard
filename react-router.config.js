import { vercelPreset } from '@vercel/react-router/vite'

// React Router 7 framework-mode config for APM.
//
// ssr: true enables server-side rendering. Every route runs through
// server loaders first. API endpoints live as RR7 resource routes
// under app/routes/api.*.jsx and share the same server runtime.
//
// The trade: dashboards show slightly stale first paint (SSR snapshot
// is pre-fetch state). Client-side revalidation via useRevalidator
// keeps data fresh after hydration. Worth it for the dev ergonomics
// win over a separate api/ Functions directory.
//
// appDirectory: 'app' is the framework convention. Existing screens
// remain under src/components/ and are imported from app/routes/*.
//
// vercelPreset handles the Vercel deploy pipeline: SSR handler becomes
// a Vercel Function, static assets go to the CDN.

/** @type {import('@react-router/dev/config').Config} */
export default {
  ssr: true,
  appDirectory: 'app',
  presets: [vercelPreset()],
}
