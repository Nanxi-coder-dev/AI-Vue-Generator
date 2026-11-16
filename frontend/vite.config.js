import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    // 开发环境代理：前端请求 /api/** 时转发到后端 Express（3000 端口）
    // 这样前端代码里直接写 baseURL: '/api' 即可，避免跨域与端口硬编码
    proxy: {
      '/api': {
        target: 'http://localhost:3000',
        changeOrigin: true,
      },
    },
  },
})
