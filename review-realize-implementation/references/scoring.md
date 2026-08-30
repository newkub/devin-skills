# Implementation Completeness Score Formula

## Metrics

Metrics หลักสำหรับ implementation completeness:

1. TODO — จำนวน TODO comments ใน source code
2. FIXME — จำนวน FIXME comments ใน source code
3. HACK — จำนวน HACK comments ใน source code
4. MOCK — จำนวน MOCK implementations ใน production path
5. FAKE — จำนวน FAKE implementations ใน production path
6. STUB — จำนวน STUB implementations ใน production path
7. Placeholder — จำนวน placeholder implementations
8. Unfinished features — จำนวน features ที่ไม่สมบูรณ์
9. Missing types — จำนวน missing type definitions
10. Incomplete flows — จำนวน flows ที่ไม่สมบูรณ์
11. Missing features — จำนวน features ที่ขาด (API/database มีแล้วแต่ไม่มี UX)

## Scoring

- คะแนนต่อ metric: pass (0 items) = 1, warning (1-3 items) = 0.5, fail (>3 items) = 0
- Implementation completeness score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Score Display

แสดง score พร้อม progress bar และ grade:

```
Implementation Completeness: 72.7% [████████████████████░░░░░░░] Grade: C
```

## Metrics Table Format

ตาราง Implementation Metrics Summary มี columns: Metric, Count, Status

| Metric | Count | Status |
|--------|-------|--------|
| TODO | 5 | warning |
| MOCK | 0 | pass |
| STUB | 2 | warning |
| Incomplete flows | 1 | warning |
| Missing features | 3 | warning |

## Recommended Implementations Table Format

ตาราง Recommended Implementations มี columns: Priority, Action, Impact, Effort, Workflow

| Priority | Action | Impact | Effort | Workflow |
|----------|--------|--------|--------|----------|
| 1 | Replace MOCK in auth service | critical | low | `realize-implementation` |
| 2 | Add missing delete flow | high | medium | `realize-implementation` |

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % implementation gap categories in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % implementation findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear implementation recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix implementation gaps | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity gaps in critical production path | count of Critical/High findings in schema/data/API/UI critical path |
| Scope Boundary Adherence | % findings inside declared implementation scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Realization gap | % ของรายการใน plan ที่ยังไม่ได้ implement | รายการที่ขาด / รายการใน plan × 100 |
| 2 | Verification coverage | % ของรายการที่ implement แล้วและมี test ยืนยัน | รายการที่ verified / รายการที่ implement × 100 |
| 3 | Risk score | คะแนนความเสี่ยงของ implementation | ความเสี่ยง × น้ำหนัก severity / คะแนนเต็ม |
