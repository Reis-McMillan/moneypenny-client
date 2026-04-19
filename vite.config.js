import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), 'VITE_')

  return {
    plugins: [vue(), tailwindcss()],
    server: {
      proxy: {
        '/auth': {
          target: env.VITE_VERYS_ORIGIN || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/auth/, ''),
        },
        '/api': {
          target: env.VITE_MONEYPENNY_ORIGIN || 'http://localhost:8080',
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ''),
        },
      },
    },
  }
})
