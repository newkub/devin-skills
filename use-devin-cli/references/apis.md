| key | value |
|---|---|
| package | `devin` binary (bundled by Devin CLI installer — not on any registry; npm `devin` is unrelated) |
| install | `curl -fsSL https://cli.devin.ai/install.sh -o /tmp/devin-install.sh && bash /tmp/devin-install.sh` · `brew install --cask devin-cli` · Windows: `irm https://static.devin.ai/cli/setup.ps1 -OutFile $env:TEMP\devin-setup.ps1; & $env:TEMP\devin-setup.ps1` (PowerShell only) |
| stable version | `3000.11.3` (verified locally 2026-10-15) |
| license | Proprietary (Cognition) |
| docs | https://docs.devin.ai/cli |
| index | https://docs.devin.ai/llms.txt |
| config | `~/.config/devin/config.json` (Windows: `%APPDATA%\devin\config.json`) |
| env vars | `DEVIN_MODEL`, `DEVIN_PERMISSION_MODE`, `DEVIN_SANDBOX`, `WINDSURF_API_KEY` (ACP auth) |

## Slash commands (interactive session)

| api | description | signature/example |
|---|---|---|
| `/help` | List slash commands | `/help` |
| `/mode` | Show or switch mode | `/mode normal\|accept-edits\|smart\|plan\|bypass\|autonomous` |
| `/normal` `/accept-edits` `/smart` `/bypass` `/autonomous` | Direct mode switch (`/bypass` aliases `/yolo`, `/dangerous`) | `/accept-edits` |
| `/plan` | Read-only Plan agent mode | `/plan refactor auth` |
| `/ask` | Read-only oneshot question | `/ask what does this hook do` |
| `/model` | Show or change model | `/model opus` |
| `/fast` | Switch to SWE-1.6 Fast | `/fast` |
| `/theme` | Switch theme | `/theme dark\|light\|terminal-dark\|terminal-light\|no-color` |
| `/clear` `/new` | Reset conversation | `/clear` |
| `/continue` `/resume` | Resume session (picker or by id) | `/resume brisk-otter` |
| `/fork` | Fork session, optionally at a step | `/fork 12` |
| `/steps` | List conversation steps | `/steps` |
| `/revert` | Rewind conversation + file changes from a step | `/revert 12` |
| `/ls` | List sessions (`--all` across dirs) | `/ls --all` |
| `/title` `/rename-session` | Rename session | `/title auth refactor` |
| `/rm-session` | Delete a session irreversibly | `/rm-session <id>` |
| `/export` | Show export info (enable with `--export`) | `/export` |
| `/workspace` `/add-dir` `/remove-dir` `/undo-add-dir` | Manage workspace roots | `/add-dir ../shared-lib` |
| `/loop` | Run prompt then auto-review diff in a loop (clean git state required) | `/loop fix lint errors` |
| `/btw` | Side question using current context, not added to main conversation | `/btw why is this async` |
| `/compact` | Force conversation compaction | `/compact` |
| `/context` | Show context window usage | `/context` |
| `/usage` | Credit/ACU summary | `/usage` |
| `/session-stats` (alias `/stats`) | Full usage dimensions | `/stats` |
| `/copy` | Copy last response to clipboard | `/copy` |
| `/feedback` | Rate last response | `/feedback up\|down` |
| `/shortcuts` | Browse and rebind keybindings | `/shortcuts` |
| `/config` | Interactive config editor | `/config` |
| `/mcp` | List MCP servers and status | `/mcp` |
| `/hooks` | List loaded hooks | `/hooks` |
| `/login` `/logout` `/login-status` `/org` `/upgrade` | Account management | `/login-status` |
| `/update` | Check/install updates (`--force`) | `/update --force` |
| `/bug` | Report a bug to Devin CLI devs | `/bug renderer crashes on resize` |
| `/mouse` | Toggle mouse event capture | `/mouse` |
| `/cloud` | Switch fresh local session to cloud | `/cloud` |
| `/handoff` `/pickup` | Move work local ↔ cloud | `/handoff finish the migration` |
| `/repo` `/platform` `/open` `/ssh` `/archive` `/rename` | Cloud session controls | `/open desktop` |
| `/skill-name` | Invoke a skill (user trigger) | `/review` |

## Config keys (`config.json`)

| api | description | signature/example |
|---|---|---|
| `agent.model` | Default model for sessions | `{"agent": {"model": "swe-1-6-fast"}}` |
| `--config <PATH>` | Per-call alternate config file | `devin --config ./ci.json -p "..."` |

## Permission modes

| api | description | auto-approves |
|---|---|---|
| `normal` (alias `auto`, default) | Read-only auto, write/execute prompt | reads in cwd |
| `accept-edits` | Also auto-approves workspace edits | file edits in workspace |
| `smart` | Fast model judges other actions safe (still prompts on rm/sudo/package installs/mutating git) | judged-safe actions |
| `dangerous` (aliases `bypass`, `yolo`) | Everything | all tool calls |
| `autonomous` | Requires `--sandbox`; prompts for capabilities not commands | sandboxed shell; prompts on network and out-of-scope writes |
