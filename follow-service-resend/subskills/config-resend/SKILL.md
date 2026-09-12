---
name: follow-service-resend-config-resend
description: ตั้งค่า Resend verified domains, from address, templates และ webhooks
argument-hint: "[project-path]"
related:
  - follow-service-resend
  - follow-secret-manager
  - open-web-for-config-secret
  - check-env-vars
  - run-verify
  - resolve-errors
---

## Goal

ตั้งค่า/แก้ไข Resend configuration — verified domains, from address, email templates และ webhooks — โดยไม่ clobber settings เดิม

## Scope

- Verify sending domain ด้วย DNS records (SPF/DKIM)
- กำหนด from address และ reply-to ตาม environment
- ตั้งค่า React/HTML templates และ webhooks สำหรับ delivery events
- ไม่ครอบคลุม SDK install/API key → ใช้ `subskills/setup-resend/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน mail module, `.env*` และ templates ที่มีอยู่ใน project
2. ทำ `/check-env-vars` เพื่อระบุ vars ที่ขาด เช่น `RESEND_API_KEY`, `EMAIL_FROM`
3. ตรวจ domains ที่ verify แล้วใน dashboard — ใช้ `/open-web-for-config-secret` (service resend)
4. ถ้ายังไม่มี SDK/API key → ทำ `subskills/setup-resend/SKILL.md` แทน

### 2. Verify Sending Domain

> Goal: ให้ domain พร้อมส่งใน production

1. เพิ่ม domain ใน dashboard (Domains > Add domain)
2. เพิ่ม DNS records ที่ dashboard กำหนด (SPF, DKIM และ MX สำหรับ bounce ถ้าต้องการ) ที่ DNS provider
3. รอ verify — ตรวจ status ใน dashboard จนขึ้น verified
4. ถ้า DNS ไม่ verify → ตรวจ record names/values อีกครั้งก่อนแจ้ง user

### 3. Configure From Address And Templates

> Goal: กำหนด sender และ template config อย่างสม่ำเสมอ

1. กำหนด `EMAIL_FROM` เช่น `Name <noreply@yourdomain.com>` ใน env — ต้องเป็น verified domain เท่านั้น
2. รวม from/reply-to ไว้ใน config เดียวของ project ห้าม hardcode กระจายใน code
3. ใช้ React email components หรือ HTML templates — preview/test ก่อน production
4. Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite config เดิม

### 4. Configure Webhooks

> Goal: track delivery events อย่างปลอดภัย (เฉพาะถ้าต้องการ)

1. เพิ่ม webhook endpoint ใน dashboard พร้อมเลือก events เช่น `email.delivered`, `email.bounced`, `email.complained`
2. เก็บ webhook signing secret ใน `/follow-secret-manager`
3. Verify signature ทุกครั้งตาม official docs
4. บันทึก event id เพื่อ idempotent handling — email ห้าม trigger ซ้ำ

### 5. Verify

> Goal: ยืนยัน email ส่งจริงจาก verified domain

1. ส่ง test email จาก from address จริงและตรวจ inbox/headers (SPF/DKIM pass)
2. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

## Rules

- From address ต้องใช้ verified domain — ห้าม `@resend.dev` ใน production
- แยก transactional vs marketing (ใช้ Broadcasts สำหรับ marketing)
- Secrets ผ่าน `/follow-secret-manager` เท่านั้น ห้าม commit
- Retry ด้วย idempotency — ห้ามส่ง email ซ้ำ
- ถ้า DNS field/API ไม่แน่ใจ → ดู official docs หรือ `learn-web`

## Expected Outcome

- Domain verified พร้อม SPF/DKIM pass
- `EMAIL_FROM` ชัดเจนและใช้ verified domain
- Templates ส่งได้จริงและ webhooks (ถ้ามี) ปลอดภัย
