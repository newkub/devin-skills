import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [solid()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      "/api": "http://localhost:3000",
    },
  },
  build: { target: "esnext" },
});
