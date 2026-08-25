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

## Metric Scoring Example (Components)

- 5 metrics หลัก: composition, boundaries, reusability, API, organization
- คะแนนต่อ metric: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Review score = (total score / 5) × 100%

## Usage

- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- รายงาน progress bar และ grade ใน report
