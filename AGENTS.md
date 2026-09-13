---
name: devin-global-skills
description: Global and project-specific Devin CLI skill collection and conventions
related:
  - update-docs
  - follow-agents-md
  - update-devin-global-skills
  - update-devin
  - deep-validate
  - review-rules
  - review-devin-global-harness
  - git-commit
  - update-review-cli
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
4. Read `/update-devin-global-skills` when creating or updating a skill.

### 2. Maintain AGENTS.md

1. Run `/check-monorepo` to verify monorepo status.
2. Run `/deep-analyze` to analyze tech stack and structure.
3. Run `/all-workspace` if it is a monorepo.
4. For independent subtasks across multiple workspaces, use `/update-devin global-subagents` or `/use-subagents`.
5. Update `### Architecture`, `### Skills`, and `### Workspaces` based on the actual project.
6. Keep the file under 250 lines.

### 3. Validate And Ship

1. Run `/review-rules` to check `AGENTS.md` and rules coverage.
2. Run `/review-devin-global-harness` when editing skills.
3. Run `/deep-validate` to verify correctness.
4. Run `/git-commit` or `/ship` to commit changes.
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
- `skill-format: /update-devin-global-skills` for create and update
- `global-rules: /update-devin global-rules` (source: `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`)
- `review-cli: /update-review-cli` (only if `tools/review-codebase` exists)
- `submodules: open-files-in-web, open-devin-in-web, create-github-pr`

### 3. Platform

- `OS: Windows` (global Devin CLI config path `%APPDATA%\devin\skills\`).
- `repo-type: skill collection` (no package manifest at root).
- `runtime: none` (pure Markdown skill definitions; some submodules use Bun or Rust tooling).

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository currently contains **702** top-level skills (1030 `SKILL.md` including subskills) under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`; domain variants live under `subskills/` and are invoked as `/<parent> <domain>`.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `/list-devin global-skills`.

Core:
- `update-docs-agents-md: /update-docs-agents-md`
- `follow-agents-md: /follow-agents-md`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-subagents: /update-devin global-subagents` — create/update agents/ aligned with skills (subskill)
- `review-devin-global-harness: /review-devin-global-harness` — review all layers: skills, subagents, hooks, MCP, global rules
- `update-devin: /update-devin [domain]` — subskills: global-mcp, global-rules, global-subagents, harness, project-hooks, project-mcp, project-rules
- `git-commit: /git-commit`
- `update-review-cli: /update-review-cli`
- `ship: /ship`
- `report: /report`
- `deep-validate: /deep-validate`

Major skill families by current count:
- `follow-*` (183): language, framework, library, tool, service, architecture, and best-practice guides — domain variants consolidated into `follow-create-*` dispatcher parents (`follow-create-web`, `follow-create-mobile`, `follow-create-plugins`, `follow-create-docker`, `follow-create-product`). `follow-*-architecture` family merged into `/review-architecture` (`references/patterns-*.md`).
- `review-*` (55): code review, architecture, security, performance, accessibility, dependencies, quality, stakeholder roleplay domains (`review-by-stakeholder` รวม persona reviews) — ทุกตัว review/report-only โดย default พร้อม section `## Fix` ที่มี fix steps + guides ของ domain เมื่อ user confirm; canonical fix skill = `/deep-review-then-fix` (มี Domain Map อ่าน fix guides จาก `review-*/references/`). merged: `usage-md`+`features`→`docs`, `web`→`frontend`, `data-structure`→`algorithm`, `correctness`→`quality`, `readability`→`writing`, `platform`→`deep-review`, `redundancy`+`references`→`devin-global-skills` (`techstack` restored เมื่อ 2026-09 — catalog อยู่ที่ `review-dependencies/references/techstack-catalog.md`); domain `optimize-*` ถูก merge เข้า `review-*` `## Fix` ทั้งหมดแล้ว.
- `check-*` (51): verification, structure, and health checks — dispatchers: `check-files`, `check-secrets`, `check-repo-hygiene`, `check-monorepo`, `check-config-drift`.
- `run-*` (28): test, build, lint, typecheck, format, and deployment runners — `run-test` เป็น test dispatcher (`api`, `cli`, `contract`, `coverage`, `e2e`, `integration`, `mutation`, `visual`).
- `report-*` (27): reporting, diagrams, and visualization helpers — `report` เป็น format dispatcher (`table`, `html`, `numbered`, `codeblock`); `report-config-drift` merged → `check-config-drift`.
- `update-*` (25): repo, skills, docs, config, runtime, version, and test spec maintenance — `update-devin` (devin config dispatcher), `update-docs` (docs files dispatcher), `update-tests` (test spec dispatcher).
- `deep-*` (17): deep analysis, research, debugging, validation, verification, and orchestration — รวม `/deep-review` (codebase review, report-only) และ `/deep-review-then-fix` (canonical fix skill + Domain Map); alias stubs: `review-then-fix`, `deep-implement-to-production`, `deep-update-project`.
- `list-*` (17): inventory, lookup, and listing utilities — dispatchers: `list-devin`, `list-git`, `list-github`.
- `create-*` (13): project, plugin, bot, report, and diagram scaffolding — dispatchers: `create-cloudflare`, `create-github`.
- `open-*` (9): browser, editor, and terminal integration — `open` dispatcher (`explorer`, `github`, `web`, `wezterm`, `windows-terminal`, `zed`); specialized: `open-in-devin`, `open-diff`, `open-files-in-web`, `open-readme-html`, `open-cloudflare-workers`, `open-devin-in-web`, `open-web-dependencies`, `open-web-for-config-secret`.
- `ship-*` (2): `/ship` (entry point — `/update-docs-agents-md` + `/follow-agents-md`; full workflow อยู่ใน `### 8. Ship` ของ `update-docs-agents-md`; swarm mode = Step 4 + `references/swarm-*.md`), `/ship-dont-ask-me`.
- `gen-*` (8): media/artifact generation — `gen-media` dispatcher (`ai-images`, `ai-videos`, `image-character`, `3d-model`).
- `cleanup-*` (3): `cleanup` dispatcher (`branches-merged`, `docker`, `git-branch`, `github-issue`, `worktree`), `cleanup-files-in-project`, `cleanup-files-in-computer`.
- `search-*` (3): `search` dispatcher (`files-patterns`, `github-star`, `mcp`, `npmx`, `project-in-drive-d`, `raindrop`, `similar`, `skills`), `search-in-git`, `search-npm-libraries`.
- `improve-*` (3): `improve`, `improve-devin-global-skills`, `improve-uxui-and-features` (มี subskills: contrast, responsive, states).
- `resolve-*` (5): error/CI/issue/conflict resolution — `resolve-errors` (canonical fixer; absorbs `resolve-github-actions-fails`, `resolve-cloudflare-worker-fails`, `resolve-all-cloudflare-fails`), `resolve-cicd` (watcher — watch CI `gh run` + CD `wrangler`/deploys แล้ว dispatch `/resolve-errors`).
- `restore-*` (1→dispatcher): `restore-files` (`deleted-file`, `from-devin-history`, `from-git-log`, `from-my-dotfiles`); `restore` = alias stub.
- `idea-*` (1→dispatcher): `idea` (`features`, `merge`, `naming`, `uxui-features`, `refactor-workspace`, `convert-my-global-cli-to-skills`, `devin-global-skills-from-session`, `new-devin-global-skills`).
- `merge-*` (1→dispatcher): `merge` (`all-branch-by-me-to-main`, `git-branch`, `github-pr`).
- `convert-*` (1→dispatcher): `convert` (`esm`, `files-format`, `git-submodules`, `scripts`, `svg`).
- `delete-*` (1→dispatcher): `delete` (`cicd-fails`, `git-branch`, `git-submodules`, `git-worktree`, `projects`).
- `learn-*` (1→dispatcher): `learn` (`by-slide`, `cli`, `codebase`, `pattern`, `references`, `web`).
- `git-commit-*` (1→dispatcher): `git-commit` (`and-push`, `at-devin-global-skills`, `no-verify`, `selected-files`).
- `watch-*` (6): browser watching + `watch-browser` dispatcher (`fix`, `improve-uxui`, `test`).

Other prefixes: `all-*`, `analyze-*`, `ask-*`, `assume-*`, `at-*`, `bench-*`, `capture-*`, `cleanup-*`, `convert-*`, `delete-*`, `deploy-*`, `dont-*`, `download-*`, `draw-*`, `edit-*`, `explain`, `explore-*`, `fix`, `from-*`, `gen-*`, `grouping`, `how-to-works`, `idea-*`, `implement-*`, `review-then-fix`, `learn-*`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `productionize-*`, `record-*`, `refactor*`, `relocate-*`, `rename-*`, `re-answer`, `research-setup`, `resolve-*`, `restore-*`, `save-*`, `scan-*`, `search-*`, `set-*`, `setup-*`, `suggest-*`, `summarize-*`, `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `use-*`, `view-*`, `vs`, `watch-*`, `write-*`.

### 6. Workspaces

- Not a package monorepo: single root workspace (`%APPDATA%\devin\skills\`).
- Git submodules: `open-files-in-web`, `open-devin-in-web`, `create-github-pr`.

### 7. Subagents

- Use `/update-devin global-subagents` or `/use-subagents` when there are independent subtasks across multiple workspaces or large skill families.
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
