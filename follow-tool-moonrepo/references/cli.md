| key | value |
|---|---|
| install | `bun add -D @moonrepo/cli` |
| repository | https://github.com/moonrepo/moon |
| docs | https://moonrepo.dev/docs/commands/overview |

| commands | description | default | options |
|---|---|---|---|
| `moon run <target>` | Run target(s) with dependencies | fail-fast | `--query`, `--affected`, `--upstream`, `--force`, `-i, --interactive` |
| `moon exec <target>` / `moonx` | Low-level task execution | — | `--query`, `-f, --force`, `-i, --interactive`, `--on-failure`, `--ci` |
| `moon check [targets]` | Run type check and lint tasks | — | `--query`, `--affected`, `--force` |
| `moon ci` | CI-optimized pipeline — affected tasks with `runInCI` | — | `--base`, `--head`, `--job`, `--job-total`, `--query`, `--affected` |
| `moon init` | Scaffold `.moon/` workspace in existing repo | — | `--to`, `--force` |
| `moon sync` | Sync project and toolchain | — | (none) |
| `moon sync hooks` | Generate + link `vcs.hooks` git hooks | — | (none) |
| `moon project [name]` | Show project info | — | (none) |
| `moon task <id>:<task>` | Show task config and metadata | — | (none) |
| `moon query` | Query monorepo graph | — | `--affected`, `--json`, `--mermaid` |
| `moon query projects` / `tasks` | List projects / tasks matching query | — | `--affected`, `--json` |
| `moon generate` | Generate files from templates | — | `--name`, `--template` |
| `moon ext <name>` | Run moon extension (e.g. `migrate-turborepo`, `migrate-nx`) | — | (none) |
| `moon --help` | Show help | — | (none) |

| Option | Description |
|---|---|
| `--cache` | Cache mode: `off`, `read`, `read-write` (default), `write` |
| `--color` | Force colored output |
| `--concurrency`, `-c` | Max threads |
| `--log` | Log level |
| `--log-file` | Log file path |
| `--quiet`, `-q` | Hide non-important output |
| `--theme` | Terminal theme |
| `--version` | Show version |
