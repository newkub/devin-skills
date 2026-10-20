| key | value |
|---|---|
| package | `mbx` (crate `mbx`, mise tool `mr-boxington`, binary `mbx`) |
| install | `mise use -g --tool-option mr_boxington=true rust mr-boxington` (mise ≥ 2026.9.2) · `cargo install mbx --locked` + `mbx setup` · release archives |
| version | 1.18.0 (verified 2026-09-26) |
| license | MIT |
| docs | https://github.com/jdx/mr-boxington/tree/main/docs |
| repo | https://github.com/jdx/mr-boxington |
| CI action | `jdx/mr-boxington-action@v1` |

| api | description | signature/example |
|---|---|---|
| `mbx <cargo-subcommand>` | run any Cargo command through the shared cache | `mbx test --workspace --all-features` |
| `mbx +<toolchain>` | rustup-style toolchain selection | `mbx +stable check --workspace` |
| `mbx setup` | install/remove the Cargo shim | `--global`, `--local`, `--yes`, `--status`, `--uninstall` |
| `mbx doctor` | check tools, wrapping, store health | |
| `mbx adopt` | bring existing `target/` dirs under management | `--recursive --dry-run ~/src` |
| `mbx gc` | collect managed targets + store entries | `--dry-run` first |
| `mbx clean` | remove this workspace's managed target | `--under <root>` |
| `mbx cache <sub>` | inspect the store | `stats`, `projects`, `largest`, `dir`, `export`, `import`, `verify`, `trace` |
| `mbx explain --last` | reason for each action in the last build | |
| `mbx stats` / `mbx tui` | lifetime savings / live build view | |
| `mbx exec` | cache non-Cargo builds | `mbx exec make -j8` |
| config precedence | env → workspace → global | `MBX_*` → `.mbx.toml` → `%APPDATA%\mbx\config.toml` |
| `[remote]` | shared cache server / S3 | `url`, `namespace`, `mode = "read-write"`, `s3_endpoint`, `s3_region` |
| write policy | pushes to protected branches only; PRs restore-only | enforced by the server environment |
