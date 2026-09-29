---
name: devin-global-skills
description: Global and project-specific Devin CLI skill collection and conventions
related:
  - update-docs
  - update-vitepress-docs
  - follow-agents-md
  - update-devin-global-skills
  - update-devin
  - deep-validate
  - review-dot-devin
  - review-devin-global-harness
  - git-commit
  - update-review-cli-then-run
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
4. For independent subtasks across multiple workspaces, use `/update-devin-global-subagents` or `/use-subagents`.
5. Update `### Architecture`, `### Skills`, and `### Workspaces` based on the actual project.
6. Keep the file under 250 lines.

### 3. Validate And Ship

1. Run `/review-dot-devin` to check `AGENTS.md` and rules coverage.
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
- `global-rules: /update-devin-global-rules` (source: `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`)
- `review-cli: /update-review-cli-then-run` (only if `tools/review-codebase` exists)
- `submodules: open-files-in-web, open-devin-in-web, create-github-pr`
- `shared: shared/` — canonical review/fix boilerplate (`review-fix.md`, `review-rules.md`); skills reference `../shared/*.md` instead of duplicating

### 3. Platform

- `OS: Windows` (global Devin CLI config path `%APPDATA%\devin\skills\`).
- `repo-type: skill collection` (no package manifest at root).
- `runtime: none` (pure Markdown skill definitions; some submodules use Bun or Rust tooling).

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository currently contains **838** top-level skills (~1302 `SKILL.md` on disk including subskills) under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`; domain variants live under `subskills/` and are invoked as `/<parent> <domain>` — lifecycle subskills use prefixes (`setup-`, `config-`, `verify-`, `check-`, `report-`, …) per `update-devin-global-skills/references/subskills-and-subagents.md`. Fix workflows live in `## Fix` sections (`shared/review-fix.md`), not `fix-*` subskills.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `/list-devin-global-skills`.

Core:
- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-subagents: /update-devin-global-subagents` — create/update agents/ aligned with skills (subskill)
- `review-devin-global-harness: /review-devin-global-harness` — review all layers: skills, subagents, hooks, MCP, global rules
- `update-devin: /update-devin [domain]` — routes to `update-devin-global-*` / `update-devin-project-*` / `update-devin-harness` top-level skills
- `git-commit: /git-commit`
- `update-review-cli-then-run: /update-review-cli-then-run`
- `ship: /ship`
- `report: /report`
- `deep-validate: /deep-validate`

Major skill families by current count:
- `follow-*` (238): language, framework, library, tool, service, architecture, and best-practice guides — รวม `follow-single-of-source` (SSOT convention: canonical เดียว ที่อื่น reference) — `follow-reusable` (reuse > extend > extract > create internal code, DRY) — `follow-my-techstack` restored (ใช้ canonical catalog ที่ `review-dependencies/references/techstack-catalog.md`) — domain variants consolidated into `follow-create-*` dispatcher parents (`follow-create-web`, `follow-create-mobile`, `follow-create-plugins`, `follow-create-docker`, `follow-create-product`). `follow-*-architecture` family: pattern guides canonical ใน `/review-architecture` `## Pattern Guides`; apply ผ่าน dispatcher `/follow-architecture` (`packages/` → `/follow-clean-architecture`, `apps/` → `/follow-layered-architecture`).
- `review-*` (62): code review, architecture, security, performance, accessibility, dependencies, quality, DX (`review-dx`), desktop (`review-desktop-app`), browser extension (`review-browser-ext`), IaC (`review-iac`), SDK surface (`review-sdk`), usage parity (`review-usage` — refresh `update-usage-md` ก่อน review), optimization opportunities end-to-end (`review-optimize` — scan → prioritize → `## Fix` apply + before/after), stakeholder roleplay domains (`review-by-stakeholder` รวม persona reviews) — ทุกตัวเป็น top-level skill จริง (extract จาก `deep-review/subskills/*` เดิม) และ review/report-only โดย default พร้อม section `## Fix` ที่มี fix steps + guides ของ domain เมื่อ user confirm; canonical fix skill = `/deep-review-then-fix` (มี Domain Map อ่าน fix guides จาก `review-*/references/`). merged: `usage-md`+`features`→`docs`, `web`→`frontend`, `data-structure`→`algorithm`, `correctness`→`quality`, `readability`→`writing`, `platform`→`deep-review`, `redundancy`+`references`→`devin-global-skills`, `rules`→`dot-devin`, `assets`→`bundle` (`techstack` restored เมื่อ 2026-09 — catalog อยู่ที่ `review-dependencies/references/techstack-catalog.md`); domain `optimize-*` ถูก merge เข้า `review-*` `## Fix` ทั้งหมดแล้ว.
- `check-*` (21): verification, structure, and health checks — dispatchers: `check-files`, `check-secrets`, `check-repo-hygiene`, `check-monorepo`, `check-config-drift`; correctness: `check-content-correctness` (docs/claims vs ground truth), `check-test-correctness` (assertions ตรง spec — ใช้ใน `/review-test` scope `test-correctness`); ast-grep metric check: `check-code-structure` (function/SRP metrics merged → `/review-code-quality` sections); git safety: `check-uncommit`, `check-unpush`; env/ports: `check-open-ports` (pre-run ของ `/run-dev`), `check-long-files`, `check-shell-profile`, `check-my-global-cli`, `check-system-env`, `check-should-update`, `check-merge-conflicts`, `check-git-logs`, `check-bottlenecks`, `check-dts`, `check-reference`; domain check-* อื่นๆ merged เข้า `review-*` domain owners (sections `## Check: <name>` — dispatch ผ่าน scope arg).
- `run-*` (37): test, build, lint, typecheck, format, and deployment runners — `run-test` = unit/fast tests only; `run-test-<domain>` run-only domain runners (`api`, `cli`, `contract`, `e2e`, `integration`, `mutation`, `visual` — deep analysis stays at `/deep-test <domain>`); `run-test-all` orchestrator selects `/run-test` + `/run-test-*` by signals; `run-test-coverage` measures + reports; gap-closing loop delegated to `/review-test coverage` (writes via `/update-tests`) until coverage hits target (default 100% lines/statements/functions/branches); `run-load-test` for perf/load.
- `report-*` (27): reporting, diagrams, and visualization helpers — `report` เป็น format dispatcher (`table`, `html`, `numbered`, `codeblock`); `report-config-drift` merged → `check-config-drift`; `report-review` = alias → `/deep-review`.
- `update-*` (40): repo, skills, docs, config, runtime, version, and test spec maintenance — `update-devin` (devin config dispatcher), `update-docs` (markdown docs dispatcher — VitePress site = `update-vitepress-docs` = update-docs + follow-tool-vitepress), `update-tests` (test spec dispatcher).
- `deep-*` (19): deep analysis, research, debugging, validation, verification, and orchestration — รวม `/deep-test <domain>` (single skill, 8 domains ใน `references/`: api, cli, contract, coverage, e2e, integration, mutation, visual — merged จาก `deep-test-*` เดิม), `/deep-review` (codebase review, report-only) และ `/deep-review-then-fix` (canonical fix skill + Domain Map); alias stubs (forward → canonical): `deep-analyze-by-use-scripts`→`deep-analyze`, `plan`+`deep-plan`→`deep-analyze-and-plan`, `review-then-fix`→`deep-review-then-fix`, `deep-implement-to-production`→`implement-to-production`, `deep-update-project`→`update-project`, `report-review`→`deep-review`, `deep-verify`→`run-verify`, `follow-debugging`→`deep-debug`, `restore`→`restore-files`, `report-schema`→`report-database-schema`, `update-astgrep-rules`→`update-project-rules`; dispatch catalog ครบ `review-*` อยู่ที่ `deep-review/references/review-skills.md`.
- `list-*` (37): inventory, lookup, and listing utilities — dispatchers: `list-devin`, `list-git`, `list-github` route to `list-*-<domain>` top-level skills. `list-x-newkub-reposts` ships a local bun CLI (`scripts/`, `X_BEARER_TOKEN` via `.env`).
- `create-*` (19): project, plugin, bot, report, and diagram scaffolding — dispatchers: `create-cloudflare`, `create-github`.
- `open-*` (15): browser, editor, and terminal integration — `open` dispatcher routes to `open-explorer`, `open-github`, `open-web`, `open-wezterm`, `open-windows-terminal`, `open-zed`; specialized: `open-in-devin`, `open-diff`, `open-files-in-web`, `open-readme-html`, `open-cloudflare-workers`, `open-devin-in-web`, `open-web-dependencies`, `open-web-for-config-secret`.
- `ship-*` (2): `/ship` (entry point — `/update-agents-md` + `/follow-agents-md`; full workflow อยู่ใน `### 8. Ship` ของ `update-agents-md`; swarm mode = Step 4 + `references/swarm-*.md`), `/ship-dont-ask-me`.
- `gen-*` (11): media/artifact/document generation — `gen-media` dispatcher (`ai-images`, `ai-videos`, `image-character`, `3d-model`); รวม `gen-changelog-md`, `gen-openapi`, `gen-postman-collection`, `gen-runbook`, `gen-subtitle-video`, `gen-voice`.
- `cleanup-*` (9): `cleanup` dispatcher routes to `cleanup-artifact` (Rust CLI — build artifacts + dependency caches), `cleanup-branches-merged`, `cleanup-docker`, `cleanup-git-branch`, `cleanup-github-issue`, `cleanup-worktree` top-level skills; plus `cleanup-files-in-project`, `cleanup-files-in-computer`.
- `search-*` (12): `search` dispatcher (`files-patterns`, `github-star`, `mcp`, `npmx`, `project-in-drive-d`, `raindrop`, `similar`, `skills`), `search-by-astgrep`, `search-in-git`, `search-npm-libraries`.
- `improve-*` (2): `improve`, `improve-devin-global-skills` (`improve-test-coverage-to-100` merged → `review-test` subskill).
- `resolve-*` (9): error/CI/issue/conflict resolution — `resolve-errors` (canonical fixer; absorbs `resolve-github-actions-fails`, `resolve-cloudflare-worker-fails`, `resolve-all-cloudflare-fails`), `resolve-cicd` (watcher — watch CI `gh run` + CD `wrangler`/deploys แล้ว dispatch `/resolve-errors`), `resolve-all-cloudflare-worker-fails`, `resolve-cloudflare-worker-fails`, `resolve-github-actions-fails`, `resolve-all-github-actions-fails`, `resolve-github-issue-by-me`, `resolve-github-pr`, `resolve-merge-conflicts`.
- `restore-*` (6): `restore-files` dispatcher routes to `restore-files-deleted-file`, `restore-files-from-devin-history`, `restore-files-from-git-log`, `restore-files-from-my-dotfiles`; `restore` = alias → `/restore-files`.
- `idea-*` (12): `idea` dispatcher + top-level `idea-features`, `idea-improve`, `idea-merge`, `idea-naming`, `idea-review`, `idea-uxui`, `idea-refactor-workspace`, `idea-convert-my-global-cli-to-skills`, `idea-convert-devin-skills-to-mcp`, `idea-devin-global-skills-from-session`, `idea-new-devin-global-skills`.
- `roleplay-*` (1→18 category parents→75 role subskills): `roleplay-by-all-stakeholder` dispatcher → `roleplay-<category> <role>` — categories: product, engineering, quality, user, customer, research, marketing, growth, business, data, operations, finance, legal, content, creative, communication, management, technical (renamed from `roleplay-stakeholder`).
- `merge-*` (4): `merge` dispatcher routes to `merge-all-branch-by-me-to-main`, `merge-git-branch`, `merge-github-pr` top-level skills.
- `convert-*` (6): `convert` dispatcher + `convert-esm`, `convert-files-format`, `convert-git-submodules`, `convert-scripts`, `convert-svg`.
- `delete-*` (7): `delete` dispatcher (generic safe file/folder delete) routes domain deletes to `delete-cicd-fails`, `delete-git-branch`, `delete-git-submodules`, `delete-git-worktree`, `delete-projects`, `delete-project-temp` (ลบ `.devin/temp/` ทั้งหมด — report/plan artifacts).
- `learn-*` (7): `learn` dispatcher (`by-slide`, `from-codebase`, `from-web`, `pattern`), `learn-by-slide`, `learn-from-codebase`, `learn-from-web`, `learn-pattern`, `learn-from-references` (merged `cli`, `web`, `references`), `learn-from-references-and-update-devin-global-skills` = composite (learn → update global skills).
- `git-*` (19): `git-commit` (`at-devin-global-skills`, `no-verify`, `selected-files` ใน subskills); `git-commit-and-push` = top-level skill จริง; `git-push`, `git-file-history`, `git-revert` (ย้อน committed change ด้วย inverse commit), `git-restore` (discard/unstage/กู้จาก HEAD — route จาก `/restore-files` domain `uncommitted`); เพิ่ม `git-stash`, `git-rebase`, `git-cherry-pick`, `git-bisect`, `git-tag`, `git-branch`, `git-reset`, `git-amend`, `git-clean`, `git-worktree`, `git-submodule`, `git-sync` — safety-first workflows สำหรับ git operations ที่มี gotchas (destructive flags ต้อง confirm/dry-run, pushed history ห้าม rewrite). batch ops ใน drive D: `commit-all-projects-in-drive-d` (`/check-uncommit` → `/git-commit` ต่อ repo), `push-all-projects-in-drive-d` (`/check-unpush` → `/git-push` ต่อ repo — ห้าม force).
- `watch-*` (11): browser watching + `watch-browser` dispatcher (`fix`, `improve-uxui`, `test`); `watch-browser-and-*` = combined-flow variants ของ `watch-browser-*`; รวม `watch-browser-console`, `watch-all-task`, `watch-deploy`, `watch-release`, `watch-terminal`.

Other prefixes: `all-*`, `analyze-*`, `ask-*`, `assume-*`, `at-*`, `bench-*`, `capture-*`, `cleanup-*`, `compare-*`, `convert-*`, `delete-*`, `deploy-*`, `dont-*`, `download-*`, `draw-*`, `edit-*`, `explain`, `explore-*`, `fix`, `from-*`, `gen-*`, `grouping`, `how-to-works`, `idea-*`, `implement-*`, `keepup-*` (`keepup-source-code` — staleness detector dispatching to `update-*` domains), `review-then-fix`, `learn-*`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `productionize-*`, `record-*`, `refactor*` (dispatcher `/refactor` + `refactor-workspace`, `refactor-to-packages-shared`, `refactor-commit`), `relocate-*`, `rename-*`, `re-answer`, `research-setup`, `resolve-*`, `restore-*`, `save-*`, `scan-*`, `search-*`, `set-*`, `setup-*`, `suggest-*`, `summarize-*`, `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `use-*` (รวม `use-lib-effective` restored — ใช้ dep ที่มี/catalog แทน reinvent; wired เข้า `/refactor`, `/implement-to-production`), `view-*`, `watch-*`, `write-*`.

### 6. Workspaces

- Not a package monorepo: single root workspace (`%APPDATA%\devin\skills\`).
- Git submodules: `open-files-in-web`, `open-devin-in-web`, `create-github-pr`.

### 7. Subagents

- Use `/update-devin-global-subagents` or `/use-subagents` when there are independent subtasks across multiple workspaces or large skill families.
- Each subagent receives: workspace path, manifest, and target deliverable.
- Merge subagent results before writing the root `AGENTS.md`.

### 8. Safety

- Do not edit another skill's `SKILL.md` without explicit command.
- Do not delete or move skill directories without a dry run.
- Dry run before destructive actions.

### 9. Ship

- Use `/ship` for the release workflow.
- Follow project conventions and validation before release.

## MCP Servers

Read-only MCP servers (Rust + rmcp) live at `D:/newkub/devin-mcp` and are registered in `%APPDATA%\devin\mcp_config.json`:

| Server | Covers skills |
|--------|---------------|
| `devin-git-mcp` | `check-merge-conflicts`, `check-uncommit`, `check-unpush`, `list-git-*`, `git-file-history`, `check-git-logs` |
| `devin-sys-env-mcp` | `check-system-env`, `list-computer-info`, `list-program-in-computer` |
| `devin-code-metrics-mcp` | `check-long-files`, `check-dts`, `check-code-structure`, `list-workspaces` |

Prefer `mcp_call_tool` over re-running the skill workflow when only the structured data is needed.

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines.
- Every skill reference exists.
- Changes are committed with a clear next action.
- Subagents can read `AGENTS.md` and execute the listed steps.
