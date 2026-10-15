| key | value |
|---|---|
| install | `bun add -D prettier        # prettier@3.9.6` |

| commands | description | default | options |
|---|---|---|---|
| `bunx biome format --write` | Format with Biome | all files | --stdin-file-path |
| `bunx prettier --write .` | Format with Prettier | all files | --check, --ignore-path |
| `dprint fmt` | Format with dprint | config spec | --incremental |
| `cargo fmt` | Format Rust | all crates | --check |
| `ruff format` | Format Python | current dir | --check, --diff |
