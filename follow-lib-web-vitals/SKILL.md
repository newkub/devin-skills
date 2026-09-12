---
name: follow-lib-web-vitals
description: ใช้ web-vitals วัด Core Web Vitals — LCP, INP, CLS, FCP, TTFB reporting
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - run-dev
  - run-profiler
---

## Goal

ใช้ web-vitals วัด Core Web Vitals — LCP, INP, CLS, FCP, TTFB reporting

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib web vitals)

- Latest: `web-vitals@6.2.1` (verified 2026-09-12)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `onLCP`, `onINP`, `onCLS`, `onFCP`, `onTTFB` callbacks — ไม่ใช่ get* (deprecated)
1. ส่ง metrics ไป analytics endpoint — batch หรือ beacon API
1. report เฉพาะ production + sample rate — ไม่ต้องทุก session
1. ตั้ง attribution build (`web-vitals/attribution`) เมื่อ debug regressions
1. v6: import types ด้วย `import type` เสมอ (types เป็น explicit type exports) เช่น `import type { Metric } from 'web-vitals'`
1. v6: รองรับ soft navigations — SPA route changes ถูก report เป็น metrics แยกได้
1. v6 attribution: `onINP` default `includeProcessedEventEntries: false` — set เป็น `true` เองถ้าต้องการ processed event entries

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib web vitals)

### Subskills

- Install + `on*` callbacks + reporting to endpoint → `subskills/setup-vitals/SKILL.md`
- ปรับปรุง LCP/INP/CLS patterns → `subskills/optimize-vitals/SKILL.md`

## Rules

- INP แทน FID ตั้งแต่ v3; `onFID` ถูกลบออกตั้งแต่ v5 — ห้ามใช้
- ใช้ `navigator.sendBeacon` หรือ `fetch keepalive` สำหรับ reporting
- อย่า block main thread เพื่อ report metrics
- ใช้ /run-dev ถ้าจำเป็น
- ใช้ /run-profiler ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib web vitals)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib web vitals)
- Lint, typecheck, tests ผ่าน
