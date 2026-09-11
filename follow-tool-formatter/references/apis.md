# Tool Formatter API & Dependencies

Skill นี้เป็น generic formatter guide — ไม่มี package เดียวชื่อ `formatter`; เลือกตัวจริงตาม tech stack:

## Install

```sh
# TypeScript/JavaScript (เลือกตัวเดียว)
bun add -D prettier        # prettier@3.9.6
bun add -D @biomejs/biome  # 2.5.13
bun add -D dprint          # 0.57.4

# Rust
rustup component add rustfmt

# Python
pipx install ruff          # ruff format

# Go — gofmt มาพร้อม toolchain
```

## Version

- prettier `3.9.6`, biome `2.5.13`, dprint `0.57.4` (verified 2026-09-11)
- [prettier](https://prettier.io) / [biome](https://biomejs.dev) / [dprint](https://dprint.dev)

## Dependencies

- biome/dprint เป็น Rust binaries — ไม่ต้องการ runtime JS deps
- prettier เป็น pure JS — plugin system เช่น `prettier-plugin-*`

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `bunx biome format --write` | Format ด้วย Biome | all files | --stdin-file-path |
| `bunx prettier --write .` | Format ด้วย Prettier | all files | --check, --ignore-path |
| `dprint fmt` | Format ด้วย dprint | config spec | --incremental |
| `cargo fmt` | Format Rust | all crates | --check |
| `ruff format` | Format Python | current dir | --check, --diff |

## Source

- เลือก tool ตาม `/follow-tool-biome`, `/follow-tool-dprint` หรือ official docs ของแต่ละตัว
