| key | value |
|---|---|
| install | `bun add -D turbo` |
| version | 2.11.4 |
| repository | https://github.com/vercel/turborepo |
| docs | https://turborepo.dev/docs/reference |

| commands | description | default | options |
|---|---|---|---|
| `turbo run <task>` | Run `<task>` across selected workspaces from `turbo.json` | — | `--filter`, `--no-cache`, `--cache`, `--parallel`, `--since`, `--affected`, `--graph`, `--dry-run`/`--dry=json`, `--force` |
| `turbo watch <task>` | Re-run task when inputs change (development) | — | same as `turbo run` |
| `turbo build` / `turbo dev` / `turbo test` | Shorthand for `turbo run <task>` | — | same as `turbo run` |
| `turbo boundaries` | Check package isolation against `boundaries`/`tags` rules | — | (none) |
| `turbo ls` | List packages in the monorepo | — | `--filter`, `--affected` |
| `turbo prune <workspace>` | Prune workspace to `out/` | — | `--docker`, `--out-dir` |
| `turbo gen` | Generate workspace/package | — | `--copy`, `--empty`, `--name` |
| `turbo query` | Query monorepo graph | — | `--affected`, `--format` |
| `turbo link` | Link repo to remote cache | — | `--yes` |
| `turbo login` / `turbo logout` / `turbo unlink` | Remote cache auth / unlink | — | (none) |
| `turbo devtools` | Start devtools server | — | `--port`, `--no-open` |
| `turbo --help` | Show help | — | (none) |
