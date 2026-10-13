# Scoring

Compute the review score for a pull request review

## Severity Weights

- Critical = 0
- High = 25
- Medium = 50
- Low = 75
- Info = 100

## Score Calculation

review score = weighted average of all findings

## Grade Mapping

- A: 90+ (excellent)
- B: 80+ (good)
- C: 70+ (pass)
- D: 60+ (needs improvement)
- F: <60 (fail)

## Action Threshold

- Score < 70 → recommend fixing the PR before merge
- Score >= 70 → ready to merge per the recommendations

## Supplementary Metrics

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % of PR files, commits, metadata, CI checks, and in-scope review categories that were fully reviewed | reviewed / total × 100 |
| False Positive Rate | % of findings that are not real problems | false positives / total findings × 100 |
| Evidence Strength Score | % of findings that have a file path, line number, or commit reference | findings with evidence / total findings × 100 |
| Actionability Score | % of findings with clear recommendations | actionable findings / total findings × 100 |
| Severity Distribution | Number of findings broken down by severity | count of Critical/High/Medium/Low/Info |
| MTTR Estimate | Estimated time to resolve | Critical=1d, High=3d, Medium=7d, Low=14d average |
| Before/After Trend | Score improvement between before and after | (after - before) / before × 100 |
| Risk Exposure Index | Count of Critical/High findings in security-sensitive files, auth, API, breaking changes, and CI | count of Critical/High findings in critical scope |
| Scope Boundary Adherence | % of findings within changed files and the declared PR scope | in-scope findings / total findings × 100 |
| Documentation/Report Quality | % of findings with a complete file path/line/reference | documented findings / total findings × 100 |

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | PR Size | PR size measured by changed lines or files | changed lines + changed files |
| 2 | Review Coverage | % of changed files in the PR that were reviewed | reviewed files / changed files × 100 |
| 3 | CI Status Pass Rate | % of CI checks that passed in the PR | passed checks / total checks × 100 |
| 4 | Conflict Rate | % of PRs or files with merge conflicts | conflicting PRs / total PRs × 100 |
