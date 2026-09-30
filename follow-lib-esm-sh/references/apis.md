| key | value |
|---|---|
| repository | https://github.com/esm-dev/esm.sh |
| docs | https://esm.sh |

| Prefix | Source | Example |
|---|---|---|
| (default) | npm | `https://esm.sh/react@19.3.0` |
| `/jsr/` | JSR | `https://esm.sh/jsr/@std/encoding@1.0.0/base64` |
| `/gh/` | GitHub | `https://esm.sh/gh/microsoft/tslib@v2.8.1` |
| `/pr/` หรือ `/pkg.pr.new/` | pkg.pr.new | `https://esm.sh/pr/tinybench@a832a55` |

| Param | Description | Example |
|---|---|---|
| `?deps=PKG@VER,...` | Lock version ของ dependencies | `?deps=react@18.3.1` |
| `?external=PKG` / prefix `*` | Mark external (ไม่ bundle) | `?external=react`, `/*react-dom` |
| `?alias=PKG:ALIAS` | Alias dependency | `?alias=react:preact/compat` |
| `?bundle=false` | ปิด default sub-module bundling | `?bundle=false` |
| `?standalone` | Bundle ทุก dep (ยกเว้น peerDeps) | `?standalone` |
| `?exports=a,b` | Tree-shaking เฉพาะ exports | `?exports=__await,__rest` |
| `?dev` | Development build (`NODE_ENV=development`) | `?dev` |
| `?target=` | Build target: `es2015`–`es2024`, `esnext`, `deno`, `denonext`, `node` | `?target=es2022` |
| `?conditions=` | Custom export conditions | `?conditions=custom1` |
| `?keep-names` / `?ignore-annotations` | esbuild options | `?keep-names` |
| `?worker` | โหลด module เป็น Web Worker (`createWorker`) | `?worker` |
| `?css` | Import CSS ที่ package import ใน JS | `?css` |
| `?raw` / `raw.esm.sh` | Raw source โดยไม่ transform | `?raw` |
| `?no-dts` | ปิด `X-TypeScript-Types` (Deno) | `?no-dts` |
