# Performance Review Score Formula

## Goal

คำนวณ review score เป็น percentage (0-100) สำหรับ performance review ทุก dimension

## Scope

ใช้สำหรับคำนวณ score ต่อ dimension และ overall score ของ performance review

## Score Formula

### Per-Dimension Score

แต่ละ dimension คำนวณ score จาก weighted average ของ findings ใน dimension นั้น:

```
dimension_score = sum(finding_weight) / count(findings)
```

### Finding Weights

| Severity | Weight | Score |
|---|---|---|
| Critical | 0 | 0 |
| High | 25 | 25 |
| Medium | 50 | 50 |
| Low | 75 | 75 |
| Info | 100 | 100 |

- ถ้า dimension ไม่มี finding → score = 100
- ถ้าทุก finding เป็น Critical → score = 0

### Overall Score

```
overall_score = sum(dimension_score) / count(dimensions)
```

- นับเฉพาะ dimensions ที่ไม่ถูก skip
- แสดง score ต่อ dimension และ overall score

## Dimensions

1. Network And API
2. Bundler And Build
3. Runtime And CPU
4. Memory
5. I/O And Database
6. Caching And Complexity

## Usage

- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- แสดง score ในตารางด้วย `/report-table`
- รายงาน score ต่อ dimension และ overall score
- ระบุ dimensions ที่ถูก skip ใน report

## Rules

- คำนวณ score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- ไม่นับ dimensions ที่ถูก skip ใน overall score
- ใช้ score เปรียบเทียบ before/after เท่านั้น ไม่ใช้สำหรับ pass/fail

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % hot paths profiled/audited | reviewed hot paths / total hot paths × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with profile/measurement evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear optimization path | actionable findings / total findings × 100 |
| Core Web Vitals Score | CWV pass rate | passing pages / total pages × 100 |
| Hot Path Bottleneck Count | slow operations on critical paths | count of high/critical findings on hot paths |
| Cache Hit/Miss Estimate | cache effectiveness | hits / (hits + misses) from metrics |
| N+1 Query Count | repeated queries detected | count of N+1 patterns |
| Memory Leak Risk | unbounded collections/listeners | count of leak patterns × severity |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | p50/p95/p99 latency | ค่า latency ที่ percentile 50, 95, 99 | วัดจาก profiling/logs ของ critical paths |
| 2 | Throughput | จำนวน request หรือ operation ต่อหน่วยเวลา | รวม request / ช่วงเวลา (วินาที/นาที) |
| 3 | Core Web Vitals pass rate | % ของหน้าที่ผ่าน LCP, INP, CLS | หน้าที่ผ่าน CWV / รวมหน้า × 100 |
| 4 | Bundle budget delta | ความต่างของ bundle size จริงกับ budget | actual bundle size - budget size |
| 5 | Query count per request | ค่าเฉลี่ย query ต่อ request | รวม query / รวม request |
