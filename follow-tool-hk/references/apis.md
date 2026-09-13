# Tool Hk API & Dependencies

## Install

```sh
mise use -g hk
# or ตาม https://hk.jdx.dev/getting_started.html (brew, cargo-binstall)
```

## Version

- Latest: `1.58.1` (verified 2026-09-13)
- [Package Registry](https://crates.io/crates/hk) — npm package `hk` ไม่ใช่ตัวจริง
- [Repository](https://github.com/jdx/hk)

## Dependencies

- hk เป็น single Rust binary — embeds Pkl runtime (v1.57+ embeds Pkl package ของ version ตัวเอง)
- integrate กับ `mise` (`mise = true` ใน `hk.pkl`, `HK_MISE=1`)

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `hk init` | สร้าง `hk.pkl` config | — | — |
| `hk install` | ติดตั้ง git hooks | — | `--global`, `--mise` |
| `hk run [hook]` | รัน hook | staged files | `--all`, `--from-ref`, `--to-ref` |
| `hk check` / `hk fix` | รัน check/fix steps | staged | `--all` |
| `hk validate` / `hk config dump` | validate/inspect config | — | — |
| `hk builtins` / `hk migrate` / `hk agent` / `hk mcp` | utilities | — | see cli.md |

## Source

- Official docs: https://hk.jdx.dev
- Description: Git hooks manager by jdx (alternative to Lefthook/pre-commit)
