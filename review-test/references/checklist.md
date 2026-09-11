# review-test — Full Dimension Checklist

## 1. Coverage

- [ ] meaningful coverage: branches, paths, not just lines
- [ ] critical paths covered, risk-weighted gaps
- [ ] mutation score ถ้าวัดได้

## 2. Edge Cases

- [ ] boundaries, empty/null, max, error paths
- [ ] concurrency, timing, ordering cases
- [ ] input fuzzing/property tests where valuable

## 3. Isolation

- [ ] tests independent, no shared mutable state
- [ ] no order dependency, parallelizable
- [ ] external systems mocked at right boundary (no over-mock)

## 4. Pyramid And Types

- [ ] unit > integration > e2e balance
- [ ] contract tests, snapshot tests ใช้ถูกจุด
- [ ] visual/a11y/perf tests ถ้า relevant

## 5. Flaky And Regression

- [ ] flaky test rate tracked, quarantine process
- [ ] regression tests for past bugs
- [ ] deterministic: no time/random deps uncontrolled

## 6. Quality

- [ ] assertions meaningful, no vacuous tests
- [ ] test names describe behavior
- [ ] setup/teardown clean, fixtures reusable
- [ ] test speed reasonable, CI fit

## Scoring

- pass = 1, warning = 0.5, fail = 0; grade A (90+), B (80+), C (70+), D (60+), F (<60)
