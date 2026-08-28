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
- `submodules: 3 (analyze-codebase-quality, ask-project-requirement, visualize-devin-in-web)`

### 3. Platform

- `OS: Windows` (global Devin CLI config path)
- `repo-type: skill collection` (no package manifest at root)
- `runtime: none` (pure Markdown skill definitions; some submodules use Rust or Node tooling)

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository contains hundreds of skills under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`.

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
- `follow-*`: language, framework, library, tool, service, architecture, and best-practice guides. Examples: `follow-my-package-manager: /follow-my-package-manager`, `follow-create-product: /follow-create-product`, `follow-framework-nextjs: /follow-framework-nextjs`
- `review-*`: code review, architecture, security, performance, and quality. Examples: `review-quality: /review-quality`, `review-frontend: /review-frontend`, `review-rules: /review-rules`
- `update-*`: repo, skills, docs, config, and dependency maintenance. Examples: `update-all-program-in-computer: /update-all-program-in-computer`, `update-readme-md: /update-readme-md`, `update-dot-devin: /update-dot-devin`
- `run-*`: test, build, lint, typecheck, format, and deployment runners. Examples: `run-test: /run-test`, `run-build: /run-build`, `run-check: /run-check`
- `create-*`: project, plugin, and bot scaffolding. Examples: `follow-create-cli: /follow-create-cli`, `create-video-story: /create-video-story`, `create-github-repo: /create-github-repo`
- `gen-*`: AI-generated images, video, voice, characters, and 3D. Examples: `gen-image-character: /gen-image-character`, `gen-ai-images: /gen-ai-images`
- `download-*`: download and install tools. Examples: `download-program: /download-program`
- `uninstall-*`: uninstall tools and apps. Examples: `uninstall-program-in-computer: /uninstall-program-in-computer`
- `list-*`: inventory, lookup, and listing utilities. Examples: `list-program-in-computer: /list-program-in-computer`, `list-devin-global-skills: /list-devin-global-skills`, `list-git-branch: /list-git-branch`
- `report-*`: reporting, diagrams, and visualization helpers. Examples: `report-my-cli-update: /report-my-cli-update`, `report-table: /report-table`, `report-file-structure: /report-file-structure`
- `deep-*`: deep analysis, research, debugging, and validation. Examples: `deep-analyze: /deep-analyze`, `deep-validate: /deep-validate`
- `check-*`: verification, structure, and health checks. Examples: `check-size: /check-size`, `check-monorepo: /check-monorepo`, `check-unused-files: /check-unused-files`
- `use-*`: shell, scripts, and library usage. Examples: `use-scripts: /use-scripts`, `use-ast-grep: /use-ast-grep`
- `search-*`: search across code, git, files, and the web. Examples: `search-files-patterns: /search-files-patterns`
- `watch-*`: continuous monitoring and watch modes. Examples: `watch-build: /watch-build`
- `open-*`: browser, editor, and terminal integration. Examples: `open-in-wezterm: /open-in-wezterm`
- `visualize-*`: diagrams and web visualizations. Examples: `visualize-in-web: /visualize-in-web`
- `git-*`: git, GitHub, branches, and releases. Examples: `git-commit: /git-commit`, `git-push: /git-push`
- `roleplay-*`: stakeholder roleplay perspectives. Examples: `roleplay-staff-engineer: /roleplay-staff-engineer`
- `ask-*`, `plan-*`, `learn-*`, `summarize-*`, `analyze-*`, `implement-*`, `convert-*`, `cleanup-*`, `fix`, `improve`, `refactor`, `ship`, `test-all`, and other utility skills make up the rest.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `list-devin-global-skills`.

### 6. Workspaces

- Not a monorepo: single root workspace (`%APPDATA%\devin\skills\`)
- Submodules: `ask-project-requirement`, `analyze-codebase-quality`, `visualize-devin-in-web`

### 7. Safety

- Do not edit another skill's `SKILL.md` without explicit command
- Do not delete or move skill directories without a dry run
- Dry run before destructive actions

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines
- Every skill reference exists
- Changes are committed with a clear next action
