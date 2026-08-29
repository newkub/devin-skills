---
name: follow-service-stripe
description: ใช้ Stripe สำหรับ payments, subscriptions, checkout, customer portal และ webhooks
argument-hint: "[project-path]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - follow-create-product
  - follow-create-web
  - follow-service-workos
  - follow-lib-zod
  - follow-lib-unocss-theme
  - deploy-to-vercel
  - deploy-to-cloudflare
---

## Goal

ติดตั้งและใช้งาน Stripe สำหรับ product โดยครอบคลุม pricing, checkout, subscriptions, customer portal, และ webhook handling

## Scope

- รองรับ one-time payments, recurring subscriptions, และ usage-based pricing
- สร้าง `/pricing`, `/user/billing`, `/dashboard` pages
- จัดการ customer portal และ webhook events
- ใช้ Stripe test mode ก่อนสลับไป live

## Execute

### 1. Setup Credentials

> Goal: เตรียม Stripe SDK และ API keys

1. ติดตั้ง Stripe SDK ด้วย `bun add stripe` สำหรับ server
2. ติดตั้ง client SDK ด้วย `bun add @stripe/stripe-js`
3. สร้าง Stripe account และเปิด Developers > API keys
4. เก็บ `STRIPE_SECRET_KEY` และ `STRIPE_PUBLISHABLE_KEY` ใน `/follow-secret-manager` ไม่ใช่ `.env` จริง
5. ติดตั้ง Stripe CLI สำหรับ webhook forwarding ด้วย `mise use -g stripe` หรือ `scoop install stripe`

### 2. Define Products And Prices

> Goal: กำหนด pricing model

1. สร้าง products ใน Stripe dashboard หรือด้วย API
2. สร้าง prices สำหรับ one-time, monthly, yearly, usage-based
3. บันทึก `price_id` แต่ละแผนไว้ใน config
4. ระบุ default plan และ featured plan สำหรับหน้า `/pricing`

### 3. Build Pricing Page

> Goal: สร้างหน้า `/pricing` ทีดึงดูด

1. ทำ `/follow-lib-unocss-theme` กำหนด theme tokens
2. ออกแบบ cards สำหรับแต่ละ plan พร้อม price, features, CTA
3. เรียก `/review-uxui` ก่อน deploy หน้า pricing
4. ส่ง price_id ไปยัง checkout session

### 4. Implement Checkout

> Goal: สร้าง checkout session และ redirect

1. สร้าง server route `/api/checkout` ด้วย `stripe.checkout.sessions.create`
2. ส่ง `price_id`, `customer_email`, `success_url`, `cancel_url`
3. เรียก session จาก client และ redirect ไป `session.url`
4. บันทึก `session_id` และ `customer_id` ใน database

### 5. Manage Subscriptions

> Goal: จัดการ subscription lifecycle

1. สร้าง subscription ด้วย `stripe.subscriptions.create` หรือผ่าน checkout
2. ตรวจสอบสถานะ `active`, `past_due`, `canceled`
3. สร้าง route `/api/subscriptions/update` สำหรับ upgrade/downgrade
4. สร้าง route `/api/subscriptions/cancel` พร้อม `cancel_at_period_end`

### 6. Customer Portal

> Goal: เปิดให้ user จัดการ billing เอง

1. ตั้งค่า customer portal ใน Stripe settings
2. สร้าง route `/api/billing/portal-session` ด้วย `stripe.billingPortal.sessions.create`
3. ระบุ `return_url` ไปยัง `/user/billing`
4. เพิ่มปุ่ม "Manage billing" ในหน้า `/user/billing`

### 7. Webhook Handling

> Goal: รับและตอบสนอง Stripe events อย่างปลอดภัย

1. สร้าง route `/api/webhooks/stripe`
2. ใช้ `stripe.webhooks.constructEvent` ตรวจ signature
3. จัดการ events สำคัญ:
   - `checkout.session.completed`
   - `invoice.paid`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
4. บันทึก event ลง database ด้วย idempotency key
5. รัน `stripe listen --forward-to http://localhost:3000/api/webhooks/stripe` เมื่อ local dev

### 8. User And Dashboard Pages

> Goal: เชื่อม Stripe กับหน้า user

1. สร้าง `/user/billing` แสดง subscription status, payment method, invoice list
2. สร้าง `/dashboard` แสดง usage, plan limits, upgrade CTA
3. ดึงข้อมูลจาก `stripe.customers.retrieve` และ `stripe.subscriptions.list`
4. ใช้ `/follow-service-workos` หรือ `/follow-lib-better-auth` สำหรับ user auth

### 9. Test

> Goal: ทดสอบ flow ทั้งหมดใน test mode

1. ใช้ Stripe test card `4242 4242 4242 4242`
2. ทดสอบ checkout, subscription, cancel, portal
3. ทดสอบ webhook events และ database updates
4. ทดสอบ edge cases เช่น payment failed, incomplete subscription

### 10. Go Live

> Goal: สลับไป production

1. แทนที API keys ด้วย live keys
2. ตั้งค่า webhook endpoint บน production domain ใน Stripe dashboard
3. ตรวจสอบ webhook endpoint ใช้ HTTPS
4. ทำ `/deploy-to-vercel` หรือ `/deploy-to-cloudflare`
5. ทดสอบ live checkout ด้วย real card ขั้นต่ำ

## Rules

### 1. Security

- ไม่ hardcode Stripe keys
- เก็บ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, และ `STRIPE_WEBHOOK_SECRET` ใน `/follow-secret-manager`
- ตรวจสอบ webhook signature ทุกครั้ง
- ใช้ HTTPS สำหรับ webhooks ใน production

### 2. Idempotency

- จัดการ duplicate webhook events ด้วย event id
- บันทึก event ที่ประมวลผลแล้ว
- ส่ง response `200` ทันทีหลังจากยืนยัน event แม่จะ processing ไม่สำเร็จ

### 3. Data Flow

- `price_id` ต้องตรงกับ products ใน Stripe dashboard
- ใช้ `customer_id` จาก Stripe ผูกกับ user ใน app
- ใช้ `subscription.status` ควบคุม feature access

### 4. UX

- แสดง loading state เมื่อกด subscribe
- แสดง error ทีชัดเจนถ้า payment fail
- ให้ user สามารถ manage billing เองได้

## Expected Outcome

- Stripe SDK ติดตั้งและกำหนดค่าถูกต้อง
- `/pricing` page พร้อม CTA ที่ชัดเจน
- Checkout session ทำงานได้
- Subscriptions และ customer portal จัดการได้
- Webhook events ถูกต้องและปลอดภัย
- `/user/billing` และ `/dashboard` แสดงข้อมูล Stripe ได้
- พร้อม deploy ไป production
