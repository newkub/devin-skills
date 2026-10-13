---
name: deep-review
description: Run every review-* domain and report into `.devin/temp/report/<workspace>/` (report only)
argument-hint: "[path-or-target] [--diff] [--deep]"
related:
  - run-review
  - update-review-cli-then-run
  - deep-review-then-fix
  - create-report-in-dot-devin
  - use-subagents
  - follow-parallel
  - follow-deep
  - list-workspaces
  - follow-monorepo
  - use-scripts
  - review
  - report
  - suggest-next-action
  - check-code-structure

---

## Goal

Use the `tools/review-codebase` CLI to run a review covering every dimension of the codebase, then analyze results, prioritize findings, and route them to the suitable review/deep-review-then-fix — deepest analysis with few tokens and minimal time; supports resume if the job is interrupted mid-run

## Scope

Use when a full review of every codebase dimension (architecture, quality, security, performance, delivery, UX/DX) is needed via the `tools/review-codebase` CLI at the project root, without duplicating `/run-review`, which focuses on running the CLI and a brief interpretation of results

Results are reported to `.devin/temp/report/<workspace>/deep-review-<time>.md` via `/create-report-in-dot-devin`, with a section per `review-*` domain — report only, no code changes — to fix findings → `/deep-review-then-fix`

- dispatch catalog: `## Domain Pipeline` below — all review domains + `deep-*` via `/follow-deep` per phase per workspace
- domain reviews: all `review-*` are named domains in `## Review Domains` below (56 domains) — the checklists/SSOT knowledge live in `## Domain Guides` + `## Pattern Guides` + `## Fix` + `## Review Rules` of this file; except `/review-devin-global-harness`, `/review-github-pr`, `/review-github-issue`, which remain top-level skills

## Execute

### 0. Manual Pre-Pass

> Goal: check repo health by eye and hand before trusting the analyzer — if you find a CLI/analyzer issue, record it in `update-review-cli-then-run/references/known-issues.md`

1. `git status` + `git diff --stat` — look for uncommitted changes, unusually large files, and generated files that slipped in
2. Spot-read the 2-3 largest or most recently changed files — check what the analyzer should have seen (to interpret results)
3. Check the previous `reports/review-report.json`: its timestamp must be newer than the latest source file, otherwise the report is stale — always run the formatter (`biome check --write`) first because the analyzer reads the live fs while running
4. If you spot abnormal CLI/analyzer behavior (stale scan, false positive, crash under load) → write the issue + evidence + workaround into `update-review-cli-then-run/references/known-issues.md` (single source — `run-review` is an alias) before continuing

### 1. Parse Target And Budget

> Goal: turn arguments into scope + mode + budget before running — an unbounded run is a run that dies midway

1. `[path-or-target]` — if given: limit scope to that workspace/path; if omitted = full repo
2. `--diff` — incremental mode: review only files changed per `git diff` (against a baseline commit or HEAD); use for re-review after fixes — one full scan per day/release, use diff otherwise
3. `--deep` — enable Phase 5 (`deep-*` per workspace); if omitted, run Phase 5 only for workspaces with Critical/High findings
4. Set the budget: workspaces ≤ 10 per run (ordered user-facing → shared → tools), subagent dispatches ≤ 30 across all steps — over budget → run only top-priority items and record `skipped (budget)` with reasons in the ledger
5. Create the progress ledger `reports/.deep-review-<time>.ledger.json` — `{dispatched: {skill: {workspace, status: pending|running|done|failed|skipped}}, startedAt}`; update on every dispatch — the ledger allows resume if the session drops

### 2. Prepare And Verify CLI

> Goal: make sure `tools/review-codebase` is ready to run

1. Verify that `tools/review-codebase/package.json` and the entry point exist
2. If missing → run `/update-review-cli-then-run` to create the CLI first; `recommended alternative`: use the `linter` CLI (Rust, `D:\newkub\wpackages\rust-packages\packages\tools\linter`) — all deterministic checks (rules/metrics/secrets/framework packs) + score/grade/baseline/SARIF — it produces the same schema and can drop in for review-report.json
3. Run `bun --filter tools-review-codebase lint` and `typecheck`
4. Run `bun --filter tools-review-codebase review-codebase --help` to confirm the CLI works
5. If the CLI cannot be installed/run → run `/resolve-errors` then retry up to 3 times

### 3. Run Comprehensive Review

> Goal: run the review CLI once, producing a central JSON shared by every domain — never rerun it per domain

1. Run `linter scan --format json` (Rust CLI — recommended) or `bun --filter tools-review-codebase review-codebase:json` (legacy TS) to get `reports/review-report.json` as the single source of truth — in `--diff` mode pass a scope flag the CLI supports (e.g. `--changed`, `--paths`) or filter findings afterwards using the file list from `git diff --name-only`
2. Run the table output only when you need to eyeball it: `bun --filter tools-review-codebase review-codebase` — the table has a domain summary + per-category sub-list (priority, reason, risk, fix skill, evidence items) + status new/existing + delta vs baseline
3. Store score, grade, domain breakdown, findings count, analyzerErrors, falsePositiveRate, hasBaseline, fixedFindings
4. If the CLI crashes → go back to Step 2
5. iterate only the failing parts with `--domain <name>` and `--severity <min>` — no need to full-scan every time

### 4. Validate Output Metrics

> Goal: verify the completeness of results before dispatch — a subagent that fails to parse the JSON is wasted tokens

1. Verify categories ≥ 60 per the 5 domains of the review CLI (spec in `/update-review-cli-then-run`)
2. Verify `score` / `grade` are fully generated
3. Check schema: top-level keys must include `score`, `grade`, `domains`, `findings`, `analyzerErrors`, `falsePositiveRate`, `generatedAt` — any missing key → JSON violates spec → flag as an analyzer issue and go to `/update-review-cli-then-run` before any dispatch
4. Verify every finding has `severity`, `evidence`, `recommendation`, `priority`, `fixSkill`, `risk`, `status` all present
5. If `falsePositiveRate > 20%` or `analyzerErrors > 0` → hand off to `/update-review-cli-then-run` before analyzing
6. Cross-check by hand: any finding's evidence must match the real files (read the referenced file:line) — mismatch → false positive → record in `update-review-cli-then-run/references/known-issues.md`

### 5. Slice Findings And Dispatch Domain Analysis

> Goal: split the JSON into a slice per domain and spawn subagents in parallel — subagents read small files, not the whole report

1. Read `update-review-cli-then-run/references/review-checklist.md`
2. Use `/use-scripts` to write slices to `reports/.deep-review-<time>/findings-<domain>.json` — one domain per file, only that (deterministic, no parsing in the parent's context)
3. Use `/use-subagents` to spawn a domain-review subagent per domain that actually has findings — inputs: `domain`, `workspace-path`, `findings-json` = path of the slice file — output contract: findings table (No., Finding, Severity, Evidence, Action, Owner Skill) + domain summary — report-only, never change code, review only the assigned domain, evidence only from real report/code
4. Subagents read findings directly from the slice file — never rerun the CLI (full scan is expensive) except for domain-specific checks the CLI supports
5. If a domain has ≤ 2 findings → the parent analyzes it itself, no spawn (subagent overhead isn't worth it)
7. On subagent timeout/crash/output-contract parse error → mark `failed` in the ledger and write that domain as `review-failed` with the error into the report — never stay silent (a missing domain looks clean)
8. Merge results from all subagents — record gaps per domain with evidence

### 6. Run Review Domains Per Workspace

> Goal: review every domain (named domains in `## Review Domains` — use the checklists in `## Domain Guides`/`## Pattern Guides` and the pipeline in `## Domain Pipeline`) one workspace at a time by importance, under the Step 1 budget

1. If monorepo → run `/list-workspaces` and order workspaces by importance: user-facing apps → shared packages → tools/infra — follow `/follow-monorepo` conventions; if workspaces > budget → pick the top-N and mark the rest `skipped (budget)` in the ledger
2. Per workspace → run the pipeline in `## Domain Pipeline` in phase order (domain = `review-<name>` in `## Review Domains`):
   - Phase 1 entry: `review-config` → `review-techstack` → `review-architecture` → the rest per condition
   - Phase 2 source code: `review-code-quality`, `review-writing`, `review-cli`/`review-api`/`review-backend`/`review-frontend` etc. per workspace type
   - Phase 3 cross-cutting: `review-security`, `review-performance`, `review-stability` and all other metrics
   - Phase 4 meta: `review-gaps`, `review-by-stakeholder` as needed
   - Phase 5 deep: run `/follow-deep` per workspace when `--deep` is set or that workspace has Critical/High findings — every context-matching `deep-*` (`deep-analyze`, `deep-trace`, `deep-test`, `deep-build`, `deep-impact`, `deep-research`, `deep-validate`, `deep-debug`, `deep-retro`, `deep-thinking`) — plan → `/create-plan-in-dot-devin`
3. Use `/use-subagents` or `/follow-parallel` to run independent reviews in parallel, ≤10 per batch — pass `workspace-path`, `report-json`, and the domains to run
4. Never skip a domain because "there probably isn't a problem" — skip only for clearly N/A conditions (e.g. `review-mobile` in a CLI workspace) or budget — every skip must be in the ledger with a reason
5. If scope is large or unclear → platform dimensions via the domain matching the platform (`review-mobile`, `review-desktop-app`, `review-frontend`, `review-backend` etc.)
6. Use each finding's `fixSkill` field as the canonical owner — no need to remap yourself
7. Any metric/finding the analyzer does not cover → mark `in update-review-cli-then-run = N` as an analyzer gap and hand off to `/update-review-cli-then-run`
8. Update the ledger on every dispatch — skills already done in an old ledger (resume) reuse the previous result, no reruns

### 7. Dedup And Stakeholder Prioritization

> Goal: merge duplicate findings from multiple sources into one set, then rank by impact

1. Dedup findings between the CLI report and review-* outputs — key = `file + rule/message-normalized + domain`; merge matching findings (keep combined evidence + highest severity + more specific fixSkill), not 2 displayed rows
2. Collect findings from all domains — sort mainly by the report's `priority` field (severity → weakest domain)
3. For an engineer/QA perspective → domain `review-by-stakeholder` (`staff-engineer` or `qa-tester`)
4. For a product/user perspective → domain `review-by-stakeholder` (`product-manager` or `user`)
5. Assign a clear owner skill for each action from `fixSkill`

### 8. Report To .devin/Reports

> Goal: report the review results to `.devin/temp/report/<workspace>/` (report only) with a structure that can be read and acted on for fixes immediately, and verify real coverage

1. Run `/report` summarizing score, findings, owner skill, priority
2. Run `/create-report-in-dot-devin` with title `deep-review` — report structure:
   - `## Executive Summary` — overall score (0-100), grade, findings summarized by severity (Critical/High/Medium/Low) and by domain, confidence level, critical issues that must be fixed before production, mode (full/diff) + scope run
   - `## Result` — table of score/grade/findings count before-after per workspace (No. is always the first column)
   - `## Coverage` — matrix from the ledger: rows = workspace, columns = phase/skill group, cell = done/skipped(reason)/failed — makes "every one covered" verifiable rather than just claimed
   - section per `review-*` domain — header with the review skill name + domain score/grade
   - per finding, table columns: `No.`, `Evidence` (file:line or evidence items — mandatory in every row), `Reason` (message — the rule that failed), `Risk` (risk field), `Priority` (priority + status new/existing/fixed/regressed), `fix skill` (fixSkill field), `in update-review-cli-then-run` (`Y` = analyzer already covers it / `N` = analyzer gap → hand off to `/update-review-cli-then-run`)
   - severity symbols: 🔴 Critical, 🟠 High, 🟡 Medium, 🟢 Low — status symbols: ✅ fixed, ❌ not fixed, 🔄 in progress, ⏭️ skipped
   - `## Fix Status` — table Issue, Dimension, Severity, Status, Fix Applied
   - `## Trends` — compare against the baseline snapshot from the previous run (if any): score trajectory per workspace, new/fixed/regressed findings per domain — shows whether the codebase is improving or degrading
   - `## Priority Action Plan` — fix sequence ordered Foundation → Dependencies → High impact → Critical path → High risk with rough effort per item — not a flat TODO list
   - `## Evidence Index` — mapping domain → slice file/JSON path used as the findings source — reviewers can trace evidence back without asking
   - `## Recommendations` — ordered by impact/effort, separating quick wins from strategic fixes
   - `## Residual notes` — accepted analyzer false positives, infra flakes, non-blocking warnings, domains marked `review-failed`/`skipped (budget)` with how to resume
3. If the run is interrupted midway → immediately write a partial report with the coverage matrix as far as available — never lose all the work because the report is incomplete
4. All action items live in `## Priority Action Plan` as a sequence, not a flat TODO — items that block others come first
5. If the CLI supports it → save a baseline snapshot (`review-report.json` becomes the next baseline) so delta/new-vs-fixed works in the next run
6. Verify after writing: the report file exists + every required section is present + every row has evidence — missing → fix the report before finishing
7. Run `/suggest-next-action`, suggesting the matching domain's `## Fix` or `/deep-review-then-fix`

## Rules

### 1. No Duplication

- No overlap with `/run-review` — `run-review` focuses on "run then report results", while `deep-review` focuses on "manual pre-pass + single run + parallel subagent analysis + prioritization + report to `.devin/temp/report/<workspace>/`"
- Report only — write results into the report only, no code changes — to fix findings → `/deep-review-then-fix` in this skill
- If results are short and need no deep analysis → use `/run-review` instead
- Dedup between CLI findings and review-* findings before reporting (see Step 7.1)

### 2. Evidence First

- Every finding must have evidence from `review-report.json` or screenshots — spot-check evidence against real files for at least 1 item per domain with findings
- Do not judge severity from intuition alone
- Check `falsePositiveRate` and `analyzerErrors` before evaluating results

### 3. Efficiency

- Run the CLI full scan once — subagents share findings via slice files, never rerun
- Subagents read only the files flagged in evidence — never sweep the whole codebase
- Up to ~8 evidence items per finding (matching the CLI table output)
- Spawn subagents only for domains with > 2 findings — below that the parent is faster doing it itself
- Re-review after fixes → always use `--diff` mode, not a full scan

### 4. Budget And Resume

- The budget set in Step 1 is a hard cap — over it, mark `skipped (budget)` in the ledger rather than just stopping
- The ledger `reports/.deep-review-<time>.ledger.json` is the single source for resume — a new run pointing to an old ledger = skip work already `done`
- A failed subagent → always `review-failed` in the ledger + report; never let a domain vanish silently
- A partial report beats no report — if interrupted, write the coverage you have (Step 8.3)

### 5. Coverage Dispatch

- Dispatch `review-*` across every domain per workspace per `## Domain Pipeline` — under budget
- Dispatch `deep-*` via `/follow-deep` when `--deep` is set or there are Critical/High findings
- Skip a domain only for clearly N/A conditions or budget — state the reason in the ledger and the `## Coverage` report
- Metrics with `in update-review-cli-then-run = N` → record the analyzer gap, send to `/update-review-cli-then-run`, and reference in `run-review`

### 6. Loop Limit

- If the CLI fails to run, loop back to `/update-review-cli-then-run` up to 3 rounds
- Per-domain subagents retry at most once — a second failure → `review-failed`, then move on to other domains (don't get stuck looping on one domain)
- If `score < 70` or `grade D/F` after 3 rounds → stop and report

### 7. Issue Logging

- When you hit CLI/analyzer problems (crash, false positive, stale scan, spec-violating output, missing schema keys) → write them into `update-review-cli-then-run/references/known-issues.md` (single source — `run-review` is an alias with no separate Known Issues) with evidence + workaround + status (open/fixed)
- If an issue is fixed within the same session → mark `fixed` with the commit/file that fixed it

### 8. Safety

- Do not change business logic directly from this skill
- Do not add new dependencies beyond the CLI workspace
- If `tools/review-codebase` cannot be installed → stop and inform the user
- If the analyzer doesn't cover a finding domain (column `in update-review-cli-then-run` = N) or the CLI has a bug → run `/update-review-cli-then-run` to add/fix the analyzer instead of working around it in the report
- Write ledger/slice files only under `reports/` — never write temp files outside the repo

## Review Domains

Every review domain is a named domain of `/deep-review` — dispatch by domain name from this table; per-domain checklists + shared knowledge live in `## Domain Guides` / `## Pattern Guides` / `## Review Rules` / `## Fix` of this file (merged inline — no separate `workflows/`/`references/` anymore). Phases/ordering follow `## Domain Pipeline`.

| Domain | Details |
|--------|-----------|
| `review-accessibility` | Check accessibility of web pages/components per the WCAG standard |
| `review-ai` | Review the project's AI/LLM integration across every dimension |
| `review-algorithm` | Check algorithms — time/space complexity, data structure choice, correctness, memory/allocation patterns, numeric safety, hot paths (see `### Time Complexity`) |
| `review-alignment` | Check that system layers reference each other correctly and stay in sync |
| `review-api` | Check API design |
| `review-architecture` | Review architecture at the macro level — design patterns, module boundaries, dependency directions, coupling, SOLID, anti-patterns, modularity, isolation, resilience (see `## Pattern Guides`) |
| `review-auth` | Review authentication (authn) and authorization (authz) — identity, sessions, tokens, OAuth, MFA, password policy, RBAC/ABAC, secrets, audit logging, account recovery |
| `review-backend` | Orchestrate backend review covering API, service, database, data flow, data fetching, data validation, integration |
| `review-browser-ext` | Review browser extension (Chrome/Edge/Firefox/Safari) |
| `review-bundle` | Review all production output |
| `review-business` | Review business logic across every dimension with aggregate findings and a review score |
| `review-by-stakeholder` | Review the project from a stakeholder's perspective |
| `review-cli` | In-depth review of the CLI/TUI application |
| `review-code-quality` | Review code quality — quality, bug-prone patterns, correctness, time complexity, tech debt, quality score — structure metrics (symbols, exports, members, SRP, cohesion) via `/check-code-structure` (`sg outline`) |
| `review-compliance` | Review compliance across every dimension with aggregate findings and a review score |
| `review-config` | Review configuration files — drift, missing, duplicate, extends config / deps catalog opportunities |
| `review-cost` | Check infrastructure cost: compute, storage, bandwidth, third-party services, idle resources |
| `review-coverage` | Review how well the "surface that should be covered" is actually covered |
| `review-data-validation` | Check data validation in API, forms, schemas — coverage, safety, type-safety |
| `review-database` | Check the database layer |
| `review-delivery` | Review delivery across every dimension with aggregate findings and a review score |
| `review-dependencies` | Check the project's dependencies |
| `review-desktop-app` | Review desktop app (Tauri/Electron/native) — see `### Platform Mobile And Desktop` |
| `review-diff` | Review a git diff — summarize changes, look for problems, ask the user before keep/revert/proceeding |
| `review-docs` | Review documentation structure before invoking `/update-docs` (markdown docs) or `/update-vitepress-docs` (VitePress site) |
| `review-dot-devin` | Review `.devin` covering both structure and content |
| `review-dx` | In-depth review of developer experience (DX) — see `### DX` |
| `review-events` | Review event-driven architecture |
| `review-frontend` | Review frontend code quality — component architecture, state management, rendering performance, type safety, CSS/styling, form and error handling |
| `review-gaps` | Meta-review collecting findings from dimensional reviews — dedup, prioritize, suggest action skills |
| `review-i18n` | Review the project's internationalization/localization |
| `review-iac` | Review infrastructure-as-code |
| `review-idea` | Assess and evaluate an idea — whether it should be implemented |
| `review-issue` | Check issues — quality, clarity, completeness, readiness before implementation |
| `review-mcp` | Review MCP (Model Context Protocol) servers across every dimension |
| `review-migration` | Review migration plan — backward compatibility, data integrity, rollback, cutover, dependencies, framework, infrastructure, feature flags |
| `review-mobile` | Review mobile app (native/React Native/Flutter/PWA) — see `### Platform Mobile And Desktop` |
| `review-observability` | Review observability across every dimension with aggregate findings and a review score |
| `review-optimize` | Review the app/package to find "what can genuinely be optimized" across every layer |
| `review-performance` | Review application performance — network, build/runtime, memory, I/O, database, caching, algorithmic complexity |
| `review-plan` | Review plan quality — risk assessment, dependency mapping, alternatives, timeline, scope clarity, acceptance criteria, rollback plan |
| `review-redundancy` | Find every form of redundancy in scope |
| `review-release` | Review release readiness — version, changelog, breaking changes, semver, platform targets, rollback, release notes, license |
| `review-risk` | Review project/plan/implementation risks — probability, impact, mitigation, rollback, risk score |
| `review-sdk` | Review the public API surface of the library/SDK/package across every dimension |
| `review-security` | Review security across every dimension with aggregate findings, severity, review score |
| `review-seo` | Review SEO — technical SEO, on-page, structured data, Core Web Vitals, sitemap, international SEO, semantic HTML |
| `review-stability` | Review stability — crashes, error handling, debuggability, recovery, monitoring |
| `review-techstack` | Review tech stack, dependencies, library design — framework choices, versions, runtime compat, security vulnerabilities, unused packages |
| `review-test` | Review test strategy and quality — pass/fail, coverage, flaky, next action |
| `review-then-fix` | Alias of `/deep-review-then-fix` |
| `review-usage` | Review the project's usage surface from the user's perspective |
| `review-uxui` | Review UX/UI design quality — design system, visual design, interaction design, accessibility, design-dev handoff |
| `review-workflow` | Review the workflow — fast, safe, easy to use, efficient, non-duplicative, within scope |
| `review-workspace` | Review a single workspace in a monorepo or a standalone project fully per standards, with score and recommendations |
| `review-writing` | Improve writing quality, naming conventions, and discoverability across the project |

## Domain Pipeline

Catalog of all review domains for `deep-review` — covering every domain (merged from `references/review-skills.md`)

### Priority Order

> When time is limited or findings are many — always review/fix in this order (ranked by blast radius on production)

| Priority | Domains | Reason |
|----------|---------|------|
| P0 Critical | `security`, `auth`, `data-validation`, `database`, `config` | directly affect security/data — mistakes = breach/corruption/downtime |
| P1 High | `architecture`, `quality`, `api`, `dependencies`, `workspace` | structural debt — all future work builds on this base |
| P2 Medium | `performance`, `stability`, `events`, `frontend`, `backend`, `observability`, `iac` | runtime quality — fixable once structure is settled |
| P3 Low | `docs`, `writing`, `uxui`, `seo`, `accessibility`, `business`, `compliance`, `i18n`, `dx`, `usage`, `ai`, `mcp`, `bundle`, `cost` | polish/domain-specific — don't block production |
| P4 Meta | all of Phase 4-5 (`gaps`, `risk`, `diff`, `plan` etc. + `deep-*`) | need findings from P0-P3 first to be meaningful |

- the pipeline phases below are the *execution order* per workspace; this priority table is the *attention order* when choosing — run all phases but always handle findings starting from P0

### Phase 1 — Entry (config/stack/structure)

| No. | Domain | What to check | Condition |
|-----|--------|----------|-----------|
| 1 | `review-config` | config files, drift, missing, duplicate, shared config | every workspace |
| 2 | `review-techstack` | tech stack, versions, library design | every workspace |
| 3 | `review-architecture` | modularity, isolation, boundaries, resilience | every workspace |
| 4 | `review-workspace` | workspace manifest, deps, scripts | monorepo members |
| 5 | `review-workflow` | workflows/pipelines in the workspace | every workspace |
| 6 | `review-dot-devin` | `.devin/` structure, hooks, `rules/` (ast-grep), `sgconfig.yml`, `AGENTS.md` | workspace with `.devin/` or rules |
| 7 | `review-docs` | docs structure, README, USAGE, FEATURES | workspace with docs |

### Phase 2 — Source Code

| No. | Domain | What to check | Condition |
|-----|--------|----------|-----------|
| 1 | `review-code-quality` | code quality, naming, bug-prone patterns, correctness — structure metrics via `/check-code-structure` (`sg outline`) | every workspace with source |
| 2 | `review-writing` | writing quality, discoverability | every workspace |
| 3 | `review-algorithm` | time/space complexity, hot paths | workspace with logic |
| 4 | `review-data-validation` | validation coverage, type-safety | workspace that accepts input |
| 5 | `review-cli` | commands, I/O contract, exit codes | workspace that is a CLI/TUI |
| 6 | `review-api` | REST conventions, versioning, errors | workspace exposing an API |
| 7 | `review-sdk` | public API surface, exports, semver, types | workspace publishing a package/library |
| 8 | `review-backend` | backend sub-reviews, data flow | workspace with a backend |
| 9 | `review-frontend` | components, state, rendering, forms, WebMCP page tools (`document.modelContext`) | workspace with UI code |
| 10 | `review-mobile` | touch targets, lifecycle, platform conventions | workspace that is a mobile app |
| 11 | `review-desktop-app` | window, tray, IPC security, packaging, auto-update | workspace that is a desktop app |
| 12 | `review-browser-ext` | manifest v3, permissions, content scripts, CSP | workspace that is a browser extension |
| 13 | `review-iac` | Terraform/Pulumi/CDK/K8s, state, secrets, drift | workspace with IaC |
| 14 | `review-usage` | usage surface parity — API/CLI/web vs docs promise | workspace with a public usage surface |
| 15 | `review-database` | schema, indexes, queries, migrations | workspace touching the DB |
| 16 | `review-events` | event schemas, ordering, idempotency, DLQ | workspace using events/queues |
| 17 | `review-auth` | sessions, tokens, OAuth, RBAC | workspace with auth |
| 18 | `review-business` | payment, subscription, feature flags | workspace with business logic |

### Phase 3 — Cross-Cutting Metrics

| No. | Domain | What to check | Condition |
|-----|--------|----------|-----------|
| 1 | `review-security` | OWASP, secrets, injection, supply chain | every workspace |
| 2 | `review-performance` | network, build, runtime, memory, I/O | every workspace |
| 3 | `review-stability` | error handling, recovery, debuggability | every workspace |
| 4 | `review-observability` | metrics, tracing, logging, alerting | workspace deployed for real |
| 5 | `review-compliance` | GDPR, PDPA, consent, retention | workspace storing user data |
| 6 | `review-cost` | compute, storage, idle resources | workspace with infra |
| 7 | `review-bundle` | bundle size, chunks, tree-shaking, static assets | workspace building a frontend/lib |
| 8 | `review-seo` | technical SEO, structured data, CWV | workspace that is a public web |
| 9 | `review-i18n` | message catalogs, RTL, formats | workspace with i18n |
| 10 | `review-accessibility` | WCAG, ARIA, keyboard, contrast | workspace with UI |
| 11 | `review-uxui` | design system, interaction, handoff | workspace with UI |
| 12 | `review-ai` | prompts, token cost, guardrails, evals | workspace using AI/LLM |
| 13 | `review-mcp` | MCP tool naming, schemas, auth, WebMCP page tools | workspace that is/uses MCP or exposes WebMCP |
| 14 | `review-test` | test strategy, quality, coverage | every workspace with tests |
| 15 | `review-coverage` | declared surface vs the real one | every workspace |
| 16 | `review-dependencies` | outdated, vulnerabilities, unused | workspace with a manifest |
| 17 | `review-delivery` | docs, DX, CI/CD, infra | every workspace |
| 18 | `review-dx` | dev loop, onboarding, error messages, ergonomics | workspace with a dev workflow |
| 19 | `review-release` | release/deploy readiness | workspace that releases/deploys |
| 20 | `review-alignment` | cross-layer drift code↔docs↔tests↔config↔API contracts (report-only) | every workspace |
| 21 | `review-optimize` | optimization opportunities across every layer + prioritized plan | every workspace |
| 22 | `review-redundancy` | duplicates/redundant/unused — code, skills, docs, config (report-only) | every workspace |

### Phase 4 — Meta / Conditional

| No. | Domain | Used for | Condition |
|-----|--------|---------|-----------|
| 1 | `review-gaps` | merge findings from dimensional reviews into a prioritized list | always after phases 1-3 |
| 2 | `review-by-stakeholder` | persona lens (staff-engineer, qa, pm, user) | when multi-angle prioritization is needed |
| 3 | `review-risk` | probability, impact, mitigation | when findings are high-risk |
| 4 | `review-diff` | git diff keep/revert | when scope has a diff |
| 5 | `review-code-quality` | pre-refactor baseline | when findings point to a refactor |
| 6 | `review-migration` | migration plan + checklist | when there is a migration |
| 7 | `review-plan` | plan quality | when scope is a plan |
| 8 | `review-idea` | idea assessment | when scope is an idea |
| 9 | `review-issue` | issue clarity, scope, acceptance criteria | when scope is an issue |
| 10 | `/review-devin-global-harness` | devin harness layers | only when the target is the devin skills/agents repo |
| 11 | `review-then-fix` | alias → `/deep-review-then-fix` | when the user confirms fixing findings |

### Phase 5 — Deep (via `/follow-deep`)

dispatch via `/follow-deep` per workspace after phases 1-4 — `follow-deep` picks the context-matching `deep-*`; this table is the coverage to consider in full

| No. | Skill | What to check | Condition |
|-----|-------|----------|-----------|
| 1 | `/deep-analyze` | deep multi-dimensional analysis with tools/scripts/CLI | every workspace |
| 2 | `/deep-trace` | trace execution flow, logs, distributed trace | workspace with runtime/async flow |
| 3 | `/deep-debug` | multi-dimensional debug: reproduce → prevent | when there are bug findings |
| 4 | `/deep-test` | testing domains: api, cli, contract, coverage, e2e, integration, mutation, visual | every workspace with tests |
| 5 | `/deep-build` | build across multiple targets/platforms, bundle analysis | workspace that builds |
| 6 | `/deep-impact` | impact analysis before a big change | when findings point to a refactor/upgrade |
| 7 | `/deep-research` | search multiple sources: packages, docs, security | when external knowledge is needed |
| 8 | `/deep-validate` | detailed multi-dimensional cross-reference validation | always at the pipeline end |
| 9 | `/deep-retro` | post-incident retrospective | when incidents/root-cause findings are found |
| 10 | `/deep-thinking` | analyze problems systematically without tools | when findings are complex/unclear |
| 11 | `/create-plan-in-dot-devin` | implementation-ready level plan | when findings need a plan before fixing |

Excluded from dispatch: `/deep-review` (itself), `/deep-review-then-fix` (fix path, not review), aliases (`refactor`→`refactor`, `deep-verify`→`run-verify`, `implement-to-production`→`implement-to-production`)

### Pipeline Rules

1. Dispatch all of phases 1-3 for every workspace except clearly N/A conditions — never skip because "there probably isn't a problem" — under the Step 1 budget (workspaces ≤ 10, dispatches ≤ 30; over → mark `skipped (budget)` in the ledger)
2. independent skills → `/use-subagents` or `/follow-parallel`, ≤10 per batch
3. subagents read the slice file `reports/.deep-review-<time>/findings-<domain>.json` + only the files in evidence — never rerun the CLI, never sweep the whole codebase
4. Every finding must state `in update-review-cli-then-run` = Y/N — N means an analyzer gap → hand off to `/update-review-cli-then-run`
5. the finding's `fixSkill` field is the canonical owner — never remap yourself
6. Phase 5 runs via `/follow-deep` when the `--deep` flag is passed or the workspace has Critical/High findings — cover every `deep-*` whose condition matches; don't cherry-pick

## Review Rules

Canonical rules shared across every `review-*` domain (merged from `references/review-rules.md`) — `(<domain>)` is the domain name

### Evidence-Based Findings

- Every finding must have a file path, line number, and evidence
- Never guess — use tools for verification
- State the false positives found

### Severity Classification

- Critical: unusable in practice / data loss / security exposure
- High: broken for common cases / missing protection on a critical path
- Medium: inconsistency or partial failure
- Low: cosmetic, documentation gap
- Info: suggestion, best practice recommendation

### Review Independence

- Perform review only; do not change code during review
- Do not delete files, code, or configuration during review
- If issues needing fixes are found → report via `/report` and `/suggest-next-action`

### Health Score

- Compute the review score as a percentage (0-100)
- 0 = every finding is Critical, 100 = no findings
- Show the score per dimension and the overall score
- Grade: A (90+), B (80+), C (70+), D (60+), F (<60)
- Use the score to compare before/after during improvements

### Formatting

- Never use `**` (bold markers) — use backticks for emphasis
- Use heading levels for structure
- Report as tables with `/report`

## Fix

Canonical boilerplate for the fix workflow of every `review-*` domain (merged from `references/review-fix.md`)

> Do this section only when the user confirms fixing findings — review/report-only by default; multi-domain fix orchestration → `/deep-review-then-fix`

Standard fix steps when a domain has no dedicated fix workflow:

1. Order findings by severity — critical first, then fix one item at a time with verification immediately after each fix
2. Use the domain-specific fix route (per the checklist in `## Domain Guides` or the domain spec)
3. Every fix must preserve existing behavior, pass `/run-check` and `/run-test` if present, then summarize with `/report-before-after`

## Dimension Map

Use when scanning scope broadly for "what can be improved" — check each dimension lightly (not a full deep review) and map to the matching domain's `## Fix` (merged from `references/dimension-map.md`)

| No. | Dimension | What to look at | Fix Skill |
|-----|-----------|--------|-----------|
| 1 | Architecture | boundaries, coupling, SRP, layer violations | `/deep-review` |
| 2 | Security | secrets, auth, injection, headers, deps vulns | `/deep-review` |
| 3 | Performance | bundle, rendering, queries, memory, network | `/deep-review` |
| 4 | Quality | naming, duplication, complexity, dead code | `/deep-review-then-fix` |
| 5 | Dependencies | outdated, vulnerable, unused, licenses | `/deep-review` |
| 6 | Accessibility | WCAG violations, keyboard, contrast | `/deep-review` |
| 7 | Docs | stale docs, missing guides, broken links | `/deep-review` |
| 8 | Tests | coverage gaps, missing edge cases | `/deep-review` |
| 9 | Observability | missing logs, metrics, alerts | `/deep-review` |
| 10 | Stability | error handling, retries, degradation | `/deep-review` |
| 11 | API | validation, errors, versioning, contract drift | `/deep-review` |
| 12 | Auth | sessions, tokens, OAuth, authz matrix | `/deep-review` |
| 13 | Database | queries, indexes, N+1, migrations, PII | `/deep-review` |
| 14 | SEO | meta, OG, structured data, sitemap | `/deep-review` |
| 15 | Config | env drift, defaults, secrets in config | `/deep-review` |
| 16 | Delivery | CI/CD speed, caching, Docker, releases | `/deep-review` |
| 17 | Cost | idle resources, over-provisioning, egress | `/deep-review` |
| 18 | Frontend | components, state, rendering, resilience | `/deep-review` |
| 19 | Backend | services, jobs, idempotent consumers | `/deep-review` |
| 20 | UXUI | design system, interaction, handoff | `/deep-review` |
| 21 | CLI | commands, help, exit codes, output | `/deep-review` |
| 22 | i18n | catalogs, hardcoded strings, RTL, formats | `/deep-review` |
| 23 | Mobile | touch, safe areas, lifecycle, offline | `/deep-review` |
| 24 | AI | prompts, token cost, guardrails, evals | `/deep-review` |
| 25 | MCP | tool schemas, safety, server config, WebMCP page tools | `/deep-review` |
| 26 | Events | event schemas, idempotency, DLQ | `/deep-review` |
| 27 | Migration | unsafe ops, rollback, ordering | `/deep-review` |
| 28 | Compliance | GDPR/PDPA, consent, retention | `/deep-review` |
| 29 | Business | payments, tenancy, flags, realtime | `/deep-review` |
| 30 | DataValidation | schemas, boundary validation | `/deep-review` |
| 31 | Algorithm | complexity, data structures, hot paths | `/deep-review` |
| 32 | Assets | images, fonts, media, caching | `/deep-review` |
| 33 | Bundle | code splitting, tree shaking, size | `/deep-review` |
| 34 | Workspace | monorepo graph, circular deps | `/deep-review` |
| 35 | Writing | naming, readability, discoverability | `/deep-review` |

Rules:

- Scan wide, not deep — if depth is needed, use a specialized `review-*` or `/deep-review`
- Every finding needs evidence, no guessing
- Show only findings with a clear fix path — if no skill matches, state "no skill" with guidance
- Do not change code during scanning — hand off to `## Fix` only
- Do not create findings from style preferences that have no real effect

## Domain Guides

### DX

Review developer experience in tooling, onboarding, docs, and feedback loops (merged from `references/dx.md` — used with domain `review-dx`)

#### Tooling

1. Check package scripts (`dev`, `build`, `test`, `lint`, `typecheck`) work and are not redundant
2. Check dev server startup time and hot reload / HMR
3. Check build time, incremental build, and cache usage
4. Check lint, format, and type check run fast enough
5. Check IDE integrations, extensions, and editor config (`editorconfig`, `.vscode/settings.json`)
6. Check pre-commit hooks are neither slow nor blocking

#### Onboarding

1. Check the README has overview, installation, usage, contributing
2. Check the setup guide is step-by-step on a clean environment
3. Check prerequisites, env vars, and secrets setup
4. Check one-command setup, e.g. `bun install && bun dev`
5. Check the troubleshooting guide for common errors

#### Docs

1. Check API docs / `JSDoc` / `TSDoc` cover the public API
2. Check examples are runnable and up-to-date
3. Check changelog / migration guide when there are breaking changes
4. Check doc tools (`VitePress`, `Docusaurus`, `Storybook`) match the code
5. Check docs have no broken links, missing pages, or stale screenshots

#### Feedback Loops

1. Check error messages state the cause, the fix, and the location
2. Check stack traces are readable and carry context
3. Check test feedback loops are fast (unit, integration, watch mode)
4. Check lint / type check feedback in IDE and CI
5. Check observability for debugging: logs, metrics, tracing
6. Check build / deploy error feedback is clear

#### DX Severity

- Critical: cannot run dev/build, broken setup, no onboarding guide, unrecoverable error
- High: no HMR, slow build > 1 minute, missing debug tooling, unclear error messages, missing contributing guide
- Medium: poor error messages, missing docs, suboptimal feedback loop
- Low: cosmetic improvement

Rules: review only, no fixes — build should be < 1 minute, tests run fast, linting fast, HMR instant — every finding has a file:line or doc URL

### Platform Mobile And Desktop

Mobile/desktop platform checks (merged from `references/platform-mobile-desktop.md` — used with `review-mobile` + `review-desktop-app`)

#### Mobile — Capacitor And Native Bridge

1. Check Capacitor plugin usage, platform detection, and native bridge patterns
2. Check plugin compatibility with target platform versions
3. Check native bridge error handling and fallback behavior

#### Mobile — Offline And Notifications

1. Check offline support, cache strategy, and offline data sync
2. Check push notification handling: permission flow, notification display, action handling
3. Check biometric auth integration and fallback

#### Mobile — UX

1. Check touch targets: 44x44px minimum size, spacing between targets
2. Check safe area handling: notch, home indicator, status bar
3. Check responsive layout across screen sizes and orientations

#### Mobile Severity

- Critical: broken native bridge, required plugin missing, app crash on platform
- High: no offline support, broken push notification, no platform detection
- Medium: missing safe area, touch targets too small, inconsistent responsive layout
- Low: minor layout issue, cosmetic improvement

#### Desktop — Native APIs And IPC

1. Check native API usage, IPC patterns, and security boundaries between main/renderer processes
2. Check IPC message validation, input sanitization, and channel whitelisting
3. Check context isolation, node integration settings, and sandbox configuration

#### Desktop — Window Management

1. Check window management, multi-window patterns, and window state persistence
2. Check window lifecycle: create, restore, minimize, maximize, close
3. Check single-instance lock and second-instance handling

#### Desktop — Auto-Update

1. Check the auto-update mechanism, update signature verification, and rollback capability
2. Check update channel configuration and staged rollout
3. Check update notification UX and restart behavior

#### Desktop — File System And Sandbox

1. Check file system access, path validation, and sandbox restrictions
2. Check file dialog integration, drag-and-drop, and recent files
3. Check permission model and user consent flow

#### Desktop — Platform-Specific Code

1. Check platform-specific code, conditional compilation, and platform feature detection
2. Check offline support, local data persistence, and sync conflict resolution
3. Check desktop UX: system tray, notifications, keyboard shortcuts, clipboard integration

#### Desktop Severity

- Critical: IPC without validation, unrestricted file system access, no sandbox, auto-update without verification
- High: no platform-specific handling, broken native integration, no auto-update rollback, no offline fallback
- Medium: inconsistent window state, missing keyboard shortcut, suboptimal tray integration
- Low: minor UX polish, cosmetic improvement

### Time Complexity

Analyze and control the time complexity of algorithms and data structures (merged from `references/time-complexity.md` — used with `review-algorithm`) — for projects that need to guarantee performance under predictable input sizes; not for prototypes

#### Complexity Tiers

| Input Size | Acceptable Complexity | Use Case |
|---|---|---|
| ≤ 10² | O(n²), O(n³) | UI lists, config parsing |
| ≤ 10⁴ | O(n log n) | API queries, sorting |
| ≤ 10⁶ | O(n), O(n log n) | Batch processing, data transform |
| ≤ 10⁸ | O(log n), O(1) | Lookup, search, real-time |
| > 10⁸ | O(1), O(log n) | Stream processing, indexing |

#### Checklist

1. Identify critical paths — hot paths, functions receiving variable-size input, collection processing (loops, recursion, nested iteration, sorting, searching), frequently called functions (event handlers, middleware, query builders, render loops); none → skip
2. Classify complexity — single loop = O(n), nested = O(n²), binary search = O(log n); recursion uses the Master Theorem; data structure ops: array access = O(1), hash lookup = O(1) avg, tree = O(log n); record as a table of function/input size/complexity/expected max time
3. Validate against input bounds — state the maximum input size, compute worst-case operations, if over 10⁶ → must optimize; unclear input → heuristics: UI = 10³, API = 10⁴, batch = 10⁶, data pipeline = 10⁸
4. Verify with benchmarks — `/run-bench` across several input sizes; empirical growth not matching theoretical → reanalyze; `/update-tests` for regression

#### Data Structure Selection

- hash map: frequent lookup without sorting · sorted array: search + range queries · tree: insert/delete + search together · array: random access + sequential iteration · heap: min/max + partial sorting · do not use a linked list when random access is needed

#### Anti-Patterns

- Never use nested loops over variable-size collections without analysis — use a hash map or precompute
- Never sort on every query — sort once then binary search
- Never recurse without memoization when there are overlapping subproblems
- Never use `array.indexOf` inside a loop — use `Set` or `Map` instead
- Never assume O(1) without checking — hash map worst case = O(n)

#### Optimization Principles

- Measure before optimizing — use `/run-bench` to confirm the real bottleneck
- Change the data structure before the algorithm — bigger impact, less risk
- Never optimize before having evidence — premature optimization is an anti-pattern
- Same complexity → choose the algorithm that reads more clearly
- Cache results of expensive pure functions when inputs repeat often

#### Complexity Severity

- Critical: O(n²) on input > 10⁴ in a hot path, O(n!) on input > 10
- High: O(n²) on input > 10² in a hot path, missing memoization on overlapping subproblems
- Medium: suboptimal data structure selection, missing cache on expensive pure functions
- Low: minor optimization opportunities, readability vs performance trade-offs

### WebMCP

Review WebMCP page-provided tools (`document.modelContext`) — used with `review-frontend` and `review-mcp` when the workspace is a web app that registers tools for agents; spec = W3C WebML CG draft (`webmachinelearning.github.io/webmcp`), main consumer is `agent-browser webmcp list`/`invoke`

#### Tool Surface

1. Check `name` obeys the rules (1-128 chars, `[A-Za-z0-9_.-]`), `description` is non-empty and matches behavior — no hidden instructions/prompt injection in metadata
2. Check `inputSchema` is JSON Schema and minimal — over-parameterization = privacy leakage (spec §6.3.3)
3. Check `annotations` are set right: `readOnlyHint` for pure reads, `consequentialHint` + UI confirm for irreversible actions (spec §6.3.2), `untrustedContentHint` when output contains external content, `debugging` for dev-only tools

#### Implementation

4. Check feature-detect `'modelContext' in document` before registering — browsers without support must not break; the page must work fully without WebMCP
5. Check registration happens after the document is fully active and unregistration via `AbortSignal` on unmount/route change — duplicate `name` → `InvalidStateError`
6. Check the `execute` callback validates every `inputObject` field (schema is not enforced), honors `signal` cancellation, and returns a JSON-serializable result
7. Check tools call the same app logic as UI handlers — no duplicated business logic in two places
8. Check no session/auth/private data leaks through tool output, and `exposedTo` origins are limited to what is necessary (spec §6.3.4)
9. Check Permissions-Policy `tools=()` on embedders that don't want page tools (if there is an iframe/embed scenario)

#### WebMCP Severity

- Critical: consequential tool without confirm, auth/session data leak via output, `exposedTo` opening a broad origin
- High: execute doesn't validate input, tools break on browsers without WebMCP support, duplicate registration crash
- Medium: missing/incorrect annotations, schema larger than needed, no unregister on route change
- Low: inconsistent naming, unlocalized title

Fix route: implement/fix WebMCP tools → `/follow-create-web-mcp`; verify discovery via `/use-agent-browser` (`webmcp list`/`invoke`)

## Pattern Guides

Canonical architecture pattern guides for domain `review-architecture` (merged from `references/pattern-clean.md` + `references/pattern-layered.md` — choose a pattern via `/follow-architecture`)

### Pattern: Clean Architecture

Implement Clean Architecture with Vertical Slice Modules, Functional Core and Ports & Adapters for production-grade applications — suited to projects that need high testability and long-term maintainability

#### Execute — Clean

##### 1. Setup Project Structure

```
src/
├── modules/                      # Feature modules (Vertical Slice)
│   └── [module-name]/            # types/ schemas/ domain/ application/ ports/ index.ts
├── adapters/                     # External systems: db/ http/ external/ config/ cache/ queue/ storage/ auth/
├── presentation/                 # Entry points: http/ graphql/ grpc/ cli/ events/
├── shared/                       # Shared kernel: types/ utils/ errors/ constants/ ports/ mappers/
test/                             # Mirror src structure: fixtures/ helpers/ mocks/ modules/
```

##### 2. Create Shared Kernel

1. `types/` - Common types (`Result`, `Option`)
2. `utils/` - Pure utility functions
3. `errors/` - Error types
4. `ports/` - Cross-module shared interfaces (`LoggerPort`, `ClockPort`, `IdGeneratorPort`)
5. `mappers/` - Shared mapper functions across modules

##### 3. Implement Functional Core

Write business logic in `modules/*/domain/` with pure functions (if the project uses TypeScript, do `/follow-lib-effect-ts` first to use Effect for type-safe effects, error handling and dependency injection)

1. Use `pure functions` only, immutable data structures (`readonly`)
2. No side effects, no dependency on infrastructure
3. Run `/deep-review` to define the validation strategy across layers
4. Run `/follow-lib-zod` for schema validation in `modules/*/schemas/`

##### 4. Implement Application Layer

Run `/follow-event-driven` when the application has event-driven workflows; if not event-driven, create usecases/queries directly in `modules/*/application/`

1. `usecases/` - Flow orchestration (write side)
2. `queries/` - Read-side queries (CQRS read)
3. `workflows/` - Complex multi-step workflows
4. `handlers/` - Domain event handlers
5. Use `ports` for side effects

##### 5. Implement Adapters And Presentation

Structure the adapters and presentation layers per the dependency direction (presentation → application → adapters → ports)

1. `adapters/db/` - Database implementations — run `/refactor` orm scope (`#### 6.2 Repository Pattern`)
2. `adapters/http/` - HTTP clients, `adapters/external/` - External services
3. `adapters/cache/` - Cache, `adapters/queue/` - Message queues, `adapters/storage/` - File storage
4. `presentation/http/` - HTTP handlers, `presentation/graphql/` - GraphQL resolvers
5. `presentation/cli/` - CLI commands, `presentation/events/` - Event handlers

##### 6. Refactor Existing Code

If there is existing code: run `/refactor` to move code into the new structure (if none, skip this step)

1. Move business logic to `modules/*/domain/operations/`
2. Move data models to `modules/*/domain/models/` as `readonly` types
3. Move repository implementations to `adapters/db/`, HTTP handlers to `presentation/http/`
4. Convert class methods to `pure functions`
5. Create module ports in `modules/*/ports/`

##### 7. Testing Strategy

Run `/update-tests` to organize tests per Clean Architecture

1. Run `/follow-tool-vitest` for testing framework setup
2. Unit tests - Pure function tests in `test/modules/*/domain/` (AAA pattern)
3. Integration tests - Adapter tests in `test/adapters/` (mock ports)
4. E2E tests - Full workflow tests in `test/e2e/` (critical flows)
5. Test fixtures in `test/fixtures/`, helpers in `test/helpers/`

##### 8. Split Modules When Too Large

If a module grows beyond the thresholds, run `/refactor-workspace`

1. Measure module size: module over 15 files, files in `domain/operations/` over 300 lines, usecases in `application/usecases/` over 5
2. Choose a pattern: sub-module (still related to parent), sibling module (independent), shared module (used jointly)
3. Create sub-module directories per the Clean Architecture structure
4. Run `/update-references` to update imports
5. Run `/run-test` to confirm functionality is not broken

#### Rules — Clean

##### 1. Core Rules

- `Domain` = business rules (100% pure)
- `Application` = orchestration + "what happens next" decisions
- `Adapters` = side effects only

##### 2. Folder Structure

| Folder | Purpose | Side Effects | Required |
|--------|---------|--------------|----------|
| `modules/*/domain/` | Pure business logic | None | Required |
| `modules/*/application/` | Orchestration | Via ports | Required |
| `modules/*/ports/` | Module interfaces | None | Required |
| `adapters/` | External systems | I/O only | Required |
| `presentation/` | Entry points | I/O only | Required |
| `shared/` | Common utilities | None | Required |

##### 3. Layer Responsibilities

| Layer | Dependencies | Side Effects |
|-------|--------------|--------------|
| Domain | None | None |
| Application | Domain | Via ports |
| Adapters | Ports | I/O only |
| Presentation | Application | I/O only |
| Shared | None | None |

##### 4. When To Use

Suited to: high testability, easy technology swaps, teams of 3+ developers
Not suited to: plain CRUD, Prototype/MVP, short-term one-person projects

##### 5. Module Splitting

- 2+ triggers passed = should split (files over 15, operations over 300 lines, usecases over 5)
- Do not split modules with < 5 files (`over-engineering`)
- Each sub-module should have 3-10 files and its responsibility stated in one sentence (SRP)
- Do not split if it causes a `circular dependency` or during prototype/MVP phase

- Use /follow-tool-vite if needed
- Use /follow-lang-typescript if needed
- Use /follow-lang-rust if needed
- Use /follow-create-bun-cli if needed
- Use /improve if needed
- Use /run-clean if needed

#### Expected Outcome — Clean

- A production-ready Functional Clean Architecture
- Pure domain logic in `modules/` (100% functional)
- Side effects isolated in the `adapters/` layer only
- Production-grade testability from pure functions + clear boundaries

### Pattern: Layered Architecture

Implement Layered Architecture for frontend projects by separating concerns per layer and enforcing dependency rules — suited to small-medium frontend projects (Vue/Nuxt/React/Solid)

#### Execute — Layered

##### 1. Select Pattern

1. Assess project size and team experience
2. Choose a pattern: traditional layered, feature-based, 4-layer, or hybrid
3. Consider project lifecycle and migration path
4. Run `/follow-tool-vite` for build tooling setup

##### 2. Create Structure

Flat Type-Grouped (canonical — canonical template: `follow-architecture/templates/file-structure-layered.md`):

```
src/
├── app/              // entry, routes/pages, middleware, server
├── components/       // UI components (PascalCase, presentational)
├── hooks/            // composables / hooks — UI state + view logic
├── usecases/         // application use cases — orchestration entry
├── services/         // domain services — business rules
├── features/         // feature-level logic for the specific domain only (optional)
├── infra/            // repositories, database/, external APIs
├── lib/              // third-party wrappers / singleton clients
├── utils/            // pure utilities — no IO
├── types/            // shared types — pure types only
├── constants/        // app constants
├── config/           // env/app config
└── index.ts          // barrel — public API
```

- Flat only — never nest by capability; prefix filenames with the domain (`user-service.ts`)
- layer mapping: presentation = `app/`+`components/`+`hooks/`; domain = `usecases/`+`services/`+`features/`; data = `infra/`+`lib/`; shared leaves = `types/`+`constants/`+`utils/`+`config/`
- framework flat conventions (small-medium frontend): `stores/` (Pinia/Zustand), `middleware/`, `plugins/` may be added per framework — assign them to layers by role

Alternative Variants (choose only when flat isn't enough):

Feature-Based (clear separable features — accept nesting by feature):

```
src/
├── features/          // feature-based organization
│   ├── auth/         // authentication feature
│   │   ├── composables/  // Vue composables
│   │   ├── components/  // Vue components
│   │   ├── api/          // API calls
│   │   ├── stores/ (optional)   // state management
│   │   ├── hooks/ (optional)     // custom hooks
│   │   ├── middleware/ (optional) // route middleware
│   │   └── types/        // TypeScript types
│   └── dashboard/    // dashboard feature
└── shared/           // shared utilities
    ├── utils/        // utility functions
    ├── stores/ (optional)     // global state
    ├── plugins/ (optional)    // framework plugins
    ├── constants/ (optional)  // app constants
    └── types/ (optional)      // shared types
```

4-Layer (clear separation of concerns):

```
src/
├── presentation/     // UI components, pages, routing, layout
│   ├── components/   // reusable UI (Button, Card)
│   ├── pages/        // page-level components
│   └── hooks/        // UI-specific hooks
├── application/      // state orchestration, workflows
│   ├── stores/       // TanStack Query, Zustand, Pinia
│   ├── useCases/     // application workflows
│   └── utils/        // app-wide utilities
├── domain/           // business entities and pure logic
│   ├── entities/     // models (User, Product)
│   ├── repositories/ // interfaces for data access
│   └── services/     // pure business logic functions
├── infrastructure/   // external integrations
│   ├── api/          // API clients
│   ├── storage/      // LocalStorage, IndexedDB wrappers
│   └── config/       // environment configs
└── shared/           // cross-layer utilities (types, constants)
```

##### 3. Enforce Dependencies And Public APIs

1. Use path aliases (`@/domain/...`, `@/application/...`) so layer transitions are clear
2. If the project has `Biome` → add restricted import rules
3. If the project has CI → add dependency graph checks for cycle detection
4. Avoid circular dependencies using dependency injection through interfaces

##### 4. Align Tests With Layers

1. `Domain` tests: pure functions and policies
2. `Application` tests: use cases with fake repositories
3. `Infrastructure` tests: adapters and mapping (contract tests)
4. `Presentation` tests: behavior and composition
5. If the project has `Vitest` → follow `/follow-tool-vitest`

##### 5. Setup And Migrate

1. Create the folder structure per the chosen pattern
2. Set up import aliases in `tsconfig` or `nuxt.config`
3. Move code one feature at a time to reduce risk
4. If the project has `Nuxt Layers` → use `extends` in `nuxt.config.ts`
5. Run `/refactor` when done
6. If the project grows (3+ devs) → migrate to Clean Architecture (`### Pattern: Clean Architecture`)

#### Rules — Layered

##### 1. Pattern Selection

- `flat type-grouped` = canonical default for a single app of any size — grouping by type, no nesting by capability
- `feature-based` suits projects with clear, separable features (accepts nesting by feature)
- `4-layer` suits projects wanting a clear separation of concerns (nested layers)
- `hybrid` (vertical slices + internal layering) suits large projects
- Consider team experience and project lifecycle

##### 2. Dependency Discipline

- presentation folders (`app/`, `components/`, `hooks/`) → domain folders only — never call `infra/`/`lib/` directly
- domain folders (`usecases/` → `services/`/`features/` → `infra/`) — `app/` calls `usecases/`/`features/` only
- data folders (`infra/`, `lib/`) = leaf — never import presentation/domain
- `types/`/`constants/`/`utils/`/`config/` = shared leaves — every layer may use them, no back-imports; `utils/`/`types/` must be pure
- Use path aliases (`@/usecases/...`, `@/services/...`) so layer transitions are clear
- If the project has `Biome` → add restricted import rules
- If the project has CI → add dependency graph checks for cycle detection
- Avoid circular dependencies using dependency injection through interfaces

##### 3. Public API Rules

- Each layer/feature must have an `index.ts` as its public API entry point
- No deep imports across layers (use `@/domain/order`, not `@/domain/order/entities/User`)
- Use the barrel export pattern throughout
- Always prefix composables with `use`
- Import via aliases, not relative paths

##### 4. Nuxt-Specific Guidelines

- Use `Nuxt Layers` to share configuration, components, and composables across projects
- `srcDir` defaults to `app/` in Nuxt 4
- Auto-imported directories: `components/`, `composables/`, `utils/`
- Use `shared/` for code shared between app and server
- Priority order: project files > auto-scanned layers > `extends` config layers

##### 5. Common Pitfalls

- Avoid `shared/` becoming an escape hatch — shared holds only code truly used across layers
- Avoid the business layer becoming a mega-service — split use cases small and focused
- Avoid features scattered across layers until hard to find — use `feature-based` if needed
- Avoid manual enforcement without lint or CI checks

##### 6. Migration Path

- If the project grows (3+ devs, high testability) → migrate to Clean Architecture (`### Pattern: Clean Architecture`)
- If the project needs modular boundaries → use the module structure in `src/modules/<feature>/` per `### Pattern: Clean Architecture`
- Domain logic must be framework-agnostic for easy migration

- Use /follow-lib-vue if needed
- Use /follow-create-web-nuxt if needed
- Use /follow-create-web-svelte if needed
- Use /follow-create-web-nextjs if needed
- Use /follow-lib-react if needed

#### Expected Outcome — Layered

- A pattern appropriate to the project is selected
- Folder structure clearly follows the chosen pattern
- Dependency rules enforced via aliases and lint
- Code separated by domain or technical layer
- Tests organized aligned with layers
- A clear migration path as the project grows

## Expected Outcome

- `tools/review-codebase` CLI runs and produces `reports/review-report.json` (full or diff-scoped per mode)
- Review covers the 56 review domains (`## Review Domains` + `## Domain Pipeline`/`## Domain Guides`/`## Pattern Guides`) in priority order (P0 Critical → P4 Meta) + `deep-*` via `/follow-deep` under budget — coverage is verifiable from the ledger + `## Coverage` matrix
- Findings carry priority, risk, fixSkill, status (new/existing/fixed/regressed), are deduped, and show delta vs baseline
- Every high-priority finding is routed to the suitable review/deep-review-then-fix skill
- A summary report with Executive Summary, Result, Coverage matrix, per-domain sections, per-finding `Evidence`/`Reason`/`Risk`/`Priority`/`fix skill`/`in update-review-cli-then-run`, Fix Status, Recommendations — verify all sections before finishing
- Session interrupted midway → resume from the ledger without rerunning work; a baseline is saved for the next run
- Analyzer gaps (`in update-review-cli-then-run = N`) and analyzer/CLI issues are recorded in `update-review-cli-then-run/references/known-issues.md`
