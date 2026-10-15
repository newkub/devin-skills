---
name: review
description: Select and execute review skill(s) fit for the context; supports parallel multi-dimension
argument-hint: "[topic-or-goal]"
related:
  - deep-review
  - review-devin-global-harness
  - deep-review-then-fix
  - follow-parallel
  - report
  - suggest-next-action
  - run-review

---

## Goal

Select and execute the `review-*` skill(s) best suited to the current context, considering the target object, user intent, workspace type, and risk level, with support for parallel execution

## Scope

Use when the user wants a review but isn't sure which review-* skill to use, or wants the system to select, order, and execute review skills. Covers code, docs, plans, GitHub, devin skills, release, delivery, and cross-dimensional review

## Execute

### 1. Detect Review Context

> Goal: know what to review and which aspects to emphasize

1. Check workspace files: `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, `AGENTS.md`, `README.md`, `git status`
2. If there are `apps/`, `src/`, `packages/` → likely project code
3. If it's `.md`, `.kdl`, `USAGE.md`, `FEATURES.md` → likely docs
4. If the workspace is under `%APPDATA%\devin\skills` or has `.devin/skills/` → likely devin skills
5. If the user names an issue/PR number or `github` → likely GitHub
6. If there is a git diff or `git diff` in scope → `/deep-review` may apply
7. Ask the user if the context is still unclear

### 2. Select Review Skills

> Goal: pick the review skill(s) that best match the context

Use the table below to map the context to a primary review skill and, where applicable, secondary review skills:

| No. | Context / User Intent | Primary Skill | Secondary Skills |
|-----|----------------------|---------------|------------------|
| 1 | Want a review of the whole codebase / don't know where to start | `/deep-review` | `/deep-review` |
| 2 | Focus on code quality, bug-prone patterns, smells | `/deep-review` | `/deep-review` |
| 3 | Focus on logic, types, edge cases, contracts, tests | `/deep-review` | `/deep-review` |
| 4 | Focus on security | `/deep-review` | `/deep-review`, `/deep-review` |
| 5 | Focus on performance | `/deep-review` | `/deep-review`, `/deep-review` |
| 6 | Focus on frontend code (React/Vue/Solid/Svelte/Angular) | `/deep-review` | `/deep-review`, `/deep-review` |
| 7 | Focus on backend (API, service, database, data flow) | `/deep-review` | `/deep-review`, `/deep-review` |
| 8 | Focus on architecture, modularity, boundaries | `/deep-review` | `/deep-review`, `/deep-review` |
| 9 | Focus on UX/UI, design system, accessibility | `/deep-review` | `/deep-review`, `/deep-review` |
| 10 | Focus on platform (mobile, desktop, CLI, SSR, i18n, SEO) | `/deep-review` | `/deep-review`, `/deep-review` |
| 11 | Focus on business logic (payment, subscription, multi-tenancy, feature flags, realtime, email) | `/deep-review` | `/deep-review`, `/deep-review` |
| 12 | Focus on tech stack / dependencies / library design | `/deep-review` | `/deep-review`, `/deep-review` |
| 13 | Focus on stability, error handling, debuggability | `/deep-review` | `/deep-review`, `/deep-review` |
| 14 | Focus on observability (metrics, tracing, logging, alerting) | `/deep-review` | `/deep-review`, `/deep-review` |
| 15 | Focus on compliance (GDPR, CCPA, HIPAA, PCI-DSS, SOC2, PDPA) | `/deep-review` | `/deep-review`, `/deep-review` |
| 16 | Focus on delivery (docs, DX, CI/CD, infra, performance, security) | `/deep-review` | `/deep-review`, `/deep-review` |
| 17 | Check readiness before deploy | `/deep-review` | `/deep-review`, `/watch-deploy` |
| 18 | Check readiness before release | `/deep-review` | `/deep-review`, `/deep-review` |
| 19 | Check `rules/` (ast-grep), `sgconfig.yml`, `.devin/`, `AGENTS.md` | `/deep-review` | `/deep-review`, `/review-devin-global-harness` |
| 20 | Check docs structure before `update-docs` | `/deep-review` | `/deep-review` |
| 21 | Check `README.md` before `update-docs readme-md` | `/deep-review` | `/deep-review` |
| 22 | Check `FEATURES.md` before `update-docs features-md` | `/deep-review` | `/deep-review` |
| 23 | Check `USAGE.md` / `usage.kdl` | `/deep-review` | `/deep-review` |
| 24 | Check content coverage across every feature/API | `/deep-review` | `/deep-review` |
| 25 | Check naming conventions | `/deep-review` | `/deep-review` |
| 26 | Check readability | `/deep-review` | `/deep-review` |
| 27 | Check redundancy / duplication / unnecessary things in skills or code | `/deep-review` | `/deep-review`, `/follow-tool-knip` |
| 28 | Check consistency across skills / code | `/deep-review` | `/deep-review` |
| 29 | Check references between skills and `AGENTS.md` | `/deep-review` | `/review-devin-global-harness` |
| 30 | Check the git diff before keep/revert | `/deep-review` | `/deep-review` |
| 31 | Check the migration plan before starting | `/deep-review` | `/deep-review` |
| 32 | Check before refactor | `/deep-review` | `/deep-review` |
| 33 | Aggregate findings from dimensional reviews | `/deep-review` | `/deep-review` |
| 34 | Want a multi-stakeholder / roleplay review | `/deep-review` | `/deep-review` |
| 35 | Check a GitHub issue | `/deep-review` | `/review-github-pr` |
| 36 | Check a GitHub PR | `/review-github-pr` | `/deep-review`, `/deep-review` |
| 37 | Check a general issue | `/deep-review` | `/deep-review` |
| 38 | Check the devin global skills repo | `/review-devin-global-harness` | `/deep-review` |
| 39 | Check devin global subagents | `/update-devin-global-subagents` | `/review-devin-global-harness` |
| 40 | Review first, then fix per context | `/deep-review-then-fix` | `/deep-review` |
| 41 | Check dead code / unused files / unused deps in code | `/follow-tool-knip` | `/review-devin-global-harness`, `/deep-review` |
| 42 | Focus on DX — dev loop speed, onboarding, error messages | `/deep-review` | `/deep-review`, `/deep-review` |
| 43 | Focus on desktop app (Tauri/Electron) — window, tray, IPC, packaging | `/deep-review` | `/deep-review`, `/deep-review` |
| 44 | Focus on browser extension — manifest, permissions, content scripts | `/deep-review` | `/deep-review`, `/deep-review` |
| 45 | Focus on IaC — Terraform/Pulumi/CDK/K8s, state, secrets, drift | `/deep-review` | `/deep-review`, `/deep-review` |
| 49 | Focus on SDK/library public surface — exports, semver, types | `/deep-review` | `/deep-review`, `/deep-review` |
| 50 | Focus on usage surface — API/CLI/web parity with docs (refresh `/update-usage-md` first) | `/deep-review` | `/deep-review`, `/deep-review`, `/deep-review` |

1. If the user names a specific review skill → use that skill as primary, then check the table for secondaries
2. If several contexts are clearly present → select all relevant primaries
3. If the context is unclear → run `/scan-codebase`, then `/report`, then ask the user before choosing

### 3. Execute Selected Skills

> Goal: run the selected review skill(s) effectively

1. If there is one skill → invoke that skill directly
2. If there are several skills and they are independent → use `/follow-parallel` to run them in parallel (limit to no more than 10 per batch)
3. If there are dependencies, e.g. `/deep-review` before `/implement-to-production` → run in order
4. If a skill needs a deep scan → run `/deep-analyze` or `/deep-review` first
5. Record the output and findings from each skill

### 4. Validate And Aggregate

> Goal: combine results and verify correctness

1. Run `/deep-validate` to validate findings from every review skill
2. Filter out false positives and duplicate findings
3. Order findings by severity — per `deep-review/SKILL.md` Severity Classification
4. If there are conflicts between findings from different skills → run `/rethink` then summarize

### 5. Report And Suggest Next Action

> Goal: summarize the review results and recommend what to do next

1. Run `/report-review` (chat table, no files)
2. Build the Review Skills Used, Findings Count, Severity Breakdown, Review Score table
3. Identify the next skill to run, e.g. `/deep-review-then-fix`, `/resolve-errors`, `/deep-validate`, or `/ship`
4. Run `/suggest-next-action`

## Rules

### 1. Context First
- Don't guess when the context is unclear
- Ask the user before picking a review skill when needed
- Use `/scan-codebase` and `/report` to support the decision

### 2. Skill Selection
- Choose skills by the target object and user intent, not just file names
- Avoid selecting overlapping review skills within the same scope
- Several skills may be selected if the task spans multiple contexts

### 3. Parallel Execution
- Use `/follow-parallel` when the selected review skills are independent
- Limit parallelism to no more than 10 per batch
- Skills with dependencies must run in order

### 4. Evidence-Based
- Every finding must have a file, line, or reference
- Never conclude a finding without evidence
- Don't modify or implement fixes — report findings only, then hand off to the `## Fix` section of the matching-domain `review-*` skill or `/fix`

### 5. No Duplication
- `/review` is the canonical entry for routing — don't nest it with other routers
- If `/review` is already running, don't invoke it again

### 6. Formatting
- Never use `**` (bold markers) — use backticks for emphasis (review)
- Use heading levels for structure
- Report final findings as tables via `/report-review` (chat, no files)
- Every report table must have `No.` as its first column

### 7. Dispatcher Checklist (per dimension)

- Intent mapping — user intent → correct primary review skill(s); secondary skills for cross-domain findings; multi-context prompts → all relevant skills selected
- Domain coverage — every in-scope dimension routed per the Step 2 table (code/docs domains → `/deep-review` domains; persona → `/deep-review` via `/review-by-all-stakeholder`; devin repos → `/review-devin-global-harness`/`/update-devin-global-subagents`; GitHub PR → `/review-github-pr`; aggregate → `/deep-review`, `/deep-review-then-fix`)
- Execution discipline — independent skills → parallel via `/follow-parallel`; dependency order respected (plan → implement); deep scans via `/deep-analyze`/`/deep-review` when needed
- Aggregation — findings dedup'd, prioritized, routed to `## Fix` owners; report table with `No.` column first

- Use /deep-review if needed
- Use /follow-deep if needed
- Use /run-review if needed

## References

- `review-*` full dispatch catalog (per-workspace phases): `deep-review/SKILL.md`

## Subagents

> Goal: independent work that spawned agents can run in parallel — short profile here, full detail in the links

### codebase-reviewer — checks the codebase/scope against the full-dimension checklist, report-only (spawn via `/use-subagents` for codebase-wide scan)

- **Inputs**: `scope` (target path/directory to review), `context-hints` (optional — stack/domain already detected by the parent), `findings-file` (optional — baseline analyzer output for cross-checking)
- **Tools**: `read`, `exec`, `grep`, `glob`, `find_file_by_name` (no `write`/`edit`)
- **Execute**: detect the `scope`'s stack/entry points per the parent's `### 1. Detect Review Context` → check real code across all dimensions of `## Rules → 7. Dispatcher Checklist`, every finding with `file:line` + evidence → classify severity + compute the score per `## Metrics` → drop false positives, map deeper domains to `/review-*` per the `### 2` dispatch table as recommendations → summarize per `### 5. Report And Suggest Next Action`
- **Output**: table `| No. | Dimension | Severity | File | Finding | Suggestion |` ordered Critical → Info, ending with the score + follow-up `/review-*` recommendations
- **Constraints**: Read-only — `write`/`edit` forbidden, no modifying any file; no evidence, no finding; state uncertainty instead of guessing; the cross-skill dispatch catalog → `deep-review/SKILL.md` (read only, never modify)
- **Criteria**: the parent's `## Execute` Steps 1-5, `## Rules → 7. Dispatcher Checklist`, and `## Metrics`

## Metrics

Supplementary metrics — record after each review to compare before/after and judge dispatcher quality:

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Review Coverage Ratio | % review contexts or routes in scope that were evaluated | evaluated / total × 100 |
| 2 | False Positive Rate | % findings that are false positives | false positives / total findings × 100 |
| 3 | Evidence Strength Score | % findings with evidence (file/line) | findings with evidence / total findings × 100 |
| 4 | Actionability Score | % findings with clear recommendation | actionable findings / total findings × 100 |
| 5 | Severity Distribution | count of findings per severity | count of Critical/High/Medium/Low/Info |
| 6 | MTTR Estimate | estimated time to route or address review | Critical=1d, High=3d, Medium=7d, Low=14d average |
| 7 | Before/After Trend | score improvement over time | (after - before) / before × 100 |
| 8 | Risk Exposure Index | high-severity misrouted review contexts | count of Critical/High findings in critical scope |
| 9 | Scope Boundary Adherence | % routing findings inside declared scope | in-scope findings / total findings × 100 |
| 10 | Documentation/Report Quality | % findings with target and recommended skill | documented findings / total × 100 |

Domain-specific metrics:

| No. | Metric | Description | How To Calculate |
|-----|--------|-------------|------------------|
| 1 | Routing Accuracy | % reviews routed to the correct skill or target | correct routes / total routed × 100 |
| 2 | Ambiguity Rate | % inputs with unclear routing intent | ambiguous inputs / total inputs × 100 |
| 3 | Fallback Rate | % reviews that fall back to a default handler | fallback count / total reviews × 100 |
| 4 | Context Detection Coverage | % contexts where domain/intent is correctly detected | detected contexts / total contexts × 100 |

## Expected Outcome

- Know what to review and which review skill to use
- The fitting `review-*` skill(s) are selected and executed
- No irrelevant skills are invoked
- Findings are validated, false positives filtered, and combined into a report
- Know the next skill to run
