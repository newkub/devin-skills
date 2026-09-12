---
name: follow-service-stripe-config-stripe
description: ตั้งค่า Stripe products, prices, webhook endpoints และ portal config
argument-hint: "[project-path]"
related:
  - follow-service-stripe
  - follow-secret-manager
  - open-web-for-config-secret
  - check-env-vars
  - check-config-drift
  - run-verify
---

## Goal

ตั้งค่า/แก้ไข Stripe configuration — products, prices, webhook endpoints, customer portal และ mode (test/live) — โดยไม่ clobber settings เดิม

## Scope

- สร้าง/แก้ products และ prices แล้วบันทึก `price_id` ลง config
- ตั้งค่า webhook endpoint และ events ที่ subscribe
- ตั้งค่า customer portal และสลับ test → live mode
- ไม่ครอบคลุม SDK install/keys → ใช้ `subskills/setup-stripe/SKILL.md`

## Execute

### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน pricing config, `.env*` และ routes ที่เกี่ยวกับ Stripe ใน project
2. ทำ `/check-env-vars` เพื่อระบุ keys ที่ขาด
3. ตรวจ products/prices/webhooks ที่มีอยู่ใน dashboard — ใช้ `/open-web-for-config-secret` (service stripe)
4. ถ้ายังไม่มี SDK/keys → ทำ `subskills/setup-stripe/SKILL.md` แทน

### 2. Configure Products And Prices

> Goal: กำหนด pricing model ให้ตรงกับ product

1. สร้าง products ใน dashboard หรือผ่าน `stripe.products.create`
2. สร้าง prices สำหรับ one-time, monthly, yearly, usage-based ด้วย `stripe.prices.create`
3. บันทึก `price_id` แต่ละแผนไว้ใน config file ของ project (ไม่ใช่ hardcode ใน component)
4. ระบุ default plan และ featured plan — merge กับ config เดิม ห้ามลบ plans ที่มีอยู่

### 3. Configure Webhook Endpoint

> Goal: รับ events อย่างปลอดภัยและ idempotent

1. สร้าง route `/api/webhooks/stripe` ที่ verify ด้วย `stripe.webhooks.constructEvent`
2. เพิ่ม endpoint ใน dashboard (Developers > Webhooks) พร้อม URL production
3. Subscribe เฉพาะ events ที่ใช้จริง เช่น `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. เก็บ `STRIPE_WEBHOOK_SECRET` ของแต่ละ environment ใน `/follow-secret-manager`
5. บันทึก event id ที่ประมวลผลแล้วเพื่อกัน duplicate

### 4. Configure Portal And Mode

> Goal: ตั้งค่า customer portal และเตรียม go live

1. เปิด customer portal ใน dashboard settings และกำหนด features ที่อนุญาต (cancel, update payment method)
2. ตั้ง `return_url` ไปยังหน้า billing ของ app
3. ก่อน go live: แทน test keys ด้วย live keys, ยืนยัน webhook endpoint เป็น HTTPS
4. ทำ `/check-config-drift` ระหว่าง test/live config ถ้าจำเป็น

### 5. Verify

> Goal: ยืนยัน config ทำงานได้ end-to-end

1. ทดสอบ checkout ด้วย test card `4242 4242 4242 4242`
2. Trigger events ด้วย `stripe trigger <event>` และตรวจ handler
3. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

## Rules

- `price_id` ต้องตรงกับ products ใน dashboard ของ environment นั้น
- Secrets/keys ผ่าน `/follow-secret-manager` เท่านั้น ห้าม commit
- Webhook endpoint production ต้องเป็น HTTPS และ verify signature ทุกครั้ง
- Merge config เดิม — ห้าม overwrite products/prices ที่ใช้งานอยู่
- ถ้า API field/option ไม่แน่ใจ → ดู official docs หรือ `learn-web`

## Expected Outcome

- Products/prices ถูกต้องและ `price_id` บันทึกใน config
- Webhook endpoint ปลอดภัย, idempotent และ subscribe events ที่จำเป็น
- Portal config พร้อมและ test → live checklist ผ่าน
