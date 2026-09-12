# Security Checks

## Goal

ตรวจสอบความปลอดภัยของระบบ ครอบคลุม auth, secrets, injection, dependencies, permissions, file upload และ compliance

## Scope

ครอบคลุม auth flows, session/token management, RBAC, secrets storage, injection, dependency vulnerabilities, file upload, compliance — ไม่ครอบคลุม performance, infrastructure, quality, correctness

## Checks

### Auth Review

1. ตรวจสอบ auth flows: login, logout, MFA, OAuth, SSO, password reset, email verification
2. ตรวจสอบ session/token management: secure cookie, `HttpOnly`, `SameSite`, expiry, rotation, revocation
3. ตรวจสอบ password policy, brute force protection, account lockout
4. ตรวจสอบ JWT: signing algorithm, verification, issuer/audience, expiry, key rotation
5. ตรวจสอบ RBAC enforcement: roles, permissions, guards, route/API guards

### Secrets And Injection

1. ตรวจสอบ hardcoded secrets, API keys, credentials ใน source, logs และ config
2. ตรวจสอบ secret storage: env vars, vault, CI/CD secrets, masking
3. ตรวจสอบ SQL injection: parameterized queries, raw SQL, ORM usage
4. ตรวจสอบ command injection, path traversal, deserialization, prototype pollution
5. ตรวจสอบ XSS: `innerHTML`, `dangerouslySetInnerHTML`, DOMPurify, HTML escaping
6. ตรวจสอบ CSRF: token validation, `SameSite` cookies, origin checking

### Dependency And Permission

1. ตรวจสอบ dependency vulnerabilities ด้วย `npm audit`, `bun audit`, Snyk หรือ Dependabot
2. ตรวจสอบ outdated packages, EOL libraries, lockfile integrity และ supply chain risks
3. ตรวจสอบ RBAC: roles, permissions, guards, enforcement
4. ตรวจสอบ permission escalation: horizontal, vertical, debug tooling
5. ตรวจสอบ least privilege: service account, CI/CD permissions

### File Upload

1. ตรวจสอบ file type validation, MIME check, extension validation, magic number
2. ตรวจสอบ file size limit, filename sanitization, path traversal protection
3. ตรวจสอบ storage: S3, R2, GCS, local, signed URL, access control
4. ตรวจสอบ virus scan, CDN usage, upload progress handling
5. ถ้า project ไม่มี file upload → ข้าม step นี้

### Compliance

1. ระบุ regulations ที่บังคับใช้: GDPR, CCPA, HIPAA, PCI-DSS, SOC2
2. ตรวจสอบ PII, PHI, payment data, sensitive data handling
3. ตรวจสอบ data residency, cross-border transfer, consent, data retention
4. ตรวจสอบ compliance documentation, DPO contact, internal policies
5. ตรวจสอบว่า policies ถูก implement ใน code, config และ process

## Severity

- Critical: authentication bypass, hardcoded secrets, SQL/command/path traversal injection, XSS, missing permission check, dependency with known exploit
- High: missing MFA, weak password policy, PII/secrets in logs, missing input validation, missing CSRF, outdated dependency
- Medium: suboptimal CSP, missing rate limiting, suboptimal session timeout, missing secret rotation
- Low: documentation gap, minor config improvement, naming convention

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- อ้างอิง `/deep-review` ถ้า issue ซ้อนทับกับ security นอก scope
- ทุก finding ต้องมี file path และ line number
- ระบุ attack vector, data type, หรือ trust boundary ที่เกี่ยวข้อง
- ใช้ tools สำหรับ verification ไม่เดา
- ไม่เปลี่ยนแปลง environment หรือ production settings
