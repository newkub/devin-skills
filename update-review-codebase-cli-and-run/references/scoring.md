# Codebase Review Score Formula

## Purpose

สูตรการคำนวณ review score และ health indicator ของ codebase

## Score Calculation

คำนวณ review score เป็น percentage (0-100):

- `0` = ทุก finding เป็น Critical
- `100` = ไม่มี finding

## Score Breakdown

แสดง score ทั้งสองระดับ:

- overall score: คะแนนรวมของทั้ง codebase
- domain score: คะแนนแยกตาม domain

## Grade Mapping

แปลง score เป็น letter grade:

- `A`: score >= 90
- `B`: score >= 80
- `C`: score >= 70
- `D`: score >= 60
- `F`: score < 60

## Before-After Comparison

ใช้ score เปรียบเทียบ before/after ในการปรับปรุง:

1. บันทึก before score ก่อนรัน improvement
2. ทำ improvement ตาม findings
3. รัน `bun run review-codebase` เพื่อวัด after score
4. เปรียบเทียบ delta เพื่อวัดผลการปรับปรุง

## Category Coverage

`categories` metric วัดความครอบคลุมของ review:

- target: `categories >= 60`
- ถ้าต่ำกว่า 60 → ทำ `/update-create-analyze-cli` เพื่อเพิ่ม analyzers ใน `tools/analyze` แล้วทำ `update-review-codebase-cli-and-run` เพื่อ integrate

## Health Indicator

สรุป overall assessment เป็น health indicator:

- พิจารณาจาก overall score, grade, และ severity distribution ของ findings
- แสดงในรายงานพร้อมตาราง findings

## Severity Weights

แต่ละ severity มี score weight ดังนี้:

- `Critical` = 0
- `High` = 25
- `Medium` = 50
- `Low` = 75
- `Info` = 100

## Weighted Average Calculation

review score = weighted average ของ findings ทั้งหมด:

```
score = sum(severity_weight * count) / total_findings
```

ตัวอย่าง:

- 1 Critical, 1 High, 1 Medium → (0 + 25 + 50) / 3 = 25
- 2 Low, 1 Info → (75 + 75 + 100) / 3 = 83.3

## Action On Low Score

ถ้า score < 70:

- แนะนำให้เรียก `/update-review-codebase-cli-and-run` ก่อนดำเนินการ
- ระบุ findings ที่ต้องแก้ไข
- ทำ `/suggest-next-action` เพื่อแนะนำขั้นตอนถัดไป

## Report Format

รายงานผลด้วย `/report-table`:

| Category | Severity | Finding | Evidence | Action |
|----------|----------|---------|----------|--------|

- Category — ประเภทการตรวจสอบ
- Severity — `Critical` | `High` | `Medium` | `Low` | `Info`
- Finding — ปัญหาที่พบ
- Evidence — file path, line number, code snippet
- Action — action ที่ต้องทำ

## Evidence Format

ทุก finding ต้องมี:

- file path
- line number
- code snippet ที่เป็นปัญหา
