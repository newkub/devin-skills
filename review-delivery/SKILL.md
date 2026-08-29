---
name: review-delivery
description: "Review delivery: docs, DX, efficiency, config, CI/CD, infra, performance, security"
related:
  - review-performance
  - review-seo
  - review-security
  - review-quality
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, git hygiene, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

## Execute

### 1. Prepare And Scan

> Goal: เข้าใจ delivery setup และ channels ใน codebase

1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/review-codebase-everythink` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด

### 2. Documentation And Web Presence Review

> Goal: ครอบคลุม documentation และ SEO

#### 2.1 Documentation Review

ตรวจสอบ README, API docs, examples, guides, JSDoc/TSDoc, VitePress content — ดูรายละเอียดใน [references/docs.md](references/docs.md)

#### 2.2 SEO Review

1. ทำ `/review-seo` เพื่อรีวิว SEO โดยเฉพาะ
2. รับ findings, severity และ score จาก `/review-seo` มารวมใน aggregate report

### 3. Experience And Insights Review

> Goal: ครอบคลุม DX และ analytics

#### 3.1 Developer Experience Review

ตรวจ onboarding, tooling, error messages, feedback loops — ดูรายละเอียดใน [references/dx.md](references/dx.md)

#### 3.2 Analytics Review

1. ตรวจ event tracking, naming, schema consistency, conversion funnels, tracking completeness
2. ตรวจ analytics implementation, data accuracy, tool configuration, consent mode, data retention
3. Critical: broken tracking, no conversion funnel, data accuracy issue
4. High: missing event tracking, inconsistent naming, no consent mode

### 4. Quality Assurance Review

> Goal: ครอบคลุม testing และ PR review

#### 4.1 Testing Review

1. ตรวจสอบ coverage, test file patterns, test isolation, untested critical paths, E2E coverage, reliability
2. Critical: untested critical path, no tests at all
3. High: low coverage on core logic, flaky tests
4. Medium: missing edge case test, test isolation issue

#### 4.2 PR Review

ตรวจ CI status, diff, unintended changes, debug code, tests, breaking changes — ดูรายละเอียดใน [references/pr-review.md](references/pr-review.md)

### 5. Operations Review

> Goal: ครอบคลุม logging, debugging และ versioning

#### 5.1 Logging And Debugging Review

1. ตรวจสอบ log levels, structured logging, log consistency, sensitive data exposure, PII, secret leakage
2. ตรวจสอบ error message clarity, stack trace quality, source map coverage, reproducibility
3. Critical: secrets in logs, PII exposure, silent failure, no error context
4. High: missing structured logging, unclear error message, no debug logging in critical path

#### 5.2 Versioning Review

1. ตรวจสอบ semver compliance, changelog format (Keep a Changelog), release notes, migration paths
2. ตรวจสอบ deprecation policy: notices, sunset timeline, migration guides, backward compatibility
3. Critical: no versioning strategy, breaking change ไม่มี migration path, ไม่มี changelog
4. High: semver violation, missing release notes, deprecation ไม่มี sunset timeline

### 6. Build And Configuration Review

> Goal: ครอบคลุม build efficiency และ config health

#### 6.1 Build Efficiency Review

บันทึก baseline, ตรวจ build config, dependencies, assets, cost — ดูรายละเอียดใน [references/efficiency.md](references/efficiency.md)

#### 6.2 Config Health Review

ระบุ config files, ตรวจ scripts, shared config, security, consistency — ดูรายละเอียดใน [references/config.md](references/config.md)

### 7. Infrastructure And Pipeline Review

> Goal: ครอบคลุม CI/CD pipeline และ infrastructure

#### 7.1 CI/CD Pipeline Review

ระบุ platform, ตรวจ job dependencies, caching, reliability, artifacts — ดูรายละเอียดใน [references/ci-cd.md](references/ci-cd.md)

#### 7.2 Infrastructure Review

ตรวจ workers, webhooks, scalability, deployment, DR, migration — ดูรายละเอียดใน [references/infrastructure.md](references/infrastructure.md)

### 8. Performance And Security Review

> Goal: delegate performance และ security review ให้กับ sub-skills

#### 8.1 Performance Review

1. ทำ `/review-performance` เพื่อรีวิว performance โดยเฉพาะ
2. รับ findings, severity และ score จาก `/review-performance` มารวมใน aggregate report
3. ดูรายละเอียดใน [references/performance.md](references/performance.md)

#### 8.2 Security Review

ตรวจ auth, secrets, injection, dependencies, permissions, file upload, compliance — ดูรายละเอียดใน [references/security.md](references/security.md)

### 9. Validate And Report

> Goal: สรุป findings พร้อมคะแนนและส่งต่อ action ถัดไป

1. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
2. จัดลำดับ severity: Critical → High → Medium → Low → Info
3. คำนวณ review score ตาม `references/scoring.md`
4. ทำ `/report` พร้อม `/report-table` และ `/suggest-next-action`

## Rules

### 1. Skip Conditions

- ถ้า project ไม่มี documentation site หรือ web pages → ข้าม Section 2.1-2.2
- ถ้า project ไม่มี developer tooling → ข้าม Section 3.1
- ถ้า project ไม่มี analytics → ข้าม Section 3.2
- ถ้า project ไม่มี tests → ข้าม Section 4.1
- ถ้า project ไม่มี pull request workflow → ข้าม Section 4.2
- ถ้า project ไม่มี logging → ข้าม Section 5.1
- ถ้า project ไม่มี versioning strategy → ข้าม Section 5.2
- ถ้า project ไม่มี build tool → ข้าม Section 6.1
- ถ้า project ไม่มี config files → ข้าม Section 6.2
- ถ้า project ไม่มี CI/CD → ข้าม Section 7.1
- ถ้า project ไม่มี infrastructure → ข้าม Section 7.2
- ถ้า project ไม่มี performance หรือ security concerns → ข้าม Section 8.1-8.2

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
