# Use Case — First Mutation Run On A Vitest Project

> Take a project with a green vitest suite from zero to a readable mutation report in one sitting. Sources: https://stryker-mutator.io/docs/stryker-js/getting-started/ and https://stryker-mutator.io/docs/stryker-js/vitest-runner/ (accessed 2026-10-23)

## 1. Confirm the floor

```bash
node --version        # must be >= 22 for Stryker v10
bunx vitest run       # the whole suite must be green, twice
```

Run the suite twice before starting. A flaky test is reported as a killed mutant on one run and a survivor on the next, which makes the whole report unusable. Fix flakiness with `/update-tests` first.

## 2. Install the core and one runner

```bash
bun add -D @stryker-mutator/core @stryker-mutator/vitest-runner
bun add -D @stryker-mutator/typescript-checker   # TypeScript projects only
```

One runner plugin per project. Installing the jest and vitest runners together makes Stryker pick one by config and leave the other as dead weight.

## 3. Write the config by hand

`bunx stryker init` writes a working file, but it guesses `mutate` from the whole repo. Replace the generated glob so tests, configs, and generated code are never mutated:

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "vitest",
  "mutate": ["src/**/*.ts", "!src/**/*.test.ts", "!src/**/*.spec.ts"],
  "ignorePatterns": ["dist/**", "coverage/**", "reports/**"],
  "coverageAnalysis": "perTest",
  "reporters": ["html", "clear-text", "progress"]
}
```

`coverageAnalysis: "perTest"` records which test covers which mutant, so Stryker only runs the covering tests for each mutant. It is the single largest speed win and requires the runner to report per-test coverage — the vitest runner does.

## 4. Smoke a narrow slice

```bash
bunx stryker run --mutate "src/domain/pricing.ts"
```

The CLI option replaces the config value, so this mutates one file without editing the config. A first full run on a medium project takes tens of minutes; the narrow run proves the runner wiring in under a minute. Symptoms and causes:

| Symptom | Cause |
|---|---|
| `No tests were executed` | `mutate` glob matched nothing, or tests live outside the runner's include |
| Every mutant survives | tests do not assert on the mutated values; check the assertion, not Stryker |
| Every mutant errors | build/transform broken under mutation; run with `--logLevel trace` |
| Mutants time out | `timeoutMS` too low for a slow integration test, or the mutant loops forever |

## 5. Read the report by file

Open `reports/mutation/html/index.html`. The directory tree at the top shows the score per file; the file view lists each mutant with its line, the original code, the mutated code, and the covering tests. Work top-down by score, not by total: a single 20% file is a better target than a 95% file with one survivor.

- `Killed` — a test failed, the mutant is caught
- `Survived` — no test failed, this is your backlog
- `NoCoverage` — no test executes the line at all
- `Timeout` — the run hung; investigate the code path, do not add a test blindly
- `Ignored` — excluded by config or an inline `// Stryker disable` comment

## 6. Verify

1. Re-run the narrow scope — the same mutants appear with the same statuses
2. Run `bunx vitest run` — the suite is still green and was not modified by Stryker
3. Add `reports/` to `.gitignore` and commit the config file
4. Add `"test:mutation": "stryker run"` to `package.json`

## Pitfalls

- Leaving the generated `mutate: ["src/**/*.js"]` in place on a TypeScript project, so nothing is mutated.
- Setting `coverageAnalysis: "all"` on a large suite — correct, but every mutant runs the whole suite.
- Treating `NoCoverage` as a survivor — the fix is a first test that exercises the line, not a stronger assertion.
- Committing `reports/mutation/` — the HTML report is large and regenerable.
- Running Stryker on a suite that still has failing tests, which marks every mutant in that file as errored.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/stryker.md`
- `usecases/ci-threshold-gate.md`
- `workflows/setup-stryker/SKILL.md`
