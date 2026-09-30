| key | value |
|---|---|
| version | 1.177.0 |
| repository | https://github.com/semgrep/semgrep |
| registry | https://semgrep.dev |
| docs | https://semgrep.dev/docs |

| commands | description | default | options |
|---|---|---|---|
| `semgrep scan` | Scan project | - | --config, --json, --sarif |
| `semgrep scan --config auto` | Auto rules from registry | - | - |
| `semgrep scan --config p/security-audit` | Ruleset | - | - |
| `semgrep --pattern '$X = $Y' --lang py` | Inline pattern | - | -e pattern, --lang |
| `semgrep ci` | CI mode (Semgrep AppSec) | - | SEMGREP_APP_TOKEN |
| `semgrep login` / `semgrep publish` | Registry account | - | - |
