import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  base: '/Gemastik/',

  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico'],

      manifest: {
        name: 'Delcion — PantauAnak Manado',
        short_name: 'Delcion',
        description: 'Sistem Monitoring Pekerja Anak Kota Manado',
        theme_color: '#0B1F3A',
        background_color: '#0B1F3A',
        display: 'standalone',
        orientation: 'portrait-primary'
      }
    })
  ]
})