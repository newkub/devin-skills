---
name: check-webhook-security
description: ตรวจ webhook endpoints — signature verification, replay protection และ endpoint auth
argument-hint: "[endpoint-or-provider]"
related:
  - improve-auth
  - report-table
---

## Goal

ตรวจ webhook receivers ว่าปลอดภัย — verify signatures จาก provider, กัน replay attacks และจำกัดสิทธิ์การเข้าถึง endpoint

## Scope

- ตรวจ webhook handlers: Stripe, GitHub, Twilio, LINE, custom webhooks ตามที่ project รับ
- ครอบคลุม: signature verification, timestamp tolerance, replay protection, secret management, endpoint exposure
- Read-only: รายงาน — แก้ผ่าน `/improve-auth` หรือ `/improve-security`

## Execute

### 1. Map Webhook Handlers

> Goal: รวบรวม webhook endpoints ทั้งหมด

1. ใช้ `scan-codebase`/`use-astgrep` หา webhook route handlers — patterns เช่น `/webhook`, `/hooks/`, provider-specific paths
2. ระบุ provider ต่อ endpoint (Stripe, GitHub, custom) — แต่ละ provider มี signature scheme ต่างกัน
3. flag endpoints ที่รับ POST จาก external แต่ไม่มี verification เลย

### 2. Verify Signature Checks

> Goal: ตรวจว่า signature verification ถูกต้อง

1. มีไหม: handler ต้อง verify signature ก่อน process — flag ที่ parse payload ก่อน verify
2. ถูกไหม: ใช้ provider SDK verification (เช่น `stripe.webhooks.constructEvent`) ไม่ใช่ compare เอง
3. Raw body: signature คำนวณบน raw body — flag body parsing ที่ทำลาย raw bytes ก่อน verify
4. Timing-safe: comparison ต้อง timing-safe (HMAC compare) ไม่ใช่ `===`

### 3. Check Replay And Secret Hygiene

> Goal: ตรวจ replay protection และ secret handling

1. Timestamp tolerance — รับ events เก่าแค่ไหน (Stripe: ±5min default)
2. Replay protection: event ID dedup, timestamp validation, nonce handling
3. Secret: webhook secrets ต้องอยู่ใน env/secret manager — ทำ `/check-secrets-leak` ร่วม
4. Endpoint exposure: ไม่ leak internal paths, มี rate limiting (`/check-rate-limiting`)

### 4. Report

> Goal: สรุป findings พร้อม severity

1. ใช้ `/report-table`: `No.`, `Endpoint`, `Provider`, `Issue`, `Severity`, `Fix`
2. Severity: `critical` (no verification), `high` (broken verification, replay possible), `medium` (weak tolerance, missing dedup)
3. ระบุ provider-specific best practices ที่ขาด

## Rules

### 1. Evidence-Based

- ทุก finding อ้าง code/config จริง — ไม่ assume ว่า "น่าจะ verify"
- ทดสอบด้วย crafted requests เฉพาะบน local/staging เท่านั้น

### 2. Read-Only

- ไม่แก้ handlers — รายงานให้ remediation แยก
- ไม่ส่ง fake webhooks ไป production

### 3. Provider Aware

- แต่ละ provider มี scheme ต่างกัน — ใช้ provider SDK/docs เป็น reference
- Custom webhooks: ต้องมี HMAC signature + timestamp + dedup เป็น minimum

## Expected Outcome

- รายการ webhook security findings พร้อม severity
- Verification gaps และ replay risks ที่ชัดเจน
- Provider-specific recommendations
