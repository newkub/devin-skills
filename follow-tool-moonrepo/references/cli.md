# moonrepo CLI

## Install

```sh
bun add -D @moonrepo/cli
```

## Version

- Latest: see https://moonrepo.dev/
- Repository: https://github.com/moonrepo/moon
- Docs: https://moonrepo.dev/docs/commands/overview

## Commands

| commands | description | default | options |
|---|---|---|---|
| `moon run <target>` | Run target(s) with dependencies | fail-fast | `--query`, `--affected`, `--upstream`, `--force`, `-i, --interactive` |
| `moon exec <target>` / `moonx` | Low-level task execution | — | `--query`, `-f, --force`, `-i, --interactive`, `--on-failure`, `--ci` |
| `moon check [targets]` | Run type check and lint tasks | — | `--query`, `--affected`, `--force` |
| `moon ci` | CI-optimized pipeline — affected tasks with `runInCI` | — | `--base`, `--head`, `--job`, `--job-total`, `--query`, `--affected` |
| `moon sync` | Sync project and toolchain | — | (none) |
| `moon project [name]` | Show project info | — | (none) |
| `moon query` | Query monorepo graph | — | `--affected`, `--json`, `--mermaid` |
| `moon generate` | Generate files from templates | — | `--name`, `--template` |
| `moon --help` | Show help | — | (none) |

## Global Options

| Option | Description |
|---|---|---||---|---|---||
| `--cache` | Cache mode: `off`, `read`, `read-write` (default), `write` |
| `--color` | Force colored output |
| `--concurrency`, `-c` | Max threads |
| `--log` | Log level |
| `--log-file` | Log file path |
| `--quiet`, `-q` | Hide non-important output |
| `--theme` | Terminal theme |
| `--version` | Show version |

## moon ci

```sh
moon ci                      # all affected tasks with runInCI
moon ci :build :lint         # explicit targets (still affected-filtered)
moon ci --base main --head HEAD~1
moon ci --job 0 --job-total 2  # sharding across CI jobs
```

- prefills: `--affected --ci --on-failure=continue --summary=detailed --upstream=deep --downstream=direct`
- report: `.moon/cache/ciReport.json`
- requires full git history — no shallow clones
- details: [ci.md](ci.md)

## Examples

```sh
bunx moon run app:build
bunx moon run :test
bunx moon exec client:dev server:dev
bunx moon query --affected
```
