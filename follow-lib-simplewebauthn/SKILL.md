---
name: follow-lib-simplewebauthn
description: ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test-unit
---

## Goal

ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices

## Execute

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. server: `generateRegistrationOptions` → client `startRegistration` → `verifyRegistrationResponse`
1. server: `generateAuthenticationOptions` → client `startAuthentication` → `verifyAuthenticationResponse`
1. เก็บ credential: id, publicKey, counter, transports — per user
1. ตั้ง `rpID`, `rpName`, `origin` ให้ตรง domain — mismatch = ceremony fail

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test-unit` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ

## Rules

- challenge ต้อง random + one-time + short-lived — verify ฝั่ง server
- เก็บ `counter` ไว้ตรวจ cloned authenticators
- require `userVerification` ตาม security level
- รองรับ multiple credentials per user

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices
- ไม่มี security/performance pitfalls ที่รู้จัก
- Lint, typecheck, tests ผ่าน