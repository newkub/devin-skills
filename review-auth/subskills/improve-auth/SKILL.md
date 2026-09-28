---
name: review-auth-improve-auth
description: Apply auth hardening findings — sessions, tokens, OAuth — verify ด้วย attack checks
argument-hint: "[scope-or-findings]"
related:
  - review-auth
  - check-secrets
  - follow-secret-manager
  - ask-me
  - run-test
  - report-before-after
---

## Goal

แก้ auth findings จาก `/review-auth` จริง — session hardening, token validation, OAuth safety — verify ด้วย real flows + attack checks

## Scope

- ใช้หลัง review เสร็จและ user confirm ให้แก้ — review/report-only โดย default
- ครอบคลุม: cookie/session hardening, JWT validation, refresh rotation, OAuth state/PKCE, MFA gaps
- fix ที่อาจ lock users out → เสนอแผนผ่าน `/ask-me` ก่อนเสมอ

## Execute

### 1. Baseline

> Goal: รู้ว่า auth flow ทำงานยังไงก่อนแก้

1. map login/logout/refresh flows จริง — endpoints, middleware order, storage
2. รัน existing auth tests — baseline ต้องเขียวก่อน
3. list findings ที่แก้: group ตาม session / token / oauth

### 2. Fix Sessions

> Goal: session lifecycle ปลอดภัย

1. cookie flags `HttpOnly`+`Secure`+`SameSite`, domain/path แคบสุด
2. CSPRNG session ID + regenerate หลัง login/privilege change
3. absolute expiry + idle timeout; logout invalidate server-side (ลบ record จริง)

### 3. Fix Tokens And OAuth

> Goal: token validation + external flows ปลอดภัย

1. JWT algorithm allowlist — ห้าม `none`, validate `exp`/`iss`/`aud`/`sub` ทุก request
2. refresh rotation + reuse detection (revoke token family)
3. tokens ออกจาก localStorage/URL/logs; hardcoded keys → `/check-secrets` + `/follow-secret-manager`
4. OAuth: `state`/`nonce` validated, PKCE, redirect allowlist — `SameSite=Lax` บน callback

### 4. Verify With Attack Checks

> Goal: fixes กัน attack ได้จริง ไม่ใช่แค่ code ดูดี

1. expired/tampered token → deny; reused session id → deny; revoked refresh → deny family
2. real flows end-to-end: login → access → refresh → logout
3. `/run-test` ผ่าน + `/report-before-after` — findings ก่อน/หลังต่อ item

## Rules

- preserve login behavior — fix ที่เปลี่ยน UX (force re-login, shorter expiry) ต้อง confirm
- ห้าม log tokens/session ids ระหว่าง debug
- แยก commit ต่อ fix group: sessions → tokens → oauth
- fix-verify loop สูงสุด 3 รอบต่อ finding → ไม่ผ่าน stop และ report

## Expected Outcome

- Attack checks ผ่าน: expired/reused/revoked ถูก deny
- Findings หายครบพร้อม before/after evidence
- ไม่มี user lockout ที่ไม่ได้ plan
