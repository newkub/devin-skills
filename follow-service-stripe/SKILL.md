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
  - follow-lib-unocss
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

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: SDK/CLI install, API keys, webhook signing → `workflows/setup-stripe/SKILL.md`
- Config: products, prices, webhook endpoints, customer portal, test→live → `workflows/config-stripe/SKILL.md`
- Verify: keys valid, mode ถูก (test/live), webhook secret พร้อม → `workflows/verify-connection/SKILL.md`

### 1. Setup Credentials

> Goal: เตรียม Stripe SDK และ API keys

Latest: `stripe@22.6.2` (server), `@stripe/stripe-js@9.17.0` (client) (verified 2026-09-24)

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

1. ทำ `/follow-lib-unocss` สำหรับ UnoCSS และ HSL theme tokens
2. ออกแบบ cards สำหรับแต่ละ plan พร้อม price, features, CTA
3. เรียก `/deep-review` ก่อน deploy หน้า pricing
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

- ใช้ /open-web-for-config-secret ถ้าจำเป็น (service stripe)
- ใช้ /follow-create-product ถ้าจำเป็น
- ใช้ /follow-create-web ถ้าจำเป็น
- ใช้ /follow-lib-zod ถ้าจำเป็น

## Merged Details

### config-stripe

##### Goal

ตั้งค่า/แก้ไข Stripe configuration — products, prices, webhook endpoints, customer portal และ mode (test/live) — โดยไม่ clobber settings เดิม

##### Scope

- สร้าง/แก้ products และ prices แล้วบันทึก `price_id` ลง config
- ตั้งค่า webhook endpoint และ events ที่ subscribe
- ตั้งค่า customer portal และสลับ test → live mode
- ไม่ครอบคลุม SDK install/keys → ใช้ `workflows/setup-stripe/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน pricing config, `.env*` และ routes ที่เกี่ยวกับ Stripe ใน project
2. ทำ `/check-secrets env-vars` เพื่อระบุ keys ที่ขาด
3. ตรวจ products/prices/webhooks ที่มีอยู่ใน dashboard — ใช้ `/open-web-for-config-secret` (service stripe)
4. ถ้ายังไม่มี SDK/keys → ทำ `workflows/setup-stripe/SKILL.md` แทน

###### 2. Configure Products And Prices

> Goal: กำหนด pricing model ให้ตรงกับ product

1. สร้าง products ใน dashboard หรือผ่าน `stripe.products.create`
2. สร้าง prices สำหรับ one-time, monthly, yearly, usage-based ด้วย `stripe.prices.create`
3. บันทึก `price_id` แต่ละแผนไว้ใน config file ของ project (ไม่ใช่ hardcode ใน component)
4. ระบุ default plan และ featured plan — merge กับ config เดิม ห้ามลบ plans ที่มีอยู่

###### 3. Configure Webhook Endpoint

> Goal: รับ events อย่างปลอดภัยและ idempotent

1. สร้าง route `/api/webhooks/stripe` ที่ verify ด้วย `stripe.webhooks.constructEvent`
2. เพิ่ม endpoint ใน dashboard (Developers > Webhooks) พร้อม URL production
3. Subscribe เฉพาะ events ที่ใช้จริง เช่น `checkout.session.completed`, `invoice.paid`, `customer.subscription.updated`, `customer.subscription.deleted`
4. เก็บ `STRIPE_WEBHOOK_SECRET` ของแต่ละ environment ใน `/follow-secret-manager`
5. บันทึก event id ที่ประมวลผลแล้วเพื่อกัน duplicate

###### 4. Configure Portal And Mode

> Goal: ตั้งค่า customer portal และเตรียม go live

1. เปิด customer portal ใน dashboard settings และกำหนด features ที่อนุญาต (cancel, update payment method)
2. ตั้ง `return_url` ไปยังหน้า billing ของ app
3. ก่อน go live: แทน test keys ด้วย live keys, ยืนยัน webhook endpoint เป็น HTTPS
4. ทำ `/deep-review` domain `review-config` ระหว่าง test/live config ถ้าจำเป็น

###### 5. Verify

> Goal: ยืนยัน config ทำงานได้ end-to-end

1. ทดสอบ checkout ด้วย test card `4242 4242 4242 4242`
2. Trigger events ด้วย `stripe trigger <event>` และตรวจ handler
3. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

##### Rules

- `price_id` ต้องตรงกับ products ใน dashboard ของ environment นั้น
- Secrets/keys ผ่าน `/follow-secret-manager` เท่านั้น ห้าม commit
- Webhook endpoint production ต้องเป็น HTTPS และ verify signature ทุกครั้ง
- Merge config เดิม — ห้าม overwrite products/prices ที่ใช้งานอยู่
- ถ้า API field/option ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- Products/prices ถูกต้องและ `price_id` บันทึกใน config
- Webhook endpoint ปลอดภัย, idempotent และ subscribe events ที่จำเป็น
- Portal config พร้อมและ test → live checklist ผ่าน

### setup-stripe

##### Goal

ติดตั้ง Stripe SDK (server/client), เตรียม API keys จาก dashboard และตั้งค่า webhook signing สำหรับ local dev — first-time setup เท่านั้น

##### Scope

- ติดตั้ง `stripe`, `@stripe/stripe-js` และ Stripe CLI
- สร้างและเก็บ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET`
- Init server client และ webhook forwarding
- ไม่ครอบคลุม products/prices/webhook endpoints config → ใช้ `workflows/config-stripe/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยันสถานะปัจจุบันก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `stripe`/`@stripe/stripe-js` ติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-secrets env-vars` เพื่อดูว่า Stripe keys มีอยู่หรือยัง
4. ถ้าไม่มี Stripe account → stop และแจ้ง user สร้างจาก dashboard

###### 2. Install SDKs And CLI

> Goal: ติดตั้ง dependencies ที่จำเป็น

1. ติดตั้ง server SDK ด้วย `bun add stripe`
2. ติดตั้ง client SDK ด้วย `bun add @stripe/stripe-js` ถ้าฝั่ง client ต้องเรียก Stripe.js
3. ติดตั้ง Stripe CLI ด้วย `mise use -g stripe` หรือ `scoop install stripe`
4. Login CLI ด้วย `stripe login`

###### 3. Store Keys And Init Client

> Goal: เตรียม keys อย่างปลอดภัยและ init client

1. เปิด Developers > API keys ใน dashboard — ใช้ `/open-web-for-config-secret` (service stripe)
2. เก็บ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY` ใน `/follow-secret-manager` ไม่ใช่ `.env` จริง
3. เริ่มด้วย test mode keys — ห้ามใช้ live keys ใน dev
4. Init server client ด้วย `new Stripe(process.env.STRIPE_SECRET_KEY!)` — ถ้าต้อง pin `apiVersion` ให้ดู official docs

###### 4. Setup Webhook Signing

> Goal: ตั้งค่า webhook secret สำหรับ local dev

1. รัน `stripe listen --forward-to http://localhost:<port>/api/webhooks/stripe`
2. คัดลอก `whsec_...` จาก output ไปเป็น `STRIPE_WEBHOOK_SECRET` ใน `/follow-secret-manager`
3. Verify events ด้วย `stripe.webhooks.constructEvent(rawBody, signature, secret)` — ต้องใช้ raw request body
4. ทำ `/run-verify` และ trigger test event ด้วย `stripe trigger <event>` — ถ้า fail → `resolve-errors` max 3 รอบ

##### Rules

- ห้าม hardcode keys หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- `STRIPE_SECRET_KEY` ใช้ฝั่ง server เท่านั้น — client ใช้ publishable key
- Webhook ต้อง verify signature ด้วย raw body เสมอ
- ใช้ test mode ก่อนเสมอ — live keys เฉพาะตอน go live
- ถ้า API/option ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- Stripe SDKs และ CLI ติดตั้งพร้อมใช้งาน
- Keys ทั้งสามปลอดภัยและ inject ถูกต้อง
- Webhook forwarding + signature verification ทำงานใน local

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Stripe เชื่อมต่อได้จริง — secret key valid, mode ตรงที่คาด, webhook secret มี

##### Scope

- ใช้เมื่อ `/follow-service-stripe` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่สร้าง charges/customers

##### Execute

###### 1. Check Keys Present

> Goal: keys ครบและ mode สอดคล้อง

1. ตรวจ `STRIPE_SECRET_KEY`, `STRIPE_PUBLISHABLE_KEY`, `STRIPE_WEBHOOK_SECRET` มี (ไม่ print ค่า)
2. ตรวจ key prefix: `sk_test_`/`pk_test_` vs `sk_live_`/`pk_live_` — secret/publishable ต้อง mode เดียวกัน
3. flag test keys ใน production config (หรือกลับกัน)

###### 2. Smoke Test API Call

> Goal: API ตอบกลับด้วย key นี้

1. `stripe balance retrieve` (CLI) หรือ `stripe.balance.retrieve()` (SDK)
2. 200 = key valid; 401 = invalid/revoked
3. บันทึก mode ที่ API confirm (test vs live)

###### 3. Check Webhook Readiness

> Goal: webhook endpoint พร้อมรับ events

1. ตรวจ `STRIPE_WEBHOOK_SECRET` format (`whsec_...`)
2. local dev → `stripe listen` รันได้และ forward URL ถูก
3. production → webhook endpoint ใน dashboard ชี้ production URL (HTTPS)

###### 4. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `mode-mismatch` / `webhook-not-ready`

##### Rules

- ใช้ read calls เท่านั้น — ห้ามสร้าง checkout/charge
- ไม่ print key values — แสดงแค่ prefix/mode
- mode mismatch = flag เสมอ (test key ใน prod = critical)

##### Expected Outcome

- Verdict พร้อม mode + account evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `stripe` |
| Registry | `npm` |
| Latest Version | `22.6.2` |
| Release Date | `2026-09-09` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Stripe |
| License | `MIT` |
| Repository | `https://github.com/stripe/stripe-node` |
| Website | `https://stripe.com/` |
| Documentation | `https://docs.stripe.com/api?lang=node` |
| Releases / Changelog | `https://github.com/stripe/stripe-node/releases` |

##### Install

```bash
bun add stripe
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@stripe/stripe-js` | `npm` | `9.16.0` | Client-side SDK for checkout redirects and elements |
| `stripe` (CLI) | `system` | `unknown` | Webhook forwarding in dev — install via `mise use -g stripe` or `scoop install stripe` |

##### Notes

- Breaking changes in latest major: each major tracks a Stripe API version — pin the API version in account settings; webhook signature verification via `constructEvent` is mandatory
- Version pinned in SKILL.md: `stripe@22.6.2`, `@stripe/stripe-js@9.16.0`

## Expected Outcome

- Stripe SDK ติดตั้งและกำหนดค่าถูกต้อง
- `/pricing` page พร้อม CTA ที่ชัดเจน
- Checkout session ทำงานได้
- Subscriptions และ customer portal จัดการได้
- Webhook events ถูกต้องและปลอดภัย
- `/user/billing` และ `/dashboard` แสดงข้อมูล Stripe ได้
- พร้อม deploy ไป production
