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

- ผ่าน = 1.0 — ผ่านเกณฑ์ ไม่มี critical หรือ high findings
- เตือน = 0.5 — มี medium หรือ low findings ต้องระวัง
- ไม่ผ่าน = 0.0 — มี critical หรือ high findings ต้องแก้ก่อน

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

## Supplementary Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % tests reviewed for quality | reviewed tests / total tests × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with test output evidence | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear next action | actionable findings / total findings × 100 |
| 5 | Flaky Rate | % tests that fail inconsistently | flaky tests / total tests run × 100 |
| 6 | Coverage Trend | coverage change over time | (after - before) / before × 100 |
| 7 | Mutation Score | test quality by mutation testing | killed mutants / total mutants × 100 |
| 8 | Test Pyramid Balance | unit:integration:e2e ratio | abs(unit% - 70) + abs(integration% - 20) + abs(e2e% - 10) |
| 9 | MTTR Estimate | estimated time to fix failures | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 10 | CI Confidence Score | tests passing consistently in CI | successful CI runs / total runs × 100 |
