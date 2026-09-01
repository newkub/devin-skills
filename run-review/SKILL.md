---
name: run-review
description: รัน review CLI วิเคราะห์ผล และแนะนำ action items ตาม findings
related:
  - deep-review
  - review-codebase-everything
  - suggest-next-action
  - report-table
  - update-create-analyze-cli
---

## Goal

รัน `tools/review-codebase` CLI เพื่อวิเคราะห์ project review และแนะนำ action items ตาม findings

## Scope

ใช้สำหรับรัน review CLI ที่ `tools/review-codebase` ที่ project root และแปลผลลัพธ์ ไม่ใช้สำหรับสร้างหรืออัปเดท analyzers (ใช้ `/deep-review` Step 3.5 หรือ `deep-review/references/cli-review-steps.md` แทน)

## Execute

### 1. Verify CLI Exists

> Goal: ตรวจสอบว่า review CLI มีอยู่และพร้อมรัน

1. ตรวจสอบว่า `tools/review-codebase/package.json` มีอยู่ที่ project root
2. ถ้าไม่มี → ทำ `/deep-review` Step 3.5 เพื่อสร้าง CLI ก่อน แล้วกลับมาทำ step ถัดไป
3. ตรวจสอบว่า `tools/review-codebase/src/presentation/cli.ts` มีอยู่

### 2. Run Review CLI

> Goal: รัน review CLI เพื่อวิเคราะห์ project review

1. รัน `bun --filter tools-review-codebase review-codebase` สำหรับ table output
2. รัน `bun --filter tools-review-codebase review-codebase:json` สำหรับ JSON output ที่เขียนลง `reports/review-report.json`
3. ถ้าต้องการ output มาที stdout ให้ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file -`
4. ถ้าต้องการบันทึกไฟล์ custom ให้ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file <path>`
5. ถ้า CLI error → ทำ `/deep-review` Step 3.5 แล้วดู `deep-review/references/cli-review-steps.md` ขั้นตอน 7 (Validate CLI) เพื่อ fix

### 3. Analyze Results

> Goal: วิเคราะห์ผลลัพธ์จาก review report เพื่อระบุปัญหาและจัดลำดับ

1. อ่าน review score และ grade จาก summary
2. ระบุ findings ที่เป็น Critical และ High severity
3. จัดกลุ่ม findings ตาม `reviewWorkflow` โดย map ไปยัง `/review-*` workflows ที่เหมาะสม
4. ถ้า score < 70, categories < 60, หรือ `analyzerErrors` > 0 → พิจารณาทำ `/deep-review` Step 3.5 เพื่อปรับปรุง analyzers

### 4. Suggest Actions

> Goal: แนะนำ action ถัดไปตาม findings และจัดลำดับความสำคัญ

1. ทำ `/suggest-next-action` ตาม findings ที่จัดลำดับแล้ว
2. ทำ `/report-table` แสดง summary: domain scores, top findings, recommended workflows
3. แนะนำ `/review-*` workflows สำหรับแต่ละ finding ตาม `reviewWorkflow` field

## Rules

### 1. CLI Commands

- ใช้ `bun --filter tools-review-codebase review-codebase` สำหรับ table output
- ใช้ `bun --filter tools-review-codebase review-codebase:json` สำหรับ JSON output (default เขียนลง `reports/review-report.json`)
- ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file -` สำหรับ stdout
- ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file <path>` สำหรับ custom path
- ถ้า CLI ไม่มี → ทำ `/deep-review` Step 3.5 ก่อน

### 2. Output Interpretation

- Review score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: pass, warn, fail
- Severity order: Critical > High > Medium > Low
- จัดลำดับ action items ตาม severity: Critical ก่อน, High รองลงมง
- แต่ละ finding map ไปยัง `/review-*` workflows ที่เหมาะสม ผ่าน `reviewWorkflow` field

### 3. When To Update CLI

- ถ้า CLI error หรือ crash → ทำ `/deep-review` Step 3.5 แล้วดู `deep-review/references/cli-review-steps.md` ขั้นตอน 7
- ถ้า categories ไม่ครบ 60+ → ทำ `/deep-review` Step 3.5 แล้วดู `deep-review/references/cli-review-steps.md` ขั้นตอน 2-3
- ถ้า analyzer ให้ผลไม่ถูกต้อง → ทำ `/deep-review` Step 3.5 แล้วดู `deep-review/references/cli-review-steps.md` ขั้นตอน 2 (Plan Analyzer Categories)

## Expected Outcome

- Review report พร้อม score, grade, domain breakdown และ findings
- ตาราง summary ตาม `/report-table` แสดง top findings และ recommended actions
- แนะนำ `/review-*` workflows สำหรับแต่ละปัญหา
- แนะนำ `/deep-review` Step 3.5 ถ้า CLI ต้องปรับปรุง

## References

- ไม่มี nested references (ใช้ `tools/review-codebase/package.json` ที่ project root แทน)
- ดูรายละเอียดสร้าง/อัปเดท CLI ใน `deep-review/references/cli-review-steps.md`

## Addendum

- ถ้าต้องแก้ไข analyzer logic `/run-review` ต้องเรียก `/update-create-analyze-cli` ก่อน เพื่ออัปเดท `tools/analyze` ก่อนจะอัปเดท `tools/review-codebase`
