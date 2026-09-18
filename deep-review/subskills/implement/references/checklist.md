# review-implement — Full Dimension Checklist

## 1. Plan Readiness

- [ ] plan complete: steps, order, dependencies (references/plan-readiness.md)
- [ ] acceptance criteria per step, scope bounded
- [ ] required inputs/access available

## 2. Inventories

- [ ] MOCK/FAKE/STUB inventory (references/mock-inventory.md)
- [ ] TODO/FIXME/HACK inventory (references/todo-inventory.md)
- [ ] placeholders, dead paths, partial implementations

## 3. Task Sources

- [ ] queue tasks validated, GitHub issues actionable
- [ ] MVP scope vs full scope separated (references/mvp-scope.md)

## 4. Completeness (merged: review-implement-to-production)

- [ ] missing flows, UI, API, database gaps (references/completeness-*.md)
- [ ] critical path order: schema → data → API → UI/flow
- [ ] happy/error/recovery/rollback/undo/confirmation paths
- [ ] supporting features: validation, auth, audit, notifications, rate limits, tests, docs

## 5. Blockers

- [ ] realization blockers identified (references/realization-blockers.md)
- [ ] external dependencies, approvals, access

## 6. Prioritization

- [ ] implementation order: dependencies → critical path → risk
- [ ] effort/impact per item

## Scoring

- ตาม references/scoring.md + completeness-scoring.md; grade A (90+), B (80+), C (70+), D (60+), F (<60)
