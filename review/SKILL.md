---
name: review
description: เลือกและ execute review skill(s) ที่เหมาะสมกับ context รองรับ parallel multi-dimension
argument-hint: "[topic-or-goal]"
related:
  - deep-review
  - review-devin-global-harness
  - check-repo-hygiene
  - review-gaps
  - review-issue
  - deep-review-then-fix
  - follow-parallel
  - report
  - suggest-next-action
  - run-review
---

## Goal

เลือกและ execute `review-*` skill(s) ที่เหมาะสมกับ context ปัจจุบัน โดยพิจารณาทั้ง target object, user intent, workspace type และ risk level พร้อมรองรับ parallel execution

รวม capability จาก skills เดิมที่ถูก merge เข้าตัวนี้ (merged from: follow-review)

## Scope

ใช้เมื่อ user ต้องการ review แต่ยังไม่รู้จะใช้ review-* skill ใด หรือต้องการให้ระบบเลือก/จัดลำดับ/execute review skills ให้ รองรับ code, docs, plan, GitHub, devin skills, release, delivery และ cross-dimensional review

## Execute

### 1. Detect Review Context

> Goal: รู้ว่าควร review อะไรและเน้นด้านใด

1. ตรวจ workspace files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `AGENTS.md`, `README.md`, `git status`
2. ถ้ามี `apps/`, `src/`, `packages/` → น่าจะเป็น project code
3. ถ้าเป็น `.md`, `.kdl`, `USAGE.md`, `FEATURES.md` → น่าจะเป็น docs
4. ถ้า workspace อยู่ใน `%APPDATA%\devin\skills` หรือมี `.devin/skills/` → น่าจะเป็น devin skills
5. ถ้า user ระบุ issue/PR number หรือ `github` → น่าจะเป็น GitHub
6. ถ้ามี git diff หรือ `git diff` ใน scope → อาจใช้ `/deep-review diff`
7. สอบถาม user ถ้า context ยังไม่ชัด

### 2. Select Review Skills

> Goal: เลือก review skill(s) ที่ตรงกับ context มากที่สุด

ใช้ตารางด้านล่างเพื่อ map context ไปยัง review skill หลัก (primary) และ review skill รอง (secondary) ถ้ามี:

| No. | Context / User Intent | Primary Skill | Secondary Skills |
|-----|----------------------|---------------|------------------|
| 1 | ต้องการ review โค้ดทั้งหมด / ไม่รู้จะเริ่มตรงไหน | `/deep-review` | `/deep-review quality` |
| 2 | เน้น code quality, bug-prone patterns, smells | `/deep-review quality` | `/deep-review writing` |
| 3 | เน้น logic, types, edge cases, contracts, tests | `/deep-review quality` | `/deep-review test` |
| 4 | เน้น security | `/deep-review security` | `/deep-review compliance`, `/deep-review delivery` |
| 5 | เน้น performance | `/deep-review performance` | `/deep-review frontend`, `/deep-review backend` |
| 6 | เน้น frontend code (React/Vue/Solid/Svelte/Angular) | `/deep-review frontend` | `/deep-review uxui`, `/deep-review` |
| 7 | เน้น backend (API, service, database, data flow) | `/deep-review backend` | `/deep-review performance`, `/deep-review security` |
| 8 | เน้น architecture, modularity, boundaries | `/deep-review architecture` | `/deep-review quality`, `/deep-review dependencies` |
| 9 | เน้น UX/UI, design system, accessibility | `/deep-review uxui` | `/deep-review`, `/deep-review frontend` |
| 10 | เน้น platform (mobile, desktop, CLI, SSR, i18n, SEO) | `/deep-review` | `/deep-review frontend`, `/deep-review uxui` |
| 11 | เน้น business logic (payment, subscription, multi-tenancy, feature flags, realtime, email) | `/deep-review business` | `/deep-review security`, `/deep-review quality` |
| 12 | เน้น tech stack / dependencies / library design | `/deep-review techstack` | `/deep-review dependencies`, `/deep-review security` |
| 13 | เน้น stability, error handling, debuggability | `/deep-review stability` | `/deep-review performance`, `/deep-review observability` |
| 14 | เน้น observability (metrics, tracing, logging, alerting) | `/deep-review observability` | `/deep-review stability`, `/deep-review delivery` |
| 15 | เน้น compliance (GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA) | `/deep-review compliance` | `/deep-review security`, `/deep-review delivery` |
| 16 | เน้น delivery (docs, DX, CI/CD, infra, performance, security) | `/deep-review delivery` | `/deep-review performance`, `/deep-review security` |
| 17 | ตรวจความพร้อมก่อน deploy | `/deep-review release` | `/deep-review delivery`, `/watch-deploy` |
| 18 | ตรวจความพร้อมก่อน release | `/deep-review release` | `/deep-review delivery`, `/deep-review dependencies` |
| 19 | ตรวจ `.devin/rules`, ast-grep rules, `AGENTS.md` | `/deep-review dot-devin` | `/deep-review quality`, `/review-devin-global-harness` |
| 20 | ตรวจ docs structure ก่อน `update-docs` | `/deep-review docs` | `/deep-review writing` |
| 21 | ตรวจ `README.md` ก่อน `update-docs readme-md` | `/deep-review docs` | `/deep-review writing` |
| 22 | ตรวจ `FEATURES.md` ก่อน `update-docs features-md` | `/deep-review docs` | `/deep-review writing` |
| 23 | ตรวจ `USAGE.md` / `usage.kdl` | `/deep-review docs` | `/deep-review writing` |
| 24 | ตรวจ content coverage ครบทุก features/API | `/deep-review docs` | `/deep-review writing` |
| 25 | ตรวจ naming conventions | `/deep-review quality` | `/deep-review writing` |
| 26 | ตรวจ readability | `/deep-review writing` | `/deep-review quality` |
| 27 | ตรวจ redundancy / duplication / สิ่งที่ไม่จำเป็น ใน skills หรือ code | `/review-redundancy` | `/deep-review`, `/check-repo-hygiene unused` |
| 28 | ตรวจ consistency ข้าม skills / code | `/review-alignment` | `/deep-review quality` |
| 29 | ตรวจ references ระหว่าง skills และ `AGENTS.md` | `/review-alignment` | `/review-devin-global-harness` |
| 30 | ตรวจ git diff ก่อน keep/revert | `/deep-review diff` | `/deep-review quality` |
| 31 | ตรวจ drift ก่อน update | `/deep-review update` | `/deep-review quality` |
| 32 | ตรวจ migration plan ก่อนลงมือ | `/deep-review migration` | `/deep-review risk` |
| 33 | ตรวจก่อน refactor | `/review-refactor` | `/deep-review architecture`, `/deep-review quality` |
| 34 | ตรวจ implementation readiness | `/deep-review implement` | `/deep-review plan`, `/deep-review quality` |
| 35 | ตรวจ implementation completeness | `/deep-review implement` | `/deep-review quality`, `/deep-review uxui` |
| 36 | รวม findings จาก dimensional reviews | `/review-gaps` | `/deep-review quality` |
| 37 | ต้องการ multi-stakeholder / roleplay review | `/deep-review by-stakeholder` | `/review-gaps` |
| 38 | ตรวจ GitHub issue | `/deep-review issue` | `/deep-review github-pr` |
| 39 | ตรวจ GitHub PR | `/deep-review github-pr` | `/deep-review diff`, `/deep-review quality` |
| 40 | ตรวจ issue ทั่วไป | `/deep-review issue` | `/deep-review plan` |
| 41 | ตรวจ devin global skills repo | `/review-devin-global-harness` | `/deep-review quality` |
| 42 | ตรวจ devin global subagents | `/update-devin-global-subagents` | `/review-devin-global-harness` |
| 43 | ตรวจแล้วค่อย fix ตาม context | `/deep-review-then-fix` | `/deep-review quality` |
| 44 | ตรวจ dead code / unused files / unused deps ใน code | `/check-repo-hygiene unused` | `/review-devin-global-harness`, `/deep-review quality` |
| 45 | เน้น DX — dev loop speed, onboarding, error messages | `/deep-review dx` | `/deep-review delivery`, `/deep-review docs` |
| 46 | เน้น desktop app (Tauri/Electron) — window, tray, IPC, packaging | `/deep-review desktop-app` | `/deep-review security`, `/deep-review performance` |
| 47 | เน้น browser extension — manifest, permissions, content scripts | `/deep-review browser-ext` | `/deep-review frontend`, `/deep-review security` |
| 48 | เน้น IaC — Terraform/Pulumi/CDK/K8s, state, secrets, drift | `/deep-review iac` | `/deep-review security`, `/deep-review cost` |
| 49 | เน้น SDK/library public surface — exports, semver, types | `/deep-review sdk` | `/deep-review api`, `/deep-review techstack` |
| 50 | เน้น usage surface — API/CLI/web parity กับ docs (refresh `/update-usage-md` ก่อน) | `/deep-review usage` | `/deep-review docs`, `/deep-review cli`, `/deep-review api` |

1. ถ้า user ระบุ review skill เฉพาะ → ใช้ skill นั้นเป็นหลัก แล้วดู secondary จากตาราง
2. ถ้ามีหลาย context ที่ชัดเจน → เลือก primary ทั้งหมดที่เกี่ยวข้อง
3. ถ้า context ไม่ชัด → ทำ `/scan-codebase` แล้ว `/report` แล้วถาม user ก่อนเลือก

### 3. Execute Selected Skills

> Goal: รัน review skill(s) ที่เลือกอย่างมีประสิทธิภาพ

1. ถ้ามี skill เดียว → เรียก skill นั้นโดยตรง
2. ถ้ามีหลาย skills และ independent → ใช้ `/follow-parallel` รัน parallel (จำกัดไม่เกิน 10 ต่อ batch)
3. ถ้ามี dependency เช่น `/deep-review plan` ก่อน `/deep-review implement` → รันตามลำดับ
4. ถ้า skill ต้องการ scan ลึก → ทำ `/deep-analyze` หรือ `/deep-review` ก่อน
5. บันทึก output และ findings จากแต่ละ skill

### 4. Validate And Aggregate

> Goal: รวมผลและตรวจสอบความถูกต้อง

1. ทำ `/deep-validate` เพื่อ validate findings จากทุก review skill
2. กรอง false positives และ duplicate findings
3. จัดลำดับ findings ตาม severity: Critical → High → Medium → Low → Info
4. ถ้ามี conflicts ระหว่าง findings จาก skills ต่างกัน → ทำ `/rethink` แล้วสรุป

### 5. Report And Suggest Next Action

> Goal: สรุปผล review และแนะนำทางต่อ

1. ทำ `/report`
2. สร้างตาราง Review Skills Used, Findings Count, Severity Breakdown, Review Score
3. ระบุ skill ถัดไปที่ควรทำ เช่น `/deep-review-then-fix`, `/resolve-errors`, `/deep-validate`, หรือ `/ship`
4. ทำ `/suggest-next-action`

## Rules

### 1. Context First
- ไม่เดาหาก context ไม่ชัด
- ถาม user ก่อนเลือก review skill ถ้าจำเป็น
- ใช้ `/scan-codebase` และ `/report` เพื่อช่วยตัดสินใจ

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
- ไม่แก้ไขหรือ implement fixes — รายงาน findings เท่านั้น ส่งต่อไป section `## Fix` ของ `review-*` ที่ตรง domain หรือ `/fix`

### 5. No Duplication
- `/review` คือ canonical entry สำหรับ routing — ไม่เรียกซ้อนกับ router อื่น
- ถ้า `/review` ทำงานอยู่แล้ว ไม่ต้องเรียกซ้ำ

### 6. Formatting
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis (review)
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report`
- ทุก report table ต้องมีคอลัมน์ `No.` เป็นคอลัมน์แรก

- ใช้ /deep-review seo ถ้าจำเป็น
- ใช้ /deep-review workflow ถ้าจำเป็น
- ใช้ /deep-review workspace ถ้าจำเป็น
- ใช้ /deep-review writing ถ้าจำเป็น
- ใช้ /follow-deep ถ้าจำเป็น

## Metrics

- ดู metrics สำหรับ review ใน [references/scoring.md](references/scoring.md) (review)

## References

- [Full-dimension checklist](references/checklist.md)
- `review-*` dispatch catalog ครบทุกตัว (per-workspace phases): `deep-review/references/review-skills.md`
- ใช้ /run-review ถ้าจำเป็น

## Expected Outcome

- รู้ว่า review อะไรและใช้ review skill ใด
- `review-*` skill(s) ที่เหมาะสมถูกเลือกและ execute
- ไม่เรียก skills ที่ไม่เกี่ยวข้อง
- Findings ถูก validate, กรอง false positives, และรวมเป็น report
- รู้ skill ถัดไปที่ควรทำ
