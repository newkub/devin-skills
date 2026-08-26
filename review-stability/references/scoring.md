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
- score ต่อ dimension: app-stability, error-handling, debuggability
- overall score = weighted average ของทุก dimension

## Dimensions

- `app-stability`: crashes, error boundaries, health checks, monitoring, recovery
- `error-handling`: try-catch, unhandled rejections, error messages, error codes, degradation
- `debuggability`: logging quality, error message clarity, naming, complexity

## Score Interpretation

- 0-24: ต้องแก้ด่วน (Critical issues มาก)
- 25-49: มี High issues ต้องจัดการ
- 50-74: มี Medium issues ควรปรับปรุง
- 75-100: มีเพียง Low/Info issues สภาพดี

## Output

- review score ต่อ dimension และ overall
- จัดลำดับตาม severity: Critical → High → Medium → Low
- รายงานเป็นตารางด้วย `/report-table`
