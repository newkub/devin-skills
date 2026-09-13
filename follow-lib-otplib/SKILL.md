---
name: follow-lib-otplib
description: ใช้ otplib สำหรับ TOTP/HOTP 2FA — generate secret, verify token, QR provisioning
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-lib-qrcode
---

## Goal

ใช้ otplib สำหรับ TOTP/HOTP 2FA — generate secret, verify token, QR provisioning

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib otplib)

- ครอบคลุม: TOTP/HOTP secret generation, token generate/verify, `otpauth://` URI provisioning, crypto plugins, secret storage
- ไม่ครอบคลุม: render QR image จาก otpauth URI — ใช้ `/follow-lib-qrcode`; general auth/session design — ดู sibling skills ตาม stack
- ไม่มี CLI — ใช้งานผ่าน programmatic API เท่านั้น (จึงไม่มี `references/cli.md`)
- Latest: `otplib@13.5.0` (verified 2026-09-13) — v13 เป็น rewrite ใหม่ทั้งหมด (breaking changes)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-otplib/SKILL.md` — install, TOTP generate/verify, secret storage |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. ใช้ functional API `import { generateSecret, generate, verify, generateURI } from 'otplib'` — หรือ class API `new OTP()` (v13 ไม่มี `preset-default`/`authenticator` แล้ว)
1. generate secret ด้วย `generateSecret()` แล้วสร้าง otpauth:// URI ด้วย `generateURI({issuer, label, secret})` สำหรับ QR
1. verify ด้วย `await verify({secret, token})` — คืน `VerifyResult` ให้เช็ค `.valid` (ไม่ใช่ boolean) — ตั้ง `epochTolerance` เผื่อ clock drift
1. API เป็น async-first — `generateSync`/`verifySync` ใช้ได้เฉพาะกับ sync crypto plugin (`@otplib/plugin-crypto-node`/`@otplib/plugin-crypto-noble`)
1. เก็บ secret encrypted — ไม่ใส่ใน JWT หรือ response

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib otplib)

## Rules

- ใช้ TOTP (time-based) เป็นหลัก — HOTP เฉพาะ use case เฉพาะ
- verify ฝั่ง server เสมอ ห้าม verify ฝั่ง client
- rate-limit verify attempts กัน brute-force
- `verify`/`verifySync` คืน object `{valid}` ไม่ใช่ boolean — เช็ค `result.valid` เสมอ
- migrate จาก v12 ด้วย `@otplib/v12-adapter` เป็น temporary bridge เท่านั้น แล้วย้ายไป v13 API

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น
- ใช้ `/follow-lib-qrcode` ถ้าต้อง render QR จาก `otpauth://` URI

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib otplib)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib otplib)
- Lint, typecheck, tests ผ่าน
