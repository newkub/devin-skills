# Qoder CLI Best Practices

## Install And Auth

- Do: install with the native script (`qoder.com/install`), verify with `qoder --version`, upgrade with `qoder update`
- Do: use `QODER_PERSONAL_ACCESS_TOKEN` for CI/headless and `/login` for local; remember the env PAT overrides `/login` when both are set
- Don't: use the legacy `@qoder-ai/qodercli` npm path for new installs — slower startup/runtime, needs Node ≥ 20
- Don't: commit PATs or put them in prompts; keep them in env or `/login`, and leave `settings.local.json` out of git

## Permissions

- Do: default to `accept_edits` for routine coding and add explicit `deny` rules for dangerous paths/commands
- Do: rely on the decision order (deny → safety checks → ask → allow) — write narrow `allow` entries like `Bash(npm run test:*)`, not broad wildcards
- Do: use `dont_ask` for headless runs that must never prompt, but confirm the task doesn't need a blocked action
- Don't: use `--yolo`/`bypass_permissions` as a habit; reserve for fully trusted, disposable dirs (orgs can forbid it with `security.disableYoloMode`)
- Don't: expect non-default modes or project/local config to apply in an untrusted directory — they silently fall back to `default`/User config

## Sessions And Models

- Do: pick models from `qoder --list-models` / `/model`; pin `model.name` in project settings for team reproducibility
- Do: use `--fork-session` to explore alternatives from a checkpoint, `/rewind` to undo, `/compact` before long contexts overflow
- Do: pass `--session-id` and `--no-session-persistence` in scripts when you need deterministic or ephemeral runs
- Don't: share `/export` output or raw `.jsonl` logs without sanitizing — they contain real file contents

## Configuration

- Do: keep `settings.json` minimal — only overrides of defaults, using deep merge so project files need just the changed fields
- Do: check the schema with `/check-types-definition`; many keys (`tools.core`, `mcpServers`, `security.*`, `outputStyle`, `agent`) require a restart
- Do: run `/init` to generate project instructions and point `AGENTS.md` at real files instead of duplicating guidance
- Don't: restate default values across user/project/local layers, and don't duplicate the same MCP server/skill name across scopes unintentionally

## Extension And Automation

- Do: verify integrations loaded after wiring — `qoder mcp list`, `/skills`, `/tools`, `/help`; use `/mcp reload` and `/skills reload` after edits
- Do: enable `mcp.lazyLoad` / `QODER_MCP_LAZY=1` when many MCP servers inflate first-turn tokens
- Do: for headless CI use `-p` with `--output-format json`, `--max-turns`, and a pre-set permission mode; drive real-time with `stream-json`
- Don't: run two devtools/agent stacks or trust a plugin/hook you haven't validated (`qoder plugins validate`, `qoder hooks migrate` review) before enabling
