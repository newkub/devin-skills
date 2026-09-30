| key | value |
|---|---|
| install | `cargo install cargo-nextest --locked` |
| repository | https://github.com/nextest-rs/nextest |
| docs | https://nexte.st/ |

| commands | description | default | options |
|---|---|---|---|
| `cargo nextest run [filters]` | Build and run tests | fail-fast by default | `--package`, `--workspace`, `--exclude`, `--max-fail`, `--no-fail-fast`, `--test-threads`, `--filterset`, `--no-capture`, `--profile` |
| `cargo nextest list [filters]` | List tests that would run | — | `--package`, `--workspace`, `--exclude`, `--filterset` |
| `cargo nextest archive` | Archive test binaries for later run | — | `--archive-format`, `--archive-file` |
| `cargo nextest show-config` | Print effective config | — | `--profile` |
| `cargo nextest self-update` | Update nextest binary | — | (none) |
