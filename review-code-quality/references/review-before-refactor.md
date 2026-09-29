# Review Before Refactor

### Goal

Review codebase BEFORE refactor to establish baseline metrics and identify prioritized refactor targets

### Scope

ใช้ก่อนเรียก `refactor`, `refactor-workspace` หรือ `relocation` เพื่อระบุเป้าหมาย refactor ครอบคลุม SRP violations, long files, function quality, imports/exports, package boundaries, code smells, dead code, anti-patterns และ file/folder structure (naming, grouping, barrel exports, nesting, relocation plan) ไม่รวมการ refactor จริง — เป็น review เท่านั้น

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

ทำตาม [structure-analysis.md](structure-analysis.md)

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
