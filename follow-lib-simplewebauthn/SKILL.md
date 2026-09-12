---
name: follow-lib-simplewebauthn
description: ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
---

## Goal

ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ library/tool นี้ — setup, usage, debugging, หรือ best practices (lib simplewebauthn)

- Latest: `@simplewebauthn/server@14.0.1` / `@simplewebauthn/browser@14.0.0` (verified 2026-09-12)
- References: [apis](references/apis.md) | [routes](references/routes.md) | [website](references/website.md)

## Execute

### Subskills

| Topic | Subskill |
|-------|----------|
| Setup | `subskills/setup-simplewebauthn/SKILL.md` — server+browser install, ceremony flow |

### 1. Setup And Usage

> Goal: ใช้งานถูกต้องตาม official docs

1. server: `generateRegistrationOptions` → client `startRegistration({ optionsJSON })` → `verifyRegistrationResponse`
1. server: `generateAuthenticationOptions` → client `startAuthentication({ optionsJSON })` → `verifyAuthenticationResponse`
1. ตั้งแต่ v11 browser methods รับ single object เท่านั้น — ห้ามส่ง options เป็น positional arg ตรงๆ; `useBrowserAutofill: true` สำหรับ conditional UI (passkey autofill)
1. เก็บ credential: id, publicKey, counter, transports — per user
1. ตั้ง `rpID`, `rpName`, `origin` ให้ตรง domain — mismatch = ceremony fail

### 2. Verify

> Goal: ตรวจสอบว่าใช้งานถูกต้อง

1. ทำ `/run-verify` สำหรับ lint, typecheck
2. ทำ `/run-test` ถ้ามี test ที่เกี่ยวข้อง
3. ตรวจ official docs ล่าสุดก่อนใช้ API ที่ไม่แน่ใจ (lib simplewebauthn)

## Rules

- challenge ต้อง random + one-time + short-lived — verify ฝั่ง server
- เก็บ `counter` ไว้ตรวจ cloned authenticators
- require `userVerification` ตาม security level
- รองรับ multiple credentials per user
- `@simplewebauthn/types` ถูก retire ตั้งแต่ v13 — import types จาก `@simplewebauthn/server`/`browser` โดยตรง
- ใช้ `preferredAuthenticatorType` ใน `generateRegistrationOptions` (`'securityKey'`, `'localDevice'`, `'remoteDevice'`) เมื่อต้องการกำหนด hints

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib simplewebauthn)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib simplewebauthn)
- Lint, typecheck, tests ผ่าน
