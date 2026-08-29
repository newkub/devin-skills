# cargo-nextest CLI

## Install

```sh
cargo install cargo-nextest --locked
```

## Version

- Latest: see https://nexte.st/
- Repository: https://github.com/nextest-rs/nextest
- Docs: https://nexte.st/docs/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `cargo nextest run [filters]` | Build and run tests | fail-fast by default | `--package`, `--workspace`, `--exclude`, `--max-fail`, `--no-fail-fast`, `--test-threads`, `--filterset`, `--no-capture`, `--profile` |
| `cargo nextest list [filters]` | List tests that would run | — | `--package`, `--workspace`, `--exclude`, `--filterset` |
| `cargo nextest archive` | Archive test binaries for later run | — | `--archive-format`, `--archive-file` |
| `cargo nextest show-config` | Print effective config | — | `--profile` |
| `cargo nextest self-update` | Update nextest binary | — | (none) |

## Examples

```sh
cargo nextest run
cargo nextest run --workspace --no-fail-fast
cargo nextest run -E 'deps(my-crate)'
cargo nextest list --all-targets
```
