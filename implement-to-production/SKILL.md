---
name: implement-to-production
description: Convert TODO/MOCK/dead UI into production code: baseline, implement with TDD, refactor, verify gate
argument-hint: "[setup-infra|setup-coverage|deploy-production] [scope-or-plan]"
related:
  - review-implement-to-production
  - deep-review
  - create-plan-in-dot-agents
  - refactor
  - deep-test
  - deep-validate
  - improve
  - ship
  - run-verify
  - use-subagents
  - use-lib-effective
  - follow-best-practice
  - use-my-packages-on-registry
  - resolve-errors
  - check-secrets
---

## Goal

Convert every TODO, MOCK, FAKE, STUB, placeholder, and dead UI into real production code across every dimension — with architecture, security, observability, and a rollback plan

## Scope

> Arguments: `setup-infra` (`infra`, `env`, `secrets`, `ci`, `observability`) → run every readiness step in `### 3`, then report (no plan required) · `setup-coverage` (`coverage`) → run `## Setup Coverage` before the TDD loop · `deploy-production` (`deploy`, `production`) → run `### 9` including the deploy gate and post-deploy verify · no argument → run steps 1–9 in order

- The input is a plan file (`.devin/temp/plan/<workspace>/`), `TODO.md`, or a loose plan → run `## Input Flows` first, then return to the main flow
- Convert every unfinished feature into production code — schema, data, API, UX/UI, external services — with real end-to-end infrastructure. Work that needs a new architecture is excluded; run `/deep-review` first
- UI that looks done but does not work is a placeholder: dead buttons, `onClick={() => {}}`, `href="#"`, permanently `disabled` with no reason, dialogs/menus/tabs that do not open, forms that cannot submit, 'coming soon' text. Wire it to a real action or remove it
- The entry point is `/review-implement-to-production`: know what is missing first, implement everything in the report, then verify with `/deep-test`. Never skip the first step, and never implement only some items
- An item with no design for its surface yet (CLI commands/flags, TUI screens, web layout) → design before writing code: `/design-cli-prototype` / `/design-tui-prototype` answer in chat, and `/design-web-prototype` / `/design-html-prototype` cover the case that must be seen for real. Never leave new stubs behind after implement
- Cover improvements around the scope, not only TODO items. After implement, the work must pass the relevant `/improve` domains; a scope with UI must also pass `/improve uxui`, which reviews the UI as actually rendered, not only the source

## Execute

### 1. Review And Baseline

> Goal: know the scope and its problems before implementing

1. Run the `/review` pre-action gate (issues, gaps, inconsistencies), then `/deep-review` with the dimensions that match the context, then across every dimension to find TODO/MOCK/placeholder and issues
2. Always run `/review-implement-to-production` on the whole scope as the first step (report-only). It returns a work queue table (`missing`/`fake`/`partial`/`unwired`/`promised`) covering markers, stubs, dead UI, and missing routes/docs, and it owns the `gap-scanner` profile. Never start implementing without it. A queue passed in by that preset is the same artifact — reuse it and skip the re-scan, never recurse. On a large codebase → have the skill spawn its own `gap-scanner` profile per directory in parallel; run `/deep-analyze` for the stack/context and `/deep-research` when you need external patterns
3. If the input is a plan file / `TODO.md` / loose plan → complete the matching `## Input Flows` first
4. Record the baseline and keep it resumable: list the unfinished items from the report, their files, dependencies, and infrastructure gaps in a table with one `status` per item (`pending`/`in-progress`/`completed`/`blocked`), and update a row the moment its item closes (write it to the plan file once `### 2.1` creates one; until then keep it in chat and copy it over). A resumed or compacted session continues from the table instead of re-scanning. If you must rely on an external package that is not installed → run `/use-my-packages-on-registry` to list the packages we own before looking for external deps
5. Read `refactor/SKILL.md` `## Rules` and the SRP split in `### 3` before implementing — new code must meet the refactor standards from the first line: 1 unit = 1 reason to change, ≤250 lines, preserve the public API, minimal change

### 2. Review Architecture

> Goal: confirm the architecture before starting

1. Always run `/create-plan-in-dot-agents` (an existing plan file → read it and follow it), then run `/deep-review` to inspect boundaries, layers, and data flow
2. Implementing in `packages/`, `crates/`, or `apps/` → run `/follow-architecture` to pick and apply that directory's pattern (`packages/`/`crates/` → `clean`, `apps/` → `layered`)
3. Before the first line run `/follow-best-practice` for the stack in the manifest — the owner skills' `best-practices/` are the patterns the new code must follow, and the same call lists which deps already have an owner skill. A dep with none → persist the research via `/update-agents-skills-global`
4. If the architecture is unclear or a big structure change is needed → run `/ask-me` first. Identify the critical path: schema → data → API → UX/UI
5. Draft the rollback plan here, before any code or migration: the method (`git revert <merge-commit>`, redeploy the previous version, platform rollback), the reverse path for each schema change (down-migration / restore from backup), and the current production version/revision for later comparison. Write it into the plan file so a destructive step never runs without one; `### 9.6` confirms it is executable

### 3. Verify And Setup Infrastructure

> Goal: env vars, secrets, CI, and observability are complete and verifiable before implementing

1. Check the database (connection pool, indexes, migrations pending vs applied via `/deep-review`, backup) and the API server (endpoints, rate limit, CORS, auth)
2. Run `/check-secrets env-vars` against `.env` / `.env.example` / code usage, then update `.env.example` with every variable the code uses (no real values). If the user must provide credentials → `/ask-me`, then stop and wait
3. Store secrets via `/follow-secret-manager` — never commit them. Inject them per target (`wrangler secret put`, dashboard, CI secrets) and run `/check-secrets secrets-leak` to confirm there is no leak in code or config
4. Check external services: credentials, API keys, endpoints, rate limits
5. Check CI readiness: run `/setup-cicd` or inspect the existing workflows — lint, typecheck, test, and build must all be present, and CI secrets complete. To install our own private package from the registry → store the registry token with `/follow-secret-manager`, then authenticate per package manager (`.npmrc`/`NPM_TOKEN`, `CARGO_REGISTRY_*`); never hardcode the token in the workflow. If CI fails → fix it to green before continuing
6. Wire observability: structured logging for external calls, metrics (response time, error rate), correlation IDs, error tracking/alerting per stack. No standard exists → `/ask-me`
7. Report a readiness checklist: the app runs locally with real env, migrations are applied, external services connect. If the infrastructure is not ready and you cannot fix it → stop, report, and propose options for the user to choose. This sub-flow only prepares readiness; never deploy or modify production resources

### 4. Implement Schema And Data Layer

> Goal: schema, validation, and the data layer are complete

1. Create schemas for the missing data models plus validation schemas and types; check the type flow: schema → validation schema → API types → UI types
2. Create migrations with a dry-run before applying; a destructive migration needs the user's confirmation
3. Replace mock data with real queries — implement the repository/queries. If the project uses or chooses an ORM → run `/follow-lib-drizzle` for schema, migrations, and queries (another ORM → `/refactor` orm scope)
4. Create a seed script for test/dev. If migrations or seed fail → `/resolve-errors` before continuing

### 5. Implement API And UX/UI Layer

> Goal: API handlers and UX/UI are connected to the real API — every interactive element works end-to-end

1. Implement API handlers that query the real data source with validation, auth middleware, and rate limit. oRPC → run `/follow-lib-orpc` (contracts, procedures, typed errors); domain services/error handling with Effect → run `/follow-lib-effect-ts`. Check that the API types match the schema and validation schemas
2. Replace mock data in components with real API calls through the project's lib: TanStack → run `/follow-lib-tanstack-ecosystem` (`Query` = server state, `Form` = forms+validation, `Store` = client state)
3. Implement form validation with schemas that match the API, and connect the auth UI to the real auth service
4. Sweep the whole UI before changing it: enumerate every route and interactive element from a real render (not the source) with `/deep-test website`, trace each element along the chain handler → API/usecase → data source → persistence, and classify it `works`/`fake` (no-op, mock, hardcoded)/`missing` in a checklist in the plan file (`works` = no report marker; `fake`/`missing` match the report's markers; `partial`/`unwired`/`promised` are report-only refinements)
5. Make the UI really work at every point — every button/link/nav/menu/tab/dialog/dropdown works end-to-end, and none of the dead-UI markers from `## Scope` remain in the render: wire it to a real action or remove it. For each `fake`/`missing` element → spawn the `feature-implementer` profile (`## Subagents`) one item at a time in parallel, with file sets that must not overlap (items sharing a file → serialize them)
6. Cover every UI state — loading, error (with retry), empty, success, disabled-during-submit. Every form submits and gives clear feedback; optimistic updates only for idempotent actions with a visible rollback; validation failure → `/resolve-errors`. After implementing, sweep again with `/deep-test website` — an element that still does not work means the work is not done

### 6. Convert TODOs And Placeholders

> Goal: remove TODO/FIXME/HACK and every placeholder

1. If the project has a `TODO.md` → gather its pending items through `## Input Flows` → `TODO.md` (that bullet owns the artifact; do not parse the table ad hoc here), or use `/update-todo-md` to read/enhance the prompt
2. Use every item from `/review-implement-to-production` (step 1) as the queue — do not scan for markers again. A new item found along the way → add it to the queue immediately. Only for hardcoded values the report does not cover → run `/check-secrets hardcoded-values`
3. If the entire input is `TODO.md` → `## Input Flows` → `TODO.md` also sets the ordering and status tracking for the whole run
4. Replace MOCK/FAKE/STUB with real implementations per this skill's flow, and complete every item in the queue — never implement only some items and report it as done. Several independent items → spawn the `feature-implementer` profile one item at a time in parallel (pass it the contracts from steps 4–5); `missing` features from the `### 5` checklist are handled the same way. Core business, large net-new work → `/idea-features` + `/create-plan-in-dot-agents` first
5. Implement each feature/fix with `## TDD Loop` — write a failing test that locks the behavior first, then the code to pass, then refactor in a separate commit
6. Run `/use-lib-effective` before writing a new implementation — use the installed deps or the preferred stack to their full potential. If a new dependency must be added → run `/use-my-packages-on-registry` first to install the packages we publish ourselves, then use that package's `/follow-lib-*`; choose an external dep only when no suitable one exists
7. After implement → run `/update-todo-md` to set completed items to `completed`

### 7. Implement Security, Resilience And Observability

> Goal: the code is secure, resilient, and observable in production

1. Run `/deep-review` to find vulnerabilities, fix the findings, and re-review to confirm they are all closed
2. Validate/sanitize user inputs, use parameterized queries, never expose secrets — run `/check-secrets secrets-leak` before ship
3. Implement retry logic, exponential backoff, and graceful degradation; run `/deep-review` on mutation endpoints to make them retry-safe
4. Run `/deep-review` — no throw without a handler and no catch that swallows errors; for newly opened endpoints, prevent abuse, brute force, and cost exposure
5. Observability is complete per `### 3` — structured logging, metrics, correlation IDs; run `/improve platform` to find gaps across logging/metrics/tracing
6. Reviews across several domains on the same changes → spawn the `review-sweeper` profile (`## Subagents`) one domain at a time in parallel (read-only), then merge the findings before fixing

### 8. Refactor And Cleanup

> Goal: code quality, references, and cleanup are done

1. Always run `/refactor` after implementation — reduce long files, SRP issues (the `refactor/SKILL.md` `### 3` file/SRP bullet), and import/exports so they pass the refactor rules read in step 1
2. Always run `/improve uxui` when the scope has UI and it is wired to work per `### 5`. Prerequisites: the dev server is running (`/check-open-ports` then `/run-dev`, reusing the one from the `### 5` sweep) and `scope` = every route + the `### 5` element checklist + a browser pass (`/watch-browser fix`) that reviews the UI as actually rendered. Cover every finding, never only part of them; a project without UI may skip this step with a reported reason
3. Run `/improve` in the other domains touched — the files changed and their related systems (error handling, consistency, stability, a11y per context), not only TODO items
4. Run `/update-references` after a move/rename/delete, and `/follow-tool-knip` — consider removing or implementing the dead code it finds
5. Always run `/update-project` after implement + refactor — sync docs, config, rules, AGENTS.md, README, and tooling to the current codebase (never skip; docs must not be stale before the verify gate). Run `/update-dot-agents-project` if the `.devin/` structure changed, and `/update-todo-md` if the TODO items changed

### 9. Verify, Deploy Gate, Rollback Plan, And Finalize

> Goal: the code passes full validation before ship/deploy — green gate, real deploy, real verify, rollback plan ready

1. Close the loop with the instrument that opened it: re-run `/review-implement-to-production` on the same scope. The `### 1.4` queue must be fully `completed`/`blocked` (with a reason), and the new scan must report 0 `missing`/`fake`/`partial`/`unwired`/`promised`. A new marker, including one your own code introduced, must be closed before the gate — never gate around it
2. Run `/ship verify-only` as the canonical verify gate (never duplicate the gate — reference `/ship` per the repo's SSOT): it runs steps 1–6 (`/follow-agents-md` → `/deep-review` → `/deep-validate` + `/run-check` → `/update-tests` + `/run-test all` → `/run-dev` + `/deep-test usage` → `/update-project`) and stops before push/merge. Test gaps found along the way → `/improve tests`, then write/fix specs via `/update-tests`; a project with a coverage target → `/deep-test coverage` until its `## 5. Coverage Floors` level
3. Run `/run-verify` for scan, format, lint, typecheck, test, and build. A failure → `/resolve-errors` and retry up to 3 times; still failing → stop and report, never deploy
4. Pre-ship sweep: find debug leftovers with `rg "console\.(log|debug)|debugger"`, run `/check-secrets secrets-leak` to confirm no secret leaked, and `/run-audit` for dependency vulnerabilities
5. Run `/deep-test website` (Roleplay Mode) across every route in the app, not only the ones touched, in this order: routes reachable from the navigation → auth flows → owner/admin surfaces → error/empty/loading states. On a large app, close the nav-reachable set first, then deep-link the routes named in the `### 5` checklist — every interactive element, forms valid + invalid, the main flows, with evidence recorded per route. Then codify the passing flows into a Playwright suite via `/deep-test e2e` — the Playwright report is the authoritative result
6. Confirm the rollback plan drafted in `### 2.5` is executable, not just a note: re-state the method (`git revert <merge-commit>`, redeploy the previous version, platform rollback) and record the current production version/revision for comparison. A destructive deploy (DB migration, breaking API) → `/ask-me` first
7. A real deploy → run `/run-deploy` or `/follow-deploy` (dispatches to `deploy-to-<platform>`); deploy staging/preview first when the platform supports it, and always record the deployment URL + version/revision
8. Post-deploy verify: smoke-test the critical paths on the real production URL, check logs/metrics/error tracking for an error spike, and compare behavior against the passing `/run-check` results. On failure → execute the rollback plan immediately, then report
9. Complex work or several workspaces → add a deep pass: front-load `/deep-thinking` and `/deep-analyze` for high-impact changes, order the critical path (schema → data → API → UX), and extend the `### 2.5` rollback plan for each batch before it starts
10. If this work implements a GitHub issue I created → `/resolve-github-issue-by-me` to comment the result and close it; pending/blocked/deferred work → `/save-to-todo-md`
11. Run `/suggest-next-action` — when everything passes and the user wants production → the full `/ship` (commit/push → PR review gate → merge `main`), or `/release-new-version` when a version must be released

## TDD Loop

> Applies to every task that creates or changes behavior; skip it only for pure docs/config/style edits with no runtime behavior. No test framework or coverage tooling yet → do `## Setup Coverage` (or `/follow-tool-vitest`/`/follow-tool-nextest`) first. An unclear behavior contract → `/ask-me` before writing the test

1. Understand: read the spec/issue/plan item/`TODO.md` row. The expected input/output and error cases must fit in one sentence. Check the existing tests for that unit and extend instead of duplicating. Work one smallest testable behavior at a time (one function, one rule, one endpoint response)
2. Write the failing test: one test = one behavior, named scenario + expectation (`rejects expired token`, not `test1`). Assert on the real public contract (return value, thrown error, HTTP status, rendered state), not internal calls. It must fail for the expected reason — a test that passes the first time asserts nothing or the feature already exists. Never use placeholder assertions or empty tests
3. Make it pass: write just enough code for the test — no speculative branches, no extra features, no refactor at this stage (Two Hats). Run the whole suite, not only the new test; a broken test → fix it before continuing. Add a dep only once the manifest/catalog sanctions it
4. Refactor: rename, remove duplication, split by concern — apply `/refactor` `## Rules` + `## Guide` (smell → technique). Re-run the tests after each step; a red suite midway → revert only that step. Stop when the code reads clearly (`/simplify guard`, rule of three). Structural changes go in a commit separate from the implementation
5. Repeat and integrate: loop steps 2–4 one behavior at a time and `/git-commit` a checkpoint on every green cycle. Cover the boundary cases the implementation reveals: empty/invalid input, concurrent/duplicate calls, permission denied, upstream failure. Property-based/fuzz → `/deep-test property`; database-backed → `/deep-test database`; cross-module contracts → `/deep-test contract`. Finish an item with the full suite + `/run-check` + `/run-verify`
6. No production code without a failing test that locks the behavior first — a test written after the code cannot prove the behavior is locked. Untested legacy code → characterization tests first (`/update-tests`)
7. One test asserts one behavior — multiple behaviors in one test → split it. One cycle commits one concern and never mixes refactor/fix/feature, and every cycle ends with a green suite, not a visual check. An assertion that can never fail is a dead test → check/fix it via `/deep-test test-correctness`

## Input Flows

> An artifact input (plan file, `TODO.md`, loose plan) → convert it into a single task queue first, then return to the main flow (`### 1`–`### 9`). The input is the source of truth for the scope, not the implementation strategy: never do a task that was not extracted into the queue, never duplicate a task from two sources, update the status in the file immediately when a task is done, and save pending/blocked work with `/save-to-todo-md` before ending the session

- Plan File (`.devin/temp/plan/<workspace>/<title-date>.md`):
  1. Identify the file from the argument (path or title; absent → list them and ask the user to choose)
  2. Build the task list from tasks with `status: pending`, ordered per `## Execution Order`
  3. Do them one at a time along the critical path; a complex task → `/create-plan-in-dot-agents` again before starting
  4. Set the status to `in-progress`/`completed` as you go
  5. Once every task is `completed` → `/deep-validate` + `/run-verify`
  6. Delete the plan file only when the work is complete (never before confirming), then report a summary
  7. A plan that must change, or a high-risk task → `/ask-me` first; a plan that needs no file deletion → use the Loose Plan bullet instead
- `TODO.md` (project root; absent → stop and report):
  1. Split the table rows (Title/Description/Status/Priority/Created)
  2. Filter `pending`/`in-progress`, sort priority high→medium→low, no-blocker tasks first, created oldest→newest
  3. Implement one task at a time with the main flow (an easy task whose state already exists → `/continue`; a complex one → `/create-plan-in-dot-agents` first; unclear → ask the user)
  4. Mark `completed`/`blocked` with a reason immediately, adding sub-tasks when needed
  5. Loop until no `pending` remains (`blocked` remaining → report and ask the user)
  6. Finish with `/deep-validate` → `/run-verify` → `/ship` → `/report` summarizing every task
- Loose Plan (`AGENTS.md`/`PLAN.md`/general docs — no file deletion needed):
  1. Read `AGENTS.md` in the project root → not found → look for `PLAN.md`, `plan.md`, `TODO.md`, or context the user provided
  2. Extract steps from headings/bullets/numbered lists (no plan → stop and report)
  3. Convert each step into a workflow (`/name`), skill, shell command, or decision, and specify order/dependencies (unclear step → ask the user)
  4. Build a todo list and do one step at a time (only one `in_progress` at a time); read the actual workflow/skill file before invoking it, follow its `## Execute`, and check its `## Expected Outcome` before marking the step `completed`; a workflow with sub-workflows → recurse. "Do xxx" must actually be done, never interpreted as a concept
  5. Never do a step the plan does not specify without permission; a failing step → `/resolve-errors` retry ≤ 3, still failing → stop + report; the user permits skipping → mark ⏭️
  6. When all steps are done → combine the results into a status table (✅/❌/⏭️) and return to the main flow
  7. High-risk steps (deploy, push, delete) → `/ask-me` first; never force push/force merge; pending work → `/suggest-next-action`

## Setup Coverage

> Dispatched by the `## Scope` argument `setup-coverage`/`coverage`. Use it when the project has no coverage tooling yet or needs a fresh setup before the TDD loop. Supports Bun/Node (vitest), Rust (llvm-cov), Go (built-in), and Python (pytest-cov). Tooling setup only — writing tests → `/update-tests`, closing coverage gaps → `/improve coverage`

1. Detect ecosystem and state: check the manifest (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`), the existing test framework (vitest, cargo test/nextest, go test, pytest), and the existing coverage state (config, devDeps, CI step — an idempotent check). No test framework → `/use-related-skills` to find `follow-tool-vitest` etc. first
2. Install per ecosystem, using only the standard tools — never redundant; unsure about a tool/version → check the official docs before installing, never guess flags: Bun → built-in (`bun test --coverage`) · Node → `@vitest/coverage-v8` (`vitest run --coverage`) · Rust → `cargo-llvm-cov` (`cargo llvm-cov`) · Go → built-in (`go test -coverprofile=coverage.out ./...`) · Python → `pytest-cov` (`pytest --cov`). Install via the project's package manager, add a `test:coverage` script in the manifest (per `/deep-test strategy` `## 4`), and set up a minimal coverage config — provider, include/exclude patterns, reporters
3. Configure thresholds and output: set the output dir (e.g. `coverage/`) and add it to `.gitignore` — coverage output must never be committed. Set thresholds per the `/deep-test strategy` `## 5. Coverage Floors` table (overall 70% / 80% / 90% by level; unit floors 70% / 85% / 95%) when the tool supports them, but never so high that they block the TDD loop. Reporters: text for the terminal plus html/lcov for CI
4. Wire CI and verify: add a coverage step to the CI workflow when one exists; no pipeline yet → `/setup-cicd`. The coverage command must produce a report successfully. Run `/deep-test coverage` to confirm the report is correct (no test suite yet → `/update-tests` before measuring). A failure → `/resolve-errors` max 3 rounds, then stop and report

## Rules

- No Mock In Production — no mock implementation, simulated delay, in-memory store instead of a real service, or silent fallback to mock data in production code. The queue opened in `### 1.2` is closed in full: a promise that cannot be kept is reported blocked/deferred with a reason, never silently dropped (the dead-UI definition is owned by `## Scope`; the zero-new-marker check by `### 9.1`)
- Type And Validation Flow — types flow schema → validation schema → API types → UI types; infer types from the schema instead of re-declaring them; avoid `any`, use `unknown` instead
- Safety And User Confirmation — a destructive migration needs a dry-run plus the user's confirmation; external services that are not ready → report the options before proceeding; never hardcode secrets or keys — store them with `/follow-secret-manager`; the gate in `### 9` must be green before deploy, no exception; record the URL and version on every deploy
- Minimal And Maintainable — always read the `/refactor` rules before implementing and always run `/refactor` after implement (step 8), never skip; follow `/simplify guard`; before rewriting or when you find duplicates → `/use-lib-effective`; for a new dep → check the packages we own with `/use-my-packages-on-registry` before an external dep; preserve the public API unless it truly must change; files no longer than 250 lines
- Best Practice First — every implementation starts from `/follow-best-practice`: the manifest's deps mapped to their owner skills, and those skills' `best-practices/` followed as written; a pattern that contradicts them needs a stated reason, never a silent preference; a dep with no `best-practices/` → backfill through `/update-agents-skills-global`
- Plan Always — every implement task must have a plan from `/create-plan-in-dot-agents` first; never start steps 4–9 without a plan (`setup-infra` runs only `### 3`, so it needs none)
- Test First — no production code without a failing test that locks the behavior first; after implementing every item → `/deep-test` every domain touched (`unit`/`integration`/`api`/`e2e`/`website`) until green before entering the verify gate in `### 9` — a test that is not green means the work is not done (cycle order, coverage setup, and commit splitting are owned by `## TDD Loop`)

## Subagents

> Independent work that can run in parallel via `/use-subagents` — the profiles live inline here; the parent always aggregates results, makes checkpoint commits, and verifies the whole. Inventory gaps use the `gap-scanner` profile of `/review-implement-to-production` (single owner, not copied here)

### feature-implementer — implement a single feature/gap item end-to-end (spawn one item at a time in parallel; file sets must not overlap)

- `Inputs`: `item` (a gap item from `/review-implement-to-production` or a plan file), `files` (the scope it may edit), `contracts` (the types/schemas/API the parent provides as canonical — do not redefine them), `conventions` (stack/libraries/style), `verify-cmd` (e.g. `bun test <path>`, `bun check`)
- `Tools`: read, grep, glob, edit/write (only inside `files`), exec (`verify-cmd`)
- `Execute`: write a failing test that locks the expected behavior first (TDD) → implement `item` using existing deps first → wire in `contracts` → run `verify-cmd`; a failure → fix it or report a blocker → remove the old marker once the behavior is actually implemented
- `Output`: a `No./File/Change/Test (pass/fail/skipped)/Notes` table + files changed + new deps + markers removed + blockers
- `Constraints`: no new mock/stub/placeholder; do not add deps yourself — a package that is not installed → return a blocker with a reason, and the parent runs `/use-my-packages-on-registry` first; do not commit or push (the parent checkpoints); never hardcode secrets — missing env/credentials → a blocker immediately; never `git push`/`rm -rf`

### review-sweeper — review changes one domain at a time in parallel (read-only)

- `Inputs`: a single `domain` (`security`/`api`/`test`/`observability`/`resilience`), `scope` (files/diff), `context`
- `Tools`: read, grep, glob, exec (read-only commands)
- `Execute`: read the changes → review against the domain checklist (security = injection/authz gaps/secrets leak/input validation; api = validation/error handling/rate limit/retry-safety; test = assertion-less tests/unhandled throws/swallowed errors; observability = logging/metrics/correlation IDs; resilience = retry/backoff/graceful degradation/timeouts) → report findings with severity; never fix them yourself
- `Output`: a `No./Severity (critical/high/medium/low)/Location/Finding/Suggested Fix` table + verdict `pass`/`pass-with-warnings`/`fail` + blocking count
- `Constraints`: no write/edit; review only the assigned domain; every finding points to a real `file:line`; never guess

## Expected Outcome

- The scope's gaps are known from `/review-implement-to-production` before starting, and every item is closed or reported blocked/deferred with a reason — the `### 9.1` re-scan returns 0 markers and the queue in the plan file shows every item closed
- No TODO/MOCK/placeholder remains in production code, including every dead UI point; schema, validation, types, API, and UX/UI are complete and connected
- Every interactive element works end-to-end — verified by a real click-through in the browser
- Improvements around the scope are found and fixed comprehensively via `/improve`; the UI passes `/improve uxui` on a real render with every finding covered (or skipped with a reason when there is no UI); any needed new dep is chosen via `/use-my-packages-on-registry` before an external dep and verified in the manifest/lockfile
- Infrastructure is production-ready: security, observability, and resilience — env/secrets complete, CI green, observability wired
- The canonical verify gate `/ship verify-only` passes in full (including `/deep-test all` and `/run-verify`), with a handoff to `/ship` or `/release-new-version`; a deploy passes post-deploy verify with URL + version
- A rollback plan was drafted in `### 2.5` before any destructive step and confirmed executable in `### 9.6`, and every implemented behavior has a green suite per `## TDD Loop`
