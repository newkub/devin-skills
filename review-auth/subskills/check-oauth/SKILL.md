---
name: review-auth-check-oauth
description: Check OAuth/SSO/federation — state/nonce, PKCE, redirect allowlist, MFA
argument-hint: "[scope]"
related:
  - review-auth
  - report
---

## Goal

Run the OAuth/SSO/federation dimension of `/review-auth` แบบ focused — external identity flows ปลอดภัย

## Scope

- ใช้เมื่อ `/review-auth` dispatch มาที่ `oauth`/`sso`/`mfa` หรือเรียก standalone
- ครอบคลุม: OAuth flows, PKCE, redirect URIs, SAML/SSO config, MFA enforcement, account linking

## Execute

### 1. OAuth Flow Checks

> Goal: OAuth implementation ปลอดภัย

ทำตาม `../../references/oauth-sso.md`

1. `state`/`nonce` — present + validated (CSRF/replay protection)
2. PKCE — required สำหรับ public clients
3. redirect URIs — exact-match allowlist, ห้าม wildcard/open redirect
4. token exchange — server-side, client secret ไม่อยู่ฝั่ง browser

### 2. MFA And Linking Checks

> Goal: account controls ครบ

1. MFA enforcement — available + required ตาม policy, backup codes hashed
2. account linking — verify email/identity ก่อน link ไม่ auto-merge
3. session หลัง OAuth — `SameSite=Lax` บน callback, regenerate session ID

### 3. Report

> Goal: findings พร้อม severity

ทำ `/report` ตาราง: `No.`, `Check`, `Severity`, `Finding`, `Evidence`, `Fix`

## Rules

- Review เท่านั้น — fix ใน parent `## Fix`
- ทุก finding มี evidence: config, callback handler, หรือ flow trace
- missing state/PKCE หรือ open redirect = High-Critical

## Expected Outcome

- OAuth/SSO/MFA findings พร้อม evidence
- Clear boundary: config issues vs flow-implementation issues
