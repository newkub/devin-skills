# hk CLI

## Install

```sh
mise use -g hk@latest
```

## Version

- Latest: `hk@1.58.1` (verified 2026-09-12)
- Repository: https://github.com/jdx/hk
- Docs: https://hk.jdx.dev

## Commands

| commands | description | default | options |
|---|---|---|---|
| `hk init` | สร้าง `hk.pkl` config | — | — |
| `hk install` | ติดตั้ง git hooks ใน repo | — | `--global` (Git 2.54+), `--mise` |
| `hk uninstall` | ถอด hooks | — | — |
| `hk run [hook]` | รัน hook (`pre-commit`, `pre-push`, `pre-merge-commit`) | staged files | `--all`, `--from-ref`, `--to-ref` |
| `hk check [files]` | รัน check steps โดยไม่ fix | staged | `--all` |
| `hk fix [files]` | รัน fix steps (auto-fix) | staged | `--all` |
| `hk test` | ทดสอบ config | — | — |
| `hk inspect` | แสดง effective config | — | — |
| `hk agent` | agent integration snippets (instructions, hooks, MCP) — read-only | — | — |
| `hk mcp` | รัน hk เป็น MCP server | — | — |
| `hk cache` | จัดการ cache | — | `clear` |
| `hk util` | utilities | — | `leak-detection` |

## Examples

```sh
mise x -- hk install
hk run pre-commit
hk fix --all
hk check --all
hk agent
```

## Notes

- Config เป็น `hk.pkl` (Pkl) — `amends "package://github.com/jdx/hk/releases/download/v<ver>/hk@<ver>#/Config.pkl"`
- `effect = "destructive"` ต้อง confirm ใน agent/MCP contexts (v1.55+)
- `hk agent` เป็น read-only — ไม่แก้ config เอง
