---
name: implement-to-production
description: Convert TODO/MOCK/dead UI into production code: baseline, implement with TDD, refactor, verify gate
argument-hint: "[setup-infra|setup-coverage|deploy-production] [scope-or-plan]"
related:
  - report-not-implement
  - deep-review
  - create-plan-in-dot-devin
  - refactor
  - deep-test
  - deep-validate
  - improve
  - ship
  - run-verify
  - use-subagents
  - use-lib-effective
  - use-my-packages-on-registry
  - resolve-errors
  - check-secrets
  - follow-secret-manager
---

## Goal

Convert TODO, MOCK, FAKE, STUB, placeholder, and dead UI into real production code across every dimension, with architecture, security, observability, and a rollback plan

## Scope

> Argument routing: `setup-infra` (`infra`, `env`, `secrets`, `ci`, `observability`) → do all of `### 3` readiness then report · `setup-coverage` (`coverage`) → do `## Setup Coverage` before starting the TDD loop · `deploy-production` (`deploy`, `production`) → do `### 9` including the deploy gate + post-deploy verify · none specified → steps 1-9 in order

- input is a plan file (`.devin/temp/plan/<workspace>/`), `TODO.md`, or a loose plan → do `## Input Flows` first, then return to the main flow
- Convert every unfinished feature into production code: schema, data, API, UX/UI, external services, with real end-to-end infrastructure — excluding work that should start from a new architecture (use `/deep-review` first)
- UI that looks done but does not actually work also counts as a placeholder — dead buttons, `onClick={() => {}}`, `href="#"`, permanently `disabled` with no reason, dialogs/menus/tabs that do not open, forms that cannot submit, 'coming soon' text — it must be wired to actually work or removed
- The starting entry point is `/report-not-implement` (know first what is still missing) → implement everything in the report → verify with `/deep-test` — never skip the first step or choose to do only some items
- item with no design for the surface yet (CLI commands/flags, TUI screens, web layout) → design before writing code: `/design-cli-prototype` / `/design-tui-prototype` answer in chat, or `/design-web-prototype` / `/design-html-prototype` when it must be seen for real — never leave new stubs behind after implement
- Cover improvements around the work scope, not just TODO items — after implement it must pass the relevant `/improve` domains, and if the scope has UI it must also pass `/improve uxui` (review the UI as actually rendered, not just the source)

## Execute

### 1. Review And Baseline

> Goal: Understand the scope and problems before implementing

1. Run the `/review` pre-action gate — run `/deep-review` with the dimensions that match the context, then across every dimension to find TODO/MOCK/placeholder and issues
2. Always run `/report-not-implement` for the whole scope as the first step (read-only) → get a work queue table (`missing`/`fake`/`partial`/`unwired`/`promised`) covering markers, stubs, dead UI, and missing routes/docs; never start implementing without a report — for a large codebase → have that skill spawn its own `gap-scanner` profile in parallel per directory; run `/deep-analyze` to understand the stack/context and `/deep-research` if you need to find external patterns
3. If the input is a plan file / `TODO.md` / loose plan → complete the matching `## Input Flows` first
4. Record the baseline and make it resumable: unfinished items from the report, files, dependencies, infrastructure gaps — keep the queue as a table with one `status` per item (`pending`/`in-progress`/`completed`/`blocked`) and update that row the moment the item closes (persist it to the plan file once `### 2.1` creates it; until then keep it in chat and copy it over), so a resumed or compacted session continues from the table instead of re-scanning; if you must rely on an external package that is not installed yet → run `/use-my-packages-on-registry` to list the packages we own as the first option before looking for external deps
5. Read `refactor/SKILL.md` `## Rules` before starting implement — new code must meet the refactor standards from the moment it is written (including the SRP split `### 3`): 1 unit = 1 reason to change, ≤250 lines, preserve public API, minimal change

### 2. Review Architecture

> Goal: Confirm the architecture before starting

1. Always run `/create-plan-in-dot-devin` (if a plan file already exists → read it and follow it), then run `/deep-review` to inspect boundaries, layers, and data flow
2. When implementing in `packages/`, `crates/`, or `apps/` → run `/follow-architecture` to pick + apply that directory's pattern (`packages/`/`crates/` → `clean`, `apps/` → `layered`)
3. If the architecture is unclear or a big structure change is needed → run `/ask-me` first; identify the critical path: schema → data → API → UX/UI
4. Draft the rollback plan here, before any code or migration is written (confirming it is executable happens in `### 9.6`): the method (`git revert <merge-commit>`, redeploy the previous version, platform rollback), the reverse path for each schema change (down-migration / restore from backup), and the current production version/revision recorded for later comparison — write it into the plan file so a destructive step never runs without one

### 3. Verify And Setup Infrastructure

> Goal: env vars, secrets, CI, and observability are complete and verifiable before implementing

1. Check the database: connection pool, indexes, migrations (pending vs applied via `/deep-review`), backup — and the API server: endpoints, rate limit, CORS, auth
2. Run `/check-secrets env-vars` comparing `.env` / `.env.example` / code usage — update `.env.example` to include every variable the code uses (without real values); if credentials the user must provide are missing → `/ask-me` then stop and wait
3. Store secrets via `/follow-secret-manager` — never commit; inject them into the platform per target (`wrangler secret put`, dashboard, CI secrets); run `/check-secrets secrets-leak` to confirm there is no leak in code/config
4. Check external services: credentials, API keys, endpoints, rate limits
5. Check CI readiness: run `/setup-cicd` or check the existing workflows — lint, typecheck, test, build all present, CI secrets complete; to install our own private package from the registry → store the registry token with `/follow-secret-manager`, then authenticate per package manager (`.npmrc`/`NPM_TOKEN`, `CARGO_REGISTRY_*`); never hardcode the token in the workflow; if CI fails → fix it to green before continuing
6. Wire observability: structured logging for external calls, metrics (response time, error rate), correlation IDs, error tracking/alerting per stack — if there is no standard → `/ask-me`
7. Report a readiness checklist: the app runs locally with real env, migrations applied, external services connect; if the infra is not ready and you cannot fix it yourself → stop, report, and propose options for the user to choose — this sub-flow only prepares readiness; never deploy or modify production resources

### 4. Implement Schema And Data Layer

> Goal: schema, validation, and data layer are complete

1. Create schemas for the missing data models + validation schemas and types; check the type flow: schema → validation schema → API types → UI types
2. Create migrations with a dry-run before applying — if destructive, the user must confirm
3. Replace mock data with real queries — implement repository/queries; if the project uses/chooses an ORM → run `/follow-lib-drizzle` for schema, migrations, queries (other ORM → `/refactor` orm scope)
4. Create a seed script for test/dev; if migrations/seed fail → `/resolve-errors` before continuing

### 5. Implement API And UX/UI Layer

> Goal: API handlers and UX/UI are connected to the real API — every interactive element works end-to-end

1. Implement API handlers that query the real data source with validation, auth middleware, rate limit — if the project uses oRPC → run `/follow-lib-orpc` (contracts, procedures, typed errors); for domain services/error handling with Effect → run `/follow-lib-effect-ts`; check that the API types match the schema and validation schemas
2. Replace mock data in components with real API calls — wire through the project's lib: TanStack → run `/follow-lib-tanstack-ecosystem` (`Query` = server state, `Form` = forms+validation, `Store` = client state)
3. Implement form validation with schemas that match the API and connect the auth UI to the real auth service
4. Sweep the whole UI first — enumerate every route and every interactive element from a real render (not from the source) with `/deep-test website`, then trace each element's code along the chain: handler → API/usecase → data source → persistence; classify as `works`/`fake` (no-op, mock, hardcoded)/`missing` and keep it as a checklist in the plan file
5. Audit the UI so it really works at every point — every button/link/nav/menu/tab/dialog/dropdown works end-to-end, with none of the dead-UI markers listed in `## Scope` left in the render — wire it to a real action or remove it; for each element that is `fake`/`missing` → spawn the `feature-implementer` profile (in `## Subagents`) one item at a time in parallel, with file sets that must not overlap (items sharing a file → serialize them)
6. Cover every UI state — loading, error (with retry), empty, success, disabled-during-submit — every form actually submits and gives clear feedback; if appropriate → optimistic updates; if validation fails → `/resolve-errors`; after implementing again → sweep again with `/deep-test website` — an element that still does not actually work = the work is not done

### 6. Convert TODOs And Placeholders

> Goal: Remove TODO/FIXME/HACK and all placeholders

1. If the project has a `TODO.md` → gather its pending items through `## Input Flows` → `TODO.md` (that bullet owns the artifact — do not parse the table ad hoc here), or `/update-todo-md` to read/enhance the prompt
2. Use every item from `/report-not-implement` (step 1) as the queue — no need to scan for markers yourself again; if you find a new item along the way → add it to the queue immediately; only for hardcoded values the report does not cover → run `/check-secrets hardcoded-values`
3. If the entire input is `TODO.md` → `## Input Flows` → `TODO.md` is also the ordering + status-tracking rule for the whole run
4. Replace MOCK/FAKE/STUB with real implementations per this skill's flow — complete every item in the queue; never choose to do only some items and report it as done; for several independent items → spawn the `feature-implementer` profile one item at a time in parallel (pass it the contracts from steps 4-5); features still `missing` from the `### 5` checklist are handled the same way — only for core business, large net-new work → `/idea-features` + `/create-plan-in-dot-devin` first
5. Implement each feature/fix with `## TDD Loop` — write a failing test that locks the behavior first, then write the code to pass, then refactor in a separate commit
6. Run `/use-lib-effective` before writing a new implementation — use the installed deps or the preferred stack to their full potential; if a new dependency must be added → run `/use-my-packages-on-registry` first to install the packages we publish ourselves on the registry, then use that package's `/follow-lib-*` — only if there is no suitable one, choose an external dep
7. After implement is done → run `/update-todo-md` to update the status of completed items to `done` or `completed`

### 7. Implement Security, Resilience And Observability

> Goal: code is secure, resilient, and observable in production

1. Run `/deep-review` to find vulnerabilities, then fix the findings and re-review to confirm they are all closed
2. Validate/sanitize user inputs, use parameterized queries, never expose secrets — run `/check-secrets secrets-leak` before ship
3. Implement retry logic, exponential backoff, graceful degradation — run `/deep-review` on mutation endpoints to make them retry-safe
4. Run `/deep-review` — no throw without a handler or catch that swallows errors; for newly opened endpoints — prevent abuse/brute force/cost exposure
5. Observability complete per `### 3` — structured logging, metrics, correlation IDs; run `/improve platform` to find gaps across logging/metrics/tracing
6. For reviews across several domains on the same changes → spawn the `review-sweeper` profile (in `## Subagents`) one domain at a time in parallel (read-only), then merge the findings before fixing

### 8. Refactor And Cleanup

> Goal: Improve code quality, check references, and clean up

1. Always run `/refactor` after implementation is done — reduce long files, SRP issues (`### 3` file/SRP bullet), and import/exports so they pass the refactor rules read in step 1
2. Always run `/improve uxui` when the scope has UI and it is wired to actually work per `### 5` — prerequisites: the dev server is running (`/check-open-ports` then `/run-dev`, reuse the one running during the `### 5` sweep) and `scope` = every route + the element checklist from `### 5` plus a browser pass (`/watch-browser fix`) to review the UI as actually rendered; do it until every finding is covered, never only partially — if the project has no UI → it may be skipped with a reported reason
3. Run `/improve` in the other domains touched — the files touched and the related systems (error handling, consistency, stability, a11y per context); not limited to TODO items
4. Run `/update-references` if there is a move/rename/delete; run `/follow-tool-knip` — consider removing or implementing the dead code found
5. Always run `/update-project` after implement + refactor are done — sync docs, config, rules, AGENTS.md, README, and tooling to match the current codebase (never skip, because docs would be stale before the verify gate); run `/update-dot-devin` if the `.devin/` structure changed; `/update-todo-md` if the TODO.md items changed

### 9. Verify, Deploy Gate, Rollback Plan, And Finalize

> Goal: code passes full validation before ship/deploy — green gate, real deploy, real verify, rollback plan ready

1. Close the loop with the same instrument that opened it: re-run `/report-not-implement` on the same scope — the `### 1.4` queue must be fully `completed`/`blocked` (reason stated) and the new scan must report 0 `missing`/`fake`/`partial`/`unwired`/`promised`; any new marker (including one your own code just introduced) = close it before the gate, never gate around it
2. Run `/ship verify-only` as the canonical verify gate (never duplicate the gate yourself — reference `/ship` per the repo's SSOT): run `/deep-review` → `/deep-validate` → `/run-check` → `/update-tests` + `/deep-test all` → `/run-dev` + `/deep-test usage` in full, then stop before push/merge — for test gaps found along the way → `/improve tests` then write/fix specs via `/update-tests`; if the project has a coverage target → `/deep-test coverage` until the target (default 100%)
3. Run `/run-verify` to check scan, format, lint, typecheck, test, build — if it fails → `/resolve-errors` then retry up to 3 times; if it still fails → stop and report, never deploy
4. pre-ship sweep: scan for debug leftovers with `rg "console\.(log|debug)|debugger"`, `/check-secrets secrets-leak` to confirm no secrets leaked, and `/run-audit` to check dependency vulnerabilities
5. Run `/deep-test website` (Roleplay Mode) across every route in the app (not just the routes touched), in this order: routes reachable from the navigation → auth flows → owner/admin surfaces → error/empty/loading states; on a large app close the nav-reachable set first, then deep-link the routes named in the `### 5` checklist — every interactive element, forms valid + invalid, the main flows, with evidence recorded per route; then codify the passing flows into a Playwright suite via `/deep-test e2e` — the Playwright report is the authoritative result
6. Confirm the rollback plan drafted in `### 2.4` is executable, not just a note: re-state the method (`git revert <merge-commit>`, redeploy the previous version, platform rollback) and record the current production version/revision for comparison; if the deploy is destructive (DB migration, breaking API) → `/ask-me` to confirm first
7. If a real deploy is needed: run `/run-deploy` or `/follow-deploy` (dispatches to `deploy-to-<platform>`) — deploy staging/preview first if the platform supports it, always record the deployment URL + version/revision
8. post-deploy verify: smoke test the critical paths on the real production URL, check logs/metrics/error tracking for no error spike, compare behavior against the passing `/run-check` results — if it fails → execute the rollback plan immediately then report
9. If the work is complex or spans multiple workspaces → do an extra deep pass: front-load `/deep-thinking`, `/deep-analyze` for high-impact changes, order the critical path (schema → data → API → UX), and extend the `### 2.4` rollback plan for each batch before it starts
10. If this work implements a GitHub issue I created → `/resolve-github-issue-by-me` to comment the result and close the issue; pending/blocked/deferred work → `/save-to-todo-md` to save the remaining items into `TODO.md`
11. Run `/suggest-next-action` — if everything passes and the user wants to go to production → run the full `/ship` (commit/push → PR review gate → merge `main`) or `/release-new-version` when a version must be released

## TDD Loop

> merged from `/follow-tdd` (from `references/tdd.md`) — applies to every task that creates/changes behavior; can be skipped only for pure docs/config/style edits with no runtime behavior; if the project has no test framework or coverage tooling yet → do `## Setup Coverage` (or `/follow-tool-vitest`/`/follow-tool-nextest`) first; if the behavior contract is unclear → `/ask-me` before writing the test

1. Understand: read the spec/issue/plan item/`TODO.md` row — the expected input/output and error cases must be describable in a single sentence; check the existing tests for that unit — extend instead of duplicating; work one smallest testable behavior at a time (one function, one rule, one endpoint response)
2. Write the failing test: one test = one behavior, name it with scenario + expectation (`rejects expired token`, not `test1`); assert on the real public contract (return value, thrown error, HTTP status, rendered state), not internal calls; running it must fail for the expected reason — passing the first time = the test asserts nothing or the feature already exists; never use placeholder assertions/empty tests
3. Make it pass: write just enough code for the test to pass — no speculative branches, no extra features, no refactor at this stage (Two Hats); run the whole suite, not just the new test — if another test breaks → fix it before continuing; add a dep only once the manifest/catalog sanctions it
4. Refactor: rename, reduce duplication, split by concern — apply `/refactor` `## Rules` + `## Smells → Techniques`; re-run the tests after each refactor step — if the suite goes red midway → revert only that step; stop when the code reads clearly (`/dont-over-engineer`, rule of three); structural changes live in a different commit from the implementation
5. Repeat and integrate: loop steps 2-4 one behavior at a time, `/git-commit` checkpoint on every green cycle; cover the boundary cases the implementation reveals: empty/invalid input, concurrent/duplicate calls, permission denied, upstream failure; property-based/fuzz → `/deep-test property`, database-backed → `/deep-test database`, cross-module contracts → `/deep-test contract`; finishing an item → full suite + `/run-check` + `/run-verify`
- No production code without a failing test that locks the behavior first — a test written after the code cannot prove the behavior is locked; untested legacy code → characterization tests first (`/update-tests`)
- One test asserts one behavior — multiple behaviors in a single test → split; one cycle commits one concern, never mixing refactor/fix/feature; every cycle ends with a green suite, not a visual check; an assertion that can never fail = a dead test → check/fix it via `/deep-test test-correctness`

## Input Flows

> merged from `references/input-flows.md` — if the input is an artifact (plan file, `TODO.md`, loose plan) → convert it into a single task queue first, then return to the main flow (`### 1`–`### 9`); the input is the source of truth for the scope, not the implementation strategy; never do a task that has not been extracted into the queue and never duplicate a task from two sources; update the status in the file immediately when each task is done; pending/blocked work → `/save-to-todo-md` before ending the session

- Plan File (`.devin/temp/plan/<workspace>/<title-date>.md`): identify the file from the argument (path/title; if absent → list them and ask the user to choose) → build the task list from tasks with `status: pending`, order it per `## Execution Order`, then do them one at a time along the critical path (for complex ones → `/create-plan-in-dot-devin` again before starting) → update the status to `in-progress`/`completed` as you go → once every task is `completed` → `/deep-validate` + `/run-verify` → delete the plan file only when the work is complete (never delete before confirming) → report a summary; if the plan must change or a task is high-risk → `/ask-me` first; if the plan needs no file deletion → use the Loose Plan bullet instead
- TODO.md (project root — if absent → stop and report): split the table rows (Title/Description/Status/Priority/Created) → filter `pending`/`in-progress`, sort priority high→medium→low, tasks with no blocker first, created oldest→newest → implement one task at a time with the main flow (for easy tasks whose state already exists → `/continue`; for complex ones → `/create-plan-in-dot-devin` first; if unclear → ask the user) → mark `completed`/`blocked` with a reason immediately, adding sub-tasks when needed → loop until there is no `pending` remaining (`blocked` remaining → report and ask the user) → finish with `/deep-validate` → `/run-verify` → `/ship` → `/report` summarizing every task
- Loose Plan (`AGENTS.md`/`PLAN.md`/general docs — merged from `/follow-plan`, no file deletion needed): read `AGENTS.md` in the project root → if not found → look for `PLAN.md`, `plan.md`, `TODO.md`, or context the user provided → extract steps from headings/bullets/numbered lists (no plan → stop and report) → convert each step into a workflow (`/name`), skill, shell command, or decision + specify order/dependencies (unclear step → ask the user) → build a todo list, do one step at a time (only one `in_progress` at a time), read the actual workflow/skill file before invoking it then follow its `## Execute`, check its `## Expected Outcome` before marking `completed`, and for a workflow with sub-workflows → recurse — do not interpret "do xxx" as a concept, it must actually be done; never do a step not specified in the plan without permission → if a step fails → `/resolve-errors` retry ≤3, still failing → stop + report; if the user permits skipping → mark ⏭️ → once all steps are done → combine the results into a status table (✅/❌/⏭️) then return to the main flow; high-risk steps (deploy, push, delete) → `/ask-me` first, never force push/force merge; pending work → `/suggest-next-action`

## Setup Coverage

> merged from `workflows/setup-coverage/` — dispatched from the `## Scope` argument `setup-coverage`/`coverage`; use it when the project has no coverage tooling yet or needs a fresh setup before starting the TDD loop; supports Bun/Node (vitest), Rust (llvm-cov), Go (built-in), Python (pytest-cov); tooling setup only — writing tests → `/update-tests`, closing coverage gaps → `/improve coverage`

1. Detect ecosystem and state: check the manifest (`package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`), the existing test framework (vitest, cargo test/nextest, go test, pytest), and the existing coverage state (config, devDeps, CI step — idempotent check); if there is no test framework → `/use-related-skills` to find `follow-tool-vitest` etc. first
2. Install per ecosystem (use only the standard tools — never redundant; if unsure about a tool/version → check the official docs before installing, never guess flags): Bun/Node → `@vitest/coverage-v8` (`vitest run --coverage`) · Rust → `cargo-llvm-cov` (`cargo llvm-cov`) · Go → built-in (`go test -coverprofile=coverage.out ./...`) · Python → `pytest-cov` (`pytest --cov`); install via the project's package manager; add a `test:coverage` script in the manifest (per `/follow-test` rules); set up a minimal coverage config — provider, include/exclude patterns, reporters
3. Configure thresholds and output: set the output dir (e.g. `coverage/`) and add it to `.gitignore` — coverage output must never be committed; thresholds per the `/follow-test` level (Minimal 70% / Standard ~85% / Complete ~90%+) if the tool supports it — do not set them so high that they block the TDD loop; reporters: text for the terminal + html/lcov for CI
4. Wire CI and verify: add a coverage step to the CI workflow if there is one — if there is no pipeline yet → `/setup-cicd`; running the coverage command must produce a report successfully; run `/deep-test coverage` to confirm the report is correct (if there is no test suite yet → `/update-tests` before measuring); if it fails → `/resolve-errors` max 3 rounds then stop and report

## Rules

- No Mock In Production — no mock implementations, simulated delay, in-memory stores instead of real services, or silent fallback to mock data in production code; the queue opened in `### 1.2` is closed in full — a promise that cannot be kept is reported blocked/deferred with a reason, never silently dropped (the dead-UI definition is owned by `## Scope`, the zero-new-marker check by `### 9.1`)
- Type And Validation Flow — types flow: schema → validation schema → API types → UI types; use type inference from the schema, do not re-declare types; avoid `any`, use `unknown` instead
- Safety And User Confirmation — destructive migrations require a dry-run + user confirm; if external services are not ready → report options before proceeding; never hardcode secrets/keys — always store them with `/follow-secret-manager`; the gate in `### 9` must be green before deploy, no exception; record the URL + version on every deploy
- Minimal And Maintainable — always read the `/refactor` rules before implementing and always run `/refactor` after implement is done (step 8), never skip; follow `/dont-over-engineer` — before rewriting or when you find duplicates → `/use-lib-effective`; for a new dep → check the packages we own with `/use-my-packages-on-registry` before an external dep; preserve the public API unless it truly must change; files no longer than 250 lines
- Plan Always — every implement task must have a plan from `/create-plan-in-dot-devin` first — never start Step 3 without a plan
- Test First — no production code without a failing test that locks the behavior first; after implementing every item → `/deep-test` every domain touched (`unit`/`integration`/`api`/`e2e`/`website`) until green before entering the verify gate in `### 9` — a test that is not green = the work is not done (cycle order, coverage setup, and commit splitting are owned by `## TDD Loop`)

## Subagents

> Goal: independent work that can be spawned to run in parallel via `/use-subagents` — the profile lives inline here; the parent always aggregates results + checkpoint commits + verifies overall; for inventory gaps use the `gap-scanner` profile of `/report-not-implement` (single owner, do not copy it here)

- `feature-implementer` — implement a single feature/gap item end-to-end (spawn one item at a time in parallel, file sets must not overlap): inputs `item` (a gap item from `/report-not-implement` or a plan file), `files` (the scope it may edit), `contracts` (the types/schemas/API the parent provides as canonical — do not redefine them), `conventions` (stack/libraries/style), `verify-cmd` (e.g. `bun test <path>`, `bun check`); Execute: write a failing test that locks the expected behavior first (TDD) → implement per `item` using existing deps first → wire in `contracts` → run `verify-cmd`, if it fails → fix or report a blocker → remove the old marker once actually implemented; Output: a No./File/Change/Test (`pass`/`fail`/`skipped`)/Notes table + files changed + new deps + markers removed + blockers; Constraints: no new mock/stub/placeholder, do not add deps yourself (if a package that is not installed is needed → return a blocker with a reason, and have the parent run `/use-my-packages-on-registry` first), do not commit/push (the parent checkpoint), never hardcode secrets — if env/credentials are missing → blocker immediately, never `git push`/`rm -rf`
- `review-sweeper` — review changes one domain at a time in parallel (read-only): inputs a single `domain` (`security`/`api`/`test`/`observability`/`resilience`), `scope` (files/diff), `context`; Execute: read the changes → review per the domain checklist (security = injection/authz gaps/secrets leak/input validation, api = validation/error handling/rate limit/retry-safety, test = assertion-less tests/unhandled throws/swallowed errors, observability = logging/metrics/correlation IDs, resilience = retry/backoff/graceful degradation/timeouts) → report findings with severity, do not fix them yourself; Output: a No./Severity (`critical`/`high`/`medium`/`low`)/Location/Finding/Suggested Fix table + verdict `pass`/`pass-with-warnings`/`fail` + blocking count; Constraints: no write/edit, review only the assigned domain, findings must point to a real file:line, never guess

## Expected Outcome

- Know the list of what is not really implemented across the scope from `/report-not-implement` before starting, then close every item (or report it as blocked/deferred with a reason) — the `### 9.1` re-scan comes back with 0 markers, and the queue in the plan file shows every item closed
- No TODO/MOCK/placeholder in production code — including every dead UI point; schema, validation, types, API, UX/UI are complete and connected
- Every interactive element actually works end-to-end — verified by a real click-through in the browser
- Improvements around the scope are found and fixed comprehensively via `/improve`; the UI passes `/improve uxui` on a real render with every finding covered (or skipped with a reason if there is no UI); any needed new dep is chosen via `/use-my-packages-on-registry` before an external dep, verified in the manifest/lockfile
- Infrastructure is production-ready: security, observability, resilience — env/secrets complete, CI green, observability wired
- Passes the canonical verify gate `/ship verify-only` in full (including `/deep-test all` and `/run-verify`) with a handoff to `/ship` or `/release-new-version`; if deployed → post-deploy verify passes with URL + version
- Has a rollback plan drafted in `### 2.4` before any destructive step ran and confirmed executable in `### 9.6`, plus a green suite per `## TDD Loop` for every behavior implemented
