---
name: deep-verify
description: Verify ละเอียดหลัง merge/parallel ทำงาน โดยรวม checks, tests, references, และ runtime
---

## Goal

Verify ผลลัพธ์แบบละเอียดหลัง merge หรือหลังทำงานขนาน: checks, tests, types, lint, references, และ runtime ต้องผ่านทั้งหมด

## Scope

ใช้สำหรับ verification ทีลึกซึ้งกว่า `/deep-validate` หลังจาก `/merge` ผลลัพธ์จาก `consider-use-subagents` หรือหลัง implementation ซับซ้อน

## Execute

### 1. Define Verify Scope

> Goal: ระบุสิ่งจะ verify ตาม context

1. ระบุเป้าหมายของงานทีทำเสร็จ: code, documentation, config หรืออื่นๆ
2. ระบุ dimensions ทีต้อง verify: correctness, type safety, tests, lint, references, runtime
3. กำหนด success criteria ของแต่ละ dimension
4. ถ้างานมีความเสี่ยงสูง ให้ทำ `/ask-me` เพื่อยืนยัน scope ก่อน

### 2. Run Automated Checks

> Goal: ตรวจสอบ checks อัตโนมัติผ่านทั้งหมด

1. ทำ `/run-verify-on-local` เพื่อรัน lint, format, และ quality checks
2. ทำ `/run-test` เพื่อรัน unit/integration tests
3. ถ้า project มี `package.json` ระบุ typecheck script ให้รัน `bunx tsc --noEmit` หรือคำสั่งทีเหมาะสม
4. บันทึกผลลัพธ์ของแต่ละ check พร้อม evidence

### 3. Check References

> Goal: ตรวจสอบ references ไม่พัง

1. ทำ `/check-reference` เพื่อหา broken references
2. ถ้า project มี skills/workflows อ้างอิงกัน ตรวจสอบ `related` ให้ถูกต้อง
3. ตรวจสอบว่าไฟล์ทีถูกย้าย/ลบ/merge ถูกอ้างอิงถูกต้อง

### 4. Scan Codebase

> Goal: ตรวจสอบโครงสร้างและ quality ของ codebase

1. ทำ `/scan-codebase` เพื่อหาไฟล์เกิน 250 บรรทัด, orphan files, หรือ issues ด้าน structure
2. ตรวจสอบว่าไม่มี circular dependencies ระหว่าง modules
3. ตรวจสอบว่าโครงสร้างไฟล์สอดคล้องกับ architecture ทีกำหนด

### 5. Deep Validate

> Goal: ตรวจสอบความถูกต้องละเอียด

1. ทำ `/deep-validate` เพื่อตรวจสอบความถูกต้องเบื้องต้น
2. ทำ `/deep-validate` เพื่อตรวจสอบ correctness, type safety, security, compliance, และ cross-reference
3. ถ้าพบ issues ให้บันทึก severity (Critical, High, Medium, Low)

### 6. Report And Suggest

> Goal: รายงานผล verify และแนะนำขั้นต่อไป

1. ทำ `/report` พร้อม `/report-table` สรุปผล: Check, Status, Evidence, Severity
2. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป
3. ถ้าไม่ผ่าน → stop และ report ก่อนปล่อย

## Rules

### 1. Verify Only

- ทำ verify เท่านั้น ไม่แก้ไข code ระหว่าง verify
- ถ้าพบ issues ให้บันทึกและทำ `/resolve-errors` หลังจาก verify จบ
- ไม่ข้าม check ใดๆ ถ้าไม่มีเครื่องมือจริง

### 2. Evidence

- ทุก finding ต้องมี evidence: file path, line number, หรือ command output
- ถ่าย/บันทึก output ของ commands ทีรัน
- ไม่อ้างผล verify ทียังไม่ได้รัน

### 3. Stop On Failure

- ถ้า `/run-test` หรือ `/run-verify-on-local` ไม่ผ่าน → หยุดทันที
- ถ้า `/deep-validate` พบ Critical หรือ High → หยุดทันที
- ถ้า `/check-reference` พบ broken references → หยุดทันที
- ถ้าต้องทำงานต่อ ให้ทำ `/resolve-errors` แล้วทำ `/deep-verify` ซ้ำ

## Expected Outcome

- All checks pass: lint, format, typecheck, tests
- ไม่มี broken references
- ไม่มี orphan files หรือ circular dependencies
- Deep validation ผ่านทุก dimension
- รายงาน verify ครบถ้วนพร้อม evidence
- ขั้นต่อไปชัดเจนจาก `/suggest-next-action`
