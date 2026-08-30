# Test Review Score

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Mutation Score | % ของ mutants ที่ test suite ตรวจพบได้ | killed mutants / total mutants × 100 |
| 2 | Critical-Path Coverage | % ของ critical paths ที่มี tests ครอบคลุม | covered critical paths / total critical paths × 100 |
| 3 | Flaky Rate | % ของ tests ที่ fail ไม่สม่ำเสมอ | flaky tests / total tests run × 100 |
| 4 | Test Duration Percentile | ระยะเวลา test ที่ p95/p99 | p95/p99 of test durations |
| 5 | Defect Escape Rate | % ของ defects ที่หลุดไป production | escaped defects / total defects × 100 |
