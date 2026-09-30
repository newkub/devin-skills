| key | value |
|---|---|
| install | `bun add -D oxlint               # 1.85.0 — Rust, fastest` |

| commands | description | default | options |
|---|---|---|---|
| `bunx oxlint` | Lint ด้วย oxlint | src | --fix, --deny-warnings |
| `bunx biome check` | Lint+format check | all files | --write, --fix |
| `bunx eslint .` | Lint ด้วย ESLint | flat config | --fix, --max-warnings |
| `cargo clippy` | Lint Rust | all targets | -- -D warnings |
| `ruff check` | Lint Python | current dir | --fix, --select |
