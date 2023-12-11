import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import dotPathFixPlugin from './src/plugins/dotPathFixPlugin';

// https://vitejs.dev/config/
export default defineConfig({
  base: '/atlas-website-vue3/',
  optimizeDeps: {
    esbuildOptions: {
      target: "esnext",
    },
  },
  build: {
    target: "esnext",
  },
  plugins: [
    vue(),
    vueJsx(),
    dotPathFixPlugin(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
