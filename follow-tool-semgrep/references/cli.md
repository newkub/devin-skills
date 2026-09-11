# Tool Semgrep CLI

## Install

```sh
pipx install semgrep
# or
mise use -g semgrep
```

## Commands

| Command | Description | Options |
|---|---|---|
| `semgrep scan` | Scan files | --config, --include, --exclude, --json, --sarif, --autofix |
| `semgrep ci` | CI scan (AppSec Platform) | --baseline-commit |
| `semgrep login` | Login Semgrep account | - |
| `semgrep publish` | Publish rules to registry | --visibility |
| `semgrep --test` | Test local rules | --config |
| `semgrep --validate` | Validate rule YAML | --config |
| `semgrep lsp` | Language server | - |

## Examples

```sh
semgrep scan --config p/javascript --json src/
semgrep --config rules/ --autofix src/
semgrep -e 'eval(...)' --lang js src/
```
