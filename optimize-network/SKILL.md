---
name: optimize-network
description: ปรับปรุง network: requests, CDN, compression, caching, HTTP/2, preconnect
argument-hint: "[domain-or-endpoint]"
related:
  - optimize-codebase-everything
  - optimize-assets
  - optimize-perf
  - improve-api
  - report-table
---

## Goal

ปรับปรุง network: ลด requests, ใช้ CDN, compression, caching, HTTP/2, preconnect

## Scope

ใช้กับ frontend และ backend โดย audit network requests และ optimize

## Execute

### 1. Audit Network

> Goal: Audit Network

1. ใช้ DevTools Network panel
2. ระบุ requests ที slow หรือ unnecessary
3. ตรวจ sizes, timing, cache hits

### 2. Reduce Requests

> Goal: Reduce Requests

1. Bundle small requests
2. ใช้ batch API endpoints
3. ใช้ sprite sheets สำหรับ icons
4. Inline critical CSS

### 3. Caching

> Goal: Caching

1. ใช้ `Cache-Control` headers
2. ใช้ service worker สำหรับ static assets
3. ใช้ `ETag` สำหรับ API
4. ตรวจ CDN cache rules

### 4. Compression

> Goal: Compression

1. เปิด gzip/brotli บน server/CDN
2. ตรวจ `Accept-Encoding`
3. ใช้ Brotli ถ้า CDN รองรับ

### 5. Preconnect And DNS

> Goal: Preconnect And DNS

1. ใช้ `preconnect` สำหรับ third-party origins
2. ใช้ `dns-prefetch` ถ้า preconnect มากเกินไป
3. ใช้ `preload` สำหรับ critical resources

### 6. Validate

> Goal: Validate

1. วัด TTFB, network transfer
2. รัน `/run-build`
3. ทำ `/report-table` สรุป

## Rules

- Cache ถูกต้องไม่ stale
- ไม่ preconnect เกิน 6 origins
- ใช้ CDN สำหรับ static

## Expected Outcome

- Requests ลดลง
- Transfer size ลดลง
- TTFB ดีขึ้น
