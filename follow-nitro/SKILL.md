---
name: follow-nitro
description: ตั้งค่า Nitro framework พร้อม presets และ deployment targets
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
triggers:
  - user
  - model
---

## Goal

ตั้งค่า Nitro สำหรับ full-stack server พร้อมรองรับหลาย deployment targets ด้วย zero-config auto-detection

## Scope

ใช้สำหรับตั้งค่า Nitro framework สำหรับ standalone, Nuxt, Vite projects และ multiple deployment targets

## Execute

### 1. Install Dependencies

รัน `bun add nitro` สำหรับ standalone projects, `bun add -D @cloudflare/wrangler` สำหรับ Cloudflare, ใช้ `create-nitro-app` สำหรับ quick start

### 2. Create Nitro Config

สร้าง `nitro.config.ts`:

```typescript
import { defineConfig } from 'nitro'

export default defineConfig({
  compatibilityDate: 'latest',
  preset: 'node-server',
  runtimeConfig: {
    apiSecret: 'default-secret' // override with NITRO_API_SECRET
  }
})
```

สำหรับ Nuxt: กำหนดใน `nuxt.config.ts`, สำหรับ Vite: ใช้ `nitro/vite` plugin, ใช้ `create-nitro-app` สำหรับ quick start

### 3. Choose Preset

เลือก preset ตาม deployment target: `node-server` (default), `cloudflare-pages`, `cloudflare-module`, `vercel`, `vercel-edge`, `netlify`, `netlify-edge`, `aws-lambda`, `bun`, `deno`, `edge`

### 4. Platform Configuration

Cloudflare: `preset: 'cloudflare-module'`, `cloudflare: { deployConfig: true, nodeCompat: true }`

Vercel: `preset: 'vercel'`, `vercel: { config: { runtime: 'nodejs20.x' } }`

Netlify: `preset: 'netlify'`, `netlify: { edge: false }`

### 5. Runtime Configuration

ใช้ `runtimeConfig` สำหรับ environment variables, override ด้วย `NITRO_<KEY>`, เข้าถึงด้วย `useRuntimeConfig()`

### 6. Static Site Generation

ตั้งค่า `static: true` สำหรับ prerender ทุก routes, ใช้ `prerender.routes` สำหรับ specific routes

### 7. Build Scripts

`package.json`: `dev: nitro dev`, `build: nitro build`, `preview: nitro preview`, `typecheck: nitro typecheck`

### 8. Cache

ใช้ `defineCachedHandler` สำหรับ cache HTTP responses, `defineCachedFunction` สำหรับ cache functions, SWR enabled by default, invalidate ด้วย `.invalidate()`

### 9. Storage

ใช้ `useStorage()` สำหรับ KV storage, mount drivers ด้วย `storage` config, ใช้ `devStorage` สำหรับ development, รองรับ Redis, filesystem

### 10. Database

เปิด `experimental.database`, ใช้ `useDatabase()` สำหรับ SQL queries, รองรับ SQLite, PostgreSQL, MySQL, Cloudflare D1, ใช้ `devDatabase` สำหรับ development override

### 11. Assets

ใช้ `public/` สำหรับ public assets, `assets/` สำหรับ server assets, ตั้งค่า `publicAssets` และ `serverAssets`, เปิด `compressPublicAssets` สำหรับ gzip/brotli/zstd

### 12. Routing

ใช้ filesystem routing ใน `routes/` และ `api/`, ตั้งค่า `routeRules` สำหรับ headers, CORS, redirect, proxy, cache, SWR, ISR, basic auth, prerender

### 13. Middleware

สร้าง global middleware ใน `middleware/`, routed middleware ด้วย `route` property, ใช้ `server.ts` สำหรับ server entry

### 14. Renderer

ใช้ `index.html` template, ตั้งค่า `renderer.template`, ใช้ Hypertext Preprocessor (rendu), custom renderer handler, Vite integration สำหรับ SSR

### 15. Lifecycle

ใช้ hooks: `request`, `response`, `error`, `close` ผ่าน `definePlugin()`, custom error handler, graceful shutdown

### 16. WebSocket

ใช้ `defineWebSocketHandler()`, pub/sub ด้วย topics, namespaces, peer methods, SSE สำหรับ server-to-client streaming

### 17. Tasks

เปิด `experimental.tasks`, กำหนด tasks ใน `tasks/`, scheduled tasks ด้วย cron, `runTask()` สำหรับ programmatic execution

### 18. OpenAPI

เปิด `experimental.openAPI` สำหรับ auto-generate API documentation

### 19. Plugins

ใช้ `definePlugin()` สำหรับ extend Nitro functionality, `nitroApp` context, hooks registration

### 20. Migration

อัปเดตจาก `nitropack` เป็น `nitro`, Node.js 20+, H3 v2 web standards, ใช้ `nitro/types` สำหรับ types

### 21. Nightly Channel

ใช้ `nitro: npm:nitro-nightly@latest` สำหรับ latest changes, publicHoistPattern สำหรับ Bun monorepo

### 22. Testing

ใช้ Vitest สำหรับ unit tests, Playwright สำหรับ E2E, integration tests สำหรับ API

### 23. CI/CD

ตั้งค่า CI pipeline สำหรับ build, test, deploy, ใช้ GitHub Actions หรือ platform-specific CI

## Rules

### Configuration Standards

- ใช้ `defineConfig` จาก `nitro`, ตั้งค่า `compatibilityDate` เป็น YYYY-MM-DD
- ใช้ `preset` option หรือ `NITRO_PRESET` environment variable
- Nitro auto-detect preset เมื่อไม่กำหนด (Vercel, Netlify, Cloudflare Pages)
- Dev mode ใช้ `nitro_dev` preset เสมอ

### Runtime Standards

- ใช้ `runtimeConfig` สำหรับ environment variables, `nitro` namespace ถูกสงวนไว้
- เปิด `nodeCompat` สำหรับ Cloudflare ถ้าใช้ Node.js APIs
- ใช้ `defaultPreset` สำหรับ fallback เมื่อไม่ auto-detect

### Feature Standards

- Cache: ใช้ SWR pattern, invalidate ด้วย `.invalidate()` หรือ `invalidateCache()`, `maxAge` และ `staleMaxAge` options
- Storage: mount drivers ด้วย `storage` config, ใช้ `devStorage` สำหรับ local development, รองรับ Redis, filesystem
- Database: เปิด `experimental.database`, ใช้ `devDatabase` สำหรับ development override, รองรับ SQLite, PostgreSQL, MySQL, Cloudflare D1
- Assets: ใช้ `public/` สำหรับ public assets, `assets/` สำหรับ server assets, `compressPublicAssets` สำหรับ gzip/brotli/zstd
- Routing: filesystem routing ใน `routes/` และ `api/`, `routeRules` สำหรับ headers, CORS, redirect, proxy, cache, SWR, ISR, basic auth
- Middleware: global middleware ใน `middleware/`, routed middleware ด้วย `route` property, `server.ts` สำหรับ server entry
- Renderer: `index.html` template, Hypertext Preprocessor (rendu), custom renderer handler, Vite SSR integration
- Lifecycle: hooks `request`, `response`, `error`, `close` ผ่าน `definePlugin()`, custom error handler, graceful shutdown
- WebSocket: `defineWebSocketHandler()`, pub/sub topics, namespaces, peer methods, SSE สำหรับ server-to-client
- Tasks: เปิด `experimental.tasks`, tasks ใน `tasks/`, scheduled tasks ด้วย cron, `runTask()` สำหรับ programmatic execution
- OpenAPI: เปิด `experimental.openAPI`, `defineRouteMeta` สำหรับ metadata, Scalar/Swagger UI, production mode
- Plugins: `definePlugin()` สำหรับ extend functionality, `nitroApp` context, hooks registration
- Migration: อัปเดตจาก `nitropack` เป็น `nitro`, Node.js 20+, H3 v2 web standards, `nitro/types` สำหรับ types
- Nightly: ใช้ `nitro-nightly` สำหรับ latest changes, publicHoistPattern สำหรับ Bun monorepo
- Testing: Vitest สำหรับ unit tests, Playwright สำหรับ E2E, integration tests สำหรับ API
- CI/CD: build, test, deploy pipeline, GitHub Actions, platform-specific CI

## Expected Outcome

- Nitro server พร้อม deploy บน multiple platforms
- Zero-config auto detection ทำงานถูกต้อง
- Integration กับ Nuxt สมบูรณ์
- Runtime configuration ยืดหยุ่น
- Static site generation รองรับ
- Cache, Storage, Database, WebSocket, OpenAPI พร้อมใช้งาน


## References

- `nitro` content: `references/nitro/`
