import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    svgr(),
    dts(),
  ],
  server: {
    proxy: {
      '/.frontend': {
        target: 'http://localhost:8080',
        changeOrigin: true,
        secure: false,
      }
    }
  },
})