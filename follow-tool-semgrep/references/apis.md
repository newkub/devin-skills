# Tool Semgrep API & Dependencies

## Install

```sh
# Semgrep เป็น Python/OCaml binary — ไม่ใช่ npm package
pipx install semgrep
# or
mise use -g semgrep
# or
brew install semgrep
```

## Version

- Latest: `1.177.0` (verified 2026-09-11)
- [Repository](https://github.com/semgrep/semgrep)
- [Registry](https://semgrep.dev) — npm/pypi registry links ชี้ wrapper

## Dependencies

- Python ≥3.10 runtime (ผ่าน pipx) หรือ standalone binary
- Rules: registry rulesets (`p/default`, `p/javascript`, `p/security-audit`) หรือ local YAML rules

## Common API / Commands

| commands | description | default | options |
|---|---|---|---|
| `semgrep scan` | Scan project | - | --config, --json, --sarif |
| `semgrep scan --config auto` | Auto rules from registry | - | - |
| `semgrep scan --config p/security-audit` | Ruleset | - | - |
| `semgrep --pattern '$X = $Y' --lang py` | Inline pattern | - | -e pattern, --lang |
| `semgrep ci` | CI mode (Semgrep AppSec) | - | SEMGREP_APP_TOKEN |
| `semgrep login` / `semgrep publish` | Registry account | - | - |

## Source

- Official docs: https://semgrep.dev/docs
- Description: Static analysis — syntax-aware pattern matching 30+ languages.
