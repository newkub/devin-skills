# Test Quality Score Formula

## Goal

คำนวณ test quality score จาก categories ที่ตรวจ

## Categories

ตรวจ categories ต่อไปนี้:

1. `coverage_gaps` — source-to-test mapping, function/branch coverage, coverage targets
2. `edge_cases` — happy path, error path, boundary, security, validation
3. `test_isolation` — no shared state, cleanup, fixtures, mock strategy, flakiness
4. `test_pyramid` — distribution 70/20/10, performance, test types, CI integration
5. `regression_coverage` — bug fix tests, critical path tests, mutation tests, CI automation
6. `test_quality` — DRY, no type casting, descriptive assertions, behavior over implementation

## Scoring

แต่ละ category ได้คะแนน:

- ✅ = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- ⚠️ = 0.5 — มี medium หรือ low findings ต้องระวัง
- ❌ = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

## Formula

```
test_quality_score = (sum(category_scores) / total_categories) × 100
```

## Grade

- A: 90-100 — test suite พร้อม run ได้เลย
- B: 80-89 — test suite พร้อม run แต่ระวัง medium findings
- C: 70-79 — test suite พร้อม run แต่ต้องเขียน tests เพิ่ม
- D: 60-69 — ควรเขียน tests เพิ่มก่อน run
- F: <60 — ต้องเขียน tests ใหม่ก่อน

## Go Or No-Go

- Score >= 70 และไม่มี critical gaps → Go
- Score < 70 หรือมี critical gaps → No-Go แนะนำให้เขียน tests ก่อน
