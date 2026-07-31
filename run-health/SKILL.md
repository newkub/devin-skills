---
name: run-health
description: รัน health CLI วิเคราะห์ผล และแนะนำ action items ตาม findings
---

## Goal

รัน `tools/health` CLI เพื่อวิเคราะห์ project health และแนะนำ action items ตาม findings

## Scope

ใช้สำหรับรัน health CLI ที่ `tools/health` ที่ project root และแปลผลลัพธ์ ไม่ใช้สำหรับสร้างหรืออัปเดท analyzers (ใช้ `/update-codebase-health-cli` แทน)

## Execute

### 1. Verify CLI Exists

ตรวจสอบว่า health CLI มีอยู่และพร้อมรัน

> Goal: ยืนยันว่า CLI พร้อมรัน

1. ตรวจสอบว่า `tools/health/package.json` มีอยู่ที่ project root
2. ถ้าไม่มี → ทำ `/update-codebase-health-cli` เพื่อสร้าง CLI ก่อน แล้วกลับมาทำ step ถัดไป
3. ตรวจสอบว่า `tools/health/src/presentation/cli.ts` มีอยู่

### 2. Run Health CLI

รัน health CLI เพื่อวิเคราะห์ project health

> Goal: ได้ health report พร้อม score, findings และ action items

1. รัน `bun --filter @booking/tools-health health` สำหรับ table output
2. รัน `bun --filter @booking/tools-health health:json` สำหรับ JSON output (ถ้าต้องการ parse)
3. ถ้า CLI error → ทำ `/update-codebase-health-cli` Step 5 เพื่อ validate และ fix

### 3. Analyze Results

วิเคราะห์ผลลัพธ์จาก health report เพื่อระบุปัญหาและจัดลำดับ

> Goal: เข้าใจ findings และจัดลำดับตาม severity

1. อ่าน health score และ grade จาก summary
2. ระบุ findings ที่เป็น Critical และ High severity
3. จัดกลุ่ม findings ตาม `reviewWorkflow` ที่แนะนำ
4. ถ้า score < 70 → พิจารณาทำ `/update-codebase-health-cli` เพื่อปรับปรุง analyzers

### 4. Suggest Actions

แนะนำ action ถัดไปตาม findings และจัดลำดับความสำคัญ

> Goal: รู้ action ถัดไปที่ควรทำตาม priority

1. ทำ `/suggest-next-action` ตาม findings ที่จัดลำดับแล้ว
2. ทำ `/report-format-table` แสดง summary: domain scores, top findings, recommended workflows
3. แนะนำ `/review-*` workflow สำหรับแต่ละ finding ตาม `reviewWorkflow` field

## Rules

### 1. CLI Commands

- ใช้ `bun --filter @booking/tools-health health` สำหรับ table output
- ใช้ `bun --filter @booking/tools-health health:json` สำหรับ JSON output
- ใช้ `bun --filter @booking/tools-health health -- --output report.txt` สำหรับเขียนลงไฟล์
- ถ้า CLI ไม่มี → ทำ `/update-codebase-health-cli` ก่อน

### 2. Output Interpretation

- Health score: A (90+), B (80+), C (70+), D (60+), F (<60)
- Status: ✅ pass, ⚠️ warn, ❌ fail
- Severity order: Critical > High > Medium > Low
- จัดลำดับ action items ตาม severity: Critical ก่อน, High รองลงมง
- แต่ละ finding map ไปยัง `/review-*` workflow ผ่าน `reviewWorkflow` field

### 3. When To Update CLI

- ถ้า CLI error หรือ crash → ทำ `/update-codebase-health-cli` Step 5
- ถ้า categories ไม่ครบ 60+ → ทำ `/update-codebase-health-cli` Step 2-3
- ถ้า analyzer ให้ผลไม่ถูกต้อง → ทำ `/update-codebase-health-cli` Step 3

## Expected Outcome

- Health report พร้อม score, grade, domain breakdown และ findings
- ตาราง summary ตาม `/report-format-table` แสดง top findings และ recommended actions
- แนะนำ `/review-*` workflow สำหรับแต่ละปัญหา
- แนะนำ `/update-codebase-health-cli` ถ้า CLI ต้องปรับปรุง
