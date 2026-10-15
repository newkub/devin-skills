# Stryker Mutator — Best Practices

Mutation testing for JS/TS — measures real test quality, not coverage

## Recommended Patterns

- `stryker init` → `stryker.conf.json` — testRunner (vitest/jest), mutate globs, reporters
- Scope `mutate` precisely: `src/**/*.ts` minus tests/generated — never mutate the test files themselves
- Incremental in CI — Stryker runs only the mutants touching changed code; make full runs a scheduled job
- `thresholds` config: `high: 80, low: 60, break: <baseline>` — CI fails when the score drops below break
- Surviving mutants = the test backlog — prioritize by code criticality, not by count

## Common Pitfalls

- Mutation score ≠ coverage — tests executing every line without asserting = mutants survive; coverage lies
- Runtime cost: mutants × test suite = heavy — scope files + incremental + parallel (`--concurrency`)
- False survivors: logging statements, error messages, edge conditions — use `ignore` comments/config only when justified
- Flaky tests = noisy mutants — fixing flakiness before mutation testing pays off
- Timeouts: mutants can create infinite loops — Stryker kills them with a timeout; `timeout` and `survived` are marked differently

## Workflow

- Baseline run → report → prioritize surviving mutants in core logic → write tests → re-verify
- Ratchet `thresholds.break` upward — start from the current score, then step up
- The Vitest runner (`@stryker-mutator/vitest-runner`) is faster than jest for new projects

## Do / Don't

| Do | Don't |
|----|-------|
| mutate src only | include tests/generated code |
| incremental + scheduled full runs | Full mutants on every commit |
| Ratchet thresholds up over time | Threshold 0 = noise |
| survivors → prioritized backlog | chase score 100% |
