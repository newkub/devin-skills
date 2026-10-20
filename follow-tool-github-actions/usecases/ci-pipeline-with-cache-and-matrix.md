# Use Case — CI Pipeline with Cache, Matrix and Concurrency

> One workflow that lints, typechecks and tests on every PR, cancels superseded runs, and shares a dependency cache. Source: https://docs.github.com/en/actions/writing-workflows/workflow-syntax-for-github-actions (accessed 2026-10-20)

## 1. Trigger, permissions, concurrency

```yaml
name: ci
on:
  pull_request:
  push:
    branches: [main]

permissions:
  contents: read

concurrency:
  group: ci-${{ github.ref }}
  cancel-in-progress: true
```

`cancel-in-progress` is the single biggest CI-minute saver: pushing twice cancels the first run.

## 2. Matrix + cache

```yaml
jobs:
  verify:
    runs-on: ubuntu-latest
    strategy:
      fail-fast: false
      matrix:
        bun: ["1.2", "1.3"]
    steps:
      - uses: actions/checkout@v4
      - uses: oven-sh/setup-bun@v2
        with:
          bun-version: ${{ matrix.bun }}
          cache: true
      - run: bun install --frozen-lockfile
      - run: bun run lint
      - run: bun run typecheck
      - run: bun test --coverage
```

`--frozen-lockfile` fails when `package.json` and the lockfile disagree — exactly what you want on CI.

## 3. Publish artifacts, not logs

```yaml
      - uses: actions/upload-artifact@v4
        if: always()
        with:
          name: coverage-${{ matrix.bun }}
          path: coverage/
          retention-days: 7
```

## 4. Skip duplicate work on push

```yaml
on:
  pull_request:
  push:
    branches: [main]
    paths-ignore: ["**/*.md", "docs/**"]
```

`paths-ignore` keeps docs PRs from paying for a full toolchain install.

## Pitfalls

- No `permissions:` block → the job inherits the repo default, often `write-all`; set the minimum explicitly.
- Caching `node_modules` instead of the package manager store → stale modules after a lockfile change; let `setup-bun` handle it.
- `fail-fast: true` on a matrix → one red cell hides the others; use `false` to see all failures.
- Secrets in a `pull_request` from a fork → they are not available; use `pull_request_target` only with a reviewed checkout step.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/github-actions.md`
- `usecases/reusable-workflow-and-release.md`
