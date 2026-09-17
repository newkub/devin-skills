---
title: Performance Page Template
description: Template for docs/references/performance.md - budgets and benchmarks
---

# Performance Page Template

```md
---
title: Performance
description: Bundle size, benchmarks, and performance budgets
---

# Performance

## Budgets

| No. | Metric | Budget | Current | Source |
|-----|--------|--------|---------|--------|
| 1 | <bundle size / startup / p95> | <target> | <measured> | <how measured> |

## Benchmarks

<command to reproduce — e.g. `bun run bench` — and latest numbers from real runs>

## Notes

- <known hot paths, tree-shaking notes, lazy-loading behavior>
```

## Rules

- Numbers must come from real runs or committed artifacts — never estimated claims
- If no benchmarks exist, write the budget table only and say how to measure
