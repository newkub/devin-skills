---
name: review-codebase
description: Review และปรับปรุง codebase ครบทุกมิติ ระบุ issues พร้อม severity ผ่าน review CLI
---

## Goal

Review codebase ครบทุกมิติโดยใช้ review CLI แทนการ manual อ่าน references ทีละ dimension ระบุ issues พร้อม severity และ actionable recommendations แล้วอัปเดต CLI ตาม metrics โดยอัตโนมัติ

## Scope

ใช้สำหรับ comprehensive codebase review ผ่าน `tools/review` CLI — รัน CLI parse JSON output ตัดสินใจ update analyzers ตาม metrics ระบุ issues พร้อม severity และ recommendations แล้วรันใหม่ ครอบคลุม code, content, documentation, configuration, workflows, skills ถ้าต้องการ comprehensive quality gate ให้ใช้ `/deep-review` ถ้าต้องการดู dimension เฉพาะให้อ่าน `review-<dimension>/SKILL.md`

## Execute

### 1. Prepare And Read Context

> Goal: ตรวจสอบคุณภาพ codebase และอ่าน context ก่อนรัน review

1. ทำ `/run-check` เพื่อรัน lint, typecheck และ scan — ถ้าพบ errors ให้ทำ `/resolve-errors` ก่อน
2. ทำ `/review-rules` เพื่อตรวจสอบ `AGENTS.md`
3. อ่าน `AGENTS.md`, `.devin/rules.md` และ `tools/review/README.md` เพื่อเข้าใจ project context
4. ระบุสิ่งที่จะ review (code file, content, docs, config, workflow, ฯลฯ) และ scope: ไฟล์ที่เกี่ยวข้อง, modules, sections
5. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง (ถ้ามี)
6. ทำ `/run-review` Step 1 เพื่อ verify CLI มีอยู่

### 2. Run Review CLI And Capture Metrics

> Goal: รัน review CLI ทั้ง table และ JSON output เพื่อวิเคราะห์ metrics

1. ทำ `/run-review` สำหรับ table output
2. รัน `bun --filter tools-review review:json` หรือ `bun run --filter tools-review review -- --output report.json` เพื่อดึง JSON
3. บันทึก before score, grade, domain breakdown, category coverage, findings count
4. ถ้า CLI error → ทำ `/update-create-review-cli` Step 5 แล้วกลับมา Step 2

### 3. Decide Update CLI From Metrics

> Goal: ตัดสินใจให้ `/update-create-review-cli` อัตโนมัติตาม metrics

ถ้า metrics ตรงเงื่อนไขใดข้างล่าง → ทำ `/update-create-review-cli` แล้วกลับไป Step 2 (ทำซ้ำไม่เกิน 3 รอบ):

1. `categories` น้อยกว่า 60
2. overall `score` ต่ำกว่า 70 หรือ `grade` เป็น `D`/`F`
3. domain ใด `score` ต่ำกว่า 50
4. `analyzerErrors` > 0
5. `falsePositiveRate` สูงกว่า 20%
6. findings จำนวนมากไม่มี `evidence` หรือ `severity` ไม่ชัดเจน
7. `reviewWorkflow` field ไม่ map ไปยัง `?review-codebase/review-<dimension>`? ที่มีอยู่
8. `tools/review/package.json` หรือ `tools/review/src/presentation/cli.ts` ไม่อยู่

ถ้าทุก metrics ผ่านหรือไม่มีการเปลี่ยนแปลงหลัง 3 รอบ → ไป Step 4

### 4. Review Against Criteria And Detect Issues

> Goal: ทุก finding มี evidence และ severity rating

1. ตรวจสอบความถูกต้อง: logic, syntax, facts, หรือ content accuracy
2. ตรวจสอบคุณภาพ: readability, consistency, completeness, best practices
3. ตรวจสอบความเหมาะสม: สอดคล้องกับ context, requirements, และ constraints
4. ใช้ `Grep` หรือ `ast-grep` สำหรับ pattern-based checks ถ้าเกี่ยวข้อง
5. บันทึกทุก finding พร้อม evidence (file path, line number, code snippet, หรือ section)
6. ระบุ severity ของแต่ละ finding: Critical → High → Medium → Low
7. ระบุ root cause และ false positives ที่พบ

### 5. Run PR And Global Reviews

> Goal: รัน review เฉพาะทางถ้าจำเป็น

1. ถ้ามี PR ที่กำลัง review → ทำ `/review-github-pr`
2. ถ้าต้องการ review global Devin skills → ทำ `/review-all-skills`

### 6. Validate Findings And Provide Recommendations

> Goal: validate issues และให้ recommendations ที่ concrete และจัดลำดับตาม priority

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. ให้ recommendation ที่ concrete และ actionable สำหรับทุก finding
4. จัดลำดับ recommendations ตาม severity และ impact
5. ระบุ quick wins และ strategic fixes
6. ถ้า finding ต้องแก้ไข ให้ชี้ไปยัง `/resolve-errors` หรือ workflow ที่เกี่ยวข้อง
7. ทำ `/implement-all` สำหรับ issues ที่ต้องการ refactor

### 7. Report And Verify

> Goal: รายงานผลและวัด after review score

1. ทำ `/run-review` เพื่อวัด after score
2. ทำ `/report-ansi`, `/report-table`
3. ทำ `/report` เพื่อสร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
4. จัดกลุ่ม findings ตาม category และเรียงตาม severity
5. สรุป overall assessment และ health indicator
6. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 8. Improve

> Goal: ปรับปรุง codebase ตาม findings และลด redundancy

1. อ่าน `AGENTS.md` และทำ `/scan-codebase` เพื่อหา issues ทั่วไป
2. รัน `bunx jscpd`, `bunx knip`, `bunx madge --circular` สำหรับ code duplication, unused exports, circular dependencies
3. จัดลำดับ priority ตาม impact ก่อน effort
4. ทำ review-* skills ตาม findings เพื่อ review และปรับปรุงตาม context
5. ทำ `/validate` และ `/run-check` — ถ้าไม่ผ่าน → ทำ `/resolve-errors` แล้ว retry (max 3)

## Rules

### 1. CLI-Driven Review

- ใช้ `/run-review` และ `tools/review` CLI เป็นแหล่งหลักของ findings
- ไม่ manual อ่าน `review-<dimension>/SKILL.md` ทีละตัว — อ่านเฉพาะเมื่อ CLI output ไม่ชัดเจนหรือต้องการ deep-dive
- ถ้า metrics บ่งชี้ให้ update CLI → ต้องทำ `/update-create-review-cli` ก่อนรีวิวต่อ

### 2. Metric Triggers

- `categories < 60` → `/update-create-review-cli` Step 2-3 เพื่อเพิ่ม categories
- `score < 70` หรือ `grade D/F` → `/update-create-review-cli` Step 3 เพื่อปรับปรุง analyzers
- `domain score < 50` → `/update-create-review-cli` Step 3 เฉพาะ domain นั้น
- `analyzerErrors > 0` → `/update-create-review-cli` Step 5
- `falsePositiveRate > 20%` → `/update-create-review-cli` Step 3 เพื่อ tune rules
- `reviewWorkflow` ไม่ถูกต้อง → `/update-create-review-cli` Step 6

### 3. Execution Governance

- ทำ `/update-create-review-cli` แล้วรัน `/run-review` ใหม่ ไม่เกิน 3 รอบ
- ทำ `/update-reference` หลังจากแก้ไขไฟล์
- รัน tests หลังแต่ละ improvement

### 4. Evidence-Based Findings

- ทุก finding ต้องมี evidence (file path, line number, code snippet, หรือ section)
- ไม่เดา ใช้ tools สำหรับ verification
- อ้างอิง standards หรือ best practices ที่ตรวจสอบได้
- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- แต่ละ finding ต้อง map ไปยัง `?review-codebase/review-<dimension>`? ผ่าน `reviewWorkflow` field

### 5. Review Independence

- ทำ review เท่านั้น ไม่แก้ไขระหว่าง review
- แยก review process จาก fix process
- ใช้ `/deep-review` สำหรับ comprehensive quality gate review
- ใช้ `/validate` สำหรับ general validation

### 6. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- ใช้ heading levels สำหรับ structure
- รายงานเป็นตารางด้วย `/report-table`

## Expected Outcome

- Review ทำงานผ่าน `tools/review` CLI ไม่ manual อ่าน references ทีละ dimension
- Findings จาก CLI ครอบคลุม 60+ categories พร้อม evidence และ severity
- ทุก finding มี severity rating, root cause และ actionable recommendation
- `/update-create-review-cli` ถูกเรียกอัตโนมัติเมื่อ metrics บ่งชี้
- Before-after review score ผ่าน `/run-review`
- Issues ถูก validate และจัดลำดับตาม severity
- Codebase ปรับปรุงตาม findings และลด redundancy โดยไม่มี regression
- รายงานในแชทเป็นตารางพร้อม action ถัดไป
