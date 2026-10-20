---
name: update-agents-md
description: Create or update AGENTS.md so agents and subagents can read it and act on it
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - follow-agents-md
  - use-subagents
  - report-workspace-graph
  - follow-monorepo
  - refactor
  - ship
  - update-tests
  - run-dev
  - implement-to-production
  - update-review-cli-then-run
  - git-commit-and-push
  - report
---

## Goal

Create or update `AGENTS.md` in the root and in every workspace so it is genuinely followable, letting agents and subagents read it and act on the steps in order.

## Scope

Use for writing and improving `AGENTS.md` in a project's root and workspaces from real project data. Excludes editing source code outside the scope of `AGENTS.md`.

## Execute

### 1. Prepare

> Goal: Prepare

1. Run `/follow-agents-md` if an `AGENTS.md` already exists
2. Run `/check-monorepo` to check monorepo status
3. Run `/deep-analyze` to analyze the tech stack and structure
4. Run `/all-workspace` if it is a monorepo
5. Read the global rules from `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
6. Run `/ask-project-requirement` if the context or requirements are unclear
7. Identify the platform and target user from the context and dependencies
8. If the project has `tools/review-codebase`, run `/update-review-cli-then-run`

### 2. Analyze Techstack

> Goal: map dependencies → global skills

1. Read `package.json`, `Cargo.toml`, `pyproject.toml`, or the relevant manifest
2. Identify the libraries, frameworks, runtimes, and build tools in use
3. Map each dependency to `dep: /follow-<skill>` when a matching skill exists — no match → `/learn-from-web` or skip that row
4. The result is the Techstack Skills table used by the template

### 3. Write AGENTS.md

> Goal: Write the AGENTS md from canonical templates

1. Follow the format in `update-devin-global-skills` (`## Conventions → Frontmatter Spec`)
2. Root `AGENTS.md` → start from `templates/agents-md-monorepo.md`
3. Workspace `AGENTS.md` → start from `templates/agents-md-workspace.md` for each workspace
4. Write the sections: `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
5. `## Execute` follows the template — a workspace has `### Follow Techstack Skills` (table 3 col: Dependency / Use For / Global Skill) + `### Follow Architecture` (choose the pattern via `/follow-architecture`) + `### Ship`; a monorepo has follow-monorepo → subagents follow workspace AGENTS.md → `/refactor` (workspace scope) workspace-usage table (Workspace / Use Workspace / Purpose) → `/ship`
6. Every step in `## Execute` must be an actionable command an agent can run
7. If several workspaces are independent of each other, use `/use-subagents` — 1 workspace = 1 subagent (workspace path, manifest, deliverable)
8. If the context is unclear → stop and report

### 4. Validate And Ship

> Goal: Verify through the canonical gate, then ship

1. Run `/ship` — the canonical gate covering `/deep-review-codebase` (AGENTS.md), `/deep-validate`, `/run-check`, `/update-tests` + `/run-test all`, `/run-dev`, `/deep-test usage`, then commit/push, PR review gate, and merge into `main` — do not duplicate verify or ship steps here
2. Run `/report` to summarize

## Rules

### 1. AGENTS.md Format

- frontmatter `name`, `description` ≤100 characters, `related`
- sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- Keep the file at or under 250 lines
- Write `AGENTS.md` entirely in English (project-local)
- Use backticks for `tools`, `commands`, `paths`, `skill-name`

### 2. Followable Content

- Every step in `## Execute` must be an action an agent can run
- Name skills with `/<skill-name>` and commands with backticks
- When subagents are needed, state clearly which subtasks are independent

### 3. Subagent Discipline

- Use `/use-subagents` when there are multiple workspaces or architectures that can be verified independently
- Give each subagent its context: workspace path, manifest, and goal
- Merge the results from subagents before writing the root `AGENTS.md` — a subagent must never commit

### 4. Techstack Mapping

- The workspace `AGENTS.md` has a 3-column Techstack Skills table: `Dependency | Use For | Global Skill`
- Map only from the dependencies listed in the manifest — with no matching skill, skip the row (or `/learn-from-web`)

### 5. Skills Mapping

- `### Skills` in the generated `AGENTS.md` stays simple — core: `/dont-ask-me`, `/ship`, `/report-progress`, `/save-to-todo-md`, `/suggest-next-action`, `/follow-your-suggestion`, `/git-commit-and-push`
- Quality/improvement group (per project): `/deep-review-codebase` (with `then-fix` when a finding must be closed), `/deep-validate`, `/deep-test`, `/review-test` plus the matching `/improve-*`/`/optimize-*` variants
- Production-readiness group when the repo still has stubs/placeholders: `/implement-to-production` (fill them) instead of a free-form "finish it" step
- Add only the project-specific skills that are truly needed

### 6. Workspace Rules

- The root `AGENTS.md` must have `### Workspaces` listing every workspace plus the usage table (`Workspace | Use Workspace | Purpose` from `/refactor` workspace scope)
- The workspace `AGENTS.md` must state `uses:` `<package> use <other-package>`
- Before writing the workspace section of a monorepo, run `/report-workspace-graph`
- Do not duplicate root conventions

### 7. Validation

- All verification lives in `/ship` (canonical) — this skill only invokes it and must not duplicate it
- Do not commit on your own while writing `AGENTS.md` — ship through `/ship`, which verifies then pushes and merges

## Expected Outcome

- A complete, traceable root `AGENTS.md` grounded in the real project
- A Techstack Skills table covering every dependency that has a matching skill
- `### Platform` and `### Target User` are correct
- For a monorepo: every workspace has an `AGENTS.md` plus a workspace usage table
- Passes `/ship` — stakeholder review happens in the `/ship` merge gate (`/review-by-all-stakeholder`)
- Subagents can read `AGENTS.md` and carry out the steps
