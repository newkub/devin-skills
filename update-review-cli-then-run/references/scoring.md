# Codebase Review Score Formula

## Purpose

Formula for computing the review score and health indicator of a codebase

## Score Calculation

Compute the review score as a percentage (0-100):

- `0` = every finding is Critical
- `100` = no findings

## Score Breakdown

Show the score at both levels:

- overall score: the combined score for the whole codebase
- domain score: the score broken down by domain

## Grade Mapping

Convert the score to a letter grade:

- `A`: score >= 90
- `B`: score >= 80
- `C`: score >= 70
- `D`: score >= 60
- `F`: score < 60

## Before-After Comparison

Use the score to compare before/after during improvements:

1. Record the before score before running improvements
2. Make improvements per the findings
3. Run `bun run review-codebase` to measure the after score
4. Compare the delta to measure the impact of the improvements

## Category Coverage

The `categories` metric measures how comprehensively the review covered things:

- target: `categories >= 60`
- If below 60 → run `/update-create-analyze-cli` to add analyzers in `tools/analyze`, then run `deep-review` to integrate

## Health Indicator

Summarize the overall assessment as a health indicator:

- Based on the overall score, grade, and severity distribution of findings
- Displayed in the report alongside the findings table

## Severity Weights

Each severity has the following score weight:

- `Critical` = 0
- `High` = 25
- `Medium` = 50
- `Low` = 75
- `Info` = 100

## Weighted Average Calculation

review score = weighted average of all findings:

```
score = sum(severity_weight * count) / total_findings
```

Example:

- 1 Critical, 1 High, 1 Medium → (0 + 25 + 50) / 3 = 25
- 2 Low, 1 Info → (75 + 75 + 100) / 3 = 83.3

## Action On Low Score

If score < 70:

- Recommend running `/deep-review` before proceeding
- Identify the findings that need fixing
- Run `/suggest-next-action` to recommend the next step

## Report Format

Report results with `/report table`:

| Category | Severity | Finding | Evidence | Action |
|----------|----------|---------|----------|--------|

- Category — the type of check performed
- Severity — `Critical` | `High` | `Medium` | `Low` | `Info`
- Finding — the problem detected
- Evidence — file path, line number, code snippet
- Action — the action to take

## Evidence Format

Every finding must have:

- file path
- line number
- the code snippet causing the problem

## Supplementary Metrics

Use these metrics to measure the effectiveness and coverage of the review process:

| Metric | Description | How To Calculate |
|--------|-------------|------------------|
| Review Coverage Ratio | % codebase files scanned/reviewed | `scanned files / total files × 100` |
| False Positive Rate | % findings that are false positives | `false positives / total findings × 100` |
| Evidence Strength Score | % findings with tool/line evidence | `findings with evidence / total findings × 100` |
| Actionability Score | % findings with clear next action | `actionable findings / total findings × 100` |
| Category Coverage | % review categories executed | `executed categories / total categories × 100` |
| Sub-Review Completion | % recommended sub-reviews run | `completed / recommended × 100` |
| Analyzer Pass Rate | % analyzers producing valid output | `working analyzers / total analyzers × 100` |
| Critical Path Coverage | % critical paths reviewed | `reviewed critical / total critical × 100` |
| Issue Deduplication Rate | duplicate findings merged | `duplicates merged / total × 100` |
| Before/After Trend | score improvement | `(after - before) / before × 100` |

Record these metrics after each review round to compare before/after and decide on CLI improvements

## Domain-Specific Metrics

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Analyzer Pass Rate | % analyzers producing valid output | working analyzers / total analyzers × 100 |
| 2 | Category Coverage | % review categories executed | executed categories / total categories × 100 |
| 3 | Critical Path Coverage | % critical paths reviewed | reviewed critical / total critical × 100 |
| 4 | Deduplication Rate | % duplicate findings merged into one | duplicates merged / total × 100 |
