import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // En dev, les appels à /api sont redirigés vers le serveur Symfony (backend/)
      '/api': {
        // Dans Docker, API_URL vaut http://backend:8000
        target: process.env.API_URL ?? 'http://127.0.0.1:8000',
        changeOrigin: true,
      },
    },
  },
})
