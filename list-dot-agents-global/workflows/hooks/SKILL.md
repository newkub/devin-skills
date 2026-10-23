---
name: list-dot-agents-global-hooks
description: Inventory global and project hooks with event, command, and validity
related:
  - list-dot-agents-global
  - update-dot-agents-project
  - report

---

## Goal

List every configured hook from the global harness and the current project, with event, command, and validity

## Scope

- Global hooks: `~/.agents/hooks/hooks.json` plus scripts in `~/.agents/hooks/`
- Client hook config that mirrors the harness: `%APPDATA%\devin\config.json` → `hooks`
- Project hooks: `<project>/.agents/hooks/`
- Boundary: creating or editing hooks → `/update-dot-agents-project`

## Execute

### 1. Locate Configs

> Goal: find every hook file

1. Read `~/.agents/hooks/hooks.json`
2. Read `%APPDATA%\devin\config.json` and keep only the `hooks` key
3. Search the project for `.agents/hooks/*.{json,ts,js,yaml,yml}`
4. When nothing is found → state that no hooks are configured

### 2. Parse Hooks

> Goal: read and normalize each hook

1. Parse JSON and YAML directly; read TS and JS and map the registered events
2. Extract per hook: `event`, `matcher`, `command` or `script`, `timeout`, `enabled`
3. Expand `<HARNESS>` to `~/.agents` before checking the script path

### 3. Validate

> Goal: check correctness

1. Confirm the config parses
2. Confirm each event name is supported by the client
3. Confirm each referenced script exists
4. Record invalid hooks with the reason

### 4. Report

> Goal: summarize the results

1. Follow `/report`; table columns: No., Scope, Event, Command, Valid
2. Redact tokens or secrets inside commands
3. Add a footer count of global and project hooks
4. Route invalid hooks to `/suggest-next-action`

## Rules

- Read-only — never modify a hook config
- Check both global and project scope; when the project has none → say global only
- Never print secrets or full commands containing credentials
- Never use `**` bold

## Expected Outcome

- A numbered table of every hook with scope, event, and command
- Invalid hooks listed with a reason
- Counts split by global and project scope
