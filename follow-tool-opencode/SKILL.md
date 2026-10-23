---
name: follow-tool-opencode
description: "Operate OpenCode: TUI, run mode, providers, agents, skills, MCP, plugins, config, server"
argument-hint: "[scope]"
related:
  - use-devin-cli
  - follow-tool-qoder-cli
  - update-devin
  - use-mcp
  - follow-create-mcp
  - follow-best-practice
  - follow-default-config
  - follow-secret-manager
  - follow-up-to-date
  - deep-research
  - check-types-definition
  - learn-from-cli
  - follow-devin-global-skills
---

## Goal

Use this skill to operate OpenCode — the open-source AI coding agent (terminal TUI, desktop, web, server) — correctly: providers and auth, sessions, agents and permissions, config, MCP servers, plugins, skills, custom commands, and headless/scripted use

## Scope

Use for:
- Installing and upgrading OpenCode (v1 stable vs v2 channel — see `## Rules → 1`)
- Connecting LLM providers (`opencode auth`, `opencode models`) and choosing models
- Running interactive TUI sessions and non-interactive `opencode run` for scripts/CI
- Configuring `opencode.json(c)` (project/user/system precedence) without clobbering
- Creating agents, slash commands, permissions, and policies
- Connecting MCP servers, installing plugins, loading skills
- Headless server use: `opencode serve`, `opencode web`, `opencode pair`, `opencode attach`, GitHub agent

Boundary: using OpenCode only — maintaining this machine's Devin skills/config stays with `/update-devin` and `/follow-devin-global-skills`; comparable terminal agents → `/use-devin-cli`, `/follow-tool-qoder-cli`.

- Docs: https://opencode.ai/v2/docs/ (v1: https://opencode.ai/docs/) — live-check via `/deep-research` before use (`/follow-up-to-date`)
- References: [apis](references/apis.md) | [cli](references/cli.md)
- See best-practices/ for recommended patterns and pitfalls
- References: [OpenCode Best Practices](best-practices/opencode.md)

## Execute

### 1. Verify Installation And Channel

> Goal: the right OpenCode version is installed for this machine

1. Run `opencode --version` — `1.x` is the v1 stable line; v2 docs describe the `@opencode/cli` v2 channel; confirm the command surface with `opencode --help`
2. If missing → v2: `curl -fsSL https://opencode.ai/v2/install -o /tmp/opencode-install.sh && bash /tmp/opencode-install.sh`, `npm install -g @opencode/cli` (postinstall picks the native binary — with bun use `bun install -g --trust @opencode/cli`, with pnpm `pnpm add -g --allow-build=@opencode/cli @opencode/cli`), `brew install anomalyco/tap/opencode-v2`, or `mise use -g opencode` (mise ≥ 2026.10.9 — older mise installs v1); Windows package managers unsupported — use the curl script, npm, or the platform zip binaries
3. Upgrade with `opencode upgrade [target]` (`--method curl|npm|pnpm|bun|brew` matching the original install)
4. Diagnose with `opencode debug` and `--print-logs --log-level DEBUG` when a run misbehaves

### 2. Connect Providers And Pick Models

> Goal: at least one working provider, model names confirmed

1. Run `opencode auth login` (or `/connect` in the TUI) — providers come from Models.dev; credentials store in `~/.local/share/opencode/auth.json`; env vars and `.env` are also read
2. List exact model IDs with `opencode models [provider]` (`--refresh` re-fetches, `--verbose` shows costs) — always use `provider/model` format from this list, never guessed names
3. Reference/config management: `opencode auth list`, `opencode auth logout`
4. Optional hosted access: OpenCode Console / OpenCode Go subscription when you want curated coding models without per-provider keys

### 3. Run Sessions

> Goal: sessions started the right way for the task

1. `opencode` (or `opencode <project>`) starts the TUI; `opencode run "message"` is single-shot non-interactive
2. Resume work: `-c/--continue`, `-s/--session <id>`, `--fork` to branch when continuing; `-m provider/model` and `--agent <name>` select model/agent per session
3. In the TUI use `/` for slash commands (including custom commands and skills), `@` for file context
4. Manage history: `opencode session list [--format json -n N]`, `opencode session delete <id>`, `opencode export [id]` (`--sanitize` before sharing), `opencode import <file|share-url>`
5. Review cost/usage with `opencode stats [--days N --models]`

### 4. Configure

> Goal: minimal, correct `opencode.json(c)`

1. Create `opencode.jsonc` at the project root (or `.opencode/opencode.jsonc`); always add `"$schema": "https://opencode.ai/config.json"` and treat the schema as the source of truth (`/check-types-definition`)
2. Precedence (lowest→highest): global `~/.config/opencode/` → project configs (root toward cwd) → `.opencode/` variants → system dir (`%ProgramData%\opencode` on Windows, `/etc/opencode` Linux) — managed settings can't be overridden by projects
3. Keep only overrides of defaults per `/follow-default-config`; common keys: `model`, `default_agent`, `shell`, `update`, `permissions`, `agents`, `mcp`, `skills`, `commands`, `instructions`, `plugins`, `providers`, `compaction`, `formatter`, `snapshots` (full table in `references/apis.md`)
4. Point `instructions` at real files (e.g. `AGENTS.md`, `CONTRIBUTING.md`) instead of duplicating guidance
5. Provider/API keys go to auth or env (`/follow-secret-manager` patterns), never into committed config

### 5. Define Agents, Permissions, And Commands

> Goal: reusable autonomy scoped per task

1. Create an agent: `opencode agent create` (`--description`, `--mode primary|subagent`, `--permissions bash,read,edit,glob,grep,webfetch,task,websearch,lsp,skill` — anything omitted is denied; `--path` for file location) or edit `agents/*.md` files; list with `opencode agent list`
2. Encode least privilege in agent config: e.g. deny `edit` for a reviewer agent (see `references/apis.md` `agents` key)
3. Set global guardrails with `permissions` rules (`{action, resource, effect: allow|deny|ask}`) and hard restrictions with `policies`
4. Define slash commands as config `commands` templates or `commands/*.md` files; invoke with `/name` in the TUI or `opencode run --command <name>`
5. Enable plan-style read-only behavior via an agent with edit denied rather than loosening global permissions

### 6. Extend With MCP, Plugins, And Skills

> Goal: tools and knowledge wired in, verified connected

1. MCP: `opencode mcp add` (guided local/remote), `opencode mcp list|auth|logout|debug`; or config `mcp.servers` (`type: local` with `command`, remote with URL/OAuth) — see `/use-mcp`, author servers with `/follow-create-mcp`
2. Plugins: `opencode plugin <module>` (`--global`, `--force`) or config `plugins` array (string or `{package, options}`); run without them via `--pure` when a plugin misbehaves
3. Skills: OpenCode discovers `.opencode/skills/<name>/SKILL.md` and loads `skills` directories/URLs from config; it also reads Claude-compat `.claude/skills` unless `OPENCODE_DISABLE_CLAUDE_CODE_SKILLS` is set — this repo's skill format (`SKILL.md` + frontmatter) is compatible; cross-tool standards live in `/follow-devin-global-skills`
4. Confirm each integration is actually loaded: `opencode mcp list` status, `/help` in the TUI for commands/skills

### 7. Server, Remote, And Automation

> Goal: headless OpenCode reachable and scriptable

1. `opencode serve --port N --hostname H` — HTTP API without TUI; `opencode web` — server + browser UI; set `OPENCODE_SERVER_PASSWORD` (username `OPENCODE_SERVER_USERNAME`, default `opencode`) for basic auth
2. `opencode pair` (v2) prints the local URL + credentials for web/mobile access; `opencode attach <url>` connects a local TUI to a remote backend
3. Script with `opencode run --format json "..."` — parse events; `--attach http://localhost:PORT` reuses a warm server so MCP cold boots don't dominate; `--auto` auto-approves non-denied permissions only in trusted contexts
4. Repository automation: `opencode github install` (GitHub Actions agent), `opencode github run` (CI); `opencode pr <number>` checks out the PR branch then starts
5. `opencode acp` serves ACP over stdio for ACP-aware editors; `opencode completion` generates shell completions

## Rules

### 1. Version Channel

- v1 (`opencode --version` → `1.x`, docs https://opencode.ai/docs/) and v2 (`@opencode/cli`, docs https://opencode.ai/v2/docs/) differ — check `opencode --help` of the installed build before assuming a command exists; local verification 2026-10-15 saw `1.19.0`
- `mise use -g opencode` installs v1 on mise older than 2026.10.9 — check mise version first when v2 is intended

### 2. Safety

- Never use `--auto` as a habit; scope autonomy into agents/permissions with explicit `deny` rules; `policies` for hard organizational limits
- No API keys in committed config or prompts; use `opencode auth` storage or env vars
- `opencode export --sanitize` before sharing sessions anywhere; session data contains file contents
- `opencode uninstall` removes related files — preview with `--dry-run`, keep data with `--keep-config`/`--keep-data` if unsure

### 3. Model And Provider Hygiene

- Model IDs must come from `opencode models` — they are `provider/model`, and configs referencing stale IDs fail silently to defaults
- Prefer pinned explicit model in project `opencode.jsonc` for team reproducibility; use `--model` for one-off experiments
- Set `update` policy deliberately (`notify` default); auto-update does not restart a running server — restart to activate

### 4. Related Skills

- run /use-devin-cli or /follow-tool-qoder-cli to compare or operate those terminal agents instead
- run /use-mcp when wiring MCP servers; run /follow-create-mcp when the server itself must be built
- run /check-types-definition against the config schema before adding keys; run /follow-default-config to strip default-valued boilerplate
- run /learn-from-cli to re-derive the command surface after an upgrade; run /deep-research and use /follow-best-practice if needed

## Expected Outcome

- OpenCode installed on the intended version channel with confirmed providers
- Sessions run interactively and headless (`opencode run`) with exact `provider/model` IDs
- Minimal, schema-validated `opencode.jsonc` with least-privilege agents and permissions
- MCP servers, plugins, skills, and commands loaded and verified working
- Server/remote and GitHub-agent workflows operating with auth enabled
