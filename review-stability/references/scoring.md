# Stability Review Score Formula

## Severity Weights

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

## Calculation

- คำนวณ weighted average จาก severity ของทุก finding
- score = sum(severity_weight * count) / total_count
- score ต่อ dimension: app-stability, error-handling, debuggability, recovery
- overall score = weighted average ของทุก dimension

## Dimensions

- `app-stability`: crashes, error boundaries, health checks, monitoring, recovery
- `error-handling`: try-catch, unhandled rejections, error messages, error codes, degradation
- `debuggability`: logging quality, error message clarity, naming, complexity
- `recovery`: retry, circuit breaker, fallback, timeout, backoff, queue recovery

## Comprehensive Metrics

| Metric | Description | How To Calculate |
|---|---|---|
| Review Coverage Ratio | % error/crash paths reviewed | reviewed paths / total error paths × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with log/stack evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with actionable recommendation | actionable findings / total findings × 100 |
| Crash Recovery Coverage | % critical paths with recovery | paths with recovery / total critical paths × 100 |
| MTTR Estimate | estimated recovery time | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Error Classification Coverage | % errors with typed classification | classified errors / total errors × 100 |
| Before/After Trend | score improvement | (after - before) / before × 100 |
| Monitoring Coverage | % critical paths with monitoring | monitored paths / total critical paths × 100 |
| PII Leak Risk | sensitive data exposure in logs | findings with PII / total findings × 100 |

## Score Interpretation

- 0-24: ต้องแก้ด่วน (Critical issues มาก)
- 25-49: มี High issues ต้องจัดการ
- 50-74: มี Medium issues ควรปรับปรุง
- 75-100: มีเพียง Low/Info issues สภาพดี

## Output

- review score ต่อ dimension และ overall
- จัดลำดับตาม severity: Critical → High → Medium → Low
- รายงานเป็นตารางด้วย `/report-table`

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Crash-Free Session Rate | % ของ sessions ที่ไม่มี crashes | crash-free sessions / total sessions × 100 |
| 2 | MTTR | ระยะเวลาเฉลี่ยในการกู้คืนระบบ | total recovery time / incident count |
| 3 | Recovery Success Rate | % ของ recoveries ที่สำเร็จ | successful recoveries / total attempts × 100 |
| 4 | Error Budget Consumption | % ของ error budget ที่ใช้ไป | consumed budget / total budget × 100 |
| 5 | Recurring Error Frequency | ความถี่ของ errors ที่เกิดซ้ำ | recurring errors / total errors × 100 |
