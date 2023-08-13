import { defineConfig } from 'vite'
import { VitePWA } from 'vite-plugin-pwa'
import preact from '@preact/preset-vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    preact(),
    VitePWA({registerType: 'autoUpdate'})
  ],
})
