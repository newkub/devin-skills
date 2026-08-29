# Vitest CLI

## Install

```sh
bun add -D vitest
```

## Version

- Latest: `4.x`
- Repository: https://github.com/vitest-dev/vitest
- Docs: https://vitest.dev/guide/cli

## Commands

| commands | description | default | options |
|---|---|---|---|
| `vitest` | Run tests; watch mode in interactive env, run mode in CI | — | `--run`, `--watch`, `--threads`, `--pool`, `--config`, `--reporter`, `--coverage` |
| `vitest run` | Single run without watch | — | `--threads`, `--pool`, `--config`, `--reporter`, `--coverage`, `--ui` |
| `vitest watch` | Run and watch for changes | — | `--threads`, `--pool`, `--config`, `--reporter` |
| `vitest related <files>` | Run tests related to changed files | — | `--run`, `--config` |
| `vitest --help` | Show help | — | (none) |

## Examples

```sh
bunx vitest
bunx vitest run --coverage
bunx vitest watch --pool threads
```
