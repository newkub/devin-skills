---
name: devin-global-skills
description: รวบรวม skills สำหรับ Devin CLI ทั้ง global และ project-specific
related:
  - update-agents-md
  - follow-agents-md
  - follow-write-devin-skills
  - validate
  - review-rules
  - review-devin-global-skills
  - git-commit
  - ship
  - report
---

## Goal

จัดทำและรักษา `AGENTS.md` และ conventions ของ Devin global skills repository ให้ถูกต้อง ครบถ้วน และพร้อมใช้งาน

## Scope

ใช้กับ root workspace `%APPDATA%\devin\skills\` ที่เก็บ skill packages ทั้งหมด ไม่รวมการแก้ไข source code ของแต่ละ skill โดยตรง

## Execute

### 1. Start Every Task

> Goal: ตรวจสอบสถานะ workspace และ references ก่อนลงมือ

1. ทำตาม `/update-agents-md` ก่อนเริ่มงานทุกครั้ง
2. ทำตาม `/follow-agents-md` เพื่ออ่านและทำตาม `AGENTS.md`
3. อ่าน global rules จาก `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
4. อ่าน `/follow-write-devin-skills` เมื่อแก้ไข skill

### 2. Maintain AGENTS.md

> Goal: ให้ `AGENTS.md` เป็นปัจจุบันและถูกต้อง

1. ทำตาม `/check-monorepo` เพื่อตรวจสอบ monorepo
2. ทำตาม `/analyze-project` เพื่อวิเคราะห์ tech stack และ structure
3. ทำตาม `/all-workspace` ถ้าเป็น monorepo
4. อัปเดท `### Architecture`, `### Skills`, `### Workspaces` ตาม project จริง
5. เก็บไฟล์ไม่เกิน 250 บรรทัด

### 3. Validate And Ship

> Goal: ตรวจสอบและ commit การเปลี่ยนแปลง

1. ทำตาม `/review-rules` เพื่อตรวจสอบ `AGENTS.md`
2. ทำตาม `/review-devin-global-skills` เมื่อแก้ไข skills
3. ทำตาม `/validate` เพื่อตรวจสอบความถูกต้อง
4. ทำตาม `/git-commit` หรือ `/ship` เพื่อ commit การเปลี่ยนแปลง
5. ทำตาม `/report` เพื่อสรุปผล

## Rules

### 1. Format

- ใช้ frontmatter `name`, `description`, `related`
- ลำดับ sections: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
- ไฟล์ไม่เกิน 250 บรรทัด
- ใช้ backticks สำหรับ `tools`, `commands`, `paths`, `skill-name`

### 2. Architecture

- `devin-cli-skills: /follow-write-devin-skills`
- `skill-format: /follow-write-devin-skills/references/skill-md.md`
- `global-rules: C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`
- `submodules: 3 (analyze-codebase-quality, ask-project-requirement, visualize-devin)`

### 3. Skills

#### Core

- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `learn-website-all-routes: /learn-website-all-routes`
- `follow-write-devin-skills: /follow-write-devin-skills`
- `follow-principles: /follow-principles`
- `follow-alignment: /follow-alignment`
- `follow-devin-global-subagents: /follow-devin-global-subagents`
- `ask-project-requirement: /ask-project-requirement`
- `follow-enter-dot: /follow-enter-dot`
- `follow-all-deep: /follow-all-deep`
- `validate: /validate`
- `review-rules: /review-rules`
- `review-devin-global-skills: /review-devin-global-skills`
- `ship: /ship`
- `test-all: /test-all`
- `report: /report`
- `report-before: /report-before`
- `report-idea: /report-idea`
- `report-flow: /report-flow`
- `consider-use-in-another-skills: /consider-use-in-another-skills`
- `at-this-repo: /at-this-repo`
- `report-usage-md: /report-usage-md`
- `resolve-github-pull-request: /resolve-github-pull-request`
- `fix: /fix`
- `improve: /improve`
- `delete-files: /delete-files`
- `create-github-issue: /create-github-issue`
- `realize-implementation: /realize-implementation`
- `implement-mock: /implement-mock`
- `implement-todo-md: /implement-todo-md`
- `implement-github-issue: /implement-github-issue`
- `implement-github-task: /implement-github-task`

#### Analyze

- `analyze-root-cause-analysis: /analyze-root-cause-analysis`
- `report-workspace-graph: /report-workspace-graph`

#### Request

- `request-prompt: /request-prompt`
- `request-math-formular: /request-math-formular`
- `request-pattern: /request-pattern`

#### Language

- `translate-to-lang-th: /translate-to-lang-th`
- `translate-to-lang-en: /translate-to-lang-en`

#### Update

- `update-project: /update-project`
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
- `update-features: /update-features`
- `update-gitignore: /update-gitignore`
- `update-dot-devin: /update-dot-devin`
- `update-contributing-md: /update-contributing-md`
- `update-dot-vscode: /update-dot-vscode`
- `update-project-rules: /update-project-rules`
- `update-test: /update-test`
- `update-references: /update-references`
- `edit-relative-files: /edit-relative-files`
- `update-github-metadata: /update-github-metadata`
- `update-convert-active-repo-to-devin-skills: /update-convert-active-repo-to-devin-skills`
- `update-github-task: /update-github-task`
- `update-dependencies-latest: /update-dependencies-latest`
- `follow-release: /follow-release`
- `run-release: /run-release`
- `gen-changelog-md: /gen-changelog-md`
- `update-usage-md: /update-usage-md`
- `update-todo-md: /update-todo-md`
- `add-to-todo-md: /add-to-todo-md`
- `add-to-queue: /add-to-queue`

#### Global Config

- `align-global-rules: /align-global-rules`
- `edit-devin-global-rules: /edit-devin-global-rules`
- `list-devin-global-mcp: /list-devin-global-mcp`
- `edit-devin-global-mcp: /edit-devin-global-mcp`
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
- `review-readability: /review-readability`

#### Create

- `create-files-in-temp: /create-files-in-temp`
- `create-plan-md-in-dot-devin: /create-plan-md-in-dot-devin`
- `create-similar: /create-similar`
- `update-examples: /update-examples`
- `update-create-analyze-cli: /update-create-analyze-cli`
- `follow-github-issue-templates: /follow-github-issue-templates`
- `follow-create-browser-extensions: /follow-create-browser-extensions`
- `follow-create-website: /follow-create-website`
- `follow-solid-tanstack: /follow-solid-tanstack`
- `follow-lib-react: /follow-lib-react`
- `follow-lib-tanstack-ecosystem: /follow-lib-tanstack-ecosystem`
- `follow-lib-effect-ts: /follow-lib-effect-ts`
- `follow-edgejs: /follow-edgejs`
- `follow-programming-paradigm: /follow-programming-paradigm`
- `follow-single-responsibility: /follow-single-responsibility`
- `follow-tool-rolldown: /follow-tool-rolldown`

#### Convert

- `convert-to: /convert-to`
- `convert-to-markdown: /convert-to-markdown`
- `convert-to-html: /convert-to-html`
- `convert-to-json: /convert-to-json`
- `convert-to-project: /convert-to-project`
- `convert-to-product: /convert-to-product`
- `convert-to-docs: /convert-to-docs`
- `convert-to-mcp: /convert-to-mcp`

#### Summarize

- `summarize: /summarize`
- `summarize-this-project: /summarize-this-project`
- `summarize-this-chat-session: /summarize-this-chat-session`

#### Search

- `search-files-patterns: /search-files-patterns`
- `search-in-raindrop-io: /search-in-raindrop-io`
- `list-raindrop-io: /list-raindrop-io`
- `list-devin-global-skills: /list-devin-global-skills`
- `list-devin-global-subagents: /list-devin-global-subagents`
- `use-ast-grep: /use-ast-grep`
- `list-website-all-routes: /list-website-all-routes`
- `list-project-task: /list-project-task`
- `list-project-git-in-computer: /list-project-git-in-computer`
- `list-github-pull-request: /list-github-pull-request`
- `list-cloudflare-project: /list-cloudflare-project`
- `list-brave-browser-history: /list-brave-browser-history`
- `list-chezmoi-files: /list-chezmoi-files`
- `list-devin-user-request-in-this-session: /list-devin-user-request-in-this-session`
- `list-devin-user-request-all-session: /list-devin-user-request-all-session`
- `search-similar: /search-similar`

#### Script

- `use-scripts: /use-scripts`
- `use-bun-scripts: /use-bun-scripts`
- `use-bun-shell: /use-bun-shell`
- `use-nu-shell: /use-nu-shell`
- `use-pwsh-shell: /use-pwsh-shell`
- `use-ast-grep: /use-ast-grep`
- `use-ast-grep-programatic: /use-ast-grep-programatic`
- `use-ast-grep-outline: /use-ast-grep-outline`

#### At

- `at-agents-manager: /at-agents-manager`
- `at-animal-dance: /at-animal-dance`
- `at-awesome-opensource: /at-awesome-opensource`
- `at-booking-platform: /at-booking-platform`
- `at-compare-platform: /at-compare-platform`
- `at-compareit: /at-compareit`
- `at-create-skills: /at-create-skills`
- `at-dept-saw: /at-dept-saw`
- `at-digital-product: /at-digital-product`
- `at-dotfiles: /at-dotfiles`
- `at-explore-opensource: /at-explore-opensource`
- `at-gen-password: /at-gen-password`
- `at-github-star-manager: /at-github-star-manager`
- `at-learn-wrikka-com: /at-learn-wrikka-com`
- `at-new-habbit: /at-new-habbit`
- `at-newkub: /at-newkub`
- `at-raindrop-cli: /at-raindrop-cli`
- `at-ship: /at-ship`
- `at-skills-as-a-services: /at-skills-as-a-services`
- `at-slides: /at-slides`
- `at-template-starter: /at-template-starter`
- `at-tiermaker: /at-tiermaker`
- `at-trading: /at-trading`
- `at-typing-racer: /at-typing-racer`
- `at-wpackages: /at-wpackages`
- `at-wregistry: /at-wregistry`
- `at-wrikka-com: /at-wrikka-com`
- `at-wrikka-platform: /at-wrikka-platform`

#### Watch

- `watch-release: /watch-release`
- `watch-deploy: /watch-deploy`
- `watch-typecheck: /watch-typecheck`
- `watch-build: /watch-build`
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

- `convert-to-git-submodules: /convert-to-git-submodules`
- `create-github-pull-request: /create-github-pull-request`
- `create-worktree-in-project: /create-worktree-in-project`
- `cleanup-worktree: /cleanup-worktree`
- `delete-git-branch: /delete-git-branch`
- `delete-git-submodules: /delete-git-submodules`
- `delete-git-worktree: /delete-git-worktree`
- `edit-git-commit: /edit-git-commit`
- `git-commit: /git-commit`
- `list-git-commit: /list-git-commit`
- `list-git-release: /list-git-release`
- `list-git-submodules: /list-git-submodules`
- `list-git-worktree: /list-git-worktree`
- `merge-github-pull-request: /merge-github-pull-request`
- `merge-worktree-to-main: /merge-worktree-to-main`
- `rename-git-commit: /rename-git-commit`

#### Idea

- `idea-new-devin-skills-global: /idea-new-devin-skills-global`
- `idea-convert-my-global-cli-to-skills: /idea-convert-my-global-cli-to-skills`
- `idea-features: /idea-features`
- `idea-improve-files-naming: /idea-improve-files-naming`
- `idea-use-skills-in-another-skills: /idea-use-skills-in-another-skills`

### 4. Workspaces

- ไม่ใช่ monorepo: workspace เดียวคือ root (`%APPDATA%\devin\skills\`)
- Submodules: `ask-project-requirement`, `analyze-codebase-quality`, `visualize-devin`

### 5. Safety

- ไม่แก้ไข `SKILL.md` ของ skill อื่นโดยไม่ได้รับคำสั่ง
- ไม่ลบหรือย้าย skill directories โดยไม่มี dry run
- ทำ dry run ก่อน destructive actions

## Expected Outcome

- `AGENTS.md` ถูกต้องตาม Devin CLI standards
- references ทุก skill มีอยู่จริง
- commit การเปลี่ยนแปลงพร้อม next action
