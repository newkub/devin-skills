---
title: Scoring Formula
description: สูตรคำนวณ review score และ grade สำหรับ review-features
related:
  - review-features
  - report-table
  - suggest-next-action
---

## Goal

คำนวณ review score และ grade จาก findings ของ `review-features`

## Scope

ใช้ใน Execute step "Score And Report" ของ `review-features` — คำนวณ score เท่านั้น ไม่ตรวจ format หรือ coverage

## Severity To Score Mapping

| Severity | Score |
| --- | --- |
| `Critical` | 0 |
| `High` | 25 |
| `Medium` | 50 |
| `Low` | 75 |
| `Info` | 100 |

## Scoring Formula

1. review score = weighted average ของ findings ทั้งหมด
2. คำนวณด้วยสูตร:

   `review score = sum(severity_score) / count(findings)`

3. ถ้าไม่มี findings → review score = 100

## Grade Thresholds

| Grade | Score Range |
| --- | --- |
| `A` | 90 ขึ้นไป |
| `B` | 80 ถึง 89 |
| `C` | 70 ถึง 79 |
| `D` | 60 ถึง 69 |
| `F` | ต่ำกว่า 60 |

## Action Threshold

- Score < 70 → แนะนำให้เรียก `update-features-md` ก่อนดำเนินการ
- Score >= 70 → features documentation ผ่าน review สามารถดำเนินการต่อได้

## Reporting Steps

1. รวบรวม findings ทั้งหมดจาก Execute steps 1-6
2. กำหนด severity ให้แต่ละ finding
3. แปลง severity เป็น score ตาม Severity To Score Mapping
4. คำนวณ review score ด้วย Scoring Formula
5. กำหนด grade ตาม Grade Thresholds
6. ทำ `/report-table` พร้อม columns: `Category`, `Severity`, `Finding`, `Evidence`, `Action`
7. ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไป

## Report Table Columns

`| Category | Severity | Finding | Evidence | Action |`

- `Category` — format, coverage, duplication, monorepo, sidebar
- `Severity` — `Critical`, `High`, `Medium`, `Low`, `Info`
- `Finding` — คำอธิบายปัญหา
- `Evidence` — file path และบรรทัดที่เกี่ยวข้อง
- `Action` — action ที่ต้องทำ เช่น `update-features-md`, `update-docs`

## Expected Outcome

- review score และ grade ถูกคำนวณจาก findings ทั้งหมด
- รายงาน findings ผ่าน `/report-table`
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % features doc items in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (features table or coverage) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |
