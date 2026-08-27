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
  - git-commit
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
4. Run `/git-commit` or `/ship` to commit changes
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

### 3. Skills

#### Core

- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `learn-from-web: /learn-from-web`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-subagents: /update-devin-global-subagents`
- `follow-devin-skills: /follow-devin-skills`
- `follow-principles: /follow-principles`
- `alignment: /alignment`
- `follow-devin-global-subagents: /follow-devin-global-subagents`
- `ask-project-requirement: /ask-project-requirement`
- `ask-me: /ask-me`
- `ask-again: /ask-again`
- `dont-ask: /dont-ask`
- `dont-understand: /dont-understand`
- `ship-dont-ask: /ship-dont-ask`
- `follow-enter-dot: /follow-enter-dot`
- `follow-deep: /follow-deep`
- `plan-with-me: /plan-with-me`
- `deep-validate: /deep-validate`
- `review-rules: /review-rules`
- `review-devin-global-skills: /review-devin-global-skills`
- `ship: /ship`
- `test-all: /test-all`
- `report: /report`
- `report-before: /report-before`
- `report-idea: /report-idea`
- `report-flow: /report-flow`
- `report-html: /report-html`
- `consider-use-in-another-skills: /consider-use-in-another-skills`
- `do-it-all: /do-it-all`
- `at-this-repo: /at-this-repo`
- `edit-this-repo: /edit-this-repo`
- `report-usage-md: /report-usage-md`
- `report-uxui-sketch: /report-uxui-sketch`
- `report-uxui-all-routes: /report-uxui-all-routes`
- `resolve-github-pull-request: /resolve-github-pull-request`
- `fix: /fix`
- `improve: /improve`
- `delete: /delete`
- `delete-project-from-local-remote: /delete-project-from-local-remote`
- `cleanup-files-in-computer: /cleanup-files-in-computer`
- `merge-in: /merge-in`
- `move-to: /move-to`
- `rename-to: /rename-to`
- `create-github-issue: /create-github-issue`
- `realize-implementation: /realize-implementation`
- `implement-mock: /implement-mock`
- `implement-todo-md: /implement-todo-md`
- `implement-github-issue: /implement-github-issue`
- `implement-github-task: /implement-github-task`

#### Math

- `follow-math-concepts: /follow-math-concepts`
- `follow-math-propositional-logic: /follow-math-propositional-logic`
- `follow-math-predicate-logic: /follow-math-predicate-logic`
- `follow-math-set-theory: /follow-math-set-theory`
- `follow-math-boolean-algebra: /follow-math-boolean-algebra`
- `follow-math-combinatorics: /follow-math-combinatorics`
- `follow-math-probability: /follow-math-probability`
- `follow-math-statistics: /follow-math-statistics`
- `follow-math-graph-theory: /follow-math-graph-theory`
- `follow-math-linear-algebra: /follow-math-linear-algebra`
- `follow-math-discrete-math: /follow-math-discrete-math`
- `follow-math-algorithm-complexity: /follow-math-algorithm-complexity`
- `follow-math-numerical-methods: /follow-math-numerical-methods`
- `follow-math-optimization: /follow-math-optimization`
- `follow-math-information-theory: /follow-math-information-theory`
- `follow-math-category-theory: /follow-math-category-theory`
- `follow-math-cryptography: /follow-math-cryptography`
- `follow-math-proofs: /follow-math-proofs`
- `follow-math-game-theory: /follow-math-game-theory`

#### Analyze

- `analyze-root-cause-analysis: /analyze-root-cause-analysis`
- `report-workspace-graph: /report-workspace-graph`
- `from-recent-windows-capture: /from-recent-windows-capture`
- `taxonomy: /taxonomy`
- `analyze-image: /analyze-image`
- `analyze-video: /analyze-video`
- `type-of: /type-of`

#### Request

- `enhance-prompt: /enhance-prompt`
- `request-prompt: /request-prompt`
- `request-math-formular: /request-math-formular`
- `request-pattern: /request-pattern`

#### Language

- `translate-to-lang-th: /translate-to-lang-th`
- `translate-to-lang-en: /translate-to-lang-en`

#### Update

- `update-project: /update-project`
- `update-project-all-drive-d: /update-project-all-drive-d`
- `update-config: /update-config`
- `update-project-skills: /update-project-skills`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-all-devin-global-skills: /update-all-devin-global-skills`
- `update-devin-harness: /update-devin-harness`
- `update-devin-global-rules: /update-devin-global-rules`
- `update-everythink-in-computer: /update-everythink-in-computer`
- `update-all-program-in-computer: /update-all-program-in-computer`
- `update-chezmoi: /update-chezmoi`
- `update-devin-global-subagents: /update-devin-global-subagents`
- `update-readme-md: /update-readme-md`
- `update-docs: /update-docs`
- `update-features-md: /update-features-md`
- `update-gitignore: /update-gitignore`
- `update-dot-devin: /update-dot-devin`
- `update-contributing-md: /update-contributing-md`
- `update-dot-vscode: /update-dot-vscode`
- `update-project-rules: /update-project-rules`
- `update-test: /update-test`
- `update-references: /update-references`
- `edit-relative: /edit-relative`
- `update-github-metadata: /update-github-metadata`
- `update-github-task: /update-github-task`
- `update-dependencies-latest: /update-dependencies-latest`
- `follow-release: /follow-release`
- `run-release: /run-release`
- `gen-changelog-md: /gen-changelog-md`
- `update-usage-md: /update-usage-md`
- `update-todo-md: /update-todo-md`

#### Global Config

- `follow-global-rules: /follow-global-rules`
- `list-devin-global-mcp: /list-devin-global-mcp`
- `update-devin-global-mcp: /update-devin-global-mcp`
- `list-devin-global-hooks: /list-devin-global-hooks`

#### Review

- `review-refactor: /review-refactor`
- `review-references: /review-references`
- `review-update: /review-update`
- `review-implement: /review-implement`
- `review-plan: /review-plan`
- `review-test: /review-test`
- `review-deploy: /review-deploy`
- `review-release: /review-release`
- `review-risk: /review-risk`
- `review-migration: /review-migration`
- `review-quality: /review-quality`
- `review-frontend: /review-frontend`
- `review-backend: /review-backend`
- `review-platform: /review-platform`
- `review-architecture: /review-architecture`
- `review-stability: /review-stability`
- `review-delivery: /review-delivery`
- `review-performance: /review-performance`
- `review-github-pull-request: /review-github-pull-request`
- `review-seo: /review-seo`
- `review-techstack: /review-techstack`
- `review-security: /review-security`
- `review-observability: /review-observability`
- `review-compliance: /review-compliance`
- `review-correctness: /review-correctness`
- `review-writing: /review-writing`
- `update-review-codebase-cli-and-run: /update-review-codebase-cli-and-run`
- `review-gaps: /review-gaps`
- `review-dot-devin: /review-dot-devin`
- `review-devin-global-subagents: /review-devin-global-subagents`
- `review-features: /review-features`
- `review-readme-md: /review-readme-md`
- `review-docs: /review-docs`
- `review-app-usage: /review-app-usage`
- `review-usage-md: /review-usage-md`
- `review-consistency: /review-consistency`
- `review-content-coverage: /review-content-coverage`
- `review-redundancy: /review-redundancy`
- `review-restructure: /review-restructure`
- `review-workspace: /review-workspace`
- `review-naming: /review-naming`
- `review-flow: /review-flow`
- `review-workflow: /review-workflow`
- `review-config: /review-config`
- `review-readability: /review-readability`
- `review-diff: /review-diff`
- `review-and-fix: /review-and-fix`
- `review-business: /review-business`
- `review-by-stakeholder: /review-by-stakeholder`
- `review-github-issue: /review-github-issue`
- `review-issue: /review-issue`
- `review-realize-implementation: /review-realize-implementation`
- `review-uxui: /review-uxui`

#### Create

- `create-files-in-temp: /create-files-in-temp`
- `create-plan-md-in-dot-devin: /create-plan-md-in-dot-devin`
- `create-similar: /create-similar`
- `update-examples: /update-examples`
- `update-create-analyze-cli: /update-create-analyze-cli`
- `follow-github-issue-templates: /follow-github-issue-templates`
- `follow-create-biome-plugins: /follow-create-biome-plugins`
- `follow-create-browser-extensions: /follow-create-browser-extensions`
- `follow-create-bun-cli: /follow-create-bun-cli`
- `follow-create-cli: /follow-create-cli`
- `follow-create-claude-plugin: /follow-create-claude-plugin`
- `follow-create-codex-plugin: /follow-create-codex-plugin`
- `follow-create-discord-bot: /follow-create-discord-bot`
- `follow-create-elysia-plugin: /follow-create-elysia-plugin`
- `follow-create-eslint-plugins: /follow-create-eslint-plugins`
- `follow-create-github-action: /follow-create-github-action`
- `follow-create-line-bot: /follow-create-line-bot`
- `follow-create-mcp: /follow-create-mcp`
- `follow-create-mobile-android: /follow-create-mobile-android`
- `follow-create-mobile-ios: /follow-create-mobile-ios`
- `follow-create-mobile-ios-android: /follow-create-mobile-ios-android`
- `follow-create-nitro-plugin: /follow-create-nitro-plugin`
- `follow-create-nvim-plugins: /follow-create-nvim-plugins`
- `follow-create-obsidian-plugin: /follow-create-obsidian-plugin`
- `follow-create-oxlint-plugins: /follow-create-oxlint-plugins`
- `follow-create-raycast-extensions: /follow-create-raycast-extensions`
- `follow-create-rolldown-plugins: /follow-create-rolldown-plugins`
- `follow-create-rust-crate: /follow-create-rust-crate`
- `follow-create-rust-cli: /follow-create-rust-cli`
- `follow-create-sdk: /follow-create-sdk`
- `follow-create-tauri-plugins: /follow-create-tauri-plugins`
- `follow-create-telegram-bot: /follow-create-telegram-bot`
- `follow-create-vite-plugins: /follow-create-vite-plugins`
- `follow-create-vitest-plugins: /follow-create-vitest-plugins`
- `follow-create-vscode-extensions: /follow-create-vscode-extensions`
- `follow-create-website: /follow-create-website`
- `follow-create-website-rust: /follow-create-website-rust`
- `follow-create-zed-extensions: /follow-create-zed-extensions`
- `create-github-repo: /create-github-repo`
- `draw-svg-image: /draw-svg-image`
- `draw-excalidraw: /draw-excalidraw`
- `draw-tldraw: /draw-tldraw`
- `draw-tldraw-diagram: /draw-tldraw-diagram`
- `gen-ai-images: /gen-ai-images`
- `gen-ai-videos: /gen-ai-videos`
- `gen-3d-model: /gen-3d-model`
- `gen-voice: /gen-voice`
- `gen-subtitle-video: /gen-subtitle-video`
- `follow-solid-tanstack: /follow-solid-tanstack`
- `follow-lib-react: /follow-lib-react`
- `follow-lib-tanstack-ecosystem: /follow-lib-tanstack-ecosystem`
- `follow-lib-effect-ts: /follow-lib-effect-ts`
- `follow-edgejs: /follow-edgejs`
- `follow-programming-paradigm: /follow-programming-paradigm`
- `follow-single-responsibility: /follow-single-responsibility`
- `follow-tool-rolldown: /follow-tool-rolldown`

#### Convert

- `convert-to-product: /convert-to-product`
- `convert-files-format: /convert-files-format`
- `convert-to-svg: /convert-to-svg`

#### Summarize

- `summarize: /summarize`
- `summarize-this-project: /summarize-this-project`
- `summarize-this-chat-session: /summarize-this-chat-session`

#### Visualize

- `visualize-in-markdown-graph: /visualize-in-markdown-graph`
- `visualize-in-web: /visualize-in-web`
- `visualize-project: /visualize-project`
- `visualize-to-graph-in-web: /visualize-to-graph-in-web`

#### Search

- `search-api-references: /search-api-references`
- `search-files-patterns: /search-files-patterns`
- `search-files-patterns-in-drive-d: /search-files-patterns-in-drive-d`
- `search-in-raindrop-io: /search-in-raindrop-io`
- `list-raindrop-io: /list-raindrop-io`
- `list-devin-global-skills: /list-devin-global-skills`
- `list-devin-global-subagents: /list-devin-global-subagents`
- `use-ast-grep: /use-ast-grep`
- `list-website-all-routes: /list-website-all-routes`
- `list-project-task: /list-project-task`
- `list-project-git-in-computer: /list-project-git-in-computer`
- `all-remote-repo: /all-remote-repo`
- `list-github-pull-request: /list-github-pull-request`
- `list-cloudflare-project: /list-cloudflare-project`
- `list-brave-browser-history: /list-brave-browser-history`
- `list-chezmoi-files: /list-chezmoi-files`
- `list-devin-user-request-in-this-session: /list-devin-user-request-in-this-session`
- `list-devin-user-request-all-session: /list-devin-user-request-all-session`
- `list-devin-user-request-this-repo: /list-devin-user-request-this-repo`
- `list-devin-session: /list-devin-session`
- `search-similar: /search-similar`
- `search-in-github-star: /search-in-github-star`
- `list-repo-in-github-star: /list-repo-in-github-star`

#### Script

- `use-scripts: /use-scripts`
- `use-bun-scripts: /use-bun-scripts`
- `use-bun-shell: /use-bun-shell`
- `use-nu-shell: /use-nu-shell`
- `use-pwsh-shell: /use-pwsh-shell`
- `use-ast-grep: /use-ast-grep`
- `use-ast-grep-programatic: /use-ast-grep-programatic`
- `check-code-structure: /check-code-structure`
- `check-skills-related: /check-skills-related`

#### Watch

- `watch-release: /watch-release`
- `watch-deploy: /watch-deploy`
- `watch-typecheck: /watch-typecheck`
- `watch-build: /watch-build`
- `watch-ci-cd: /watch-ci-cd`
- `watch-test: /watch-test`
- `watch-lint: /watch-lint`
- `watch-cloudflare: /watch-cloudflare`
- `watch-cloudflare-and-fix-in-computer: /watch-cloudflare-and-fix-in-computer`
- `watch-vercel: /watch-vercel`
- `watch-all-task: /watch-all-task`
- `watch-github-actions: /watch-github-actions`
- `watch-browser: /watch-browser`
- `watch-browser-console: /watch-browser-console`
- `watch-terminal: /watch-terminal`

#### Deploy

- `deploy-to-cloudflare: /deploy-to-cloudflare`
- `deploy-to-vercel: /deploy-to-vercel`
- `deploy-to-railway: /deploy-to-railway`

#### Git

- `check-git-files-history: /check-git-files-history`
- `convert-to-git-submodules: /convert-to-git-submodules`
- `create-github-pull-request: /create-github-pull-request`
- `create-git-worktree-in-project: /create-git-worktree-in-project`
- `cleanup-worktree: /cleanup-worktree`
- `delete-git-branch: /delete-git-branch`
- `delete-git-submodules: /delete-git-submodules`
- `delete-git-worktree: /delete-git-worktree`
- `edit-git-commit: /edit-git-commit`
- `git-commit: /git-commit`
- `git-commit-and-push: /git-commit-and-push`
- `git-commit-selected-files: /git-commit-selected-files`
- `git-debug: /git-debug`
- `git-push: /git-push`
- `use-git-search: /use-git-search`
- `restore-from-git-log: /restore-from-git-log`
- `refactor-commit: /refactor-commit`
- `list-git-commit: /list-git-commit`
- `list-git-release: /list-git-release`
- `list-git-submodules: /list-git-submodules`
- `list-git-worktree: /list-git-worktree`
- `merge-github-pull-request: /merge-github-pull-request`
- `merge-worktree-to-main: /merge-worktree-to-main`
- `rename-git-commit: /rename-git-commit`
- `use-git-bisect: /use-git-bisect`

#### Idea

- `idea-create-devin-skills-global: /idea-create-devin-skills-global`
- `idea-convert-my-global-cli-to-skills: /idea-convert-my-global-cli-to-skills`
- `idea-features: /idea-features`
- `idea-improve-files-naming: /idea-improve-files-naming`
- `idea-use-skills-in-another-skills: /idea-use-skills-in-another-skills`

### 4. Workspaces

- Not a monorepo: single root workspace (`%APPDATA%\devin\skills\`)
- Submodules: `ask-project-requirement`, `analyze-codebase-quality`, `visualize-devin-in-web`

### 5. Safety

- Do not edit another skill's `SKILL.md` without explicit command
- Do not delete or move skill directories without a dry run
- Dry run before destructive actions

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards
- Every skill reference exists
- Changes are committed with a clear next action
