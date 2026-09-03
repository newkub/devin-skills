---
name: <workspace-name>
description: <one-line purpose of the workspace>
related:
  - update-agents-md
  - follow-agents-md
  - follow-monorepo
  - deep-validate
  - review-rules
---

## Goal

<concise goal of the workspace>

## Scope

<what is included and excluded>

## Execute

### 1. Start Every Task

1. Run `/follow-agents-md` to read this `AGENTS.md`.
2. Run `/follow-monorepo` to understand workspace relationships.
3. Check `git status` before making changes.

### 2. Develop

1. Run `/analyze-project` to understand workspace tech stack.
2. Use `/<skill-name>` for each major workflow.
3. Keep changes minimal and focused.

### 3. Validate And Ship

1. Run `/review-rules` to check `AGENTS.md`.
2. Run `/deep-validate` to verify correctness.
3. Run `/ship` to release.
4. Run `/report` to summarize.

## Rules

### 1. Format

- Use frontmatter `name`, `description`, `related`.
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`.
- Keep the file under 250 lines.
- Use backticks for `tools`, `commands`, `paths`, and `skill-name`.

### 2. Architecture

- `<tech-name>: /<follow-or-learn-skill>`

### 3. Platform

- `OS: <os>`
- `runtime: <runtime>`
- `repo-type: <repo-type>`

### 4. Target User

- `primary: <who>`
- `secondary: <who>`

### 5. Skills

Core:
- `<skill-name>: /<skill-name>`

### 6. Workspaces

- `uses:` `<package> use <other-package>` (e.g. `core: use db, web`)

### 7. Safety

- Do not edit another workspace's code without explicit command.
- Dry run before destructive actions.

### 8. Ship

- Use `/ship` for release workflow.
- Follow project conventions and validation before release.

## Expected Outcome

- Workspace `AGENTS.md` follows Devin CLI standards.
- Every skill reference exists.
- Workspace dependencies are documented.
