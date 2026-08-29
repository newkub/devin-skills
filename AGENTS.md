---
name: devin-global-skills
description: Index of global and project-specific Devin CLI skills
related:
  - update-agents-md
  - follow-agents-md
  - update-devin-global-skills
  - deep-validate
  - review-rules
  - review-devin-global-skills
  - git-commit-at-devin-skills-global
  - ship
  - report
---

## Goal

Maintain `AGENTS.md` and conventions for the Devin global skills repository so they are correct, complete, and ready to use

## Scope

Use with the root workspace `%APPDATA%\devin\skills\` that holds all skill packages. Does not include editing skill source code directly

## Execute

### 1. Start Every Task

> Goal: Check workspace status and references before starting

1. Run `/update-agents-md` before starting every task
2. Run `/follow-agents-md` to read and follow `AGENTS.md`
3. Read global rules from `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
4. Read `/update-devin-global-skills` when editing a skill

### 2. Maintain AGENTS.md

> Goal: Keep `AGENTS.md` up to date and correct

1. Run `/check-monorepo` to verify monorepo status
2. Run `/analyze-project` to analyze tech stack and structure
3. Run `/all-workspace` if it is a monorepo
4. Update `### Architecture`, `### Skills`, and `### Workspaces` based on the actual project
5. Keep the file under 250 lines

### 3. Validate And Ship

> Goal: Validate and commit changes

1. Run `/review-rules` to check `AGENTS.md`
2. Run `/review-devin-global-skills` when editing skills
3. Run `/deep-validate` to verify correctness
4. Run `/git-commit-at-devin-skills-global` or `/ship` to commit changes
5. Run `/report` to summarize results

## Rules

### 1. Format

- Use frontmatter `name`, `description`, `related`
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- Keep the file under 250 lines
- Use backticks for `tools`, `commands`, `paths`, and `skill-name`

### 2. Architecture

- `devin-cli-skills: /update-devin-global-skills`
- `skill-format: /update-devin-global-skills/references/frontmatter.md`
- `global-rules: C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
- `submodules: 2 (visualize-devin-in-web, open-files-in-web)`

### 3. Platform

- `OS: Windows` (global Devin CLI config path)
- `repo-type: skill collection` (no package manifest at root)
- `runtime: none` (pure Markdown skill definitions; some submodules use Rust or Node tooling)

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository currently contains **775** skills under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `list-devin-global-skills`.

Core:
- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-rules: /update-devin-global-rules`
- `update-devin-harness: /update-devin-harness`
- `follow-global-rules: /follow-global-rules`
- `git-commit-at-devin-skills-global: /git-commit-at-devin-skills-global`
- `ship: /ship`
- `report: /report`
- `deep-validate: /deep-validate`

By prefix:

Major skill families by current count:
- `follow-*` (242): language, framework, library, tool, service, architecture, and best-practice guides. Examples: `follow-my-package-manager`, `follow-create-product`, `follow-framework-nextjs`, `follow-lib-unocss`, `follow-tool-vitest`, `follow-create-github-bots`, `follow-create-tsdown-plugins`, `follow-create-bun-plugins`, `follow-create-web`, `follow-create-tui`, `follow-review`
- `review-*` (56): code review, architecture, security, performance, and quality. Examples: `review-quality`, `review-frontend`, `review-rules`, `review-devin-global-skills`, `review-security`, `review-codebase-everythink`, `review-codebase-everythink-and-ship`
- `list-*` (47): inventory, lookup, and listing utilities. Examples: `list-computer-info`, `list-program-in-computer`, `list-devin-global-skills`, `list-github-star-latest`, `list-github-star-filter-rust`, `list-github-action-fail`
- `run-*` (35): test, build, lint, typecheck, format, and deployment runners. Examples: `run-test`, `run-build`, `run-check`, `run-verify-on-local`, `run-verify-on-ci-cd`, `run-test-all`
- `update-*` (34): repo, skills, docs, config, runtime, and version maintenance. Examples: `update-all-program-in-computer`, `update-readme-md`, `update-dot-devin`, `update-all-devin-global-skills`, `update-devin-global-mcp`, `update-version-latest`, `update-runtime-latest`, `update-review-cli`
- `setup-*` (1): one-time setup helpers. Examples: `setup-ci-cd`
- `report-*` (35): reporting, diagrams, and visualization helpers. Examples: `report-what-you-do`, `report-my-cli-update`, `report-table`, `report-file-structure`, `report-git-diff`, `report-plan`, `report-numbered-bullet`, `report-enhance-prompt`, `report-task-progress`
- `roleplay-*` (26): stakeholder roleplay perspectives. Examples: `roleplay-staff-engineer`, `roleplay-ceo`, `roleplay-security-architect`, `roleplay-customer-support-agent`
- `check-*` (19): verification, structure, and health checks. Examples: `check-size`, `check-monorepo`, `check-unused-files`, `check-broken-skills-references`, `check-secrets-leak`, `check-dead-code`, `check-bottlenecks`, `check-backward-compatibility`
- `deep-*` (21): deep analysis, research, debugging, validation, update, and ship. Examples: `deep-analyze`, `deep-debug`, `deep-refactor`, `deep-retro`, `deep-impact`, `deep-validate`, `deep-test`, `deep-realize-implementation`, `deep-update-project`, `deep-update`, `deep-ship`
- `watch-*` (15): continuous monitoring and watch modes. Examples: `watch-build`, `watch-ci-cd`, `watch-test`, `watch-vercel`
- `create-*` (23): project, plugin, bot, report, and diagram scaffolding. Examples: `create-mermaid-diagram`, `create-mermaid-diagram-all-workspace`, `follow-create-cli`, `create-new-project-in-drive-d`, `create-report-in-dot-devin`, `create-video-story`, `create-social-cover-image`, `create-github-repo`, `follow-create-github-bots`, `follow-create-tsdown-plugins`, `follow-create-bun-plugins`, `follow-create-web-landing`, `follow-create-web-saas`, `follow-create-web-paas`
- `open-*` (14): browser, editor, and terminal integration. Examples: `open-in-wezterm`, `open-in-explorer`, `open-in-devin`, `open-files-in-web`
- `search-*` (11): search across code, git, files, and the web. Examples: `search-files-patterns`, `search-in-git`, `search-in-raindrop-io`
- `use-*` (12): shell, scripts, and library usage. Examples: `use-scripts`, `use-ast-grep`, `use-bun-shell`, `use-pwsh-shell`, `use-my-packages-on-registry`
- `git-*` (8): git, GitHub, branches, and releases. Examples: `git-commit`, `git-push`, `git-commit-at-devin-skills-global`, `git-file-history`
- `gen-*` (7): AI-generated images, video, voice, characters, and 3D. Examples: `gen-image-character`, `gen-ai-images`, `gen-ai-videos`, `gen-voice`
- `cleanup-*` (6): cleanup branches, issues, tasks, and files. Examples: `cleanup-files-in-computer`, `cleanup-git-branch`, `cleanup-worktree`
- `implement-*` (6): implement tasks and features. Examples: `implement-github-task`, `implement-todo-md`, `implement-features-to-mvp`
- `idea-*` (8): idea generation. Examples: `idea-features`, `idea-merge-files`, `idea-create-devin-skills-global`, `idea-refactor-workspace`, `idea-refactor-devin-global-skills`
- `learn-*` (5): learning and research. Examples: `learn`, `learn-from-web`, `learn-from-pattern`
- `edit-*` (5): editing helpers. Examples: `edit-only`, `edit-relative`, `edit-manual`

Other utility prefixes and standalone skills: `alignment`, `all-*`, `analyze-*` (e.g. `analyze-file-structure`, `analyze-dependencies`, `analyze-attack-surface`, `analyze-root-cause-analysis`), `ask-*` (e.g. `ask-me`, `pick-bestest`), `assume-*`, `at-*`, `bench-*`, `capture-*`, `compare`, `consider-*`, `convert-*`, `delete-*`, `deploy-*`, `dont-*`, `download-*`, `draw-*`, `explain`, `explore-*`, `fix`, `from-*`, `grouping`, `how-to-works`, `improve`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `realize-*`, `record-*`, `refactor*`, `release-*`, `relocate-*`, `rename-*`, `request-*` (e.g. `request-prompt-from-image`), `resolve-*`, `restore-*`, `save-*`, `scan-*`, `ship`, `ship-to-cloud`, `ship-github-issue`, `ship-release`, `ship-continuous`, `suggest-*` (e.g. `suggest-me`, `suggest-next-action`), `create-mermaid-diagram`, `create-mermaid-diagram-all-workspace`, `report-what-you-do` (e.g. `suggest-me`, `suggest-next-action`), `create-dev-branch`, `follow-git-flow`, `follow-github`, `simplify`, `summarize-*`, `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `view-*`, `write-*`, and others.

### 6. Workspaces

- Not a monorepo: single root workspace (`%APPDATA%\devin\skills\`)
- Submodules: `open-files-in-web`, `visualize-devin-in-web`

### 7. Safety

- Do not edit another skill's `SKILL.md` without explicit command
- Do not delete or move skill directories without a dry run
- Dry run before destructive actions

### 8. Ship Flow

- Default branches: `main` (production), `dev` (staging)
- Issue branch: `dev/<number>` (short-lived)
- Worktree: `worktrees/dev-<number>/`
- Flow: `dev/<number>` → `dev` → `main`
- Local hooks: block direct commit/push on `main`
- GitHub: branch protection on `main` (PR + status checks) and `dev` (status checks)
- Skills: `/ship`, `/ship-to-cloud`, `/ship-github-issue`, `/ship-release`, `/ship-continuous`

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines
- Every skill reference exists
- Changes are committed with a clear next action
