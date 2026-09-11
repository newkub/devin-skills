# review-update — Full Dimension Checklist

## 1. Dependency And Runtime Drift

- [ ] outdated deps, runtime versions, toolchain pins
- [ ] security updates pending (เชื่อม `/run-audit`)
- [ ] breaking changes in pending majors

## 2. Docs Drift

- [ ] docs vs code reality, README/CHANGELOG currency
- [ ] command examples still work, paths exist

## 3. Config Drift

- [ ] config vs tool versions, deprecated options
- [ ] env-specific drift, template vs actual

## 4. Rules And Workflow Drift

- [ ] rules/skills referencing removed features
- [ ] CI workflows vs current stack, pinned actions stale

## 5. Test Drift

- [ ] tests covering removed/changed features
- [ ] skipped tests, stale snapshots

## 6. Features And Agents Drift

- [ ] FEATURES.md vs code, subagents vs current capabilities
- [ ] knowledge notes stale

## 7. Update Priority

- [ ] security > correctness > features > cosmetic
- [ ] batching strategy, update order by dependency

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
