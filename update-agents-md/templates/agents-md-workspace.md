---
name: <workspace-name>
description: <one-line purpose of the workspace>
related:
  - update-docs
  - follow-agents-md
  - follow-monorepo
  - deep-validate
  - deep-review
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

### 2. Follow Techstack Skills

Map every dependency in the workspace manifest to its global skill — use `/use-subagents` when the workspace is large enough to parallelize:

| No. | Dependency | Use For | Global Skill |
|-----|------------|---------|--------------|
| 1 | `<dep@version>` | `<what it does in this workspace>` | `/<follow-or-learn-skill>` |

- If no matching skill exists for a dependency, omit that row (or use `/learn-from-web`).
- Run the mapped skill before touching code that uses that dependency.

### 3. Follow Architecture

1. Apply the pattern selected by `/follow-architecture` (`layered` for a single app, `clean` for multi-app/shared packages).
2. Keep file placement, naming, and layer boundaries consistent with that pattern.

### 4. Ship Verify

1. Run `/ship-verify` — covers `/deep-review`, `/deep-validate`, `/run-check`, `/update-tests` + `/run-test-all`, `/run-dev`, `/test-usage`.
2. Only after every gate passes → `/ship-to-dev-branch`.
3. Run `/report` to summarize.

## Rules

### 1. Format

- Use frontmatter `name`, `description`, `related`.
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`.
- Keep the file under 250 lines.
- Use backticks for `tools`, `commands`, `paths`, and `skill-name`.

### 2. Platform

- `OS: <os>`
- `runtime: <runtime>`
- `repo-type: <repo-type>`

### 3. Target User

- `primary: <who>`
- `secondary: <who>`

### 4. Workspaces

- `uses:` `<package> use <other-package>` (e.g. `core: use db, web`)

### 5. Safety

- Do not edit another workspace's code without explicit command.
- Dry run before destructive actions.

### 6. Ship

- Use `/ship-verify` as the gate, then `/ship-to-dev-branch` for release.
- Follow project conventions and validation before release.

## Expected Outcome

- Workspace `AGENTS.md` follows Devin CLI standards.
- Every skill reference exists.
- Techstack table covers every dependency; workspace dependencies are documented.
