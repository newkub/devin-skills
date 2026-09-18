---
name: review-auth-fix-sessions
description: Fix session lifecycle, expiry, storage, and cookie security findings
argument-hint: "[scope-or-findings]"
related:
  - review-auth
  - review-security
  - check-security-headers
  - follow-lib-better-auth
  - run-test
  - ask-me
  - report
  - resolve-errors
---

## Goal

แก้ session findings จาก `/review-auth` — session lifecycle (creation, fixation, invalidation), expiry/timeout, storage (server/DB/Redis vs client) และ cookie security flags

## Scope

- ครอบคลุม: session ID generation, session fixation, rotation after login, expiry/idle timeout, logout invalidation, concurrent sessions, cookie flags (`HttpOnly`, `Secure`, `SameSite`), session storage backend
- ไม่ครอบคลุม JWT/refresh token mechanics → ใช้ `subskills/fix-tokens/SKILL.md`
- Action-oriented: session changes เสี่ยงสูง — ทดสอบครบทุก flow ก่อนเสร็จ

## Execute

### 1. Triage Session Findings

> Goal: เรียง session findings ตามความเสี่ยง

1. อ่าน findings จาก `/review-auth` report ล่าสุด — เลือกเฉพาะกลุ่ม session/cookie
2. อ้าง checklist ใน `references/auth-checklist.md` section Session & Token
3. เรียงตาม exploitability — session hijack, fixation, missing invalidation ก่อน

### 2. Fix Cookie And Transport Flags

> Goal: session cookie ปลอดภัยตาม baseline

1. ตั้ง `HttpOnly` + `Secure` + `SameSite=Strict` หรือ `Lax` ตาม flow (OAuth callback ต้อง `Lax`)
2. ตั้ง `domain`/`path` ให้แคบที่สุด — ห้าม cookie scope กว้างข้าม subdomain โดยไม่จำเป็น
3. ทำ `/check-security-headers` ตรวจจริง — HTTPS, HSTS, redirect HTTP→HTTPS

### 3. Fix Lifecycle And Expiry

> Goal: session ถูกสร้าง หมุน และทำลายอย่างถูกต้อง

1. Session ID ต้องสุ่มด้วย CSPRNG และ regenerate หลัง login/privilege change (fixation protection)
2. ตั้ง absolute expiry + idle timeout ที่เหมาะสม — remember-me ต้อง bounded
3. Logout ต้อง invalidate server-side — ลบ record ใน DB/Redis ไม่ใช่แค่ลบ cookie
4. Password/email/role change → invalidate sessions อื่นทั้งหมด
5. ตรวจ concurrent session policy — limit หรือ notify new device ตาม requirement

### 4. Fix Storage

> Goal: session state อยู่ในที่ที่ revoke ได้

1. เก็บ session server-side (DB/Redis) — client ถือ opaque ID เท่านั้น
2. ถ้าใช้ auth library → อัปเดตตาม best practices ของ lib (`/follow-lib-better-auth`)
3. ห้ามเก็บ session data ที่ sensitive ฝั่ง client (localStorage) ถ้าไม่จำเป็น

### 5. Verify And Report

> Goal: auth flows ทำงานครบหลังแก้

1. รัน `/run-test` — login, logout, expiry, concurrent sessions ต้องผ่าน
2. ทดสอบ attack cases: reused old session id → deny, cookie ข้าม domain → ไม่ leak
3. สรุป fixed findings และ residual risks ด้วย `/report`

## Rules

- Server-side checks เสมอ — client-side เป็น UX เท่านั้น
- ถ้า fix อาจ lock users out → เสนอแผนก่อนผ่าน `/ask-me`
- แก้เฉพาะ findings จริง — ไม่ rewrite session system ถ้าไม่มี findings
- ทุก fix ต้องระบุ finding ที่ resolve; ถ้า check ไม่ผ่าน → `/resolve-errors` สูงสุด 3 รอบ

## Expected Outcome

- Session cookies มี flags ครบ expiry/rotation/invalidation ถูกต้อง
- Fixation, hijack, และ stale-session findings ถูกแก้พร้อม test evidence
- รายงาน fixes และ residual risks

