---
name: review-security
description: Review security ครอบคลุม auth, authorization, OWASP, secrets, injection, supply chain, encryption
related:
  - check-secrets-leak
  - analyze-security-risk
  - analyze-attack-surface
---

## Goal

Review security ครอบคลุมทุก dimension ของ application security พร้อม aggregate findings และ review score

## Scope

security review สำหรับ: authentication, authorization, OWASP Top 10, secrets management, injection prevention, CORS/CSP, supply chain, API security, session/token management, encryption, file upload security

ไม่รวม compliance review (ใช้ `/review-compliance`) และ observability review (ใช้ `/review-observability`)

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ security setup ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ security setup, auth flows, session management
2. ระบุ auth framework (Better Auth, NextAuth, Clerk, Auth0, Supabase Auth, WorkOS), session strategy, token storage, RBAC library
3. ระบุ API framework, CORS config, CSP headers, rate limiting library
4. ระบุ encryption library, secret management (`Infisical`, Doppler, AWS Secrets Manager)
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
6. ทำ `/update-review-codebase-cli-and-run` เพื่อให้ analyzers ครอบคลุม categories ล่าสุด
7. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
8. ทำ `/run-review` เพื่อรัน review CLI และดึง metrics ล่าสุด

### 2. Authentication Review

Review authentication flows ครอบคลุม login, registration, password reset, MFA, session — ดู `references/authentication.md`

> Goal: ครอบคลุมทุก authentication dimension

1. ตรวจสอบ login flow: credential validation, password hashing (bcrypt, argon2, scrypt), brute force protection, account lockout
2. ตรวจสอบ registration: email verification, password strength policy, duplicate account prevention
3. ตรวจสอบ password reset: token generation, token expiry, single-use token, reset link security
4. ตรวจสอบ MFA: TOTP, SMS, hardware key, backup codes, MFA bypass prevention
5. ตรวจสอบ session management: session storage, session expiry, session fixation, concurrent session limit
6. ตรวจสอบ OAuth/OIDC: provider config, state parameter, PKCE, redirect URI validation, token exchange
7. Critical: plaintext password storage, weak hashing, missing email verification, MFA bypass, session fixation, OAuth state missing
8. High: weak password policy, missing brute force protection, no account lockout, short session expiry, missing PKCE

### 3. Authorization Review

Review authorization ครอบคลุม RBAC, ABAC, permission checks, IDOR, privilege escalation — ดู `references/authorization.md`

> Goal: ครอบคลุมทุก authorization dimension

1. ตรวจสอบ RBAC: role definition, role hierarchy, permission mapping, default role
2. ตรวจสอบ ABAC: attribute-based rules, policy enforcement, dynamic permission
3. ตรวจสอบ permission checks: route guards, API middleware, resource ownership, tenant scoping
4. ตรวจสอบ IDOR: direct object reference, missing ownership check, predictable IDs
5. ตรวจสอบ privilege escalation: horizontal, vertical, parameter tampering, mass assignment
6. ตรวจสอบ multi-tenancy authorization: tenant isolation, cross-tenant access prevention
7. Critical: missing auth check on sensitive endpoint, IDOR on critical resource, privilege escalation path, tenant data leak
8. High: inconsistent permission checks, missing ownership validation, weak default role, missing tenant scope

### 4. OWASP Top 10 Review

Review OWASP Top 10 vulnerabilities — ดู `references/owasp-top-10.md`

> Goal: ครอบคลุมทุก OWASP Top 10 dimension

1. ตรวจสอบ A01 Broken Access Control: missing access control, insecure direct object references
2. ตรวจสอบ A02 Cryptographic Failures: weak encryption, plaintext transmission, weak hashing
3. ตรวจสอบ A03 Injection: SQL, NoSQL, command, LDAP, XPath, template injection
4. ตรวจสอบ A04 Insecure Design: missing threat modeling, insecure defaults, missing rate limiting
5. ตรวจสอบ A05 Security Misconfiguration: default credentials, verbose errors, missing security headers
6. ตรวจสอบ A06 Vulnerable Components: outdated dependencies, known vulnerabilities, unused dependencies
7. ตรวจสอบ A07 Authentication Failures: weak credential recovery, credential stuffing, MFA gaps
8. ตรวจสอบ A08 Software Integrity Failures: unsigned updates, missing CI security, dependency confusion
9. ตรวจสอบ A09 Logging Failures: missing audit logs, log injection, sensitive data in logs
10. ตรวจสอบ A10 SSRF: unvalidated URL, internal network access, metadata endpoint access
11. Critical: any A01-A10 critical vulnerability on critical path
12. High: any A01-A10 vulnerability on non-critical path, missing security headers

### 5. Secrets Management Review

Review secrets management ครอบคลุม storage, rotation, masking, leak prevention — ดู `references/secrets.md`

> Goal: ครอบคลุมทุก secrets dimension

1. ตรวจสอบ hardcoded secrets: API keys, tokens, passwords, certificates in source code
2. ตรวจสอบ secret storage: env vars, secret manager, vault, encrypted at rest
3. ตรวจสอบ secret rotation: rotation policy, key versioning, old key revocation
4. ตรวจสอบ secret masking: logs, error messages, API responses, debug output
5. ตรวจสอบ secret transmission: TLS, mTLS, no plaintext over network
6. ตรวจสอบ `.gitignore`, `.env.example`, pre-commit hooks for secret scanning
7. Critical: hardcoded production secret, secret in public repo, secret in logs, no encryption at rest
8. High: missing rotation policy, secret in error message, missing pre-commit secret scan, weak TLS config

### 6. Injection Prevention Review

Review injection prevention ครอบคลุม SQL, NoSQL, command, XSS, CSRF, path traversal — ดู `references/injection.md`

> Goal: ครอบคลุมทุก injection dimension

1. ตรวจสอบ SQL injection: parameterized queries, ORM usage, raw query prevention, dynamic SQL
2. ตรวจสอบ NoSQL injection: query sanitization, operator injection, MongoDB `$where`
3. ตรวจสอบ command injection: `exec`, `spawn`, shell arguments, input sanitization
4. ตรวจสอบ XSS: output encoding, CSP, `innerHTML`, `dangerouslySetInnerHTML`, `v-html`
5. ตรวจสอบ CSRF: token validation, SameSite cookies, Origin header check
6. ตรวจสอบ path traversal: input validation, path joining, `..` prevention, symlink
7. ตรวจสอบ SSRF: URL validation, allowlist, internal network block, metadata endpoint block
8. ตรวจสอบ deserialization: unsafe `JSON.parse`, `eval`, template injection, prototype pollution
9. Critical: SQL injection on critical path, XSS on user input, command injection, path traversal on file access, SSRF on user URL
10. High: missing parameterized query, missing output encoding, missing CSRF token, unsafe deserialization

### 7. API Security Review

Review API security ครอบคลุม rate limiting, input validation, output sanitization, error handling — ดู `references/api-security.md`

> Goal: ครอบคลุมทุก API security dimension

1. ตรวจสอบ rate limiting: per-IP, per-user, per-endpoint, sliding window, exponential backoff
2. ตรวจสอบ input validation: schema validation, type checking, size limits, field allowlist
3. ตรวจสอบ output sanitization: sensitive field filtering, response shape consistency
4. ตรวจสอบ error handling: no stack trace leak, generic error message, error code mapping
5. ตรวจสอบ API authentication: token validation, API key management, JWT verification
6. ตรวจสอบ API versioning: deprecated version, breaking change, sunset header
7. ตรวจสอบ CORS: origin allowlist, credential policy, preflight handling
8. ตรวจสอบ CSP: default-src, script-src, style-src, img-src, connect-src, frame-ancestors
9. Critical: missing rate limiting on auth endpoint, no input validation, stack trace in response, wildcard CORS with credentials
10. High: missing CSP, inconsistent rate limiting, missing API versioning, weak CORS policy

### 8. Encryption Review

Review encryption ครอบคลุม at rest, in transit, key management, algorithm choice — ดู `references/encryption.md`

> Goal: ครอบคลุมทุก encryption dimension

1. ตรวจสอบ encryption at rest: database, file storage, backup, log encryption
2. ตรวจสอบ encryption in transit: TLS version, cipher suite, certificate validity, HSTS
3. ตรวจสอบ key management: key generation, key storage, key rotation, key derivation
4. ตรวจสอบ algorithm choice: AES-256-GCM, ChaCha20-Poly1305, RSA-2048+, ECDSA, avoid deprecated algorithms
5. ตรวจสอบ password hashing: bcrypt (cost 12+), argon2id, scrypt, avoid MD5/SHA1
6. ตรวจสอบ random number generation: `crypto.getRandomValues`, `crypto.randomBytes`, avoid `Math.random`
7. Critical: plaintext storage, weak algorithm (DES, RC4, MD5), hardcoded encryption key, `Math.random` for security
8. High: missing HSTS, weak TLS config, missing key rotation, weak password hashing cost

### 9. File Upload Security Review

Review file upload security ครอบคลุม validation, sanitization, storage, access control — ดู `references/file-upload.md`

> Goal: ครอบคลุมทุก file upload dimension

1. ตรวจสอบ file type validation: MIME type, magic number, extension allowlist
2. ตรวจสอบ file size limit: max size, multipart limit, streaming upload
3. ตรวจสอบ filename sanitization: path traversal, null byte, double extension
4. ตรวจสอบ storage: isolated directory, no execute permission, CDN serving
5. ตรวจสอบ access control: authenticated upload, ownership check, download authorization
6. ตรวจสอบ virus scanning: malware scan, sandbox execution
7. Critical: unrestricted file upload, executable upload, path traversal in filename, no size limit
8. High: missing MIME validation, missing virus scan, weak access control, missing ownership check

### 10. Validate, Score And Report

ตรวจสอบ findings และรายงานผล

> Goal: findings ถูก validate และรายงานเป็นตาราง

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ: cross-reference, type safety, runtime, security, compliance
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตาม `references/scoring.md`
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี authentication → ข้าม Section 2
- ถ้า project ไม่มี authorization → ข้าม Section 3
- ถ้า project ไม่มี API → ข้าม Section 7
- ถ้า project ไม่มี file upload → ข้าม Section 9
- ถ้า project ไม่มี encryption → ข้าม Section 8

### 2. Severity Classification

- Critical: plaintext password, hardcoded production secret, SQL injection, XSS on user input, command injection, missing auth on sensitive endpoint, IDOR on critical resource, privilege escalation, plaintext storage, weak algorithm, unrestricted file upload, secret in public repo
- High: weak password policy, missing brute force protection, missing MFA, inconsistent permission checks, missing rate limiting, missing CSP, weak TLS, missing key rotation, missing virus scan, missing CORS validation
- Medium: inconsistent naming, suboptimal hashing cost, missing HSTS, suboptimal rate limit, missing security header, weak password policy
- Low: cosmetic, documentation gap, minor naming

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `grep`, dependency audit)
- ระบุ endpoint, function, secret, algorithm, หรือ vulnerability type ที่เกี่ยวข้อง

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- ไม่ซ้ำกับ `/review-compliance` — ใช้ workflow นั้นสำหรับ compliance
- ไม่ซ้ำกับ `/review-delivery` Section 15 — ใช้ workflow นี้สำหรับ security เชิงลึก

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) — ดูสูตรใน `references/scoring.md`
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
