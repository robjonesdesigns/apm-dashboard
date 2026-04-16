import { defineConfig } from 'vite'
import { reactRouter } from '@react-router/dev/vite'
import tailwindcss from '@tailwindcss/vite'

// RR7 framework-mode plugin owns Fast Refresh and build orchestration.
// Do NOT add @vitejs/plugin-react alongside it -- the two conflict.
export default defineConfig({
  plugins: [tailwindcss(), reactRouter()],
})
