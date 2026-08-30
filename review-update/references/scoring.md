# Update Health Score

## Goal

คำนวณ update health score จาก drift ทุก area

## Scoring

- drift areas: runtimes, dependencies, docs, config, rules, tests, features, subagents
- คะแนนต่อ area: no drift = 1, minor drift = 0.5, major drift = 0
- Update health score = (total score / total areas) × 100%
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)

## Drift Severity Weights

| Severity | Weight |
|----------|--------|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Action Threshold

- Score < 70 → แนะนำ `update-*` skills ตาม priority order
- Score < 50 → หยุดและ report

## Report Format

- Drift Report columns: Area, Drift Type, Current, Target, Severity
- Update Priority columns: Priority, Update Skill, Drift Area, Effort, Impact

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % drift areas in scope that were reviewed | reviewed / total × 100 |
| False Positive Rate | % drift findings that are false positives | false positives / total findings × 100 |
| Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| Actionability Score | % findings with clear update recommendation | actionable findings / total findings × 100 |
| Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | estimated time to fix drift | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | score improvement over time | (after - before) / before × 100 |
| Risk Exposure Index | high-severity findings in critical drift areas | count of Critical/High findings in runtime/dependency/rules scope |
| Scope Boundary Adherence | % findings inside declared update-review scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % findings with proper location/reference | documented findings / total × 100 |
