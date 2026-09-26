# mbx CLI

## Install

```sh
mise use --global --tool-option mr_boxington=true rust mr-boxington  # mise >=2026.9.2
# or: cargo install mbx --locked
```

## Version

- Latest: `mbx@1.18.0` (verified 2026-09-26)
- Repository: https://github.com/jdx/mr-boxington
- Docs: https://mr-boxington.jdx.dev
- Usage: `mbx [+TOOLCHAIN] <SUBCOMMAND>` — `+TOOLCHAIN` เลือก toolchain แบบ rustup (`mbx +1.91 check`)

## Build Passthrough

`mbx <cargo-subcommand>` ส่งต่อให้ Cargo ทุก subcommand/alias/installed subcommand:

```sh
mbx build
mbx test --workspace --all-features
mbx clippy --workspace --all-targets -- -D warnings
mbx +stable check --workspace
```

## Commands

| command | description | options |
|---|---|---|
| `mbx setup` | ติดตั้ง stable Cargo shim + rust-analyzer override | `--yes`, `--global`, `--local`, `--status`, `--uninstall` |
| `mbx doctor` | ตรวจ toolchain pair, wrapping, store health | `--json` |
| `mbx explain` | อธิบายผล cache ของ build | `--last`, `[CARGO_COMMAND] [ARGS]…` |
| `mbx completion <SHELL>` | shell completions | `bash`, `zsh`, `fish`, `powershell` |
| `mbx tui` | live dashboard — builds, hit/miss graphs, store | `--once` |
| `mbx stats` | savings และ statistics | `--json` |
| `mbx prefetch <CARGO_ARGS>…` | prefetch actions ที่ build จะต้องใช้ | — |
| `mbx exec <COMMAND>…` | รัน C/C++ build นอก Cargo ผ่าน compiler wrappers | `--project-root <DIR>` |
| `mbx adopt` | ย้าย existing `target/` เข้า managed root | `-r/--recursive`, `--dry-run`, `[PATH]…` |
| `mbx clean` | ล้าง outputs ของ workspace | `[WORKSPACE]` |
| `mbx gc` | เก็บกวาด store | `--dry-run`, `--max-size` |

## `mbx cache` Subcommands

| command | description | options |
|---|---|---|
| `mbx cache dir` | path ของ local store | `--json` |
| `mbx cache stats` | size และ contents | `--json` |
| `mbx cache projects` | checkouts ที่มีข้อมูลใน store | — |
| `mbx cache largest` | entries ใหญ่สุด | `--limit <N>` |
| `mbx cache verify` | verify blobs เทียบ digest — หา corrupted objects | — |
| `mbx cache trace <SESSION>` | trace ของ recorded session | — |
| `mbx cache export <ARCHIVE>` | export closure ของ receipts ใน group เป็น tar | `--group <GROUP>`, `--format <FORMAT>` |
| `mbx cache import <ARCHIVE>` | import bundle — restore scheduler state + target layout เมื่อ target ว่าง | — |
| `mbx cache remove` | ลบ entries ของ workspace | `--interactive`, `[WORKSPACE]` |

## Examples

```sh
mbx setup --yes
mbx setup --status
mbx doctor
mbx explain --last
mbx cache stats
mbx gc --dry-run
mbx adopt --recursive --dry-run ~/src
MBX_SCHEDULER_TESTS=1 mbx test --workspace
```

## Notes

- `MBX_SUMMARY=short|full|ci|off` override build summary; CI ใช้ explanatory summary อัตโนมัติ
- `mbx cache export --group` อ่าน group จาก `MBX_CACHE_EXPORT_GROUP` — `jdx/mr-boxington-action` ตั้งให้เอง
- `mbx setup --uninstall` ต่อ scope ที่เคย enable — ไม่ลบ binary หรือ cache
