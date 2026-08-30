---
title: Scoring
description: สูตรคำนวณ review score, grade และ metrics
---

# Scoring

## Severity Weights

แต่ละ finding มี weight ตาม severity:

| Severity | Weight |
|---|---|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Score Calculation

review score = weighted average ของ findings ทั้งหมด

```
score = sum(weight of each finding) / count of findings
```

### Example

- 1 Critical (0) + 1 High (25) + 1 Info (100) = 125 / 3 = 41.67 → Grade F

## Grade Mapping

| Grade | Score Range |
|---|---|
| A | 90 ขึ้นไป |
| B | 80 ถึง 89 |
| C | 70 ถึง 79 |
| D | 60 ถึง 69 |
| F | ต่ำกว่า 60 |

## Action Threshold

- Score < 70 → แนะนำให้เรียก `update-devin-global-subagents` ก่อนดำเนินการ
- Score >= 70 → ผ่าน review สามารถดำเนินการต่อได้

## Report Format

รายงานผ่าน `/report-table` พร้อม columns:

- Category — หมวด review เช่น Frontmatter, Sections, Style, Safety
- Severity — Critical, High, Medium, Low, Info
- Finding — ปัญหาที่พบ
- Evidence — file path และ line number
- Action — สิ่งที่ต้องทำ

## Next Action

หลัง report ให้ทำ `/suggest-next-action` เพื่อแนะนำ action ถัดไปตาม score และ grade

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ของ subagent files, frontmatter fields, sections, style rules และ safety rules ใน scope ที่ review ครบ | reviewed / total × 100 |
| False Positive Rate | % ของ findings ที่ไม่ใช่ปัญหาจริง | false positives / total findings × 100 |
| Evidence Strength Score | % ของ findings ที่มี evidence (file path หรือ line number) | findings with evidence / total findings × 100 |
| Actionability Score | % ของ findings ที่มีคำแนะนำชัดเจน | actionable findings / total findings × 100 |
| Severity Distribution | จำนวน findings แยกตาม severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | ระยะเวลาโดยประมาณในการแก้ | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | การปรับปรุงคะแนนระหว่างก่อนและหลัง | (after - before) / before × 100 |
| Risk Exposure Index | จำนวน Critical/High findings ใน permissions, allowed-tools, secrets, safety และ hardcoded paths | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % ของ findings อยู่ใน subagent scope ที่ประกาศ | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % ของ findings ที่มี file path/line/reference ครบ | documented findings / total findings × 100 |
