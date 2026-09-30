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
