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
  - use-subagents
---

## Goal

Review delivery ครอบคลุมทุก dimension ของ delivery พร้อม aggregate findings และ review score — domain checklist อยู่ใน `subagents/delivery-reviewer/` (dispatch ไป subagent ไม่ตรวจเอง)

## Scope

delivery review สำหรับ: documentation, SEO, developer experience, analytics, testing, PR, logging, debugging, versioning, build efficiency, config health, CI/CD pipeline, infrastructure, performance, security

| Dimension | Checklist |
|-----------|-----------|
| `docs` — README, setup guide, API docs, changelogs | `subagents/delivery-reviewer/docs.md` |
| `dx` — developer experience | `../shared/dx.md` |
| `analytics` — tracking coverage, consent | `subagents/delivery-reviewer/analytics.md` |
| `testing` — coverage, isolation, reliability | `subagents/delivery-reviewer/testing.md` |
| `pr-review` — PR process ก่อน merge | `subagents/delivery-reviewer/pr-review.md` |
| `logging-debugging` — logs, errors, debuggability | `subagents/delivery-reviewer/logging-debugging.md` |
| `versioning` — strategy, changelog, deprecation | `subagents/delivery-reviewer/versioning.md` |
| `efficiency` — build/dev-loop efficiency | `subagents/delivery-reviewer/efficiency.md` |
| `config` — config health | `subagents/delivery-reviewer/config.md` |
| `ci-cd` — pipeline speed, reliability, security | `subagents/delivery-reviewer/ci-cd.md` |
| `infrastructure` — deploy, workers, scalability | `subagents/delivery-reviewer/infrastructure.md` |
| `containerization` — Dockerfile, engines | `subagents/delivery-reviewer/containerization.md` |
| `performance` — network, bundler, memory, I/O | `subagents/delivery-reviewer/performance.md` |
| `security` — auth, secrets, injection, deps | `subagents/delivery-reviewer/security.md` |
| `routes` — route coverage/status | `subagents/delivery-reviewer/check-all-routes.md` |

## Execute

### 1. Prepare And Scan

> Goal: เตรียม context และสแกน delivery setup
1. ทำ `/scan-codebase` เพื่อเข้าใจ delivery setup, project structure, tech stack
2. ระบุ delivery channels, documentation tools, versioning strategy, build tool, CI/CD platform, infrastructure, security tools
3. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง
4. ทำ `/deep-review` แล้วทำ `/run-review` เพื่อดึง metrics ล่าสุด (ใช้เป็น findings-file ให้ subagent cross-check)

### 2. Dispatch Delivery-Reviewer

> Goal: domain review ทำโดย subagent ที่มี checklist เต็ม

1. เลือก dimensions จาก scope argument — ไม่ระบุ → ทุก dimension ที่ apply (ข้าม dimension ที่ project ไม่มี ตาม criteria ในแต่ละ checklist)
2. Spawn `subagents/delivery-reviewer/AGENT.md` ผ่าน `/use-subagents` ส่ง `scope`, `dimensions`, `findings-file` (baseline จาก step 1)
3. scope ใหญ่/หลาย workspace → spawn หลาย instance ทีละ scope ขนานกัน
4. dedicated deep pass ยัง delegate ตาม Rules: docs→`/review-docs`, dx→`/review-dx`, testing→`/review-test`, config→`/review-config`, perf→`/review-performance`, security→`/review-security`, seo→`/review-seo`, frontend→`/review-frontend`

### 3. Aggregate And Score

> Goal: findings รวมกันพร้อม severity + score ต่อ dimension

1. รวม findings จากทุก instance — dedup ตาม file:line + issue type
2. ทำ `/deep-validate` สำหรับ findings ทุกรายการ
3. จัดลำดับ severity และคำนวณ review score ตาม `subagents/delivery-reviewer/scoring.md`

### 4. Report

> Goal: รายงานครบทุก dimension พร้อม next actions

1. ทำ `/report` — ตาราง No./Dimension/Severity/File/Finding/Suggestion + score ต่อ dimension และ overall
2. ทำ `/suggest-next-action`

### Subskills

> Goal: dispatch focused pass ไปยัง subskill เมื่อ user ต้องการเจาะ dimension เดียวของ delivery-unique scope

| Topic | Subskill |
|-------|----------|
| `ci-cd`, `pipeline`, `ci` — build times, caching, parallelism, workflow security | `subskills/check-ci-cd/SKILL.md` |
| `infra`, `infrastructure`, `docker` — containers, environments, deploy surface | `subskills/check-infra/SKILL.md` |
| `efficiency`, `build` — build/dev-loop efficiency, tooling overhead | `subskills/check-efficiency/SKILL.md` |
| `ops`, `logging`, `versioning` — logging/debugging, versioning, PR process, analytics | `subskills/check-ops/SKILL.md` |

### Subagents

> Goal: dispatch งานที่ต้องทำซ้ำหลาย section/scope ไปยัง subagent

| Topic | Subagent |
|-------|----------|
| `routes`, `all-routes`, `routes-status` — route coverage/status เทียบ expected set ต่อ site section | `subagents/route-checker.md` |
| delivery dimensions — full checklist review พร้อม severity | `subagents/delivery-reviewer/AGENT.md` |

## Check: All Routes
ทำตาม [subagents/delivery-reviewer/check-all-routes.md](subagents/delivery-reviewer/check-all-routes.md)

## Check: Routes Status
ทำตาม [subagents/delivery-reviewer/check-routes-status.md](subagents/delivery-reviewer/check-routes-status.md)

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `all-routes` | `## Check: All Routes` |
| `routes-status` | `## Check: Routes Status` |

## Rules

- ข้าม dimension ใด ถ้า project ไม่มี — ดู criteria ในแต่ละ checklist file
- ทุก finding ต้องมี file path และ line number (delivery)
- ใช้ tools สำหรับ verification ไม่เดา
- ทำ review เท่านั้น ไม่แก้ไข code หรือ config ระหว่าง review
- คำนวณ score เป็น percentage (0-100) ตาม `subagents/delivery-reviewer/scoring.md` แล้วเปรียบเทียบ before/after
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (delivery)
- ใช้ `/report` สำหรับรายงาน findings, score, actions
- ห้าม duplicate checklist detail ใน SKILL.md — canonical อยู่ที่ `subagents/delivery-reviewer/` เท่านั้น

- checklist files ใน `subagents/delivery-reviewer/` ใช้เป็น checklist เบาเท่านั้น — domain deep-dive ให้ delegate: docs→`/review-docs`, dx→`/review-dx`, testing→`/review-test`, config→`/review-config`, perf→`/review-performance`, security→`/review-security`, seo→`/review-seo`, frontend→`/review-frontend`, quality→`/review-code-quality`
- delivery-unique dims (ci-cd, infrastructure, efficiency, versioning, logging-debugging, pr-review, analytics, containerization) review ใน skill นี้โดยตรงผ่าน `delivery-reviewer` subagent

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

- [Full-dimension checklist](subagents/delivery-reviewer/checklist.md)
- [CI/CD pipeline](subagents/delivery-reviewer/ci-cd.md)
- [Infrastructure](subagents/delivery-reviewer/infrastructure.md)
- [Build efficiency](subagents/delivery-reviewer/efficiency.md)
- [Versioning](subagents/delivery-reviewer/versioning.md)
- [Logging and debugging](subagents/delivery-reviewer/logging-debugging.md)
- [PR review](subagents/delivery-reviewer/pr-review.md)
- [Analytics](subagents/delivery-reviewer/analytics.md)
- [Scoring](subagents/delivery-reviewer/scoring.md)
- ใช้ /run-watch ถ้าจำเป็น

## Expected Outcome

- ตาราง aggregate findings จากทุก delivery section
- รายงาน recommended actions พร้อม priority (delivery)
- Review score ต่อ dimension และ overall score
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
