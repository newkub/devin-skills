# Bun Bundler

`bun build` คือ native bundler สำหรับ JS/TS/JSX/CSS — รองรับ code splitting, plugins, HTML imports และ standalone executables Docs: https://bun.com/docs/bundler

## CLI

```bash
bun build ./index.ts --outdir ./dist
bun build ./index.tsx --outdir ./dist --target browser --minify --splitting
bun build ./index.ts --compile --outfile myapp   # standalone executable
```

| flag | description | default |
|------|-------------|---------|
| `--outdir <dir>` | output directory | `./out` |
| `--outfile <f>` | single output file | — |
| `--target <t>` | `browser`, `bun`, `node` | `browser` |
| `--format <f>` | `esm`, `cjs`, `iife` | `esm` |
| `--splitting` | code splitting (esm only) | off |
| `--minify` / `--minify-whitespace --minify-identifiers --minify-syntax` | minification | off |
| `--sourcemap <m>` | `none`, `linked`, `inline`, `external` | `none` |
| `--compile` | build standalone executable | — |
| `--packages <p>` | `bundle` หรือ `external` all packages | auto |
| `--external <pkg>` | mark package external | — |
| `--define <k=v>` | replace globals | — |
| `--env <mode>` | `inline`, `disable`, `PUBLIC_*` | `disable` |
| `--watch` | rebuild on change | — |
| `--entry-naming`, `--chunk-naming`, `--asset-naming` | output naming patterns | defaults |
| `--public-path <p>` | asset URL prefix | — |
| `--root <dir>` | common root for entries | — |
| `--production` | NODE_ENV=production defaults | — |
| `--no-bundle` | transpile only | — |
| `--banner`, `--footer` | inject text | — |
| `--drop <call>` | remove function calls (e.g. `console.log`) | — |
| `--conditions <list>` | package.json exports conditions | — |
| `--bytecode` | compile to JSC bytecode (with --compile, faster startup) | — |

## JavaScript API

```ts
await Bun.build({
  entrypoints: ["./index.ts"],
  outdir: "./dist",
  target: "browser",
  format: "esm",
  splitting: true,
  minify: true,
  sourcemap: "external",
  define: { "process.env.NODE_ENV": '"production"' },
  external: ["react"],
  plugins: [myPlugin],
});
```

- Returns `BuildOutput` — `outputs` (artifacts), `logs`, `success`
- `throw: true` ให้ throw แทน return success=false

## File Types

- `.js .jsx .ts .tsx .mjs .cjs .mts .cts` — transpile + bundle
- `.json .toml .yaml` — import เป็น object
- `.css` — bundle CSS + autoprefix; `text` loader สำหรับ raw import
- `.html` — HTML imports: bundle scripts/styles จาก HTML entry (v1.2+)
- `.txt .md` — text loader; `.wasm`, `.napi`, `.node`, images/fonts → `file` loader (copy + hash)
- Custom loaders ผ่าน `loader` map ใน bunfig หรือ plugin `onLoad`

## Plugins

```ts
import { plugin } from "bun";

plugin({
  name: "my-plugin",
  setup(build) {
    build.onResolve({ filter: /^virtual:/ }, (args) => ({ path: args.path, namespace: "v" }));
    build.onLoad({ filter: /.*/, namespace: "v" }, (args) => ({ contents: "...", loader: "ts" }));
  },
});
```

- esbuild-compatible plugin API (`onResolve`, `onLoad`, `onStart`, `onEnd`)
- ใช้ได้ทั้ง bundler และ runtime (`preload` ใน bunfig)

## Executables (--compile)

```bash
bun build ./cli.ts --compile --outfile mycli
bun build ./cli.ts --compile --target=bun-linux-x64 --outfile mycli
```

- Single-file binary พร้อม Bun runtime ฝัง (~50MB base)
- Cross-compile targets: `bun-windows-x64`, `bun-linux-x64`, `bun-darwin-arm64`, `-musl`, `-modern`/`-baseline` CPU variants
- `--bytecode` — precompile JS → JSC bytecode ลด startup
- Assets embed ผ่าน `Bun.file()` path relative imports (standalone asset embedding)

## HTML Imports

```ts
import app from "./index.html";
Bun.serve({ routes: { "/": app } }); // dev: unbundled, hot reload; build: bundled+hashed
```

- `bun build ./index.html` — bundle HTML + linked assets พร้อม hash
- Tailwind/CSS/JS/TS inline ใน HTML ถูก process อัตโนมัติ

## When To Use What

- `bun build` — apps, servers, CLI binaries, simple libs
- `/follow-tool-bunup` — libraries สำหรับ publish (dual ESM/CJS + dts, Rolldown-powered)
- Vite/webpack — เมื่อต้องการ ecosystem plugins หนัก (Bun bundler ยังไม่ครอบทุก use case)
