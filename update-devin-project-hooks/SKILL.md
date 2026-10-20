---
name: update-devin-project-hooks
description: Create and update .devin/hooks TypeScript scripts and hooks.json per project
argument-hint: "[hook-event]"
related:
  - update-devin
  - run-lint
  - resolve-errors

---

## Goal

Create and update the `.devin/hooks/` directory with TypeScript scripts and `hooks.json` per project events

## Scope

Use for project-level hooks such as `post_write_code` for lint, typecheck, format after the agent writes code

## Execute

### 1. Analyze Project

> Goal: learn the events and commands needed

1. Read the root `package.json` scripts
2. Read `AGENTS.md` if present
3. Identify the lint, typecheck, format, test commands
4. Check the existing `.devin/hooks/`

### 2. Create Or Update Hooks

> Goal: create the hooks directory and scripts

1. Create `.devin/hooks/` if it doesn't exist
2. Create `run-lint.ts`, `run-typecheck.ts` as needed
3. Use the shebang `#!/usr/bin/env bun`
4. Parse JSON input from stdin
5. `try/catch` for error handling
6. Exit `0` on success and on "nothing to report" — a non-zero exit turns a warning into a blocking error; reserve `exit 1` for a genuine failure
7. Print exactly one JSON object to stdout — no `Write-Output`/`console.log` diagnostics alongside it (a second line breaks the hook parser); send human text to stderr or into `additionalContext`

### 3. Configure hooks

> Goal: register hooks with events

1. Global: `%APPDATA%\devin\config.json` → `hooks` (what Devin CLI reads today)
2. Project: `.devin/hooks/hooks.json` — same event names and per-event shape
3. Events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop` — `post_write_code` is not an event
4. `matcher` is a regex over the tool name (e.g. `^(write|edit)$`); omit it to run on every tool call
5. `command` is a single string, plus `timeout` in seconds — keep it short (5s); never write files from a hook (it re-triggers itself)
6. Example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "^(write|edit|multi_edit)$",
        "hooks": [
          { "type": "command", "command": "pwsh %APPDATA%\\devin\\hooks\\check-long-files.ps1", "timeout": 5 }
        ]
      }
    ]
  }
}
```

7. Output contract for a `PostToolUse` hook — one JSON object, nothing else:

```json
{ "hookSpecificOutput": { "hookEventName": "PostToolUse", "additionalContext": "message for the agent" } }
```

### 4. Validate

> Goal: confirm the hooks work

1. Run `bun .devin/hooks/run-lint.ts` with sample input
2. Check the exit code
3. Check the JSON syntax
4. If it fails → `/resolve-errors`

### 5. Report

> Goal: summarize results

1. Run `/report` showing hook event, script, status
2. Run `/suggest-next-action`

## Rules

### 1. TypeScript And Bun

- Use the `bun` runtime only
- Use TypeScript for scripts
- Include a shebang

### 2. Parse stdin

- Hooks must parse JSON from stdin
- Handle malformed JSON with try/catch

### 3. Idempotent

- Hooks must be re-runnable without side effects
- Never overwrite without a dry run

### 4. Safe Exit

- `process.exit(0)` for success
- `process.exit(1)` for failure
- Never throw uncaught exceptions

### 5. No Workflows

- Don't create `.devin/workflows/`
- Hooks must live in `.devin/hooks/`
- Use /update-devin if needed


## Expected Outcome

- `.devin/hooks/` has scripts and `hooks.json`
- Hooks work with the configured events
- Correct exit codes
- No `.devin/workflows/`

