import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { fileURLToPath, URL } from 'node:url'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  server: {
    proxy: {
      // Proxy API requests to bypass CORS during development
      '/api': {
        target: 'https://public-api.tracker.gg',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
        configure: (proxy, options) => {
          proxy.on('error', (err, req, res) => {
            console.log('proxy error', err)
          })
          proxy.on('proxyReq', (proxyReq, req, res) => {
            console.log('proxying:', req.method, req.url, 'to', options.target + proxyReq.path)
          })
          proxy.on('proxyRes', (proxyRes, req, res) => {
            console.log('received:', proxyRes.statusCode, req.url)
          })
        }
      }
    }
  },
  build: {
    // Set chunk size warning limit to 150KB (appropriate for Vue apps per web.dev)
    // This prevents bundle bloat and keeps time-to-interactive low
    chunkSizeWarningLimit: 150,

    // Use esbuild minifier (Vite default, 20-40x faster than terser)
    // Only 1-2% worse compression ratio but significantly faster builds
    minify: 'esbuild',

    // Target modern browsers for smaller output (ES2015 = ES6)
    // Balles browser compatibility with bundle size optimization
    target: 'es2015',

    rollupOptions: {
      output: {
        // Manual code splitting for better browser caching
        // Separates vendor code from app code so vendor chunks cache longer
        manualChunks(id) {
          // Split vendor code from app code
          if (id.includes('node_modules')) {
            // Separate Vue core (vue, pinia, vue-router) for stable long-term cache
            // These change infrequently, so users benefit from cached versions
            if (id.includes('vue') || id.includes('pinia') || id.includes('@vue')) {
              return 'vue-vendor'
            }
            // Separate VueUse (frequently updated utility library)
            // Keeps Vue core cache intact when VueUse updates
            if (id.includes('@vueuse')) {
              return 'vueuse'
            }
            // Other vendor code (rarely used in this small app)
            return 'vendor'
          }
        }
      }
    }
  }
})
