---
name: follow-service-resend-setup-resend
description: ติดตั้ง Resend SDK และเตรียม API key ให้ส่ง transactional email ได้
argument-hint: "[project-path]"
related:
  - follow-service-resend
  - follow-secret-manager
  - open-web-for-config-secret
  - check-env-vars
  - resolve-errors
  - run-verify
---

## Goal

ติดตั้ง Resend SDK, สร้าง API key จาก dashboard และ init client ให้ส่ง transactional email ได้ — first-time setup เท่านั้น

## Scope

- ติดตั้ง `resend` package และ init `new Resend(apiKey)`
- สร้างและเก็บ `RESEND_API_KEY` อย่างปลอดภัย
- ส่ง test email ใน sandbox mode
- ไม่ครอบคลุม domain verification, from-address, webhooks → ใช้ `subskills/config-resend/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยันสถานะปัจจุบันก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `resend` ติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-env-vars` เพื่อดูว่า `RESEND_API_KEY` มีอยู่หรือยัง
4. ถ้าไม่มี Resend account → stop และแจ้ง user สร้างจาก dashboard

### 2. Install SDK

> Goal: ติดตั้ง package ตาม runtime

1. Node/Bun: `bun add resend` (หรือ package manager ที่ตรวจพบ)
2. ภาษาอื่น (Python, Go, ฯลฯ) → ดู official docs
3. ยืนยันว่า dependency อยู่ใน `package.json`

### 3. Create And Store API Key

> Goal: เตรียม API key อย่างปลอดภัย

1. สร้าง API key จาก Resend Dashboard — ใช้ `/open-web-for-config-secret` (service resend)
2. เลือก permission ขั้นต่ำที่จำเป็น (เช่น sending access เท่านั้น)
3. เก็บ `RESEND_API_KEY` ใน `/follow-secret-manager` แล้ว inject เข้า environment — ห้าม commit

### 4. Init Client And Smoke Test

> Goal: init client และส่ง test email

1. สร้าง client ด้วย `new Resend(process.env.RESEND_API_KEY)` ฝั่ง server เท่านั้น
2. ส่ง test email ด้วย `resend.emails.send({ from, to, subject, html })` — ก่อน verify domain ใช้ `onboarding@resend.dev` เป็น from
3. ตรวจ response `id` ว่าส่งสำเร็จ — ถ้า error → ทำ `resolve-errors` max 3 รอบ
4. ทำ `/run-verify` สำหรับ lint, typecheck

## Rules

- ห้าม hardcode API key หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- Client ต้องอยู่ฝั่ง server เท่านั้น ห้าม expose `RESEND_API_KEY` ไป browser
- `onboarding@resend.dev` ใช้ได้เฉพาะ sandbox/testing — production ต้อง verified domain
- ถ้า API/method ไม่แน่ใจ → ดู official docs หรือ `learn-web`

## Expected Outcome

- `resend` SDK ติดตั้งและอยู่ใน `package.json`
- `RESEND_API_KEY` ปลอดภัยและ inject ถูกต้อง
- ส่ง test email สำเร็จและ verify ผ่าน
