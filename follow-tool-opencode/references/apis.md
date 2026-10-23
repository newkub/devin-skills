| key | value |
|---|---|
| package | `@opencode/cli` (v2 channel) · v1 stable `opencode` |
| install | `curl -fsSL https://opencode.ai/v2/install -o /tmp/opencode-install.sh && bash /tmp/opencode-install.sh` · `npm install -g @opencode/cli` · `bun install -g --trust @opencode/cli` · `brew install anomalyco/tap/opencode-v2` · `mise use -g opencode` (mise ≥ 2026.10.9 for v2) |
| stable version | local `opencode --version` → `1.19.0` (verified 2026-10-15); v2 docs: https://opencode.ai/v2/docs/ |
| license | Open source |
| docs | https://opencode.ai/v2/docs/ (v1: https://opencode.ai/docs/) |
| repo images | Docker `ghcr.io/anomalyco/opencode:<version>` |
| config | `opencode.json(c)` — project root, `.opencode/`, global `~/.config/opencode/`, system `%ProgramData%\opencode` / `/etc/opencode` |
| config schema | https://opencode.ai/config.json |
| credentials | `~/.local/share/opencode/auth.json` |
| skills dir | `.opencode/skills/<name>/SKILL.md` (project), `~/.config/opencode/skills/` (global), plus configured `skills` paths/URLs |

## Config keys (`opencode.jsonc`)

| api | description | signature/example |
|---|---|---|
| `$schema` | Editor validation | `"https://opencode.ai/config.json"` |
| `model` | Default model (`provider/model`) | `"anthropic/claude-sonnet-4-5"` |
| `default_agent` | Primary agent for new sessions | `"build"` |
| `shell` | Shell for terminal/shell tools | `"/bin/zsh"` |
| `update` | Update policy | `"disable"` \| `"notify"` (default) \| `"auto"` (global only) |
| `permissions` | Ordered tool rules | `[{ "action": "shell", "resource": "git push *", "effect": "ask" }]` |
| `policies` | Hard allow/deny (provider.use, tool.use) | `[{ "action": "provider.use", "resource": "*", "effect": "deny" }]` |
| `agents` | Custom/override agents | `{ reviewer: { description, mode: "subagent", system, permissions } }` |
| `mcp.servers` | Local/remote MCP servers | `{ playwright: { type: "local", command: ["bunx", "@playwright/mcp"] } }` |
| `skills` | Extra skill dirs or URLs | `["./team-skills", "https://example.com/.well-known/skills/"]` |
| `commands` | Slash-command templates | `{ review: { description, template } }` |
| `instructions` | Extra instruction files/globs/URLs | `["CONTRIBUTING.md", "docs/guidelines/*.md"]` |
| `plugins` | Plugin packages/options | `["opencode-example-plugin", { "package": "./plugins/local", "options": {} }]` |
| `providers` | Provider/model overrides, transport | `{ openai: { models: {...}, settings: { transport: "websocket" } } }` |
| `references` | Named supporting context (dir or repo) | `{ docs: { path: "../product-docs", description } }` |
| `snapshots` | Filesystem snapshots for undo/revert | `false` |
| `watcher.ignore` | Paths not triggering FS updates | `["dist/**", "coverage/**"]` |
| `formatter` | Format after write/edit/patch | `true` |
| `tool_output` | Tool result retention caps | `{ max_lines: 2000, max_bytes: 51200 }` |
| `media.image` | Image resize/limits | `{ auto_resize: true, max_width: 2000 }` |
| `websearch.provider` | Web search selection | `{ provider: "random" }` |
| `compaction` | Auto context compaction | `{ auto: true, keep: { tokens: 15000 }, buffer: 20000 }` |
| `warming` | Keep model sessions warm | `{ interval: "4 minutes", duration: "30 minutes" }` |
| `worktree.directory` | Parent dir for new worktrees | `"../worktrees"` |
| `share` | Sharing policy (accepted, not supported yet) | `"manual"` |
| `username` | Accepted, not displayed | `"alice"` |

## Agent tool permissions

| api | description | values |
|---|---|---|
| permission actions | Tools an agent may use | `bash`, `read`, `edit`, `glob`, `grep`, `webfetch`, `task`, `websearch`, `lsp`, `skill` |
| effects | Rule outcome | `allow`, `deny`, `ask` |
| modes | Agent role | `all`, `primary`, `subagent` |

## Environment variables (main)

| api | description | example |
|---|---|---|
| `OPENCODE_CONFIG` / `OPENCODE_CONFIG_DIR` / `OPENCODE_CONFIG_CONTENT` | Config file/dir/inline JSON override | `OPENCODE_CONFIG=./ci.jsonc` |
| `OPENCODE_SERVER_PASSWORD` / `OPENCODE_SERVER_USERNAME` | Basic auth for `serve`/`web`/`attach` | username default `opencode` |
| `OPENCODE_PERMISSION` | Inlined permissions JSON | — |
| `OPENCODE_AUTO_SHARE` | Auto-share sessions | boolean |
| `OPENCODE_DISABLE_AUTOUPDATE` | Disable update checks | boolean |
| `OPENCODE_DISABLE_CLAUDE_CODE[_PROMPT\|_SKILLS]` | Stop reading `.claude` prompts/skills | boolean |
| `OPENCODE_DISABLE_LSP_DOWNLOAD` / `OPENCODE_DISABLE_MODELS_FETCH` | No LSP/model auto-download | boolean |
| `OPENCODE_DISABLE_MOUSE` / `OPENCODE_DISABLE_TERMINAL_TITLE` | TUI behavior | boolean |
| `OPENCODE_MODELS_URL` | Custom models catalog | URL |
| `OPENCODE_GIT_BASH_PATH` | Git Bash path on Windows | path |
| `OPENCODE_ENABLE_EXPERIMENTAL_MODELS` / `OPENCODE_EXPERIMENTAL` | Experimental features | boolean |
| `OPENCODE_CLIENT` | Client identifier | default `cli` |
