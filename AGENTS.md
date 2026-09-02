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
- If a skill has `references/`, write it according to `update-devin-global-skills/references/create-devin-skills.md` — at least `index.md`, `website.md`, `cli.md` for CLI tools, and `apis/index.md` for libraries/frameworks/services/plugin-creation skills

### 2. Architecture

- `devin-cli-skills: /update-devin-global-skills`
- `skill-format: /update-devin-global-skills/references/frontmatter.md`
- `global-rules: C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
- `submodules: 2 (open-devin-in-web, open-files-in-web)`

### 3. Platform

- `OS: Windows` (global Devin CLI config path)
- `repo-type: skill collection` (no package manifest at root)
- `runtime: none` (pure Markdown skill definitions; some submodules use Rust or Node tooling)

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
- `ship: /ship`
- `ship: /ship`
- `ship: /ship`
- `ship: /ship`
- `report: /report`
- `deep-validate: /deep-validate`
- `update-review-cli-and-fix: /update-review-cli-and-fix`

By prefix:

Major skill families by current count:
- `follow-*` (242): language, framework, library, tool, service, architecture, and best-practice guides. Examples: `follow-my-package-manager`, `follow-create-product`, `follow-framework-nextjs`, `follow-lib-unocss`, `follow-tool-vitest`, `follow-create-github-bots`, `follow-create-tsdown-plugins`, `follow-create-bun-plugins`, `follow-create-web`, `follow-create-tui`, `follow-review`
- `review-*` (56): code review, architecture, security, performance, and quality. Examples: `review-quality`, `review-frontend`, `review-rules`, `review-devin-global-skills`, `review-security`, `review-codebase-everything`
- `list-*` (48): inventory, lookup, and listing utilities. Examples: `list-computer-info`, `list-program-in-computer`, `list-devin-global-skills`, `list-github-star-latest`, `list-github-star-filter-rust`, `list-github-actions-fails`, `list-cicd-fails`, `list-cloudflare-worker-fails`, `list-ci-configs`, `list-todo-md`
- `run-*` (34): test, build, lint, typecheck, format, and deployment runners. Examples: `run-test`, `run-build`, `run-check`, `run-verify`, `run-test-all`
- `update-*` (35): repo, skills, docs, config, runtime, version, and test spec maintenance. Examples: `update-all-program-in-computer`, `update-readme-md`, `update-dot-devin`, `update-all-devin-global-skills`, `update-devin-global-mcp`, `update-version-latest`, `update-review-cli-and-fix`, `update-test-and-fix`, `update-specs`
- `setup-*` (3): one-time setup helpers. Examples: `setup-cicd`, `setup-package`, `setup-release`
- `ship-*` (1): ship and deploy helpers. Examples: `ship`
- `report-*` (38): reporting, diagrams, and visualization helpers. Examples: `report-what-you-do`, `report-my-cli-update`, `report-table`, `report-file-structure`, `report-git-diff`, `report-plan`, `report-numbered-bullet`, `report-enhance-prompt`, `report-progress`, `report-math-equation`, `report-todo`, `report-math-formula`
- `roleplay-*` (1): stakeholder roleplay perspectives. Examples: `roleplay-stakeholder`
- `check-*` (19): verification, structure, and health checks. Examples: `check-size`, `check-monorepo`, `check-unused-files`, `check-broken-skills-references`, `check-secrets-leak`, `check-dead-code`, `check-bottlenecks`, `check-backward-compatibility`
- `deep-*` (23): deep analysis, research, debugging, validation, update, and ship. Examples: `deep-analyze`, `deep-debug`, `deep-refactor`, `deep-retro`, `deep-impact`, `deep-validate`, `deep-test`, `deep-realize-implementation`, `deep-update-project`, `deep-update`, `deep-build`, `deep-review`, `deep-review-pr`
- `watch-*` (9): continuous monitoring and watch modes. Examples: `watch-all-task`, `watch-browser-and-fix`, `watch-deploy`, `watch-github-actions`, `watch-release`, `watch-terminal`
- `create-*` (20): project, plugin, bot, report, and diagram scaffolding. Examples: `create-mermaid-diagram`, `create-mermaid-diagram-all-workspace`, `create-new-project-in-drive-d`, `create-report-in-dot-devin`, `create-video-story`, `create-social-cover-image`, `create-github-repo`, `create-plan-as-github-issue`, `create-github-pr`
- `open-*` (16): browser, editor, and terminal integration. Examples: `open-in-wezterm`, `open-in-explorer`, `open-in-devin`, `open-files-in-web`, `open-github-repo`
- `search-*` (11): search across code, git, files, and the web. Examples: `search-files-patterns`, `search-in-git`, `search-in-raindrop-io`
- `use-*` (13): shell, scripts, and library usage. Examples: `use-scripts`, `use-ast-grep`, `use-bun-shell`, `use-pwsh-shell`, `use-my-packages-on-registry`, `use-create-pr`
- `git-*` (8): git, GitHub, branches, and releases. Examples: `git-commit`, `git-push`, `git-commit-at-devin-skills-global`, `git-file-history`
- `gen-*` (7): AI-generated images, video, voice, characters, and 3D. Examples: `gen-image-character`, `gen-ai-images`, `gen-ai-videos`, `gen-voice`
- `cleanup-*` (6): cleanup branches, issues, tasks, and files. Examples: `cleanup-files-in-computer`, `cleanup-git-branch`, `cleanup-worktree`
- `implement-*` (7): implement tasks and features. Examples: `implement-github-task`, `implement-todo-md`, `implement-features-to-mvp`, `implement-plan-from-github-issue`
- `idea-*` (8): idea generation. Examples: `idea-features` (chat), `deep-idea-features` (report/plan/impl), `idea-merge-files`, `idea-create-devin-skills-global`, `idea-refactor-workspace`
- `learn-*` (5): learning and research. Examples: `learn`, `learn-from-web`, `learn-from-pattern`
- `edit-*` (5): editing helpers. Examples: `edit-only`, `edit-relative`, `edit-manual`

Other utility prefixes and standalone skills: `alignment`, `all-*`, `analyze-*` (e.g. `analyze-file-structure`, `analyze-dependencies`, `analyze-attack-surface`, `analyze-root-cause-analysis`), `ask-*` (e.g. `ask-me`, `pick-bestest`), `assume-*`, `at-*`, `bench-*`, `capture-*`, `vs`, `consider-*`, `convert-*`, `delete-*` (e.g. `delete-cicd-fails`, `delete-git-submodules`), `deploy-*`, `dont-*`, `download-*`, `draw-*`, `explain`, `explore-*`, `fix`, `from-*`, `grouping`, `how-to-works`, `improve`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `realize-*`, `record-*`, `refactor*` (e.g. `refactor-codebase`), `release-*`, `relocate-*`, `rename-*`, `re-answer`, `research-setup`, `extract-*` (e.g. `extract-pattern`), `generate-*` (e.g. `generate-prompt-from-image`), `resolve-*` (e.g. `resolve-cicd`, `resolve-errors`, `resolve-cloudflare-worker-fails`), `restore-*`, `save-*`, `scan-*`, `suggest-*` (e.g. `suggest-me`, `suggest-next-action`), `create-mermaid-diagram`, `create-mermaid-diagram-all-workspace`, `report-what-you-do` (e.g. `suggest-me`, `suggest-next-action`), `follow-git-flow`, `follow-github`, `simplify`, `summarize-*` (e.g. `summarize-prompt`), `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `view-*`, `write-*`, and others.

### 6. Workspaces

- Not a monorepo: single root workspace (`%APPDATA%\devin\skills\`)
- Submodules: `open-files-in-web`, `open-devin-in-web`

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
- Skills: `/ship`

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines
- Every skill reference exists
- Changes are committed with a clear next action

