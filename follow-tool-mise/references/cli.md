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
| `mise install` / `mise i` | Install all tools in config | — | `--dry-run`, `-j, --jobs`, `-y, --yes` |
| `mise use <tool@version>` / `mise u` | Add tool to config | — | `-g, --global`, `-f, --force`, `--pin` |
| `mise exec [tool] -- <cmd>` / `mise x` | Run command with tool env | — | `-c, --command`, `-C, --cd`, `-j, --jobs` |
| `mise run [task]` / `mise r` | Run task with output capture | — | `-c, --continue-on-error`, `-f, --force`, `-n, --dry-run`, `-j, --jobs`, `-o, --output`, `-s, --shell` |
| `mise tasks` / `mise t` | List tasks | — | `--all`, `-J, --json`, `--usage` |
| `mise ls` / `mise list` | List installed tools | — | `-c, --current`, `-g, --global`, `-J, --json` |
| `mise ls-remote <tool>` | List available remote versions | — | `--all` |
| `mise latest <tool>` | Show latest matching version | — | `-i, --installed`, `-a, --asdf` |
| `mise outdated` | Show tools with newer versions | — | `-l, --bump`, `-J, --json` |
| `mise upgrade` / `mise up` | Upgrade tools per version constraints | — | `-l, --bump`, `-n, --dry-run`, `-j, --jobs` |
| `mise prune` | Delete unused tool versions | — | `-n, --dry-run`, `--configs`, `--tools` |
| `mise env` / `mise e` | Print env vars mise exports | — | `-s, --shell`, `-J, --json`, `-D, --dotenv` |
| `mise which <tool>` | Show binary path for a tool | — | `--plugin`, `--version` |
| `mise doctor` / `mise dr` | Diagnose mise setup problems | — | `-J, --json` |
| `mise activate <shell>` | Print shell activation script | — | `--shims`, `--status` |
| `mise deactivate` | Print script to remove mise from env | — | (none) |
| `mise trust` | Trust a config file (`mise.toml`) | — | `-a, --all`, `--untrust` |
| `mise settings` | Manage mise settings | — | `get`, `set`, `ls`, `unset` subcommands |
| `mise watch` / `mise w` | Re-run task on file changes | — | `-t, --task`, `-g, --glob` |
| `mise --help` | Show help | — | (none) |

## Examples

```sh
mise install
mise use node@20 bun@1
mise use -g pitchfork@latest
mise x node@20 -- node -v
mise run build
mise up --bump --dry-run
mise env --shell bash
mise doctor
```
