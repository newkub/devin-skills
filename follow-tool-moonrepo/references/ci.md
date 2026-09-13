# moon ci Reference

> CI-optimized pipeline command — runs affected tasks with `runInCI` enabled (moon v2.5.4, verified 2026-09-13)

## What `moon ci` Does

- Determines changed files (HEAD vs base)
- Resolves affected targets + their dependencies and dependents
- Generates action/dependency graph, installs toolchain + deps
- Runs actions in thread pool, shows pass/fail/invalid stats
- Writes report to `.moon/cache/ciReport.json`

Prefilled options (inherits `moon exec`): `--affected`, `--ci`, `--on-failure=continue`, `--summary=detailed`, `--upstream=deep`, `--downstream=direct`

## runInCI Option

```yaml
tasks:
  dev:
    command: 'webpack server'
    options:
      runInCI: false
```

- Default `true` for all tasks except `dev`, `start`, `serve` (default `false`)
- Must be `false` for long-running/never-ending processes

## Choosing Targets

```sh
moon ci                    # all affected runInCI tasks
moon ci :build             # only builds (still affected + runInCI filtered)
moon ci :test :lint        # tests + lint in one job
```

## Revision Detection

- Auto-detected from CI provider (via `ci_env` crate)
- Fallback: `vcs.defaultBranch` (base) + `HEAD` (head)
- Override: `moon ci --base <BRANCH> --head <SHA>` or `MOON_BASE`/`MOON_HEAD` env vars

Critical: requires full git history — no shallow clones. Use blobless partial clone (`filter: 'blob:none'` on `actions/checkout`) if clone speed matters.

## Provider Integration

### GitHub Actions

```yaml
name: 'Pipeline'
on:
  push:
    branches: ['master']
  pull_request:
jobs:
  ci:
    runs-on: 'ubuntu-latest'
    steps:
      - uses: 'actions/checkout@v4'
        with:
          fetch-depth: 0
          filter: 'blob:none'
      - uses: 'moonrepo/setup-toolchain@v0'
      - run: 'moon ci'
      - uses: 'moonrepo/run-report-action@v1'
        if: success() || failure()
        with:
          access-token: ${{ secrets.GITHUB_TOKEN }}
```

### Buildkite

```yaml
steps:
  - label: 'CI'
    commands: ['moon ci']
```

### CircleCI

```yaml
jobs:
  ci:
    docker:
      - image: 'cimg/base:stable'
    steps:
      - 'checkout'
      - run: 'moon ci'
workflows:
  pipeline:
    jobs: ['ci']
```

### TravisCI

```yaml
language: 'node_js'
script: 'moon ci'
```

## Sharding (Parallel Jobs)

```sh
moon ci --job <0-based-index> --job-total <N>
```

### GitHub matrix

```yaml
strategy:
  matrix:
    index: [0, 1]
steps:
  - run: 'moon ci --job ${{ matrix.index }} --job-total 2'
```

### Buildkite

```yaml
steps:
  - label: 'CI'
    parallelism: 10
    commands: ['moon ci --job $$BUILDKITE_PARALLEL_JOB --job-total $$BUILDKITE_PARALLEL_JOB_COUNT']
```

### CircleCI

```yaml
jobs:
  ci:
    parallelism: 10
    steps:
      - run: 'moon ci --job $CIRCLE_NODE_INDEX --job-total $CIRCLE_NODE_TOTAL'
```

### TravisCI

```yaml
env:
  global:
    - TRAVIS_JOB_TOTAL=2
jobs:
  - TRAVIS_JOB_INDEX=0
  - TRAVIS_JOB_INDEX=1
script: 'moon ci --job $TRAVIS_JOB_INDEX --job-total $TRAVIS_JOB_TOTAL'
```

## Artifact Caching

- Prefer remote caching service over manual persistence
- Manual: persist only `.moon/cache/{hashes,outputs}` — nothing else in `.moon/cache` is portable
- Hashes differ per run — manual caching without invalidation is ineffective

## Reporting

- `moonrepo/run-report-action@v1` — PR comment + workflow summary (GitHub)
- Community: `appthrust/moon-ci-retrospect` (readable results), `kymckay/moon-ci-booster` (failing task comments)
- Copy `ciReport.json` out of `.moon/cache` to persist as artifact

## Source

- Command docs: https://moonrepo.dev/docs/commands/ci
- CI guide: https://moonrepo.dev/docs/guides/ci
