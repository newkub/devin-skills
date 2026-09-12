# Correctness Scoring Metrics

## Goal

Reference สำหรับ metrics ที่ใช้วัดผล review correctness

## Scope

ใช้ในขั้นตอน `Validate Score And Report` เพื่องคำนวณ coverage, actionability, risk, และ trend

## Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % functions/contracts reviewed | reviewed functions / total public functions × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with test/line evidence | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear fix | actionable findings / total findings × 100 |
| 5 | Edge Case Coverage | % happy/error/edge paths checked | checked cases / total expected cases × 100 |
| 6 | Invariant Violation Count | broken invariants | count of invariant findings |
| 7 | Concurrency Race Risk | race condition exposure | count of race findings × severity |
| 8 | Type Safety Gap | any/type assertions on critical paths | count of unsafe type usage |
| 9 | Test Correctness Rate | tests that actually verify behavior | meaningful tests / total tests × 100 |
| 10 | Before/After Trend | score improvement | (after - before) / before × 100 |

## Rules

- คำนวณ metrics หลังจากจัดลำดับ severity เสร็จแล้ว
- ใช้ข้อมูลจาก findings table ที่ report ได้
- ถ้าไม่สามารถคำนวณค่าใดค่าหนึ่งได้ → ระบุ `N/A` พร้อมเหตุผล

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Edge Case Coverage | % of edge cases reviewed | covered edge cases / total edge cases × 100 |
| 2 | Invariant Violation Count | number of broken invariants | count of invariant findings |
| 3 | Contract Coverage | % of contracts/interfaces verified | covered contracts / total contracts × 100 |
| 4 | Mutation Score | % of mutants killed by tests | killed mutants / total mutants × 100 |
