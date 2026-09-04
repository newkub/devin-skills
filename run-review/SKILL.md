---
name: run-review
description: รัน review CLI วิเคราะห์ผล และแนะนำ action items ตาม findings
related:
  - deep-review
  - improve-review-cli
  - update-review-cli
  - update-create-analyze-cli
  - run-verify
  - resolve-errors
  - follow-tasks
  - suggest-next-action
  - report-table
---

## Goal

รัน `tools/review-codebase` CLI เพื่อวิเคราะห์ project review และแนะนำ action items ตาม findings

## Scope

ใช้สำหรับรัน review CLI ที่ `tools/review-codebase` ที่ project root และแปลผลลัพธ์ ถ้าจำเป็นให้ update/fix CLI ด้วย `/update-review-cli` หรือ `/improve-review-cli`

ดูเพิ่มเติม: /improve-review-cli

## Execute

### 1. Verify CLI Exists

> Goal: ตรวจสอบว่า review CLI มีอยู่และพร้อมรัน

1. ตรวจสอบว่า `tools/review-codebase/package.json` มีอยู่ที่ project root
2. ถ้าไม่มี → ทำ `/improve-review-cli` เพื่อสร้าง CLI ก่อน แล้วกลับมาทำ step ถัดไป
3. ตรวจสอบว่า `tools/review-codebase/src/presentation/cli.ts` มีอยู่

### 2. Run Review CLI

> Goal: รัน review CLI เพื่อวิเคราะห์ project review

1. รัน `bun --filter tools-review-codebase review-codebase` สำหรับ table output
2. รัน `bun --filter tools-review-codebase review-codebase:json` สำหรับ JSON output ที่เขียนลง `reports/review-report.json`
3. ถ้าต้องการ output มาที stdout ให้ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file -`
4. ถ้าต้องการบันทึกไฟล์ custom ให้ใช้ `bun --filter tools-review-codebase review-codebase:json -- --out-file <path>`
5. ถ้า CLI error → ทำ `/update-review-cli` เพื่อ fix CLI ก่อน แล้วกลับมารันใหม่

### 3. Analyze Results

> Goal: วิเคราะห์ผลลัพธ์จาก review report เพื่อระบุปัญหาและจัดลำดับ

1. อ่าน review score และ grade จาก summary
2. ระบุ findings ที่เป็น Critical และ High severity
3. จัดกลุ่ม findings ตาม `reviewWorkflow` โดย map ไปยัง `/review-*` workflows ที่เหมาะสม
4. ถ้า score < 70, categories < 60, `analyzerErrors` > 0, domain score < 50, หรือ `falsePositiveRate` > 20% → ทำ Step 4 Fix And Rerun (max 3 รอบ)

### 4. Fix And Rerun

> Goal: แก้ไข CLI/analyzers แล้วรัน review ใหม่จนผ่านหรือครบ 3 รอบ

1. บันทึก metrics ปัจจุบัน: score, grade, categories, domain scores, analyzerErrors, falsePositiveRate
2. ถ้า CLI error, package missing หรือ structure ผิด → ทำ `/update-review-cli`
3. ถ้า categories < 60, score < 70, domain score < 50, หรือ falsePositiveRate > 20% → ทำ `/improve-review-cli` หรือ `/update-create-analyze-cli`
4. ถ้า analyzerErrors > 0 → ทำ `/resolve-errors` จากนั้นทำ `/update-review-cli`
5. หลัง fix รัน `/run-verify` เพื่อ build, lint, typecheck
6. ถ้า verify ผ่าน → กลับไป Step 2 รัน review ใหม่
7. ทำซ้ำไม่เกิน 3 รอบ ถ้ายังไม่ผ่าน → ไป Step 5

### 5. Verify And Follow Tasks

> Goal: ยืนยันว่า project ผ่าน verify แล้วติดตาม action ถัดไป

1. ทำ `/run-verify` เพื่อ verify build, lint, typecheck
2. ทำ `/follow-tasks` เพื่อรับ action items และ track progress
3. ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` แล้วกลับไป `/run-review` อีกครั้ง

### 6. Suggest Actions

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
- ถ้า CLI ไม่มี → ทำ `/improve-review-cli` ก่อน

### 2. Output Interpretation

- Review score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: pass, warn, fail
- Severity order: Critical > High > Medium > Low
- จัดลำดับ action items ตาม severity: Critical ก่อน, High รองลงมง
- แต่ละ finding map ไปยัง `/review-*` workflows ที่เหมาะสม ผ่าน `reviewWorkflow` field

### 3. When To Update Or Fix CLI

- ถ้า CLI error, package missing หรือ crash → ทำ `/update-review-cli`
- ถ้า categories ไม่ครบ 60+ → ทำ `/update-review-cli` หรือ `/improve-review-cli`
- ถ้า analyzer ให้ผลไม่ถูกต้อง → ทำ `/update-create-analyze-cli` แล้ว `/update-review-cli`
- ถ้า verify ไม่ผ่าน → ทำ `/resolve-errors` แล้ว rerun (max 3 รอบ)

## Expected Outcome

- Review report พร้อม score, grade, domain breakdown และ findings
- ตาราง summary ตาม `/report-table` แสดง top findings และ recommended actions
- แนะนำ `/review-*` workflows สำหรับแต่ละปัญหา
- แนะนำ `/update-review-cli` ถ้า CLI ต้องสร้าง/อัปเดท
- แนะนำ `/improve-review-cli` ถ้า analyzers ต้องปรับปรุง

## References

- ใช้ `tools/review-codebase/package.json` ที่ project root
- ดูรายละเอียดสร้าง/อัปเดท CLI ใน `/update-review-cli` และ `/improve-review-cli`

## Addendum

- ถ้าต้องแก้ไข analyzer logic ให้เรียก `/update-create-analyze-cli` ก่อน เพื่ออัปเดท `tools/analyze` ก่อน `/update-review-cli`
- Fix workflow ย้ายมาอยู่ใน `/run-review` Step 4
