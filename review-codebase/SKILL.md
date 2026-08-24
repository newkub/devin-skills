---
name: review-codebase
description: Review และปรับปรุง ครบทุกมิติของ codebase ด้วย review CLI ไม่ manual ทีละ dimension โดยอัปเดต CLI ตาม metrics
---

## Goal

Review codebase ครบทุกมิติโดยใช้ review CLI แทนการ manual อ่าน references ทีละ dimension โดย run `/run-review` วิเคราะห์ metrics แล้วเรียก `/update-create-review-cli` อัตโนมัติเมื่อ metrics บ่งชี้ว่า CLI ต้องปรับปรุง

## Scope

ใช้สำหรับ comprehensive codebase review ผ่าน `tools/review` CLI — รัน CLI parse JSON output ตัดสินใจ update analyzers ตาม metrics แล้วรันใหม่ ถ้าต้องการดู dimension เฉพาะให้อ่าน `review-<dimension>/SKILL.md`

## Execute

### 1. Prepare And Read Context

> Goal: ตรวจสอบคุณภาพ codebase และอ่าน context ก่อนรัน review

1. ทำ `/run-check` เพื่อรัน lint, typecheck และ scan — ถ้าพบ errors ให้ทำ `/resolve-errors` ก่อน
2. ทำ `/review-agents-md` เพื่อตรวจสอบ `AGENTS.md`
3. อ่าน `AGENTS.md`, `.devin/rules.md` และ `tools/review/README.md` เพื่อเข้าใจ project context
4. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติอย่างลึกซึ้ง (ถ้ามี)
5. ทำ `/run-review` Step 1 เพื่อ verify CLI มีอยู่

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

### 4. Run PR And Global Reviews

> Goal: รัน review เฉพาะทางถ้าจำเป็น

1. ถ้ามี PR ที่กำลัง review → ทำ `/review-github-pr`
2. ถ้าต้องการ review global Devin skills → ทำ `/review-all-skills`

### 5. Validate Findings

> Goal: ตรวจสอบและ validate issues ที่ review CLI พบ

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/validate` สำหรับ validate issues แต่ละอย่าง
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. ทำ `/implement-all` สำหรับ issues ที่ต้องการ refactor

### 6. Report And Verify

> Goal: รายงานผลและวัด after review score

1. ทำ `/run-review` เพื่อวัด after score
2. ทำ `/report-ansi`, `/report-table`
3. ทำ `/report` เพื่อสรุปผล
4. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

### 7. Improve

> Goal: ปรับปรุง codebase ตาม findings และลด redundancy

1. อ่าน `AGENTS.md` และทำ `/scan-codebase` เพื่อหา issues ทั่วไป
2. รัน `bunx jscpd`, `bunx knip`, `bunx madge --circular` สำหรับ code duplication, unused exports, circular dependencies
3. จัดลำดับ priority ตาม impact ก่อน effort
4. ทำ review-* skills ตาม findings เพื่อ review และปรับปรุง: `/review-frontend`, `/review-correctness`, `/review-reliability`, `/review-performance`, `/review-security`, `/review-database`, `/review-docs`, `/review-api` ตาม context
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

### 4. Severity And Evidence

- จัดลำดับ issues ตาม severity: Critical → High → Medium → Low
- ทุก finding ต้องมี evidence: file path, line number, code snippet
- แต่ละ finding ต้อง map ไปยัง `?review-codebase/review-<dimension>`? ผ่าน `reviewWorkflow` field

### 5. Formatting

- ห้ามใช้ `**` (bold markers) — ใช้ backticks สำหรับ emphasis
- รายงานเป็นตารางด้วย `/report-table`

## Review Catalog

Skill รีวิวทุก dimension:
- `review-frontend`
- `review-api`
- `review-app-stability`
- `review-architecture`
- `review-security`
- `review-backend`
- `review-battery`
- `review-frontend`
- `review-bug-prone`
- `review-performance`
- `review-business`
- `review-cli`
- `review-code-quality`
- `review-codebase-issue`
- `review-security`
- `review-components`
- `review-reliability`
- `review-config`
- `review-quality`
- `review-docs`
- `follow-context-rot`
- `review-correctness`
- `review-infrastructure`
- `review-correctness`
- `review-frontend`
- `review-data-fetching`
- `review-data-validation`
- `review-data`
- `review-database`
- `review-debugging`
- `review-delivery`
- `review-frontend`
- `review-reliability`
- `review-discoverability`
- `review-docs`
- `review-dx`
- `review-error-handling`
- `review-event-handling`
- `review-security`
- `review-form`
- `review-correctness`
- `review-frontend`
- `review-governance`
- `review-hooks-composables`
- `review-i18n`
- `review-frontend`
- `review-infrastructure`
- `review-integration`
- `review-performance`
- `review-isolation`
- `review-lib`
- `review-performance`
- `review-infrastructure`
- `review-modularity`
- `review-quality`
- `review-performance`
- `review-reliability`
- `review-performance`
- `review-platform`
- `review-reliability`
- `review-infrastructure`
- `review-reliability`
- `review-realize-implementation`
- `review-quality`
- `review-quality`
- `review-reliability`
- `review-frontend`
- `review-frontend`
- `review-infrastructure`
- `review-security`
- `review-seo`
- `review-service`
- `review-correctness`
- `review-quality`
- `review-state-management`
- `review-techstack`
- `review-correctness`
- `review-correctness`
- `review-frontend`
- `review-frontend`
- `review-infrastructure`
- `review-infrastructure`
- `review-workflow-content`
- `review-workspace`
- Pull request: `review-github-pr`
- Global skills: `review-all-skills`

## Expected Outcome

- Review ทำงานผ่าน `tools/review` CLI ไม่ manual อ่าน references ทีละ dimension
- Findings จาก CLI ครอบคลุม 60+ categories พร้อม evidence และ severity
- `/update-create-review-cli` ถูกเรียกอัตโนมัติเมื่อ metrics บ่งชี้
- Before-after review score ผ่าน `/run-review`
- Issues ถูก validate และจัดลำดับตาม severity
- Codebase ปรับปรุงตาม findings และลด redundancy โดยไม่มี regression
- รายงานในแชทเป็นตารางพร้อม action ถัดไป

