import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['AppImages/**/*'],
      manifest: {
        name: "UniBO Orario",
        short_name: "UniBO",
        description: "Orario lezioni - Università di Bologna",
        theme_color: "#bb2e29",
        background_color: "#ffffff",
        display: "standalone",
        orientation: "portrait",
        icons: [
          {
            src: "AppImages/android/android-launchericon-48-48.png",
            sizes: "48x48",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-72-72.png",
            sizes: "72x72",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-96-96.png",
            sizes: "96x96",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-144-144.png",
            sizes: "144x144",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-192-192.png",
            sizes: "192x192",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
          },
          {
            src: "AppImages/android/android-launchericon-512-512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
        ],
      },
    }),
  ],
})