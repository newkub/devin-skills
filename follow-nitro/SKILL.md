---
name: follow-nitro
description: ตั้งค่า Nitro framework พร้อม presets และ deployment targets
allowed-tools:
  - read
  - write
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

ติดตั้ง Nitro ตาม project type

> Goal: มี dependencies พร้อมสำหรับ Nitro

1. รัน `bun add nitro` สำหรับ standalone projects
2. สำหรับ Nuxt/Vite ให้ใช้ integration ที่มีอยู่
3. ติดตั้ง platform tooling ที่จำเป็น (เช่น `@cloudflare/wrangler` สำหรับ Cloudflare)

### 2. Create Nitro Config

สร้าง `nitro.config.ts` หรือ config ใน framework ที่ใช้

> Goal: config ถูกต้องและรองรับ deployment

1. สร้าง `nitro.config.ts`:
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
2. สำหรับ Nuxt กำหนดใน `nuxt.config.ts`
3. สำหรับ Vite ใช้ `nitro/vite` plugin
4. ตั้ง `compatibilityDate` เป็น YYYY-MM-DD

### 3. Choose Preset

เลือก preset ตาม deployment target

> Goal: preset เหมาะสมกับ target platform

1. ระบุ platform: Node, Cloudflare, Vercel, Netlify, AWS Lambda, Bun, Deno
2. ตั้ง `preset` หรือ `NITRO_PRESET` env var
3. ใช้ `node-server` เป็น default สำหรับ standalone
4. ใช้ `cloudflare-module` สำหรับ Cloudflare Workers
5. ใช้ `vercel` หรือ `netlify` สำหรับ static/edge platform

### 4. Configure Runtime And Features

ตั้งค่า runtime config, cache, storage, database, และ assets

> Goal: runtime และ core features ทำงานถูกต้อง

1. ใช้ `runtimeConfig` สำหรับ environment variables
2. ใช้ `useRuntimeConfig()` เพื่อเข้าถึง config
3. ตั้งค่า `storage` drivers (Redis, filesystem)
4. เปิด `experimental.database` และ `useDatabase()` ถ้าต้องการ SQL
5. ใช้ `public/` สำหรับ public assets, `assets/` สำหรับ server assets
6. เปิด `compressPublicAssets` สำหรับ gzip/brotli/zstd

### 5. Setup Routing And Middleware

สร้าง routes และ middleware

> Goal: routing และ middleware ทำงานตามที่ออกแบบ

1. ใช้ filesystem routing ใน `routes/` และ `api/`
2. ตั้งค่า `routeRules` สำหรับ headers, CORS, redirect, proxy, cache, SWR, ISR, basic auth, prerender
3. สร้าง global middleware ใน `middleware/`
4. สร้าง routed middleware ด้วย `route` property
5. ใช้ `server.ts` สำหรับ server entry ถ้าจำเป็น

### 6. Setup Renderer, WebSocket, Tasks, OpenAPI

ตั้งค่า features เสริมตามจำเป็น

> Goal: features ทำงานและพร้อมใช้

1. ใช้ `index.html` template หรือ `renderer.template` สำหรับ SSR
2. ใช้ `defineWebSocketHandler()` สำหรับ WebSocket
3. เปิด `experimental.tasks` สำหรับ scheduled tasks
4. เปิด `experimental.openAPI` สำหรับ API documentation
5. ใช้ `definePlugin()` สำหรับ extend Nitro functionality

### 7. Build, Test, Deploy

Build, test, และ deploy

> Goal: application พร้อม deploy

1. เพิ่ม scripts: `dev`, `build`, `preview`, `typecheck`
2. รัน `nitro build` เพื่อ build
3. รัน `nitro typecheck` เพื่อตรวจ TypeScript
4. ใช้ Vitest สำหรับ unit tests, Playwright สำหรับ E2E
5. ตั้งค่า CI/CD สำหรับ build, test, deploy

## Rules

### 1. Configuration

- ใช้ `defineConfig` จาก `nitro`
- ตั้งค่า `compatibilityDate` เป็น YYYY-MM-DD
- ใช้ `preset` หรือ `NITRO_PRESET` environment variable
- Nitro auto-detect preset เมื่อไม่กำหนด (Vercel, Netlify, Cloudflare Pages)
- Dev mode ใช้ `nitro_dev` preset เสมอ

### 2. Runtime

- ใช้ `runtimeConfig` สำหรับ environment variables
- `nitro` namespace ถูกสงวนไว้
- เปิด `nodeCompat` สำหรับ Cloudflare ถ้าใช้ Node.js APIs
- ใช้ `defaultPreset` สำหรับ fallback เมื่อไม่ auto-detect

### 3. Cache And Storage

- Cache: ใช้ SWR pattern, invalidate ด้วย `.invalidate()` หรือ `invalidateCache()`
- Storage: mount drivers ด้วย `storage` config, ใช้ `devStorage` สำหรับ local development
- รองรับ Redis และ filesystem

### 4. Database

- เปิด `experimental.database`
- ใช้ `useDatabase()` สำหรับ SQL queries
- รองรับ SQLite, PostgreSQL, MySQL, Cloudflare D1
- ใช้ `devDatabase` สำหรับ development override

### 5. Assets

- ใช้ `public/` สำหรับ public assets
- ใช้ `assets/` สำหรับ server assets
- เปิด `compressPublicAssets` สำหรับ gzip/brotli/zstd

### 6. Routing And Middleware

- Filesystem routing ใน `routes/` และ `api/`
- ใช้ `routeRules` สำหรับ headers, CORS, redirect, proxy, cache, SWR, ISR, basic auth
- Global middleware ใน `middleware/`
- Routed middleware ด้วย `route` property
- `server.ts` สำหรับ server entry

### 7. Renderer, WebSocket, Tasks, OpenAPI

- Renderer: `index.html` template, custom renderer handler, Vite SSR integration
- WebSocket: `defineWebSocketHandler()`, pub/sub topics, namespaces, peer methods
- Tasks: `experimental.tasks`, tasks ใน `tasks/`, scheduled ด้วย cron, `runTask()`
- OpenAPI: `experimental.openAPI`, `defineRouteMeta` สำหรับ metadata

### 8. Testing And CI/CD

- Vitest สำหรับ unit tests
- Playwright สำหรับ E2E
- Integration tests สำหรับ API
- CI/CD pipeline สำหรับ build, test, deploy

### 9. Migration

- อัปเดตจาก `nitropack` เป็น `nitro`
- ใช้ Node.js 20+
- H3 v2 web standards
- ใช้ `nitro/types` สำหรับ types

## Expected Outcome

- Nitro server พร้อม deploy บน multiple platforms
- Zero-config auto detection ทำงานถูกต้อง
- Integration กับ Nuxt สมบูรณ์
- Runtime configuration ยืดหยุ่น
- Static site generation รองรับ
- Cache, Storage, Database, WebSocket, OpenAPI พร้อมใช้งาน

## Guide

### Common Presets

| Preset | Platform |
|--------|----------|
| `node-server` | Node.js (default) |
| `cloudflare-pages` | Cloudflare Pages |
| `cloudflare-module` | Cloudflare Workers |
| `vercel` | Vercel |
| `vercel-edge` | Vercel Edge |
| `netlify` | Netlify |
| `netlify-edge` | Netlify Edge |
| `aws-lambda` | AWS Lambda |
| `bun` | Bun runtime |
| `deno` | Deno runtime |

### Runtime Config

Override runtime values ด้วย `NITRO_<KEY>`:

```typescript
import { useRuntimeConfig } from 'nitro/runtime'

const config = useRuntimeConfig()
```

### Cache

```typescript
import { defineCachedEventHandler } from 'nitro/runtime'

export default defineCachedEventHandler(async () => {
  return { data: 'cached' }
}, { maxAge: 60 })
```

### References

- [Nitro Documentation](https://nitro.unjs.io/)
- [Nitro Presets](https://nitro.unjs.io/deploy/)
- [Nitro Storage](https://nitro.unjs.io/guide/storage)
- [Nitro Database](https://nitro.unjs.io/guide/database)