---
name: use-devin-cli
description: "Use Devin CLI: sessions, modes, models, cloud, MCP, skills, plugins, scripted runs"
argument-hint: "[scope]"
related:
  - follow-tool-devin
  - follow-tool-qoder-cli
  - update-devin
  - update-agents-skills-global
  - follow-devin-global-skills
  - follow-tool-usage
  - follow-best-practice
  - follow-default-config
  - follow-up-to-date
  - deep-research
  - check-types-definition
  - use-mcp
---

## Goal

Use this skill to operate the Devin CLI (`devin`) — the local terminal coding agent with Devin Cloud integration — correctly and productively: sessions, permission modes, models, extensibility (rules, skills, MCP, plugins, hooks), cloud workflows, and scripted non-interactive runs

## Scope

Use for:
- Running interactive REPL sessions and single-turn (`-p`) sessions
- Choosing permission modes (Normal, Accept Edits, Smart, Bypass, Autonomous) and agent modes (Normal, Plan, Ask)
- Selecting models and using Fusion/adaptive routing
- Resuming, forking, reverting, and exporting sessions
- Driving Devin Cloud sessions from the terminal (`--cloud`, `devin ssh`, `devin forward`, `/handoff`)
- Managing MCP servers, rules, skills, and plugins via `devin mcp|rules|skills|plugins`
- Automating with `devin -p` in scripts and CI

Boundary: Devin Cloud/Desktop product concepts (Playbooks, Secrets, Knowledge, model families SWE-*) → `/follow-tool-devin`; updating this machine's Devin configuration (global skills, MCP, subagents, hooks) → `/update-devin`. Comparable terminal agents → `/follow-tool-opencode`, `/follow-tool-qoder-cli`. The CLI does not yet support Knowledge, Playbooks, or account Secrets.

- Docs: https://docs.devin.ai/cli (live-check via `/deep-research` before use — `/follow-up-to-date`)
- References: [apis](references/apis.md) | [cli](references/cli.md)
- See best-practices/ for recommended patterns and pitfalls
- References: [Devin CLI Best Practices](best-practices/devin-cli.md)

## Execute

### 1. Verify Installation

> Goal: the CLI is present, current, and healthy

1. Run `devin --version` and `devin doctor` (`--json` for machine-readable) — doctor reports subagent/profile load failures and bad `AGENT.md` frontmatter
2. If missing → install per platform: `curl -fsSL https://cli.devin.ai/install.sh -o /tmp/devin-install.sh && bash /tmp/devin-install.sh` (macOS/Linux/WSL), `brew install --cask devin-cli`, or on Windows the installer from https://static.devin.ai/cli/ or `irm https://static.devin.ai/cli/setup.ps1 -OutFile $env:TEMP\devin-setup.ps1; & $env:TEMP\devin-setup.ps1` in PowerShell only (never Git Bash/CMD)
3. Do not install the npm package `devin` — it is unrelated
4. Update with `devin update` (`--force` to reinstall); check the command surface with `devin --help` or `man devin`
5. Sign in with `devin auth login` (`devin auth status` to verify; `--force-manual-token-flow` for remote/SSH boxes)

### 2. Start Sessions

> Goal: open the right kind of session for the task

1. `devin` — interactive REPL in the current directory; `devin -- <prompt>` — REPL preloaded with a prompt (always use `--` before the prompt so it is not parsed as a subcommand)
2. `devin -p "prompt"` — single-turn: print the response and exit (for scripts and automation)
3. In the REPL, type `@` to attach files/directories as context; paste images with `Ctrl+V`
4. Add directories mid-session with `/add-dir <path>`; list roots with `/workspace`

### 3. Pick Mode And Permission Level

> Goal: the right autonomy/safety balance for the task

1. Default is Normal (read-only auto-approved, write/execute prompt); `/accept-edits` auto-approves workspace edits — the expected daily mode
2. `/smart` auto-runs actions a fast model judges safe (high-risk categories still prompt); `/plan` is read-only planning; `/ask <question>` is a read-only oneshot
3. `/bypass` (aliases `/yolo`, `/dangerous`) auto-approves everything — use only for fully trusted tasks
4. For unattended runs use `devin --sandbox --permission-mode autonomous`: the OS sandbox (macOS Seatbelt / Linux bwrap+seccomp) enforces file/network boundaries; Windows requires WSL 2
5. Cycle modes with `Shift+Tab`; start with `--permission-mode <mode>` or `DEVIN_PERMISSION_MODE`

### 4. Select Model

> Goal: model matches the task's reasoning/cost profile

1. `devin --model <name> -- <prompt>` or `/model [name]` in-session; `/model` alone opens the selector; short names (`opus`, `sonnet`, `swe`, `codex`, `gpt`) resolve to the latest family version
2. `devin models list` (add `--format json` for scripts) shows what the account can use; recommend Fusion for most work, `opus`/`gpt` for complex refactors, `swe` fast variants for quick edits
3. Cycle reasoning/thinking levels with `Alt+T` on supported models; persist a default in the config file (see `## Rules → 4`)

### 5. Manage Session History

> Goal: resume, branch, and undo work reliably

1. `devin -c` continues the most recent session in this directory; `devin -r` opens the picker, `devin -r <id>` resumes one session
2. `/ls [--all]` lists sessions; `/rm-session <id>` deletes irreversibly; `/title` renames
3. `/steps` then `/fork [step]` branches a session; `/revert <step>` rewinds the conversation and file changes from that step
4. `devin --export [path]` exports the conversation (ATIF format) after each turn — pass a path or use the default

### 6. Work With Cloud Sessions

> Goal: steer Devin Cloud from the same terminal

1. `devin --cloud` starts a cloud session; `devin --cloud -r <id-or-url>` resumes one; in-session `/cloud` converts a fresh local session
2. `/repo` picks repositories, `/platform` the OS, `/open [web|desktop]` opens the session, `/archive` archives it
3. `/handoff [task]` sends local work to the cloud; `/pickup` (or `/handoff` in a cloud session) checks out the PR branch locally
4. `devin ssh <session> [-- <ssh options>]` shells into the session VM; `devin forward <session> [local:]<port>...` maps dev-server ports to localhost

### 7. Extend The Agent

> Goal: teach the CLI your tools and standards

1. MCP: `devin mcp add <name> [--url <URL> | -- <command> args]` (`-s local|project|user`, `-e KEY=VALUE`, `-H`), `devin mcp list|get|remove|login|logout|enable|disable`; `/mcp` shows status in-session; see `/use-mcp`
2. Rules and skills: `devin rules list|show|paths`, `devin skills list|show|paths` — this machine's global skills live in `%APPDATA%\devin\skills\` (Windows) or `~/.config/devin/skills/`; invoke a skill with `/skill-name`; maintain them with `/update-agents-skills-global`
3. Plugins (bundles of skills, rules, hooks, MCP, subagents): `devin plugins install <owner/repo[#path]>|<git-url>|<local-path>` (`-y` skips the trust prompt), `list|info|update|remove|prune` — third-party code executes arbitrary logic, install at your own risk
4. Hooks: `/hooks` lists loaded hooks; migrate Windsurf hooks with `devin migrate hooks`, workflows with `devin migrate workflows --scope all|workspace|global`
5. Subagents: profiles in `AGENT.md` frontmatter are validated by `devin doctor`

### 8. Automate And Integrate

> Goal: reliable headless use

1. Scripts/CI: `devin -p "prompt"` with `--permission-mode` set explicitly; non-interactive mode fails in an untrusted directory → pass `--respect-workspace-trust false` only for trusted CI paths
2. Env vars: `DEVIN_MODEL`, `DEVIN_PERMISSION_MODE`, `DEVIN_SANDBOX` replace per-call flags
3. Machine-readable output: `devin list --format json|csv`, `devin models list --format json`, `devin doctor --json`
4. Editor/IDE integration: `devin acp` runs an ACP server over stdio (spawned by hosts like Zed/Windsurf, not run interactively); `--agent-type`, `--model` configure it
5. Discover remaining flags with `devin --help` and the reference in `references/cli.md`

## Rules

### 1. Sources And Version

- Official docs https://docs.devin.ai/cli are the primary source; commands above were verified against `devin 3000.11.3` (2026-10-15) — re-check with `/deep-research` or `devin --help` when behavior differs (`/follow-up-to-date`)

### 2. Safety

- Never default to `/bypass`; prefer `--sandbox` + Autonomous for unattended work; admin Team Settings deny/ask rules always win
- No secrets in prompts; pass secrets via env/config, not the conversation
- `--respect-workspace-trust false` only for trusted automation paths; `/rm-session` and `/revert` are irreversible — confirm state with `/steps` and `/export` first

### 3. Configuration

- User config: `~/.config/devin/config.json` (Windows: `%APPDATA%\devin\config.json`); override per-call with `--config <PATH>`; keep only keys that override defaults (`/follow-default-config`), e.g. `{"agent": {"model": "swe-1-6-fast"}}`
- `/config` opens the interactive editor; `/shortcuts` browses and rebinds keybindings

### 4. Related Skills

- run /follow-tool-devin to cover Devin Cloud/Desktop product features and SWE model families
- run /update-devin to change this machine's Devin config; run /follow-devin-global-skills to load and use global skills inside sessions
- run /follow-tool-usage to generate completions/docs from the CLI surface
- run /check-types-definition to inspect config keys; run /follow-best-practice and use /use-mcp if needed
- see also: /deep-research for live model/command verification

## Expected Outcome

- Sessions started, resumed, forked, and exported without data loss
- Permission mode chosen deliberately per task, with sandbox for unattended runs
- MCP servers, rules, skills, and plugins managed through the right `devin` subcommand
- Cloud sessions steered, handed off, and port-forwarded from the terminal
- Headless `devin -p` runs wired into scripts and CI with machine-readable output
