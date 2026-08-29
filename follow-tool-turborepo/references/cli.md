# Turborepo CLI

## Install

```sh
bun add -D turbo
```

## Version

- Latest: `2.x`
- Repository: https://github.com/vercel/turborepo
- Docs: https://turbo.build/docs/reference/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `turbo run <task>` | Run `<task>` across selected workspaces from `turbo.json` | — | `--filter`, `--no-cache`, `--cache`, `--parallel`, `--since`, `--affected`, `--graph`, `--dry-run`, `--force` |
| `turbo build` / `turbo dev` / `turbo test` | Shorthand for `turbo run <task>` | — | same as `turbo run` |
| `turbo prune <workspace>` | Prune workspace to `out/` | — | `--docker`, `--out-dir` |
| `turbo gen` | Generate workspace/package | — | `--copy`, `--empty`, `--name` |
| `turbo query` | Query monorepo graph | — | `--affected`, `--format` |
| `turbo devtools` | Start devtools server | — | `--port`, `--no-open` |
| `turbo --help` | Show help | — | (none) |

## Examples

```sh
bunx turbo run build --filter=web
bunx turbo dev --parallel
bunx turbo prune web --out-dir ./out
```
