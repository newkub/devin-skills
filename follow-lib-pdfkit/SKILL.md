---
name: follow-lib-pdfkit
description: ใช้ pdfkit สร้าง PDF ฝั่ง server — layout, fonts, streams, images
argument-hint: "[target-or-scope]"
related:
  - follow-best-practice
  - run-verify
  - run-test
  - report-table
---

## Goal

ใช้ pdfkit สร้าง PDF ฝั่ง server — layout, fonts, streams, images

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new PDFDocument()` แล้ว pipe เข้า stream/response
1. ใช้ `doc.text()`, `doc.moveTo()`, `doc.rect()` สำหรับ layout — manual positioning
1. register fonts ด้วย `doc.registerFont()` — ระวัง font licensing
1. จบด้วย `doc.end()` — อย่าลืมหรือ stream ค้าง

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- pdfkit ต้อง Node runtime — ไม่รันบน edge/workerd (ใช้ service แยกหรือ pre-render)
- ใช้ `doc.bufferedPageRange()` สำหรับ multi-page headers/footers
- embed images ด้วย buffer/path — compress ก่อนส่ง

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน