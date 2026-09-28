---
name: review-auth-check-sessions
description: Check session management — cookie flags, ID generation, expiry, invalidation
argument-hint: "[scope]"
related:
  - review-auth
  - report
---

## Goal

Run the session/token dimension of `/review-auth` แบบ focused — session lifecycle ปลอดภัยตั้งแต่ issue ถึง revoke

## Scope

- ใช้เมื่อ `/review-auth` dispatch มาที่ `sessions`/`tokens` หรือเรียก standalone
- ครอบคลุม: cookie flags, session ID generation, expiry/idle timeout, logout invalidation, token storage/validation

## Execute

### 1. Session Checks

> Goal: session lifecycle ปลอดภัย

ทำตาม `../../references/auth-checklist.md` (session section)

1. cookie flags — `HttpOnly`+`Secure`+`SameSite`, domain/path แคบสุด
2. session ID — CSPRNG, regenerate หลัง login/privilege change
3. expiry — absolute expiry + idle timeout ตั้งไว้
4. logout — invalidate server-side (ลบ DB/Redis record) ไม่ใช่แค่ clear cookie

### 2. Token Checks

> Goal: token validation ครบและ storage ปลอดภัย

1. JWT — algorithm allowlist (ห้าม `none`), validate `exp`/`iss`/`aud`/`sub`
2. refresh — rotation + reuse detection
3. storage — tokens ไม่อยู่ใน localStorage/URL/logs

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Check`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix` หรือ `../improve-auth/SKILL.md`
- ทุก finding มี file path + line — middleware, config, หรือ token handler
- session ไม่ invalidate server-side / weak ID generation = High

## Expected Outcome

- Session/token findings พร้อม evidence และ severity
- Attack-surface notes (fixation, replay, reuse) ชัดเจน
