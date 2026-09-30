| key | value |
|---|---|
| install | `bun add -D vitest` |
| version | 5.0.0 |
| repository | https://github.com/vitest-dev/vitest |
| docs | https://vitest.dev/guide/cli |

| commands | description | default | options |
|---|---|---|---|
| `vitest` | Run tests; watch mode in interactive env, run mode in CI | — | `--run`, `--watch`, `--pool`, `--maxWorkers`, `--config`, `--reporter`, `--coverage`, `--project`, `--tags-filter`, `-t` |
| `vitest run` | Single run without watch | — | `--pool`, `--maxWorkers`, `--config`, `--reporter`, `--coverage`, `--ui`, `--typecheck`, `--detect-async-leaks`, `--shard` |
| `vitest watch` | Run and watch for changes | — | `--pool`, `--maxWorkers`, `--config`, `--reporter` |
| `vitest related <files>` | Run tests related to changed files | — | `--run`, `--config` |
| `vitest --help` | Show help | — | (none) |
