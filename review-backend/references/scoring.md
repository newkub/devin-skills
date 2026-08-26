# Backend Review Score Formula

## Scope

สูตรคำนวณ review score สำหรับ backend review ทุก dimension

## Score Formula

คำนวณ review score จาก severity ของ findings แต่ละ dimension แล้วหา weighted average

### Severity Weights

- `Critical` = 0
- `High` = 25
- `Medium` = 50
- `Low` = 75
- `Info` = 100

### Calculation

1. แต่ละ dimension คำนวณ score จาก findings: `dimension_score = weighted_average(severity_weights)`
2. `overall_score = average(dimension_scores)` ของทุก dimension ที่รัน
3. ถ้า dimension ถูกข้าม → ไม่นำมาคำนวณ overall

## Dimensions

- `api` — API design, versioning, docs, errors, rate limiting
- `service` — service layer organization, boundaries, business logic, transactions, DI
- `database` — schema, query, index, integrity, connection, migrations
- `data-flow` — data lineage, mapping, schema consistency, impact
- `data-fetching` — loading, cache, optimistic, pagination, race conditions
- `data-validation` — Zod schemas, input/output validation, data contracts, transformation safety
- `integration` — API client design, timeout, retry, circuit breaker, vendor lock-in, fallback

## Reporting

- รายงาน score ต่อ dimension และ overall ผ่าน `/report` พร้อม `/report-table`
- จัดลำดับ findings ตาม severity: Critical → High → Medium → Low
- แนะนำ action ถัดไปผ่าน `/suggest-next-action`
