# Architecture Review Score Formula

## Goal

คำนวณ architecture review score จาก findings และ metrics ที่ตรวจพบ

## Score Dimensions

1. `patterns-boundaries` — architecture patterns และ boundaries
2. `modularity` — module boundaries, cohesion, coupling
3. `isolation` — state, side effects, test, environment, data isolation
4. `resilience` — retries, timeouts, circuit breakers, fallback, rate limiting
5. `reliability` — failure points, redundancy, observability, DR, predictability, concurrency
6. `governance` — ownership, policies, review process, maintenance

## Severity Weights

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

## Formula

```
dimension_score = weighted_average(severity_weights of findings in dimension)
overall_score = average(dimension_scores) × 100 / 100
```

- 0 = ทุก finding เป็น Critical
- 100 = ไม่มี finding

## Grade

- A: 90-100
- B: 80-89
- C: 70-79
- D: 60-69
- F: <60

## Status Indicators

- ✅ = score 100 สำหรับ dimension (ไม่มี finding)
- ⚠️ = score 50-99 สำหรับ dimension (มี finding Medium ขึ้นไป)
- ❌ = score <50 สำหรับ dimension (มี finding Critical หรือ High)

## Metric Scoring (Modularity Example)

- 5 metrics หลัก: module boundaries, cohesion, coupling, circular dependencies, module size
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / 5) × 100%

## Usage

- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- รายงาน progress bar และ grade ใน report

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % modules/boundaries reviewed | reviewed modules / total modules × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with diagram/dependency evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with refactoring path | actionable findings / total findings × 100 |
| Coupling Index | module interdependency | count of cross-module imports × severity |
| Cyclic Dependency Count | circular dependency cycles | count of cycles |
| Modularity Score | boundary strength | cleanly bounded modules / total × 100 |
| Resilience Coverage | % paths with fallback/retry | resilient paths / critical paths × 100 |
| Tech Debt Concentration | debt in critical modules | debt findings in critical / total debt |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Coupling Index | ระดับการพึ่งพากันของ modules | count of cross-module imports × severity |
| 2 | Cyclic Dependency Count | จำนวน dependency cycles | count of circular dependency cycles |
| 3 | Modularity Score | % modules with clean boundaries | cleanly bounded modules / total × 100 |
| 4 | Resilience Coverage | % critical paths with fallback/retry/timeout | resilient paths / critical paths × 100 |
