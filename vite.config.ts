import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import svgr from 'vite-plugin-svgr'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    svgr({
      include: './public/**/*.svg?react',
    }),
  ],
  resolve: {
    alias: [
      {find: '@icons', replacement: '/public/assets/icons'}
    ]
  }
})