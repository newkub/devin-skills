# Review CLI Usage And Metrics

## Purpose

คู่มือการใช้ `tools/review` CLI สำหรับรัน review และวิเคราะห์ metrics ของ codebase

## CLI Commands

### Table Output

```
/run-review
```

รัน review CLI เพื่อแสดงผลเป็นตารางในเทอร์มินัล เหมาะสำหรับดูภาพรวม

### JSON Output

```
bun --filter tools-review review:json
bun run --filter tools-review review -- --output report.json
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
- `reviewWorkflow`: mapping ไปยัง `review-<dimension>` skills

## CLI Error Handling

ถ้า CLI error ให้ทำ `/update-create-review-cli` Step 5 เพื่อแก้ไขแล้วรันใหม่

## Metric Triggers สำหรับ Update CLI

ถ้า metrics ตรงเงื่อนไขข้างล่าง → ทำ `/update-create-review-cli` แล้วรัน review ใหม่ (ไม่เกิน 3 รอบ):

- `categories < 60` → เพิ่ม categories (Step 2-3)
- `score < 70` หรือ `grade D/F` → ปรับปรุง analyzers (Step 3)
- domain ใด `score < 50` → ปรับปรุง domain นั้น (Step 3)
- `analyzerErrors > 0` → แก้ไข analyzer errors (Step 5)
- `falsePositiveRate > 20%` → tune rules (Step 3)
- `reviewWorkflow` ไม่ถูกต้อง → แก้ไข mapping (Step 6)

## File Dependencies

- `tools/review/package.json` — package manifest
- `tools/review/src/presentation/cli.ts` — CLI entry point
- `tools/review/README.md` — CLI documentation

ถ้าไฟล์เหล่านี้ไม่อยู่ → ทำ `/update-create-review-cli` เพื่อสร้าง
