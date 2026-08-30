# Frontend Review Score Formula

## Goal

คำนวณ frontend review score จาก findings และ metrics ที่ตรวจพบ

## Score Dimensions

1. `components` — component architecture, composition, boundaries, reusability, API, organization
2. `state-management` — state organization, reactivity, side effects, persistence, immutability, hooks/composables design, effect cleanup
3. `rendering-performance` — re-renders, virtualization, code splitting, bundle, bottlenecks, event listener cleanup, passive listeners, debounce/throttle
4. `type-safety` — any usage, completeness, inference, generics, compatibility
5. `css-styling` — approach, organization, specificity, responsive, performance
6. `forms-error` — form validation, state, submit handling, accessibility, error boundaries, error handling, multi-step, dynamic forms
7. `testing` — component, hook, integration, E2E, test quality

## Severity Weights

| Severity | Weight | Score |
|---|---|---|
| Critical | 0 | 0 |
| High | 25 | 25 |
| Medium | 50 | 50 |
| Low | 75 | 75 |
| Info | 100 | 100 |

## Formula

```
dimension_score = sum(finding_weight) / count(findings)
overall_score = sum(dimension_score) / count(dimensions)
```

- 0 = ทุก finding เป็น Critical
- 100 = ไม่มี finding

## Grade Thresholds

| Grade | Score Range | Meaning |
|-------|-------------|---------|
| A | 90-100 | Excellent |
| B | 80-89 | Good |
| C | 70-79 | Fair |
| D | 60-69 | Poor |
| F | <60 | Failing |

## Status Indicators

- ✅ = score 100 สำหรับ dimension
- ⚠️ = score 50-99 สำหรับ dimension
- ❌ = score <50 สำหรับ dimension

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % ไฟล์ frontend ทีถูก review | reviewed files / total frontend files × 100 |
| False Positive Rate | % findings ทีเป็น false positive | false positives / total findings × 100 |
| Evidence Strength Score | % findings ทีมี file + line + snippet | findings with evidence / total findings × 100 |
| Actionability Score | % findings ทีมี actionable recommendation | actionable findings / total findings × 100 |
| Risk Exposure Index | จำนวน findings บน critical path ตาม severity | count critical/high findings on critical paths |
| Regression Risk Score | โอกาส breaking จากการแก้ไข | weighted severity of findings in public API × 100 |
| MTTR Estimate | ประมาณเวลาแก้ตาม severity | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | เปรียบเทียบ score ก่อน/หลัง | (after_score - before_score) / before_score × 100 |
| Bus Factor | คน maintain critical components | count unique authors on critical components |
| Mutation Score | คุณภาพ test จาก mutation testing | killed mutants / total mutants × 100 |

## Usage

- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- รายงาน progress bar และ grade ใน report
