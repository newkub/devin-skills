| key | value |
|---|---|
| repository | https://github.com/jdx/mr-boxington |
| docs | https://mr-boxington.jdx.dev |

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
