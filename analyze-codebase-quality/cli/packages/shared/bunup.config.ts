import { defineConfig } from "bunup";

export default defineConfig({
  entry: ["src/index.ts"],
  outdir: "dist",
  dts: {
    splitting: true,
  },
});
