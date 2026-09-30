---
name: follow-lib-web-vitals-setup-vitals
description: Setup web-vitals — install, on* callbacks, reporting to endpoint
argument-hint: "[endpoint]"
related:
  - follow-lib-web-vitals
  - run-install
  - run-verify
  - run-dev
  - resolve-errors
---

## Goal

Setup `web-vitals` ใน project — ติดตั้ง, wire `on*` callbacks และส่ง metrics ไป analytics endpoint

## Scope

ใช้เมื่อต้อง setup Core Web Vitals reporting ครั้งแรก — ครอบคลุม install, `onLCP`/`onINP`/`onCLS`/`onFCP`/`onTTFB`, beacon transport และ production sampling

## Execute

### 1. Install And Check State

> Goal: ติดตั้ง `web-vitals` และตรวจ entry point

1. ติดตั้ง `bun add web-vitals` (ใช้ package manager ที่ project ใช้)
2. ระบุ entry point ของ app (`main.ts`, `index.tsx`, app layout) ที่จะ wire reporting
3. ถ้ามีอยู่แล้ว → verify version และ config เท่านั้น (idempotent)

### 2. Wire Metric Callbacks

> Goal: report metrics ด้วย `on*` functions

```ts
import { onCLS, onINP, onLCP, onFCP, onTTFB } from 'web-vitals'

function sendToAnalytics(metric) {
  const body = JSON.stringify(metric)
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/analytics', body)
  } else {
    fetch('/analytics', { body, method: 'POST', keepalive: true })
  }
}

onCLS(sendToAnalytics)
onINP(sendToAnalytics)
onLCP(sendToAnalytics)
onFCP(sendToAnalytics)
onTTFB(sendToAnalytics)
```

1. ใช้ `on*` callbacks — ไม่ใช่ `get*` (deprecated)
2. ใช้ `navigator.sendBeacon` หรือ `fetch` กับ `keepalive: true` — metrics ส่งได้แม้ page กำลัง unload
3. `import type { Metric }` หรือ types ที่ต้องการด้วย `import type` เสมอ (v6 types เป็น explicit type exports)
4. v6 รองรับ soft navigations — SPA route changes report เป็น metrics แยกได้

### 3. Configure Reporting Strategy

> Goal: ส่ง metrics อย่างมีประสิทธิภาพ

1. Report เฉพาะ production — guard ด้วย env check
2. ใช้ sample rate (เช่น 10% ของ sessions) ถ้า traffic สูง — ไม่ต้องทุก session
3. Batch metrics หรือส่งทีละตัวตาม endpoint design
4. ใช้ `web-vitals/attribution` build เมื่อต้อง debug regressions — attribution data บอก element/cause ของ metric
5. endpoint ต้องรับ `application/json` หรือ text จาก sendBeacon — ตรวจ backend รองรับ

### 4. Verify

> Goal: ตรวจสอบ metrics ส่งถึง endpoint จริง

1. รัน `/run-dev` — เปิด DevTools Network tab เช็ค beacon/fetch requests ไป `/analytics`
2. ตรวจ payload มี `name`, `value`, `id`, `rating` ครบ
3. ทำ `/run-verify` สำหรับ lint/typecheck
4. ถ้าพัง → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- INP แทน FID ตั้งแต่ v3; `onFID` ถูกลบตั้งแต่ v5 — ห้ามใช้
- ห้าม block main thread เพื่อ report metrics — ใช้ beacon/keepalive เท่านั้น
- ห้าม report ใน dev โดยไม่จำเป็น — guard ด้วย env
- `web-vitals` import types ด้วย `import type` เสมอ (v6)
- ใช้ `/follow-lib-web-vitals` สำหรับ full reference

## Expected Outcome

- `web-vitals` ติดตั้งและ report LCP/INP/CLS/FCP/TTFB ไป endpoint จริง
- Reporting ใช้ beacon/keepalive ไม่ block main thread
- Production-only + sampling ตามที่ตั้งค่า
- Lint/typecheck ผ่าน
