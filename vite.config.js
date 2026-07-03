import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { readFileSync, writeFileSync } from 'node:fs'
import { resolve } from 'node:path'

// Stamp the service worker's cache name with a unique build id so every deploy
// invalidates the previous cache (the SW's activate handler deletes non-matching
// caches). Runs after the bundle is written to dist/.
function stampServiceWorker() {
  return {
    name: 'stamp-service-worker',
    apply: 'build',
    closeBundle() {
      const file = resolve(process.cwd(), 'dist/sw.js')
      const stamp = Date.now().toString(36)
      writeFileSync(file, readFileSync(file, 'utf8').replace(/__BUILD__/g, stamp))
    },
  }
}

export default defineConfig({
  plugins: [react(), stampServiceWorker()],
  server: { port: 5199, strictPort: true },
})
