import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()], // 配置插件
  server: {
    port: 3000, // 配置服务器端口号
    open: true, // 自动打开浏览器
  }
})