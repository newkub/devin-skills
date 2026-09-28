---
name: review-security-check-authn
description: Check authentication posture — session strategy, password policy, brute force, MFA surface
argument-hint: "[scope]"
related:
  - review-auth
  - scan-codebase
  - report
---

## Goal

Run the authentication + authorization dimensions of `/review-security` as a focused pass — auth posture แบบ high-level เท่านั้น ไม่ deep-dive identity subsystem

## Scope

- ใช้เมื่อ `/review-security` dispatch มาที่ `authn`/`auth` หรือเรียก standalone บน auth surface
- ครอบคลุม: session strategy, password policy, brute force protection, MFA presence, authz matrix, IDOR surface
- ไม่รวม: identity flows, OAuth providers, token internals, RBAC/ABAC deep-dive → `/review-auth`

## Execute

### 1. Authentication Checks

> Goal: auth baseline ปลอดภัย

ทำตาม `../../references/authentication.md`

### 2. Authorization Checks

> Goal: access control ครบทุก protected action

ทำตาม `../../references/authorization.md`

1. authz matrix — role x resource table ครบทุก protected action
2. IDOR surface — object references ที่ขาด ownership check

### 3. Report

> Goal: findings พร้อม severity และ route

1. ทำ `/report` ตาราง: `No.`, `Check`, `Severity`, `Finding`, `Evidence`, `Fix`
2. findings ที่ต้อง deep-dive → route ไป `/review-auth`

## Rules

- Review เท่านั้น ไม่แก้ไข code — fix อยู่ใน `## Fix` ของ parent
- ทุก finding ต้องมี file path, line number — endpoint, middleware, หรือ policy location
- severity ตาม `../../SKILL.md` Rules §3 (missing auth on sensitive endpoint = Critical)

## Expected Outcome

- ตาราง auth findings พร้อม severity และ evidence
- clear boundary: อะไร fix ใน parent `## Fix` vs escalate ไป `/review-auth`
