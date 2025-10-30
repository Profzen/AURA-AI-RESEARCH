import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";
import { VitePWA } from "vite-plugin-pwa";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isDev = mode === "development";

  return {
    server: {
      host: "::",
      port: 8080,
    },
    plugins: [
      react(),
      // lovable-tagger uniquement en dev (comme avant)
      isDev && componentTagger(),
      // PWA plugin : génère manifest + service worker (workbox) en build
      !isDev &&
        VitePWA({
          // autoUpdate permet au SW de s'auto-mettre à jour — tu recevras onNeedRefresh
          registerType: "autoUpdate",
          includeAssets: [
            "favicon.svg",
            "robots.txt",
            "icons/pwa-192.png",
            "icons/pwa-512.png",
            "icons/maskable-icon.png",
          ],
          manifest: {
            name: "AURA Research AI",
            short_name: "AURA AI",
            description: "Assistant scientifique intelligent pour chercheurs",
            theme_color: "#E0F2FE",
            background_color: "#ffffff",
            display: "standalone",
            start_url: "/",
            icons: [
              { src: "icons/pwa-192.png", sizes: "192x192", type: "image/png" },
              { src: "icons/pwa-512.png", sizes: "512x512", type: "image/png" },
              {
                src: "icons/maskable-icon.png",
                sizes: "512x512",
                type: "image/png",
                purpose: "maskable",
              },
            ],
          },
          workbox: {
            // runtime caching rules (exemples raisonnables)
            runtimeCaching: [
              {
                urlPattern: /^\/api\/.*$/i,
                handler: "NetworkFirst",
                options: {
                  cacheName: "api-cache",
                  expiration: { maxEntries: 50, maxAgeSeconds: 24 * 60 * 60 }, // 1 day
                },
              },
              {
                urlPattern: /\.(?:png|jpg|jpeg|svg|gif|webp)$/,
                handler: "CacheFirst",
                options: {
                  cacheName: "image-cache",
                  expiration: { maxEntries: 60, maxAgeSeconds: 30 * 24 * 60 * 60 }, // 30 days
                },
              },
            ],
          },
        }),
    ].filter(Boolean),
    resolve: {
      alias: {
        "@": path.resolve(__dirname, "./src"),
      },
    },
  };
});
