---
name: follow-tool-qoder-cli
description: "Use Qoder CLI: sessions, modes, permissions, models, MCP, skills, plugins, hooks, headless runs"
argument-hint: "[scope]"
related:
  - follow-tool-devin-cli
  - follow-tool-opencode
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

Use this skill to operate Qoder CLI — the terminal AI coding agent (`qoder` / `qodercli`) — correctly: install and authenticate, pick a working mode, set permission modes and rules, manage sessions and models, extend with MCP/skills/plugins/hooks/subagents, and run headless in scripts and CI/CD

## Scope

Use for:
- Installing and upgrading Qoder CLI (native script vs legacy npm — see `## Rules → 1`), and signing in (`/login`, PAT for CI)
- Choosing a working mode: interactive, Plan, Goal, Scheduled Task, `/loop`, Workflow, Headless
- Setting permission modes (`default`/`accept_edits`/`auto`/`bypass_permissions`/`dont_ask`) and `permissions.allow/ask/deny` rules
- Running and managing sessions (`-c`, `-r`, `--fork-session`, `/rewind`, `/export`) and picking models (`-m`, `--list-models`, `/model`)
- Configuring `settings.json` (user/project/local precedence) without clobbering
- Connecting MCP servers, installing skills/plugins, managing hooks and subagents
- Headless automation: `qoder -p --output-format json`, `qoder commit`, `qoder security scan`, remote-control daemon

Boundary: operating the Qoder terminal agent only — maintaining this machine's Devin skills/config stays with `/update-devin` and `/follow-devin-global-skills`; comparable terminal agents → `/follow-tool-devin-cli`, `/follow-tool-opencode`.

- Docs: https://docs.qoder.com/cli/overview — live-check via `/deep-research` before use (`/follow-up-to-date`)
- References: [apis](references/apis.md) | [cli](references/cli.md)
- See best-practices/ for recommended patterns and pitfalls

## Execute

### 1. Verify Installation And Sign In

> Goal: a working, authenticated `qoder` on the intended build

1. Run `qoder --version` and `qoder --help` to confirm the command surface; local verification 2026-10-15 saw `1.1.71` (native standalone build)
2. If missing → install script (recommended, native binary): macOS/Linux `curl -fsSL https://qoder.com/install | bash`; Windows PowerShell `irm https://qoder.com/install.ps1 | iex`; Windows CMD `curl -fsSL https://qoder.com/install.cmd -o install.cmd && install.cmd`. Prefer the script over `npm install -g @qoder-ai/qodercli` (legacy JS bundle, slower, needs Node ≥ 20) — see `## Rules → 1`
3. Sign in: run `qoder` then `/login` (browser or paste token). For CI/headless set `QODER_PERSONAL_ACCESS_TOKEN` (create at https://qoder.com/account/integrations); when both are present the env PAT wins — clear it to use `/login` credentials (`/follow-secret-manager`)
4. Upgrade with `qoder update` (auto-upgrade is on by default; disable via `general.enableAutoUpdate: false` in `~/.qoder/settings.json`); revert with `qoder rollback`. Config dir default `~/.qoder`, override with `QODER_CONFIG_DIR`

### 2. Choose A Working Mode

> Goal: the right level of autonomy for the task

1. `qoder` (or `qoder <project>`) starts interactive TUI — chat and work, monitor actions, confirm permissions live
2. Complex or broad changes → `/plan` (read-only exploration, outputs a plan, exit to execute); clear endpoint → `/goal <goal>` (works until the completion condition holds)
3. Repetition and scheduling → `/loop` (fixed intervals), Scheduled Task (calendar time), `/workflows` + `/tasks` + `/kanban` for multi-agent orchestration
4. Scripts/CI → Headless `qoder -p "..."` (see step 7); combine with permission flags since no one is present to confirm
5. Modes combine: Plan to agree the approach, then Goal to execute autonomously; Headless + a permission mode for unattended automation

### 3. Set Permission Mode And Rules

> Goal: least-privilege autonomy that still gets work done

1. Pick a mode: `default` (confirm sensitive actions), `accept_edits` (auto-approve safe in-dir edits), `auto` (agent/classifier decides), `bypass_permissions`/`--yolo` (skip prompts, trusted dirs only), `dont_ask` (never prompt — deny anything that would ask). Set per session with `--permission-mode <mode>` or `general.defaultPermissionMode`; cycle with Shift+Tab, jump to YOLO with Ctrl+Y
2. Non-default modes only apply in trusted directories; untrusted cwd falls back to `default` (Folder Trust gated by `security.folderTrust.enabled`)
3. Encode precise rules under `permissions.allow` / `permissions.ask` / `permissions.deny` using tool-target syntax: `Read(/src/**)`, `Edit(/src/**)`, `Bash(npm run test:*)`, `WebFetch`. Decision order: deny → tool safety checks → ask → allow — a broad allow never overrides a matched deny/ask or a safety check
4. In-session, `/allow Bash(npm test)` and `/deny WebFetch` persist to `settings.local.json`; review/adjust all rules with `/permissions`
5. Use `autoMode.allow` / `autoMode.soft_deny` / `autoMode.environment` (global settings only) as soft guidance for the `auto` classifier; lock down YOLO org-wide with `security.disableYoloMode: true`

### 4. Run And Manage Sessions

> Goal: start, resume, branch, and export sessions reliably

1. Start: `qoder` (new session); name with `-n "Refactor login"`; pin an id with `--session-id <uuid>` for scripts
2. Continue/resume: `-c` most recent, `-r [id]` (no id opens the Session Browser), `--fork-session` to branch a resumed session instead of continuing it
3. In-session: `/new` `/clear` `/continue` `/resume` `/rename` `/branch`; `/rewind` rolls back to a checkpoint (code + conversation); `/compact` frees context-window space; `/export` writes the conversation to file/clipboard
4. Manage: `qoder --list-sessions`, `qoder --delete-session <index>`; session logs live under `~/.qoder/projects/<project>/<session-id>.jsonl` (+ `state.json`) — `/export` sanitizes before sharing since logs contain file contents

### 5. Select Models And Configure Settings

> Goal: minimal, schema-correct `settings.json` with a confirmed model

1. List real models with `qoder --list-models` or `/model`; select per session with `-m/--model <name|modelID>` (Custom providers use modelID). Never guess IDs
2. Tune reasoning/context: `--reasoning-effort`, `--thinking auto|adaptive|enabled|disabled`, `--thinking-budget <tokens>`, `--context-window <size>`, `--max-output-tokens`
3. Config is `settings.json` at three levels — user `~/.qoder/settings.json` → project `<project>/.qoder/settings.json` → local `<project>/.qoder/settings.local.json`, plus `--settings <path>` (highest). Deep merge, higher overrides lower; keep only overrides of defaults per `/follow-default-config`
4. Always add comments and reference env vars where needed; edit via `/settings` or the file. Common groups: `model`, `ui`, `tools`, `security`, `mcp`, `mcpServers`, `permissions`, `general`, `statusLine` (full table in `references/apis.md`); many keys require a restart
5. Point project instructions at real files (`AGENTS.md`, generated by `/init`) instead of duplicating guidance; API keys/PATs go to env or `/login`, never committed config

### 6. Extend With MCP, Skills, Plugins, Hooks, Subagents

> Goal: tools and knowledge wired in and verified loaded

1. MCP: `qoder mcp add <name> -- <command>` (or `add-json`, remote URL), `qoder mcp list|get|remove|enable|disable`; or config `mcpServers` (transports stdio/sse/http/ws/sdk). Project servers need approval unless `mcp.enableAllProjectMcpServers` or an allowlist — see `/use-mcp`, author servers with `/follow-create-mcp`
2. Skills: Qoder discovers `~/.qoder/skills/<name>/SKILL.md` (user) and `.qoder/skills/<name>/SKILL.md` (project); frontmatter needs `name` (lowercase/hyphens ≤64) and `description` (≤1024, the trigger signal). This repo's `SKILL.md` format is compatible — cross-tool standards in `/follow-devin-global-skills`. Manage with `qoder skills install|list|enable|disable|link|uninstall` and `/skills reload`
3. Plugins: `qoder plugins install|list|validate|enable|disable|update|uninstall` and `qoder plugins marketplace`; load a local dir with `--plugin-dir <dir>`
4. Hooks: `qoder hooks migrate` imports Claude Code hooks; manage with `/hooks`
5. Subagents/agents: built-ins (general-purpose, Explore, Plan, statusline-setup, qoder-guide) auto-delegate or run via `--agent <name>`/`--agents <json>`; create/edit with `/agents`; list with `qoder agents list`
6. Confirm each integration actually loaded: `qoder mcp list` status, `/skills`, `/tools`, `/help`

### 7. Headless, Automation, And Remote

> Goal: scriptable, CI-safe, and remote operation

1. Run `qoder -p "..."` (prompt as arg or via stdin); format with `-o text|json|stream-json` (`stream-json` for real-time events), cap with `--max-turns`; pre-set permissions — headless `ask` becomes deny
2. CI example: `export QODER_PERSONAL_ACCESS_TOKEN=...` then `qoder -p "Review these changes" --output-format json --permission-mode accept_edits --max-turns 20`
3. Restrict tool surface with `--allowed-tools 'Read,Bash(git status)'` / `--disallowed-tools` / `--tools`; use `--no-session-persistence` with `-p` when a run must not touch disk
4. Repo automation: `qoder commit -m "..."` (AI commit message + commit; `--hook` verifies AI stats), `qoder security scan [paths]` (L2/L3 cloud scan), `qoder wiki --repo <path> --language en,zh` (project docs)
5. Remote: `qoder --remote [task]` creates a cloud session and prints its URL; `--teleport <id>` / `--remote-session <id>` attach; `qoder remote-control` runs the daemon (`--spawn same-dir|worktree`, `--capacity`), `--remote-control <id>` runs a headless worker; `--worktree [name]` starts in a fresh git worktree

## Rules

### 1. Install Channel

- The native install script (`qoder.com/install`) and the legacy npm package `@qoder-ai/qodercli` differ — the npm path runs a JS bundle on Node ≥ 20 with lower startup/runtime performance (especially Windows); prefer the script for new installs (`qoder --version` local check 2026-10-15 → `1.1.71`)
- Windows arm64 is not supported; require macOS/Linux/Windows, CPU arm64/amd64

### 2. Safety

- Never make `--yolo`/`bypass_permissions` a habit; scope autonomy with `accept_edits` and explicit `deny` rules; even YOLO keeps path-shape guards (rm of cwd/home/root/top-level still asks)
- A broad `allow` never means everything runs silently — deny rules, safety checks, and ask rules take precedence over allow
- No PATs/keys in committed config or prompts; use `QODER_PERSONAL_ACCESS_TOKEN` (env) or `/login`; `settings.local.json` is machine-local — keep it out of git
- `/export` (and raw `.jsonl` session logs) contain file contents — sanitize before sharing; `dont_ask` mode silently denies anything needing confirmation, so verify a headless run isn't being blocked

### 3. Model And Config Hygiene

- Model IDs must come from `qoder --list-models` / `/model`; referencing stale or guessed IDs fails to defaults
- Prefer a pinned `model.name` in project `settings.json` for team reproducibility; use `-m` for one-off experiments
- Non-default permission modes and Project/Local `settings.json` apply only in trusted directories — untrusted cwd loads User-level config and `default` mode only

### 4. Related Skills

- run /follow-tool-devin-cli or /follow-tool-opencode to compare or operate those terminal agents instead
- run /use-mcp when wiring MCP servers; run /follow-create-mcp when the server itself must be built
- run /check-types-definition against the settings schema before adding keys; run /follow-default-config to strip default-valued boilerplate
- run /learn-from-cli to re-derive the command surface after an upgrade; run /deep-research and use /follow-best-practice when unsure; use /follow-secret-manager for PAT handling

## Expected Outcome

- Qoder CLI installed via the native script and authenticated (`/login` or CI PAT), on the intended build
- The correct working mode chosen and permission mode/rules set with least-privilege autonomy
- Sessions started, resumed, branched, and exported with confirmed `--list-models` model IDs
- Minimal, schema-correct `settings.json` with MCP servers, skills, plugins, hooks, and subagents loaded and verified
- Headless `-p` runs (json/stream-json), `commit`/`security`/`wiki`, and remote-control automation working in trusted, CI-authenticated contexts
