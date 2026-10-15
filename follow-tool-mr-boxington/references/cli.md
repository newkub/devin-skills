| key | value |
|---|---|
| repository | https://github.com/jdx/mr-boxington |
| docs | https://mr-boxington.jdx.dev |

| command | description | options |
|---|---|---|
| `mbx setup` | Install stable Cargo shim + rust-analyzer override | `--yes`, `--global`, `--local`, `--status`, `--uninstall` |
| `mbx doctor` | Check toolchain pair, wrapping, store health | `--json` |
| `mbx explain` | Explain cache results of a build | `--last`, `[CARGO_COMMAND] [ARGS]…` |
| `mbx completion <SHELL>` | shell completions | `bash`, `zsh`, `fish`, `powershell` |
| `mbx tui` | live dashboard — builds, hit/miss graphs, store | `--once` |
| `mbx stats` | Savings and statistics | `--json` |
| `mbx prefetch <CARGO_ARGS>…` | Prefetch the actions a build will need | — |
| `mbx exec <COMMAND>…` | Run a C/C++ build outside Cargo through the compiler wrappers | `--project-root <DIR>` |
| `mbx adopt` | Move an existing `target/` into the managed root | `-r/--recursive`, `--dry-run`, `[PATH]…` |
| `mbx clean` | Clear the outputs of a workspace | `[WORKSPACE]` |
| `mbx gc` | Garbage-collect the store | `--dry-run`, `--max-size` |

| command | description | options |
|---|---|---|
| `mbx cache dir` | Path of the local store | `--json` |
| `mbx cache stats` | Size and contents | `--json` |
| `mbx cache projects` | Checkouts that have data in the store | — |
| `mbx cache largest` | Largest entries | `--limit <N>` |
| `mbx cache verify` | Verify blobs against digests — find corrupted objects | — |
| `mbx cache trace <SESSION>` | Trace of a recorded session | — |
| `mbx cache export <ARCHIVE>` | Export the closure of a group's receipts as tar | `--group <GROUP>`, `--format <FORMAT>` |
| `mbx cache import <ARCHIVE>` | Import a bundle — restores scheduler state + target layout when the target is empty | — |
| `mbx cache remove` | Delete the entries of a workspace | `--interactive`, `[WORKSPACE]` |
