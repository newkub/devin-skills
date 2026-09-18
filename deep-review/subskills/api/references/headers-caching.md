# Headers Caching And Cors Checklist — review-api

## Cache Control

- [ ] `Cache-Control` ตาม resource type — user data `private, no-store`, shared `public`, immutable assets `max-age=…, immutable`
- [ ] `ETag`/`Last-Modified` — conditional requests (304) สำหรับ cacheable resources
- [ ] `Vary` header ถูก — `Accept-Encoding`, `Authorization`, tenant headers ใน cache key
- [ ] no-cache vs no-store ถูก — sensitive responses `no-store`, revalidate `no-cache`
- [ ] stale-while-revalidate/stale-if-error ถ้าเหมาะ — edge/CDN caching

## Cors Policy

- [ ] `Access-Control-Allow-Origin` ไม่ `*` บน authenticated endpoints
- [ ] origins whitelist — exact match ไม่ใช่ suffix regex ที่ bypass ได้ (`evil-corp.com` ผ่าน `*corp.com`)
- [ ] `Access-Control-Allow-Credentials` — เฉพาะ origins ที่ trust, ไม่คู่กับ `*`
- [ ] `Access-Control-Allow-Methods`/`Headers` — เฉพาะที่ใช้จริง
- [ ] preflight (`OPTIONS`) handled — cache `Max-Age` สมเหตุ, ไม่ hit handler ทุก request
- [ ] ทำ `/check-cors-policy` ถ้ามี

## Content Negotiation

- [ ] `Content-Type` enforcement — reject unsupported media types ด้วย 415
- [ ] `Accept` handling — 406 เมื่อเสิร์ฟ representation ที่ขอไม่ได้
- [ ] charset — `application/json; charset=utf-8`, ไม่มี charset หละหลวมบน text types
- [ ] compression — `Accept-Encoding` → gzip/br สำหรับ text payloads, ไม่ compress ของ compress แล้ว
- [ ] request size limits — body size cap, 413 เมื่อเกิน

## Security Headers

- [ ] `X-Content-Type-Options: nosniff` — ทุก response
- [ ] `Content-Security-Policy` — API responses ไม่ serve HTML ก็ยังควร restrict
- [ ] `Strict-Transport-Security` — HTTPS-only บน production
- [ ] compression + secrets — BREACH-style: ไม่ reflect secrets ใน compressible responses
- [ ] `X-RateLimit-*`/`RateLimit-*` headers — limit/remaining/reset สื่อสารชัด

## Request Headers

- [ ] `Authorization` handling — Bearer scheme, ไม่รับ creds ผ่าน query string (leak ผ่าน logs)
- [ ] `If-Match`/`If-None-Match` — optimistic concurrency บน mutating endpoints (ถ้าใช้ ETags)
- [ ] `X-Request-ID`/`traceparent` — correlation ids echo กลับใน response headers
- [ ] header size limits — giant headers rejected ไม่ใช่ 500

## Response Hygiene

- [ ] no internal headers leak — `X-Powered-By`, server versions, internal hostnames
- [ ] consistent casing/terminators — headers เหมือนกันทุก endpoint
- [ ] `Location` บน 201 Created — resource URI ชัด
- [ ] `Retry-After` บน 429/503 — คำแนะนำ backoff ให้ client

## Detection

- curl/inspect response headers ต่อ endpoint type
- grep `Access-Control`, `Cache-Control`, `etag`, `vary` ใน middleware/handler code
- ทำ `/check-cors-policy`, `/check-rate-limiting`

Severity: `Access-Control-Allow-Origin: *` + credentials = Critical, secrets in cacheable responses = High, missing nosniff/HSTS = Medium, no rate-limit headers = Low
