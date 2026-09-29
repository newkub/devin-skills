---
name: review-security
description: Review security ครอบคลุม auth, authorization, OWASP, secrets, injection, supply chain, encryption
argument-hint: "[scope]"
related:
  - follow-secret-manager
  - open-web-for-config-secret
  - check-secrets
  - analyze-attack-surface
  - review-compliance
  - review-observability
  - scan-codebase
  - report
  - suggest-next-action
  - run-audit
  - run-review
  - search
---
## Goal

Review security ครอบคลุมทุก dimension ของ application security พร้อม aggregate findings, severity, และ review score

## Scope

ครอบคลุม: auth posture (high-level เท่านั้น), OWASP Top 10, secrets management, injection prevention, CORS/CSP, API security, encryption, file upload security, security scoring

ไม่รวม: auth subsystem deep-dive — identity flows, sessions, tokens, OAuth, MFA, RBAC/ABAC (ใช้ `/review-auth`), compliance review (ใช้ `/review-compliance`) และ observability review (ใช้ `/review-observability`)

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

### 7. API Security And File Upload

> Goal: ครอบคลุมทุก API security + file upload dimension

ทำตาม `references/api-security.md` และ `references/file-upload.md`

### 8. Encryption

> Goal: ครอบคลุมทุก encryption dimension

ทำตาม `references/encryption.md`

### 9. Supply Chain And Hardening

> Goal: deps และ deployed surface ปลอดภัย — ทำตาม `references/supply-chain.md`

1. authz matrix — role x resource table ครบทุก protected action
2. SBOM + lockfile integrity, secret rotation age
3. verify security headers บน deployed response จริง (curl) ไม่ใช่แค่ config
4. dependency audit — `/run-audit` สำหรับ known CVEs, typosquatting, abandoned packages
5. logging safety — ไม่ log secrets/PII/tokens, audit trail สำหรับ security events

### 10. Validate Score And Report

> Goal: ตรวจสอบ findings, คำนวณ score, และรายงานผล

ทำตาม `references/scoring.md`

ทำ `/deep-validate` ก่อนรายงาน แล้วทำ `/report`

### Subskills

> Goal: dispatch งานเฉพาะมิติไปยัง subskill — check subskills ทำ focused review pass, report subskill format findings; fix ทำใน `## Fix`

| Topic | Subskill |
|-------|----------|
| `authn`, `auth` — auth posture + authz matrix (high-level, deep-dive → `/review-auth`) | `subskills/check-authn/SKILL.md` |
| `headers`, `csp`, `cors` — security headers verify บน deployed response | `subskills/check-headers/SKILL.md` |
| `injection`, `sqli`, `xss` — injection surfaces source→sink | `subskills/check-injection/SKILL.md` |
| `report`, `vulns` — vuln matrix + exploit paths + fix mapping | `subskills/report-vulns/SKILL.md` |

## Check: CORS Policy
ทำตาม [references/check-cors-policy.md](references/check-cors-policy.md)

## Check: Security Headers
ทำตาม [references/check-security-headers.md](references/check-security-headers.md)

## Check: Supply Chain
ทำตาม [references/check-supply-chain.md](references/check-supply-chain.md)

## Check: Unicode Homoglyph
ทำตาม [references/check-unicode-homoglyph.md](references/check-unicode-homoglyph.md)

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `cors-policy` | `## Check: CORS Policy` |
| `security-headers` | `## Check: Security Headers` |
| `supply-chain` | `## Check: Supply Chain` |
| `unicode-homoglyph` | `## Check: Unicode Homoglyph` |

## Rules

### 1. Scope Boundary

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (security)
- ไม่ซ้ำกับ `/review-compliance` สำหรับ compliance
- ไม่ซ้ำกับ `/review-delivery` Section 15 สำหรับ security เชิงลึก

### 2. Skip Conditions

- ถ้า project ไม่มี authentication → ข้าม Section 2
- ถ้า project ไม่มี authorization → ข้าม Section 3
- ถ้า project ไม่มี API → ข้าม api-security checks ใน Section 7
- ถ้า project ไม่มี file upload → ข้าม file-upload checks ใน Section 7
- ถ้า project ไม่มี encryption → ข้าม Section 8

### 3. Severity

- Critical: plaintext password, hardcoded production secret, SQL injection, XSS on user input, command injection, missing auth on sensitive endpoint, IDOR on critical resource, privilege escalation, plaintext storage, weak algorithm, unrestricted file upload, secret in public repo
- High: weak password policy, missing brute force protection, missing MFA, inconsistent permission checks, missing rate limiting, missing CSP, weak TLS, missing key rotation, missing virus scan, missing CORS validation
- Medium: inconsistent naming, suboptimal hashing cost, missing HSTS, suboptimal rate limit, missing security header, weak password policy
- Low: cosmetic, documentation gap, minor naming

### 4. Evidence

- ทุก finding ต้องมี file path และ line number (security)
- ไม่เดา ใช้ tools สำหรับ verification (`ast-grep`, `grep`, dependency audit)
- ระบุ endpoint, function, secret, algorithm, หรือ vulnerability type ที่เกี่ยวข้อง

### 5. Independence

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (security)
- ไม่ซ้ำกับ `/review-compliance`
- ไม่ซ้ำกับ `/review-delivery` Section 15

### 6. Health Score

- ตาม `../shared/review-rules.md` — Health Score (score ตาม `references/scoring.md`)

### 7. Formatting

- ห้ามใช้ `**`
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`

- ใช้ /check-secrets secrets-leak ถ้าจำเป็น
- ใช้ /analyze-attack-surface ถ้าจำเป็น
## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. secrets: rotate/revoke ที่ provider ก่อนเสมอ → ย้าย env/secret manager (`/follow-secret-manager`), ห้าม leak เข้า client bundle, เพิ่ม `.env.example` placeholders — git history ยังอ่านย้อนได้ report ไว้ (rewrite ด้วย `git filter-repo`/BFG เฉพาะเมื่อ user confirm) → verify `/check-secrets secrets-leak` ซ้ำ
2. headers: set ที่ layer เดียว (platform/CDN config ก่อน ไม่งั้น framework middleware) — CSP เริ่ม `Report-Only` ก่อน enforce, ห้าม `unsafe-inline`/`unsafe-eval`, `X-Frame-Options` สอดคล้อง `frame-ancestors` — verify ด้วย curl บน response จริง + `## Check: Security Headers` ซ้ำ
3. deps: `/run-audit` — patch Critical/High ก่อน, semver-safe upgrade ก่อนเสมอ, major → อ่าน changelog/migration guide, transitive → `overrides`/`resolutions` พร้อม comment อ้าง advisory, package เสี่ยง → `## Check: Supply Chain`, upgrade ไม่ได้ → report residual risk ห้ามปล่อยเงียบ
4. injection: parameterized queries, escaping, validation ที่ boundary
5. auth/session: HttpOnly+Secure+SameSite cookies, server-side checks, rate limit auth endpoints
## References

- [Full-dimension checklist](references/checklist.md)
- [Supply chain](references/supply-chain.md)
- ใช้ /run-audit ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก security section
- รายงาน recommended actions พร้อม priority (security)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
