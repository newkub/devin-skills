---
name: review-delivery
description: "Review delivery: docs, DX, efficiency, config, CI/CD, infra, performance, security"
argument-hint: "[scope]"
related:
  - review-docs
  - review-dx
  - review-test
  - review-config
  - review-performance
  - review-security
  - review-seo
  - review-frontend
  - review-code-quality
  - scan-codebase
  - report
  - run-watch
  - run-review
  - check-repo-hygiene
  - follow-tool-crw
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

> Goal: เตรียม context และสแกน delivery setup
1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/deep-review` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation And Web Presence

> Goal: ตรวจ documentation และ web presence
- ตรวจ documentation ใน `references/docs.md` — dedicated deep pass → `/review-docs`
- ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ แล้วรวม findings — website/frontend code → `/review-frontend`

### 3. Experience And Insights

> Goal: ตรวจ DX และ analytics
- ตรวจ DX ใน `references/dx.md` — dedicated deep pass → `/review-dx`
- ตรวจ analytics ใน `references/analytics.md`

### 4. Quality

> Goal: ตรวจ testing และ PR process
- ตรวจ testing ใน `references/testing.md` — dedicated deep pass → `/review-test`
- ตรวจ PR ใน `references/pr-review.md`

### 5. Operations

> Goal: ตรวจ logging, debugging และ versioning
- ตรวจ logging และ debugging ใน `references/logging-debugging.md`
- ตรวจ versioning ใน `references/versioning.md`

### 6. Build And Configuration

> Goal: ตรวจ build efficiency และ config health
- ตรวจ build efficiency ใน `references/efficiency.md`
- ตรวจ config health ใน `references/config.md` — dedicated deep pass → `/review-config`

### 7. Infrastructure And Pipeline

> Goal: ตรวจ CI/CD pipeline และ infrastructure
- ตรวจ CI/CD pipeline ใน `references/ci-cd.md`
- ตรวจ infrastructure ใน `references/infrastructure.md`

### 8. Performance And Security

> Goal: ตรวจ performance และ security
- ทำ `/review-performance` แล้วดู `references/performance.md` สำหรับรายละเอียด
- ทำ `/review-security` แล้วดู `references/security.md` สำหรับรายละเอียด

### 9. Validate And Report

> Goal: validate findings และรายงาน
1. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity ตาม `references/scoring.md`
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` และ `/suggest-next-action`

### Subskills

> Goal: dispatch focused pass ไปยัง subskill เมื่อ user ต้องการเจาะ dimension เดียวของ delivery-unique scope

| Topic | Subskill |
|-------|----------|
| `ci-cd`, `pipeline`, `ci` — build times, caching, parallelism, workflow security | `subskills/check-ci-cd/SKILL.md` |
| `infra`, `infrastructure`, `docker` — containers, environments, deploy surface | `subskills/check-infra/SKILL.md` |
| `efficiency`, `build` — build/dev-loop efficiency, tooling overhead | `subskills/check-efficiency/SKILL.md` |
| `ops`, `logging`, `versioning` — logging/debugging, versioning, PR process, analytics | `subskills/check-ops/SKILL.md` |

## Check: All Routes

### Goal

Discover ทุก same-origin routes ของ target (docs site, app, deployed domain) แล้วเทียบกับ expected set — รายงาน routes ที่หายไป, เกินมา, หรือยังไม่ถูก document

### Scope

- Target: URL (`https://docs.example.com`), local dev server, หรือ docs site ของ library ที่ skill ครอบ
- Expected set: `references/routes.md` ของ skill, docs sidebar, sitemap, หรือ route files ใน codebase
- Read-only — ไม่แก้ไขไฟล์ (update ทำโดย skill ที่เรียกใช้ เช่น `/update-devin-global-skills`)
- ต่างจาก `## Check: Routes Status` ที่ตรวจ HTTP status ต่อ route — skill นี้ตรวจ coverage/completeness

### Execute

#### 1. Resolve Target And Expected Set

> Goal: รู้ว่าต้อง map อะไรและเทียบกับอะไร

1. รับ target จาก argument — URL หรือ domain; ถ้าไม่มี → หา official site จาก skill ที่กำลังทำงานอยู่ (`references/website.md`)
2. หา expected set: `references/routes.md`, sidebar config (`docs/.vitepress/config.ts`, `mkdocs.yml`), หรือ route files
3. ถ้าไม่มี expected set → mode = discover-only (list routes ทั้งหมด)

#### 2. Discover Routes

> Goal: ได้ route list จริงจาก target

ลองตามลำดับ — ใช้วิธีแรกที่สำเร็จ:

1. `crw map` (preferred): `crw map <url>` หรือ MCP `crw_map` ถ้า server `crw` available — ได้ sitemap + crawl discovery
2. sitemap.xml: `webfetch <url>/sitemap.xml` — parse `<loc>` entries (รองรับ sitemap index)
3. Crawl fallback: `webfetch` หน้าแรก + docs index → ตาม same-origin links 1-2 ระดับ
4. App routes: ถ้า target เป็น codebase → `find_file_by_name` หา route files (`app//page.*`, `pages/`, `routes/`)

Normalize: strip trailing slash, query, fragment; เหลือเฉพาะ same-origin paths

#### 3. Compare And Report

> Goal: pass/fail พร้อม missing/extra locations

1. เทียบ discovered vs expected (case-insensitive, normalized)
2. จัดกลุ่มผล: `missing` (มีใน expected ไม่มีใน site), `undocumented` (มีใน site ไม่มีใน expected), `match`
3. Report ตาราง: No. | Route | Status | Note — เรียง missing/undocumented ก่อน
4. Exit criteria: pass เมื่อ undocumented = 0 (missing อาจเป็น intentional เช่น auth-gated)

### Rules

#### 1. Deterministic

- normalize URLs ก่อนเทียบเสมอ — trailing slash, case, `index.html`, locale prefix (`/en/`)
- จำกัด depth และจำนวน routes (default cap 500) — report เมื่อถูก cap

#### 2. Source Priority

- prefer `crw map` เสมอเมื่อ available — ไม่ใช้ search engine เดา routes
- ถ้า crw ไม่มีและ sitemap ไม่มี → ระบุใน report ว่า discovery อาจไม่ครบ

#### 3. No Guessing

- ห้าม generate routes จากชื่อหัวข้อเอง — ต้องมาจาก discovery จริง
- ถ้า docs site มี versioning (`/v1/`, `/v2/`) → map เฉพาะ latest เป็นค่า default ยกเว้น user ระบุ

- ใช้ /check-repo-hygiene ถ้าจำเป็น
- ใช้ /follow-tool-crw ถ้าจำเป็น
- ใช้ /review-coverage ถ้าจำเป็น


### Expected Outcome

- รายการ routes ทั้งหมดที่ discover ได้ + diff เทียบ expected set
- Report พร้อมใช้เป็นฐาน update `references/routes.md` โดย `/update-devin-global-skills`

## Check: Routes Status


### Goal

เช็ค HTTP response status ของทุก page routes บน domain ที่ระบุ — discover routes ด้วย `crw map` (sitemap + crawl fallback) แล้วยิง request ทีละ route เพื่อรายงาน status, response time และ severity

### Scope

- ใช้กับ deployed domain (`https://example.com`) หรือ local dev server (`localhost:3000`)
- เช็คเฉพาะ same-origin page routes ที่ discover ได้จาก sitemap หรือ crawl — ไม่ตาม external links
- ใช้ /api ถ้าจำเป็น
- ใช้ /resolve-errors ถ้าจำเป็น
- Route ที่ต้อง auth ให้จัด 401/403 เป็น `protected` ไม่ใช่ critical

### Execute

#### 1. Resolve Domain And Prerequisites

> Goal: พร้อมก่อนเช็ค

1. รับ `domain` จาก argument — normalize เป็น base URL (`example.com` → `https://example.com`, `localhost:3000` → `http://localhost:3000`)
2. ตรวจว่า `crw` พร้อมใช้ด้วย `crw --version` — ถ้าไม่มี → ทำ `/download-program`
3. ถ้าเป็น local dev URL → ตรวจว่า server รันอยู่ (ทำ `/check-open-ports` ถ้าไม่ตอบ)
4. ถ้า domain ไม่ตอบเลย → stop และ report

#### 2. Discover Routes

> Goal: ได้ URL list ของทุก page routes

1. รัน `crw map <base-url> --format json` — discover จาก sitemap ก่อน ถ้าไม่มี sitemap จะ crawl ตาม link อัตโนมัติ
2. ถ้าได้ 0 routes → retry `crw map <base-url> --no-sitemap --format json` บังคับ crawl
3. ถ้า target เป็น SPA ที่ render ด้วย JS → เพิ่ม `--js`
4. ถ้า discover จากเว็บไม่ได้แต่มี source code → ทำ `/report-uxui-all-routes` แล้วเอา paths มาต่อท้าย base URL
5. กรองเฉพาะ same-origin URLs และ dedupe

#### 3. Check Response Per Route

> Goal: ได้ status และ response time ทุก route

1. รัน `skills/shared/scripts/check-routes-status.ps1 -Domain <domain>` — script ทำ step 1-3 อัตโนมัติ
2. script ยิง `HEAD` ทีละ route ผ่าน `curl.exe` — ถ้าได้ 405/501 → fallback `GET`
3. เก็บต่อ route: `status code`, `response time (ms)`, `effective URL` หลัง redirect
4. timeout default 15 วินาทีต่อ route — ปรับด้วย `-TimeoutSec` จำกัดจำนวน routes ด้วย `-Limit` และ depth ด้วย `-Depth`

#### 4. Classify Findings

> Goal: จัด severity ให้ทุก route

1. `ok` — status 2xx
2. `redirect` — status 3xx (flag ถ้า redirect chain ยาวกว่า 1 hop)
3. `protected` — 401/403 (expected สำหรับ auth routes)
4. `slow` — 2xx แต่ response time > 3000ms
5. `critical` — 4xx อื่น, 5xx, timeout, DNS/TLS failure
6. กรอง false positives: route ที่ตั้งใจให้ 404/410 เช่น catch-all หรือ gone pages

#### 5. Report

> Goal: รายงานผลพร้อม action

1. ทำ `/report` คอลัมน์: `No.`, `Route`, `Status`, `Time (ms)`, `Severity`, `Recommendation`
2. สรุปท้ายตาราง: total, ok, redirect, slow, protected, critical
3. ถ้ามี critical → แนะนำ `/resolve-errors` หรือ `/deep-debug` พร้อมระบุ route ที่พัง
4. ถ้าทุก route ok → report "all routes healthy"

### Rules

#### 1. Read-Only And Safe

- ไม่ flood target — ใช้ sequential requests และ respect crawl-delay ของ `robots.txt` ถ้ามี
- ไม่ตาม external links หรือ subdomains ที่ไม่ได้ระบุ

#### 2. Evidence-Based

- ทุก finding ต้องมี actual status code และ response time จริง ห้ามเดา
- ระบุ error type เมื่อ request ล้ม: DNS, TLS, timeout, connection refused
- ถ้า discover ได้ไม่ครบ → ระบุใน report ว่า route list อาจไม่ complete

#### 3. Actionable

- ใช้ /resolve-errors ถ้าจำเป็น

- ใช้ /follow-tool-crw ถ้าจำเป็น
- ใช้ /report-uxui-all-routes ถ้าจำเป็น
- ใช้ /deep-test api ถ้าจำเป็น (all-routes check อยู่ใน references/api.md)
- ใช้ /resolve-errors ถ้าจำเป็น

- ใช้ /review-security ถ้าจำเป็น
- ใช้ /use-scripts ถ้าจำเป็น
### Expected Outcome

- ตารางทุก page routes พร้อม status code, response time และ severity
- summary แยกตาม severity พร้อมจำนวน
- critical routes มี recommendation ชัดเจน

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `all-routes` | `## Check: All Routes` |
| `routes-status` | `## Check: Routes Status` |

## Rules

- ข้าม dimension ใด ถ้า project ไม่มี — ดู criteria ในแต่ละ reference
- ทุก finding ต้องมี file path และ line number (delivery)
- ใช้ tools สำหรับ verification ไม่เดา
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- คำนวณ score เป็น percentage (0-100) ตาม `references/scoring.md` แล้วเปรียบเทียบ before/after
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (delivery)
- ใช้ `/report` สำหรับรายงาน findings, score, actions

- refs ใน skill นี้ใช้เป็น checklist เบาเท่านั้น — domain deep-dive ให้ delegate: docs→`/review-docs`, dx→`/review-dx`, testing→`/review-test`, config→`/review-config`, perf→`/review-performance`, security→`/review-security`, seo→`/review-seo`, frontend→`/review-frontend`, quality→`/review-code-quality`
- delivery-unique dims (ci-cd, infrastructure, efficiency, versioning, logging-debugging, pr-review, analytics, containerization) review ใน skill นี้โดยตรง

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps

1. baseline: run history จริง — duration/job, cache hit rate, flake rate
2. caching: lockfile keys, build cache, `--frozen-lockfile`
3. parallelism: matrix เฉพาะ axes จำเป็น, concurrency cancel, `needs:` graph, timeouts ครบ
4. reliability: path filters, flaky root-cause fixes
5. security: pin SHAs, least-privilege permissions, OIDC แทน long-lived keys
6. docker images: multi-stage, layer cache, minimal base
## References

- [Full-dimension checklist](references/checklist.md)
- [CI/CD pipeline](references/ci-cd.md)
- [Infrastructure](references/infrastructure.md)
- [Build efficiency](references/efficiency.md)
- [Versioning](references/versioning.md)
- [Logging and debugging](references/logging-debugging.md)
- [PR review](references/pr-review.md)
- [Analytics](references/analytics.md)
- [Scoring](references/scoring.md)
- ใช้ /run-watch ถ้าจำเป็น

## Expected Outcome

- ตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority (delivery)
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
