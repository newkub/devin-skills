# Turborepo CLI

## Install

```sh
bun add -D turbo
```

## Version

- Latest: `2.10.12` (verified 2026-09-13)
- Repository: https://github.com/vercel/turborepo
- Docs: https://turborepo.dev/docs/reference

## Commands

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

## Examples

```sh
bunx turbo run build --filter=web
bunx turbo dev --parallel
bunx turbo prune web --out-dir ./out
```
