| key | value |
|---|---|
| install | `bun add -D prettier        # prettier@3.9.6` |

| commands | description | default | options |
|---|---|---|---|
| `bunx biome format --write` | Format ด้วย Biome | all files | --stdin-file-path |
| `bunx prettier --write .` | Format ด้วย Prettier | all files | --check, --ignore-path |
| `dprint fmt` | Format ด้วย dprint | config spec | --incremental |
| `cargo fmt` | Format Rust | all crates | --check |
| `ruff format` | Format Python | current dir | --check, --diff |
