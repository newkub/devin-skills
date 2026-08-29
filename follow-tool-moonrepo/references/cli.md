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

| commands | default | options |
|---|---|---||---|---|---||---|---|---||
| `moon run <target>` | Run target(s) with dependencies; fail-fast | `--query`, `--affected`, `--upstream`, `--force`, `-i, --interactive` |
| `moon exec <target>` / `moonx` | Low-level task execution | `--query`, `-f, --force`, `-i, --interactive`, `--on-failure`, `--ci` |
| `moon check [targets]` | Run type check and lint tasks | `--query`, `--affected`, `--force` |
| `moon ci` | CI-optimized pipeline | `--query`, `--affected` |
| `moon sync` | Sync project and toolchain | (none) |
| `moon project [name]` | Show project info | (none) |
| `moon query` | Query monorepo graph | `--affected`, `--json`, `--mermaid` |
| `moon generate` | Generate files from templates | `--name`, `--template` |
| `moon --help` | Show help | (none) |

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

## Examples

```sh
bunx moon run app:build
bunx moon run :test
bunx moon exec client:dev server:dev
bunx moon query --affected
```
