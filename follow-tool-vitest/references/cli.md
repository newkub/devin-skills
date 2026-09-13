# Vitest CLI

## Install

```sh
bun add -D vitest
```

## Version

- Latest: `5.0.0` (verified 2026-09-13) — requires Vite >= 6.4.0, Node >= 22.12.0
- Repository: https://github.com/vitest-dev/vitest
- Docs: https://vitest.dev/guide/cli

## Commands

| commands | description | default | options |
|---|---|---|---|
| `vitest` | Run tests; watch mode in interactive env, run mode in CI | — | `--run`, `--watch`, `--pool`, `--maxWorkers`, `--config`, `--reporter`, `--coverage`, `--project`, `--tags-filter`, `-t` |
| `vitest run` | Single run without watch | — | `--pool`, `--maxWorkers`, `--config`, `--reporter`, `--coverage`, `--ui`, `--typecheck`, `--detect-async-leaks`, `--shard` |
| `vitest watch` | Run and watch for changes | — | `--pool`, `--maxWorkers`, `--config`, `--reporter` |
| `vitest related <files>` | Run tests related to changed files | — | `--run`, `--config` |
| `vitest --help` | Show help | — | (none) |

## Examples

```sh
bunx vitest
bunx vitest run --coverage
bunx vitest watch --pool threads
bunx vitest run --tags-filter="unit"
```
