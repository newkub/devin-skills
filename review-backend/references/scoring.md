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

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % backend dimensions in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical areas (API, database, or integration) | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % findings inside declared scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Endpoint Coverage | % backend endpoints documented and tested | documented+tested endpoints / total × 100 |
| 2 | API Contract Coverage | % endpoints with matching request/response contract | endpoints with matching contract / total × 100 |
| 3 | N+1 Rate | % endpoints with detected N+1 query issues | N+1 detected queries / total endpoints × 100 |
| 4 | Idempotency Coverage | % state-changing endpoints with idempotency guard | idempotent endpoints / state-changing endpoints × 100 |
| 5 | Data Lineage Completeness | % data flows with full source-to-sink lineage | data flows with full lineage / total data flows × 100 |
