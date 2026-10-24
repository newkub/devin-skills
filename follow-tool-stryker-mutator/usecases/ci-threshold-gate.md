# Use Case — CI Threshold Gate With Incremental Runs

> Turn the mutation score into a CI gate that fails a pull request when coverage of behavior drops, without paying for a full run on every push. Sources: https://stryker-mutator.io/docs/stryker-js/incremental/ and https://stryker-mutator.io/docs/General/dashboard/ (accessed 2026-10-23)

## 1. Set a baseline from a real run

```json
{
  "thresholds": { "high": 80, "low": 60, "break": 50 }
}
```

`high`/`low` only color the report. `break` is the gate: a mutation score below it exits non-zero. Pick `break` from the current measured score minus a small margin, then ratchet it up as the suite improves. Setting `break: 80` on a project that scores 55 fails every build on day one.

## 2. Turn on incremental mode

```json
{
  "incremental": true
}
```

Stryker writes `reports/stryker-incremental.json` and reuses the result of unchanged files on the next run. Two rules keep it honest:

- Cache the incremental file between CI runs (keyed on the base branch), or the file is always empty
- Never treat the incremental score as the real score — it is a partial report that skips files whose mutations and tests did not change

A scheduled nightly job with `incremental: false` keeps the full picture, so a suite that rots in an unchanged file is still caught.

## 3. Wire the workflow

```yaml
name: mutation
on:
  pull_request:
    branches: [main]

jobs:
  stryker:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
        with:
          fetch-depth: 0
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - uses: actions/cache@v4
        with:
          path: reports/stryker-incremental.json
          key: stryker-${{ github.base_ref }}-${{ github.sha }}
          restore-keys: stryker-${{ github.base_ref }}-
      - run: bunx stryker run
        env:
          STRYKER_DASHBOARD_API_KEY: ${{ secrets.STRYKER_DASHBOARD_API_KEY }}
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: mutation-report
          path: reports/mutation/
```

`fetch-depth: 0` is required so Stryker can diff against the base branch when deciding what to mutate. Without it the diff-based filtering sees no history and runs everything.

## 4. Scope a pull request run to the change

```bash
bunx stryker run --since origin/main --mutate "src/**/*.ts,!src/**/*.test.ts"
```

`--since` mutates only files changed against the given revision. The CLI glob replaces the config value, so repeat the full `mutate` pattern including the exclusions — passing only `src/**/*.ts` silently starts mutating test files.

## 5. Fail fast on the threshold only

```bash
bunx stryker run --thresholds.break 60
```

The CLI value replaces the config value for that key. Use it in a branch job to compare a stricter gate before promoting it to `main`. Do not pass both a config `break` and a different CLI one and expect the stricter of the two — the CLI wins.

## 6. Report and verify

1. Run the workflow on a pull request that lowers coverage with a weak test and confirm the job fails on `break`
2. Re-run the same commit and confirm the cached incremental file shortens the run without changing the verdict
3. Open the uploaded `mutation-report` artifact and check survivors are listed per file
4. Run the nightly job once with `incremental: false` and confirm the score matches the sum of the incremental run plus skipped files

## Pitfalls

- Setting `break` above the current score, so the gate is red before the work starts.
- Caching on `github.sha`, which produces a new cache key every commit and never hits.
- Skipping `fetch-depth: 0`, which disables diff-based scoping and silently hides the savings.
- Relying on the incremental report as the release score — it omits unchanged files.
- Uploading `reports/mutation/` as the only artifact without `if: always()`, so a failing gate loses its report.
- Passing the dashboard key as a plain `env:` at workflow level instead of a repository secret.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/stryker.md`
- `usecases/first-mutation-run.md`
- `workflows/optimize-mutation/SKILL.md`
