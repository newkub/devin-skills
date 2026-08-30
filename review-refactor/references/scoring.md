# Refactor Health Score

## Goal

คำนวณ refactor health score จาก baseline metrics

## Scoring

- metrics: SRP violations, long files, function quality, imports/exports, package boundaries, code smells, dead code
- คะแนนต่อ metric: pass = 1, warning = 0.5, fail = 0
- Refactor health score = (total score / total metrics) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Severity Weights

| Severity | Weight |
|----------|--------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Action Threshold

- Score < 70 → แนะนำ `refactor`, `refactor-to-single-responsibility`, หรือ `refactor-workspace`
- Score < 50 → หยุดและ report

## Report Format

- Baseline Metrics columns: Metric, Count, Threshold, Status
- Refactor Targets columns: Target, Issue Type, Effort, Impact, Priority, Recommended Workflow

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % refactor target categories in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % refactor findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear refactor recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical production code | count of Critical/High findings in critical path |
| Scope Boundary Adherence | % findings inside declared refactor-review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Refactor benefit score | ประมาณค่าที่ได้จากการ refactor | (maintainability gain + ลดความเสี่ยง) / effort |
| 2 | Risk score | โอกาสที่ refactor จะเกิดปัญหา | risk findings / รวม refactor findings × 100 |
| 3 | Regression rate | % ของ code ที่ refactor แล้วเกิด test ล้มเหลว | tests ที่ล้มหลัง refactor / tests ก่อน refactor × 100 |
