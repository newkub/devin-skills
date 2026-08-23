import { defineConfig } from "bunup";

export default defineConfig({
  entry: ["src/index.ts", "src/presentation/cli.ts"],
  outDir: "dist",
  format: "esm",
  sourceBase: "src",
  dts: { splitting: true },
});
