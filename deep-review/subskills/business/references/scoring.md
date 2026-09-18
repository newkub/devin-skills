---
name: scoring
description: คำนวณ review score และ supplementary metrics สำหรับ business review
---

# Scoring

## Health Score

- คำนวณ review score เป็น percentage (0-100)
- 0 = ทุก finding เป็น Critical, 100 = ไม่มี finding
- แสดง score ต่อ dimension และ overall score
- ใช้ score เปรียบเทียบ before/after ในการปรับปรุง

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % business flows reviewed | reviewed flows / total flows × 100 |
| False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with rule/flow evidence | findings with evidence / total findings × 100 |
| Actionability Score | % findings with business fix | actionable findings / total findings × 100 |
| Payment Flow Coverage | % payment paths with safeguards | covered paths / total payment paths × 100 |
| Multi-Tenancy Isolation | tenant isolation gap count | count of tenant leakage findings |
| Feature Flag Consistency | % feature checks matching rollout | consistent flags / total flags × 100 |
| Subscription Edge Cases | subscription lifecycle checks | checked transitions / total transitions × 100 |
| Realtime Consistency | % realtime flows with conflict handling | handled flows / total realtime flows × 100 |
| Before/After Trend | score improvement | (after - before) / before × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Payment Flow Coverage | % payment paths with safeguards | covered payment paths / total payment paths × 100 |
| 2 | Feature Flag Consistency | % feature checks matching rollout state | consistent flags / total flags × 100 |
| 3 | Subscription Edge Case Coverage | % subscription transitions checked | checked transitions / total transitions × 100 |
| 4 | Realtime Consistency | % realtime flows with conflict handling | handled realtime flows / total realtime flows × 100 |
