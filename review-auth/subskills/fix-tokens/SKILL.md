---
name: review-auth-fix-tokens
description: Fix token refresh, rotation, storage, transport, and JWT validation findings
argument-hint: "[scope-or-findings]"
related:
  - review-auth
  - review-security
  - check-secrets
  - follow-lib-better-auth
  - follow-secret-manager
  - run-test
  - ask-me
  - report
  - resolve-errors
---

## Goal

แก้ token findings จาก `/review-auth` — JWT validation, refresh token rotation/reuse detection, token storage, transport, expiry และ revocation

## Scope

- ครอบคลุม: JWT signing algorithm, claims (`exp`, `iss`, `aud`, `sub`), key management/rotation, refresh token rotation + binding + reuse detection, access token storage, token ใน URL/logs, revocation strategy
- ไม่ครอบคลุม session lifecycle/cookies → ใช้ `subskills/fix-sessions/SKILL.md`
- Action-oriented: token changes เสี่ยงสูง — ทดสอบ expired/tampered cases ครบ

## Execute

### 1. Triage Token Findings

> Goal: เรียง token findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-auth` report ล่าสุด — เลือกเฉพาะกลุ่ม token/JWT
2. อ้าง checklist ใน `references/auth-checklist.md` section Session & Token
3. เรียงตาม exploitability — token forgery, replay, exposure ก่อน

### 2. Fix JWT Validation

> Goal: verify ทุก claim อย่างเคร่งครัด

1. Algorithm allowlist — ใช้ RS256/EdDSA ตาม stack, ห้าม `none`, ห้าม HS256 กับ public key
2. บังคับ validate `exp`, `iss`, `aud`, `sub` ทุก request — ห้าม trust payload โดยไม่ verify signature
3. Secret/key ต้องยาวพอ (>= 256 bits) และ rotate ได้ — ถ้า hardcode อยู่ ทำ `/check-secrets` แล้วย้ายไป env/secret manager (`/follow-secret-manager`)

### 3. Fix Refresh Flow

> Goal: refresh token ปลอดภัยและ revoke ได้

1. เปิด refresh token rotation — issue ใหม่ทุกครั้งที่ใช้, revoke ตัวเก่า
2. เพิ่ม reuse detection — token เก่าถูกใช้ซ้ำ → revoke ทั้ง family และ flag anomaly
3. Bind token กับ user + device/context ตามความเหมาะสม
4. ตั้ง expiry: access token สั้น, refresh token bounded พร้อม revocation list/DB record

### 4. Fix Storage And Transport

> Goal: token ไม่ leak ผ่าน storage, URL หรือ logs

1. Access/refresh tokens ไม่เก็บใน localStorage ถ้าไม่จำเป็น — prefer HttpOnly cookie หรือ memory
2. ห้าม token ใน URL/query — ย้ายไป header หรือ HttpOnly cookie
3. ตรวจ logs ไม่เขียน token — เพิ่ม redaction ถ้าจำเป็น
4. ถ้า project ใช้ auth lib → อัปเดตตาม lib นั้น (`/follow-lib-better-auth`)

### 5. Verify And Report

> Goal: token flows ทำงานและ deny ถูกต้อง

1. รัน `/run-test` — login, refresh, logout ต้องผ่าน
2. ทดสอบ attack cases: expired token → deny, tampered signature → deny, reused refresh token → revoke
3. สรุป fixed findings และ residual risks ด้วย `/report`

## Rules

- Token changes เสี่ยงสูง — ถ้า fix อาจ lock users out → เสนอแผนก่อนผ่าน `/ask-me`
- ไม่ rely on security through obscurity — verify ทุกอย่าง server-side
- แก้เฉพาะ findings จริง — ทุก fix ต้องระบุ finding ที่ resolve
- ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบแล้ว report

## Expected Outcome

- JWT validation ครบทุก claim — algorithm allowlist บังคับใช้
- Refresh rotation + reuse detection ทำงาน — secrets ไม่อยู่ใน code
- Tokens ไม่ leak ผ่าน storage/URL/logs — รายงาน fixes พร้อม evidence

