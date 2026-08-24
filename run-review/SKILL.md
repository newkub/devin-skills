---
name: run-review
description: รัน review CLI วิเคราะห์ผล และแนะนำ action items ตาม findings
---

## Goal

รัน `tools/review` CLI เพื่อวิเคราะห์ project review และแนะนำ action items ตาม findings

## Scope

ใช้สำหรับรัน review CLI ที่ `tools/review` ที่ project root และแปลผลลัพธ์ ไม่ใช้สำหรับสร้างหรืออัปเดท analyzers (ใช้ `/update-create-review-cli` แทน)

## Execute

### 1. Verify CLI Exists

> Goal: ตรวจสอบว่า review CLI มีอยู่และพร้อมรัน
> Goal: ยืนยันว่า CLI พร้อมรัน

1. ตรวจสอบว่า `tools/review/package.json` มีอยู่ที่ project root
2. ถ้าไม่มี → ทำ `/update-create-review-cli` เพื่อสร้าง CLI ก่อน แล้วกลับมาทำ step ถัดไป
3. ตรวจสอบว่า `tools/review/src/presentation/cli.ts` มีอยู่

### 2. Run Review CLI

> Goal: รัน review CLI เพื่อวิเคราะห์ project review
> Goal: ได้ review report พร้อม score, findings และ action items

1. รัน `bun --filter tools-review review` สำหรับ table output
2. รัน `bun --filter tools-review review:json` สำหรับ JSON output (ถ้าต้องการ parse)
3. ถ้า CLI error → ทำ `/update-create-review-cli` Step 5 เพื่อ validate และ fix

### 3. Analyze Results

> Goal: วิเคราะห์ผลลัพธ์จาก review report เพื่อระบุปัญหาและจัดลำดับ
> Goal: เข้าใจ findings และจัดลำดับตาม severity

1. อ่าน review score และ grade จาก summary
2. ระบุ findings ที่เป็น Critical และ High severity
3. จัดกลุ่ม findings ตาม `reviewWorkflow` โดย map ไปยัง `/review-codebase` หรือ `?review-codebase/references/<dimension>.md`?
4. ถ้า score < 70, categories < 60, หรือ `analyzerErrors` > 0 → พิจารณาทำ `/update-create-review-cli` เพื่อปรับปรุง analyzers

### 4. Suggest Actions

> Goal: แนะนำ action ถัดไปตาม findings และจัดลำดับความสำคัญ
> Goal: รู้ action ถัดไปที่ควรทำตาม priority

1. ทำ `/suggest-next-action` ตาม findings ที่จัดลำดับแล้ว
2. ทำ `/report-table` แสดง summary: domain scores, top findings, recommended workflows
3. แนะนำ `/review-codebase` หรือ `?review-codebase/references/<dimension>.md`? สำหรับแต่ละ finding ตาม `reviewWorkflow` field

## Rules

### 1. CLI Commands

- ใช้ `bun --filter tools-review review` สำหรับ table output
- ใช้ `bun --filter tools-review review:json` สำหรับ JSON output
- ใช้ `bun --filter tools-review review -- --output report.txt` สำหรับเขียนลงไฟล์
- ถ้า CLI ไม่มี → ทำ `/update-create-review-cli` ก่อน

### 2. Output Interpretation

- Review score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: ✅ pass, ⚠️ warn, ❌ fail
- Severity order: Critical > High > Medium > Low
- จัดลำดับ action items ตาม severity: Critical ก่อน, High รองลงมง
- แต่ละ finding map ไปยัง `/review-codebase` หรือ `?review-codebase/references/<dimension>.md`? ผ่าน `reviewWorkflow` field

### 3. When To Update CLI

- ถ้า CLI error หรือ crash → ทำ `/update-create-review-cli` Step 5
- ถ้า categories ไม่ครบ 60+ → ทำ `/update-create-review-cli` Step 2-3
- ถ้า analyzer ให้ผลไม่ถูกต้อง → ทำ `/update-create-review-cli` Step 3

## Expected Outcome

- Review report พร้อม score, grade, domain breakdown และ findings
- ตาราง summary ตาม `/report-table` แสดง top findings และ recommended actions
- แนะนำ `/review-codebase` หรือ `?review-codebase/references/<dimension>.md`? สำหรับแต่ละปัญหา
- แนะนำ `/update-create-review-cli` ถ้า CLI ต้องปรับปรุง

## References

- package.json review script reference: `references/run-review-reference/`

## Addendum

- ถ้าต้องแก้ไข analyzer logic `/run-review` ต้องเรียก `/update-create-analyze-cli` ก่อน เพื่ออัปเดท `tools/analyze` ก่อนจะอัปเดท `tools/review`
