---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม context — SRP, boundaries, style, consistency
argument-hint: "[@files... | scope | clean | layered | orm | structure]"
related:
  - refactor-skills
  - simplify
  - refactor-workspace
  - refactor-to-packages-shared
  - no-hard-code
  - no-use-ignore
  - update-references
  - update-agents-md
  - update-config
  - update-tests
  - run-verify
  - check-code-structure
  - review-code-quality
  - check-long-files
  - resolve-errors
  - dont-over-engineer
  - follow-single-of-source
  - follow-reusable
  - follow-my-techstack
  - use-lib-effective
  - review-architecture
  - review-database
  - deep-review
  - deep-validate
  - check-files
  - relocation
  - scan-codebase
  - follow-review
  - run-check
  - edit-by-astgrep
  - migration-by-astgrep
  - use-subagents

---

## Goal

Refactor ตาม context โดยเลือก scope ที่เหมาะสม: ไฟล์, workspace, codebase หรือ SRP แล้วดำเนินการจนผ่าน verify

## Scope

- ถ้า user ระบุ `@files...` → refactor เฉพาะไฟล์ โดยลงลึกถึง SRP/naming/structure
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้า context คือจัด architecture ตาม directory (`packages/`/`crates/` = clean, `apps/` = layered) → ทำ architecture refactor — เลือก pattern ตาม target table ใน step 5
- ถ้า context คือ extract shared code ไป `packages/shared` (duplication ข้าม packages) → ใช้ `/refactor-to-packages-shared`
- ถ้า context คือ restructure data access เป็น ORM (raw SQL, scattered queries, N+1) → ทำ data access refactor ตาม `references/orm.md` + `references/repository-pattern.md`
- ถ้า context คือ physical structure (naming, file split, content separation, relocation, barrel exports) → ทำ structure refactor ตาม `references/scope-structure.md`
- ถ้า context คือรวม/ซิงค์ tool configs และ dependency catalogs ข้าม workspaces → ใช้ `/update-config`
- ถ้า context คือลบ hardcoded values (secrets, URLs, magic strings/numbers) → ใช้ `/no-hard-code`
- ถ้า context คือลบ ignore/suppression comments (`@ts-ignore`, `eslint-disable`, `biome-ignore`, `# noqa`, `//nolint` และ ecosystem อื่น) → ใช้ `/no-use-ignore`
- ถ้า context คือทำไฟล์สั้น/อ่านง่ายขึ้นโดยไม่เปลี่ยน boundaries (verbosity, redundancy, nesting) → ใช้ `/simplify`
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ทำ SRP refactor
- ถ้าต้องการ refactor ทั้ง codebase → ทำ codebase refactor ตาม `references/scope-codebase.md` (deep procedure: baseline → impact → batches → validation)
- ถ้า context คือเตรียมเพิ่ม feature → preparatory refactor ("make the change easy, then make the easy change") — refactor แยก commit ก่อน feature เสมอ
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`
- mechanical refactor หลายไฟล์ (rename/pattern/batch transform) → ใช้ `/edit-by-astgrep` (dry-run + confirm ก่อนเขียนทับเสมอ); migration ทั้ง codebase ด้วย rule file → `/migration-by-astgrep`

## Execute

### 1. Detect Scope

> Goal: ระบุ scope ของ refactoring

1. ทำ `/follow-review` ก่อน refactor เสมอ — เลือกและรัน `review-*` ที่ตรง context ก่อนลงมือ
2. ถ้ามี `@files...` → file refactor
3. ถ้าไม่มี `@files` แต่ context เป็น monorepo/workspace → workspace refactor
4. ถ้า project มีไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → SRP refactor
5. ถ้าไม่มี scope ชัดเจน → หา hotspots ด้วย evidence ก่อนเลือก target: `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` (churn สูง × complexity สูง = คุ้มสุด)
6. เก็บ evidence ด้วย check skills ก่อนเลือก target — `/check-long-files` (ไฟล์เกิน 250 บรรทัด), `/check-code-structure` (file-level symbols/exports), `/review-code-quality` (SRP counts, function metrics) — ใช้ findings เป็น baseline และเลือก target ที่ severity สูงสุด
7. ถ้า scope กว้างหรือต้อง evidence เยอะ → spawn `subagents/hotspot-scout.md` (read-only) เก็บ baseline แทนการสแกนเอง แล้วใช้ prioritized target table ที่คืนมาเลือก target
8. ถ้าต้องการ refactor ทั้ง codebase หรือไม่มี files/workspace context → codebase refactor
9. ถ้า argument/context เป็น `clean`, `layered` หรือ architecture restructure ของ package/app → architecture refactor
10. ถ้า argument/context เป็น `orm` หรือ data access restructure → data access refactor
11. ถ้า argument/context เป็น `structure` หรือ physical file/folder restructure → structure refactor
12. ถ้า user บอกว่าต้องการย้ายไฟล์ → ใช้ `/relocation`

### 2. File Refactor

> Goal: แก้ไขไฟล์ที่ระบุ

ทำตาม [references/scope-file.md](references/scope-file.md)

### 3. Workspace Refactor

> Goal: จัดระเบียบ workspace หรือ monorepo

ทำตาม [references/scope-workspace.md](references/scope-workspace.md)

### 4. Codebase And SRP Refactor

> Goal: แก้ไขปัญหา SRP, long files, consistency ทั้ง codebase ด้วย baseline, impact analysis, incremental batches

ทำตาม [references/scope-codebase.md](references/scope-codebase.md)

### 5. Architecture Refactor

> Goal: apply architecture pattern ให้ target — `packages/`/`crates/` = Clean, `apps/` = Layered

| Target | Pattern |
|--------|---------|
| `packages/*`, `crates/*` (shared libs, domain packages) | Clean → `references/architecture-clean.md` |
| `apps/*` (web, mobile, api entry points) | Layered → `references/architecture-layered.md` |
| directory อื่นหรือไม่ใช่ monorepo | เลือกตามลักษณะ code (testability สูง/domain-heavy → clean; UI-driven/CRUD → layered) — ไม่ชัดให้ `/ask-me` |

1. เลือก target+pattern: argument `clean`/`layered` → pattern นั้น; argument เป็น path → map ตามตาราง; ไม่ระบุ → scan root (`packages/`/`crates/` → clean ทุกตัว, `apps/` → layered ทุกตัว; หลายกลุ่ม → ทีละอันตาม severity)
2. Clean Architecture → ทำตาม [references/architecture-clean.md](references/architecture-clean.md)
3. Layered Architecture → ทำตาม [references/architecture-layered.md](references/architecture-layered.md)
4. ทำทีละ target — ห้าม mix pattern ใน target เดียว; หลังแต่ละ target → `/update-references` + `/run-check` ก่อน target ถัดไป
5. Canonical pattern detail อยู่ที่ `/review-architecture` `## Pattern Guides` (SSOT); microservices ไม่ครอบคลุม — อ่าน `### Pattern: Microservices Architecture` ที่นั่นโดยตรง

### 6. Data Access Refactor

> Goal: restructure data access ให้ใช้ ORM type-safe — หนึ่ง ORM ต่อ project

1. ทำตาม [references/orm.md](references/orm.md) — select ORM → models/relations → queries → migrations → tests
2. repository pattern (interfaces, mappers, UnitOfWork, QuerySpec) → ทำตาม [references/repository-pattern.md](references/repository-pattern.md)
3. schema review/migration drift → `/review-database`; boundary validation → `/follow-tool-data-validation`

### 7. Structure Refactor

> Goal: physical file/folder structure ทุกไฟล์มี single responsibility — naming, split, content separation, relocation, imports

ทำตาม [references/scope-structure.md](references/scope-structure.md)

### 8. Update References

> Goal: ไม่มี broken references

1. ทำ `/update-references` สำหรับ relative paths/imports
2. ทำ `/update-references` สำหรับ global references/skills
3. ถ้า structure/paths เปลี่ยน (ย้าย/rename/สร้าง dir ใหม่) → ทำ `/update-agents-md` ให้ AGENTS.md ตรงกับ structure ใหม่
4. ถ้ามี broken references → ทำ `/resolve-errors`

### 9. Verify

> Goal: ตรวจสอบว่า refactor ผ่าน

ทำตาม [references/verify.md](references/verify.md)

### 10. Report

> Goal: สรุปผล

1. ทำ `/report` สรุป sub-skill/scope, การเปลี่ยนแปลง, status
2. ทำ `/report-before-after` ถ้ามี baseline
3. ทำ `/suggest-next-action`

### Subagents

> Goal: dispatch งาน refactor ที่อิสระไปยัง subagent profiles

| Task | Subagent |
|------|----------|
| เก็บ baseline evidence หา refactor targets (read-only) | `subagents/hotspot-scout.md` |
| refactor ไฟล์/scope เดียว — spawn ทีละไฟล์ขนานกันเมื่อมีหลายไฟล์อิสระ | `subagents/file-worker.md` |

1. spawn ผ่าน `/use-subagents` โดยส่ง inputs ตามที่แต่ละ profile กำหนด
2. `hotspot-scout` เป็น read-only — `file-worker` แก้เฉพาะ `files` ที่ได้รับ
3. parent เป็นคน rewire consumers, checkpoint commit และ verify รวมเสมอ

## Rules

Checklist สั้น — detail ฉบับเต็มของแต่ละ rule อยู่ที่ `references/principles.md`

### 1. Preserve Behavior

- ห้าม mix feature/bug fix กับ refactor ใน commit เดียว (Two Hats) — public API/behavior เหมือนเดิมเสมอ

### 2. Safety Net First

- ไม่มี tests → เขียน characterization tests ก่อน (`/update-tests`); tests เขียวก่อนและหลัง

### 3. Small Steps

- ทีละ transformation เดียว → verify green → `/git-commit` checkpoint ทุก batch
- mechanical batch หลายไฟล์ → `/edit-by-astgrep` (dry-run+confirm); rule-file migration → `/migration-by-astgrep`

### 4. Context Aware

- ไม่เดา scope — ไม่ชัดให้ `/ask-me`; ทำทีละ sub-skill ตาม priority

### 5. Minimal Change

- `/dont-over-engineer` + `/follow-reusable` (reuse > extend > extract > create); แก้ root cause ตาม `references/code-smells.md`; ห้าม perf tuning ใน refactor pass
- ก่อนเลือก/เพิ่ม dependency → `/follow-my-techstack` (เทียบ `review-dependencies/references/techstack-catalog.md`) + `/use-lib-effective` (ใช้ dep ที่มีแทน reinvent)

### 6. SRP And Consistency

- ไฟล์ ≤250 บรรทัด (`/check-long-files`); หนึ่ง fact หนึ่ง source (`/follow-single-of-source`); naming/patterns สอดคล้อง
- import paths ใช้ path alias ของ project (เช่น `~/*`) แทน relative paths ที่ซับซ้อน — ห้าม relative import 3+ levels (`../../../`)

### 7. Safety

- ย้าย/ลบ/rename → `/update-references`; destructive → dry run + confirm; ไม่ force push

### 8. Verification

- ผ่าน `/run-verify`; ไม่มี broken references

## Expected Outcome

- Scope ที่เหมาะสมถูกเลือกและดำเนินการ
- ไฟล์/packages มีขนาดเหมาะสม
- imports/exports สะอาด ใช้ alias แทน relative paths ที่ซับซ้อน
- SRP ชัดเจน
- naming, patterns, structure สอดคล้อง
- ผ่าน lint/typecheck/test/build
- รายงาน before/after ครบ
