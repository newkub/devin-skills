---
name: follow-lib-otplib
description: ใช้ otplib สำหรับ TOTP/HOTP 2FA — generate secret, verify token, QR provisioning
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ otplib สำหรับ TOTP/HOTP 2FA — generate secret, verify token, QR provisioning

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib otplib)

- Latest: `otplib@13.5.0` (verified 2026-09-11)

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ `authenticator` จาก `otplib/preset-default` หรือ browser preset ตาม runtime
1. generate secret ด้วย `authenticator.generateSecret()` แล้วสร้าง `keyuri` สำหรับ QR
1. verify ด้วย `authenticator.check(token, secret)` — ตั้ง `window` เผื่อ clock drift
1. เก็บ secret encrypted — ไม่ใส่ใน JWT หรือ response

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib otplib)

## Rules

- ใช้ TOTP (time-based) เป็นหลัก — HOTP เฉพาะ use case เฉพาะ
- verify ฝั่ง server เสมอ ห้าม verify ฝั่ง client
- rate-limit verify attempts กัน brute-force

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib otplib)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib otplib)
- Lint, typecheck, tests ผ่าน
