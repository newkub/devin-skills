---
name: follow-service-workos-setup-workos
description: ติดตั้ง WorkOS SDK และเตรียม API key, client ID ให้พร้อมใช้งาน
argument-hint: "[project-path]"
related:
  - follow-service-workos
  - follow-secret-manager
  - open-web-for-config-secret
  - check-env-vars
  - resolve-errors
  - run-verify
---

## Goal

ติดตั้ง WorkOS SDK, สร้าง credentials จาก dashboard และ init client ให้พร้อมเรียก APIs — first-time setup เท่านั้น

## Scope

- ติดตั้ง SDK ตาม runtime (`@workos-inc/node`, `workos-python`, ฯลฯ)
- สร้างและเก็บ `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` อย่างปลอดภัย
- Init client และ smoke check
- ไม่ครอบคลุม AuthKit/SSO/Directory config → ใช้ `subskills/config-workos/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยัน runtime และสถานะปัจจุบัน (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `@workos-inc/node` หรือ SDK อื่นติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-env-vars` เพื่อดูว่า `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` มีอยู่หรือยัง
4. ถ้าไม่มี WorkOS account → stop และแจ้ง user สร้างจาก dashboard

### 2. Install SDK

> Goal: ติดตั้ง SDK ตาม runtime

1. Node/Bun: `bun add @workos-inc/node` (หรือ package manager ที่ตรวจพบ)
2. Python: `pip install workos` — ภาษาอื่นดู official docs
3. ยืนยันว่า dependency อยู่ใน manifest ของ project

### 3. Create And Store Credentials

> Goal: เตรียม API key และ client ID อย่างปลอดภัย

1. สร้าง API key และอ่าน client ID จาก WorkOS Dashboard — ใช้ `/open-web-for-config-secret` (service workos) ถ้าต้องเปิด dashboard
2. เก็บ `WORKOS_API_KEY` และ `WORKOS_CLIENT_ID` ใน `/follow-secret-manager` ห้ามใส่ `.env` จริง
3. Inject เข้า environment ของ dev/staging/prod แยกกัน

### 4. Init Client And Verify

> Goal: init client และ smoke check กับ API จริง

1. สร้าง client เช่น `new WorkOS(process.env.WORKOS_API_KEY)` ใน server-side module
2. Smoke check ด้วย read-only call เช่น list users/organizations — ดู official docs สำหรับ method ล่าสุด
3. ทำ `/run-verify` — ถ้า fail → ทำ `resolve-errors` max 3 รอบ แล้ว stop report

## Rules

- ห้าม hardcode API key หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- Client ต้อง init ฝั่ง server เท่านั้น ห้าม expose `WORKOS_API_KEY` ไป browser
- แยก keys ตาม environment (dev/staging/prod)
- ถ้า API/method ไม่แน่ใจ → ดู official docs หรือ `learn-web` ก่อน

## Expected Outcome

- WorkOS SDK ติดตั้งและอยู่ใน manifest
- `WORKOS_API_KEY`, `WORKOS_CLIENT_ID` ปลอดภัยและ inject ถูกต้อง
- Client init และ smoke check ผ่าน
