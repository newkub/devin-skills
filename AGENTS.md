---
name: devin-global-skills
description: Global and project-specific Devin CLI skill collection and conventions
related:
  - update-agents-md
  - follow-agents-md
  - update-devin-global-skills
  - update-devin-global-rules
  - update-devin-harness
  - follow-global-rules
  - deep-validate
  - review-rules
  - review-devin-global-skills
  - git-commit-at-devin-skills-global
  - update-review-cli-and-fix
  - ship
  - report
---

## Goal

Maintain `AGENTS.md` and conventions for the Devin global skills repository so they are correct, complete, and ready for agents and subagents to follow.

## Scope

Use with the root workspace `%APPDATA%\devin\skills\` that holds all skill packages. Does not include editing skill source code directly.

## Execute

### 1. Start Every Task

1. Run `/follow-agents-md` to read this `AGENTS.md`.
2. Read global rules from `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`.
3. Check `git status` before making changes.
4. Read `/update-devin-global-skills` when editing a skill.

### 2. Maintain AGENTS.md

1. Run `/check-monorepo` to verify monorepo status.
2. Run `/analyze-project` to analyze tech stack and structure.
3. Run `/all-workspace` if it is a monorepo.
4. For independent subtasks across multiple workspaces, use `/follow-devin-global-subagents` or `/use-subagents`.
5. Update `### Architecture`, `### Skills`, and `### Workspaces` based on the actual project.
6. Keep the file under 250 lines.

### 3. Validate And Ship

1. Run `/review-rules` to check `AGENTS.md` and rules coverage.
2. Run `/review-devin-global-skills` when editing skills.
3. Run `/deep-validate` to verify correctness.
4. Run `/git-commit-at-devin-skills-global` or `/ship` to commit changes.
5. Run `/report` to summarize results.

## Rules

### 1. Format

- Use frontmatter `name`, `description`, `related`.
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`.
- Keep the file under 250 lines.
- Use backticks for `tools`, `commands`, `paths`, and `skill-name`.
- If a skill has `references/`, write it according to `update-devin-global-skills/references/create-devin-skills.md`.

### 2. Architecture

- `repo-type: skill collection` (no root package manifest; skills are Markdown docs with optional code).
- `git: /follow-tool-git`
- `github: /follow-github`
- `skill-format: /update-devin-global-skills`
- `global-rules: /follow-global-rules` (source: `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`)
- `review-cli: /update-review-cli-and-fix` (only if `tools/review-codebase` exists)
- `submodules: open-files-in-web, open-devin-in-web`

### 3. Platform

- `OS: Windows` (global Devin CLI config path `%APPDATA%\devin\skills\`).
- `repo-type: skill collection` (no package manifest at root).
- `runtime: none` (pure Markdown skill definitions; some submodules use Bun or Rust tooling).

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository currently contains **773** skills under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `list-devin-global-skills`.

Core:
- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-rules: /update-devin-global-rules`
- `update-devin-harness: /update-devin-harness`
- `follow-global-rules: /follow-global-rules`
- `git-commit-at-devin-skills-global: /git-commit-at-devin-skills-global`
- `update-review-cli-and-fix: /update-review-cli-and-fix`
- `ship: /ship`
- `report: /report`
- `deep-validate: /deep-validate`

Major skill families by current count:
- `follow-*` (241): language, framework, library, tool, service, architecture, and best-practice guides.
- `review-*` (57): code review, architecture, security, performance, and quality.
- `list-*` (49): inventory, lookup, and listing utilities.
- `report-*` (38): reporting, diagrams, and visualization helpers.
- `update-*` (35): repo, skills, docs, config, runtime, version, and test spec maintenance.
- `run-*` (34): test, build, lint, typecheck, format, and deployment runners.
- `deep-*` (24): deep analysis, research, debugging, validation, update, and ship.
- `create-*` (20): project, plugin, bot, report, and diagram scaffolding.
- `check-*` (19): verification, structure, and health checks.
- `open-*` (19): browser, editor, and terminal integration.

Other prefixes: `all-*`, `analyze-*`, `ask-*`, `assume-*`, `at-*`, `bench-*`, `capture-*`, `cleanup-*`, `convert-*`, `delete-*`, `deploy-*`, `dont-*`, `download-*`, `draw-*`, `edit-*`, `explain`, `explore-*`, `fix`, `from-*`, `gen-*`, `grouping`, `how-to-works`, `idea-*`, `implement-*`, `improve`, `learn-*`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `realize-*`, `record-*`, `refactor*`, `relocate-*`, `rename-*`, `re-answer`, `research-setup`, `resolve-*`, `restore-*`, `save-*`, `scan-*`, `search-*`, `setup-*`, `suggest-*`, `summarize-*`, `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `use-*`, `view-*`, `vs`, `watch-*`, `write-*`.

### 6. Workspaces

- Not a package monorepo: single root workspace (`%APPDATA%\devin\skills\`).
- Git submodules: `open-files-in-web`, `open-devin-in-web`.

### 7. Subagents

- Use `/follow-devin-global-subagents` or `/use-subagents` when there are independent subtasks across multiple workspaces or large skill families.
- Each subagent receives: workspace path, manifest, and target deliverable.
- Merge subagent results before writing the root `AGENTS.md`.

### 8. Safety

- Do not edit another skill's `SKILL.md` without explicit command.
- Do not delete or move skill directories without a dry run.
- Dry run before destructive actions.

### 9. Ship

- Use `/ship` for the release workflow.
- Follow project conventions and validation before release.

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines.
- Every skill reference exists.
- Changes are committed with a clear next action.
- Subagents can read `AGENTS.md` and execute the listed steps.
