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
  - deep-review
  - review-devin-global-harness
  - git-commit
  - update-review-cli-then-run
  - ship-to-dev-branch
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

1. Run `/ship-verify` — canonical gate (`/deep-review` incl. domain `review-dot-devin`, `/review-devin-global-harness`, `/deep-validate`, `/run-check`, `/update-tests` + `/run-test all`, `/run-dev`, `/test-usage`; skip non-applicable gates with reason).
2. Run `/ship-to-dev-branch` to ship changes to `dev`.
3. Run `/report` to summarize results.

## Rules

### 1. Format

- Use frontmatter `name`, `description`, `related`.
- Section order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`.
- Keep the file under 250 lines.
- Use backticks for `tools`, `commands`, `paths`, and `skill-name`.
- If a skill has `references/`, write it according to `update-devin-global-skills` (`## Conventions → Write References`).

### 2. Architecture

- `repo-type: skill collection` (no root package manifest; skills are Markdown docs with optional code).
- `git: /follow-tool-git`
- `github: /follow-github`
- `skill-format: /update-devin-global-skills` for create and update
- `global-rules: /update-devin-harness` (source: `C:\Users\Veerapong\.codeium\windsurf\memories\global_rules.md`)
- `review-cli: /update-review-cli-then-run` (only if `tools/review-codebase` exists)
- `submodules: open-files-in-web, open-devin-in-web, create-github-pr`
- `deep-review/SKILL.md` — canonical review/fix boilerplate + review-domain catalogs inlined (`## Fix`, `## Review Rules`, `## Domain Pipeline`, `## Domain Guides`, `## Pattern Guides`); `follow-my-techstack/references/techstack-catalog.md` — canonical tech catalog; ไม่มี `shared/` ที่ repo root แล้ว

### 3. Platform

- `OS: Windows` (global Devin CLI config path `%APPDATA%\devin\skills\`).
- `repo-type: skill collection` (no package manifest at root).
- `runtime: none` (pure Markdown skill definitions; some submodules use Bun or Rust tooling).

### 4. Target User

- `primary: Devin CLI / Cascade / Windsurf AI agents`
- `secondary: human maintainers of Devin skills and project rules`

### 5. Skills

The repository currently contains **828** top-level skills (~999 `SKILL.md` on disk including workflows) under `%APPDATA%\devin\skills\`. Each skill is a folder with a `SKILL.md` file and an optional `README.md`. Invoke a skill with `/<skill-name>`; domain variants live under `workflows/` and are invoked as `/<parent> <domain>` — lifecycle workflows use prefixes (`setup-`, `config-`, `verify-`, `check-`, `report-`, …) per `update-devin-global-skills` (`## Conventions → Workflows And Subagents`). Fix workflows live in `## Fix` sections (`deep-review/SKILL.md`), not `fix-*` workflows.

For the full current index, run `git ls-files -- '*/SKILL.md'` or invoke `/list-devin-global-skills`.

Core:
- `update-agents-md: /update-agents-md`
- `follow-agents-md: /follow-agents-md`
- `update-devin-global-skills: /update-devin-global-skills`
- `update-devin-global-subagents: /update-devin-global-subagents` — create/update agents/ aligned with skills (workflow)
- `review-devin-global-harness: /review-devin-global-harness` — review all layers: skills, subagents, hooks, MCP, global rules
- `update-devin: /update-devin [domain]` — routes to `update-devin-global-*` / `update-devin-project-*` / `update-devin-harness` top-level skills
- `git-commit: /git-commit`
- `update-review-cli-then-run: /update-review-cli-then-run`
- `ship: /ship-to-dev-branch`
- `report: /report`
- `deep-validate: /deep-validate`

Major skill families by current count:
- `follow-*` (263): language, framework, library, tool, service, architecture, and best-practice guides — รวม `follow-tool-e2e` (e2e.tester.army — agentic E2E testing web/mobile: `agent.act`/`assert`/`extract` + `screen` locators + replay cache), `follow-tool-deepsec` (deepsec.sh — AI security scan pipeline, `.deepsec/` workspace, resume-able, sandboxed), `follow-lib-workflow-sdk` (Vercel Workflow SDK — `"use workflow"`/`"use step"` durable functions, Worlds adapters) — รวม `follow-lib-tanstack-ecosystem` (TanStack dispatcher — 18 lib-specific skills `follow-lib-tanstack-{start,router,query,db,store,ai,table,form,charts,markdown,highlight,virtual,pacer,hotkeys,devtools,cli,intent,config}` promoted จาก workflows เดิม) — รวม `follow-single-of-source` (SSOT convention: canonical เดียว ที่อื่น reference) — `follow-reusable` (reuse > extend > extract > create internal code, DRY) — `follow-my-techstack` restored (ใช้ canonical catalog ที่ `follow-my-techstack/references/techstack-catalog.md`) — domain variants consolidated into `follow-create-*` dispatcher parents (`follow-create-web`, `follow-create-mobile`, `follow-create-plugins`, `follow-create-docker`, `follow-create-product`). WebMCP (page-provided agent tools ผ่าน `document.modelContext`) implement ด้วย `/follow-create-web-mcp` — producer side; consume ผ่าน `agent-browser webmcp` ที่ `/use-agent-browser`; review อยู่ใน `/deep-review` `### WebMCP` (domains `review-frontend`/`review-mcp`). Architecture pattern dispatch อยู่ที่ `/follow-architecture` (merged entry — หลาย `apps/*` unified + `packages/`/`crates/` → `### Pattern: Clean` inline (merged จาก `/follow-clean-arch` เดิม), app เดียว → `### Pattern: Layered` inline = flat type-grouped folders, merged จาก `/follow-layered-arch` เดิม); canonical file structures + layer tables: Clean → `follow-architecture/templates/file-structure-clean.md` (modules มี `usecases/` optional), Layered → `follow-architecture/templates/file-structure-layered.md`; stack-specific templates live inside their owner skills (`follow-tool-vite`, `follow-create-web-{nuxt,svelte,nextjs}`, `follow-solid-framework`, `follow-create-{cli,plugins,sdk}`, `follow-tool-tsdown`) ใต้ `templates/file-structure-*.md`; pattern guides canonical ใน `deep-review/SKILL.md` `## Pattern Guides` (domain `review-architecture`); mixed concerns แยกด้วย `/refactor` `### /separate-of-concerns` (merged); apply ผ่าน `/refactor` architecture scope step 5. `follow-lib-*`/`follow-tool-*` ทุกตัวต้องมี `best-practices/` (flat `.md` — recommended patterns/pitfalls เขียนจริงจาก research; canonical spec ใน `update-devin-global-skills` `## Conventions → Write References`).
- `review-*` (6): domain review skills ทั้งหมด (56 domains: architecture, quality, security, performance, accessibility, dependencies, database, frontend, backend, docs, seo, i18n, dx, coverage, test, และอื่นๆ) ถูก merge inline เข้า `/deep-review` `## Review Domains` แล้ว — เหลือ top-level เฉพาะ `review-devin-global-harness` (harness linter tooling), `review-github-pr`, `review-github-issue` (GitHub-meta reviews — deep-review ยกเว้นอยู่แล้ว), `review-test`/`review-issue` (thin entry → `deep-review` domains), `review-by-all-stakeholder` (stakeholder/persona review dispatcher — 18 categories × 75 roles ใน `references/<category>.md`, renamed จาก `roleplay-by-all-stakeholder`); pipeline/priority catalog อยู่ที่ `deep-review/SKILL.md`; canonical fix skill = `/deep-review-then-fix`; techstack catalog อยู่ที่ `follow-my-techstack/references/techstack-catalog.md`.
- `check-*` (20): verification, structure, and health checks — dispatchers: `check-secrets`, `check-monorepo`; `check-skills-structure` (Bun CLI single command — structure inventory bullet list: frontmatter, references, workflows, subagents, src, MCP, website + findings); correctness: `check-reference` (docs/claims vs ground truth — absorbs `check-content-correctness`), `check-test-correctness` (assertions ตรง spec — ใช้ใน `/deep-review` domain `review-test` scope `test-correctness`); ast-grep metric check: `check-code-structure` (function/SRP metrics merged → `/deep-review` domain `review-code-quality`); git safety: `check-uncommit`, `check-unpush`; env/ports: `check-open-ports` (pre-run ของ `/run-dev`), `check-long-files`, `check-shell-profile`, `check-my-global-cli`, `check-system-env`, `check-should-update`, `check-merge-conflicts`, `check-git-logs`, `check-reference`, `check-types-definition` (type/API surface → CLI table: name/type/options/default/comment — TS `.d.ts`, Rust), `check-file-relation` (import graph + concat ทุกไฟล์/เฉพาะ related เป็น output เดียว — Rust CLI `cargo build --release`, engine ของ `/read-all-files`); repo-hygiene checks (`unused`, `circular`, `dead-link`) → canonical tools `/follow-tool-knip` + `/follow-tool-madge`; bottleneck hunting → `/deep-optimize`/`/run-profiler`; domain check-* อื่นๆ merged เข้า `/deep-review` domain sections (`## Check: <name>` — dispatch ผ่าน scope arg).
- `run-*` (29): test, build, lint, typecheck, format, and deployment runners — `run-test [domain]` = test dispatcher → `test-*` family (18 skills — `test-unit` default, `test-{api,cli,contract,coverage,e2e,integration,mutation,visual}` per domain, `test-load` perf/load, `test-smoke` post-build/deploy sanity gate, `test-component` DOM-isolated component tests, `test-a11y` WCAG/axe, `test-website` real-browser click-through ทุก route — tool selection: `/use-agent-browser` default, `/use-playwriter` เมื่อต้อง login state, `/use-chrome-devtools` inspect เมื่อ fail + promote invariants → `/follow-tool-playwright`/`/follow-tool-e2e`, `test-usage` docs usage verification + test-* domain dispatch (บังคับก่อนจบทุกงานตาม global rules `## 3. Test Usage Always`), `test-property` property-based+fuzz, `test-database` ephemeral DB/migrations, `test-mobile` device/emulator, `test-all` orchestrator เลือก domains จาก signals + coverage gap-closing loop ผ่าน `/deep-review`+`/update-tests` ถึงเป้า default 100%); `run-load-test` = alias → `/test-load`; deep analysis stays at `/deep-test <domain>`; `run-bench-deps` = dependency comparison table (installed/latest/status/bundle/downloads) — report-only; domain callers wired → `follow-create-{cli,mobile,web,sdk}`+`follow-solid-framework`/`implement-features-to-mvp` → domain `test-*` (`test-cli`,`test-mobile`,`test-component`,`test-api`,`test-contract`,`test-unit`,`test-e2e`), `improve-*`/`optimize-*` → `test-{api,cli,contract,database,a11y,visual,integration,coverage,mutation,property,load}`, ship/deploy (`ship-verify`,`run-deploy`,`watch-deploy`) → `test-smoke`, `watch-browser-and-test` → `test-website`/`test-e2e`, `deep-review-then-fix` re-run → `/run-test <domain>`
- `report-*` (30): reporting, diagrams, and visualization helpers — `report` มี format details (`table`, `html`, `numbered`, `codeblock`) merged ใน `## Merged Details`; `report-config-drift` merged → `/deep-review` domain `review-config`; `report-review` = alias → `/deep-review`; `report-html` restored (single-file interactive HTML report); `report-readme-html` (README → HTML report ใน temp, เปิดผ่าน `/open-web` — replaces `open-readme-html`); `report-slides` (Slidev slide report ใน `.devin/temp/` — renamed จาก `learn-by-slide`).
- `update-*` (37): repo, skills, docs, config, runtime, version, and test spec maintenance — `update-devin` (devin config dispatcher), `update-docs` (markdown docs dispatcher — VitePress site = `update-vitepress-docs` = update-docs + follow-tool-vitepress), `update-tests` (test spec dispatcher).
- `deep-*` (19): deep analysis, research, debugging, validation, verification, and orchestration — รวม `deep-analyze-and-report` (วิเคราะห์หลายมิติแล้วออกรายงาน artifact — compare 2 targets ได้), `/deep-test <domain>` (single skill, 8 domains ใน `references/`: api, cli, contract, coverage, e2e, integration, mutation, visual — merged จาก `deep-test-*` เดิม), `/deep-optimize` (subagent fan-out ทุก dimension หา optimization opportunities — ใช้ใน `/ship-to-dev-branch` Validate), `/deep-review` (codebase review, report-only) และ `/deep-review-then-fix` (canonical fix skill + Domain Map); alias stubs (forward → canonical): `deep-plan`→`create-plan-in-dot-devin`, `deep-analyze-and-plan`→`create-plan-in-dot-devin`, `plan`→`create-plan-in-dot-devin` (canonical analyze+plan = `/create-plan-in-dot-devin` — merged `deep-plan` + `deep-analyze-and-plan`; คง `chat-only` hint สำหรับ caller ที่ไม่ต้องการ plan file เช่น `/bench-competitors`), `deep-analyze-by-use-scripts`→`deep-analyze`, `deep-update-project`→`update-project`, `report-review`→`deep-review`, `deep-verify`→`run-verify`, `follow-debugging`→`deep-debug`, `restore`→`restore-files`, `report-schema`→`report-database-schema`; dispatch catalog ครบ review domains อยู่ที่ `deep-review/SKILL.md`.
- `list-*` (38): inventory, lookup, and listing utilities — dispatchers: `list-devin`, `list-git`, `list-github` route to `list-*-<domain>` top-level skills. `list-x-newkub-reposts` ships a local bun CLI (`scripts/`, `X_BEARER_TOKEN` via `.env`).
- `create-*` (21): project, plugin, bot, report, and diagram scaffolding — `create-plan-in-dot-devin` = canonical analyze+plan (persist `.devin/temp/plan/<workspace>/` — merged `deep-plan`+`deep-analyze-and-plan`; บังคับก่อน bulk work ตาม global rules `## 2. Plan Before Bulk Work`; wired เข้า `/idea-features`, `/improve-features`, `/refactor`, `/implement-to-production`, `/follow-agents-md`, `/update-readme-md`; เรียก `/update-gitignore` ให้ ignore `.devin/temp`); dispatchers: `create-cloudflare`, `create-github`; video creation: `create-video-with-slidev` (Slidev deck → visual interactive transition video ผ่าน slidev MCP + `/record-video-web-with-agents-browser`), `create-video-story`, `create-programatic-video-with-fframes`.
- `open-*` (12): browser, editor, and terminal integration — top-level skills โดยตรง: `open-in-explorer`, `open-github`, `open-web`, `open-wezterm`, `open-in-zed`, `open-in-devin`, `open-diff`, `open-files-in-web`, `open-cloudflare-workers`, `open-devin-in-web`, `open-web-dependencies`, `open-web-for-config-secret` (`open` dispatcher และ `open-readme-html` ถูกลบ — readme report → `/report-readme-html`).
- `ship-*` (5): `/ship-verify` (canonical verify gate — `/follow-agents-md` → `/deep-review` → `/deep-validate` → `/run-check` → `/update-tests` + `/run-test all` → `/run-dev` + `/test-usage`; verify only ไม่ push), `/ship-run` (`/ship-verify` → `/run-dev` เปิด dev server ค้างไว้ใช้งานจริง ไม่ push), `/ship-to-dev-branch` (`/ship-verify` → `/git-commit-and-push` เข้า `dev` เท่านั้น ไม่แตะ main), `/ship-to-main-branch` (`/ship-to-dev-branch` → `/review-github-pr` gate (CI+`/deep-validate`+`/deep-review`) → `/merge-all-branch-by-me-to-main`), `/ship-release` (`/ship-to-main-branch` → `/run-release` → poll registry/tag + `/watch-deploy`). `/ship` alias ถูกลบ — ใช้ `/ship-to-dev-branch` โดยตรง.
- `gen-*` (10): media/artifact/document generation — `gen-media` dispatcher (`ai-images`, `ai-videos`, `image-character`, `3d-model`); รวม `gen-changelog-md`, `gen-postman-collection`, `gen-runbook`, `gen-subtitle-video`, `gen-voice`.
- `cleanup-*` (8): `cleanup` dispatcher routes to `cleanup-artifact` (Rust CLI — build artifacts + dependency caches), `cleanup-branches-merged`, `cleanup-docker`, `cleanup-git-branch`, `cleanup-github-issue`, `cleanup-worktree` top-level skills; plus `cleanup-files-in-project`, `cleanup-files-in-computer`.
- `search-*` (12): `search` dispatcher (`files-patterns`, `github-star`, `mcp`, `npmx`, `project-in-drive-d`, `raindrop`, `similar`, `skills`), `search-with-astgrep`, `search-in-git`, `search-npm-libraries`.
- `improve-*`/`optimize-*` (80): `improve` thin entry + `improve-devin-global-skills` orchestrator + domain variants เป็น thin entry → `/deep-review` domain → `/deep-review-then-fix` — ยกเว้น `improve-coverage` (renamed จาก `follow-coverage` — gap-filling implementer ที่เติม content/skill/code coverage โดยตรง ไม่ใช่ thin entry; แยกจาก `improve-tests` ที่คุม test coverage ผ่าน `review-test`+`review-coverage` domains) (`improve-features` — renamed จาก `improve-features-gaps`; core business เท่านั้น (extends/gaps), net-new + platform → `/idea-features`; `improve-techstack` renamed จาก `improve-tech-stack`; wiring: `improve-web`→`/improve-seo`, `improve-docs`→`/improve-writing`, `improve-code-quality`→`/improve-error-handling`, `improve-consistency`→review-alignment+review-redundancy+review-code-quality+review-writing, `improve-code-quality`→`/improve-correctness` สำหรับ correctness findings; `improve-rbac`→review-auth (authz) + review-frontend (role-based UI), `improve-form`→review-frontend+review-data-validation+review-accessibility, `improve-data-validation`→review-data-validation (เจาะ validation ของ `improve-data`), domain variants ตาม review domains: `improve-a11y`→review-accessibility, `improve-observability`→review-observability, `improve-backend`→review-backend, `improve-i18n`→review-i18n, `improve-iac`→review-iac, `improve-events`→review-events, `improve-compliance`→review-compliance, `improve-business`→review-business, `improve-release`→review-release, `improve-deps`→review-dependencies; fix routing ครบอยู่ใน `deep-review-then-fix` `## Domain Map`; +`improve-{realtime,queues,rate-limiting,onboarding,billing,notifications,scalability,resilience,monorepo,privacy,graphql}` +`optimize-{web-vitals,api-latency,cache,test-suite,concurrency,mobile,storage,images}`).
- `resolve-*` (9): error/CI/issue/conflict resolution — `resolve-errors` (canonical fixer; absorbs `resolve-github-actions-fails`, `resolve-cloudflare-worker-fails`, `resolve-all-cloudflare-fails`), `resolve-cicd` (watcher — watch CI `gh run` + CD `wrangler`/deploys แล้ว dispatch `/resolve-errors`), `resolve-all-cloudflare-worker-fails`, `resolve-cloudflare-worker-fails`, `resolve-github-actions-fails`, `resolve-all-github-actions-fails`, `resolve-github-issue-by-me`, `resolve-github-pr`, `resolve-merge-conflicts`.
- `restore-*` (5): `restore-files` dispatcher routes to `restore-files-deleted-file`, `restore-files-from-devin-history`, `restore-files-from-git-log`, `restore-files-from-my-dotfiles`; `restore` = alias → `/restore-files`.
- `idea-*` (13): `idea` dispatcher + top-level `idea-features` (extends + net-new + platform — merged `idea-new-features` + platform group ของ `improve-features`), `idea-improve`, `idea-merge`, `idea-grouping`, `idea-naming`, `idea-review`, `idea-uxui`, `idea-refactor-workspace`, `idea-convert-my-global-cli-to-skills`, `idea-convert-devin-skills-to-mcp`, `idea-devin-global-skills-from-session`, `idea-new-devin-global-skills`.
- `merge-*` (2): `merge` dispatcher routes to `merge-all-branch-by-me-to-main`, `merge-github-pr` top-level skills (`merge-git-branch` ถูกลบ — ใช้ `git merge` โดยตรง).
- `convert-*` (7): `convert` dispatcher + `convert-esm`, `convert-files-format`, `convert-git-submodules`, `convert-scripts`, `convert-svg`, `convert-to-lang-en`, `convert-to-lang-th` (session report language — renamed จาก `translate-to-lang-*`).
- `delete-*` (6): `delete` = alias → `/apply` mode `delete` (generic safe file/folder delete — dry-run + confirm + update references); `apply` = canonical merged (`choose-and-apply`+`delete` → alias stubs → `/apply`; `validate-then-apply` ถูกลบ — ใช้ `/apply` mode `validate` โดยตรง); domain deletes stay top-level: `delete-cicd-fails`, `delete-git-branch`, `delete-git-submodules`, `delete-git-worktree`, `delete-projects`, `delete-project-temp` (ลบ `.devin/temp/` ทั้งหมด — report/plan artifacts).
- `learn-*` (5): `learn` dispatcher (`from-cli`, `from-codebase`, `from-web`, `pattern`, `from-references-and-improve-skills`), `learn-from-cli` (command surface จาก binary จริง), `learn-from-codebase`, `learn-from-web` (official docs/DeepWiki/Context7), `learn-pattern`, `learn-from-references-and-improve-skills` (เรียนจาก refs แล้ว sync ความรู้เข้า skills — แก้ stale/wrong/missing + `/improve-coverage` เติม gaps; ต่างจาก `learn-from-references*` เดิมที่ split เป็น `from-web`/`from-cli` เพราะตัวนี้เขียนกลับเข้า skills), (`from-dts` renamed → `check-types-definition`), write-references อยู่ใน `update-devin-global-skills` (`## Conventions → Write References`).
- `git-*` (19): `git-commit` (`at-devin-global-skills`, `no-verify`, `selected-files`, `commit-quality` merged ใน `## Merged Details`); `git-commit-at-devin-global-skills` = top-level alias → `/git-commit at-devin-global-skills`; `git-commit-and-push` = top-level skill จริง; `git-push`, `git-file-history`, `git-revert` (ย้อน committed change ด้วย inverse commit), `git-restore` (discard/unstage/กู้จาก HEAD — route จาก `/restore-files` domain `uncommitted`); เพิ่ม `git-stash`, `git-rebase`, `git-cherry-pick`, `git-bisect`, `git-tag`, `git-branch`, `git-reset`, `git-amend`, `git-clean`, `git-worktree`, `git-submodule`, `git-sync` — safety-first workflows สำหรับ git operations ที่มี gotchas (destructive flags ต้อง confirm/dry-run, pushed history ห้าม rewrite). batch ops ใน drive D: `commit-all-projects-in-drive-d` (`/check-uncommit` → `/git-commit` ต่อ repo), `push-all-projects-in-drive-d` (`/check-unpush` → `/git-push` ต่อ repo — ห้าม force).
- `watch-*` (6): browser watching + `watch-browser` dispatcher (`fix` → `/watch-browser-and-fix`, `uxui` → `/deep-review` (domain `review-uxui`), `test`); `watch-browser-and-fix` = canonical merged (watch + console monitor + fix — merged จาก `watch-browser-fix`/`watch-browser-console`), `watch-browser-test` merged เข้า `watch-browser-and-test` แล้ว (canonical); รวม `watch-deploy`, `watch-terminal`. Browser tooling: canonical selection matrix อยู่ที่ `/use-chrome-devtools` `## Tool Selection` — `chrome-devtools-mcp` สำหรับ inspect/debug (console, network, CSS, perf, memory, Lighthouse — ไม่ต้อง install), `agent-browser` สำหรับ automation/record/PDF/batch/multi-session.

Other prefixes: `all-*`, `analyze-*`, `ask-*`, `assume-*`, `at-*`, `bench-*`, `capture-*`, `cleanup-*`, `compare-*`, `convert-*`, `delete-*`, `deploy-*`, `design-*` (`design-prototype-in-html` single-file HTML prototype, `design-cli-prototype` SolidJS+Vite+UnoCSS CLI explorer prototype ใน temp — human/agent modes จาก typed Command schema), `dont-*`, `download-*`, `draw-*`, `edit-*`, `explain`, `explore-*`, `fix`, `from-*`, `gen-*`, `grouping`, `idea-*`, `implement-*`, `improve-*`/`optimize-*` (`improve` thin entry → `/deep-review` domain findings → `/deep-review-then-fix`; domain variants: `improve-features` (merged `improve-features-platform` — core business: review-gaps+review-uxui+review-business (platform domains ย้ายไป `/idea-features`), merged `setup-feature-flags` — core business extends/gaps เท่านั้น, net-new + platform → `/idea-features`; fix pipeline มี `/refactor-to-srp`), `improve-security` (review-security), `improve-data` (review-data-validation — validation/integrity), `improve-database` (review-database — ORM/query perf), `improve-cli` (review-cli), `improve-web` (review-seo→`/improve-seo`+review-frontend), `improve-docs` (review-docs + writing→`/improve-writing`), `improve-dx` (review-dx+review-bundle), `improve-uxui` (review-uxui+review-accessibility+review-mobile), `improve-code-quality` (review-code-quality+review-redundancy + error-handling→`/improve-error-handling`), `improve-consistency` (review-alignment+review-redundancy+review-code-quality+review-writing — naming/pattern/style/layer sync), `improve-correctness` (review-code-quality+review-data-validation+review-test scope correctness — bugs/logic errors + regression tests), `improve-api` (review-api+review-backend), `improve-techstack` (review-techstack+review-dependencies — renamed จาก `improve-tech-stack`), `improve-config` (review-config), `improve-tests` (review-test+review-coverage), `improve-astgrep-rules` (ast-grep ruleset review → `/update-astgrep-rules` fix), `improve-{auth,ai,algorithm,browser-extensions,delivery,desktop-app,dot-devin,mcp,mobile-app,platform,sdk,seo,stability,usage,writing,error-handling}` (thin entries → review domain ตามชื่อ), `improve-service-integrations` (review-api+review-stability+review-security — external APIs/webhooks/retries/credentials), `optimize-perf` (review-performance), `optimize-build` (review-bundle — build speed), `optimize-cost` (review-cost), `optimize-memory` (review-performance scope memory), `optimize-bundle` (review-bundle — output size/chunks/tree-shaking), `optimize-docker` (image size/layers/cache — guided workflow อยู่ที่ `follow-create-docker/workflows/optimize-image`), `optimize-ci` (review-delivery — pipeline speed/cache/parallelism), `optimize-queries` (review-database — N+1/indexes/EXPLAIN), `optimize-network` (review-performance scope network — payloads/headers/waterfalls), `optimize-startup` (review-performance scope startup — cold start/boot) — convention `/follow-optimize`; fix routing `deep-review-then-fix` `## Domain Map`, `improve-devin-global-skills` orchestrator; `review-test` top-level = thin entry → ``deep-review/SKILL.md` (domain `review-test`)`), `keepup-*` (`keepup-source-code` — staleness detector dispatching to `update-*` domains), `learn-*`, `loop-*`, `merge-*`, `more-*`, `move-*`, `plan`, `prepare-*`, `read-*`, `productionize-*`, `record-*`, `refactor*` (dispatcher `/refactor` — รวม `### /separate-of-concerns` merged; `### /refactor-to-srp` + `### /restructure` merged (canonical SRP splitter — global rules บังคับทุก create/update task) — + `refactor-skills` (restructure skill packages ตาม `update-devin-global-skills` conventions), `refactor-workspace`, `refactor-all-files-in-workspace`, `refactor-all-workspace`, `refactor-to-packages-shared`, `refactor-commit`), `relocate-*`, `rename-*`, `re-answer`, `research-*` (`research-setup`/`research-dependencies`/`research-api-references` = alias stubs → `/deep-research <domain>`; `research-setup-integrations` = top-level — plugins/extensions/providers จาก official sources), `resolve-*`, `restore-*`, `save-*`, `scan-*`, `search-*`, `set-*`, `setup-*`, `simplify` (condense verbosity/redundancy, identical behavior — boundary vs `/refactor` restructuring), `suggest-*`, `summarize-*`, `sync-*`, `test-*`, `translate-*`, `try-*`, `understand-*`, `uninstall-*`, `use-*` (รวม `use-lib-effective` restored — ใช้ dep ที่มี/catalog แทน reinvent; wired เข้า `/refactor`, `/implement-to-production`), `view-*`, `watch-*`, `write-*`.

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

- Use `/ship-to-dev-branch` for the release workflow.
- Follow project conventions and validation before release.

## Expected Outcome

- `AGENTS.md` follows Devin CLI standards and stays under 250 lines.
- Every skill reference exists.
- Changes are committed with a clear next action.
- Subagents can read `AGENTS.md` and execute the listed steps.
