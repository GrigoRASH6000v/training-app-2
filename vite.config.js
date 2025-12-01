import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa';
import tailwindcss from '@tailwindcss/vite'
import path from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === 'development';

  return {
    base: isDev ? '/' : '/training-app-2/',
    plugins: [
      vue(),
      tailwindcss(),
      VitePWA({
        devOptions: {
          enabled: true // Для тестирования в разработке
        },
        registerType: 'autoUpdate',
        includeAssets: ['favicon.ico', 'apple-touch-icon.png', 'masked-icon.svg'],
        manifest: {
          name: 'Ваше приложение',
          short_name: 'Приложение',
          description: 'Описание приложения',
          theme_color: '#ffffff',
          icons: [
            { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
            { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
            { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' }
          ],
          start_url: '/',
          display: 'standalone',
          background_color: '#ffffff'
        }
      })
    ],
    resolve: {
      alias: {
        '~': path.resolve(__dirname, 'src')
      },
      extensions: [
        '.vue',
        '.js',
        '.ts',
        '.jsx',
        '.tsx',
        '.json',
        '.mjs'
      ],
    },
  }
})
