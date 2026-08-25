---
name: review-delivery
description: Review delivery: docs, DX, efficiency, config, CI/CD, infra, performance, security
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, git hygiene, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ delivery setup และ channels ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation Review

Review documentation ครอบคลุม README, API docs, examples, guides, JSDoc/TSDoc, VitePress content — ดู `references/docs.md`

> Goal: ครอบคลุมทุก documentation dimension

1. ตรวจสอบ README completeness, setup guide accuracy, และ API documentation coverage
2. ตรวจสอบ code examples: runnable, up-to-date, และ consistent with API
3. ตรวจสอบ content accuracy, broken links, และ missing documentation
4. ตรวจสอบ JSDoc/TSDoc completeness บน public API
5. ตรวจสอบ stale documentation: docs ที่ไม่ตรงกับ code ปัจจุบัน
6. ทำ `/review-codebase` เพื่อ deep documentation review เฉพาะทาง

### 3. SEO Review

> Goal: ครอบคลุมทุก SEO dimension

1. ตรวจสอบ meta tags, Open Graph, Twitter Cards, canonical URLs, structured data (JSON-LD), sitemap, robots.txt
2. ตรวจสอบ semantic HTML, heading hierarchy, image alt texts
3. Critical: missing meta tags on key pages, no sitemap, blocked indexing
4. High: missing structured data, broken canonical, missing Open Graph

### 4. Developer Experience Review

Review developer experience ครอบคลุม onboarding, tooling, documentation usability, feedback loops — ดู `references/dx.md`

> Goal: ครอบคลุมทุก DX dimension

1. ตรวจสอบ onboarding flow: setup scripts, prerequisites, first-run experience
2. ตรวจสอบ development tooling: hot reload, debug tools, development scripts
3. ตรวจสอบ error message quality, stack traces, และ debuggability
4. ตรวจสอบ feedback loops: test, lint, type check, build, deploy
5. Critical: broken setup, no onboarding guide, unrecoverable development error
6. High: missing debug tooling, unclear error messages, missing contributing guide

### 5. Analytics Review

> Goal: ครอบคลุมทุก analytics dimension

1. ตรวจสอบ event tracking, naming, schema consistency, conversion funnels, tracking completeness
2. ตรวจสอบ analytics implementation, data accuracy, tool configuration, consent mode, data retention
3. Critical: broken tracking, no conversion funnel, data accuracy issue
4. High: missing event tracking, inconsistent naming, no consent mode

### 6. Testing Review

> Goal: ครอบคลุมทุก testing dimension

1. ตรวจสอบ coverage, test file patterns, test isolation, untested critical paths, E2E coverage, reliability
2. Critical: untested critical path, no tests at all
3. High: low coverage on core logic, flaky tests
4. Medium: missing edge case test, test isolation issue

### 7. PR Review

Review PR ก่อน merge ครอบคลุม CI, code quality, tests, security, breaking changes

> Goal: ครอบคลุมทุก PR dimension

1. ตรวจสอบ CI status ของ PR ก่อน review
2. อ่าน PR diff และ files ที่เปลี่ยน ตรวจสอบว่า changes ตรงกับ PR description
3. ตรวจสอบไม่มี unintended changes, debug code, TODO/MOCK/placeholder ใน production code
4. ตรวจสอบไม่มี `console.log` หรือ debug statements
5. ตรวจสอบมี tests สำหรับ changes ใหม่ และไม่มี breaking changes โดยไม่มี migration guide
6. Critical: CI fail, secrets in diff, breaking change without migration
7. High: missing tests for new code, debug code in production, unresolved review comments

### 8. Logging And Debugging Review

> Goal: ครอบคลุมทุก logging และ debugging dimension

1. ตรวจสอบ log levels, structured logging, log consistency, sensitive data exposure, PII, secret leakage
2. ตรวจสอบ error message clarity, stack trace quality, source map coverage, reproducibility
3. Critical: secrets in logs, PII exposure, silent failure, no error context
4. High: missing structured logging, unclear error message, no debug logging in critical path

### 9. Versioning Review

> Goal: ครอบคลุมทุก versioning dimension

1. ตรวจสอบ semver compliance, changelog format (Keep a Changelog), release notes, migration paths
2. ตรวจสอบ deprecation policy: notices, sunset timeline, migration guides, backward compatibility
3. Critical: no versioning strategy, breaking change ไม่มี migration path, ไม่มี changelog
4. High: semver violation, missing release notes, deprecation ไม่มี sunset timeline

### 10. Build Efficiency Review

Review build efficiency ครอบคลุม build configuration, build time, output size, cost — ดู `references/efficiency.md`

> Goal: build เร็วขึ้น output เล็กลง และใช้ resource คุ้มค่า

1. บันทึก build time และ output size baseline
2. ตรวจสอบ build config: minify, sourcemap, target, external, tree-shaking, `sideEffects: false`
3. ตรวจสอบ unused dependencies, dead code, barrel files, code splitting
4. ตรวจสอบ assets ขนาดใหญ่, compression, format conversion
5. ตรวจสอบ cost: compute, storage, bandwidth, logs, idle resources
6. รัน build ใหม่และเปรียบเทียบกับ baseline

### 11. Config Health Review

Review config files ทั้ง root และ workspace ครอบคลุม scripts, build config, shared config, lint, format, git hooks, env vars — ดู `references/config.md`

> Goal: config ครบถ้วน ถูกต้อง สอดคล้องกัน

1. ระบุ config files ทั้งหมด: `tsconfig.json`, `vite.config.ts`, `biome.jsonc`, `vitest.config.ts`, `lefthook.yml`, `turbo.json`
2. ตรวจสอบ scripts consistency ข้าม workspaces
3. ตรวจสอบ shared config: path aliases, compiler options, format rules
4. ตรวจสอบ config security: secrets, `.gitignore`, env vars validation
5. ตรวจสอบ cross-workspace config consistency และ config drift

### 12. CI/CD Pipeline Review

Review CI/CD pipeline ครอบคลุม job dependencies, caching, parallelization, reliability — ดู `references/ci-cd.md`

> Goal: pipeline เร็ว น่าเชื่อถือ และ maintain ง่าย

1. ระบุ CI/CD platform: GitHub Actions, GitLab CI, Azure DevOps, Jenkins
2. ตรวจสอบ job dependencies และ parallelization
3. ตรวจสอบ caching สำหรับ dependencies, build artifacts
4. ตรวจสอบ reliability: retry, timeout, idempotency, secrets, permissions
5. ตรวจสอบ artifact size, retention policy, conditional jobs

### 13. Infrastructure Review

Review infrastructure ครอบคลุม workers, queues, webhooks, scalability, cost, deployment, DR, migration — ดู `references/infrastructure.md`

> Goal: infrastructure น่าเชื่อถือ ปรับขนาดได้ คุ้มค่า

1. ตรวจสอบ worker lifecycle, job processing, idempotency, retry, dead letter queue
2. ตรวจสอบ webhooks: signature, secret management, idempotency, replay protection
3. ตรวจสอบ scalability: stateless design, horizontal scaling, caching, database scaling
4. ตรวจสอบ deployment: rollback strategy, zero-downtime, post-deploy validation
5. ตรวจสอบ DR plan, RPO/RTO, backup schedules, migration files

### 14. Performance Review

Review performance ครอบคลุม network, bundler, memory, I/O, caching, complexity — ดู `references/performance.md`

> Goal: ระบุและแก้ performance bottlenecks

1. ตรวจสอบ network: DNS, connection, latency, payload, cache headers
2. ตรวจสอบ bundler: chunk splitting, tree shaking, minification, source maps
3. ตรวจสอบ memory: heap, GC, leaks, large data, streaming
4. ตรวจสอบ I/O: file, database, network I/O, serialization, batching
5. ตรวจสอบ caching: invalidation, key design, TTL, cache stampede
6. ทำ `/review-quality` อ้างอิง `references/time-complexity.md` บน critical paths

### 15. Security Review

Review security ครอบคลุม auth, secrets, injection, dependencies, permissions, file upload, compliance — ดู `references/security.md`

> Goal: ระบุและจัดการ security vulnerabilities

1. ตรวจสอบ auth flows, session/token management, RBAC, least privilege
2. ตรวจสอบ hardcoded secrets, secret storage, masking, rotation
3. ตรวจสอบ injection: SQL, command, path traversal, XSS, CSRF, deserialization
4. ตรวจสอบ dependency vulnerabilities, outdated packages, supply chain risks
5. ตรวจสอบ file upload validation, sanitization, storage, access control
6. ตรวจสอบ compliance: GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PII, data retention

### 16. Validate And Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/validate` และ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี documentation site หรือ web pages → ข้าม Section 2-3
- ถ้า project ไม่มี developer tooling → ข้าม Section 4
- ถ้า project ไม่มี analytics → ข้าม Section 5
- ถ้า project ไม่มี tests → ข้าม Section 6
- ถ้า project ไม่มี pull request workflow → ข้าม Section 7
- ถ้า project ไม่มี logging → ข้าม Section 8
- ถ้า project ไม่มี versioning strategy → ข้าม Section 9
- ถ้า project ไม่มี build tool → ข้าม Section 10
- ถ้า project ไม่มี config files → ข้าม Section 11
- ถ้า project ไม่มี CI/CD → ข้าม Section 12
- ถ้า project ไม่มี infrastructure → ข้าม Section 13
- ถ้า project ไม่มี performance concerns → ข้าม Section 14
- ถ้า project ไม่มี security concerns → ข้าม Section 15

### 2. Severity Classification

- Critical: broken setup, missing README, hardcoded secrets, authentication bypass, no rollback strategy, blocking bottleneck, untested critical path, CI fail
- High: missing API docs, outdated example, missing MFA, N+1 query, missing CI/CD step, slow build, missing debug tooling
- Medium: incomplete guide, suboptimal query, suboptimal deployment, missing edge case test, inconsistent config
- Low: cosmetic improvement, formatting issue, minor optimization, naming convention, documentation gap

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification
- ระบุ impact ต่อ critical paths และ users

### 4. Review Independence

- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- ถ้าพบ issue นอก scope → ระบุเป็น info เท่านั้น
- ถ้าต้องแก้ไข → แนะนำผ่าน `/suggest-next-action`

### 5. Health Score

- คำนวณ review score เป็น percentage (0-100) ตาม `references/scoring.md`
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
