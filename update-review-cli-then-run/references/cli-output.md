# CLI Output

`review-codebase` table output must show every detail per the spec — never show just a lone score or one line per category

## Findings Table (per category)

| No. | Domain | Category | Score | Grade | C | H | M | L | Status | Top Finding | Evidence | Fix Skill | Delta |
|-----|--------|----------|-------|-------|---|---|---|---|--------|-------------|----------|-----------|-------|

- `No.` is always the first column, numbered 1..n
- `C`/`H`/`M`/`L` = findings count by severity (Critical/High/Medium/Low)
- `Status` = `new` / `existing` / `regression` / `fixed` compared against the previous `reports/review-report.json` — important for the 3-round iteration of Step 8
- `Evidence` = the `file:line` of the top finding
- `Fix Skill` = from the `reviewWorkflow` map — `/deep-review` (domain `review-<domain>` in `## Review Domains`) for a domain finding, `/deep-review-then-fix` when a fix must be applied
- `Delta` = score diff compared against the previous `reports/review-report.json` (if there is a baseline)
- sort: Critical first → lowest score first

## Domain Summary Table (at the end)

| No. | Domain | Score | Grade | Categories | Findings | Errors | FP% | Trend |
|-----|--------|-------|-------|------------|----------|--------|-----|-------|

- `Trend` = up/down/flat compared to the previous run
- footer row: overall score + grade, `categories N/60`, total analyzer errors, duration

## Output Requirements

- non-TTY/CI → auto plain table, or use `--json`
- every row must have `Evidence` — never a row without file:line
- narrow screen → drop `Top Finding` first, never drop `Evidence`/`Fix Skill`
- exit code: `exit 1` when any trigger in Metric Triggers (`categories < 60`, `score < 70`/`grade D/F`, `domain < 50`, `analyzerErrors > 0`, `falsePositiveRate > 20%`) fires — CI gate + pass/fail auto-detect in Step 8
- filter flags: `--domain <name>` and `--severity <min>` to run only the failing parts in rounds 2-3 of Step 8 — no full scan needed every time
