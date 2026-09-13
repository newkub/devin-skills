---
name: follow-lib-pdfkit
description: ใช้ pdfkit สร้าง PDF ฝั่ง server — layout, fonts, streams, images
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ pdfkit สร้าง PDF ฝั่ง server — layout, fonts, streams, images

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib pdfkit)

- ครอบคลุม: programmatic PDF generation ฝั่ง server — streaming output, text/vector/image layout, custom fonts, multi-page
- ไม่ครอบคลุม: HTML→PDF — ใช้ Playwright `page.pdf()` หรือ print pipeline แทน; edge/workerd runtime — pdfkit ต้อง Node
- ไม่มี CLI — ใช้งานผ่าน programmatic API เท่านั้น (จึงไม่มี `references/cli.md`)
- Latest: `pdfkit@0.20.2` (verified 2026-09-13)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ติดตั้ง `bun add pdfkit` และ `bun add -D @types/pdfkit` สำหรับ TypeScript
1. สร้าง `new PDFDocument()` แล้ว pipe เข้า stream/response
1. ใช้ `doc.text()`, `doc.moveTo()`, `doc.rect()` สำหรับ layout — manual positioning
1. register fonts ด้วย `doc.registerFont()` — ระวัง font licensing
1. จบด้วย `doc.end()` — อย่าลืมหรือ stream ค้าง

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib pdfkit)

## Rules

- pdfkit ต้อง Node runtime — ไม่รันบน edge/workerd (ใช้ service แยกหรือ pre-render)
- ใช้ `doc.bufferedPageRange()` สำหรับ multi-page headers/footers
- embed images ด้วย buffer/path — compress ก่อนส่ง

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib pdfkit)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib pdfkit)
- Lint, typecheck, tests ผ่าน
