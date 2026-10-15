| key | value |
|---|---|
| package | `devframe` (MIT) — ESM-only, ไม่มี Vite dependency |
| install | `bun add devframe` (+ optional peer `bun add cac` สำหรับ CLI adapter) |
| stable version | `1.2.3` (published 2026-10-07, ≥7 days) — latest `1.2.5` (2026-10-14); `1.2.4` เพิ่ม `exposeSharedState` MCP route option |
| docs | https://devfra.me — raw pages `https://devfra.me/raw/<path>.md`, full docs `https://devfra.me/llms-full.txt` |
| repo | https://github.com/devframes/devframe |
| verified | 2026-10-15 (npm registry + official docs) |

| Entry point | Module | Factory | Best for |
|-------------|--------|---------|----------|
| Standard Handler | `devframe/initiate` | `initDevframe(def, { base })` | Raw Web Standard handler |
| CLI (cac) | `devframe/adapters/cac` | `createCac(def)` | Standalone tools |
| Dev | `devframe/adapters/dev` | `createDevServer(def)` | Dev server only |
| Build | `devframe/adapters/build` | `createBuild(def, { outDir })` | Static snapshots |
| Vite | `@vitejs/devtools-kit/node` | `createPluginFromDevframe(def)` | Vite DevTools plugin |
| Embedded | `devframe/adapters/embedded` | `createEmbedded(def, { ctx })` | Runtime registration |
| MCP | `devframe/adapters/mcp` | `createMcpServer(def)` | Coding agents |

| Package | Subpaths | Purpose |
|---------|----------|---------|
| `@devframes/vite` | `/single`, `/hub` | dev-serve one SPA / mount a hub |
| `@devframes/nuxt` | `/single`, `/hub` | author one devframe / mount a hub |
| `@devframes/next` | route handler | host devframes via `serveStaticHandler` |

| api | description | signature/example |
|---|---|---|
| `defineCliFlags` | typed CLI flags (Standard Schema — booleans → `--verbose`/`--no-verbose`, camelCase → kebab-case) | `defineCliFlags({ depth: v.pipe(v.number()) })` |
| `InferCliFlags` | inferred flags type at call site | `setup(ctx, { flags })` |
| `parseCliFlags` | validate raw bag สำหรับ custom framework (commander/yargs/oclif) | `parseCliFlags(schema, rawBag)` |
| `createCac` | wrap dev/build/mcp factories เป็น CLI เดียว → `CacHandle { cli, parse(argv?) }` | `createCac(def, { defaultPort, configureCli, onReady })` |
| `createDevServer` | dev server factory → `StartedServer` (`origin`, `port`, `app`, `ws`, `rpcGroup`, `connectionMeta()`, `close()`) | `createDevServer(def, { port, flags, onReady })` |
| `createBuild` | build factory | `createBuild(def, { outDir })` |
| `createMcpServer` | MCP server factory | `createMcpServer(def, { transport: 'stdio' })` |

| `type` | Caching | Static dump | Use for |
|--------|---------|-------------|---------|
| `query` | opt-in `cacheable` | explicit `dump` | reads that change over time |
| `static` | cached indefinitely | auto | data fixed per input |
| `action` | — | — | mutations |
| `event` | — | — | fire-and-forget notifications |

| `jsonSerializable` | Encoder | Wire prefix | Round-trips |
|--------------------|---------|-------------|-------------|
| `false` (default) | `structured-clone-es` | `s:` | `Map`, `Set`, `Date`, `BigInt`, cycles, class instances |
| `true` | strict `JSON.stringify` | unprefixed | JSON-only |
