---
title: Scoring
description: Formulas for review score, grade, and metrics
---

# Scoring

## Severity Weights

Each finding has a weight based on its severity:

| Severity | Weight |
|---|---|
| Critical | 0 |
| High | 25 |
| Medium | 50 |
| Low | 75 |
| Info | 100 |

## Score Calculation

review score = weighted average of all findings

```
score = sum(weight of each finding) / count of findings
```

### Example

- 1 Critical (0) + 1 High (25) + 1 Info (100) = 125 / 3 = 41.67 → Grade F

## Grade Mapping

| Grade | Score Range |
|---|---|
| A | 90 and above |
| B | 80 to 89 |
| C | 70 to 79 |
| D | 60 to 69 |
| F | below 60 |

## Action Threshold

- Score < 70 → recommend running `update-devin-global-subagents` before proceeding
- Score >= 70 → passes review and can proceed

## Report Format

Report via `/report table` with columns:

- Category — review category, e.g. Frontmatter, Sections, Style, Safety
- Severity — Critical, High, Medium, Low, Info
- Finding — the problem found
- Evidence — file path and line number
- Action — what needs to be done

## Next Action

After the report, run `/suggest-next-action` to recommend the next action based on score and grade

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % of in-scope subagent files, frontmatter fields, sections, style rules and safety rules fully reviewed | reviewed / total × 100 |
| False Positive Rate | % of findings that are not real problems | false positives / total findings × 100 |
| Evidence Strength Score | % of findings backed by evidence (file path or line number) | findings with evidence / total findings × 100 |
| Actionability Score | % of findings with clear recommendations | actionable findings / total findings × 100 |
| Severity Distribution | Number of findings broken down by severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | Estimated time to resolve | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | Score improvement between before and after | (after - before) / before × 100 |
| Risk Exposure Index | Count of Critical/High findings in permissions, allowed-tools, secrets, safety and hardcoded paths | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % of findings within the declared subagent scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % of findings with complete file path/line/reference | documented findings / total findings × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Subagent Profile Fit | % of subagents whose profile matches the task | matching profiles / total subagents × 100 |
| 2 | Context Accuracy | % of contexts passed to subagents that are correct | accurate contexts / total contexts × 100 |
| 3 | Subagent Coverage | % of tasks with a suitable subagent | tasks with subagent / total tasks × 100 |
