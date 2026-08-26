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
- `submodules: 3 (analyze-codebase-quality, ask-requirement, visualize-devin)`

### 3. Skills

#### Core

- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `follow-write-devin-skills: /follow-write-devin-skills`
- `ask-requirement: /ask-requirement`
- `validate: /validate`
- `review-rules: /review-rules`
- `review-devin-global-skills: /review-devin-global-skills`
- `git-commit: /git-commit`
- `ship: /ship`
- `report: /report`

#### Update

- `update-project: /update-project`
- `update-project-skills: /update-project-skills`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-all-devin-global-skills: /update-all-devin-global-skills`
- `update-devin-subagents: /update-devin-subagents`
- `update-readme: /update-readme`
- `update-docs: /update-docs`
- `update-features: /update-features`
- `update-gitignore: /update-gitignore`
- `update-dot-devin: /update-dot-devin`
- `update-contributing-md: /update-contributing-md`
- `update-rules: /update-rules`
- `update-test: /update-test`
- `update-reference: /update-reference`
- `update-usage: /update-usage`
- `update-github-metadata: /update-github-metadata`
- `update-github-task: /update-github-task`
- `update-dependencies-latest: /update-dependencies-latest`
- `run-release: /run-release`

#### Global Config

- `edit-devin-global-rules: /edit-devin-global-rules`
- `list-devin-global-mcp: /list-devin-global-mcp`
- `edit-devin-global-mcp: /edit-devin-global-mcp`
- `list-devin-global-hooks: /list-devin-global-hooks`

#### Review

- `review-refactor: /review-refactor`
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
- `review-seo: /review-seo`
- `review-techstack: /review-techstack`
- `review-security: /review-security`
- `review-observability: /review-observability`
- `review-compliance: /review-compliance`
- `review-writing: /review-writing`
- `update-review-codebase-cli-and-run: /update-review-codebase-cli-and-run`
- `review-gaps: /review-gaps`
- `review-dot-devin: /review-dot-devin`
- `review-devin-subagents: /review-devin-subagents`
- `review-features: /review-features`
- `review-readme: /review-readme`
- `review-docs: /review-docs`
- `review-usage: /review-usage`
- `review-consistency: /review-consistency`
- `review-content-coverage: /review-content-coverage`
- `review-redundancy: /review-redundancy`
- `review-restructure: /review-restructure`
- `review-workspace: /review-workspace`

#### Create

- `update-create-analyze-cli: /update-create-analyze-cli`
- `follow-github-issue-templates: /follow-github-issue-templates`

#### Search

- `search-files-patterns: /search-files-patterns`
- `search-in-raindrop-io: /search-in-raindrop-io`

#### Watch

- `watch-deploy: /watch-deploy`
- `watch-typecheck: /watch-typecheck`
- `watch-build: /watch-build`
- `watch-test: /watch-test`
- `watch-lint: /watch-lint`
- `watch-cloudflare-workers: /watch-cloudflare-workers`
- `watch-github-actions: /watch-github-actions`
- `watch-browser: /watch-browser`
- `watch-browser-console: /watch-browser-console`
- `watch-terminal: /watch-terminal`

### 4. Workspaces

- ไม่ใช่ monorepo: workspace เดียวคือ root (`%APPDATA%\devin\skills\`)
- Submodules: `ask-requirement`, `analyze-codebase-quality`, `visualize-devin`

### 5. Safety

- ไม่แก้ไข `SKILL.md` ของ skill อื่นโดยไม่ได้รับคำสั่ง
- ไม่ลบหรือย้าย skill directories โดยไม่มี dry run
- ทำ dry run ก่อน destructive actions

## Expected Outcome

- `AGENTS.md` ถูกต้องตาม Devin CLI standards
- references ทุก skill มีอยู่จริง
- commit การเปลี่ยนแปลงพร้อม next action
