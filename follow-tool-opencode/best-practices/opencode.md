# OpenCode Best Practices

Recommended patterns and pitfalls, from official docs (https://opencode.ai/v2/docs/) and the v1 CLI docs, verified against local `opencode 1.19.0` (2026-10-15).

## Do

- Confirm the installed channel first: `opencode --version` + `opencode --help` — v1 (`opencode.ai/docs/`) and v2 (`opencode.ai/v2/docs/`, `@opencode/cli`) differ in commands and config; re-learn the surface after upgrades with `/learn-from-cli`
- Take model IDs only from `opencode models [provider]`; run `opencode models --refresh` after adding a provider so the catalog is current
- Keep `opencode.jsonc` minimal — `$schema` plus only the keys that override defaults; validate against https://opencode.ai/config.json instead of guessing keys
- Scope autonomy per agent: create a reviewer agent with `edit` denied and a builder agent with only what it needs — `--permissions` omits become denials, which is the safe default
- Use `permissions` rules (`ask` on dangerous resources like `git push *`) as the day-to-day guardrail, `policies` only for hard restrictions that must not be overridable
- Reuse a warm server for repeated scripted runs: `opencode serve` once, then `opencode run --attach ... --format json` — avoids MCP cold boots per invocation and gives parseable events
- Set `OPENCODE_SERVER_PASSWORD` before exposing `serve`/`web` beyond localhost; keep `--hostname 127.0.0.1` unless mDNS/remote use is required
- Put team knowledge in `instructions` (`AGENTS.md`, `CONTRIBUTING.md`) and `skills`/`commands` rather than repeating it in every prompt
- Run `opencode export --sanitize` before sharing a session; treat raw exports as containing source code
- Check integrations actually loaded after configuring: `opencode mcp list` status, `opencode agent list`, `/help` in the TUI

## Don't

- Don't use `--auto` as a default flag — it approves everything not explicitly denied; write the denies first if you need speed
- Don't hardcode model names that aren't in `opencode models` output — stale IDs silently fall back or fail
- Don't expect `mise use -g opencode` to install v2 on older mise (< 2026.10.9 installs v1) and don't mix v1/v2 install methods in one machine without checking `opencode upgrade --method`
- Don't use Windows package managers (scoop/winget/choco) — unsupported; use the curl script, npm/bun/pnpm, or binaries; on Windows set `OPENCODE_GIT_BASH_PATH` if shell tools can't find Git Bash
- Don't put API keys in project `opencode.json(c)` — use `opencode auth login` storage or env vars; project files are committed
- Don't rely on `.claude` prompt/skills bleed-through if you need deterministic behavior — pin it explicitly with `OPENCODE_DISABLE_CLAUDE_CODE*` flags
- Don't run `opencode uninstall` without `--dry-run` first, and don't drop session data you may need with the default (no `--keep-*` flags)
- Don't set `update: "auto"` and expect a running `serve`/`web` process to pick it up — restart the server after an update
- Don't duplicate `.opencode/opencode.json` and root `opencode.json` in the same tree unintentionally — `.opencode` configs override direct ones for every parent directory in the merge order
