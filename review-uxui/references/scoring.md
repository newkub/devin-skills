# UX/UI Review Score Formula

## Goal

คำนวณ UX/UI review score จาก findings และ metrics ที่ตรวจพบ

## Score Dimensions

1. `design-system` — design tokens, component library, compliance, theme support
2. `visual-design` — color, typography, spacing, layout, hierarchy, iconography
3. `interaction-design` — micro-interactions, loading, empty, error, feedback, gestures
4. `accessibility` — semantic HTML, ARIA, keyboard, contrast, screen reader
5. `handoff` — design specs, responsive, cross-browser, documentation

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

## Design Maturity Scorecard

5 dimensions, score 1-5:
- 1 = ad-hoc (no system, inconsistent)
- 2 = emerging (partial system, some consistency)
- 3 = established (system exists, mostly consistent)
- 4 = mature (system comprehensive, consistent)
- 5 = leading (system exemplary, fully documented, automated)

## Usage

- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง
- รายงาน progress bar และ grade ใน report
- รายงาน design maturity scorecard ควบคู่กับ review score

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % UI components/screens reviewed | reviewed components / total components × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with file + line + snippet | findings with evidence / total findings × 100 |
| Actionability Score | % findings with actionable recommendation | actionable findings / total findings × 100 |
| Design Maturity Scorecard | 1-5 score per design dimension | average of 5 dimension maturity scores |
| Accessibility Coverage | % WCAG success criteria checked | criteria checked / total applicable × 100 |
| Before/After Trend | score improvement after fixes | (after_score - before_score) / before_score × 100 |
| Design Debt Velocity | rate of design drift accumulation | new design inconsistencies / review cycle |
| Component Token Compliance | % components using design tokens | token-compliant components / total × 100 |
| Cross-Platform Consistency | consistency across breakpoints/platforms | consistent elements / total checked × 100 |

