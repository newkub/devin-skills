import { defineConfig } from "bunup";

export default defineConfig({
  entry: ["src/index.ts", "src/cli.ts"],
  outdir: "dist",
  dts: true,
});
