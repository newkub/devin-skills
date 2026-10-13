---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม context — SRP, boundaries, style, consistency
argument-hint: "[@files... | scope | clean | layered | orm | structure]"
related:
  - refactor-skills
  - refactor-to-srp
  - restructure
  - simplify
  - idea-naming
  - create-plan-in-dot-devin
  - refactor-workspace
  - refactor-to-packages-shared
  - no-hard-code
  - no-use-ignore
  - update-references
  - update-agents-md
  - update-config
  - update-tests
  - improve-tests
  - run-verify
  - check-code-structure
  - deep-review
  - check-long-files
  - resolve-errors
  - dont-over-engineer
  - follow-single-of-source
  - follow-reusable
  - follow-my-techstack
  - use-lib-effective
  - follow-architecture
  - follow-tool-data-validation
  - deep-validate
  - relocation
  - scan-codebase
  - follow-review
  - run-check
  - use-astgrep
  - migration-with-astgrep
  - use-subagents

---

## Goal

Refactor ตาม context โดยเลือก scope ที่เหมาะสม: ไฟล์, workspace, codebase หรือ SRP แล้วดำเนินการจนผ่าน verify

## Scope

- ถ้า user ระบุ `@files...` → refactor เฉพาะไฟล์ โดยลงลึกถึง SRP/naming/structure
- ถ้า context เป็น workspace หรือ monorepo → ใช้ `/refactor-workspace`
- ถ้า context คือจัด architecture ตาม directory หรือเลือก clean/layered → ทำ architecture refactor — selection + dispatch ผ่าน `/follow-architecture` (หลาย apps unified → clean, app เดียว → layered)
- ถ้า context คือไฟล์/โมดูลที่รวมหลาย concerns ปนกัน (UI + logic + IO + config ในที่เดียว) → ทำ `### /separate-of-concerns` (merged)
- ถ้า context คือ extract shared code ไป `packages/shared` (duplication ข้าม packages) → ใช้ `/refactor-to-packages-shared`
- ถ้า context คือ restructure data access เป็น ORM (raw SQL, scattered queries, N+1) → ทำ data access refactor ตาม `references/orm.md` + `references/repository-pattern.md`
- ถ้า context คือ physical structure (naming, file split, content separation, relocation, barrel exports) → ใช้ `/restructure`
- ถ้า context คือรวม/ซิงค์ tool configs และ dependency catalogs ข้าม workspaces → ใช้ `/update-config`
- ถ้า context คือลบ hardcoded values (secrets, URLs, magic strings/numbers) → ใช้ `/no-hard-code`
- ถ้า context คือลบ ignore/suppression comments (`@ts-ignore`, `eslint-disable`, `biome-ignore`, `# noqa`, `//nolint` และ ecosystem อื่น) → ใช้ `/no-use-ignore`
- ถ้า context คือทำไฟล์สั้น/อ่านง่ายขึ้นโดยไม่เปลี่ยน boundaries (verbosity, redundancy, nesting) → ใช้ `/simplify`
- ถ้า context คือ refactor tests (test/spec files เอง — flaky, duplication, shared setup, naming, assertions) → refactor test suite: หา improvements ผ่าน `/improve-tests` แล้ว rewrite specs ผ่าน `/update-tests` — rules เดียวกัน (assertion semantics เหมือนเดิม, green before/after)
- ถ้าไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → ใช้ `/refactor-to-srp`
- ถ้าต้องการ refactor ทั้ง codebase → ทำ codebase refactor ตาม `references/scope-codebase.md` (deep procedure: baseline → impact → batches → validation)
- ถ้า context คือเตรียมเพิ่ม feature → preparatory refactor ("make the change easy, then make the easy change") — refactor แยก commit ก่อน feature เสมอ
- ถ้าต้องการย้ายไฟล์ → ใช้ `/relocation`
- mechanical refactor หลายไฟล์ (rename/pattern/batch transform) → ใช้ `/use-astgrep rewrite` (dry-run + confirm ก่อนเขียนทับเสมอ); migration ทั้ง codebase ด้วย rule file → `/migration-with-astgrep`
- ถ้า context คือ refactor skill packages (`SKILL.md`, `workflows/`, `references/` ของ skills) → ใช้ `/refactor-skills`

## Execute

> Bulk scope: ถ้า scope ครอบคลุมหลายไฟล์/workspace/codebase หรือ user ขอ refactor หลายอย่างในคราวเดียว → ทำ `/create-plan-in-dot-devin` ก่อนเสมอ แล้วค่อย refactor ตาม plan

### 1. Detect Scope

> Goal: ระบุ scope ของ refactoring

1. ทำ `/follow-review` ก่อน refactor เสมอ — เลือกและรัน `review-*` ที่ตรง context ก่อนลงมือ
2. ถ้ามี `@files...` → file refactor
3. ถ้าไม่มี `@files` แต่ context เป็น monorepo/workspace → workspace refactor
4. ถ้า project มีไฟล์/โมดูลยาว >250 บรรทัด หรือมี SRP issues → `/refactor-to-srp`
5. ถ้าไม่มี scope ชัดเจน → หา hotspots ด้วย evidence ก่อนเลือก target: `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` (churn สูง × complexity สูง = คุ้มสุด)
6. เก็บ evidence ด้วย check skills ก่อนเลือก target — `/scan-codebase` (quick overview), `/check-long-files` (ไฟล์เกิน 250 บรรทัด), `/check-code-structure` (file-level symbols/exports), `/deep-review` (SRP counts, function metrics) — ใช้ findings เป็น baseline และเลือก target ที่ severity สูงสุด
7. ถ้า scope กว้างหรือต้อง evidence เยอะ → spawn `hotspot-scout` (read-only — profile อยู่ใน `## Subagents`) เก็บ baseline แทนการสแกนเอง แล้วใช้ prioritized target table ที่คืนมาเลือก target
8. ถ้าต้องการ refactor ทั้ง codebase หรือไม่มี files/workspace context → codebase refactor
9. ถ้า argument/context เป็น `clean`, `layered` หรือ architecture restructure ของ package/app → architecture refactor (dispatch `/follow-architecture`)
10. ถ้า argument/context คือ concerns ปนกันในไฟล์/โมดูล → `### /separate-of-concerns` (merged)
11. ถ้า argument/context เป็น `orm` หรือ data access restructure → data access refactor
12. ถ้า argument/context เป็น `structure` หรือ physical file/folder restructure → `/restructure`
13. ถ้า argument/context เป็น `tests` หรือ refactor test suite → test refactor scope — `/improve-tests` (findings) + `/update-tests` (rewrite specs)
14. ถ้า user บอกว่าต้องการย้ายไฟล์ → ใช้ `/relocation`

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

> Goal: apply architecture pattern ให้ target — selection + execution dispatch ผ่าน `/follow-architecture`

1. ทำ `/follow-architecture` กับ target — เลือก pattern ตาม context (หลาย `apps/*` unified → clean; app เดียว/`apps/*` → layered; `packages/`/`crates/` → clean); argument `clean`/`layered` → pattern นั้นโดยตรง
2. Detail procedure ตาม [references/architecture-clean.md](references/architecture-clean.md) / [references/architecture-layered.md](references/architecture-layered.md) เมื่อต้องการรายละเอียดใน refactor context
3. ถ้าเจอ mixed concerns ระหว่าง restructure → ทำ `### /separate-of-concerns` (merged) แยก concern ก่อนจัด layer
4. ทำทีละ target — ห้าม mix pattern ใน target เดียว; หลังแต่ละ target → `/update-references` + `/run-check` ก่อน target ถัดไป
5. Canonical pattern detail อยู่ที่ `/deep-review` `## Pattern Guides` (SSOT); microservices ไม่ครอบคลุม — อ่าน `### Pattern: Microservices Architecture` ที่นั่นโดยตรง

### 6. Data Access Refactor

> Goal: restructure data access ให้ใช้ ORM type-safe — หนึ่ง ORM ต่อ project

1. ทำตาม [references/orm.md](references/orm.md) — select ORM → models/relations → queries → migrations → tests
2. repository pattern (interfaces, mappers, UnitOfWork, QuerySpec) → ทำตาม [references/repository-pattern.md](references/repository-pattern.md)
3. schema review/migration drift → `/deep-review`; boundary validation → `/follow-tool-data-validation`

### 7. Structure Refactor

> Goal: physical file/folder structure ทุกไฟล์มี single responsibility — naming, split, content separation, relocation, imports

ทำตาม `/restructure` — procedure ละเอียด [references/structure.md](references/structure.md)

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

## Rules

Checklist สั้น — detail ฉบับเต็มของแต่ละ rule อยู่ที่ `references/principles.md`

### 1. Preserve Behavior

- ห้าม mix feature/bug fix กับ refactor ใน commit เดียว (Two Hats) — public API/behavior เหมือนเดิมเสมอ

### 2. Safety Net First

- ไม่มี tests → เขียน characterization tests ก่อน (`/update-tests`); tests เขียวก่อนและหลัง

### 3. Small Steps

- ทีละ transformation เดียว → verify green → `/git-commit` checkpoint ทุก batch
- mechanical batch หลายไฟล์ → `/use-astgrep rewrite` (dry-run+confirm); rule-file migration → `/migration-with-astgrep`

### 4. Context Aware

- ไม่เดา scope — ไม่ชัดให้ `/ask-me`; ทำทีละ sub-skill ตาม priority

### 5. Minimal Change

- `/dont-over-engineer` + `/follow-reusable` (reuse > extend > extract > create); แก้ root cause ตาม `references/code-smells.md`; ห้าม perf tuning ใน refactor pass
- ก่อนเลือก/เพิ่ม dependency → `/follow-my-techstack` (เทียบ `deep-review`) + `/use-lib-effective` (ใช้ dep ที่มีแทน reinvent)

### 6. SRP And Consistency

- ไฟล์ ≤250 บรรทัด (`/check-long-files`); หนึ่ง fact หนึ่ง source (`/follow-single-of-source`); naming/patterns สอดคล้อง
- import paths ใช้ path alias ของ project (เช่น `~/*`) แทน relative paths ที่ซับซ้อน — ห้าม relative import 3+ levels (`../../../`)

### 7. Safety And Verification

- ย้าย/ลบ/rename → `/update-references`; destructive → dry run + confirm; ไม่ force push
- ผ่าน `/run-verify`; ไม่มี broken references

### 8. Plan Before Bulk Refactor

- scope ใหญ่ (หลายไฟล์/workspace/codebase) หรือ user ขอหลายอย่างในคราวเดียว → ทำ `/create-plan-in-dot-devin` ก่อนเสมอ — ห้ามเริ่ม refactor ใหญ่โดยไม่มี plan

## Subagents

> Goal: งาน refactor อิสระที่ spawn ทำขนานได้ — profile อยู่ใน section นี้เลย ไม่ต้องมีไฟล์แยก; spawn ผ่าน `/use-subagents` โดยส่ง inputs ตามที่แต่ละ profile กำหนด และ parent เป็นคน rewire consumers, checkpoint commit และ verify รวมเสมอ

### hotspot-scout — เก็บ baseline evidence (churn, long files, SRP issues) หา refactor targets แล้วคืน prioritized list; ใช้เมื่อ parent ต้องการ baseline ก่อนเลือก target โดยไม่แก้ไฟล์ใดๆ

- **Inputs**: `root` = directory เป้าหมายที่ต้องสแกน; `focus` (optional) = domain เช่น `long-files`, `srp`, `naming`, `all` (default `all`); `threshold` (optional) = ความยาวไฟล์ที่นับเป็น long file (default 250)
- **Tools**: `exec` — รัน `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` สำหรับ churn และ CLI checks ที่มี; `read`, `grep`, `find_file_by_name` — นับบรรทัด, หา symbols/exports, ตรวจ patterns
- **Execute**: 1) เก็บ churn evidence: ไฟล์ที่แก้บ่อยสุดจาก git log → 2) เก็บ size evidence: ไฟล์ที่ยาวเกิน `threshold` บรรทัด → 3) เก็บ structure evidence: symbols/exports ต่อไฟล์, mixed concerns, relative imports 3+ levels → 4) รวมเป็น target list — score = churn × severity ของ structural issues
- **Output**: คืน prioritized target table `| No. | File | Churn | Lines | Issues | Priority |` (ตัวอย่าง `1 | src/foo.ts | 45 | 380 | SRP, deep imports | high`); `Priority` = `high`/`medium`/`low` พร้อมเหตุผลสั้น; ปิดท้ายด้วยสรุป total files scanned, targets found, recommended first target
- **Constraints**: model `sonnet`; allowed tools จำกัดที่ `read`/`exec`/`grep`/`find_file_by_name` และ deny `write`/`edit` — read-only ห้ามแก้ไขไฟล์ใดๆ สแกนอย่างเดียว; รายงานเฉพาะไฟล์ที่มี evidence จริง — ห้ามเดา; scope อยู่ใน `root` ที่ parent กำหนดเท่านั้น

### file-worker — refactor ไฟล์/scope เดียวตาม instructions ที่ parent กำหนด แล้วคืน diff summary + verify status; spawn ทีละไฟล์ขนานกันเมื่อมีหลายไฟล์อิสระกัน

- **Inputs**: `files` = ไฟล์หรือ glob scope ที่รับผิดชอบ; `instructions` = transformation ที่ต้องทำ เช่น SRP split, naming, import alias, extract function; `conventions` = style/patterns ของ project ที่ต้องรักษา; `verify-cmd` (optional) = command เร็วๆ ที่รันเช็ค scope นี้ เช่น `tsc --noEmit <file>`
- **Tools**: `read`, `write`, `edit` — แก้ไฟล์ใน scope; `exec` — รัน `verify-cmd` และ formatter/linter ต่อไฟล์ (allow `Exec(tsc *)`, `Exec(eslint *)`, `Exec(sg *)`); `grep` — เช็ค consumers/importers ก่อนเปลี่ยน exports
- **Execute**: 1) อ่านไฟล์ใน `files` และเช็ค importers ของ exports ที่จะเปลี่ยน → 2) apply `instructions` ทีละ transformation — หนึ่งไฟล์ต่อรอบ verify → 3) รัน `verify-cmd` ถ้ามี — fail ให้ revert scope นั้นแล้วรายงาน
- **Output**: คืน per-file result table `| No. | File | Change | Verified | Notes |` (ตัวอย่าง `1 | src/foo.ts | split into 2 modules | ok | —`); `Verified` = `ok`/`failed`/`skipped` พร้อม error ถ้า fail; ปิดท้ายด้วยสรุป files changed, exports changed (ที่ parent ต้อง follow-up `/update-references`), blockers
- **Constraints**: model `sonnet`; preserve behavior เสมอ — ห้าม mix feature/fix; รับผิดชอบเฉพาะ `files` ที่ได้รับ — ห้ามแตะไฟล์นอก `files` หรือข้าม scope ถ้าจำเป็นให้รายงานกลับให้ parent ทำ; exports/API ที่เปลี่ยนต้องรายงานกลับ — parent เป็นคน rewire consumers; ไม่ commit — parent เป็นคน checkpoint

## Merged Details

### /separate-of-concerns (merged)

แยก concerns ที่ปนกันในไฟล์/โมดูลออกตามประเภท — concern types: `presentation` (UI/routes/handlers), `domain` (pure rules), `data` (persistence/queries), `io` (http/queue/external calls), `config` (env/settings), `orchestration` (composition/wiring)

1. Identify: classify แต่ละ block → concern type พร้อม `file:line` evidence; สรุป concern map (block → type → target location)
2. Plan: map concern → location ตาม architecture ของ project — ไม่ชัด layer → `/follow-architecture` ตัดสินก่อน; เรียง extract leaf ก่อน (pure domain → data/io → orchestration ทีหลัง); ระบุ consumers เตรียม `/update-references`
3. Extract ทีละ concern เดียว: move → file/module เป้าหมาย → export ผ่าน barrel → `/update-references` + verify green ก่อน concern ถัดไป — caller เหลือแค่ orchestration
4. Verify: ทุก unit เหลือ concern เดียว + `/run-check` + tests + `/report-before-after` (concern map เดิม vs ใหม่)

Rules: 1 extraction = 1 concern ไม่ mix behavior change; pure logic extractable ก่อนเสมอ; placement ตาม dependency direction; preserve public API

### /refactor-to-srp → `/refactor-to-srp`

Canonical SRP splitter — promoted เป็น top-level skill (`refactor-to-srp/SKILL.md`); smells catalog อยู่ที่ `references/code-smells.md`, parallel file workers อยู่ที่ `## Subagents` (`### file-worker`)

### /restructure → `/restructure`

Canonical structure refactor — promoted เป็น top-level skill (`restructure/SKILL.md`); procedure ละเอียด [references/structure.md](references/structure.md)

## Expected Outcome

- Scope ที่เหมาะสมถูกเลือกและดำเนินการ
- ไฟล์/packages มีขนาดเหมาะสม
- imports/exports สะอาด ใช้ alias แทน relative paths ที่ซับซ้อน
- SRP ชัดเจน
- naming, patterns, structure สอดคล้อง
- ผ่าน lint/typecheck/test/build
- รายงาน before/after ครบ
