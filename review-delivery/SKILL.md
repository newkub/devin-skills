---
name: review-delivery
description: Review delivery ครอบคลุม docs, SEO, DX, analytics, testing, PR, logging, versioning, git hygiene
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR review, logging, debugging, versioning, deprecation, git hygiene

## Execute

### 1. Prepare And Scan

เตรียม context ก่อนเริ่ม review

> Goal: เข้าใจ delivery setup และ channels ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup
2. ระบุ delivery channels, documentation tools, และ versioning strategy ที่ใช้
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/update-create-review-cli` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation Review

Review documentation ครอบคลุม README, API docs, examples, guides, JSDoc/TSDoc, VitePress content

> Goal: ครอบคลุมทุก documentation dimension

1. ตรวจสอบ README completeness, setup guide accuracy, และ API documentation coverage
2. ตรวจสอบ code examples: runnable, up-to-date, และ consistent with API
3. ตรวจสอบ content accuracy, broken links, และ missing documentation
4. ตรวจสอบ JSDoc/TSDoc completeness: public functions, classes, interfaces ที่ขาด JSDoc
5. ตรวจสอบ VitePress content: เนื้อหาถูกต้อง สมัยใหม่ consistent กับ code ปัจจุบัน
6. ตรวจสอบ stale documentation: docs ที่ไม่ตรงกับ code ปัจจุบัน และ outdated examples
7. Critical: missing README, broken setup guide, incorrect API docs, public API ที่ขาด docs, stale docs ที่ทำให้สับสน
8. High: missing API documentation, outdated example, broken link, missing `@param`/`@returns` บน public API, examples ที่ไม่ทำงาน
9. ทำ `/review-codebase` เพื่อ deep documentation review เฉพาะทาง

### 3. SEO Review

Review SEO ครอบคลุม metadata, structured data, sitemap, robots.txt, search engine optimization

> Goal: ครอบคลุมทุก SEO dimension

1. ตรวจสอบ meta tags coverage, Open Graph, Twitter Cards, และ canonical URLs
2. ตรวจสอบ structured data (JSON-LD), sitemap completeness, และ robots.txt
3. ตรวจสอบ semantic HTML, heading hierarchy, และ image alt texts
4. Critical: missing meta tags on key pages, no sitemap, blocked indexing
5. High: missing structured data, broken canonical, missing Open Graph

### 4. Developer Experience Review

Review developer experience ครอบคลุม onboarding, tooling, documentation usability, workflow efficiency

> Goal: ครอบคลุมทุก DX dimension

1. ตรวจสอบ onboarding flow: setup scripts, prerequisites, และ first-run experience
2. ตรวจสอบ development tooling: hot reload, debug tools, และ development scripts
3. ตรวจสอบ error message quality for developers, stack traces, และ debuggability
4. ตรวจสอบ documentation usability: README, contributing guide, และ inline documentation
5. Critical: broken setup, no onboarding guide, unrecoverable development error
6. High: missing debug tooling, unclear error messages, missing contributing guide

### 5. Analytics Review

Review analytics ครอบคลุม event tracking, conversion funnels, implementation, data accuracy

> Goal: ครอบคลุมทุก analytics dimension

1. ตรวจสอบ event tracking, event naming, และ event schema consistency
2. ตรวจสอบ conversion funnels, funnel steps, และ funnel tracking completeness
3. ตรวจสอบ analytics implementation, tracking code placement, และ data accuracy
4. ตรวจสอบ analytics tool configuration, consent mode, และ data retention
5. Critical: broken tracking, no conversion funnel, data accuracy issue
6. High: missing event tracking, inconsistent event naming, no consent mode

### 6. Testing Review

Review testing ครอบคลุม coverage, test quality, test isolation, untested critical paths

> Goal: ครอบคลุมทุก testing dimension

1. ตรวจสอบ coverage, test file patterns, test isolation
2. ตรวจสอบ untested critical paths, E2E coverage, และ test reliability
3. Critical: untested critical path, no tests at all
4. High: low coverage on core logic, flaky tests
5. Medium: missing edge case test, test isolation issue

### 7. PR Review

Review PR ก่อน merge ครอบคลุม CI, code quality, tests, security, breaking changes

> Goal: ครอบคลุมทุก PR dimension

1. ตรวจสอบ CI status ของ PR ก่อน review
2. อ่าน PR diff และ files ที่เปลี่ยน ตรวจสอบว่า changes ตรงกับ PR description
3. ตรวจสอบไม่มี unintended changes, debug code, TODO/MOCK/placeholder ใน production code
4. ตรวจสอบไม่มี `console.log` หรือ debug statements
5. ตรวจสอบมี tests สำหรับ changes ใหม่ และไม่มี breaking changes โดยไม่มี migration guide
6. ตรวจสอบ review comments ทั้งหมด resolved ไม่มี requested changes ค้างอยู่
7. Critical: CI fail, secrets in diff, breaking change without migration
8. High: missing tests for new code, debug code in production, unresolved review comments

### 8. Logging Review

Review logging ครอบคลุม log levels, structured logging, sensitive data, retention

> Goal: ครอบคลุมทุก logging dimension

1. ตรวจสอบ log levels, structured logging format, และ log consistency
2. ตรวจสอบ sensitive data exposure, PII in logs, และ secret leakage
3. ตรวจสอบ log retention, rotation, และ observability integration
4. Critical: secrets in logs, PII exposure, no logging on critical path
5. High: missing structured logging, inconsistent log levels, no log rotation

### 9. Debugging Review

Review debugging quality ครอบคลุม error messages, logging clarity, traceability, debuggability

> Goal: ครอบคลุมทุก debugging dimension

1. ตรวจสอบ error message clarity, context inclusion, และ actionable guidance
2. ตรวจสอบ stack trace quality, source map coverage, และ error correlation
3. ตรวจสอบ logging context, debug log levels, และ diagnostic data availability
4. ตรวจสอบ reproducibility: test coverage for error paths, error scenario documentation
5. Critical: silent failure, no error context, unreproducible production error
6. High: missing stack trace, unclear error message, no debug logging in critical path

### 10. Versioning Review

Review versioning strategy ครอบคลุม semantic versioning, changelog, release notes, breaking change management

> Goal: ครอบคลุมทุก versioning dimension

1. ตรวจสอบ semver compliance: version format, pre-release tags, build metadata
2. ตรวจสอบ changelog: format (Keep a Changelog), entry completeness, date accuracy
3. ตรวจสอบ release notes: breaking changes highlighted, migration paths documented
4. ตรวจสอบ deprecation policy: deprecation notices, sunset timeline, migration guides
5. ตรวจสอบ backward compatibility: API stability, breaking change frequency
6. Critical: no versioning strategy, breaking change ไม่มี migration path, ไม่มี changelog
7. High: semver violation, missing release notes สำหรับ major release, deprecation ไม่มี sunset timeline

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี documentation site ให้ข้าม Section 2
- ถ้า project ไม่มี web pages ให้ข้าม Section 3
- ถ้า project ไม่มี developer tooling ให้ข้าม Section 4
- ถ้า project ไม่มี analytics ให้ข้าม Section 5
- ถ้า project ไม่มี tests ให้ข้าม Section 6
- ถ้า project ไม่มี pull request workflow ให้ข้าม Section 7
- ถ้า project ไม่มี logging ให้ข้าม Section 8
- ถ้า project ไม่มี debugging setup ให้ข้าม Section 9
- ถ้า project ไม่มี versioning strategy ให้ข้าม Section 10
- ถ้า project ไม่มี deprecation policy ให้ข้าม Section 11
- ถ้า project ไม่มี git repository ให้ข้าม Section 12

### 2. Low Severity Classification

- Low: cosmetic improvement, formatting issue, minor metadata improvement, minor DX improvement, minor analytics improvement, minor logging improvement, minor message improvement, changelog formatting, minor deprecation improvement, minor convention improvement

### 3. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ไม่เดา ใช้ tools สำหรับ verification

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

- รายงานตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
