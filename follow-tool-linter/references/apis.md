| key | value |
|---|---|
| install | `bun add -D oxlint               # 1.85.0 — Rust, fastest` |

| commands | description | default | options |
|---|---|---|---|
| `bunx oxlint` | Lint with oxlint | src | --fix, --deny-warnings |
| `bunx biome check` | Lint+format check | all files | --write, --fix |
| `bunx eslint .` | Lint with ESLint | flat config | --fix, --max-warnings |
| `cargo clippy` | Lint Rust | all targets | -- -D warnings |
| `ruff check` | Lint Python | current dir | --fix, --select |
