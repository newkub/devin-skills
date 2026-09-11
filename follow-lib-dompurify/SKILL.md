---
name: follow-lib-dompurify
description: ใช้ dompurify/isomorphic-dompurify sanitize HTML กัน XSS ทุก environment
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ dompurify/isomorphic-dompurify sanitize HTML กัน XSS ทุก environment

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib dompurify)

- Latest: `dompurify@3.4.15` (verified 2026-09-11)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `DOMPurify.sanitize(html)` ก่อน render user/rich content
1. กำหนด `ALLOWED_TAGS`/`ALLOWED_ATTR` whitelist ชัดเจนตาม feature
1. บน SSR/workerd ใช้ isomorphic-dompurify หรือ shim — jsdom ไม่ทำงานใน workerd
1. เทสด้วย XSS payloads (script, onerror, javascript: URLs)

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib dompurify)

## Rules

- ห้าม render raw HTML จาก user input โดยไม่ sanitize
- sanitize ที่ boundary เดียวก่อน render — ไม่กระจายหลายจุด
- ระวัง `dangerouslySetInnerHTML`/Solid `innerHTML` — ผ่าน sanitize เสมอ

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib dompurify)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib dompurify)
- Lint, typecheck, tests ผ่าน
