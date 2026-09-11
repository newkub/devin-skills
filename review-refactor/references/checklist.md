# review-refactor — Full Dimension Checklist

## 1. SRP And Cohesion

- [ ] units doing one thing, >5 top-level symbols flagged (references/srp-violations.md)
- [ ] cohesion <0.3, unrelated members grouped

## 2. Size And Complexity

- [ ] files >300 lines, functions >50 lines, params >4 (references/long-files.md, function-quality.md)
- [ ] cyclomatic complexity >10, deep nesting

## 3. Imports And Boundaries

- [ ] import/export complexity, barrel misuse (references/imports-exports.md)
- [ ] package boundaries, cross-layer imports (references/package-boundaries.md)
- [ ] circular deps, coupling >7

## 4. Smells And Dead Code

- [ ] code smells, anti-patterns, dead code (knip, jscpd)
- [ ] duplication clusters, copy-paste drift

## 5. Structure And Relocation (merged: review-restructure)

- [ ] file naming, folder grouping, barrel exports (references/restructure-*.md)
- [ ] flat vs nested depth, relocation plan + dry-run preview
- [ ] dependency-direction-safe move ordering

## 6. Baseline And Priorities

- [ ] baseline metrics captured, health score (references/baseline-metrics.md)
- [ ] refactor targets prioritized: impact × effort

## Scoring

- ตาม references/scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
