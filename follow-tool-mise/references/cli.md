# mise CLI

## Install

```sh
# See https://mise.jdx.dev/getting-started.html
curl https://mise.run | sh
```

## Version

- Latest: see https://mise.jdx.dev/
- Repository: https://github.com/jdx/mise
- Docs: https://mise.jdx.dev/cli/

## Commands

| commands | description | default | options |
|---|---|---|---|
| `mise [task]` | Run task from `mise.toml` | — | `-C, --cd`, `-E, --env`, `-j, --jobs`, `-q, --quiet`, `-v, --verbose`, `-y, --yes`, `--raw`, `--silent`, `--output` |
| `mise install` | Install all tools in config | — | `--dry-run`, `-j, --jobs`, `-y, --yes` |
| `mise use <tool@version>` | Add tool to config | — | `--global`, `-f, --force` |
| `mise exec [tool] -- <cmd>` / `mise x` | Run command with tool env | — | `-c, --command`, `-C, --cd`, `-j, --jobs` |
| `mise run [task]` / `mise r` | Run task with output capture | — | `-c, --continue-on-error`, `-f, --force`, `-n, --dry-run`, `-j, --jobs`, `-o, --output`, `-s, --shell` |
| `mise tasks` | List tasks | — | (none) |
| `mise list` | List installed tools | — | (none) |
| `mise --help` | Show help | — | (none) |

## Examples

```sh
mise install
mise use node@20 bun@1
mise x node@20 -- node -v
mise run build
```
