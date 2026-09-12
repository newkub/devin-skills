---
name: follow-service-stripe-setup-stripe
description: ติดตั้ง Stripe SDK, เตรียม API keys และ webhook signing ให้พร้อมใช้งาน
argument-hint: "[project-path]"
related:
  - follow-service-stripe
  - follow-secret-manager
  - open-web-for-config-secret
  - check-env-vars
  - resolve-errors
  - run-verify
---

## Goal

ติดตั้ง Stripe SDK (server/client), เตรียม API keys จาก dashboard และตั้งค่า webhook signing สำหรับ local dev — first-time setup เท่านั้น

## Scope

- ติดตั้ง `stripe`, `@stripe/stripe-js` และ Stripe CLI
- สร้างและเก็บ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Init server client และ webhook forwarding
- ไม่ครอบคลุม products/prices/webhook endpoints config → ใช้ `subskills/config-stripe/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: ยืนยันสถานะปัจจุบันก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `stripe`/`@stripe/stripe-js` ติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-env-vars` เพื่อดูว่า Stripe keys มีอยู่หรือยัง
4. ถ้าไม่มี Stripe account → stop และแจ้ง user สร้างจาก dashboard

### 2. Install SDKs And CLI

> Goal: ติดตั้ง dependencies ที่จำเป็น

1. ติดตั้ง server SDK ด้วย `bun add stripe`
2. ติดตั้ง client SDK ด้วย `bun add @stripe/stripe-js` ถ้าฝั่ง client ต้องเรียก Stripe.js
3. ติดตั้ง Stripe CLI ด้วย `mise use -g stripe` หรือ `scoop install stripe`
4. Login CLI ด้วย `stripe login`

### 3. Store Keys And Init Client

> Goal: เตรียม keys อย่างปลอดภัยและ init client

1. เปิด Developers > API keys ใน dashboard — ใช้ `/open-web-for-config-secret` (service stripe)
2. เก็บ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` ใน `/follow-secret-manager` ไม่ใช่ `.env` จริง
3. เริ่มด้วย test mode keys — ห้ามใช้ live keys ใน dev
4. Init server client ด้วย `new Stripe(process.env.STRIPE_SECRET_KEY!)` — ถ้าต้อง pin `apiVersion` ให้ดู official docs

### 4. Setup Webhook Signing

> Goal: ตั้งค่า webhook secret สำหรับ local dev

1. รัน `stripe listen --forward-to http://localhost:<port>/api/webhooks/stripe`
2. คัดลอก `whsec_...` จาก output ไปเป็น `STRIPE_WEBHOOK_SECRET` ใน `/follow-secret-manager`
3. Verify events ด้วย `stripe.webhooks.constructEvent(rawBody, signature, secret)` — ต้องใช้ raw request body
4. ทำ `/run-verify` และ trigger test event ด้วย `stripe trigger <event>` — ถ้า fail → `resolve-errors` max 3 รอบ

## Rules

- ห้าม hardcode keys หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- `STRIPE_SECRET_KEY` ใช้ฝั่ง server เท่านั้น — client ใช้ publishable key
- Webhook ต้อง verify signature ด้วย raw body เสมอ
- ใช้ test mode ก่อนเสมอ — live keys เฉพาะตอน go live
- ถ้า API/option ไม่แน่ใจ → ดู official docs หรือ `learn-web`

## Expected Outcome

- Stripe SDKs และ CLI ติดตั้งพร้อมใช้งาน
- Keys ทั้งสามปลอดภัยและ inject ถูกต้อง
- Webhook forwarding + signature verification ทำงานใน local
