---
name: review-auth
description: Review authentication and authorization — identity, sessions, tokens, OAuth, MFA, RBAC/ABAC, password policy, secrets, audit, and account lifecycle
argument-hint: "[scope-or-subsystem]"
related:
  - review-security
  - review-by-security
  - improve-security
  - follow-lib-better-auth
  - follow-lib-simplewebauthn
  - follow-secret-manager
  - analyze-attack-surface
  - scan-codebase
  - report-table
  - ask-me
---

## Goal

Review authentication (authn) and authorization (authz) ของ codebase ให้ครอบคลุม identity, sessions, tokens, OAuth, MFA, password policy, RBAC/ABAC, secrets, audit logging, และ account lifecycle

## Scope

ใช้เมื่อต้องประเมิน auth subsystem ทั้งหมดหรือเฉพาะส่วน เช่น `/review-auth packages/auth` หรือ `/review-auth apps/website/src/routes/auth`

ไม่รวม: general security posture (ใช้ `/review-security`), compliance (ใช้ `/review-compliance`)

## Execute

### 1. Prepare And Scan

> Goal: รวบรวม context และ baseline

1. รับ `scope-or-subsystem` จาก argument หรือ default เป็น repo ทั้งหมด
2. ทำ `/scan-codebase` หา auth libraries, providers, middleware, guards, hooks, session stores
3. อ่าน `references/auth-checklist.md` ก่อนเริ่ม
4. ระบุ tech stack ที่ใช้: Supabase Auth, Better Auth, jose, simplewebauthn, custom JWT, sessions, RBAC

### 2. Authentication Review

> Goal: ตรวจสอบ identity และ credential flows

1. ตรวจ sign up / sign in / sign out / password reset flows
2. ตรวจ password policy, hashing algorithm, salting/pepper
3. ตรวจ MFA/2FA/TOTP/WebAuthn/passkey ถ้ามี
4. ตรวจ OAuth / OIDC providers, callback, state/nonce, PKCE
5. ตรวจ account verification email, link expiration, replay risk
6. ตรวจ brute-force / rate-limiting / account lockout

### 3. Session And Token Review

> Goal: ตรวจสอบ session และ token security

1. ตรวจ JWT signing algorithm, key rotation, issuer/audience, expiration
2. ตรวจ refresh token strategy, rotation, binding, revocation
3. ตรวจ cookie flags: HttpOnly, Secure, SameSite, domain/path
4. ตรวจ session storage: server-side, client-side, DB, Redis
5. ตรวจ token transport: header, cookie, URL ห้าม token ใน URL

### 4. Authorization Review

> Goal: ตรวจสอบ access control

1. ตรวจ RBAC/ABAC/permission model, roles, scopes
2. ตรวจ resource-level authorization (ownership, tenant, org)
3. ตรวจ middleware/guards บน routes/API
4. ตรวจ privilege escalation, admin bypass, insecure direct object reference
5. ตรวจ CORS, CSRF, CSP ที่เกี่ยวข้องกับ auth flow

### 5. Secrets And Audit

> Goal: ตรวจสอบ secrets และ observability

1. ตรวจ secrets ที่เกี่ยวข้อง: JWT secret, API keys, OAuth client secret, DB credentials
2. ตรวจว่า secrets ไม่อยู่ใน source code
3. ตรวจ audit logs สำหรับ auth events
4. ตรวจ error handling ไม่ leak sensitive info

### 6. Report And Next Action

> Goal: สรุป findings

1. จัดกลุ่ม findings ตาม category: authn, authz, session, token, secrets, audit
2. ให้ severity: Critical/High/Medium/Low พร้อม evidence
3. ทำ `/report-table` ด้วย columns: Category, Finding, Severity, Evidence, Mitigation
4. ทำ `/suggest-next-action`

## Rules

- ไม่ exploit หรือ test บน production
- ทุก finding ต้องมี evidence จาก code, config, หรือ dependencies
- ถ้าพบ critical → แนะนำ `/improve-security` ทันที
- ถ้าต้องปรับปรุง implementation → ใช้ `/follow-lib-better-auth` หรือ `/follow-lib-simplewebauthn`
- ถ้าขาด context → `/ask-me`

## Expected Outcome

- รายงาน auth findings ครอบคลุม authn/authz/session/token/secrets/audit
- Severity ชัดเจนพร้อม evidence
- Mitigation actions
- Next actions ผ่าน `/suggest-next-action`
