import { tanstackStart } from "@tanstack/solid-start/plugin/vite";
import UnoCSS from "unocss/vite";
import { defineConfig } from "vite";
import solid from "vite-plugin-solid";

export default defineConfig({
  plugins: [
    tanstackStart({
      router: {
        routeFileIgnorePattern: "\\.meta\\.[tj]sx?$",
        autoCodeSplitting: true,
      },
    }),
    UnoCSS(),
    solid({ ssr: true }),
  ],
  resolve: {
    tsconfigPaths: true,
  },
});
