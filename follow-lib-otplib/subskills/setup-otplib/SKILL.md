---
name: follow-lib-otplib-setup-otplib
description: ติดตั้ง otplib v13 และตั้งค่า TOTP generate/verify พร้อม secret storage
argument-hint: "[scope]"
related:
  - follow-lib-otplib
  - follow-lib-qrcode
  - follow-secret-manager
  - learn
  - resolve-errors
---

## Goal

ติดตั้ง `otplib` v13 และตั้งค่า TOTP 2FA flow — generate secret, QR provisioning, verify — พร้อม secret storage ที่ปลอดภัย — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี otplib (ถ้ามีอยู่แล้ว → verify เท่านั้น; ถ้า v12 → migrate ผ่าน `@otplib/v12-adapter` เป็น bridge)
- ครอบคลุม: install, `generateSecret`/`generate`/`verify`/`generateURI`, crypto plugin, secret storage
- v13 เป็น rewrite — functional API, async-first, ไม่มี `preset-default`/`authenticator` แล้ว

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `otplib` แล้วตรวจ version (v12 API ต่างจาก v13 มาก)
2. ระบุว่า verify จะรันที่ไหน — server เท่านั้น ห้าม verify ฝั่ง client
3. ระบุ storage สำหรับ TOTP secrets — database field ที่ encrypted ได้
4. ถ้าไม่แน่ใจ API → ทำ `/learn-from-references` ดู official docs

### 2. Install

> Goal: ติดตั้ง otplib และ crypto plugin ตาม runtime

1. รัน `bun add otplib` (หรือ package manager ตาม lockfile)
2. ติดตั้ง crypto plugin ตาม runtime — เช่น `@otplib/plugin-crypto-node` หรือ `@otplib/plugin-crypto-noble` (จำเป็นสำหรับ sync APIs)
3. ยืนยันอยู่ใน `dependencies`

### 3. TOTP Flow

> Goal: enroll และ verify flow ทำงาน

1. Enroll: `generateSecret()` ต่อ user → เก็บ secret encrypted ใน DB (ยังไม่ activate จนกว่า verify ครั้งแรกผ่าน)
2. QR provisioning: `generateURI({ issuer, label, secret })` → render QR ด้วย `/follow-lib-qrcode` หรือ lib ที่ project ใช้
3. Verify: `await verify({ secret, token })` — คืน `VerifyResult` เช็ค `.valid` (ไม่ใช่ boolean)
4. ตั้ง `epochTolerance` เผื่อ clock drift ของ authenticator app
5. `generateSync`/`verifySync` ใช้ได้เฉพาะเมื่อ register sync crypto plugin — default ใช้ async APIs

### 4. Secure Secret Storage

> Goal: secrets ไม่รั่วและ verify กัน brute-force

1. เข้ารหัส secret ก่อนเก็บ DB (app-level encryption หรือ DB encryption) — ห้าม plaintext ใน production
2. ห้ามใส่ secret ใน JWT, API response หรือ logs — URI ส่งครั้งเดียวตอน enroll เท่านั้น
3. Rate-limit verify attempts ต่อ user/IP — กัน brute-force 6-digit codes
4. เพิ่ม recovery codes หรือ fallback method — user ที่เสีย device ต้องกลับเข้าได้

### 5. Verify

> Goal: enroll→verify round-trip ผ่านจริง

1. Smoke: `generateSecret` → `generate({ secret })` หรือ token จาก authenticator → `verify` คืน `.valid === true`
2. Wrong token → `.valid === false`; rate limit ทำงาน
3. รัน lint/typecheck — ถ้าไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น
- ใช้ TOTP เป็นหลัก — HOTP เฉพาะ use case เฉพาะ
- Verify ฝั่ง server เสมอ — client ส่งแค่ token
- `verify`/`verifySync` คืน `{ valid }` — เช็ค `result.valid` เสมอ
- Migrate v12 → v13 ผ่าน `@otplib/v12-adapter` เป็น temporary bridge เท่านั้น

## Expected Outcome

- `otplib` v13 + crypto plugin ติดตั้ง, enroll/verify flow ผ่าน
- Secrets encrypted at rest, rate limiting เปิดใช้
- พร้อม integrate เข้า auth flow ของ project
