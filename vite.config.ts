import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'node:path'

// https://vitejs.dev/config/
// `base` must match the GitHub Pages path. Change this when forking.
// Example: for `github.com/your-name/dsa-quest`, base is `/dsa-quest/`.
export default defineConfig({
  base: '/dsa-quest/',
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        // Allows @use '@carbon/react' and resolving its internal `~` paths.
        loadPaths: ['node_modules'],
        // Silence the long-running deprecation warnings from Carbon's Sass.
        quietDeps: true,
        silenceDeprecations: ['mixed-decls', 'global-builtin', 'import'],
      },
    },
  },
  build: {
    chunkSizeWarningLimit: 1500,
  },
})
