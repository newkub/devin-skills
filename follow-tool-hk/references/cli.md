| key | value |
|---|---|
| install | `mise use -g hk@latest` |
| repository | https://github.com/jdx/hk |
| docs | https://hk.jdx.dev |

| commands | description | default | options |
|---|---|---|---|
| `hk init` | สร้าง `hk.pkl` config | — | — |
| `hk install` | ติดตั้ง git hooks ใน repo | — | `--global` (Git 2.54+), `--mise` |
| `hk uninstall` | ถอด hooks | — | — |
| `hk run [hook]` | รัน hook (`pre-commit`, `pre-push`, `pre-merge-commit`) | staged files | `--all`, `--from-ref`, `--to-ref` |
| `hk check [files]` | รัน check steps โดยไม่ fix | staged | `--all` |
| `hk fix [files]` | รัน fix steps (auto-fix) | staged | `--all` |
| `hk test` | ทดสอบ config | — | — |
| `hk validate` | validate config | — | — |
| `hk config` | inspect config | — | `dump`, `explain`, `get`, `sources` |
| `hk builtins` | list builtin linters | — | — |
| `hk migrate pre-commit` | แปลง `.pre-commit-config.yaml` เป็น `hk.pkl` | — | `--output` |
| `hk agent` | agent integration snippets (instructions, hooks, MCP) — read-only | — | `hooks`, `instructions`, `mcp` subcommands |
| `hk mcp` | รัน hk เป็น MCP server | — | `--root` |
| `hk cache` | จัดการ cache | — | `clear` |
| `hk util` | utilities | — | `detect-private-key`, `check-*`, `trailing-whitespace`, `end-of-file-fixer` |
| `hk completion` | shell completions | — | `--install`, `<shell>` |
| `hk version` | print version | — | — |
