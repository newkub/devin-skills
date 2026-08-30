# Review Codebase CLI Usage And Metrics

## Purpose

คู่มือการใช้ `tools/review-codebase` CLI สำหรับรัน review และวิเคราะห์ metrics ของ codebase

## CLI Commands

### Table Output

```
bun run review-codebase
```

รัน review CLI เพื่อแสดงผลเป็นตารางในเทอร์มินัล เหมาะสำหรับดูภาพรวม

### JSON Output

```
bun --filter tools-review-codebase review-codebase:json
bun run --filter tools-review-codebase review-codebase -- --output report.json
```

ดึง JSON output เพื่อ parse metrics และบันทึก before score, grade, domain breakdown, category coverage, findings count

## Metrics ที่ต้อง Capture

- `score`: overall review score (0-100)
- `grade`: letter grade (`A`, `B`, `C`, `D`, `F`)
- `categories`: category coverage count
- domain breakdown: score แยกตาม domain
- `findings`: จำนวน findings ทั้งหมด
- `analyzerErrors`: จำนวน analyzer errors
- `falsePositiveRate`: อัตรา false positive เป็น percentage
- `reviewWorkflow`: mapping ไปยัง review skills

## Category Structure

5 domains ครอบคลุม 60+ categories:

- User-Facing
- Security & Compliance
- Backend & Data
- Infrastructure
- Code & Architecture

แต่ละ category เป็น analyzer object ใน `tools/analyze/src/domain/analyzers/<domain>.ts`

## CLI Error Handling

ถ้า CLI error ให้ทำ `review-codebase-everything` Step 3-7 เพื่อแก้ไขแล้วรันใหม่

## Metric Triggers สำหรับ Update CLI

ถ้า metrics ตรงเงื่อนไขข้างล่าง → ทำ `/update-create-analyze-cli` เพื่อแก้ไข analyzer ก่อน แล้วทำ `review-codebase-everything` Step 3-7 เพื่อ integrate แล้วรัน review ใหม่ (ไม่เกิน 3 รอบ):

- `categories < 60` → เพิ่ม categories ใน `tools/analyze`
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers ใน `tools/analyze`
- domain ใด `score < 50` → ปรับปรุง domain นั้นใน `tools/analyze`
- `analyzerErrors > 0` → แก้ไข analyzer errors ใน `tools/analyze`
- `falsePositiveRate > 20%` → tune rules ใน `tools/analyze`
- `reviewWorkflow` ไม่ถูกต้อง → แก้ไข mapping ใน `tools/analyze`

## File Dependencies

- `tools/review-codebase/package.json` — package manifest
- `tools/review-codebase/src/presentation/cli.ts` — CLI entry point
- `tools/review-codebase/README.md` — CLI documentation

ถ้าไฟล์เหล่านี้ไม่อยู่ → ทำ `review-codebase-everything` เพื่อสร้าง
