---
name: follow-service-cloudflare-use-storage
description: ใช้ Cloudflare KV และ R2 — namespaces, caching patterns, object storage, presigned uploads
argument-hint: "[binding]"
related:
  - follow-service-cloudflare
  - run-test
  - resolve-errors
---

## Goal

ใช้ KV และ R2 ถูก use case — KV = key-value เล็ก+อ่านบ่อย (global cache), R2 = object storage (files/media/large payloads)

## Scope

storage layer ของ Workers — เลือกให้ถูก: KV (~64KB-25MB values, eventual consistency ~60s), R2 (objects, S3-compatible), Cache API (per-colo HTTP cache); bindings → `config-bindings`, detail ใน `references/bindings.md`

## Execute

### 1. Provision And Bind

```bash
wrangler kv namespace create CACHE
wrangler r2 bucket create my-bucket
```

`wrangler.jsonc`: `kv_namespaces: [{ binding: "CACHE", id }]`, `r2_buckets: [{ binding: "BUCKET", bucket_name }]` → `wrangler types`

### 2. KV Patterns

> Goal: ใช้ KV ตามจุดแข็ง/จุดอ่อน

```ts
await env.CACHE.put('key', value, { expirationTtl: 3600 })
const cached = await env.CACHE.get('key', { type: 'json' })   // 'text'|'json'|'arrayBuffer'|'stream'
await env.CACHE.delete('key')
await env.CACHE.list({ prefix: 'user:' })
```

- เหมาะ: config, sessions, feature flags, cache — **ไม่เหมาะ**: ข้อมูลที่ต้อง consistent ทันที (eventual ~60s), high-write data
- metadata: `put(key, val, { metadata })` + `getWithMetadata` — เช่น content-type/tags

### 3. R2 Patterns

> Goal: object storage operations

```ts
await env.BUCKET.put(key, body, { httpMetadata: { contentType }, customMetadata })
const obj = await env.BUCKET.get(key)          // obj.body stream, obj.writeHttpMetadata(headers)
for await (const chunk of obj.body) { /* stream */ }
await env.BUCKET.delete(key)
await env.BUCKET.list({ prefix, limit, cursor })
```

- Multipart upload สำหรับไฟล์ใหญ่ (`createMultipartUpload`)
- Range reads: `get(key, { range })` — partial content
- Serve files: return `new Response(obj.body, { headers })` + `writeHttpMetadata`

### 4. Cache API (optional)

- `caches.default` — per-colo HTTP cache สำหรับ Response objects; เหมาะ hot paths ที่ไม่ต้อง global consistency

### 5. Verify

1. `wrangler dev` round-trip put/get/delete จริง (local = miniflare-backed)
2. `/run-test`; fail → `/resolve-errors`

## Rules

- KV ไม่ใช้เป็น source of truth — ใช้ cache/derived data เท่านั้น
- R2 keys ออกแบบเป็น path (`users/{id}/avatar.png`) ให้ `list` prefix ใช้ได้
- เลือก binding แยกต่อ env (staging/production)
- ETag/conditional requests บน R2 GET สำหรับ bandwidth

## Expected Outcome

- KV/R2 bound และ round-trip ทำงานทั้ง local/remote
- Storage choice ตรง use case + consistency requirements
