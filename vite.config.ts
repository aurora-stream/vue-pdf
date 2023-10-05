import { PluginOption, defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { resolve } from 'node:path'
import dts from 'vite-plugin-dts'
import { visualizer } from "rollup-plugin-visualizer";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    dts({ 
      rollupTypes: true,
      include: ["./src/components"],
     }),
    visualizer({
      template: "treemap", 
      open: true,
      gzipSize: true,
      brotliSize: true,
      filename: "analyse.html", 
    }) as PluginOption
  ],
  build: {
    lib: {
      entry: resolve(__dirname, './src/components/index.ts'),
      formats: ['es', 'umd'],
      name: '@v2v/vue-pdf',
      fileName: 'index',
    },
    rollupOptions: {
      external: [
        'vue',
        'pdfjs-dist',
        '@v2v/pdf'
      ],
      output: {
        exports: 'named',
        globals: {
          'vue': 'vue',
          'pdfjs-dist': 'PDFJS',
        },
      }
    },
    minify: true
  },
})
