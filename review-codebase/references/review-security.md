---
name: review-security
description: Review security ครอบคลุม auth, secrets, injection, dependencies, permissions พร้อม review score
---


## Goal

Review security ครอบคลุม auth, secrets, injection, dependencies, permissions พร้อม aggregate findings และ review score

## Scope

security review สำหรับ: auth (auth flows, session, token, MFA), secrets (hardcoded secrets, storage, rotation), injection (SQL, command, path traversal, XSS, CSRF, deserialization), dependencies (vulnerabilities, outdated, supply chain), permissions (RBAC, guards, enforcement, least privilege)

## Execute

### 1. Analyze

> Goal: เข้าใจ security structure และ tooling ใน codebase

1. ทำ `/scan-codebase` เพื่อหา security issues
2. ระบุ auth provider, security tools, validation library, dependency manager, และ session/token management ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review
4. ถ้าไม่พบ issues → stop และ report

### 2. Review

> Goal: ตรวจสอบ auth, secrets, injection, dependencies, permissions

#### 2.1 Auth

- ตรวจสอบ auth flows: login, logout, MFA, OAuth, SSO, password reset, email verification
- ตรวจสอบ session/token management: secure cookie, `HttpOnly`, `SameSite`, expiry, rotation, revocation
- ตรวจสอบ password policy, brute force protection, account lockout
- ตรวจสอบ JWT: signing algorithm, verification, issuer/audience, expiry, key rotation

#### 2.2 Secrets

- ตรวจสอบ hardcoded secrets, API keys, credentials ใน source
- ตรวจสอบ secret storage: env vars, vault, CI/CD secrets, masking
- ตรวจสอบ secret rotation policy, lifecycle, access logging
- ตรวจสอบ pre-commit hooks และ CI scanning สำหรับ secrets

#### 2.3 Injection

- ตรวจสอบ SQL injection: parameterized queries, raw SQL, ORM usage
- ตรวจสอบ command injection: shell execution, argument escaping
- ตรวจสอบ path traversal: file path construction, sanitization
- ตรวจสอบ deserialization, prototype pollution, unsafe `JSON.parse`
- ตรวจสอบ XSS: `innerHTML`, `dangerouslySetInnerHTML`, DOMPurify, HTML escaping
- ตรวจสอบ CSRF: token validation, `SameSite` cookies, origin checking

#### 2.4 Dependencies

- ตรวจสอบ dependency vulnerabilities: `npm audit`, `bun audit`, Snyk, Dependabot
- ตรวจสอบ outdated packages, EOL libraries, supply chain risks
- ตรวจสอบ lockfile integrity, package source, signed packages
- ตรวจสอบ dependency permission/license risks

#### 2.5 Permissions

- ตรวจสอบ RBAC: roles, permissions, guards, enforcement
- ตรวจสอบ route/API guards, server-side permission checks
- ตรวจสอบ permission escalation: horizontal, vertical, debug tooling
- ตรวจสอบ least privilege: service account permissions, CI/CD permissions

### 3. Validate And Report

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานผล

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี auth flows → ข้าม Auth
- ถ้า project ไม่มี secrets/secrets management → ข้าม Secrets
- ถ้า project ไม่มี database/external input → ข้าม Injection สำหรับ SQL/command/path traversal
- ถ้า project ไม่มี dependencies → ข้าม Dependencies
- ถ้า project ไม่มี RBAC/permissions → ข้าม Permissions
- ถ้า project ไม่มี web browser → ข้าม XSS/CSRF items

### 2. Severity Classification

- Critical: authentication bypass, hardcoded secrets, SQL injection, command injection, path traversal, XSS vulnerability, secrets in client bundle, missing permission check, dependency with known exploit
- High: missing MFA enforcement, weak password policy, PII/secrets in logs, missing input validation, missing CSRF protection, outdated dependency, inconsistent RBAC mapping
- Medium: suboptimal CSP, missing rate limiting, suboptimal session timeout, missing secret rotation
- Low: documentation gap, minor config improvement, naming convention

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ attack vector, data type, หรือ trust boundary ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก security section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
