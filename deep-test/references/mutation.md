# Deep Test — Mutation Domain

Measure test suite quality with mutation testing — make small code changes (mutants) and see whether the tests catch them — to find code with high coverage that the tests don't actually verify

- Tools per stack: Stryker (JS/TS), mutants-rs (Rust), mutmut (Python), go-mutesting (Go)
- Covers: mutation score (killed/survived/timeout), surviving mutants analysis, weak assertions
- Inherently slow — keep the scope narrow (module/PR diff), never run the whole repo

## 1. Select Tool And Scope

> Goal: Pick the mutation tool matching the ecosystem

1. Detect the stack from the manifest — pick the matching tool (`/follow-tool-stryker-mutator` for JS/TS)
2. Always limit the scope: choose important or recently changed modules/files — repo-wide mutation testing takes a very long time
3. Install the tool if missing (`npx stryker`, `cargo install cargo-mutants`)

## 2. Run Baseline

> Goal: Run mutation testing on the selected scope

1. Run against the current test suite — set a sensible timeout
2. Collect results: total mutants, killed, survived, timeout, no-coverage
3. Flag files with an unusually low mutation score

## 3. Analyze Survivors

> Goal: Understand the surviving mutants

1. Inspect surviving mutants — each one is a code change the tests don't catch
2. Classify: missing assertions (test runs but doesn't assert), equivalent mutants (the change makes no difference), boundary gaps
3. Separate out `no-coverage` mutants — code the tests never touch

## 4. Report

> Goal: Summarize the mutation score with weak spots

1. Use `/report`: `No.`, `File`, `Mutants`, `Killed`, `Survived`, `Score %`, `Weakest Area`
2. Report the top surviving mutants with suggested test cases
3. Recommend `/deep-review` for files with a low score

## Rules

### 1. Scoped Always

- Never run mutation testing repo-wide — always scope to a module/diff
- Warn the user about the time cost — mutation testing is inherently slow

### 2. Quality Over Score

- The goal is finding weak tests, not big numbers — surviving mutants matter more than the score
- Mark equivalent mutants (no semantic difference) instead of counting them as problems

### 3. Read-Only On Source

- The mutation tool temporarily modifies code in a sandbox — never touch the real source
- Verify the working tree is clean after the run

## Expected Outcome

- A mutation score per scoped module with a breakdown
- A list of surviving mutants = the real test gaps
- Recommendations for the test cases that should be added
