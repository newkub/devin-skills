---
name: list-devin-global-hooks
description: List global and project-level devin hooks from common config paths
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
---

## Goal

List the global hooks configured for devin from common config paths

## Scope

- Search hook configs in global paths
- Search hook configs in the project `.devin/hooks/`
- Report hook names, events, and commands
- Support JSON, YAML, and TypeScript formats

## Execute

### 1. Search Hook Configs

> Goal: find existing hook files

1. Search in global paths:
   - `C:\Users\Veerapong\.config\devin\hooks.json`
   - `C:\Users\Veerapong\.config\devin\hooks.yaml`
   - `C:\Users\Veerapong\.codeium\windsurf\hooks.json`
   - `C:\Users\Veerapong\.codeium\windsurf\hooks.yaml`
2. Search in the project:
   - `.devin/hooks/*.ts`
   - `.devin/hooks/*.js`
   - `.devin/hooks/*.json`
   - `.devin/hooks.yaml`
3. If nothing is found → state that no hooks are configured

### 2. Parse Hooks

> Goal: read and separate the details

1. For JSON/YAML → use `read` then parse
2. For TypeScript/JavaScript → use `read` and analyze the event mapping
3. Identify each hook:
   - `event` (e.g. `user-prompt-submit`, `tool-call`, `session-start`)
   - `command` or `script`
   - `enabled`

### 3. Validate

> Goal: check correctness

1. Check JSON/YAML syntax
2. Check the events are supported
3. Check the command path really exists
4. Record invalid hooks

### 4. Report

> Goal: summarize the results

1. Do `/report` showing path, event, command, enabled
2. If there are no hooks → report that no global hooks are configured
3. Do `/suggest-next-action` when something needs fixing or creating

## Rules

### 1. Read-Only

- Do not modify hook configs
- If a change is needed → edit the file directly per permission

### 2. Scope

- Check both global and project hooks
- When the project has no `.devin/hooks/` → state global only

### 3. Privacy

- Do not expose secrets or sensitive commands
- When a hook command contains a token → redact it

### 4. Formatting

- Never use `**` bold
- Use backticks for paths, events, commands
- Report as a table via `/report`

## Expected Outcome

- The list of all configured hooks
- Details: event, command, path
- Invalid hooks reported
- A table-format report with next actions
