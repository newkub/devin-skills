---
name: review-security
description: Review และปรับปรุง security: auth, secrets, injection, dependencies, permissions, and compliance
---

## Goal

ตรวจสอบความปลอดภัยของระบบ ครอบคลุม auth, secrets, injection, dependencies, permissions, file upload และ compliance พร้อมคะแนน review

## Scope

- ครอบคลุม auth flows, session/token management, RBAC และ least privilege
- ครอบคลุม secrets storage, rotation, masking และ hardcoded secrets
- ครอบคลุม injection: SQL, command, path traversal, XSS, CSRF, deserialization
- ครอบคลุม dependency vulnerabilities, outdated packages, supply chain risks
- ครอบคลุม file upload validation, sanitization, storage และ access control
- ครอบคลุม GDPR/CCPA/HIPAA/PCI-DSS/SOC2 controls, PII, data retention
- ไม่ครอบคลุม `review-performance`, `review-infrastructure`, `review-quality` หรือ `review-correctness`

## Execute

### 1. Prepare and Scan

> Goal: เข้าใจ security structure และ tooling ใน codebase

1. ทำ `/scan-codebase` เพื่อหา security patterns, auth provider, validation library และ dependency manager
2. ระบุ auth provider, session/token management, RBAC setup และ security tools
3. ถ้า project เป็น web → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review
4. ถ้าไม่พบ security concerns → stop และ report

### 2. Auth Review

> Goal: ตรวจสอบ authentication และ authorization

1. ตรวจสอบ auth flows: login, logout, MFA, OAuth, SSO, password reset, email verification
2. ตรวจสอบ session/token management: secure cookie, `HttpOnly`, `SameSite`, expiry, rotation, revocation
3. ตรวจสอบ password policy, brute force protection, account lockout
4. ตรวจสอบ JWT: signing algorithm, verification, issuer/audience, expiry, key rotation
5. ตรวจสอบ RBAC enforcement: roles, permissions, guards, route/API guards

### 3. Secrets and Injection Review

> Goal: ระบุ secrets exposure และ injection vulnerabilities

1. ตรวจสอบ hardcoded secrets, API keys, credentials ใน source, logs และ config
2. ตรวจสอบ secret storage: env vars, vault, CI/CD secrets, masking
3. ตรวจสอบ SQL injection: parameterized queries, raw SQL, ORM usage
4. ตรวจสอบ command injection, path traversal, deserialization, prototype pollution
5. ตรวจสอบ XSS: `innerHTML`, `dangerouslySetInnerHTML`, DOMPurify, HTML escaping
6. ตรวจสอบ CSRF: token validation, `SameSite` cookies, origin checking

### 4. Dependency and Permission Review

> Goal: ตรวจสอบ dependencies และ permission model

1. ตรวจสอบ dependency vulnerabilities ด้วย `npm audit`, `bun audit`, Snyk หรือ Dependabot
2. ตรวจสอบ outdated packages, EOL libraries, lockfile integrity และ supply chain risks
3. ตรวจสอบ RBAC: roles, permissions, guards, enforcement
4. ตรวจสอบ permission escalation: horizontal, vertical, debug tooling
5. ตรวจสอบ least privilege: service account, CI/CD permissions

### 5. File Upload Review

> Goal: ตรวจสอบความปลอดภัยของ file upload

1. ตรวจสอบ file type validation, MIME check, extension validation, magic number
2. ตรวจสอบ file size limit, filename sanitization, path traversal protection
3. ตรวจสอบ storage: S3, R2, GCS, local, signed URL, access control
4. ตรวจสอบ virus scan, CDN usage, upload progress handling
5. ถ้า project ไม่มี file upload → ข้าม step นี้

### 6. Compliance Review

> Goal: ตรวจสอบ compliance controls

1. ระบุ regulations ที่บังคับใช้: GDPR, CCPA, HIPAA, PCI-DSS, SOC2
2. ตรวจสอบ PII, PHI, payment data, sensitive data handling
3. ตรวจสอบ data residency, cross-border transfer, consent, data retention
4. ตรวจสอบ compliance documentation, DPO contact, internal policies
5. ตรวจสอบว่า policies ถูก implement ใน code, config และ process

### 7. Validate and Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/deep-validate` และ `/validate` สำหรับ findings
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) weighted average
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

### 8. Improve

> Goal: ปรับปรุง security ตาม findings

1. ใช้ `/follow-best-practice` หรือ `/learn-from-web` หา security best practices
2. แก้ไขปัญหาตาม priority: Critical → High → Medium → Low
3. แก้ hardcoded secrets, injection vulnerabilities, missing auth checks, missing input validation
4. อัปเดต outdated dependencies, ลด supply chain risks
5. ถ้าแก้ >10 ไฟล์ → ทำ `/use-scripts`
6. ทำ `/validate` หรือ `/run-check` — ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

## Rules

### 1. Scope

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- อ้างอิง `/review-codebase` ถ้า issue ซ้อนทับกับ security นอก scope

### 2. Severity

- Critical: authentication bypass, hardcoded secrets, SQL/command/path traversal injection, XSS, missing permission check, dependency with known exploit
- High: missing MFA, weak password policy, PII/secrets in logs, missing input validation, missing CSRF, outdated dependency
- Medium: suboptimal CSP, missing rate limiting, suboptimal session timeout, missing secret rotation
- Low: documentation gap, minor config improvement, naming convention

### 3. Evidence

- ทุก finding ต้องมี file path และ line number
- ระบุ attack vector, data type, หรือ trust boundary ที่เกี่ยวข้อง
- ใช้ tools สำหรับ verification ไม่เดา

### 4. Review Independence

- ทำ review เท่านั้น ไม่ apply fixes
- ไม่เปลี่ยนแปลง environment หรือ production settings

### 5. Formatting

- ห้ามใช้ double-asterisk markers สำหรับเน้นข้อความ — ใช้ backticks สำหรับ `tools`, `commands`, paths และ skill references
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

### 6. Health Score

- คำนวณ review score เป็น percentage (0-100)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after

## Expected Outcome

- รายงาน security findings พร้อม evidence, severity, attack vector
- คะแนน review ต่อ dimension: auth, secrets, injection, dependencies, permissions, upload, compliance
- คะแนน overall security score
- ตารางสรุป findings ด้วย `/report-table`
- ปรับปรุง security โดยไม่มี regression
- ข้อเสนอแนะ action ถัดไป

*Merged from source review-* skills.*