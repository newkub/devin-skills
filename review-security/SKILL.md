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
  - use-subagents
---
## Goal

Review security ครอบคลุมทุก dimension ของ application security พร้อม aggregate findings, severity, และ review score — domain checklist อยู่ใน `subagents/security-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

ครอบคลุม: auth posture (high-level เท่านั้น), OWASP Top 10, secrets management, injection prevention, CORS/CSP, API security, encryption, file upload security, supply chain, security scoring

| Dimension | Checklist |
|-----------|-----------|
| `authn` — login flow, password, session, MFA | `subagents/security-reviewer/authentication.md` |
| `authz` — RBAC, permission mapping, IDOR | `subagents/security-reviewer/authorization.md` |
| `owasp` — OWASP Top 10 categories | `subagents/security-reviewer/owasp-top-10.md` |
| `secrets` — hardcoded secrets, env handling, rotation | `subagents/security-reviewer/secrets.md` |
| `injection` — SQL/NoSQL/command/template/XSS | `subagents/security-reviewer/injection.md` |
| `api` — rate limiting, input validation, authn/z on endpoints | `subagents/security-reviewer/api-security.md` |
| `file-upload` — type validation, storage, serving | `subagents/security-reviewer/file-upload.md` |
| `encryption` — at rest, in transit, key management | `subagents/security-reviewer/encryption.md` |
| `supply-chain` — deps audit, lockfile, typosquat, pinning | `subagents/security-reviewer/supply-chain.md` |

ไม่รวม: auth subsystem deep-dive — identity flows, sessions, tokens, OAuth, MFA, RBAC/ABAC (ใช้ `/review-auth`), compliance review (ใช้ `/review-compliance`) และ observability review (ใช้ `/review-observability`)

## Execute

### 1. Prepare And Baseline

> Goal: เข้าใจ security setup และสร้าง baseline findings

1. ทำตาม `subagents/security-reviewer/security-risk.md` — risk profile, threat model, severity framework
2. ทำ `/scan-codebase` เพื่อระบุ auth framework, session strategy, API framework, encryption library, และ secret manager
3. ทำ `/run-review` + `/run-audit` เก็บ analyzer/dependency baseline (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Security-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ตาม skip conditions ใน Rules)
2. Spawn `subagents/security-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน — dimensions ต่างกันใน scope เดียวรวมเป็น instance เดียว

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. Validate score ตาม `subagents/security-reviewer/scoring.md`
3. findings ที่เป็น compliance/observability/auth deep-dive → ระบุเป็น info + route ไป skill ที่เหมาะสม

### 4. Report

> Goal: ตรวจสอบ findings, คำนวณ score, และรายงานผล

1. ทำ `/deep-validate` ก่อนรายงาน แล้วทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch งานเฉพาะมิติไปยัง subskill — check subskills ทำ focused review pass, report subskill format findings; fix ทำใน `## Fix`

| Topic | Subskill |
|-------|----------|
| `authn`, `auth` — auth posture + authz matrix (high-level, deep-dive → `/review-auth`) | `subskills/check-authn/SKILL.md` |
| `headers`, `csp`, `cors` — security headers verify บน deployed response | `subskills/check-headers/SKILL.md` |
| `injection`, `sqli`, `xss` — injection surfaces source→sink | `subskills/check-injection/SKILL.md` |
| `report`, `vulns` — vuln matrix + exploit paths + fix mapping | `subskills/report-vulns/SKILL.md` |

### Subagents

> Goal: domain reviewer ที่ถือ checklist ทั้งหมด — spawn ผ่าน `/use-subagents`

| Agent | Path |
|-------|------|
| `security-reviewer` — security dimensions พร้อม severity + evidence | `subagents/security-reviewer/AGENT.md` |

## Check: CORS Policy
ทำตาม [subagents/security-reviewer/check-cors-policy.md](subagents/security-reviewer/check-cors-policy.md)

## Check: Security Headers
ทำตาม [subagents/security-reviewer/check-security-headers.md](subagents/security-reviewer/check-security-headers.md)

## Check: Supply Chain
ทำตาม [subagents/security-reviewer/check-supply-chain.md](subagents/security-reviewer/check-supply-chain.md)

## Check: Unicode Homoglyph
ทำตาม [subagents/security-reviewer/check-unicode-homoglyph.md](subagents/security-reviewer/check-unicode-homoglyph.md)

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
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/security-reviewer/` เท่านั้น

### 2. Skip Conditions

- ถ้า project ไม่มี authentication → ข้าม `authn`
- ถ้า project ไม่มี authorization → ข้าม `authz`
- ถ้า project ไม่มี API → ข้าม `api`
- ถ้า project ไม่มี file upload → ข้าม `file-upload`
- ถ้า project ไม่มี encryption → ข้าม `encryption`

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

- ตาม `../shared/review-rules.md` — Health Score (score ตาม `subagents/security-reviewer/scoring.md`)

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

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก security section
- รายงาน recommended actions พร้อม priority (security)
- Review score ต่อ dimension และ overall
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
