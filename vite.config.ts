import { fileURLToPath, URL } from "node:url";
import fs from "node:fs";
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import vueJsx from "@vitejs/plugin-vue-jsx";
import type { VitePWAOptions } from "vite-plugin-pwa";
import { VitePWA } from "vite-plugin-pwa";
import Markdown from "vite-plugin-md";
const { icons } = JSON.parse(fs.readFileSync("./icons.json", "utf-8"));
const pwaOptions: Partial<VitePWAOptions> = {
  mode: "development",
  registerType: "autoUpdate",
  base: "/",
  includeAssets: [
    "icon.svg",
    "icons/ios/192.png",
    "icons/ios/512.png",
    "icons/ios/180.png",
  ],
  manifest: {
    name: "pripo",
    start_url: "/?home=true",
    icons,
    theme_color: "#5f9ea0",
    background_color: "#161616",
    shortcuts: [
      {
        name: "Publish",
        url: "/publish",
        description: "Thinking something alone! why not share it with world",
        short_name: "Post",
        icons: [{ src: "/icons/post-icon.png", sizes: "96x96" }],
      },
      {
        name: "Notifications",
        url: "/notifications",
        description: "Check if you got something new",
        short_name: "notify",
        icons: [{ src: "/icons/message-icon.png", sizes: "96x96" }],
      },
      {
        name: "Chat",
        url: "/chat",
        description: "Missing someone",
        short_name: "chat",
        icons: [{ src: "/icons/notification-icon.png", sizes: "96x96" }],
      },
    ],
    orientation: "portrait",
  },
};
export default defineConfig({
  plugins: [vue(), vueJsx(), VitePWA(pwaOptions), Markdown()],
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
    },
  },
});
