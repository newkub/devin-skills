---
name: review-code-quality
description: Review code quality, best practices, correctness, tech debt และ pre-refactor baseline targets
argument-hint: "[scope]"
related:
  - deep-validate
  - scan-codebase
  - deep-analyze
  - run-review
  - deep-review
  - use-astgrep
  - report
  - suggest-next-action
  - review-test
  - review-security
  - review-stability
---

## Goal

Review คุณภาพ code โดยรวม ครอบคลุม code quality, bug-prone patterns, correctness, time complexity, tech debt, และ overall quality score

## Scope

- code, configuration, rule files, workflows, และ skills
- ทบทวนตาม `references/code-quality.md`, `references/bug-prone.md`, `references/correctness.md`, `references/best-practices.md`, `references/consistency.md`, `references/time-complexity.md`, `references/tech-debt.md`, และ `references/scoring.md`
- ไม่รวม naming conventions deep review (identifiers, files, exports) → ใช้ `/review-writing` (`references/naming.md` ใน skill นี้เหลือไว้เป็น checklist เบาสำหรับ code review เท่านั้น)

- ดูเพิ่มเติม: /deep-review

## Execute

### 1. Prepare

> Goal: เข้าใจ project structure, tools, scope

1. ทำ `/scan-codebase`
2. อ่าน `AGENTS.md`
3. ระบุ quality tools: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ถ้า project ไม่มี code ที่ต้อง review → stop และ report

### 2. Code Quality

> Goal: รวบรวม findings ด้าน static analysis, architecture, types, naming, readability, hardcode

ทำตาม `references/code-quality.md`

### 3. Best Practices, Naming, And Consistency

> Goal: ตรวจ best practices, naming, และ consistency

1. ทำตาม `references/best-practices.md` สำหรับ conventions, error handling, testing, security, performance
2. ทำตาม `references/naming.md` สำหรับ identifiers, files, skill names
3. ทำตาม `references/consistency.md` สำหรับ structure, formatting, terminology, references
4. บันทึก findings พร้อม severity และ evidence

### 4. Bug-Prone

> Goal: ระบุรูปแบบโค้ดที่มีแนวโน้มก่อให้เกิด bugs

ทำตาม `references/bug-prone.md`

### 5. Correctness

> Goal: ตรวจสอบ logic correctness, edge cases, และ invariant checks

ทำตาม `references/correctness.md`

### 6. Tech Debt And Complexity

> Goal: รู้ debt และ hotspots ที่ต้อง monitor

1. ทำตาม `references/tech-debt.md` — TODO/FIXME density, deprecated usage, dead code, duplication hotspots
2. ตรวจสอบ time complexity ของ critical paths ทำตาม `references/time-complexity.md`

### 7. Validate

> Goal: Findings ถูกต้อง จัดลำดับชัดเจน ไม่มี false positives

1. ทำ `/deep-validate`
2. จัดลำดับ findings ตาม severity — ตาม `../shared/review-rules.md` Severity Classification
3. ระบุ false positives พร้อมเหตุผล
4. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 3

### 8. Simplify

> Goal: Findings กระชับ อ่านง่าย ไม่มี noise

1. รวม findings ที่ซ้ำกันเป็น single finding พร้อม evidence ทั้งหมด
2. ลบ findings ที่ไม่มีผลต่อ quality จริง (noise, style-only ที่ไม่มี convention)
3. ชี้ไป section `## Fix` เมื่อ user confirm ให้แก้


### Subskills

> Goal: dispatch งานเฉพาะมิติ/รูปแบบไปยัง subskill — check-* read-only focused pass, report-* format findings, อื่นๆ apply fixes เมื่อ user confirm

| Topic | Subskill |
|-------|----------|
| `complexity` — metrics hotspots, duplication, churn | `subskills/check-complexity/SKILL.md` |
| `debt`, `tech-debt` — TODO/deprecated/workaround inventory | `subskills/check-debt/SKILL.md` |
| Apply type findings — strict flags, any→unknown (user confirm) | `subskills/improve-types/SKILL.md` |

## Review Before Refactor

### Goal

Review codebase BEFORE refactor to establish baseline metrics and identify prioritized refactor targets

### Scope

ใช้ก่อนเรียก `refactor`, `refactor-workspace`, `restructure` หรือ `relocation` เพื่อระบุเป้าหมาย refactor ครอบคลุม SRP violations, long files, function quality, imports/exports, package boundaries, code smells, dead code, anti-patterns และ file/folder structure (naming, grouping, barrel exports, nesting, relocation plan) ไม่รวมการ refactor จริง — เป็น review เท่านั้น

### Execute

#### 1. Prepare Context

> Goal: เข้าใจ project structure, tools และ scope ก่อน review

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ tech stack
2. อ่าน `AGENTS.md` เพื่อทราบ tools ที่ใช้ใน project
3. ระบุ quality tools ที่มี: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ถ้าสแกนไม่ได้ → stop และ report

#### 2. Analyze SRP Violations

> Goal: ระบุ units ที่ทำหลายหน้าที่

Detection criteria:

- File-level: top-level symbols >5 ที่ไม่เกี่ยวข้องกัน, symbols จากหลาย domain/layer ปนกัน, internal exports ที่ไม่ควร public, imports ข้าม boundary/layer
- Function-level: ทำหลาย operation (read+write+validate+transform), หลาย reasons to change, body mix หลาย domain
- Class/type-level: public members >10, ทำหลายหน้าที่ (God class), methods จากหลาย domain

Violation patterns: mixed concerns (domain+UI+utils+types ในไฟล์เดียว), cross-layer import (domain→UI, UI→infra), leaky abstraction (internal exports เป็น public API), God class

Detection tools:

- `sg outline --view expanded --items structure <paths>` — top-level symbols
- `sg outline --items imports <paths>` — import boundary crossing
- `sg outline --items exports <paths>` — exported surface
- `sg outline --pub-members <paths>` — public members

Severity:

- Critical: SRP violation ใน critical path, cross-layer import, circular dependency
- High: file >5 top-level symbols ที่ไม่เกี่ยวข้อง, type/class >10 public members
- Medium: file 4-5 top-level symbols, type 6-10 members
- Low: naming ไม่สะท้อน responsibility

#### 3. Analyze Long Files

> Goal: ระบุไฟล์ที่ยาวเกิน threshold

Thresholds: warning 200-250 lines, fail >250 lines, Critical >400 lines; ไม่นับ test/generated/barrel (`index.ts`)/config files

Detection tools:

- `/check-files long-files` — scan ไฟล์เกิน threshold
- `Get-ChildItem -Recurse -File -Include *.ts,*.tsx,*.js,*.jsx` + `Measure-Object -Line`

Split strategies:

- By domain: `user-service.ts` → `user-service.ts` + `user-repository.ts` + `user-validator.ts`
- By responsibility: `auth.ts` → `auth-handler.ts` + `auth-middleware.ts` + `auth-types.ts`
- By layer: `api.ts` → `api-routes.ts` + `api-handler.ts` + `api-schema.ts`
- By type: `utils.ts` → `string-utils.ts` + `date-utils.ts` + `validation-utils.ts`

Effort: low = 1 ไฟล์ split 2-3 ไฟล์ (<30 min), medium = 2-5 ไฟล์ (30-120 min), high = >5 ไฟล์หรือ consumers เยอะ (>120 min)

#### 4. Analyze Function Quality

> Goal: ระบุ functions ที่มี quality issues

Metrics (pass / warning / fail):

- Length: ≤50 / 51-100 / >100 lines (ยกเว้น cohesive setup/init functions)
- Parameters: ≤4 / 5-6 / >6 (เกิน 4 → ใช้ object parameter)
- Nesting depth: ≤3 / 4-5 / >5 (นับ if/for/while/switch ซ้อน)
- Cyclomatic complexity: ≤10 / 11-15 / >15
- Naming: verb prefix (get, set, compute, validate, handle) / generic (`process`, `data`, `temp`, `helper`) / single-letter (ยกเว้น loop index, math)
- Side effects: pure / isolated / หลาย side effects (global state, DOM, file, network, DB)
- Return type: consistent / optional แต่ชัด / multiple return shapes

Detection tools:

- `sg outline --view expanded --type function <paths>` — signatures
- `sg outline --view signatures --type function <paths>` — return types
- `/check-code-structure` — top-level function scan

Severity:

- Critical: function >200 lines, nesting >5, logic เข้าใจผิดง่าย
- High: function >50 lines, params >4, cognitive complexity สูงใน critical path
- Medium: function 30-50 lines, nesting 3-4, redundant comments
- Low: naming ไม่ชัด, missing comment บน minor logic

#### 5. Analyze Imports And Exports

> Goal: ระบุ import/export complexity

Checks (pass / warning / fail):

- Relative imports: ไม่มี `../../../` / `../../` 1-2 ครั้ง / `../../../` หรือลึกกว่า
- Barrel quality: re-exports ล้วน ไม่มี logic/side effects / `export *` จาก module ใหญ่ / มี logic, side effects หรือ import+re-export บรรทัดเดียว
- Circular dependencies: ไม่มี / — / มีใดๆ
- Unused exports: ไม่มี / 1-3 ตัว / >3 ตัว
- Import ordering: external → internal alias → relative → type-only / consistent แต่ไม่ตามลำดับ / inconsistent
- Deep imports: ใช้ barrel เท่านั้น / 1-2 ครั้ง / ข้าม module boundary จำนวนมาก

Detection tools:

- `sg outline --items imports <paths>` / `--items exports <paths>`
- `madge --circular --extensions ts,tsx` — circular deps
- `knip` — unused exports; `biome`/`eslint` — import ordering

Severity: Critical = circular dep, barrel มี side effects; High = `../../../` จำนวนมาก, unused exports จำนวนมาก; Medium = ordering inconsistent, `export *` จาก module ใหญ่; Low = minor ordering

#### 6. Analyze Package Boundaries

> Goal: ระบุ package/module boundary issues

Checks (pass / warning / fail):

- Boundary integrity: ทุก module มี barrel เป็น public API / บาง module ไม่มี barrel / deep imports ข้าม boundary ไม่ผ่าน barrel
- Dependency direction: high-level → low-level เท่านั้น / 1-2 กรณีไม่ชัด / circular หรือ reverse direction
- Coupling: low / moderate / high (เปลี่ยนยาก)
- Cohesion: high (เปลี่ยน+deploy ด้วยกัน) / moderate / low
- Public API surface: internal private + public ชัดผ่าน barrel / มี internal exports หลุด / ไม่มี boundary
- Module size: เหมาะสม / ใหญ่หรือ micro-module / ใหญ่มากหรือ fragmentation สูง

Detection tools: `/scan-codebase`, `sg outline --items imports <paths>`, `madge --circular --extensions ts,tsx`, `/check-code-structure`

Refactor signals: refactor เมื่อหลาย reasons to change, test ยาก, coupling สูง, ไม่ reusable, duplication ข้าม modules; ไม่ refactor เมื่อ SRP ชัด, cohesive สูง, เปลี่ยน/ deploy ด้วยกัน

Severity: Critical = circular dep, cross-layer import, boundary แตก; High = high coupling, low cohesion, ไม่มี public API boundary; Medium = moderate coupling, deep imports บางส่วน; Low = minor boundary inconsistency

#### 7. Analyze Code Smells And Dead Code

> Goal: ระบุ code smells, dead code, anti-patterns

1. ทำ `/deep-review`
2. ทำ code quality review ใน `## Execute` ด้านบน
3. รัน `knip` และ `jscpd` (duplication clusters, copy-paste drift)
4. บันทึก findings

#### 8. Analyze Structure And Relocation

> Goal: ประเมิน structure health และวางแผน relocation — ข้ามถ้า scope ไม่เกี่ยวกับ file/folder moves

##### File Naming

Checks (pass / warning / fail):

- Naming style: `kebab-case` ตาม convention project / บางไฟล์ไม่ตรง / จำนวนมากไม่ตรง
- Name reflects responsibility: ชื่อสะท้อนหน้าที่ / กำกวม (`utils`, `helpers`, `common`, `misc`) / ไม่สะท้อนเลย (`data`, `temp`, `stuff`)
- Consistency: สม่ำเสมอทั้ง project / 1-2 ไฟล์ / inconsistent ทั้ง project
- Prefix/suffix: `*-service.ts`, `*-handler.ts`, `*-types.ts` สม่ำเสมอ / ไม่สม่ำเสมอ / ไม่ใช้หรือผิดประเภท
- Type indicators: `*.test.ts`, `*.spec.ts`, `*.config.ts` ครบ / บางไฟล์ขาด / ไม่มีเลย

##### Folder Grouping

Checks (pass / warning / fail):

- Domain cohesion: domain เดียวกันทั้ง folder / 1-2 ไฟล์ต่าง domain / ปนหลาย domain
- File count: ≤20 / 21-40 / >40 (bloat) — ไม่นับ test/generated
- Mixed concerns: ไม่มี logic+test+config+generated ปน / 1-2 ไฟล์ / ปนหลายประเภท
- Nesting depth: 3-5 / 6 หรือ 2 / >6 หรือ 1 (flat เกิน)
- Import boundaries: ไม่มีข้าม domain/layer / 1-2 / จำนวนมาก
- Folder naming: สะท้อน domain + kebab-case / กำกวม / ไม่สะท้อน

##### Barrel Exports And Alias

Checks (pass / warning / fail):

- Barrel quality: re-exports ล้วน / `export *` จาก module ใหญ่ / logic หรือ side effects
- Export strategy: named exports + ซ่อน internal / `export default` จาก barrel / `export *` ไม่เลือก
- Type-only exports: แยก `export type` / ไม่แยกแต่ใช้ได้ / ไม่มีทั้งที่ควรมี
- Barrel coverage: ทุก multi-file module มี barrel / บาง module ขาด / ไม่มีทั้ง project
- Alias config: `tsconfig.json`+`vite.config.ts`+`package.json` สอดคล้อง / บาง config ขาด / ไม่มี config
- Alias naming: convention สม่ำเสมอ (`#` TS, `@/` frameworks) / ไม่สม่ำเสมอ / ไม่มี convention

##### Structure Health Score

- 5 metrics: file naming, folder grouping, barrel exports, import complexity, nesting depth — น้ำหนักเท่ากัน (20%)
- pass = 1, warning = 0.5, fail = 0; score = (total/5) × 100%; Grade A(90+) B(80+) C(70+) D(60+) F(<60)
- Score < 70 → แนะนำ `restructure` หรือ `relocation`; score < 50 → หยุดและ report

Structure Health Metrics table columns: Metric, Count, Threshold, Status

Relocation Plan table columns: File, Old Path, New Path, Reason, Priority — priority จาก domain cohesion impact + import complexity reduction (high impact + low effort = 1)

Dry-run preview แสดง before/after tree พร้อม files ที่ต้อง update imports:

```
Before:
src/
├── utils/
│   ├── auth.ts
│   └── user-helpers.ts

After:
src/
├── auth/
│   └── auth-service.ts
├── user/
│   └── user-helpers.ts
```

Steps:

1. ตรวจ file naming และ folder grouping ตาม checks ข้างบน (tools: `/scan-codebase`, `sg outline --items imports`, `Get-ChildItem -Recurse -File`; ข้าม `node_modules/`, `.git/`, `dist/`, `build/`, `coverage/`, `temp/`, generated)
2. ตรวจ barrel exports และ alias complexity ตาม checks ข้างบน
3. ทำ `/check-files long-files` ระบุไฟล์ที่ต้อง split ก่อน/หลัง relocation
4. ประเมิน flat vs nested ตาม `/flatten-directory` และ `/review-architecture`
5. คำนวณ structure health score + สร้าง relocation plan พร้อม dry-run preview old → new path
6. ตรวจ dependency-direction-safe move ordering

#### 9. Baseline Metrics And Prioritization

> Goal: สร้าง baseline metrics table และจัดลำดับ refactor targets

Baseline Metrics table (columns: Metric, Count, Threshold, Status):

| Metric | Count | Threshold | Status |
|--------|-------|-----------|--------|
| SRP violations | N | 0 | pass/warning/fail |
| Long files (>250 lines) | N | 0 | pass/warning/fail |
| Functions >50 lines | N | 0 | pass/warning/fail |
| Functions >4 params | N | 0 | pass/warning/fail |
| Functions nesting >3 | N | 0 | pass/warning/fail |
| Complex relative imports | N | 0 | pass/warning/fail |
| Circular dependencies | N | 0 | pass/warning/fail |
| Unused exports | N | 0 | pass/warning/fail |
| Cross-boundary imports | N | 0 | pass/warning/fail |
| Code duplication blocks | N | 0 | pass/warning/fail |
| Dead code items | N | 0 | pass/warning/fail |
| Anti-patterns | N | 0 | pass/warning/fail |

Status thresholds: pass = count 0 หรือในเกณฑ์, warning = count >0 แต่ < threshold (เช่น 1-3), fail = count ≥ threshold (เช่น >3 หรือ critical issue)

Refactor Targets table (columns: Target, Issue Type, Effort, Impact, Priority, Recommended Workflow):

| Target | Issue Type | Effort | Impact | Priority | Recommended Workflow |
|--------|-----------|--------|--------|----------|---------------------|
| `src/auth.ts` | SRP violation | low | high | 1 | `/refactor` |
| `src/utils.ts` | Long file (450 lines) | medium | medium | 2 | `/refactor` |

Priority formula: `impact × (1/effort)` — high impact + low effort = 1 (quick win), high impact + high effort = 2 (major refactor), low impact = 3+ (nice to have)

#### 10. Report

> Goal: รายงาน baseline และ refactor targets

1. คำนวณ refactor health score (ดู Scoring ใน Rules §4) — score < 70 → แนะนำ `/refactor` หรือ `/refactor-workspace`; score < 50 → หยุดและ report
2. ทำ `/report` สร้างตาราง Baseline Metrics + Refactor Targets + แสดง refactor health score
3. รายงาน supplementary metrics ถ้าเกี่ยวข้อง: review coverage ratio, false positive rate, evidence strength, actionability, severity distribution, MTTR estimate (Critical=1d/High=3d/Medium=7d/Low=14d), risk exposure index, scope adherence, structure maturity, coupling/cohesion score, refactor benefit, regression rate
4. ทำ `/suggest-next-action`

### Rules

#### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (refactor)
- แยก review process จาก refactor process
- ถ้าต้อง refactor ให้ทำ `refactor` หรือ `refactor-workspace` หลัง review

#### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number (refactor)
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

#### 3. Severity Classification

- Critical: circular dependency, cross-layer import, SRP violation ใน critical path, dead code ใน production path
- High: long file >250 lines, function >50 lines, parameter >4, high coupling, high duplication
- Medium: moderate coupling, code smell, naming inconsistency, 4-5 top-level symbols, pattern overuse ที่ซับซ้อนเกินจำเป็น
- Low: minor naming, cosmetic improvement, unused export ใน non-critical path

Severity weights: Critical = 0, High = 25, Medium = 50, Low = 75, Info = 100

#### 4. Scoring

- แต่ละ metric มีน้ำหนักเท่ากัน; pass = 1, warning = 0.5, fail = 0
- Refactor health score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Structure health ใช้สูตรเดียวกันบน 5 structure metrics (ดู step 8)

#### 5. Effort And Impact

- Effort: low (1 file, <30 min), medium (2-5 files, 30-120 min), high (>5 files, >120 min)
- Impact: critical (blocking production), high (core functionality at risk), medium (code quality), low (cosmetic)
- Priority order: high impact + low effort > high impact + high effort > low impact + any effort

#### 6. Formatting

- ห้ามใช้ `**` (bold markers)
- ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report` — ทุก table มีคอลัมน์ `No.` แรก

- ถ้า pass → ทำ `/refactor` ถ้า fail → แก้ findings ก่อน refactor

### Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

1. execute refactor ตาม targets ที่จัดลำดับ → `/refactor` หรือ `/refactor-workspace`
2. รักษา public API/behavior ตาม baseline — ถ้าต้องเปลี่ยน → แจ้ง user ก่อน
3. verify: `/run-check` + เทียบ metrics กับ baseline หลัง refactor

### Expected Outcome

- รายงาน Baseline Metrics
- รายงาน Refactor Targets
- Refactor health score
- ไม่มีการแก้ไข code
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

## Check: Function Quality


### Goal

ตรวจคุณภาพ function/method ระดับตัวด้วย ast-grep metrics — function ยาวเกิน, params เยอะ, returns หลายจุด, nesting ลึก, complexity สูง — แล้วแนะนำ technique แก้ไขตรง root cause

### Scope

ใช้กับ TS/TSX/JS/JSX source ที่ต้องการตรวจ function quality ก่อน/ระหว่าง refactor — เป็น evidence step ของ `/refactor` และ complement `/check-code-structure` (ซึ่งดู file-level structure) โดย skill นี้ดู function-level metrics

### Execute

#### 1. Prepare

> Goal: เตรียม scope และเครื่องมือ

1. ระบุ target paths (default `src` หรือ paths ที่ user ระบุ)
2. ตรวจ ast-grep พร้อมใช้: `bunx ast-grep --version` (local devDependency) หรือ `bunx -p @ast-grep/cli ast-grep --version` — script resolve ให้อัตโนมัติ
3. ถ้า scope ใหญ่ ให้ทำ `/scan-codebase` ก่อนเพื่อเลือก directories ที่คุ้ม

#### 2. Run Metrics Script

> Goal: เก็บ function metrics ด้วย ast-grep

1. รัน script จาก skills root:

```powershell
bun skills/shared/scripts/check-function-quality.ts <paths...>
bun skills/shared/scripts/check-function-quality.ts src --json
bun skills/shared/scripts/check-function-quality.ts src --max-lines 60 --max-params 4
```

2. script รัน `ast-grep run -p` เก็บ function declarations, arrow functions และ `scan --inline-rules` สำหรับ `method_definition`
3. metrics ต่อ function: `lines`, `params`, `returns`, `depth` (brace nesting), `complexity` (branch tokens)
4. ถ้า script fail → ตรวจว่า ast-grep resolve ได้และ paths มีไฟล์ที่รองรับ (max retry 3 → stop/report)

#### 3. Analyze Findings

> Goal: แปลง metrics เป็น issues พร้อม severity

| Metric | Medium | High | Critical |
|--------|--------|------|----------|
| `lines` | >40 | >80 | >150 |
| `params` | >4 | >6 | — |
| `returns` | >3 | >6 | — |
| `depth` | >4 | >6 | — |
| `complexity` | >10 | >15 | — |

1. อ่าน findings จาก table/JSON — ทุก finding มี `file:line` + function name เป็น evidence
2. เปิดอ่าน functions ที่ severity สูงสุด 3-5 ตัวเพื่อยืนยันว่า metric สะท้อนปัญหาจริง (ไม่ใช่ data table/generated code)
3. ระบุ false positives: dispatch tables, JSX-heavy components (ดู `update-review-cli-then-run/references/known-issues.md` #3 — TSX declarative อนุโลม), config builders
4. ถ้าไม่มี findings ที่เป็นปัญหาจริง → stop และ report

#### 4. Recommend Techniques

> Goal: map issue → refactoring technique ที่ตรง

- `lines`/`complexity` สูง → Extract Function ตาม phases/branches ที่เห็นใน body
- `params` สูง → Introduce Parameter Object หรือ options bag
- `returns` หลายจุด → Guard clauses / แยก validation ออกจาก core logic
- `depth` ลึก → early return, แยก loop body, Replace Nested Conditional
- function ทำหลายอย่าง (and-then-else structure) → ทำ `## Check: Single Responsibility` ต่อ
- เลือก technique เพิ่มจาก `refactor/references/code-smells.md`

#### 5. Hand Off Or Fix

> Goal: ส่งต่อไป refactor หรือแก้เล็กน้อยในที่

1. findings น้อยและชัด → แก้เลยตาม `/refactor` file scope
2. findings กระจายทั้ง codebase → ทำ `/refactor` codebase scope พร้อม findings เป็น baseline
3. ทำ `/deep-validate` ยืนยัน findings ก่อน hand-off เสมอ

#### 6. Report

> Goal: สรุปผล

1. ทำ `/report` ตาราง: No., File, Function, Lines, Params, Returns, Depth, Complexity, Severity, Technique
2. สรุป distribution: จำนวน functions ต่อ severity
3. ทำ `/suggest-next-action`

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี `file:line` + metric value จาก script — ห้าม flag โดยไม่มี evidence
- metrics เป็น heuristic — ต้องเปิดอ่าน top findings ยืนยันก่อนแนะนำ fix
- ระบุ false positives ใน report เสมอ

#### 2. Thresholds

- defaults ตามตารางใน Step 3 — override ได้ด้วย flags (`--max-lines`, `--max-params`, `--max-returns`, `--max-depth`, `--max-complexity`)
- TSX declarative components อนุโลม: JSX-heavy functions ใช้ threshold สูงกว่า (x2) หรือ skip ตาม context ของ project
- ถ้า project มี convention ต่าง (เช่น update-review-cli-then-run: TS 120/TSX 200) → ปรับ flags ตามนั้น

#### 3. Script Discipline

- script เป็น read-only — ไม่แก้ไข source
- output JSON (`--json`) สำหรับ integrate กับ review CLI หรือ scripts อื่น (`/use-astgrep-programmatic`)
- ถ้าต้อง metrics เพิ่ม/ภาษาอื่น → ขยาย script ตาม `/use-astgrep-programmatic` ไม่ใช่ copy-paste shell loops

#### 4. Scope Boundary

- check เท่านั้น ไม่ refactor — การแก้ไขอยู่ใน `/refactor`
- ไม่ซ้ำกับ `/check-code-structure` (file-level symbols/exports) — skill นี้ดู function internals
- ห้ามใช้ `**` (bold markers) — ใช้ backticks
- ใช้ `/search-by-astgrep` ถ้าจำเป็น


### Expected Outcome

- ตาราง function metrics พร้อม severity และ evidence `file:line`
- false positives ถูกระบุและตัดออก
- technique ที่แนะนำตรง metric ที่ผิดเกณฑ์
- hand-off ไป `/refactor` พร้อม baseline ชัดเจน

## Check: Single Responsibility


### Goal

ตรวจ Single Responsibility violations ด้วย ast-grep metrics — ไฟล์ที่มี top-level symbols เยอะ, class ที่มี members เกิน, ไฟล์ที่ปนหลาย domain — พร้อม evidence สำหรับ `/refactor`

### Scope

ใช้กับ TS/TSX/JS/JSX source เพื่อหา SRP violations ระดับ file/class — เป็น evidence step ของ `/refactor` โดยเฉพาะ SRP refactor path; ต่างจาก `/check-code-structure` ตรงที่ skill นี้ focus นับ responsibilities ไม่ใช่ดู structure ทั่วไป

### Execute

#### 1. Prepare

> Goal: เตรียม scope และเครื่องมือ

1. ระบุ target paths (default `src` หรือ paths ที่ user ระบุ)
2. ตรวจ ast-grep พร้อมใช้ — script resolve `ast-grep`/`sg`/`bunx -p @ast-grep/cli` ให้อัตโนมัติ
3. ทำ `/scan-codebase` ถ้ายังไม่รู้ว่า directories ไหนมี source

#### 2. Run SRP Script

> Goal: เก็บ symbol/member counts ด้วย ast-grep

```powershell
bun skills/shared/scripts/check-single-responsibility.ts <paths...>
bun skills/shared/scripts/check-single-responsibility.ts src --json
bun skills/shared/scripts/check-single-responsibility.ts src --max-symbols 5 --max-members 10
```

1. script รัน `ast-grep run -p` เก็บ top-level declarations (function, class, interface, type, const, enum)
2. รัน `scan --inline-rules` สำหรับ `method_definition` + `public_field_definition` แล้ว attribute เข้า enclosing class ตาม range
3. metrics: `symbols` (top-level), `exports`, `members` ต่อ class, `domains` (distinct name prefixes เป็น heuristic)
4. ถ้า script fail → ตรวจ ast-grep resolution และ paths (max retry 3 → stop/report)

#### 3. Identify Violations

> Goal: แปลง counts เป็น SRP findings พร้อม severity

| Metric | Medium | High | Critical |
|--------|--------|------|----------|
| `symbols` ต่อไฟล์ | 4-5 | >5 | >10 |
| `members` ต่อ class | 6-10 | >10 | >20 |
| `exports` ต่อไฟล์ | >8 | >12 | — |

1. file ที่ symbols เยอะ + ชื่อข้าม domain หลายกลุ่ม → mixed concerns ชัดเจน (High+)
2. class ที่ members เกิน → God class candidate — อ่านจริงยืนยันก่อน flag
3. ระบุ false positives: barrel/index files, generated code, type-only modules, i18n tables
4. ถ้าไม่มี violations จริง → stop และ report

#### 4. Recommend Splits

> Goal: แนะนำการแยกตาม responsibility ที่เห็น

- file หลาย domain → split เป็นไฟล์ต่อ responsibility (`/relocation` ถ้าต้องย้าย)
- class members เยอะ → extract เป็น sub-types/services ตามกลุ่ม methods ที่ cohesive
- exports เกิน → พิจารณา module boundary ใหม่หรือลด public surface
- function-level issues (ยาว/complex) → ทำ `## Check: Function Quality` ต่อ
- duplicated logic ข้าม symbols → `/follow-single-of-source`

#### 5. Hand Off Or Report

> Goal: ส่งต่อ refactor หรือสรุปผล

1. ทำ `/deep-validate` ยืนยัน findings
2. violations น้อย → แก้เลยใน `/refactor` file scope; violations กระจาย → `/refactor` SRP path
3. ทำ `/report` ตาราง: No., File, Symbols, Exports, Top Class Members, Severity, Suggested Split
4. ทำ `/suggest-next-action`

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี `file` + count + symbol names จาก script
- counts เป็น heuristic — เปิดอ่าน top findings ยืนยันก่อนแนะนำ split
- barrel files (`index.ts` re-export only) ไม่นับเป็น violation

#### 2. Thresholds

- defaults ตามตาราง Step 3 สอดคล้องกับ `/check-code-structure` (>5 symbols, >10 members)
- override ด้วย `--max-symbols`, `--max-members`, `--max-exports`
- ถ้า project มี convention ต่าง → ปรับ flags ตาม project standard

#### 3. Script Discipline

- script เป็น read-only — ไม่แก้ไข source
- output JSON (`--json`) สำหรับ review CLI หรือ scripts อื่น (`/use-astgrep-programmatic`)
- nested declarations ถูก exclude จาก top-level count โดย range containment — เป็น approximation ไม่ใช่ semantic analysis

#### 4. Scope Boundary

- check เท่านั้น ไม่ refactor — การแก้ไขอยู่ใน `/refactor` และ `/restructure`
- ไม่ซ้ำกับ `## Check: Function Quality` (function internals) — section นี้ดู file/class level
- ห้ามใช้ `**` (bold markers) — ใช้ backticks

### Expected Outcome

- ตาราง SRP metrics พร้อม severity และ evidence
- false positives (barrels, generated, type-only) ถูกระบุ
- suggested splits ตรง responsibility ที่เห็นจริง
- hand-off ไป `/refactor` พร้อม baseline

## Check: File Relations

### Goal

วิเคราะห์ความสัมพันธ์ระหว่างไฟล์ใน project หรือ skills repo เพื่อเข้าใจ dependencies, imports, exports, consumers, และ external references ก่อน update-references หรือ refactor

### Scope

ใช้เมื่อ:
- จะย้าย เปลี่ยนชื่อ หรือลบไฟล์
- จะ update references
- ต้องการทราบ impact ของการเปลี่ยนแปลง
- ตรวจสอบว่ามีไฟล์ใดอ้างถึงเป้าหมายบ้าง

รองรับหลาย ecosystem: Bun/Node, Rust, Python, Go, และ `SKILL.md`/`AGENTS.md`/`global_rules.md`

### Execute

#### 1. Identify Target Files

> Goal: ระบุไฟล์ที่ต้องการตรวจสอบ

1. รับ target files จาก arguments หรือ `git status --porcelain`
2. ยืนยันว่าไฟล์มีอยู่จริง
3. ระบุประเภท: source code, config, docs, skill, workflow

#### 2. Detect Ecosystem

> Goal: เลือกวิธีค้นหา relation ตาม tech stack

1. ตรวจสอบ `package.json` → Bun/Node
2. ตรวจสอบ `Cargo.toml` → Rust
3. ตรวจสอบ `go.mod` → Go
4. ตรวจสอบ `pyproject.toml`/`requirements.txt` → Python
5. ถ้าไฟล์เป็น `SKILL.md` → ใช้ skill reference patterns
6. ถ้าไฟล์เป็น `AGENTS.md` หรือ `global_rules.md` → ใช้ workflow reference patterns

#### 3. Find Local Imports And Exports

> Goal: หา import/export ภายใน project

1. ใช้ `grep` หรือ `ast-grep` หา patterns ตาม ecosystem:
   - Bun/Node: `from '...'`, `import ... from '...'`, `require('...')`, `export ... from '...'`
   - Rust: `use ...`, `mod ...`, `pub mod ...`, `extern crate ...`
   - Python: `from ... import`, `import ...`
   - Go: `import "..."`
2. สร้าง map ของแต่ละ target file → files ที่ import มัน
3. สร้าง map ของแต่ละ target file → files ที่มัน import

#### 4. Find Global References

> Goal: หา references นอก project (skills, rules, workflows)

1. ถ้ามี `workspace` หรือ `skills` directory ที่ต้องการตรวจ ให้ค้นหา references ทั้งหมด
2. ใช้ `grep` หา `/<target-skill>` หรือชื่อเป้าหมายใน `SKILL.md`/`AGENTS.md`/`global_rules.md`
3. ใช้ `grep` หา `target file name`, `target directory name`, `target skill name` ใน docs และ rules
4. บันทึก global references แยกจาก local imports

#### 5. Build Relation Map

> Goal: สร้างภาพรวมความสัมพันธ์

1. รวม local imports + global references
2. ระบุ direction: import (target อ้างอิงอื่น) / consumer (อื่นอ้างอิง target)
3. จัดกลุ่มตาม severity:
   - Critical: target ถูก import/export โดยไฟล์อื่น
   - Warning: target ถูกกล่าวถึงใน docs/rules/skills
   - Info: target ไม่มี relation

#### 6. Report

> Goal: รายงาน relation map

1. ทำ `/report`: target, relation type, related file, direction, severity
2. ระบุ files ที่ต้อง update references ถ้าย้าย/ลบ/เปลี่ยนชื่อ target
3. ทำ `/suggest-next-action` แนะนำ `/update-references` หรือ `/refactor`

### Rules

#### 1. Read Only

- ไม่แก้ไขไฟล์ใดๆ
- ใช้ `read`, `grep`, `ast-grep`, `glob` เท่านั้น
- ถ้าจำเป็นต้องสร้าง script ชั่วคราว ให้เก็บใน `$env:TEMP`

#### 2. Filter False Positives

- ไม่นับ URL, file paths ที่ไม่ใช่ module imports
- ไม่นับ comments, strings ที่ไม่ใช่จริง (ถ้า detect ได้)
- ไม่นับ npm package names เมื่อค้นหาใน skill repo
- ไม่นับ markdown headings หรือ anchors

#### 3. Multi Ecosystem

- รองรับ Bun/Node `.ts`, `.js`, `.tsx`, `.jsx`
- รองรับ Rust `.rs`
- รองรับ Python `.py`
- รองรับ Go `.go`
- รองรับ skills `.md` references

#### 4. No Auto Fix

- section นี้วิเคราะห์และรายงานเท่านั้น
- ถ้าต้องการแก้ → ทำ `/update-references` หลังจากนี้

- ใช้ /check-code-structure ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /search-files-patterns ถ้าจำเป็น

### Expected Outcome

- Relation map ครอบคลุม local imports และ global references
- ระบุ consumers ของ target files ชัดเจน
- ระบุ severity ของแต่ละ relation
- รายงานพร้อม action items สำหรับ `/update-references`

## Check: Deprecated APIs

### Goal

ตรวจหา usages ของ deprecated APIs ทั้งใน code เอง (`@deprecated` JSDoc), framework APIs ที่เลิกใช้ และ dependencies เวอร์ชันที่ deprecate แล้ว — ก่อนที่มันจะถูกลบจริง

### Scope

- ครอบคลุม: `@deprecated` annotations ใน project, deprecated APIs ของ frameworks/libs ที่ใช้, deprecated npm packages, Node/platform APIs ที่เลิกรองรับ
- Read-only: รายงาน usages + migration path — แก้ผ่าน `/refactor` หรือ `/update-version-to-latest`

### Execute

#### 1. Find Deprecation Markers

> Goal: รวบรวมสิ่งที่ถูก deprecate

1. ใช้ `search-files-patterns`/`use-astgrep` หา `@deprecated` tags, `deprecated` warnings ใน project เอง
2. รัน typecheck/lint ดู deprecation diagnostics (TS แสดง strikethrough/warnings)
3. ตรวจ `package.json` deps เทียบ registry — deprecated packages (`npm view <pkg> deprecated`)
4. ตรวจ runtime deprecation warnings จาก `NODE_OPTIONS=--trace-deprecation` หรือ logs

#### 2. Map Usages

> Goal: หาจุดที่เรียกใช้ deprecated things

1. สำหรับแต่ละ deprecated symbol → หา call sites ทั้งหมด
2. นับ usage count ต่อ symbol — เรียง impact
3. แยก internal deprecated (ของ project เอง) ออกจาก external (ของ deps/framework)

#### 3. Determine Migration Path

> Goal: หา replacement ของแต่ละตัว

1. อ่าน deprecation message — ส่วนใหญ่บอก replacement (`use X instead`)
2. สำหรับ deps: หา successor package หรือ migration guide
3. ถ้าไม่มี replacement ชัด → flag เป็น `needs-decision`

#### 4. Report

> Goal: สรุป deprecation debt พร้อมแผน

1. ใช้ `/report` คอลัมน์: `No.`, `Deprecated`, `Type`, `Usages`, `Replacement`, `Severity`
2. Severity: `high` (EOL/removal announced, security-related), `medium` (มี replacement ชัด), `low` (deprecated แต่ยัง maintain)
3. จัดกลุ่มเป็น batches ที่ migrate พร้อมกันได้

### Rules

#### 1. Evidence-Based

- ทุก finding ต้องมี deprecation source (annotation, registry, runtime warning)
- usage count ต้องมาจากการ scan จริง ไม่ใช่ประมาณ

#### 2. Read-Only

- ไม่ migrate code — รายงานและเสนอ path
- อย่า flag deprecated ที่ยังไม่มีทางเลือกว่าเป็น "ต้องแก้ด่วน" — ระบุตามจริง

#### 3. Context Aware

- Test code/examples ที่ใช้ deprecated APIs อาจตั้งใจ — flag แยก
- Deprecated ของ project เอง = ความรับผิดชอบภายใน, ของ deps = ตาม timeline ของ upstream
- ใช้ /review-docs ถ้าจำเป็น


### Expected Outcome

- รายการ deprecated usages พร้อม counts และ replacements
- Deprecation debt แยก internal vs external
- Migration batches ที่ทำได้ทีละชุด

## Domain Checks

> Goal: เลือกทำเฉพาะ dimension ที่ตรง scope arg

| Scope | Section |
|-------|---------|
| `refactor`, `baseline` | `## Review Before Refactor` |
| `function-quality` | `## Check: Function Quality` |
| `single-responsibility` | `## Check: Single Responsibility` |
| `file-relations` | `## Check: File Relations` |
| `deprecated-apis` | `## Check: Deprecated APIs` |

## Rules

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review (quality)
- ทุก finding ต้องมี file path, line number, code snippet
- ระบุ false positives พร้อมเหตุผล
- ให้คะแนนตาม criteria ใน references ไม่ตามความชอบส่วนบุคคล
- ปฏิบัติตาม hardcode exclusions ใน `references/code-quality.md`
- รวม findings จากหลาย source เป็น single finding ถ้าซ้ำกัน
- ข้าม sub-workflow ที่ไม่เกี่ยวข้องกับ project
- ตรวจ pattern ทีใช้ว่าช่วย maintainability และ extensibility หรือไม่
- หลีกเลี่ยง anti-patterns ทีทำให้ code ซับซ้อนโดยไม่จำเป็น
- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ tools, commands, paths, skill references
- รายงานเป็นตารางด้วย `/report`
- ใช้ symbols: ✅ ผ่าน, ❌ ไม่ผ่าน, ⚠️ มี warning

- ใช้ /deep-analyze ถ้าจำเป็น
- ใช้ /run-review ถ้าจำเป็น
- ใช้ /deep-review ถ้าจำเป็น
- ใช้ /use-astgrep ถ้าจำเป็น
- ใช้ /review-test ถ้าจำเป็น
- ใช้ /review-security ถ้าจำเป็น
- ใช้ /review-stability ถ้าจำเป็น
- ใช้ /review-uxui ถ้าจำเป็น

## Fix

> ทำตาม `../shared/review-fix.md` เมื่อ user confirm ให้แก้ findings

### Fix Steps (types/code quality)

1. types: เปิด strict flags ทีละตัว, `any`→`unknown`+narrowing, casts→guards, public APIs typed
2. complexity: แบ่ง functions ยาวตาม `/follow-single-responsibility`, early return/guard clauses ลด nesting, รวม logic ซ้ำเป็น helper — hot-path algorithmic issues เปลี่ยน data structure/algorithm ก่อน micro-opts — scope ใหญ่ → `/refactor` แยก commits ไม่ผสม behavior change
3. imports: `knip`/lint auto-fix ลบ unused (ระวัง side-effect/decorator imports — typecheck ทุก batch), barrels `export *` → named/subpath imports + `sideEffects: false`, heavy libs → subpath/dynamic import หรือทางเลือกผ่าน `/review-dependencies`
4. consistency: patterns, API shapes, error handling, doc style
5. verify: `/run-typecheck` + `/run-lint` + tests ผ่าน — types only ห้ามเปลี่ยน runtime; bundle เทียบด้วย `/review-bundle` หรือ `/report-before-after`; เปลี่ยน paths → `/update-references`

## References

- [Full-dimension checklist](references/checklist.md)
- [Code quality](references/code-quality.md)
- [Best practices](references/best-practices.md)
- [Naming](references/naming.md)
- [Consistency](references/consistency.md)
- [Bug-prone patterns](references/bug-prone.md)
- [Correctness](references/correctness.md)
- [Tech debt](references/tech-debt.md)
- [Time complexity](references/time-complexity.md)
- [Scoring](references/scoring.md)

## Expected Outcome

- รายงาน Quality Metrics Summary, Findings by Category, Recommended Actions
- Review score พร้อม grade และ progress bar ตาม `references/scoring.md`
- คะแนนต่อ dimension: code quality, bug-prone, correctness, general quality
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
