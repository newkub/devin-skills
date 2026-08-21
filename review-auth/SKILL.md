---
name: review-auth
description: Review auth ครอบคลุม RBAC auth flows session token MFA OAuth SSO password reset JWT Supabase permission enforcement พร้อม review score
---

## Goal

Review authentication และ authorization ครอบคลุมทุก dimension พร้อม aggregate findings และ review score

## Scope

auth review สำหรับ: RBAC (roles, permissions, guards, enforcement), auth flows (login, logout, MFA, OAuth, SSO, password reset, email verification), session management, token/JWT management, Supabase auth integration, permission system, account linking — ไม่ทับซ้อนกับ `/review-security` ซึ่งครอบคลุม browser security, data leak, compliance, secrets management, rate limiting, webhooks, zero trust

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ auth structure, provider, และ RBAC setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ auth structure และ RBAC setup
2. ระบุ auth provider (Supabase, Auth0, custom), JWT library (`jose`), validation library (`Zod`), และ session/token management ที่ใช้
3. ระบุ role definitions, permission lists, และ guard locations
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review

### 2. Deep Analyze Auth Core

วิเคราะห์ auth core อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก auth dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ auth patterns, RBAC enforcement, guard coverage, session config, token lifecycle
6. Review CLI คำนวณ auth review score จาก review report

### 3. RBAC Review

Review Role-Based Access Control implementation

> Goal: ครอบคลุม roles, permissions, guards, enforcement

1. ตรวจสอบ role definitions: role types (Customer, Provider, Staff, Partner, Admin), role hierarchy, role assignment logic
2. ตรวจสอบ permission definitions: permission lists, granular permissions, permission grouping, permission naming
3. ตรวจสอบ role-permission matrix: mapping consistency, missing permissions, redundant permissions, role-specific constraints
4. ตรวจสอบ route guards: client-side guards, server-side guards, guard coverage ทุก protected route, missing guards
5. ตรวจสอบ server-side enforcement: `requirePermission()` usage, API handler checks, middleware enforcement, bypass detection
6. ตรวจสอบ permission escalation: horizontal escalation (same role accessing other user data), vertical escalation (lower role accessing higher role features), role simulation/debug tooling
7. ตรวจสอบ RBAC test coverage: permission test cases, role-based test scenarios, guard unit tests, integration tests for protected routes
8. Critical: unprotected admin route, missing server-side permission check, role bypass, permission escalation, no RBAC enforcement on critical API
9. High: inconsistent role-permission mapping, missing route guard, missing UI permission guard, stale role cache, insufficient test coverage for RBAC

### 4. Auth Flows Review

Review authentication flows ครอบคลุม login, logout, MFA, OAuth, SSO, password reset, email verification

> Goal: ครอบคลุมทุก auth flow dimension

1. ตรวจสอบ login flow: credential validation, brute force protection, rate limiting on login, error messages (no information leakage), account lockout
2. ตรวจสอบ logout flow: session invalidation, token revocation, client-side cleanup, redirect after logout
3. ตรวจสอบ MFA: enrollment flow, verification flow, backup codes, recovery options, MFA bypass prevention, MFA enforcement for admin roles
4. ตรวจสอบ OAuth: provider config, state parameter validation, PKCE flow, redirect URI validation, token exchange security, provider unlinking
5. ตรวจสอบ SSO: SAML/OIDC config, attribute mapping, just-in-time provisioning, session bridging
6. ตรวจสอบ password reset: token generation, token expiry, single-use enforcement, notification, reset flow security
7. ตรวจสอบ email verification: verification token, expiry, resend logic, rate limiting, verification bypass prevention
8. ตรวจสอบ account linking: conflict resolution, duplicate account detection, provider linking/unlinking, account merge
9. ตรวจสอบ Supabase auth integration: client init, session handling, auth state listener, token refresh, service role key usage (server-only)
10. Critical: authentication bypass, missing brute force protection, password reset token reuse, OAuth state parameter missing, MFA bypass, verification bypass, service role key in client
11. High: missing MFA enforcement for admin, weak password policy, missing email verification, no account lockout, insecure OAuth redirect URI

### 5. Session And Token Review

Review session management และ token/JWT lifecycle

> Goal: ครอบคลุมทุก session และ token dimension

1. ตรวจสอบ session creation: secure session ID, session payload, session metadata, session storage
2. ตรวจสอบ session timeout: idle timeout, absolute timeout, sliding expiration, timeout configuration
3. ตรวจสอบ session refresh: refresh token strategy, token rotation, refresh window, refresh on activity
4. ตรวจสอบ session persistence: server-side storage, client-side storage, cookie config, offline access
5. ตรวจสอบ concurrent sessions: max sessions per user, session conflict, device management, session listing
6. ตรวจสอบ session revocation: logout, force logout, session invalidation, revocation propagation
7. ตรวจสอบ session security: HTTPS only, HttpOnly cookie, SameSite attribute, CSRF protection, session ID in URL prevention
8. ตรวจสอบ JWT issuance: signing algorithm (RS256/ES256 not HS256 for multi-service), claims, issuer, audience, token structure
9. ตรวจสอบ JWT verification: `jose.jwtVerify()` usage, algorithm pinning, issuer/audience validation, expiry validation, clock skew tolerance
10. ตรวจสอบ token lifecycle: access token TTL, refresh token TTL, refresh rotation, reuse detection, revocation list, blacklist
11. ตรวจสอบ token storage: cookie vs localStorage, HttpOnly cookie preference, token leak prevention, key rotation
12. Critical: no session timeout, session ID in URL, missing HttpOnly cookie, no token expiry, signing key exposed, HS256 in multi-service, no token revocation path, token in localStorage
13. High: no session revocation, missing concurrent session limit, insecure cookie config, no refresh rotation, missing key rotation, missing clock skew handling

### 6. Validate, Rate And Report

ตรวจสอบ findings ให้คะแนน severity และรายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-format-table` สร้างตาราง aggregate findings จากทุก section
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี RBAC → ข้าม Step 3
- ถ้า project ไม่มี auth flows → ข้าม Step 4
- ถ้า project ไม่มี session management → ข้าม Step 5 items 1-7
- ถ้า project ไม่มี JWT tokens → ข้าม Step 5 items 8-11
- ถ้า project ไม่มี MFA → ข้าม Step 4 item 3
- ถ้า project ไม่มี OAuth → ข้าม Step 4 item 4
- ถ้า project ไม่มี SSO → ข้าม Step 4 item 5
- ถ้า project ไม่มี password reset → ข้าม Step 4 item 6
- ถ้า project ไม่มี email verification → ข้าม Step 4 item 7
- ถ้า project ไม่มี account linking → ข้าม Step 4 item 8

### 2. Severity Classification

- Critical: authentication bypass, unprotected admin route, missing server-side permission check, role bypass, permission escalation, no RBAC enforcement on critical API, password reset token reuse, OAuth state parameter missing, MFA bypass, service role key in client, no session timeout, session ID in URL, no token expiry, signing key exposed, HS256 in multi-service
- High: inconsistent role-permission mapping, missing route guard, missing MFA enforcement for admin, weak password policy, missing email verification, no account lockout, no session revocation, missing concurrent session limit, insecure cookie config, no refresh rotation, missing key rotation, token in localStorage, insufficient RBAC test coverage
- Medium: suboptimal session timeout, suboptimal token TTL, missing refresh window, inconsistent guard pattern, missing account linking, weak password policy for non-admin
- Low: documentation gap, minor guard improvement, naming convention, minor session config improvement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ role, permission, หรือ auth flow ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าพบ security issue ที่นอก scope auth → อ้างอิง `/review-security`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-format-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก auth section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
