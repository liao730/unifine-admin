import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig(({ command }) => {
  return {
  base: '/admin/',
  plugins: [vue()],
  server: {
    port: 5174,
    proxy: {
      // 将所有以 /api 开头的请求转发到后端
      '/altra/api': {
        target: 'http://localhost:8080',
        // target: 'http://backend:8080',
        changeOrigin: true,
        // 如果后端接口路径里没有 /api，可以开启路径重写
        // rewrite: (path) => path.replace(/^\/api/, '') 
      }
    }
  }
}})