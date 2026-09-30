| key | value |
|---|---|
| install | `mise use -g hk` |
| version | 2.2.0 |
| package registry | https://crates.io/crates/hk |
| repository | https://github.com/jdx/hk |
| docs | https://hk.jdx.dev |

| commands | description | default | options |
|---|---|---|---|
| `hk init` | สร้าง `hk.pkl` config | — | — |
| `hk install` | ติดตั้ง git hooks | — | `--global`, `--mise` |
| `hk run [hook]` | รัน hook | staged files | `--all`, `--from-ref`, `--to-ref` |
| `hk check` / `hk fix` | รัน check/fix steps | staged | `--all` |
| `hk validate` / `hk config dump` | validate/inspect config | — | — |
| `hk builtins` / `hk migrate` / `hk agent` / `hk mcp` | utilities | — | see cli.md |
