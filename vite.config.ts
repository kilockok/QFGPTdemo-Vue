import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // 适配子目录部署（GitHub Pages/Vercel 静态托管）
  plugins: [vue()],
  server: {
    port: 5173,
    open: true
  },
  ssr: {
    noExternal: []
  },
})