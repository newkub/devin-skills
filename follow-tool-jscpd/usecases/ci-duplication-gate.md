# Use Case — Gate CI On New Duplication Only

> Legacy clones are a fact of an old codebase; the gate that helps is the one that fails only when a pull request adds a new clone. Sources: https://github.com/kucherenko/jscpd and `jscpd --help` (accessed 2026-10-21)

## 1. Start the config in report mode

```json
{
  "minLines": 5,
  "minTokens": 50,
  "threshold": 0,
  "reporters": ["console", "json"],
  "output": "report",
  "ignore": ["/node_modules/", "/dist/", "/.output/", "/coverage/", "/*.lock", "/bun.lock"]
}
```

`threshold: 0` means "never fail" — that is what you want while you are still learning what the codebase looks like. A CI job copied from this config will always pass, no matter how much duplication it finds.

## 2. Turn on the threshold

```sh
bunx jscpd . --threshold 10
```

The job now exits non-zero when total duplication reaches 10%. Pick the number from the current score, then lower it as duplication drops: a threshold above today's score is a gate that never fires.

```sh
bunx jscpd . --reporters json --output report
node -e "const r=require('./report/jscpd-report.json');console.log(r.statistics.total.percentage)"
```

Read the percentage first, then set the threshold slightly below it so the next regression is the thing that fails.

## 3. Prefer failing on new clones

```sh
bunx jscpd . --baseline .jscpd-baseline.json --fail-on-new-clones
```

A baseline records today's clones; only clones that are not in the baseline fail the run. That is the difference between "the repo is 23% duplicated" (unfixable in one sprint) and "this pull request added a 40-line clone" (fixable now).

```sh
bunx jscpd . --baseline-from-ref origin/main --fail-on-new-clones
```

`--baseline-from-ref` builds the baseline from another ref at run time — no committed baseline file to drift. Refresh a committed baseline deliberately with `--update-baseline` in its own commit, never inside a feature branch.

## 4. Guard against a green job that scanned nothing

```sh
bunx jscpd . --fail-on-empty --no-tips
```

An empty scan usually means a wrong path or an over-broad `ignore`, and by default jscpd warns and exits 0 — the pipeline is green and nothing was checked. `--fail-on-empty` turns that into a failure.

## 5. Publish findings where reviewers see them

```sh
bunx jscpd . --reporters sarif --output report
```

The SARIF file can be uploaded to GitHub Code Scanning, so a clone appears as a review annotation instead of a number in a log. `--exit-code N` changes the failure code when a CI system needs something other than 1.

## 6. Verify

1. Run the CI command locally against a branch that adds a known duplicate — it must exit non-zero
2. Run the same command on `main` — it must exit 0
3. Delete the report directory and re-run — the job must not depend on a stale report
4. Confirm the ignore list covers lockfiles and build output, or the score will be dominated by generated code
5. Hand every new clone to `/refactor` and re-run to confirm the count dropped

## Pitfalls

- Keeping `threshold: 0` in CI — report mode never fails, so the gate does nothing.
- Setting the threshold above the current score "for later" — later never comes.
- A committed baseline that is refreshed inside feature branches, which silences exactly the clones the gate exists to catch.
- Leaving `--update-baseline` in the CI command — it rewrites the baseline every run and the gate can never fail.
- Ignoring `node_modules` but not the lockfile or build output, so the score measures generated code.
- Treating an empty or path-mismatched scan as a pass.
- Splitting the scan per package and calling the sum "the repo score" — they are different numbers.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/jscpd.md`
- `usecases/monorepo-duplication-scan.md`
