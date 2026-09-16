---
name: follow-lib-simplewebauthn
description: ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test
  - follow-lib-better-auth
---

## Goal

ใช้ simplewebauthn ทำ passkeys/WebAuthn — registration + authentication ceremonies

## Scope

ใช้เมื่อ task เกี่ยวข้องกับ passkeys/WebAuthn แบบ manual — setup, ceremonies, credential storage, debugging, หรือ best practices

- ใช้ skill นี้เมื่อ implement WebAuthn เองด้วย `@simplewebauthn/server` + `@simplewebauthn/browser`
- ถ้า project ใช้ Better Auth อยู่แล้ว ให้ใช้ `passkey()` plugin ผ่าน `/follow-lib-better-auth` แทน manual setup

- Latest: `@simplewebauthn/server@14.0.2` / `@simplewebauthn/browser@14.0.0` (verified 2026-09-16)
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

### 2. Store Credentials

> Goal: persist credentials ให้ ceremonies ทำงานซ้ำได้

1. เก็บ per-user credential: `id`, `publicKey`, `counter`, `transports` — ผูกกับ user record
2. อัปเดต `counter` จาก `verifyAuthenticationResponse` ทุกครั้ง — counter ไม่เพิ่ม = possible cloned authenticator
3. รองรับ multiple credentials per user (หลายอุปกรณ์)

### 3. Common Pitfalls

> Goal: หลีกเลี่ยง ceremony failures ที่พบบ่อย

1. `rpID` เป็น domain เท่านั้น (ไม่มี protocol/port); `expectedOrigin` เป็น full origin เช่น `https://app.com` — dev ใช้ `http://localhost:5173`
2. challenge ต้อง random + one-time + short-lived — verify ฝั่ง server เท่านั้น
3. production ต้อง HTTPS — WebAuthn ทำงานเฉพาะ secure context (localhost ยกเว้น)
4. Passkey autofill: `startAuthentication({ optionsJSON, useBrowserAutofill: true })` + `<input autocomplete="username webauthn">`

### 4. Verify

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

- ใช้ `/run-verify` ถ้าจำเป็น
- ใช้ `/run-test` ถ้าจำเป็น
- ใช้ `/follow-lib-better-auth` ถ้าจำเป็น

## Expected Outcome

- ใช้งาน library ถูกต้องตาม best practices (lib simplewebauthn)
- ไม่มี security/performance pitfalls ที่รู้จัก (lib simplewebauthn)
- Lint, typecheck, tests ผ่าน
