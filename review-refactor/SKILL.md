---
name: review-refactor
description: Review codebase before refactor to establish baseline and identify refactor targets
---

## Goal

Review codebase BEFORE refactor to establish baseline metrics and identify prioritized refactor targets covering SRP violations, long files, function quality, import/export complexity, package boundaries, code smells, dead code, and anti-patterns

## Scope

ใช้ก่อนเรียก `refactor`, `refactor-to-single-responsibility`, หรือ `refactor-packages` เพื่อทำความเข้าใจสถานะปัจจุบันและระบุเป้าหมาย refactor ครอบคลุม: SRP violations, long files (>250 lines), function quality (naming, side effects, complexity, params), import/export complexity, package/module boundaries, code smells, dead code, anti-patterns ไม่รวมการ refactor จริง — เป็น review เท่านั้น

## Execute

### 1. Prepare Context

> Goal: เข้าใจ project structure, tools และ scope ก่อน review

1. ทำ `/scan-codebase` เพื่อเข้าใจ project structure และ tech stack
2. อ่าน `AGENTS.md` เพื่อทราบ tools ที่ใช้ใน project
3. ระบุ quality tools ที่มี: `biome`, `tsc`, `ast-grep`, `knip`, `jscpd`, `madge`
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Analyze SRP Violations

> Goal: ระบุ units ที่ทำหลายหน้าที่

1. ทำ `/check-code-structure` เพื่อดู top-level symbols, exports, members, imports, cohesion
2. ใช้ `sg outline --view expanded --items structure <paths>` สำหรับ top-level symbols
3. ระบุ SRP violations ตามเกณฑ์ใน [references/srp-violations.md](references/srp-violations.md)
4. บันทึก: file, violation type, symbol count, concern mix

### 3. Analyze Long Files

> Goal: ระบุไฟล์ที่ยาวเกิน threshold

1. ทำ `/check-long-files` เพื่อหาไฟล์ที่ยาวกว่า 250 บรรทัด
2. ระบุ split strategies ตาม [references/long-files.md](references/long-files.md)
3. บันทึก: file, line count, split strategy, estimated effort

### 4. Analyze Function Quality

> Goal: ระบุ functions ที่มี quality issues

1. ทำ `/check-code-structure` และ `sg outline --view expanded --type function <paths>` เพื่อ scan functions (กรอง test/spec/generated)
2. ตรวจสอบ naming, side effects, complexity, parameters ตาม [references/function-quality.md](references/function-quality.md)
3. ใช้ `sg outline --view expanded --type function --view expanded <paths>` สำหรับ function signatures
4. บันทึก: file, function, issue type, severity, recommended action

### 5. Analyze Imports And Exports

> Goal: ระบุ import/export complexity

1. ใช้ `sg outline --items imports <paths>` เพื่อตรวจสอบ import patterns
2. ตรวจสอบ relative imports ที่ซับซ้อน (`../../../`) ตาม [references/imports-exports.md](references/imports-exports.md)
3. ตรวจสอบ barrel exports, circular dependencies ด้วย `madge --circular --extensions ts,tsx`
4. ตรวจสอบ unused exports ด้วย `knip`
5. บันทึก: file, import issue, complexity level, recommended action

### 6. Analyze Package Boundaries

> Goal: ระบุ package/module boundary issues

1. ทำ `/scan-codebase` เพื่อดู module/package structure
2. ตรวจสอบ boundaries ตาม [references/package-boundaries.md](references/package-boundaries.md)
3. ตรวจสอบ cross-boundary imports, coupling, cohesion
4. ตรวจสอบ dependency direction: high-level พึ่งพา low-level เท่านั้น
5. บันทึก: module, boundary issue, coupling level, recommended action

### 7. Analyze Code Smells And Dead Code

> Goal: ระบุ code smells, dead code, anti-patterns

1. ทำ `/deep-review` เพื่อระบุ code smells, anti-patterns, dead code
2. ทำ `/review-quality` เพื่อ review ครอบคลุม code smells, duplication, unused code
3. รัน `knip` เพื่อหา unused exports และ dead code
4. รัน `jscpd` เพื่อหา code duplication
5. บันทึก: file, smell type, severity, recommended action

### 8. Establish Baseline Metrics

> Goal: สร้าง baseline metrics table ก่อน refactor

1. รวบรวม metrics จาก Step 2-7 ตาม [references/baseline-metrics.md](references/baseline-metrics.md)
2. สร้าง baseline metrics table: metric, count, threshold, status
3. คำนวณ refactor health score จาก metrics
4. บันทึก baseline สำหรับเปรียบเทียบหลัง refactor

### 9. Prioritize Refactor Targets

> Goal: จัดลำดับ refactor targets ตาม effort และ impact

1. รวม findings จาก Step 2-7 เป็น refactor targets
2. ประเมิน effort: low (1 file), medium (2-5 files), high (>5 files)
3. ประเมิน impact: critical, high, medium, low
4. จัดลำดับ: high impact + low effort ก่อน → high impact + high effort → low impact
5. แนะนำ workflow: `refactor-to-single-responsibility`, `refactor-packages`, `refactor`

### 10. Report

> Goal: รายงาน baseline และ refactor targets

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง Baseline Metrics: metric, count, threshold, status
3. สร้างตาราง Refactor Targets: target, issue type, effort, impact, priority, recommended workflow
4. แสดง refactor health score พร้อม grade
5. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Rules

### 1. Review Only

- ทำ review เท่านั้น ไม่แก้ไข code ระหว่าง review
- แยก review process จาก refactor process
- ถ้าต้อง refactor ให้ทำ `refactor`, `refactor-to-single-responsibility`, หรือ `refactor-packages` หลัง review

### 2. Evidence-Based Findings

- ทุก finding ต้องมี file path และ line number
- ใช้ tools สำหรับ verification ไม่เดา
- ระบุ false positives ที่พบ

### 3. Severity Classification

- Critical: circular dependency, cross-layer import, SRP violation ใน critical path, dead code ใน production path
- High: long file >250 lines, function >50 lines, parameter >4, high coupling, high duplication
- Medium: moderate coupling, code smell, naming inconsistency, 4-5 top-level symbols
- Low: minor naming, cosmetic improvement, unused export ใน non-critical path

### 4. Baseline Metrics Scoring

- แต่ละ metric มีน้ำหนักเท่ากัน
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Refactor health score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

### 5. Effort And Impact

- Effort: low (1 file, <30 min), medium (2-5 files, 30-120 min), high (>5 files, >120 min)
- Impact: critical (blocking production), high (core functionality at risk), medium (code quality), low (cosmetic)
- Priority order: high impact + low effort > high impact + high effort > low impact + any effort

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- รายงานตาราง Baseline Metrics พร้อม status indicators
- รายงานตาราง Refactor Targets พร้อม effort, impact, priority, recommended workflow
- Refactor health score พร้อม grade
- ไม่มีการแก้ไข code — เป็น review เท่านั้น
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
