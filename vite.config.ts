import { fileURLToPath, URL } from 'node:url'

import { defineConfig, loadEnv } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

import { nodePolyfills } from 'vite-plugin-node-polyfills'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  // Load environment variables named VITE_* from .env
  const env = loadEnv(mode, process.cwd(), '')
  return {
    assetsInclude: ['**/*.png', '**/*.md'],
    // Exposed to the rest of the app as import.meta.env.BASE_URL
    // https://vitejs.dev/guide/env-and-mode#env-variables
    base: env.VITE_BASE_URL,
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
        include: [/\.vue$/],
        template: { transformAssetUrls }
      }),
      vuetify(),
      // Resolve Buffer is not defined for @mdit-vue-plugin-frontmatter
      nodePolyfills(),
    ],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url))
      }
    },
  }
})
