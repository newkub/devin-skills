---
name: review-security
description: Review security ครอบคลุม auth, authorization, OWASP, secrets, injection, supply chain, encryption
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets-leak
  - analyze-attack-surface
  - review-compliance
  - review-observability
  - scan-codebase
  - improve-security
---

## Goal

Review security ครอบคลุมทุก dimension ของ application security พร้อม aggregate findings, severity, และ review score

## Scope

ครอบคลุม: authentication, authorization, OWASP Top 10, secrets management, injection prevention, CORS/CSP, API security, session/token management, encryption, file upload security, security scoring

ไม่รวม: compliance review (ใช้ `/review-compliance`) และ observability review (ใช้ `/review-observability`)

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ security setup และสร้าง baseline findings

ทำตาม `references/security-risk.md`

ก่อนเริ่มให้ `/scan-codebase` เพื่อระบุ auth framework, session strategy, API framework, encryption library, และ secret manager

### 2. Authentication

> Goal: ครอบคลุมทุก authentication dimension

ทำตาม `references/authentication.md`

### 3. Authorization

> Goal: ครอบคลุมทุก authorization dimension

ทำตาม `references/authorization.md`

### 4. OWASP

> Goal: ครอบคลุมทุก OWASP Top 10 category

ทำตาม `references/owasp-top-10.md`

### 5. Secrets

> Goal: ครอบคลุมทุก secrets management dimension

ทำตาม `references/secrets.md`

ถ้าต้องปรับปรุง secrets management → ใช้ `/follow-secret-manager` หรือ `/open-web-for-config-secret`

### 6. Injection

> Goal: ครอบคลุมทุก injection prevention dimension

ทำตาม `references/injection.md`

### 7. API Security

> Goal: ครอบคลุมทุก API security dimension

ทำตาม `references/api-security.md`

### 8. Encryption

> Goal: ครอบคลุมทุก encryption dimension

ทำตาม `references/encryption.md`

### 9. File Upload

> Goal: ครอบคลุมทุก file upload security dimension

ทำตาม `references/file-upload.md`

### 10. Validate Score And Report

> Goal: ตรวจสอบ findings, คำนวณ score, และรายงานผล

ทำตาม `references/scoring.md`

ทำ `/deep-validate` ก่อนรายงาน แล้ว `/report` พร้อม `/report-table`

## Rules

### 1. Scope Boundary

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-compliance` สำหรับ compliance
- ไม่ซ้ำกับ `/review-delivery` Section 15 สำหรับ security เชิงลึก

### 2. Skip Conditions

- ถ้า project ไม่มี authentication → ข้าม Section 2
- ถ้า project ไม่มี authorization → ข้าม Section 3
- ถ้า project ไม่มี API → ข้าม Section 7
- ถ้า project ไม่มี file upload → ข้าม Section 9
- ถ้า project ไม่มี encryption → ข้าม Section 8

### 3. Severity

- Critical: plaintext password, hardcoded production secret, SQL injection, XSS on user input, command injection, missing auth on sensitive endpoint, IDOR on critical resource, privilege escalation, plaintext storage, weak algorithm, unrestricted file upload, secret in public repo
- High: weak password policy, missing brute force protection, missing MFA, inconsistent permission checks, missing rate limiting, missing CSP, weak TLS, missing key rotation, missing virus scan, missing CORS validation
- Medium: inconsistent naming, suboptimal hashing cost, missing HSTS, suboptimal rate limit, missing security header, weak password policy
- Low: cosmetic, documentation gap, minor naming

### 4. Evidence

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `grep`, dependency audit)
- ระบุ endpoint, function, secret, algorithm, หรือ vulnerability type ที่เกี่ยวข้อง

### 5. Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-compliance`
- ไม่ซ้ำกับ `/review-delivery` Section 15

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100) ตาม `references/scoring.md`
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 7. Formatting

- ห้ามใช้ `**`
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

- ใช้ /check-secrets-leak ถ้าจำเป็น
- ใช้ /analyze-attack-surface ถ้าจำเป็น

- ใช้ /improve-security ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก security section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
