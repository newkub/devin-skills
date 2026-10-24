---
name: open-in
description: Open a path in Explorer, Zed, a Devin session, or WezTerm
argument-hint: "<explorer|zed|devin|wezterm> [path]"
related:
  - open-file-in-gitui
  - open-github
  - open-web
---

## Goal

Open a file or directory in the requested app — Explorer, Zed, a Devin session, or WezTerm

## Scope

Applies to one target app and one path; without a path use the file in context, then the project root

For other targets use `/open-file-in-gitui` (git UI), `/open-github` (repository
page), or `/open-web` (browser).

| Target | Workflow |
|--------|----------|
| Explorer (Windows) | `workflows/explorer/SKILL.md` |
| Zed editor | `workflows/zed/SKILL.md` |
| Devin session | `workflows/devin/SKILL.md` |
| WezTerm terminal | `workflows/wezterm/SKILL.md` |

## Execute

### 1. Resolve Target And Path

> Goal: Pick one workflow and one path
1. Read the target from the argument; if unspecified → run `/ask-me`
2. Resolve the path: the given argument, else the file in context, else the project root
3. Verify the path exists before opening — if it does not, report and stop

### 2. Run The Workflow

> Goal: Open the path with the OS-specific command
1. Read `workflows/<target>/SKILL.md` and follow it exactly
2. Invoke it as `/open-in <target> <path>`
3. Report the command that ran and whether the app accepted it

## Rules

### 1. One Target
- Never open more than one app per invocation unless the user asks

### 2. Path Safety
- Do not create, move, or delete anything; open only
- Pass the path as a single quoted argument

### 3. Failure
- If the CLI is missing → report the install command; do not install it silently

## Expected Outcome

- The requested app opens on the requested path, or the exact blocking reason is reported
