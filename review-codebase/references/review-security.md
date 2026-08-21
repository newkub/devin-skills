---
name: review-security
description: Security review ครอบคลุม browser data protection infrastructure compliance พร้อม review score
---

## Goal

Review security ครอบคลุมทุก dimension ของ security พร้อม aggregate findings และ review score

## Scope

security review สำหรับ: core security (hardcoded secrets, input validation, dependency vulnerabilities), browser security (CSP, CORS, XSS, CSRF, headers, cookies), data protection (data leak, privacy/GDPR, compliance, audit trail, secrets management), infrastructure security (rate limiting, webhooks, file upload, zero trust) — auth flows, RBAC, session, token อยู่ใน `/review-codebase`

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ security structure ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ security structure
2. ระบุ auth provider, security tools, validation library, และ session/token management ที่ใช้
3. ถ้าเป็น web project → เพิ่ม `/run-dev` เพื่อ verify dev server ก่อน review

### 2. Deep Analyze Core

วิเคราะห์ security core อย่างลึกซึ้ง

> Goal: ครอบคลุมทุก security dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
2. ทำ `/update-create-review-cli` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
3. รัน `bun --filter @booking/tools-review review:json` เพื่อดึง review report พร้อม metrics
4. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด
5. Analyzer ตรวจสอบ hardcoded secrets, input validation, sanitization, และ dependency vulnerabilities
6. Review CLI คำนวณ security review score จาก review report

### 3. Browser And Input Security Review

Review browser security, CSP, input sanitization และ file upload

> Goal: ครอบคลุม browser security, CSP, input sanitization, file upload

1. ตรวจสอบ CSP: directives (default-src, script-src, style-src, img-src, connect-src), source allowlists, unsafe-inline, unsafe-eval, nonce/hash usage, inline script handling, violation reporting, report-only mode
2. ตรวจสอบ CORS: origin validation, credentials configuration, wildcard origins
3. ตรวจสอบ XSS prevention: DOM manipulation, innerHTML, dangerouslySetInnerHTML, missing sanitization, HTML escaping, DOMPurify usage
4. ตรวจสอบ CSRF protection: token validation, SameSite cookies, origin checking
5. ตรวจสอบ security headers: X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy, HSTS, subresource integrity, mixed content, clickjacking prevention
6. ตรวจสอบ cookie security: HttpOnly, Secure, SameSite attributes, cookie expiration
7. ตรวจสอบ input sanitization: SQL injection (parameterized queries, raw SQL), command injection (shell execution, argument escaping), path traversal (file path construction), deserialization (JSON.parse safety, prototype pollution), missing Zod schemas, unvalidated API inputs
8. ตรวจสอบ file upload: file size validation, MIME type checking, file name sanitization, storage strategy, virus scan, upload error handling
9. Critical: XSS vulnerability, missing CSP, wildcard CORS with credentials, no CSRF protection, SQL injection, command injection, path traversal, no file type validation, secrets in client cookies, unsafe-inline in script-src
10. High: missing security headers, unsafe-inline CSP, missing SameSite cookies, innerHTML without sanitization, missing Zod schema on API input, unsafe deserialization, missing virus scan, no size limit

### 4. Data Protection Review

Review data leak prevention, privacy, compliance, audit trail และ secrets management

> Goal: ครอบคลุม data leak, privacy, compliance, audit, secrets

1. ตรวจสอบ data leak: API responses ที่ expose sensitive fields, log statements ที่ contain PII/secrets, error messages ที่ reveal internal state, server-side secrets ที่ leak ไป client bundle, database queries ที่ return sensitive columns
2. ตรวจสอบ privacy/GDPR: PII handling, data classification, consent management, consent withdrawal, data deletion rights, right-to-be-forgotten, data export, data retention policies
3. ตรวจสอบ compliance: GDPR (consent, right to access, erasure, portability, breach notification), CCPA (opt-out, data sale disclosure), HIPAA (PHI handling, encryption), PCI-DSS (cardholder data, payment flow isolation), SOC2 (access controls, incident response), data residency, compliance documentation
4. ตรวจสอบ audit trail: audit log coverage สำหรับ sensitive actions, user attribution (user_id, session_id, IP), timestamp integrity, immutability (append-only, tamper detection), audit log retention
5. ตรวจสอบ secrets management: hardcoded secrets, secret storage (env vars, vault integration), rotation policies, secret scanning (pre-commit hooks, CI scanning), access patterns (least privilege, access logging), CI/CD secrets (GitHub secrets, masking), secret lifecycle
6. Critical: secrets in client bundle, PII in API response without authorization, hardcoded credentials, unencrypted PII, no consent management, no data deletion path, PHI exposure without encryption, cardholder data stored, missing audit log for sensitive action, mutable audit log, hardcoded secret in source, secret committed to git
7. High: PII in logs, error messages revealing internal state, missing GDPR compliance, no retention policy, incomplete audit coverage, missing rotation policy, secret in plaintext config, no vault integration, cross-border transfer without safeguards
8. ทำ `/review-codebase` เพื่อ compliance audit เฉพาะทาง

### 5. Infrastructure Security Review

Review rate limiting, webhook security และ zero trust architecture

> Goal: ครอบคลุม rate limiting, webhooks, zero trust

1. ตรวจสอบ rate limiting: middleware config, threshold values, window configuration, bypass protection, whitelist safety, distributed rate limiting, race condition prevention, rate limit headers, error response format, client retry guidance
2. ตรวจสอบ webhook security: signature verification, timestamp validation, replay attack prevention, idempotency handling, event deduplication, retry logic, backoff strategy, dead letter queue, payload validation, webhook secret management
3. ตรวจสอบ zero trust: service-to-service auth (mTLS, service tokens), network segmentation (VPC, security groups, network policies), identity verification (service identity, SPIFFE/SPIRE), continuous access validation, trust boundary enforcement, token propagation across services
4. Critical: no rate limiting on critical endpoint, bypassable rate limit, missing signature verification, no idempotency, webhook secret exposed, unauthenticated internal service, no network segmentation
5. High: missing rate limit headers, incorrect threshold, missing retry logic, no payload validation, missing mTLS, no continuous validation, trust boundary bypass

### 6. Validate, Rate And Report

ตรวจสอบ findings ให้คะแนน severity และรายงานผล

> Goal: Issues ถูก validate ครบถ้วน จัดลำดับตาม severity และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/validate` สำหรับ validate issues จากทุก section
3. จัดลำดับการ validate ตาม severity: Critical → High → Medium → Low
4. ให้ severity: Critical, High, Medium, Low, Info — คำนวณ review score: (Critical=0, High=25, Medium=50, Low=75, Info=100) → weighted average
5. ทำ `/implement-all` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review — ถ้าพบ incomplete implementations → เพิ่มเป็น findings
6. ทำ `/report` พร้อม `/report-table` สร้างตาราง aggregate findings จากทุก section
7. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี web browser → ข้าม Step 3
- ถ้า project ไม่มี sensitive data หรือ PII → ข้าม Step 4 items 1-2
- ถ้า project ไม่มี audit logging → ข้าม Step 4 item 4
- ถ้า project ไม่มี rate limiting → ข้าม Step 5 item 1
- ถ้า project ไม่มี webhooks → ข้าม Step 5 item 2
- ถ้า project ไม่มี file upload → ข้าม Step 3 item 8
- ถ้า project ไม่มี regulatory requirements → ข้าม Step 4 item 3
- ถ้า project ไม่มี service-to-service communication → ข้าม Step 5 item 3

### 2. Severity Classification

- Critical: hardcoded secrets, SQL injection, command injection, path traversal, XSS vulnerability, missing CSP, secrets in client bundle, PII exposure without authorization, PHI exposure without encryption, cardholder data stored, no rate limiting on critical endpoint, missing signature verification, unauthenticated internal service
- High: missing input validation, missing security headers, missing Zod schema on API input, PII in logs, missing GDPR compliance, no retention policy, missing rotation policy, missing rate limit headers, missing mTLS, trust boundary bypass
- Medium: missing rate limiting, inconsistent log format, missing compliance field, suboptimal CSP directive
- Low: documentation gap, minor improvement, naming convention

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ attack vector, data type, หรือ trust boundary ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review

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
