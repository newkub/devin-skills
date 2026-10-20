# Use Case — Outdated-Dependency Drift Report in CI

> Surface drifting dependencies on a schedule without letting the job rewrite the repo. Source: https://github.com/antfu/taze (accessed 2026-10-20)

## 1. Report-only run

```bash
bunx taze -r --include "dependencies,devDependencies" > taze-report.txt
```

No `-w`: the command only prints. Exit code is 0 even when updates exist, so do not expect it to fail the build on its own.

## 2. Turn drift into a signal

```yaml
# .github/workflows/deps-drift.yml
name: deps-drift
on:
  schedule: [{ cron: "0 6 * * 1" }]
  workflow_dispatch:
jobs:
  drift:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
      - run: bun install --frozen-lockfile
      - run: bunx taze -r > taze-report.txt
      - name: Fail on outdated
        run: |
          if grep -q "dependencies" taze-report.txt; then
            echo "outdated dependencies found"; cat taze-report.txt; exit 1
          fi
      - uses: actions/upload-artifact@v4
        if: always()
        with: { name: taze-report, path: taze-report.txt }
```

The grep is a coarse trigger; the artifact is what humans read.

## 3. Prefer an updater bot for the routine case

A scheduled `taze` job tells you drift exists; a bot (Renovate/Dependabot) opens the actual PRs with changelogs. Use `taze` for a local, opinionated pass and the bot for the long tail.

## 4. Act on the report

```bash
bunx taze -I          # choose what to take now
bunx taze -r -w       # or take all non-majors
```

## Pitfalls

- Expecting a non-zero exit from a report-only run → the workflow is green while dependencies rot.
- Committing `taze-report.txt` → a churn file; upload it as an artifact instead.
- Weekly drift checks with no owner → nobody reads them; assign the issue to a rotation.
- Running `-w` on a schedule and committing → unreviewed manifest churn breaks the build later.

## Related

- `references/cli.md`
- `best-practices/taze.md`
- `usecases/interactive-dependency-refresh.md`
