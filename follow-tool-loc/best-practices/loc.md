# loc — Best Practices

Fast lines-of-code counting — filtering and size analysis

## Recommended Patterns

- Run `loc` at the repo root — per-language summary; scope with paths (`loc src/`) or `/check-long-files`
- Use it for size signals, not as a productivity metric — LOC is only a proxy for complexity/maintenance surface
- Filter through gitignore-aware defaults — confirm generated/vendor dirs (node_modules, dist) are excluded
- Combine with `/check-long-files` (250-line rule) — loc for the overview, check-long-files per file
- Track trends: loc before/after a refactor — a large increase from refactoring is questionable

## Common Pitfalls

- LOC ≠ quality — use it to spot outliers (abnormally large files/dirs), not to cheer for numbers
- Generated code inflates counts — verify excludes before concluding
- Blank/comment lines: check which mode counts them — comparisons must use the same mode
- Monorepo: per-workspace counts are more meaningful than the total

## Usage

- Quick audit: `loc` → sorted output to find top offenders → drill in with file-level tools
- Reporting: pipe the output into `/report` tables — cite the per-language breakdown

## Do / Don't

| Do | Don't |
|----|-------|
| outlier detection | productivity KPI |
| exclude generated/vendor | count node_modules |
| combine with file-length checks | rely on LOC alone for quality |
| trend comparisons (before/after) | absolute LOC judgments |
