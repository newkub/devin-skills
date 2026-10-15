# CLI Reference

## Subcommands

| command | purpose |
| --- | --- |
| `qoder` | start interactive TUI (new session) |
| `qoder <project>` | start in a specific project |
| `qoder -p "..."` | headless: print response and exit |
| `qoder mcp add <name> [cmdOrUrl] [args...]` | add an MCP server (`--` separates a stdio command) |
| `qoder mcp add-json <name> <json>` | add an MCP server from a JSON string |
| `qoder mcp remove <name>` | remove an MCP server |
| `qoder mcp get <name>` | show a server's effective config |
| `qoder mcp list` | list configured MCP servers |
| `qoder mcp enable\|disable <name>` | toggle a server |
| `qoder mcp reset-project-choices` | reset approved/rejected project `.mcp.json` servers |
| `qoder skills list` | list discovered agent skills |
| `qoder skills install <source>` | install from git URL, HTTPS zip, local path, or `.skill`/`.zip` |
| `qoder skills link <path>` | link a local skill (edits reflect immediately) |
| `qoder skills enable\|disable <name>` | toggle a skill |
| `qoder skills uninstall <name>` | remove a skill by name |
| `qoder plugins install\|i <plugin>` | install from marketplace, HTTPS zip, or local dir |
| `qoder plugins list` | list installed plugins |
| `qoder plugins validate <path>` | validate a plugin dir/manifest |
| `qoder plugins enable\|disable\|update\|uninstall <plugin>` | manage a plugin |
| `qoder plugins marketplace\|mp ...` | manage plugin marketplaces |
| `qoder hooks migrate` | migrate hooks from Claude Code |
| `qoder agents list` | list discovered agents (subagents) |
| `qoder login` | sign in to your account |
| `qoder status` | show session status |
| `qoder update` | update to the latest version |
| `qoder rollback` | roll back to a previous version |
| `qoder commit -m "..."` | generate commit message and commit (`--hook` verifies AI stats) |
| `qoder security scan [paths...]` | scan repo/paths for security issues |
| `qoder feedback` | submit feedback |
| `qoder remote-control` | start the remote-control daemon |
| `qoder wiki ...` | generate wiki docs (`--repo`, `--language`, `--branch`, `-f`) |
| `qoder --version` / `qoder --help` | version / help |

## Global Flags

| flag | default | purpose |
| --- | --- | --- |
| `-p, --print` | off | non-interactive: print and exit |
| `-i, --prompt-interactive <text>` | — | run prompt then stay interactive |
| `-m, --model <model>` | auto | model name (Custom uses modelID) |
| `--list-models` | — | list available models for the user |
| `--reasoning-effort <level>` | — | reasoning effort level |
| `--thinking <mode>` | — | `auto`/`adaptive`/`enabled`/`disabled` |
| `--thinking-budget <tokens>` | — | fixed thinking budget (implies `--thinking enabled`) |
| `--context-window <size>` | — | explicit context window |
| `--max-output-tokens <size>` | — | max model output tokens |
| `--max-turns <count>` | — | cap conversation turns for one query |
| `-c, --continue` | off | continue most recent session |
| `-r, --resume [id]` | — | resume by id (no id → Session Browser) |
| `--fork-session` | off | branch a resumed session |
| `-n, --name <name>` | — | session display name |
| `--session-id <id>` | — | use a specific session id |
| `--list-sessions` | — | list sessions and exit |
| `--delete-session <index>` | — | delete session by index |
| `--no-session-persistence` | off | do not save to disk (with `-p` only) |
| `--permission-mode <mode>` | `default` | `default`/`accept_edits`/`auto`/`bypass_permissions`/`dont_ask` |
| `--yolo`, `--dangerously-skip-permissions` | off | = `--permission-mode bypass_permissions` |
| `--allowed-tools <tool>` | — | tools to allow, e.g. `'Read,Bash(git status)'` |
| `--disallowed-tools <tool>` | — | tools to deny |
| `--tools <tools...>` | — | restrict built-in tools (`""` none, `"default"` all) |
| `--allowed-mcp-server-names <name>` | — | limit loading to named MCP servers |
| `--mcp-config <config>` | — | load MCP servers from JSON file(s)/inline |
| `--strict-mcp-config` | off | use only `--mcp-config` servers |
| `-o, --output-format <fmt>` | `text` | `text`/`json`/`stream-json` |
| `--input-format <fmt>` | `text` | `text`/`stream-json` |
| `--attachment <file>` | — | attach files to the initial prompt |
| `-w, --cwd <dir>` | — | change working dir before startup |
| `--add-dir <dir>` | — | add extra dirs to the workspace |
| `--worktree [name]` | off | start in a new git worktree |
| `--config-dir <dir>` | `~/.qoder` | custom user config root for this run |
| `--settings <json>` | — | extra settings file path or inline JSON |
| `--setting-sources <source>` | — | sources to load: `user`,`project`,`local` |
| `--agent <name>` | — | agent for the session |
| `--agents <json>` | — | JSON defining custom agents |
| `--system-prompt <text>` | — | override system prompt |
| `--append-system-prompt <text>` | — | append to default system prompt |
| `--output-style <style>` | — | output style for the session |
| `--plugin-dir <dir>` | — | plugin directories to load |
| `--max-model-request-retries <count>` | — | retries for model requests |
| `--remote [task]` | — | create a cloud remote session, print URL |
| `--remote-session <id>` | — | cold-load and attach to a remote session |
| `--teleport <id>` | — | load and attach to a remote session |
| `--remote-control <id>` | — | run as a headless remote-control worker |
| `-d, --debug` | off | debug mode |

## Slash Commands (in-session)

| group | commands |
| --- | --- |
| session | `/new` `/clear` `/continue` `/resume` `/rename` `/branch` `/rewind` `/export` `/compact` `/quit` |
| account/config | `/login`(`/signin`) `/logout`(`/signout`) `/model` `/theme` `/editor` `/settings` `/init` `/profile` `/privacy` `/permissions` `/vim` `/voice` `/statusline` `/status` |
| extensions | `/agents` `/skills` (`/skills reload`) `/mcp` (`/mcp reload`) `/hooks` `/plugins` `/marketplace` `/tools` |
| workflows | `/plan` `/goal <text>` `/loop` `/tasks` `/workflows` `/kanban` `/review` `/diff` `/allow` `/deny` |
| info | `/help` `/docs` `/shortcuts` `/usage` `/insights` `/context` `/release-notes` `/feedback` `/about` |

## Keyboard Shortcuts

| key | action |
| --- | --- |
| `Shift+Tab` | cycle permission modes |
| `Ctrl+Y` | jump to YOLO (`bypass_permissions`) |
| `/` | list slash commands (fuzzy match) |
