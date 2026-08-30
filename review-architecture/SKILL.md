---
name: review-architecture
description: Review architecture, modularity, isolation, resilience, reliability, governance
related:
  - scan-codebase
  - deep-analyze
  - review-codebase-everything
  - deep-validate
  - report
  - report-table
  - suggest-next-action
---

## Goal

Review architecture ระดับ macro ครอบคลุม design patterns, module boundaries, dependency directions, coupling, SOLID principles, anti-patterns, modularity, isolation, resilience, reliability, และ governance พร้อม review score

## Scope

architectural patterns, module boundaries, dependency directions, SOLID principles, scalability, concurrency, multi-tenancy, queue architecture, routing, side effects, modularity, isolation, resilience, reliability, governance, data flow tracing, และ cost impact analysis

## Execute

### 1. Prepare

> Goal: เข้าใจ architecture, patterns, module structure, dependency graph และ governance

1. ทำ `/scan-codebase` เพื่อเข้าใจ architecture และ module layout
2. รัน `madge` เพื่อสร้าง dependency graph และหา circular dependencies
3. ระบุ architectural patterns, module/package boundaries, shared state, test strategy, environment separation, และ governance structure ที่ใช้
4. ถ้าสแกนไม่ได้ → stop และ report

### 2. Deep Analyze

> Goal: ครอบคลุมทุก architecture dimension พร้อม review score

1. ทำ `/deep-analyze` เพื่อวิเคราะห์หลายมิติ
2. ทำ `/review-codebase-everything` แล้วรัน review analyzers
3. รัน `bun --filter tools-review-codebase review-codebase:json` เพื่อดึง review report พร้อม metrics
4. ตรวจสอบแต่ละ dimension ตาม reference files ใน [references/index.md](references/index.md)
5. ทำ data flow analysis ตาม [references/data-flow.md](references/data-flow.md)
6. ทำ cost impact analysis ตาม [references/cost-impact.md](references/cost-impact.md)
7. คำนวณ architecture review score จาก [references/scoring.md](references/scoring.md)

### 3. Review Import, Export And Barrel Exports

> Goal: ตรวจสอบ import/export strategy และ barrel exports ของ module

1. ทำตาม [references/import-export.md](references/import-export.md)
2. บันทึก findings

### 4. Validate Findings

> Goal: Findings ถูกต้องและจัดลำดับตาม severity

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/deep-validate` สำหรับ validate issues แต่ละอย่าง
3. ใช้เกณฑ์ severity จาก [references/severity-classification.md](references/severity-classification.md)
4. ระบุ false positives ที่พบ
5. ถ้า validation ไม่ผ่าน → กลับไปแก้ที่ Step 2

### 5. Report

> Goal: รายงาน findings พร้อม actionable recommendations

1. ทำ `/report` พร้อม `/report-table`
2. สร้างตาราง findings: Category, Finding, Severity, Location, Recommendation
3. สร้างตาราง Metrics Summary ตาม dimension พร้อม status indicators และ score
4. จัดกลุ่ม findings ตาม category และเรียงตาม severity
5. ทำ `/suggest-next-action`

### 6. Implement All

> Goal: ไม่มี implementation gap ค้างหลัง review

1. ทำ `/realize-implementation` เพื่อตรวจสอบ implementation completeness ของ areas ที่ review
2. ถ้าพบ incomplete implementations → เพิ่มเป็น findings ใน report

## Rules

1. ทุก finding ต้องมี file path, line number และ evidence — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)
2. แยก review process จาก fix process และ scope boundaries ตาม [references/review-rules.md](references/review-rules.md)
3. ใช้ skip conditions เมื่อ project ไม่มีสภาพแวดล้อมที่เกี่ยวข้อง — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)
4. คำนวณ score, grade, status, และ metrics ตาม [references/scoring.md](references/scoring.md)
5. รายงานด้วยตารางและไม่ใช้ `**` bold markers — ดูรายละเอียดใน [references/review-rules.md](references/review-rules.md)

## Expected Outcome

- รายงานตาราง findings พร้อม severity และ location
- รายงาน Metrics Summary พร้อม status indicators และ score ต่อ dimension
- รายงาน recommended actions พร้อม priority
- Architecture review score พร้อม grade และ progress bar
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
