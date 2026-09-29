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
  - use-subagents
---

## Goal

Review authentication (authn) and authorization (authz) ของ codebase ให้ครอบคลุม identity, sessions, tokens, OAuth, MFA, password policy, RBAC/ABAC, secrets, audit logging, และ account lifecycle — domain checklist อยู่ใน `subagents/auth-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ใช้เมื่อต้องประเมิน auth subsystem ทั้งหมดหรือเฉพาะส่วน เช่น `/review-auth packages/auth` หรือ `/review-auth apps/website/src/routes/auth`

| Dimension | Checklist |
|-----------|-----------|
| `authn` — identity, credentials, MFA, password policy | `subagents/auth-reviewer/auth-checklist.md` |
| `session-token` — sessions, JWT, cookies, refresh tokens | `subagents/auth-reviewer/auth-checklist.md` |
| `authz` — RBAC/ABAC, ownership, middleware, IDOR | `subagents/auth-reviewer/auth-checklist.md` |
| `account-lifecycle` — registration, recovery, lockout, deletion | `subagents/auth-reviewer/account-lifecycle.md` |
| `oauth-sso` — OIDC, SAML, social, account linking | `subagents/auth-reviewer/oauth-sso.md` |
| `secrets-audit` — secrets hygiene, audit logs | `subagents/auth-reviewer/auth-checklist.md` |

ไม่รวม: general security posture (ใช้ `/review-security`), compliance (ใช้ `/review-compliance`)

## Execute

### 1. Prepare And Baseline

> Goal: รวบรวม context และ baseline

1. รับ `scope-or-subsystem` จาก argument หรือ default เป็น repo ทั้งหมด
2. ทำ `/scan-codebase` หา auth libraries, providers, middleware, guards, hooks, session stores (ใช้เป็น findings-file ให้ subagent cross-check)
3. ระบุ tech stack ที่ใช้: Supabase Auth, Better Auth, jose, simplewebauthn, custom JWT, sessions, RBAC

### 2. Dispatch Auth-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — `authn`, `session-token`, `authz`, `account-lifecycle`, `oauth-sso`, `secrets-audit`; ไม่ระบุ → ทุก dimension ที่ apply
2. Spawn `subagents/auth-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย subsystem → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Validate

> Goal: findings รวมกันถูกต้อง ไม่มี false positives

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. จัดกลุ่ม findings ตาม category: authn, authz, session, token, secrets, audit
3. ให้ severity: Critical/High/Medium/Low พร้อม evidence — ระบุ false positives พร้อมเหตุผล

### 4. Report

> Goal: สรุป findings

1. ทำ `/report` ด้วย columns: Category, Finding, Severity, Evidence, Mitigation
2. ทำ `/suggest-next-action`

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
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/auth-reviewer/` เท่านั้น
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

- [Auth checklist](subagents/auth-reviewer/auth-checklist.md)
- [Account lifecycle](subagents/auth-reviewer/account-lifecycle.md)
- [OAuth and SSO](subagents/auth-reviewer/oauth-sso.md)

## Expected Outcome

- รายงาน auth findings ครอบคลุม authn/authz/session/token/secrets/audit
- Severity ชัดเจนพร้อม evidence
- Mitigation actions
- Next actions ผ่าน `/suggest-next-action`
