---
name: update-dot-agents-project-hooks
description: Create or update .agents/hooks scripts and hooks.json for project events
related:
  - update-dot-agents-project
  - resolve-errors
  - report
---

## Goal

Create and update `<project>/.agents/hooks/` with TypeScript scripts and `hooks.json` per project events

## Scope

- Project hooks live in `<project>/.agents/hooks/`
- Global hooks live in `~/.agents/hooks/hooks.json`; the client mirror is `%APPDATA%\devin\config.json` → `hooks`
- Use for lint, typecheck, or format checks after the agent writes code

## Execute

### 1. Analyze Project

> Goal: learn the events and commands needed

1. Read the root `package.json` scripts
2. Read `AGENTS.md` when present
3. Identify the lint, typecheck, format, and test commands
4. Check the existing `.agents/hooks/`

### 2. Write Scripts

> Goal: the hook scripts are safe and deterministic

1. Create `run-lint.ts` and `run-typecheck.ts` as needed
2. Start with the shebang `#!/usr/bin/env bun`
3. Parse JSON input from stdin and wrap it in `try/catch`
4. Exit `0` on success and when there is nothing to report — a non-zero exit turns a warning into a blocking error
5. Reserve `exit 1` for a genuine failure
6. Print exactly one JSON object to stdout; send human text to stderr

### 3. Configure hooks.json

> Goal: register hooks with real events

1. Create `.agents/hooks/hooks.json` when missing
2. Events: `PreToolUse`, `PostToolUse`, `UserPromptSubmit`, `SessionStart`, `Stop` — `post_write_code` is not an event
3. `matcher` is a regex over the tool name (e.g. `^(write|edit)$`); omit it to run on every tool call
4. `command` is a single string plus `timeout` in seconds — keep it short
5. Never write files from a hook; a write re-triggers the hook
6. Example:

```json
{
  "hooks": {
    "PostToolUse": [
      {
        "matcher": "^(write|edit|multi_edit)$",
        "hooks": [
          { "type": "command", "command": "bun <project>/.agents/hooks/run-lint.ts", "timeout": 5 }
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

1. Run the script with sample JSON input on stdin
2. Check the exit code
3. Check that stdout holds exactly one JSON object
4. Fix failures with `/resolve-errors` and rerun

### 5. Report

> Goal: summarize the hooks

1. Run `/report` with No., Event, Script, Status
2. State where the project and global hook configs live
3. Run `/suggest-next-action`

## Rules

- Use the `bun` runtime only — never `node` or `npx`
- Every script parses stdin as JSON and handles malformed input with `try/catch`
- Hooks must be re-runnable without side effects
- Never put secrets or tokens in `hooks.json`
- Do not create `.agents/workflows/`
- Never use `**` bold; use backticks for commands and paths

## Expected Outcome

- `.agents/hooks/` holds the scripts and a valid `hooks.json`
- Hooks fire on real events and never write files
- Exit codes and stdout follow the hook contract
- The report lists each hook with its event and status
