import { defineConfig } from 'vite'
import { targetsPlugin } from './scripts/targets-plugin.js'

export default defineConfig({
  server: { host: true, open: true },
  build: { target: 'esnext' },
  plugins: [targetsPlugin()],
})
