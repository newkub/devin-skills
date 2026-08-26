# Delivery Review Score Formula

## Goal

คำนวณ review score เป็น percentage (0-100) สำหรับ delivery review ทุก dimension

## Scope

ใช้สำหรับคำนวณ score ต่อ dimension และ overall score ของ delivery review

## Score Formula

### Per-Dimension Score

แต่ละ dimension คำนวณ score จาก weighted average ของ findings ใน dimension นั้น:

```
dimension_score = sum(finding_weight) / count(findings)
```

### Finding Weights

| Severity | Weight | Score |
|---|---|---|
| Critical | 0 | 0 |
| High | 25 | 25 |
| Medium | 50 | 50 |
| Low | 75 | 75 |
| Info | 100 | 100 |

- ถ้า dimension ไม่มี finding → score = 100
- ถ้าทุก finding เป็น Critical → score = 0

### Overall Score

```
overall_score = sum(dimension_score) / count(dimensions)
```

- นับเฉพาะ dimensions ที่ไม่ถูก skip
- แสดง score ต่อ dimension และ overall score

## Dimensions

1. Documentation
2. SEO
3. Developer Experience
4. Analytics
5. Testing
6. PR Review
7. Logging And Debugging
8. Versioning
9. Build Efficiency
10. Config Health
11. CI/CD Pipeline
12. Infrastructure
13. Performance
14. Security

## Usage

- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- แสดง score ในตารางด้วย `/report-table`
- รายงาน score ต่อ dimension และ overall score
- ระบุ dimensions ที่ถูก skip ใน report

## Rules

- คำนวณ score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- ไม่นับ dimensions ที่ถูก skip ใน overall score
- ใช้ score เปรียบเทียบ before/after เท่านั้น ไม่ใช้สำหรับ pass/fail
