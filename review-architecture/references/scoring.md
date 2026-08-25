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
