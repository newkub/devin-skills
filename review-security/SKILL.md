---
name: review-security
description: Review security including auth, file upload, and compliance
allowed-tools:
  - ask_user_question
  - edit
  - exec
  - glob
  - grep
  - read
triggers:
  - model
  - user
related:
  - review-codebase
  - review-correctness
  - review-docs
  - review-frontend
  - review-infrastructure
  - review-performance
  - review-quality
  - review-reliability
  - suggest-next-action
  - validate
---

## Goal

Review security ครอบคลุม auth, secrets, injection, dependencies, permissions พร้อม aggregate findings และ review score Review authentication และ authorization ครอบคลุมทุก dimension พร้อม aggregate findings และ review score Review file upload ครอบคลุม validation, sanitization, storage, access cont...

## Scope

security review สำหรับ: auth (auth flows, session, token, MFA), secrets (hardcoded secrets, storage, rotation), injection (SQL, command, path traversal, XSS, CSRF, deserialization), dependencies (vulnerabilities, outdated, supply chain), permissions (RBAC, guards, enforcement, least privilege) auth review สำหรับ: RBAC (roles, permissions, guards, enforcement), auth flows (login, logout, MFA, OA...

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
### Auth Deep Checks

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ auth structure, provider, และ RBAC setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ auth structure และ RBAC setup
2. ระบุ auth provider (Supabase, Auth0, custom), JWT library (`jose`), validation library (`Zod`), และ session/token management ที่ใช้
3. ระบุ role definitions, permission lists, และ guard locations
4. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review


วิเคราะห์ auth core อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก auth dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง

### File Upload Deep Checks

> Goal: เข้าใจ file upload patterns และ storage setup

1. ทำ `/scan-codebase` เพื่อเข้าใจ file upload structure
2. ระบุ storage provider (S3, R2, local, GCS), upload patterns, validation strategy, access control approach ที่ใช้
3. ถ้า project ไม่มี file upload → stop และ report


> Goal: ครอบคลุมทุก file upload dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์ file upload patterns
2. ทำ `/update-create-review-cli` — `/update-create-review-cli` เรียก `/update-rules` ภายในตัวเองเพื่ออัปเดต ast-grep rules
3. ถ้า `/update-create-review-cli` ข้าม `/update-rules` → ทำ `/update-rules` แยก
4. รัน `bunx ast-grep scan --inspect summary` เพื่อ verify rules ทำงานได้



### Compliance Deep Checks

> Goal: วิเคราะห์สถานะปัจจุบันของ compliance

1. ทำ `/scan-codebase` เพื่อหา issues ที่เกียวข้องกับ PII, consent, data retention, และ policies
2. ทำ `/review-codebase` เพื่อรายละเอียดเพิ่ม
3. ระบุ regulations ที่บังคับใช้: GDPR, CCPA, HIPAA, PCI-DSS, SOC2
4. ระบุ data types: PII, PHI, payment data, sensitive data


> Goal: ตรวจสอบ compliance ตาม regulations, policies, audit, data handling — convert action to review


1. ตรวจสอบ GDPR/CCPA/HIPAA/PCI-DSS/SOC2 controls
2. ตรวจสอบ data residency, cross-border transfer
3. ตรวจสอบ compliance documentation, DPO contact, และ internal policies
4. ตรวจสอบว่า policies (retention, access, classification) ถูก implement ใน code, config, และ process


## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี auth flows → ข้าม Auth
- ถ้า project ไม่มี secrets/secrets management → ข้าม Secrets
- ถ้า project ไม่มี database/external input → ข้าม Injection สำหรับ SQL/command/path traversal
- ถ้า project ไม่มี dependencies → ข้าม Dependencies
- ถ้า project ไม่มี RBAC/permissions → ข้าม Permissions

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

### 1. Skip Conditions

- ถ้า project ไม่มี RBAC → ข้าม Step 3
- ถ้า project ไม่มี auth flows → ข้าม Step 4
- ถ้า project ไม่มี session management → ข้าม Step 5 items 1-7
- ถ้า project ไม่มี JWT tokens → ข้าม Step 5 items 8-11
- ถ้า project ไม่มี MFA → ข้าม Step 4 item 3

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
- ถ้าพบ security issue ที่นอก scope auth → อ้างอิง `/review-codebase`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 1. Skip Conditions

- ถ้า project ไม่มี file upload → ข้ามทั้งหมด
- ถ้า project ไม่มี CDN → ข้าม Step 4 item 3
- ถ้า project ไม่มี virus scan → ข้าม Step 4 item 4

### 2. Severity Classification

- Critical: no file type validation, path traversal vulnerability, no size limit ที่ก่อให้เกิด DoS, missing magic number verification, no sanitization ที่ก่อให้เกิด XSS, insecure storage ที่ก่อให้เกิด data leak, no access control on private files, missing virus scan on user uploads
- High: missing MIME type check, missing extension validation, missing file name sanitization, weak size limit, missing CDN, missing signed URL, missing upload progress, weak access control
- Medium: suboptimal storage path, missing upload retry, minor access control gap, missing upload preview, suboptimal CDN config
- Low: cosmetic, minor upload UX, documentation gap

### 3. Evidence-Based Findings


*Some details from merged source skills were condensed to keep the skill under 250 lines.*
