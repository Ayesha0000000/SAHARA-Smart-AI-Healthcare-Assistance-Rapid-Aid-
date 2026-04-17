import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import os from 'os'

export default defineConfig({
  plugins: [react()],
  cacheDir: 'D:/vite_cache',
})