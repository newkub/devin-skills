| command | description | options |
|---|---|---|
| `devin` | Start interactive REPL in current directory | `[PATH]...`, `-- <PROMPT>...` |
| `devin -p "prompt"` | Single-turn: print response and exit | `--print [<PROMPT>]` |
| `devin auth login` | Log in to your account | `--force-manual-token-flow` |
| `devin auth logout` | Remove stored credentials | — |
| `devin auth status` | Check authentication status | — |
| `devin mcp add <name>` | Add an MCP server | `-t stdio\|http`, `-s local\|project\|user`, `--url`, `--command`, `-e KEY=VALUE`, `-H`, `--scopes`, `--oauth-resource` |
| `devin mcp list` / `get <name>` / `remove <name>` | Inspect or remove MCP servers | `-s local\|project\|user` |
| `devin mcp login` / `logout <name>` | OAuth for an MCP server | `--scopes`, `--oauth-resource` |
| `devin mcp enable` / `disable <name>` | Toggle without removing | `-s` |
| `devin models list` | List models available to the account | `--format json` |
| `devin rules list` / `show <name>` / `paths` | Manage agent rules | `--provider cursor\|windsurf` |
| `devin skills list` / `show <name>` / `paths` | Manage agent skills | `--trigger user\|model` |
| `devin plugins install <source>` | Install plugin (GitHub `owner/repo[#path]`, git URL, or local path) | `-y, --yes` |
| `devin plugins list` / `info <name>` / `update [name]` / `remove <name>` / `prune` | Manage plugins | `--force` (remove) |
| `devin migrate hooks` | `.windsurf/hooks.json` → `.devin/hooks.v1.json` | — |
| `devin migrate workflows` | Migrate workflow files into skills | `--scope all\|workspace\|global` |
| `devin list` (alias `ls`) | Session picker for current directory | `--format json\|csv` |
| `devin rm` | Delete a session by id or name | — |
| `devin cloud drs ...` | Declarative Repo Setup: blueprints, sandbox sessions, builds | `whoami`, `sandbox-create --repo`, `run --devin-id --command --timeout`, `blueprint-list\|create\|write`, `build\|build-start\|build-wait\|build-logs`, `secret-create --key --value` |
| `devin ssh <session>` | SSH into a cloud session's VM | `--gateway <host[:port]>`, passthrough `ssh options...` |
| `devin forward <session> <port>...` | Forward cloud session ports to localhost | `--gateway <host[:port]>`; each port `<port>` or `<local>:<port>` |
| `devin acp` | Run as ACP server over stdio (spawned by editors) | `--agent-type <TYPE>`, `--model <MODEL>` |
| `devin setup` | Interactive setup wizard | `--force-manual-token-flow` |
| `devin doctor` | Diagnose local configuration | `--json` |
| `devin airgap doctor` | Air-gapped build only: license, config paths, model endpoints | `--json` |
| `devin sandbox setup` | Print sandbox prerequisites (Linux needs `bwrap`+`socat`; Windows via WSL 2) | — |
| `devin desktop` | Open Devin Desktop | `[PATH]...` |
| `devin update` | Check and install updates | `--force` |
| `devin version` | Print version | — |
| `devin uninstall` | Uninstall and optionally remove data | `--clean`, `--force` |

## Global flags

| flag | short | default | env var | description |
|---|---|---|---|---|
| `--model <MODEL>` | | account default | `DEVIN_MODEL` | Model for this session (fuzzy names ok: `opus`, `sonnet`, `codex`) |
| `--permission-mode <MODE>` | | `auto` (normal) | `DEVIN_PERMISSION_MODE` | `auto` / `accept-edits` / `smart` / `dangerous` (`bypass`, `yolo`) / `autonomous` (requires `--sandbox`) |
| `--sandbox` | | off | `DEVIN_SANDBOX` | [Research Preview] OS-level sandbox for the exec tool |
| `--cloud` | | off | | Drive Devin Cloud sessions instead of the local agent |
| `--continue` | `-c` | | | Resume most recent session in current directory |
| `--resume <SESSION_ID>` | `-r` | | | Resume a session by id (with `--cloud`: id or URL) |
| `--print [PROMPT]` | `-p` | | | Non-interactive: print response and exit |
| `--prompt-file <FILE>` | | | | Load initial prompt from a file |
| `--config <PATH>` | | `~/.config/devin/config.json` | | Alternate config file |
| `--export [PATH]` | | default path | | Export conversation (ATIF) after each turn |
| `--respect-workspace-trust <true\|false>` | | `true` | | `-p` mode fails in untrusted dirs; `false` skips the check |
| `--help` | `-h` | | | Print help |
| `--version` | `-V` | | | Print version |
