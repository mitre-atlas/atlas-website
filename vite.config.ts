import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

import Markdown from 'vite-plugin-md'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  return {
    assetsInclude: ['**/*.png'],
    base: process.env.NODE_ENV === 'production'
      ? `/${env.CI_PROJECT_NAME}`
      : '/',
    optimizeDeps: {
      esbuildOptions: {
        target: "esnext",
      },
    },
    build: {
      target: "esnext",
    },
    plugins: [
      vueJsx(),
      vue({
        include: [/\.vue$/, /\.md$/],
      }),
      Markdown(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
})
