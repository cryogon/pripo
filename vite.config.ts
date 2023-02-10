import { fileURLToPath, URL } from "node:url";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { VitePWAOptions } from "vite-plugin-pwa";
import { VitePWA } from "vite-plugin-pwa";
const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  base: "/",
  includeAssets: [
    "icon.svg",
    "manifest-icon-192.maskable.png",
    "manifest-icon-512.maskable.png",
    "icons/apple-icon-180.png",
  ],
  devOptions: {
    enabled: true,
  },
  manifest: {
    name: "pripo",
    start_url: "/?home=true",
    icons: [
      {
        src: "manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "manifest-icon-192.maskable.png",
        sizes: "192x192",
        type: "image/png",
        purpose: "maskable",
      },
      {
        src: "manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "any",
      },
      {
        src: "manifest-icon-512.maskable.png",
        sizes: "512x512",
        type: "image/png",
        purpose: "maskable",
      },
    ],
    theme_color: "#5f9ea0",
    background_color: "#161616",
    display: "fullscreen",
    orientation: "portrait",
  },
};
export default defineConfig({
  plugins: [vue(), vueJsx(), VitePWA(pwaOptions)],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
