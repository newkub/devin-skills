# Scoring Formula

## Weighted Average

review score = weighted average ของ findings ทั้งหมด

| Severity | Score |
|----------|-------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Calculation

1. รวบรวม findings ทั้งหมดจากทุก section
2. กำหนด severity ให้แต่ละ finding
3. คำนวณ weighted average: `sum(severity_score) / count(findings)`
4. ถ้าไม่มี finding → score = 100

## Grade Thresholds

| Grade | Score Range | Meaning |
|-------|-------------|---------|
| A | 90+ | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Fair |
| D | 60-69 | Poor |
| F | <60 | Failing |

## Per-Dimension Score

- คำนวณ score ต่อ dimension (metrics, tracing, logging, etc.)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Action Threshold

- Score < 70 → แนะนำให้แก้ไขก่อน release
- Score 70-79 → แนะนำให้แก้ไขในรอบถัดไป
- Score 80+ → ผ่านเกณฑ์, ติดตาม medium/low ตามลำดับ
