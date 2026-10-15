# Deep Test — Property Domain

Run property-based and fuzz tests — verify invariants on generated inputs instead of single examples, shrink to the minimal counterexample (merged from `/test-property`)

Signals: `fast-check`, `proptest`, `hypothesis`, `go test -fuzz`, `cargo-fuzz`, `quickcheck`

- Fixed example tests → `/deep-test unit`; assertion strength → `/deep-test mutation`; throughput fuzz → `/deep-test load`; writing new properties → `/update-tests` + `/follow-lib-fast-check`

## 1. Detect

> Goal: find the property/fuzz library and runner

1. JS/TS → `fast-check` (`fc.assert`, `fc.property`); Rust → `proptest`/`cargo-fuzz` (`fuzz_targets/`); Python → `hypothesis` (`@given`); Go → `go test -fuzz=FuzzX`
2. Runner for that ecosystem (`bunx vitest run`, `cargo test`, `pytest`, `go test`)

## 2. Run

> Goal: bounded runs with reproducible seeds

1. Limit runs/duration to suit CI (`--runs`, `numRuns`, `-fuzztime`)
2. Record the seed/counterexample for every failure — the seed is essential for repro
3. Fuzz targets → run time-boxed (e.g. `-fuzztime=60s`), never open-ended

## 3. Classify

> Goal: turn failures into minimal repros

1. Counterexample / shrunk case → real source bug → `/resolve-errors` with the minimal input
2. Generator wrong / contradicts the spec → test → `/update-tests`
3. Timeout/env limit → environment
4. Same failure repeating ≥3 → stop + report

## 4. Report

> Goal: persist properties, seeds, and counterexamples

1. Persist → `.devin/temp/report/<workspace>/property-test-<time>.md` — properties passed, seeds, minimal counterexamples
2. All passed → `/run-verify`

## Rules

### 1. Reproducibility

- Every failure must record the seed + shrunk counterexample — never report "failed" without a repro input

### 2. No Weakening

- Never lower `numRuns` or add arbitrary constraints just to pass — that is equivalent to weakening the assertion

### 3. Time Bounds

- Fuzz runs must always be time-boxed; never leave a fuzzer running

## Expected Outcome

- Property/fuzz tests fully run with reproducible seeds
- Failures classified with a minimal counterexample
- Report persisted in `.devin/temp/report/`
