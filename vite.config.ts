import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Base URL for GitHub Pages project site: https://<user>.github.io/bigOvisualizer/
  // Adjust if you use a different repo name or a custom domain.
  base: '/bigOvisualizer/',
  plugins: [react()],
})
