---
name: follow-lib-nitro-config-storage
description: ตั้งค่า Nitro storage — unstorage useStorage, drivers, route rules cache, prerender
argument-hint: "[driver]"
related:
  - follow-lib-nitro
  - run-test
  - resolve-errors
---

## Goal

ตั้งค่า Nitro storage layer — `useStorage` (unstorage) KV abstraction, drivers per deployment, `routeRules` caching, prerender

## Scope

caching/storage ฝั่ง server — unstorage mounts, route rules (`cache`, `swr`, `prerender`), per-preset drivers

## Execute

### 1. useStorage Basics

```ts
const storage = useStorage()                    // default mount
await storage.setItem('key', value)
const v = await storage.getItem('key')
await storage.removeItem('key')
await storage.getKeys('prefix:')
```

- Mounts: `useStorage('cache')` / `useStorage('data')` — แยก namespace ตาม driver

### 2. Mounts And Drivers

```ts
// nitro.config.ts
export default defineNitroConfig({
  storage: {
    cache: { driver: 'redis', url: '...' },          // หรือ cloudflare-kv-binding
    data: { driver: 'fs', base: './.data' },
  },
})
```

- Drivers: `memory`, `fs`, `redis`, `cloudflare-kv-binding`, `vercel-kv`, `mongodb` ฯลฯ — เลือกตาม preset/infra
- Dev default = memory/fs; production mount ตาม provider (preset `cloudflare-module` → `cloudflare-kv-binding` ผูก KV namespace)

### 3. Route Rules Caching

```ts
routeRules: {
  '/api/heavy': { cache: { maxAge: 300 } },              // response cache
  '/api/live':  { swr: 60 },                             // stale-while-revalidate
  '/blog/**':   { prerender: true },                     // build-time static
}
```

- `prerender` → output ลง `.output/public/` (serve static, no worker hit)
- `isr`/`swr` keys ตาม preset support (vercel/netlify/cloudflare รองรับต่างกัน — ตรวจ docs)

### 4. Verify

1. Cache hit: second request เร็ว/ไม่เข้า handler (log ใน handler เทียบ)
2. `/run-test`; fail → `/resolve-errors` max 3 รอบ

## Rules

- Mount ชื่อต้องตรง `useStorage('name')` — typo = silent default mount
- `routeRules` ใช้แทน in-handler cache เมื่อเป็นได้ — deterministic กว่า
- Driver selection ต้องตรง preset — fs driver ไม่ persist บน serverless/edge
- `cache.maxAge`/`swr` ตั้งตาม data freshness จริง

## Expected Outcome

- Storage mounts + drivers ตรง deployment target
- Route rules caching/prerender ทำงาน
