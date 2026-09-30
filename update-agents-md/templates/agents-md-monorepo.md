---
name: <repo-name>
description: <one-line purpose of the project>
related:
  - dont-ask-me
  - ship-to-dev-branch
  - ship-verify
  - report-progress
  - save-to-todo-md
  - suggest-next-action
  - follow-your-suggestion
  - git-commit-and-push
---

## Goal

<concise goal of the project>

## Scope

<what is included and excluded>

## Execute

### 1. Follow Monorepo

1. Run `/follow-monorepo` to understand workspace relationships, scripts, and build pipelines.
2. Check `git status` before making changes.

### 2. Follow Workspace AGENTS.md

1. Run `/use-subagents` — spawn one subagent per workspace to follow that workspace's `AGENTS.md`.
2. Give each subagent: workspace path, manifest, deliverable, acceptance criteria.
3. Merge subagent results before proceeding — subagents never commit.

### 3. Refactor Workspace

1. Run `/refactor-workspace` — document which workspace uses which, as a table:

| No. | Workspace | Use Workspace | Purpose |
|-----|-----------|---------------|---------|
| 1 | `<workspace>` | `<workspace(s) it depends on>` | `<what it uses them for>` |

2. Keep the table in sync with manifests and real imports.

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

### 4. Skills

Core (keep simple — only these unless project-specific need):
- `dont-ask-me: /dont-ask-me`
- `ship-verify: /ship-verify`
- `ship-to-dev-branch: /ship-to-dev-branch`
- `report-progress: /report-progress`
- `save-to-todo-md: /save-to-todo-md`
- `suggest-next-action: /suggest-next-action`
- `follow-your-suggestion: /follow-your-suggestion`
- `git-commit-and-push: /git-commit-and-push`

Quality (include as relevant to the project):
- `deep-review: /deep-review`
- `deep-validate: /deep-validate`
- `deep-test: /deep-test`
- `review-test: /review-test`

Improvements (pick variants matching the project):
- `improve-*: /improve-features (core business + platform) /improve-security /improve-data /improve-database /improve-cli /improve-web /improve-seo /improve-dx /improve-uxui /improve-code-quality /improve-error-handling /improve-api /improve-techstack /improve-config /improve-tests`
- `optimize-*: /optimize-perf /optimize-build /optimize-cost /optimize-memory`

### 5. Workspaces

- `<workspace-name>`

### 6. Safety

- Do not edit source code outside the task scope.
- Dry run before destructive actions.

### 7. Ship

- Use `/ship-verify` as the gate, then `/ship-to-dev-branch` for release.
- Follow project conventions and validation before release.

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards.
- Every skill reference exists.
- Workspace usage table documents real dependencies.
- Changes are committed with a clear next action.
