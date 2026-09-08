import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Deployed as a GitHub Pages *project* site, so production assets are served
// from /jdflores-dev/. Dev stays at '/' so local URLs are unchanged;
// `vite preview` runs in production mode and therefore matches the real deploy.
// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  base: mode === 'production' ? '/jdflores-dev/' : '/',
  plugins: [react()],
}))
