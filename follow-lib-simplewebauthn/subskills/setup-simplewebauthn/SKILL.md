---
name: follow-lib-simplewebauthn-setup-simplewebauthn
description: ติดตั้ง simplewebauthn server+browser และตั้งค่า registration/authentication flow
argument-hint: "[ceremony-or-scope]"
related:
  - follow-lib-simplewebauthn
  - follow-lib-better-auth
  - learn-web
  - resolve-errors
---

## Goal

ติดตั้ง `@simplewebauthn/server` + `@simplewebauthn/browser` และตั้งค่า passkey registration/authentication ceremonies ให้ทำงาน end-to-end — first-time setup เท่านั้น

## Scope

- ใช้เมื่อ project ยังไม่มี simplewebauthn (ถ้ามีอยู่แล้ว → verify เท่านั้น)
- ครอบคลุม: install ทั้งสองฝั่ง, rpID/origin config, registration + authentication ceremony flow
- ถ้าใช้ Better Auth → พิจารณา `passkey()` plugin ผ่าน `/follow-lib-better-auth` แทน manual setup

## Execute

### 1. Check Precondition

> Goal: ตรวจสอบ environment ก่อน setup

1. อ่าน `package.json` — ถ้ามี `@simplewebauthn/*` แล้ว → skip ไป verify
2. ระบุ `rpID` (domain, ไม่มี protocol/port), `rpName`, `origin` (full URL รวม protocol+port) — mismatch = ceremony fail
3. ยืนยัน HTTPS ใน production — WebAuthn ต้อง secure context (localhost dev ยกเว้น)
4. ระบุ storage สำหรับ credentials ต่อ user (id, publicKey, counter, transports)

### 2. Install

> Goal: ติดตั้ง packages ทั้ง server และ browser

1. Server: `bun add @simplewebauthn/server`
2. Browser: `bun add @simplewebauthn/browser`
3. Types: import จาก `@simplewebauthn/server`/`browser` โดยตรง — `@simplewebauthn/types` ถูก retire ตั้งแต่ v13
4. ยืนยันทั้งคู่อยู่ใน `dependencies`

### 3. Registration Ceremony

> Goal: enroll passkey ใหม่ต่อ user

1. Server: `generateRegistrationOptions({ rpName, rpID, userName, ... })` → ส่ง options ไป client, เก็บ challenge ไว้ (session/DB, short-lived)
2. Browser: `startRegistration({ optionsJSON })` — v11+ รับ single object เท่านั้น ห้าม positional args
3. Server: `verifyRegistrationResponse({ response, expectedChallenge, expectedOrigin, expectedRPID })` → เช็ค `verified`
4. เก็บ credential: `id`, `publicKey`, `counter`, `transports` ผูกกับ user — รองรับหลาย credentials ต่อ user

### 4. Authentication Ceremony

> Goal: login ด้วย passkey

1. Server: `generateAuthenticationOptions({ rpID, allowCredentials })` → เก็บ challenge
2. Browser: `startAuthentication({ optionsJSON })` — `useBrowserAutofill: true` สำหรับ conditional UI (passkey autofill บน username field)
3. Server: `verifyAuthenticationResponse({ response, expectedChallenge, expectedOrigin, expectedRPID, credential })` → เช็ค `verified`
4. อัปเดต `counter` จาก response — counter ถอยหลัง = possible cloned authenticator → flag/deny

### 5. Verify

> Goal: ceremonies ผ่านจริงบน browser

1. Test registration บน browser จริง (platform authenticator หรือ security key)
2. Test authentication — login ด้วย passkey ที่เพิ่ง enroll
3. Wrong origin/rpID → ceremony ต้อง fail (ยืนยัน config ถูก)
4. รัน lint/typecheck — ถ้าไม่ผ่าน → ทำ `/resolve-errors` max 3 รอบ แล้ว stop report; ผ่าน → `/suggest-next-action`

## Rules

- Idempotent — ถ้า setup ไปแล้วให้ verify เท่านั้น
- Challenge ต้อง random + one-time + short-lived — verify ฝั่ง server เสมอ ห้าม trust client
- `rpID`/`origin` ต้องตรง domain ที่ deploy จริง — mismatch คือ cause อันดับหนึ่งของ ceremony fail
- เก็บและอัปเดต `counter` เสมอ — ตรวจ cloned authenticators
- ตั้ง `userVerification` ตาม security level ที่ต้องการ — ถ้าไม่แน่ใจ options → ดู official docs (simplewebauthn.dev)

## Expected Outcome

- Server + browser packages ติดตั้ง, rpID/origin config ถูกต้อง
- Registration และ authentication ceremonies ผ่าน end-to-end
- Credentials + counter ถูกเก็บอย่างปลอดภัยต่อ user
