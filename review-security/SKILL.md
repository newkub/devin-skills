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

### Goal

ตรวจ CORS policy ของ API/app ว่าปลอดภัย — wildcard origins ที่อันตราย, credentials ที่เปิดเกิน, methods/headers ที่ permissive เกินความจำเป็น

### Scope

- ตรวจ CORS config ใน code (middleware settings) และ actual responses (`Access-Control-*` headers)
- ครอบคลุม: `Allow-Origin`, `Allow-Credentials`, `Allow-Methods`, `Allow-Headers`, `Max-Age`, preflight handling
- Read-only: รายงาน — แก้ผ่าน `## Check: CORS Policy`

### Execute

#### 1. Locate CORS Config

> Goal: หาจุดที่ CORS ถูกตั้งค่า

1. ค้น cors middleware/plugins: `cors(`, `@elysiajs/cors`, `Access-Control` headers, framework config
2. ตรวจ per-route vs global — global permissive อาจ cover endpoints ที่ไม่ควร
3. ตรวจ platform-level CORS (Cloudflare, CDN, API gateway) ด้วย

#### 2. Test Actual Responses

> Goal: ดู CORS behavior จริงไม่ใช่แค่ config

1. ส่ง preflight: `curl -X OPTIONS -H "Origin: https://evil.example" -H "Access-Control-Request-Method: POST" <url>`
2. ตรวจว่า origin ที่ไม่ได้ตั้งใจถูก reflect/allow ไหม
3. ทดสอบ `Origin: null`, subdomain patterns, credentials flag จริง

#### 3. Evaluate Policy

> Goal: flag misconfigurations ตาม risk

1. Critical: `Allow-Origin: *` ร่วมกับ `Allow-Credentials: true` (browsers ปฏิเสธ แต่ config ผิด), origin reflection ที่ reflect ทุก origin + credentials
2. High: `*` origin บน endpoints ที่ return sensitive data
3. Medium: `Allow-Methods: *`, `Allow-Headers: *` เกินจำเป็น, `Max-Age` สูงเกิน
4. Info: missing CORS บน API ที่ browser clients ต้องใช้
5. ตรวจ regex origin patterns ที่ bypass ได้ (`*.example.com` ที่ match `evil-example.com`)

#### 4. Report

> Goal: สรุป CORS posture พร้อม fixes

1. ใช้ `/report`: `No.`, `Endpoint/Scope`, `Origin Policy`, `Credentials`, `Risk`, `Severity`, `Fix`
2. แนะนำ allowlist ที่ถูกต้องต่อ environment
3. ระบุว่า fix อยู่ที่ code config หรือ platform layer

### Rules

#### 1. Test Not Just Read

- CORS config ใน code อาจไม่ตรง actual headers (proxy/middleware ทับ) — ทดสอบจริงเสมอ
- preflight + actual request ต่างกัน — ตรวจทั้งคู่

#### 2. Read-Only

- ไม่แก้ config — รายงานให้ `## Check: CORS Policy`
- ทดสอบด้วย benign origins เท่านั้น — ไม่ exploit

#### 3. Context Aware

- Public APIs ที่ตั้งใจ `*` ไม่ใช่ violation — flag info พร้อมเงื่อนไข
- Internal services ที่ไม่ควรมี CORS เลย — flag ถ้าเปิดไว้

### Expected Outcome

- CORS posture ที่ชัดเจนต่อ endpoint/environment
- Misconfig findings พร้อม severity และ actual-header evidence
- Allowlist recommendations ที่เหมาะสม

## Check: Security Headers


### Goal

ตรวจ HTTP response headers และ cookie flags ของ web app หรือ API เทียบกับ security baseline — หา headers ที่ขาดหรือตั้งค่าผิด

### Scope

- ใช้กับ running app (local หรือ deployed URL) และ config files ที่ set headers (`next.config.*`, `wrangler.toml`, `nginx.conf`, `vercel.json`, middleware)
- ครอบคลุม: `Content-Security-Policy`, `Strict-Transport-Security`, `X-Frame-Options`/`frame-ancestors`, `X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy`, `Cross-Origin-*` และ `Set-Cookie` flags
- Read-only: ตรวจและรายงาน — แก้ไขให้ทำ `## Check: Security Headers`

### Execute

#### 1. Identify Target

> Goal: รู้ว่าจะ audit อะไร

1. รับ `url` จาก argument หรือใช้ local dev URL จาก `/run-dev`
2. ถ้าไม่มี running app → audit config files ที่ set headers ใน repo แทน
3. บันทึก target URL(s) และ routes ที่จะตรวจ (หน้าแรก + auth pages + API endpoints)

#### 2. Fetch Headers

> Goal: เก็บ response headers จริง

1. รัน `curl -sI <url>` หรือ `curl -sD - -o NUL <url>` ต่อ target
2. เก็บ response headers และ `Set-Cookie` ทุก entry
3. ถ้าเป็น SPA → ตรวจทั้ง document response และ API responses
4. บันทึก status code ประกอบ (headers บน error pages อาจต่างกัน)

#### 3. Evaluate Against Baseline

> Goal: ให้คะแนนแต่ละ header

1. `Strict-Transport-Security`: ต้องมีบน HTTPS, `max-age >= 31536000`, แนะนำ `includeSubDomains`
2. `Content-Security-Policy`: ต้องมี, ห้าม `unsafe-inline`/`unsafe-eval` ถ้าไม่จำเป็น, flag `*` sources
3. `X-Content-Type-Options: nosniff` ต้องมี
4. `X-Frame-Options: DENY/SAMEORIGIN` หรือ CSP `frame-ancestors`
5. `Referrer-Policy`: แนะนำ `strict-origin-when-cross-origin` หรือเข้มกว่า
6. `Permissions-Policy`: ปิด features ที่ไม่ใช้ (camera, mic, geolocation)
7. `Set-Cookie`: flag cookies ที่ขาด `Secure`, `HttpOnly`, `SameSite`
8. `Server`/`X-Powered-By`: flag ถ้า leak stack info

#### 4. Review Config Sources

> Goal: หาจุดที่ควร set headers ใน code

1. ค้น config: `headers()` ใน `next.config.*`, `[[headers]]` ใน `wrangler.toml`/`_headers`, `vercel.json`, nginx `add_header`
2. เช็คว่า headers ที่ขาด set ได้ที่ platform level หรือต้อง app middleware
3. ระบุ single point ที่ควรแก้ — หลีกเลี่ยง set ซ้ำหลายชั้น

#### 5. Report

> Goal: สรุป grade และ fixes

1. ทำ `/report` คอลัมน์: `No.`, `Header`, `Expected`, `Actual`, `Severity`, `Fix`
2. Severity: `critical` (CSP/HSTS ขาด), `warning`, `info`
3. สรุป overall grade (A-F ตาม coverage)
4. ส่งต่อ `## Check: Security Headers` สำหรับการแก้ไข

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี actual header value หรือ `missing`
- อย่า flag header ที่ไม่ relevant กับ app type (เช่น HSTS บน localhost HTTP)

#### 2. Read-Only

- ไม่แก้ config หรือ code — ส่งต่อ `## Check: Security Headers`
- ไม่ fuzz หรือ attack target — audit headers เท่านั้น

#### 3. Context Aware

- API-only endpoints ไม่จำเป็นต้องมี CSP/X-Frame-Options — ประเมินตาม content type
- ระบุเมื่อ header ถูก set โดย platform (Cloudflare/Vercel) ไม่ใช่ app

- ใช้ `## Check: Security Headers` ถ้าจำเป็น
- ใช้ `## Check: Security Headers` ถ้าจำเป็น
- ใช้ /analyze-attack-surface ถ้าจำเป็น
- ใช้ /run-audit ถ้าจำเป็น

### Expected Outcome

- รายการ security headers ที่ขาด/ผิดพร้อม severity และ fix location
- Cookie flags audit ครบ
- Overall grade และ prioritized recommendations

## Check: Supply Chain


### Goal

ตรวจ software supply chain ของ project — lockfile tampering, typosquatting, suspicious install scripts, unpinned/untrusted sources — ความเสี่ยงที่ไม่ใช่ vulns ใน code แต่มาจาก dependencies เอง

### Scope

- ตรวจ manifests + lockfiles: `package.json`, `bun.lock`, `pnpm-lock.yaml`, `Cargo.lock`, `go.sum`
- ครอบคลุม: lockfile integrity, install scripts (`postinstall`), typosquat lookalikes, git/url deps, registry sources, version pinning
- Read-only: รายงาน — remediation ผ่าน `## Check: Supply Chain` หรือ `/review-dependencies`

### Execute

#### Subskills

> Goal: dispatch ไปยัง domain subskill ตาม argument — หรือรันครบทุก domain ถ้าไม่ระบุ

| Domain/Argument | Subskill |
|-----------------|----------|
| `lockfile` | ``#### Lockfile`` — resolve ตรง manifest, integrity fields, sources |
| `typosquat`, `packages` | ``#### Typosquat`` — lookalike names, suspicious signals, dependency confusion |
| `install-scripts`, `scripts` | ``#### Install Scripts`` — lifecycle scripts audit |
| `pinning`, `sources` | ``#### Pinning`` — floating versions, `.npmrc`, CI install flags |
| `report`, `risks` | ``#### Report Risks`` — risk report รวมทุก domain + hardening roadmap |

1. ถ้า argument ระบุ domain เดียว → อ่าน `subskills/<domain>/SKILL.md` แล้วทำตาม flow ในนั้น — ข้าม domains อื่น แต่ยังทำ Step 5 (Report)
2. ถ้าไม่ระบุ → ทำ Steps 1-4 ตามลำดับ โดยแต่ละ step อ่าน subskill ที่ตรงมา execute

#### 1. Lockfile Integrity

> Goal: ตรวจ lockfile ไม่ถูกแกะ

ทำตาม ``#### Lockfile``

#### 2. Typosquat And Suspicious Packages

> Goal: หา packages ที่อาจเป็นของปลอม

ทำตาม ``#### Typosquat``

#### 3. Install Scripts Audit

> Goal: ตรวจ lifecycle scripts ที่รันโค้ดตอน install

ทำตาม ``#### Install Scripts``

#### 4. Pinning And Sources

> Goal: ตรวจ reproducibility ของ supply chain

ทำตาม ``#### Pinning``

#### 5. Report

> Goal: สรุป supply chain risks

ทำตาม ``#### Report Risks`` — รวม findings ทุก domain เป็น risk report + hardening roadmap

### Rules

#### 1. Evidence-Based

- ทุก flag ต้องมี artifact จริง — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context นี้" (เช่น internal registry)

#### 2. Read-Only

- ไม่แก้ lockfile/manifests — รายงานให้ `/review-dependencies` แก้
- ไม่รัน install scripts เพื่อทดสอบ

#### 3. Practical

- เน้น risks ที่ actionable — ไม่ flag ทุก transitive dep
- supply chain hardening ต้องไม่ทำ workflow พัง — เสนอทีละขั้น
- ใช้ /run-audit ถ้าจำเป็น

### Expected Outcome

- รายการ supply chain findings พร้อม severity และ evidence
- Lockfile/install-script posture ที่ชัดเจน
- Hardening recommendations เรียงตาม risk

### Install Scripts


##### Goal

ตรวจ lifecycle scripts (`preinstall`/`install`/`postinstall`) ที่รันโค้ดตอน install — network calls, file writes นอก package, spawn, obfuscation

##### Scope

- ใช้เมื่อ `## Check: Supply Chain` dispatch มาที่ `install-scripts`/`scripts` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — ห้ามรัน install scripts เพื่อทดสอบ

##### Execute

###### 1. Inventory Install Scripts

> Goal: รวม deps ทั้งหมดที่มี lifecycle scripts

1. ค้น `preinstall`/`install`/`postinstall` ใน deps ทั้งหมด
2. จัดกลุ่ม: build scripts (node-gyp, esbuild) vs unknown scripts

###### 2. Flag Dangerous Behavior

> Goal: หา scripts ที่ทำอะไรนอกเหนือ build

1. flag scripts ที่: เรียก network, เขียนไฟล์นอก package, spawn processes, obfuscated
2. ตรวจว่า project เปิด `--ignore-scripts` หรือไม่ — trade-off ที่ต้องระบุ
3. บันทึก findings พร้อม evidence (script content)

###### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

##### Rules

- obfuscated script หรือ network call ใน install script = Critical
- known build scripts (node-gyp, esbuild, sharp) = ระบุแต่ไม่ flag เป็น risk

##### Expected Outcome

- Findings ของ install scripts พร้อม severity และ evidence

### Lockfile


##### Goal

ตรวจ lockfile integrity — lockfile ไม่ถูกแกะ, versions ตรง declared ranges, integrity fields ครบ, sources ปลอดภัย

##### Scope

- ใช้เมื่อ `## Check: Supply Chain` dispatch มาที่ `lockfile` หรือเรียกเดี่ยวๆ
- ครอบคลุม: `bun.lock`, `pnpm-lock.yaml`, `package-lock.json`, `yarn.lock`, `Cargo.lock`, `go.sum`
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

##### Execute

###### 1. Manifest Consistency

> Goal: resolved versions ตรง declared ranges

1. เทียบ lockfile กับ manifest — versions ที่ resolve ตรง declared ranges ไหม
2. flag resolved versions ที่อยู่นอก declared range (แกะ lockfile หรือ manual edit)

###### 2. Integrity And Sources

> Goal: hashes ครบ sources น่าเชื่อถือ

1. หา integrity fields ที่ขาดหรือแปลก (missing hashes, `http://` URLs)
2. flag deps ที่ resolve จาก non-standard registries หรือ direct URLs/git
3. บันทึก findings พร้อม evidence (lockfile line)

###### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

##### Rules

- ทุก flag ต้องมี artifact จริง — lockfile line หรือ resolved URL
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context" (เช่น internal registry)

##### Expected Outcome

- Findings ของ lockfile integrity พร้อม severity และ evidence

### Pinning


##### Goal

ตรวจ reproducibility ของ supply chain — floating versions, registry config, CI install flags

##### Scope

- ใช้เมื่อ `## Check: Supply Chain` dispatch มาที่ `pinning`/`sources` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

##### Execute

###### 1. Version Pinning

> Goal: ไม่มี floating versions ที่ auto-resolve

1. flag: floating versions (`*`, `latest`) ที่ auto-resolve ไปเวอร์ชันใหม่
2. flag ranges ที่กว้างเกิน (`>=` โดยไม่มี upper bound) ใน deps ที่ sensitive

###### 2. Registry And CI Config

> Goal: sources และ CI install ปลอดภัย

1. ตรวจ `.npmrc`/registry config — มี scope overrides หรือ auth tokens ถูก commit ไหม
2. ตรวจ CI: install ด้วย `--frozen-lockfile`/`--immutable` ไหม
3. บันทึก findings พร้อม evidence

###### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

##### Rules

- committed auth token ใน `.npmrc` = Critical; floating version = High/Medium
- เสนอ hash pinning และ registry allowlist เป็น hardening steps

##### Expected Outcome

- Findings ของ pinning/sources พร้อม severity และ evidence

### Report Risks


##### Goal

รวม findings จากทุก domain ของ `## Check: Supply Chain` เป็น risk report — SBOM-style inventory + severity + hardening steps

##### Scope

- ใช้เมื่อ `## Check: Supply Chain` dispatch มาที่ `report`/`risks` หรือ domain subskills emit findings
- Output: ตารางในแชท หรือ persistent artifact ผ่าน `/create-report-in-dot-devin` (เช่น สำหรับ audit trail)

##### Execute

###### 1. Aggregate Domain Findings

> Goal: รวม findings จาก lockfile/typosquat/install-scripts/pinning

1. รวม findings จาก domain subskills ที่รัน พร้อม domain tag
2. normalize severity: `critical` (suspicious install script, registry hijack), `high` (unpinned, git deps), `medium` (missing integrity, loose ranges)
3. dedupe findings ที่ package เดียวกัน

###### 2. Build Risk Report

> Goal: report ที่ compliance/audit ใช้ได้

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Domain`, `Severity`, `Evidence`, `Fix`
2. Inventory summary: total deps, direct vs transitive, sources breakdown
3. เรียง critical ก่อน — group by domain ถ้า findings เยอะ

###### 3. Hardening Roadmap

> Goal: next steps เรียงตาม risk-reduction

1. แนะนำ: SBOM generation (CycloneDX/SPDX), hash pinning, registry allowlist, `--frozen-lockfile` ใน CI
2. เรียงเป็น staged steps — ไม่ทำ workflow พัง
3. ถ้าต้องเก็บถาวร → ทำ `/create-report-in-dot-devin`

##### Rules

- ทุก finding มี artifact evidence — lockfile line, script content, registry metadata
- แยก "น่าสงสัย" จาก "ผิดปกติแต่ปกติใน context" (internal registry, known build scripts)
- remediation ชี้ไป `/review-dependencies` — report ไม่แก้เอง

##### Expected Outcome

- Risk report พร้อม inventory summary + findings matrix + hardening roadmap

### Typosquat


##### Goal

ตรวจหา packages ที่อาจเป็นของปลอม — typosquat lookalikes, packages ใหม่ที่น่าสงสัย, dependency confusion

##### Scope

- ใช้เมื่อ `## Check: Supply Chain` dispatch มาที่ `typosquat`/`packages` หรือเรียกเดี่ยวๆ
- Read-only: รายงาน — แก้ผ่าน `/review-dependencies`

##### Execute

###### 1. Lookalike Detection

> Goal: หาชื่อที่ใกล้ popular packages

1. flag names ที่ใกล้ popular packages (lodash vs lodas ฯลฯ) — edit distance
2. เทียบกับ top packages ของ registry ที่ใช้

###### 2. Suspicious Signals

> Goal: flag packages ที่มีสัญญาณเสี่ยง

1. flag: packages ที่เพิ่ง publish, downloads ต่ำมาก, no repo/README, single maintainer ใหม่
2. flag packages ที่ชื่อ internal-looking แต่ resolve จาก public registry (dependency confusion)
3. บันทึก findings พร้อม evidence

###### 3. Report

> Goal: ส่ง findings กลับ parent

1. ตาราง: `No.`, `Finding`, `Package/Location`, `Severity`, `Evidence`, `Fix`

##### Rules

- typosquat ที่ยืนยัน = Critical; suspicious signals = High/Medium
- ไม่ flag ทุก transitive dep — เน้น direct deps และชื่อที่ใกล้ popular จริงๆ

##### Expected Outcome

- Findings ของ typosquat/suspicious packages พร้อม severity และ evidence

## Check: Unicode Homoglyph

### Goal

ตรวจหา Unicode characters อันตรายใน source code — zero-width chars, homoglyphs (ตัวอักษรหน้าตาเหมือนกัน), bidirectional overrides — ที่ทำให้ code อ่านอย่างหนึ่งแต่ execute อีกอย่าง (Trojan Source)

### Scope

- ตรวจ source files ทุกภาษา: identifiers, strings, comments
- ครอบคลุม: zero-width chars (ZWSP, ZWJ, ZWNJ, BOM กลางไฟล์), bidi controls (U+202A-E, U+2066-9), homoglyphs ใน identifiers, confusable characters
- Read-only: รายงานตำแหน่ง — ลบ/แก้ผ่าน `## Check: Unicode Homoglyph`

### Execute

#### 1. Scan For Invisible Characters

> Goal: หา control/format chars ที่มองไม่เห็น

1. ใช้ script หรือ `search-files-patterns` หา: `\u200B-\u200F`, `\u202A-\u202E`, `\u2060-\u206F`, `\uFEFF` (นอกบรรทัดแรก)
2. flag ทุก occurrence พร้อม file:line:column และ codepoint

#### 2. Detect Bidi Override Attacks

> Goal: หา bidi controls ที่ reorder code ให้หลอกตา

1. ตรวจ bidi control chars ใน comments/strings — pattern คลาสสิกของ Trojan Source (CVE-2021-42574)
2. ตัวอย่างเสี่ยง: comment ที่มี RLO/LRO ทำให้ code ข้างหลัง "กลับ" ตอนแสดงผล
3. Severity สูงสุดสำหรับ bidi chars ใน source files

#### 3. Detect Homoglyph Identifiers

> Goal: หา identifiers ที่หน้าตาเหมือนกันแต่ต่าง codepoint

1. เทียบ identifiers ที่ normalize แล้วเท่ากันแต่ raw ต่างกัน (เช่น `а` Cyrillic vs `a` Latin)
2. flag mixed-script identifiers — Latin ปน Cyrillic/Greek ในคำเดียว
3. ข้าม non-ASCII identifiers ที่ตั้งใจ (i18n projects, math symbols) — รายงานแยกเป็น info

#### 4. Report

> Goal: สรุป findings พร้อม severity

1. ใช้ `/report` คอลัมน์: `No.`, `File:Line:Col`, `Codepoint`, `Type`, `Severity`, `Rendered As`
2. Severity: `critical` (bidi controls, zero-width ใน code), `high` (homoglyph identifiers), `info` (non-ASCII ที่ดูตั้งใจ)
3. แนะนำ: strip chars, linter rule (`eslint-plugin-security`, unicode-aware linters), pre-commit check

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องระบุ exact codepoint และตำแหน่ง — hex dump ได้
- แสดง rendered vs actual bytes เพื่อให้เห็นการหลอก

#### 2. No False Positives On Intent

- ไฟล์ i18n/locale และ docs ภาษาไทย/จีน/ญี่ปุ่นมี non-ASCII ปกติ — ข้ามหรือ flag info
- ตรวจ code regions เป็นหลัก ไม่ใช่ทุก byte

#### 3. Read-Only

- ไม่ลบ characters — รายงานให้ `## Check: Unicode Homoglyph` แก้
- ห้ามแก้ไฟล์ที่อาจเป็น intentionally internationalized โดยไม่ยืนยัน

### Expected Outcome

- รายการ dangerous Unicode chars พร้อมตำแหน่งและ type
- Trojan Source exposure assessment
- คำแนะนำ linter/pre-commit rule ป้องกันระยะยาว

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
