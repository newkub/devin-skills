# Scoring

## Weighted Average

review score = weighted average ของ findings ทั้งหมด

| Severity | Score |
|----------|-------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Calculation

1. รวบรวม findings ทั้งหมดจากทุก section
2. กำหนด severity ให้แต่ละ finding
3. คำนวณ weighted average: `sum(severity_score) / count(findings)`
4. ถ้าไม่มี finding → score = 100

## Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % services with observability | services with telemetry / total services × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with config/dashboard evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear config fix | actionable findings / total findings × 100 |
| RED/USE Coverage | % critical paths with RED/USE metrics | covered paths / critical paths × 100 |
| Trace Propagation Rate | % services propagating trace context | propagating services / total × 100 |
| Alert Fatigue Index | noisy alerts per actionable alert | total alerts / actionable alerts |
| SLO Coverage | % critical services with SLO | services with SLO / critical services × 100 |
| Log Retention Compliance | log retention matching policy | compliant categories / total × 100 |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Grade Thresholds

| Grade | Score Range | Meaning |
|-------|-------------|---------|
| A | 90+ | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Fair |
| D | 60-69 | Poor |
| F | <60 | Failing |

## Per-Dimension Score

- คำนวณ score ต่อ dimension (metrics, tracing, logging, etc.)
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Action Threshold

- Score < 70 → แนะนำให้แก้ไขก่อน release
- Score 70-79 → แนะนำให้แก้ไขในรอบถัดไป
- Score 80+ → ผ่านเกณฑ์, ติดตาม medium/low ตามลำดับ

## Validate, Score And Report

1. ทำ `/deep-validate` เพื่อ validate findings หลายมิติ
2. ทำ `/deep-validate` สำหรับ validate issues จากทุก section
3. จัดลำดับตาม severity: Critical → High → Medium → Low
4. คำนวณ review score ตามสูตรและ metrics ข้างต้น
5. ทำ `/report` พร้อม `/report-table`
6. ทำ `/suggest-next-action`
