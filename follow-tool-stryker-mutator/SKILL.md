---
name: follow-tool-stryker-mutator
description: Set up and use Stryker Mutator for mutation testing in JavaScript/TypeScript projects
argument-hint: "[scope]"
related:
  - deep-test
  - update-tests
  - run-test
  - follow-tool-vitest
  - follow-lang-typescript
  - follow-lang-javascript

---

## Goal

Set up and use Stryker Mutator for mutation testing to improve the quality of JavaScript/TypeScript tests

## Scope

For JavaScript, TypeScript, React, Angular, Vue, Svelte, and Node.js projects with a supported test runner

- Stryker measures test quality through mutants — it is not a test runner or coverage tool; run tests via `/deep-test` and check coverage via `improve coverage`
- Use it once tests pass and are stable — if tests still fail or are flaky, fix them first with `/update-tests`

- Latest: `@stryker-mutator/core@10.0.0` (verified 2026-10-23) — v10 requires Node.js 22+ (Node 20 dropped), ships babel 8, adds the `empty-expression-mutator`, filters mutants whose mutation is semantically empty, keeps a partial incremental report when a run exits unexpectedly, moves to mocha v12, and fixes the vitest runner; the typescript-checker's TS 7 support is experimental

## Execute

### Workflows

> Goal: Dispatch to the workflow matching the topic

| Topic | Workflow |
|-------|----------|
| setup | `workflows/setup-stryker/SKILL.md` — install, stryker config, test runner integration |
| optimize | `workflows/optimize-mutation/SKILL.md` — incremental mode, mutator filtering, concurrency, thresholds |

1. If the argument matches a topic → read and follow `workflows/<name>/SKILL.md` instead of the steps below
2. If not → follow the steps below normally

### 1. Installation

> Goal: Install Stryker and the test runner plugin

1. Check Node.js >= 22 and the current test runner (jest, vitest, mocha, jasmine)
2. Install `@stryker-mutator/core` with `bun add -D @stryker-mutator/core`
3. Install the runner plugin, e.g. `bun add -D @stryker-mutator/vitest-runner`
4. Install the TypeScript checker if you use TypeScript: `bun add -D @stryker-mutator/typescript-checker`
5. Set `"testRunner"` and `"checkers": ["typescript"]` in the config; install one runner plugin per project, not several
6. Confirm the runner works on its own (`bunx vitest run` or `bunx jest`) before adding Stryker on top

### 2. Initialize and Configure

> Goal: Create the Stryker config

1. Run `bunx stryker init` to generate the config
2. Check `stryker.config.json` or `stryker.config.mjs`
3. Set the core keys: `testRunner`, `mutate`, `ignorePatterns`, `coverageAnalysis`
4. Tune `mutators` — include `empty-expression-mutator` only when empty expressions exist in the code; exclude groups you do not want reported via `mutator.excludedMutations`
5. Pick `reporters`: `html`, `clear-text`, `progress`, and `dashboard` when you report to the Stryker Dashboard
6. Set `thresholds` (`high`, `low`, `break`) so CI fails when the score drops below the agreed baseline
7. Set `incremental: true` and let Stryker write `reports/stryker-incremental.json` for repeat runs
8. Remember CLI options replace the config-file value rather than adding to it — pass `--mutate` only when you want to override the whole glob

### 2.1 Suppress Mutants

> Goal: Exclude only the mutations that genuinely cannot be tested

1. `mutator.excludedMutations` — remove a mutator group project-wide (e.g. `StringLiteral`)
2. `// Stryker disable next-line <mutator>,<mutator>: <why>` — inline suppression with a reason
3. The ignore plugin — implement `shouldRun` for path/line based rules when the two above are not enough
4. `ignored` mutants are counted separately and do not affect the mutation score — suppression hides a hole, so record the reason

### 3. Run Mutation Testing

> Goal: Run mutation testing and review the results

1. Run `bunx stryker run`
2. Use `bunx stryker run --logLevel trace` if you hit problems
3. Review the report in `reports/mutation/html/index.html`
4. Identify surviving mutants, `NOT CAUGHT`, and `timeout` mutants

### 4. Improve Tests

> Goal: Add tests for the mutants that survived

1. Analyze the surviving mutants
2. Write additional tests to catch the missing cases
3. Run `/update-tests` to write quality tests
4. Run the regular tests first, then re-run Stryker

### 5. CI Integration

> Goal: Integrate Stryker with the CI pipeline

1. Add a step running `bunx stryker run` in GitHub Actions
2. Set up the Stryker Dashboard if you want to track the score
3. Use a budget or threshold if you have one
4. Upload the reports for review

## Rules

### 1. Test Quality

- Use Node.js >= 22 (Stryker v10)
- Stable tests are required before running Stryker
- Don't run Stryker when tests are flaky
- The build must work on the host platform

### 2. Configuration

- Use `coverageAnalysis: 'perTest'` for efficiency
- Define `mutate` explicitly
- Use `ignorePatterns` for files you don't want mutated

### 3. Mutant Handling

- Add tests for surviving mutants; never delete or weaken an existing test to make a mutant die
- `ignored` mutants are excluded from the score — suppress only with a written reason
- Treat `timeout` and `survived` differently: a timeout means the mutant hung, not that a test is missing
- Track the mutation score across runs and ratchet `thresholds.break` upward

### 4. Reports

- View the HTML report after each run
- `clear-text` for CI logs, `dashboard` for trends across branches
- Read survivors by file and line, not just the total score

## References

- [CLI reference](references/cli.md) — `stryker run` and `stryker init` options
- [API and config reference](references/apis.md) — package, config keys, thresholds
- [Best practices](best-practices/stryker.md) — recommended patterns and pitfalls
- Workflows: `workflows/setup-stryker/SKILL.md`, `workflows/optimize-mutation/SKILL.md`
- Calling skills: `/deep-test mutation`, `/update-tests`, `/run-test`, `/follow-tool-vitest`, `/follow-lang-typescript`, `/follow-lang-javascript`

### Use Cases

| Scenario | Use case |
|----------|----------|
| Green vitest suite → first readable mutation report | `usecases/first-mutation-run.md` |
| Score as a PR gate without a full run every push | `usecases/ci-threshold-gate.md` |

## Expected Outcome

- Stryker installed and working
- The mutation score is tracked
- Surviving mutants are identified and addressed
- Tests are of better quality
- CI runs mutation testing automatically

