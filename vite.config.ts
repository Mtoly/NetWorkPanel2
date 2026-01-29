import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { visualizer } from "rollup-plugin-visualizer"

export default defineConfig({
  plugins: [
    vue(),
    visualizer({
      gzipSize: true,
      brotliSize: true,
      emitFile: false,
      filename: "visualizer.html",
      template :"sunburst",
      open:false
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  build:{
    assetsDir: 'assets',
    assetsInlineLimit: 8 * 1024,
    rollupOptions:{
      manualChunks(id){
        if(id.includes('node_modules')){
          return "vendor"
        }
      }
    }
  },
  server: {
    open: true,
    port: 3005,
    host: '0.0.0.0'
  },
  base: './'
})
