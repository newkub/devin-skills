---
name: follow-service-resend
description: ใช้ Resend ส่ง transactional emails — send, templates, domains, webhooks
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ Resend ส่ง transactional emails — send, templates, domains, webhooks

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. สร้าง `new Resend(apiKey)` — apiKey จาก env `RESEND_API_KEY`
1. ส่งด้วย `resend.emails.send({from,to,subject,html/react})` — verify domain ก่อน production
1. ใช้ React email components หรือ HTML templates — preview ใน dashboard
1. ตั้ง webhooks สำหรับ delivery/bounce events ถ้าต้อง tracking

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- from address ต้องใช้ verified domain — ห้าม @resend.dev ใน production
- retry ด้วย idempotency — email ห้ามส่งซ้ำ
- แยก transactional vs marketing (Resend Broadcasts)
- เก็บ secrets ใน env ห้าม commit

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน
