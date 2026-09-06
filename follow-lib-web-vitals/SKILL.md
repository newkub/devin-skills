---
name: follow-lib-web-vitals
description: ใช้ web-vitals วัด Core Web Vitals — LCP, INP, CLS, FCP, TTFB reporting
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ web-vitals วัด Core Web Vitals — LCP, INP, CLS, FCP, TTFB reporting

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `onLCP`, `onINP`, `onCLS`, `onFCP`, `onTTFB` callbacks — ไม่ใช่ get* (deprecated)
1. ส่ง metrics ไป analytics endpoint — batch หรือ beacon API
1. report เฉพาะ production + sample rate — ไม่ต้องทุก session
1. ตั้ง attribution build (`web-vitals/attribution`) เมื่อ debug regressions

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- INP แทน FID ตั้งแต่ v3 — อย่าใช้ onFID
- ใช้ `navigator.sendBeacon` หรือ `fetch keepalive` สำหรับ reporting
- อย่า block main thread เพื่อ report metrics

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน