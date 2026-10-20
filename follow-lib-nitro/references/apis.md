# Nitro — API Reference

| key | value |
|---|---|
| package | `nitro` (v3) |
| install | `bun i -D nitro` |
| latest version | `3.0.260903-beta` (npm `latest` dist-tag — beta channel, re-check before use) |
| license | MIT |
| docs | https://nitro.build |
| repository | https://github.com/nitrojs/nitro |

| api | description | signature/example |
|---|---|---|
| `nitro()` | Vite plugin that mounts the Nitro server into the Vite pipeline | `import { nitro } from "nitro/vite"` → `plugins: [nitro()]` |
| `defineConfig` | typed `nitro.config.ts` | `defineConfig({ serverDir: "./server" })` |
| `defineHandler` | route/middleware handler factory — the v3 name | `export default defineHandler((event) => ({ ok: true }))` |
| `defineWebSocketHandler` | cross-platform websocket handler | `defineWebSocketHandler({ message(peer, msg) {} })` |
| `createError` | structured HTTP error | `throw createError({ statusCode: 404, statusMessage: "Not Found" })` |
| `getRequestHeader` / `getRouterParam` / `getQuery` / `readBody` | request readers | `getRouterParam(event, "id")` |
| `createEventStream` | server-sent events stream | `import { createEventStream } from "nitro/h3"` |
| `defineTask` / `runTask` | tasks (experimental) | `import { defineTask, runTask } from "nitro/task"` |
| `defineCachedFunction` | function-level cache with SWR | `import { defineCachedFunction } from "nitro/cache"` |
| `useDatabase` | SQL access (db0) | `import { useDatabase } from "nitro/database"` |
| `useStorage` | KV storage (unstorage), auto-imported | `await useStorage("data").getItem("key")` |
| `event.context` | per-request state written by middleware | `event.context.user = user` |

| config key | description | example |
|---|---|---|
| `serverDir` | directory scanned for routes/middleware/plugins/tasks — nothing is scanned by default | `serverDir: "./server"` |
| `scanDirs` | additional directories to scan | `scanDirs: ["./shared"]` |
| `routeRules` | per-glob caching, static, headers, redirects | `routeRules: { "/docs/**": { static: true } }` |
| `prerender` | build-time rendering of selected routes | `prerender: { routes: ["/"], crawlLinks: true }` |
| `static` | prerender every route | `static: true` |
| `compressPublicAssets` | gzip/brotli/zstd for prerendered assets | `compressPublicAssets: true` |
| `runtimeConfig` | runtime env overrides via `NITRO_*` | `runtimeConfig: { apiSecret: "" }` |
| `experimental.tasks` | enable `tasks/` scanning | `experimental: { tasks: true }` |
| `builder` | builder selection (`rollup` / `rolldown` / `vite`, or `false`) | `builder: "rolldown"` |
