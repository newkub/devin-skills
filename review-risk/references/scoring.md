# Risk Readiness Score

## Goal

คำนวณ risk readiness score จาก risk categories

## Scoring

- คะแนนต่อ category: ✅ = 1, ⚠️ = 0.5, ❌ = 0
- Risk readiness score = (total score / total categories) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Individual Risk Score

| Probability | Value |
|-------------|-------|
| high | 3 |
| medium | 2 |
| low | 1 |

| Impact | Value |
|--------|-------|
| high | 3 |
| medium | 2 |
| low | 1 |

risk score = probability value × impact value

## Severity Mapping

| Score | Severity |
|-------|----------|
| 9 | Critical |
| 6-8 | High |
| 3-5 | Medium |
| 1-2 | Low |

## Category Status

- category ผ่าน: ไม่มี critical/high risk ที่ไม่มี mitigation
- category เตือน: มี high risk แต่ mitigation ไม่ชัดเจน
- category ไม่ผ่าน: มี critical risk ที่ไม่มี mitigation หรือ rollback

## Action Threshold

- Score >= 90: proceed
- 70-89: proceed with caution
- <70: stop and mitigate

## Report Format

- Risk Register columns: No., Risk, Category, Probability, Impact, Score, Severity, Mitigation
- Risk Summary columns: Category, Status, Findings, Score
- Action Items columns: No., Risk, Action, Owner, Priority

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % risk categories and targets in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % risk findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line/plan) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear mitigation recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to mitigate risk | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity risks in critical target areas | count of Critical/High findings in production/critical path scope |
| Scope Boundary Adherence | % findings inside declared review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |
