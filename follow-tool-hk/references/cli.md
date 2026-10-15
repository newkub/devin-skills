| key | value |
|---|---|
| install | `mise use -g hk@latest` |
| repository | https://github.com/jdx/hk |
| docs | https://hk.jdx.dev |

| commands | description | default | options |
|---|---|---|---|
| `hk init` | Create the `hk.pkl` config | — | — |
| `hk install` | Install git hooks in the repo | — | `--global` (Git 2.54+), `--mise` |
| `hk uninstall` | Remove hooks | — | — |
| `hk run [hook]` | Run a hook (`pre-commit`, `pre-push`, `pre-merge-commit`) | staged files | `--all`, `--from-ref`, `--to-ref` |
| `hk check [files]` | Run check steps without fixing | staged | `--all` |
| `hk fix [files]` | Run fix steps (auto-fix) | staged | `--all` |
| `hk test` | Test the config | — | — |
| `hk validate` | validate config | — | — |
| `hk config` | inspect config | — | `dump`, `explain`, `get`, `sources` |
| `hk builtins` | list builtin linters | — | — |
| `hk migrate pre-commit` | Convert `.pre-commit-config.yaml` to `hk.pkl` | — | `--output` |
| `hk agent` | agent integration snippets (instructions, hooks, MCP) — read-only | — | `hooks`, `instructions`, `mcp` subcommands |
| `hk mcp` | Run hk as an MCP server | — | `--root` |
| `hk cache` | Manage the cache | — | `clear` |
| `hk util` | utilities | — | `detect-private-key`, `check-*`, `trailing-whitespace`, `end-of-file-fixer` |
| `hk completion` | shell completions | — | `--install`, `<shell>` |
| `hk version` | print version | — | — |
