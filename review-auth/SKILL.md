---
name: review-auth
description: Review authentication and authorization — identity, sessions, tokens, OAuth, MFA, RBAC/ABAC
argument-hint: "[scope-or-subsystem]"
related:
  - deep-review-then-fix
  - review-security
  - follow-lib-better-auth
  - follow-lib-simplewebauthn
  - scan-codebase
  - report
  - ask-me
  - run-review
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

### 5. Account Lifecycle And Recovery

> Goal: account มี lifecycle ครบ — ทำตาม `references/account-lifecycle.md`

1. registration/verification — email verify, disposable-email policy, enumeration resistance
2. recovery — reset flows, magic links expiry, no user enumeration via reset responses
3. lockout/disable — admin disable, compromised account freeze, session invalidation
4. deletion — data purge path, GDPR erasure, dependent-resource handling
5. devices/sessions — session list, remote logout, concurrent-session policy

### 6. Oauth Sso And Federation

> Goal: federated identity ถูกต้อง — ทำตาม `references/oauth-sso.md`

1. OAuth/OIDC — state/nonce, PKCE, redirect URI allowlist, `iss`/`aud` validation
2. SAML/enterprise SSO — signature validation, assertion expiry, IdP metadata trust
3. social providers — scope minimality, email verification trust per provider
4. account linking — same-email linking policy, takeover prevention

### 7. Secrets And Audit

> Goal: ตรวจสอบ secrets และ observability

1. ตรวจ secrets ที่เกี่ยวข้อง: JWT secret, API keys, OAuth client secret, DB credentials
2. ตรวจว่า secrets ไม่อยู่ใน source code
3. ตรวจ audit logs สำหรับ auth events
4. ตรวจ error handling ไม่ leak sensitive info

### 8. Report And Next Action

> Goal: สรุป findings

1. จัดกลุ่ม findings ตาม category: authn, authz, session, token, secrets, audit
2. ให้ severity: Critical/High/Medium/Low พร้อม evidence
3. ทำ `/report` ด้วย columns: Category, Finding, Severity, Evidence, Mitigation
4. ทำ `/suggest-next-action`


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `sessions`, `tokens` — session/token lifecycle checks | `subskills/check-sessions/SKILL.md` |
| `oauth`, `sso`, `mfa` — OAuth/federation flows | `subskills/check-oauth/SKILL.md` |
| `authz`, `permissions`, `rbac` — authz matrix + IDOR | `subskills/check-authz/SKILL.md` |
| `report-authz`, `matrix` — role x resource matrix report | `subskills/report-authz/SKILL.md` |
| Apply auth hardening — sessions, tokens, OAuth (user confirm) | `subskills/improve-auth/SKILL.md` |

## Rules

- ไม่ exploit หรือ test บน production
- ทุก finding ต้องมี evidence จาก code, config, หรือ dependencies
- ถ้าพบ critical → แนะนำ `/review-security` ทันที
- ถ้าต้องปรับปรุง implementation → ใช้ `/follow-lib-better-auth` หรือ `/follow-lib-simplewebauthn`
- ถ้าขาด context → `/ask-me`

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. sessions: cookie flags `HttpOnly`+`Secure`+`SameSite` (`Lax` สำหรับ OAuth callback), domain/path แคบสุด — CSPRNG session ID + regenerate หลัง login/privilege change, absolute expiry + idle timeout, logout invalidate server-side (ลบ DB/Redis record), session เก็บ server-side ตัว client ถือ opaque ID
2. tokens: JWT algorithm allowlist (RS256/EdDSA, ห้าม `none`), validate `exp`/`iss`/`aud`/`sub` ทุก request — refresh rotation + reuse detection (revoke family), tokens ไม่อยู่ใน localStorage/URL/logs, hardcoded key → `/check-secrets` + `/follow-secret-manager`
3. OAuth/MFA: state/nonce, PKCE, redirect allowlist, MFA enforcement
4. authorization: server-side checks ทุก mutation, IDOR ownership checks, privilege audit
5. verify: real flows end-to-end + attack checks (expired/tampered token → deny, reused session id → deny) — fix ที่อาจ lock users out เสนอแผนผ่าน `/ask-me` ก่อน
- ใช้ /run-review ถ้าจำเป็น

## References

- [Auth checklist](references/auth-checklist.md)
- [Account lifecycle](references/account-lifecycle.md)
- [OAuth and SSO](references/oauth-sso.md)

## Expected Outcome

- รายงาน auth findings ครอบคลุม authn/authz/session/token/secrets/audit
- Severity ชัดเจนพร้อม evidence
- Mitigation actions
- Next actions ผ่าน `/suggest-next-action`
