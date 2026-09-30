| key | value |
|---|---|
| install | `mise use -g usage        # recommended` |
| version | 6.11.1 |
| repository | https://github.com/jdx/usage |
| docs | https://usage.jdx.dev/cli/reference/ |

| commands | description | default | options |
|---|---|---|---|
| `usage generate completion <shell> <bin>` | Generate shell completions (bash, fish, nu, powershell, zsh) | — | `-f <spec>`, `--install` |
| `usage generate completion-init <shell>` | Generate shell init script for usage shebang scripts | — | (none) |
| `usage generate markdown` | Generate markdown docs from spec | — | `-f <spec>`, `-m`, `--out-dir`, `--link-extension` |
| `usage generate manpage` | Generate manpage | — | `-f <spec>`, `-o <file>` |
| `usage generate json` | Emit spec as JSON | — | `-f <spec>` |
| `usage generate json-schema` | Emit JSON Schema for config file | — | `-f <spec>` |
| `usage generate fig` | Generate Fig completion spec | — | `-f <spec>` |
| `usage generate go` | Generate Go parse tables | — | `-f <spec>`, `-o <file>` |
| `usage generate sdk` | Generate type-safe SDK (typescript, python) | — | `-l <lang>`, `-o <dir>`, `-f <spec>`, `-p --package-name`, `--spec` |
| `usage lint <spec>` | Lint a usage spec | — | `-f json`, `-W`, `--sorted` |
| `usage exec <args>...` | Execute script with parsed args (alias `x`) | — | (none) |
| `usage sponsors` | List sponsors | — | (none) |
| `usage mcp -f <spec>` | Serve spec over MCP (alias `mcp-server`) | — | `-f <spec>` |
| `usage bash|zsh|fish|powershell <script>` | Run usage shebang script | — | (none) |
| `usage diff <old> <new>` | Compare two usage specs | — | (none) |
| `usage explain [argv]` | Explain a command line against a spec | — | (none) |
| `usage --usage-spec` | Output usage.kdl spec for usage CLI itself | — | (none) |
| `usage --completions <shell>` | Output completions for the usage CLI itself | — | (none) |
