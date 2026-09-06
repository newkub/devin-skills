---
name: improve-auth
description: แก้ findings จาก review-auth ครอบคลุม authn, authz, sessions, tokens และ secrets
argument-hint: "[finding-or-scope]"
related:
  - review-auth
  - improve-security
  - follow-lib-better-auth
  - check-security-headers
  - check-secrets-leak
  - review-by-security
  - report-review
  - check-webhook-security
---

## Goal

แก้ไข authentication/authorization findings จาก `/review-auth` — session management, token handling, access control, password policies และ auth-related secrets

## Scope

- รับ findings จาก `/review-auth` หรือ `/review-by-security`
- ครอบคลุม: session/cookie security, JWT handling, password storage, RBAC/permissions, OAuth flows, rate limiting บน auth endpoints, secrets rotation
- Action-oriented: แก้ไขจริง — auth changes เสี่ยงสูง ต้อง test ครบ

## Execute

### 1. Triage Findings

> Goal: เรียง auth findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-auth` report ล่าสุด
2. จัดกลุ่ม: authn (login/session/token), authz (permissions/access), secrets, transport
3. เรียงตาม exploitability — session hijack, privilege escalation, credential exposure ก่อน

### 2. Fix Authentication Issues

> Goal: แก้ authn findings

1. Session cookies: `Secure`, `HttpOnly`, `SameSite`, expiry ที่เหมาะสม — ทำ `/check-security-headers` ตรวจจริง
2. Token handling: expiry, rotation, secure storage (ไม่เก็บ sensitive tokens ใน localStorage ถ้าไม่จำเป็น)
3. Password: hashing ที่ถูกต้อง (bcrypt/argon2), policy ตาม standard
4. Rate limiting / lockout บน login endpoints
5. ถ้า project ใช้ auth lib → อัปเดตตาม best practices ของ lib นั้น (`/follow-lib-better-auth`, `/follow-service-workos`)

### 3. Fix Authorization Issues

> Goal: แก้ authz findings

1. ตรวจ authorization checks ทุก sensitive route/action — IDOR, missing role checks
2. แก้ permission model: deny by default, ตรวจ server-side เสมอ (ไม่พึ่ง client checks)
3. flag endpoints ที่ return data เกินสิทธิ์ (over-fetching ที่รั่วข้อมูล)

### 4. Fix Secrets And Transport

> Goal: แก้ auth-related secrets และ transport

1. ทำ `/check-secrets-leak` — secrets/keys ต้องไม่อยู่ใน code
2. ย้าย hardcoded credentials ไป env/secret manager (`/follow-secret-manager`)
3. บังคับ HTTPS, redirect HTTP→HTTPS, HSTS

### 5. Verify And Report

> Goal: ทดสอบ auth flows หลังแก้

1. `/run-test` + auth-related tests ต้องผ่าน — login, logout, refresh, permission checks
2. ทดสอบ edge cases: expired token, wrong role, concurrent sessions
3. ใช้ `/report-review` สรุป fixed findings

## Rules

### 1. High-Risk Caution

- Auth changes เสี่ยงสูง — ทดสอบครบทุก flow ก่อนเสร็จ
- ถ้า fix อาจ lock users out → เสนอแผนก่อนผ่าน `/ask-me`

### 2. Defense In Depth

- Server-side checks เสมอ — client-side เป็น UX เท่านั้น
- ไม่ rely on security through obscurity

### 3. Evidence-Based

- แก้เฉพาะ findings จริง — ไม่ rewrite auth system ถ้าไม่มี findings
- ทุก fix ต้องระบุ finding ที่ resolve

## Expected Outcome

- Auth findings ถูกแก้ตาม severity พร้อมการทดสอบ
- Sessions/tokens/secrets ปลอดภัยตาม baseline
- รายงาน fixes และ residual risks
