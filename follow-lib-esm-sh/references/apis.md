| key | value |
|---|---|
| repository | https://github.com/esm-dev/esm.sh |
| docs | https://esm.sh |

| Prefix | Source | Example |
|---|---|---|
| (default) | npm | `https://esm.sh/react@19.3.0` |
| `/jsr/` | JSR | `https://esm.sh/jsr/@std/encoding@1.0.0/base64` |
| `/gh/` | GitHub | `https://esm.sh/gh/microsoft/tslib@v2.8.1` |
| `/pr/` or `/pkg.pr.new/` | pkg.pr.new | `https://esm.sh/pr/tinybench@a832a55` |

| Param | Description | Example |
|---|---|---|
| `?deps=PKG@VER,...` | Lock the version of dependencies | `?deps=react@18.3.1` |
| `?external=PKG` / prefix `*` | Mark external (not bundled) | `?external=react`, `/*react-dom` |
| `?alias=PKG:ALIAS` | Alias dependency | `?alias=react:preact/compat` |
| `?bundle=false` | Disable default sub-module bundling | `?bundle=false` |
| `?standalone` | Bundle every dep (except peerDeps) | `?standalone` |
| `?exports=a,b` | Tree-shaking limited to given exports | `?exports=__await,__rest` |
| `?dev` | Development build (`NODE_ENV=development`) | `?dev` |
| `?target=` | Build target: `es2015`–`es2024`, `esnext`, `deno`, `denonext`, `node` | `?target=es2022` |
| `?conditions=` | Custom export conditions | `?conditions=custom1` |
| `?keep-names` / `?ignore-annotations` | esbuild options | `?keep-names` |
| `?worker` | Load the module as a Web Worker (`createWorker`) | `?worker` |
| `?css` | Import CSS that the package imports in JS | `?css` |
| `?raw` / `raw.esm.sh` | Raw source without transform | `?raw` |
| `?no-dts` | Disable `X-TypeScript-Types` (Deno) | `?no-dts` |
