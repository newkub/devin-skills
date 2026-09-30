---
name: follow-service-resend
description: ใช้ Resend ส่ง transactional emails — send, templates, domains, webhooks
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test

---

## Goal

ใช้ Resend ส่ง transactional emails — send, templates, domains, webhooks

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (service resend)

## Execute

### Workflows

> Goal: dispatch ไปยัง workflow ที่ตรงกับ topic

- Setup: SDK install, `RESEND_API_KEY`, test send → `workflows/setup-resend/SKILL.md`
- Config: domain verification, `EMAIL_FROM`, templates, webhooks → `workflows/config-resend/SKILL.md`
- Verify: API key valid, domain verified → `workflows/verify-connection/SKILL.md`

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

Latest: `resend@6.30.0` (verified 2026-09-26) — install ด้วย `bun add resend`

1. สร้าง `new Resend(apiKey)` — apiKey จาก env `RESEND_API_KEY`
1. ส่งด้วย `resend.emails.send({from,to,subject,html/react})` — verify domain ก่อน production
1. ใช้ React email components หรือ HTML templates — preview ใน dashboard
1. ตั้ง webhooks สำหรับ delivery/bounce events ถ้าต้อง tracking

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (service resend)

## Rules

- from address ต้องใช้ verified domain — ห้าม @resend.dev ใน production
- retry ด้วย idempotency — email ห้ามส่งซ้ำ
- แยก transactional vs marketing (Resend Broadcasts)
- เก็บ secrets ใน env ห้าม commit

## Merged Details

### config-resend

##### Goal

ตั้งค่า/แก้ไข Resend configuration — verified domains, from address, email templates และ webhooks — โดยไม่ clobber settings เดิม

##### Scope

- Verify sending domain ด้วย DNS records (SPF/DKIM)
- กำหนด from address และ reply-to ตาม environment
- ตั้งค่า React/HTML templates และ webhooks สำหรับ delivery events
- ไม่ครอบคลุม SDK install/API key → ใช้ `workflows/setup-resend/SKILL.md`

##### Execute

###### 1. Read Current Config

> Goal: รู้สถานะปัจจุบันก่อนแก้

1. อ่าน mail module, `.env*` และ templates ที่มีอยู่ใน project
2. ทำ `/check-secrets env-vars` เพื่อระบุ vars ที่ขาด เช่น `RESEND_API_KEY`, `EMAIL_FROM`
3. ตรวจ domains ที่ verify แล้วใน dashboard — ใช้ `/open-web-for-config-secret` (service resend)
4. ถ้ายังไม่มี SDK/API key → ทำ `workflows/setup-resend/SKILL.md` แทน

###### 2. Verify Sending Domain

> Goal: ให้ domain พร้อมส่งใน production

1. เพิ่ม domain ใน dashboard (Domains > Add domain)
2. เพิ่ม DNS records ที่ dashboard กำหนด (SPF, DKIM และ MX สำหรับ bounce ถ้าต้องการ) ที่ DNS provider
3. รอ verify — ตรวจ status ใน dashboard จนขึ้น verified
4. ถ้า DNS ไม่ verify → ตรวจ record names/values อีกครั้งก่อนแจ้ง user

###### 3. Configure From Address And Templates

> Goal: กำหนด sender และ template config อย่างสม่ำเสมอ

1. กำหนด `EMAIL_FROM` เช่น `Name <noreply@yourdomain.com>` ใน env — ต้องเป็น verified domain เท่านั้น
2. รวม from/reply-to ไว้ใน config เดียวของ project ห้าม hardcode กระจายใน code
3. ใช้ React email components หรือ HTML templates — preview/test ก่อน production
4. Merge เฉพาะ keys ที่จำเป็น — ห้าม overwrite config เดิม

###### 4. Configure Webhooks

> Goal: track delivery events อย่างปลอดภัย (เฉพาะถ้าต้องการ)

1. เพิ่ม webhook endpoint ใน dashboard พร้อมเลือก events เช่น `email.delivered`, `email.bounced`, `email.complained`
2. เก็บ webhook signing secret ใน `/follow-secret-manager`
3. Verify signature ทุกครั้งตาม official docs
4. บันทึก event id เพื่อ idempotent handling — email ห้าม trigger ซ้ำ

###### 5. Verify

> Goal: ยืนยัน email ส่งจริงจาก verified domain

1. ส่ง test email จาก from address จริงและตรวจ inbox/headers (SPF/DKIM pass)
2. ทำ `/run-verify` — ถ้า fail → revert keys ที่แก้ ทำ `resolve-errors` แล้ว report diff

##### Rules

- From address ต้องใช้ verified domain — ห้าม `@resend.dev` ใน production
- แยก transactional vs marketing (ใช้ Broadcasts สำหรับ marketing)
- Secrets ผ่าน `/follow-secret-manager` เท่านั้น ห้าม commit
- Retry ด้วย idempotency — ห้ามส่ง email ซ้ำ
- ถ้า DNS field/API ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- Domain verified พร้อม SPF/DKIM pass
- `EMAIL_FROM` ชัดเจนและใช้ verified domain
- Templates ส่งได้จริงและ webhooks (ถ้ามี) ปลอดภัย

### setup-resend

##### Goal

ติดตั้ง Resend SDK, สร้าง API key จาก dashboard และ init client ให้ส่ง transactional email ได้ — first-time setup เท่านั้น

##### Scope

- ติดตั้ง `resend` package และ init `new Resend(apiKey)`
- สร้างและเก็บ `RESEND_API_KEY` อย่างปลอดภัย
- ส่ง test email ใน sandbox mode
- ไม่ครอบคลุม domain verification, from-address, webhooks → ใช้ `workflows/config-resend/SKILL.md`

##### Execute

###### 1. Check Prerequisites

> Goal: ยืนยันสถานะปัจจุบันก่อนติดตั้ง (idempotent)

1. อ่าน `package.json` เพื่อระบุ runtime และ package manager
2. ตรวจว่ามี `resend` ติดตั้งแล้ว → ถ้ามี skip ไป verify
3. ทำ `/check-secrets env-vars` เพื่อดูว่า `RESEND_API_KEY` มีอยู่หรือยัง
4. ถ้าไม่มี Resend account → stop และแจ้ง user สร้างจาก dashboard

###### 2. Install SDK

> Goal: ติดตั้ง package ตาม runtime

1. Node/Bun: `bun add resend` (หรือ package manager ที่ตรวจพบ)
2. ภาษาอื่น (Python, Go, ฯลฯ) → ดู official docs
3. ยืนยันว่า dependency อยู่ใน `package.json`

###### 3. Create And Store API Key

> Goal: เตรียม API key อย่างปลอดภัย

1. สร้าง API key จาก Resend Dashboard — ใช้ `/open-web-for-config-secret` (service resend)
2. เลือก permission ขั้นต่ำที่จำเป็น (เช่น sending access เท่านั้น)
3. เก็บ `RESEND_API_KEY` ใน `/follow-secret-manager` แล้ว inject เข้า environment — ห้าม commit

###### 4. Init Client And Smoke Test

> Goal: init client และส่ง test email

1. สร้าง client ด้วย `new Resend(process.env.RESEND_API_KEY)` ฝั่ง server เท่านั้น
2. ส่ง test email ด้วย `resend.emails.send({ from, to, subject, html })` — ก่อน verify domain ใช้ `onboarding@resend.dev` เป็น from
3. ตรวจ response `id` ว่าส่งสำเร็จ — ถ้า error → ทำ `resolve-errors` max 3 รอบ
4. ทำ `/run-verify` สำหรับ lint, typecheck

##### Rules

- ห้าม hardcode API key หรือ commit secrets — ใช้ `/follow-secret-manager` เสมอ
- Client ต้องอยู่ฝั่ง server เท่านั้น ห้าม expose `RESEND_API_KEY` ไป browser
- `onboarding@resend.dev` ใช้ได้เฉพาะ sandbox/testing — production ต้อง verified domain
- ถ้า API/method ไม่แน่ใจ → ดู official docs หรือ `learn` (web)

##### Expected Outcome

- `resend` SDK ติดตั้งและอยู่ใน `package.json`
- `RESEND_API_KEY` ปลอดภัยและ inject ถูกต้อง
- ส่ง test email สำเร็จและ verify ผ่าน

### verify-connection

##### Goal

ยืนยันหลัง setup/config ว่า Resend เชื่อมต่อได้จริง — `RESEND_API_KEY` valid, sending domain verified

##### Scope

- ใช้เมื่อ `/follow-service-resend` dispatch มาที่ `verify`/`verify-connection`
- Read-only: ตรวจสอบ — ไม่ส่ง email จริง (test send อยู่ใน setup workflow)

##### Execute

###### 1. Check API Key

> Goal: `RESEND_API_KEY` มีและ valid

1. ตรวจ env var มีค่า (ไม่ print ค่า)
2. เรียก `resend.domains.list()` — 200 = key valid, 401 = invalid

###### 2. Check Domain Status

> Goal: sending domain verified พร้อมส่ง

1. หา domain ที่ใช้ใน `EMAIL_FROM` จาก domains list
2. flag domain ที่ status ไม่ใช่ `verified` — DNS records ยังไม่ครบ
3. ถ้าไม่มี domain เลย → ยังส่งได้แค่ `onboarding@resend.dev`

###### 3. Report

> Goal: สรุป connection status

1. ใช้ `/report` คอลัมน์: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `domain-unverified` / `no-domain`

##### Rules

- ใช้ list/read calls เท่านั้น — ห้าม `resend.emails.send`
- ไม่ print API key
- domain unverified → รายงาน DNS records ที่ขาดให้ config workflow จัดการ

##### Expected Outcome

- Verdict connection พร้อม domain status evidence

### references/package-manifest

#### Package Manifest

> Metadata of the primary package(s) this skill installs or covers. Update during `/update-devin-global-skills` or `/deep-review` runs.

##### Primary Package

| Field | Value |
|-------|-------|
| Package | `resend` |
| Registry | `npm` |
| Latest Version | `6.28.0` |
| Release Date | `2026-09-11` |
| Verified | `2026-09-12` (date this file was last checked) |
| Author / Publisher | Resend |
| License | `MIT` |
| Repository | `https://github.com/resend/resend-node` |
| Website | `https://resend.com/` |
| Documentation | `https://resend.com/docs` |
| Releases / Changelog | `https://github.com/resend/resend-node/releases` |

##### Install

```bash
bun add resend
```

##### Secondary Packages

| Package | Registry | Latest | Notes |
|---------|----------|--------|-------|
| `@react-email/components` | `npm` | `unknown` | Optional — React email templates for `react` field in `emails.send` |

##### Notes

- Breaking changes in latest major: none documented; `from` must use a verified domain in production
- Version pinned in SKILL.md: `6.28.0`

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (service resend)
- ไม่มี security/performance pitfalls ที่รู้จัก (service resend)
- Lint, typecheck, tests ผ่าน
