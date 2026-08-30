---
name: follow-review
description: เลือกและ execute review skill(s) ที่เหมาะสมกับ context
related:
  - review
  - review-and-fix
  - review-app-usage
  - review-architecture
  - review-backend
  - review-business
  - review-by-stakeholder
  - review-codebase-everything
  - review-compliance
  - review-consistency
  - review-content-coverage
  - review-correctness
  - review-delivery
  - review-deploy
  - review-devin-global-skills
  - review-devin-global-subagents
  - review-diff
  - review-docs
  - review-features
  - review-frontend
  - review-gaps
  - review-github-issue
  - review-github-pr
  - review-implement
  - review-issue
  - review-migration
  - review-naming
  - review-observability
  - review-performance
  - review-platform
  - review-plan
  - review-quality
  - review-readability
  - review-readme-md
  - review-realize-implementation
  - review-redundancy
  - review-refactor
  - review-references
  - review-release
  - review-rules
  - review-security
  - review-seo
  - review-stability
  - review-techstack
  - review-test
  - review-update
  - review-usage-md
  - review-uxui
  - review-workflow
  - review-workspace
  - review-writing
  - follow-deep
  - follow-parallel
  - scan-codebase
  - report
  - report-table
  - suggest-next-action
  - deep-validate
---

## Goal

เลือกและ execute `review-*` skill(s) ที่เหมาะสมกับ context ปัจจุบัน โดยพิจารณาทั้ง target object, user intent, workspace type, และ risk level พร้อมรองรับ parallel execution

## Scope

ใช้เมื่อ user ต้องการ review แต่ยังไม่รู้จะใช้ review- skill ใด หรือต้องการให้ระบบเลือก/จัดลำดับ/execute review skills ให้ รองรับ code, docs, plan, GitHub, devin skills, release, delivery, และ cross-dimensional review

## Execute

### 1. Detect Review Context

> Goal: รู้ว่าควร review อะไรและเน้นด้านใด

1. ตรวจ workspace files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `AGENTS.md`, `README.md`, `git status`
2. ถ้ามี `apps/`, `src/`, `packages/` → น่าจะเป็น project code
3. ถ้าเป็น `.md`, `.kdl`, `USAGE.md`, `FEATURES.md` → น่าจะเป็น docs
4. ถ้า workspace อยู่ใน `%APPDATA%\devin\skills` หรือมี `.devin/skills/` → น่าจะเป็น devin skills
5. ถ้า user ระบุ issue/PR number หรือ `github` → น่าจะเป็น GitHub
6. ถ้ามี git diff หรือ `git diff` ใน scope → อาจใช้ `/review-diff`
7. สอบถาม user ถ้า context ยังไม่ชัด

### 2. Select Review Skills

> Goal: เลือก review skill(s) ที่ตรงกับ context มากที่สุด

ใช้ตารางด้านล่างเพื่อ map context ไปยัง review skill หลัก (primary) และ review skill รอง (secondary) ถ้ามี:

| No. | Context / User Intent | Primary Skill | Secondary Skills |
|-----|----------------------|---------------|------------------|
| 1 | ต้องการ review โค้ดทั้งหมด / ไม่รู้จะเริ่มตรงไหน | `/review-codebase-everything` | `/review-quality`, `/review-correctness` |
| 2 | เน้น code quality, bug-prone patterns, smells | `/review-quality` | `/review-correctness`, `/review-naming` |
| 3 | เน้น logic, types, edge cases, contracts, tests | `/review-correctness` | `/review-quality`, `/review-test` |
| 4 | เน้น security | `/review-security` | `/review-compliance`, `/review-delivery` |
| 5 | เน้น performance | `/review-performance` | `/review-frontend`, `/review-backend` |
| 6 | เน้น frontend code (React/Vue/Solid/Svelte/Angular) | `/review-frontend` | `/review-uxui`, `/review-platform` |
| 7 | เน้น backend (API, service, database, data flow) | `/review-backend` | `/review-performance`, `/review-security` |
| 8 | เน้น architecture, modularity, boundaries | `/review-architecture` | `/review-quality`, `/review-techstack` |
| 9 | เน้น UX/UI, design system, accessibility | `/review-uxui` | `/review-platform`, `/review-frontend` |
| 10 | เน้น platform (mobile, desktop, CLI, SSR, i18n, SEO) | `/review-platform` | `/review-frontend`, `/review-uxui` |
| 11 | เน้น business logic (payment, subscription, multi-tenancy, feature flags, realtime, email) | `/review-business` | `/review-security`, `/review-correctness` |
| 12 | เน้น tech stack / dependencies / library design | `/review-techstack` | `/review-security`, `/review-quality` |
| 13 | เน้น stability, error handling, debuggability | `/review-stability` | `/review-performance`, `/review-observability` |
| 14 | เน้น observability (metrics, tracing, logging, alerting) | `/review-observability` | `/review-stability`, `/review-delivery` |
| 15 | เน้น compliance (GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA) | `/review-compliance` | `/review-security`, `/review-delivery` |
| 16 | เน้น delivery (docs, DX, CI/CD, infra, performance, security) | `/review-delivery` | `/review-performance`, `/review-security` |
| 17 | ตรวจความพร้อมก่อน deploy | `/review-deploy` | `/review-delivery`, `/review-release` |
| 18 | ตรวจความพร้อมก่อน release | `/review-release` | `/review-delivery`, `/review-techstack` |
| 19 | ตรวจ `.devin/rules`, ast-grep rules, `AGENTS.md` | `/review-rules` | `/review-consistency`, `/review-references` |
| 20 | ตรวจ docs structure ก่อน `update-docs` | `/review-docs` | `/review-content-coverage` |
| 21 | ตรวจ `README.md` ก่อน `update-readme-md` | `/review-readme-md` | `/review-docs` |
| 22 | ตรวจ `FEATURES.md` ก่อน `update-features-md` | `/review-features` | `/review-content-coverage` |
| 23 | ตรวจ `USAGE.md` / `usage.kdl` | `/review-usage-md` หรือ `/review-app-usage` | `/review-docs` |
| 24 | ตรวจ content coverage ครบทุก features/API | `/review-content-coverage` | `/review-features` |
| 25 | ตรวจ naming conventions | `/review-naming` | `/review-readability`, `/review-quality` |
| 26 | ตรวจ readability | `/review-readability` | `/review-quality` |
| 27 | ตรวจ redundancy / duplication ใน skills หรือ code | `/review-redundancy` | `/review-quality`, `/review-consistency` |
| 28 | ตรวจ consistency ข้าม skills / code | `/review-consistency` | `/review-references` |
| 29 | ตรวจ references ระหว่าง skills และ `AGENTS.md` | `/review-references` | `/review-consistency` |
| 30 | ตรวจ git diff ก่อน keep/revert | `/review-diff` | `/review-quality` |
| 31 | ตรวจ drift ก่อน update | `/review-update` | `/review-quality` |
| 32 | ตรวจ migration plan ก่อนลงมือ | `/review-migration` | `/review-risk` |
| 33 | ตรวจก่อน refactor | `/review-refactor` | `/review-architecture`, `/review-quality` |
| 34 | ตรวจ implementation readiness | `/review-implement` | `/review-plan`, `/review-quality` |
| 35 | ตรวจ implementation completeness | `/review-realize-implementation` | `/review-correctness`, `/review-uxui` |
| 36 | รวม findings จาก dimensional reviews | `/review-gaps` | `/review-quality` |
| 37 | ต้องการ multi-stakeholder / roleplay review | `/review-by-stakeholder` | `/review-gaps` |
| 38 | ตรวจ GitHub issue | `/review-github-issue` | `/review-issue` |
| 39 | ตรวจ GitHub PR | `/review-github-pr` | `/review-diff`, `/review-quality` |
| 40 | ตรวจ issue ทั่วไป | `/review-issue` | `/review-plan` |
| 41 | ตรวจ devin global skills repo | `/review-devin-global-skills` | `/review-consistency`, `/review-redundancy` |
| 42 | ตรวจ devin global subagents | `/review-devin-global-subagents` | `/review-references` |
| 43 | ตรวจแล้วแก้ไขตาม context | `/review-and-fix` | `/review-quality` |

1. ถ้า user ระบุ review skill เฉพาะ → ใช้ skill นั้นเป็นหลัก แล้วดู secondary จากตาราง
2. ถ้ามีหลาย context ที่ชัดเจน → เลือก primary ทั้งหมดที่เกี่ยวข้อง
3. ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้ว `/report-before` แล้วถาม user ก่อนเลือก

### 3. Execute Selected Skills

> Goal: รัน review skill(s) ที่เลือกอย่างมีประสิทธิภาพ

1. ถ้ามี skill เดียว → เรียก skill นั้นโดยตรง
2. ถ้ามีหลาย skills และ independent → ใช้ `/follow-parallel` รัน parallel (จำกัดไม่เกิน 10 ต่อ batch)
3. ถ้ามี dependency เช่น `/review-plan` ก่อน `/review-implement` → รันตามลำดับ
4. ถ้า skill ต้องการ scan ลึก → ทำ `/deep-analyze` หรือ `/review-codebase-everything` ก่อน
5. บันทึก output และ findings จากแต่ละ skill

### 4. Validate And Aggregate

> Goal: รวมผลและตรวจสอบความถูกต้อง

1. ทำ `/deep-validate` เพื่อ validate findings จากทุก review skill
2. กรอง false positives และ duplicate findings
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low → Info
4. ถ้ามี conflicts ระหว่าง findings จาก skills ต่างกัน → ทำ `/rethink` แล้วสรุป

### 5. Report And Suggest Next Action

> Goal: สรุปผล review และแนะนำทางต่อ

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Review Skills Used, Findings Count, Severity Breakdown, Review Score
3. ระบุ skill ถัดไปที่ควรทำ เช่น `/review-and-fix`, `/resolve-errors`, `/deep-validate`, หรือ `/ship`
4. ทำ `/suggest-next-action`

## Rules

### 1. Context First
- ไม่เดาหาก context ไม่ชัด
- ถาม user ก่อนเลือก review skill ถ้าจำเป็น
- ใช้ `/scan-codebase` และ `/report-before` เพื่อช่วยตัดสินใจ

### 2. Skill Selection
- เลือก skill ตาม target object และ user intent ไม่ใช่แค่ชื่อ file
- หลีกเลี่ยงการเลือก review skills ที่ซ้ำซ้อนในขอบเขตเดียวกัน
- สามารถเลือกหลาย skills ถ้า task มีหลาย context

### 3. Parallel Execution
- ใช้ `/follow-parallel` เมื่อ review skills ที่เลือกเป็น independent
- จำกัด parallel ไม่เกิน 10 ต่อ batch
- ถ้ามี dependency ต้องรันตามลำดับ

### 4. Evidence-Based
- ทุก finding ต้องมี file, line, หรือ reference
- ไม่สรุป finding โดยไม่มี evidence

### 5. No Duplication
- ไม่เรียก `/review` และ `/follow-review` ซ้อนกัน
- ถ้า `/review` ถูกใช้แล้ว ไม่ต้องใช้ `/follow-review` ในทันทีต่อกัน
- `/follow-review` เน้นการเลือกหลาย review skills และ parallel execution

### 6. Formatting
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`
- ทุก report table ต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก

## Expected Outcome

- รู้ว่า review อะไรและใช้ review skill ใด
- `review-*` skill(s) ที่เหมาะสมถูกเลือกและ execute
- ไม่เรียก skills ที่ไม่เกี่ยวข้อง
- Findings ถูก validate, กรอง false positives, และรวมเป็น report
- รู้ skill ถัดไปที่ควรทำ
