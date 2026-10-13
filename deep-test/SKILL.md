---
name: deep-test
description: Deep testing — API, CLI, contract, coverage, e2e, integration, mutation, visual domains
argument-hint: "[domain] [scope]"
related:
  - deep-thinking
  - deep-analyze
  - run-test
  - deep-validate
  - review-test
  - update-tests
  - resolve-errors
  - follow-tool-playwright
  - follow-tool-hurl
  - follow-tool-bruno
  - follow-tool-stryker-mutator
  - use-agent-browser
  - use-chrome-devtools
  - capture
  - report
  - suggest-next-action

---

## Goal

Run deep/domain-specific testing — beyond the unit tests of `/run-test` — covering API, CLI, contract, coverage, E2E, integration, mutation and visual testing in one skill (merged — there are no separate `deep-test-*` skills anymore)

## Scope

Use when tests must go deeper than unit tests — multi-layer, external systems, browsers, contracts, or mutation analysis

- `/run-test [domain]` = run-only test runners in one skill — unit default + domain args `all`, `api`, `cli`, `contract`, `coverage`, `e2e`, `integration`, `mutation`, `visual` (merged inline in `## Merged Details`; `all` = orchestrator runs every suite together)
- `/deep-test <domain>` = deep domain analysis/workflow — pick the domain workflow from the table and follow that reference
- Edit/update test specs → `/update-tests` (this skill is run-only and does not write tests)
- Out-of-scope pointers: load/perf → `/test-load`, other run-only domains (`smoke`, `component`, `a11y`, `property`, `database`, `mobile`) → `/run-test <domain>` → `/test-<domain>`, interactive browser watch + roleplay → `/watch-browser-and-test`, test isolation/flaky audit → `/review-test`

## Execute

### Domain Workflows

| Domain | Reference | Coverage |
|--------|-----------|----------|
| api | [references/api.md](references/api.md) | REST/GraphQL/tRPC/WebSocket endpoints, response contract checks, Bruno/Hurl/Schemathesis, all-routes check (`scripts/check-routes.*` + profile `route-checker` in `## Subagents`) |
| cli | [references/cli.md](references/cli.md) | CLI commands, exit codes, stdout/stderr, flags, error paths |
| contract | [references/contract.md](references/contract.md) | consumer/provider contract verification, drift detection |
| coverage | [references/coverage.md](references/coverage.md) | coverage analysis, thresholds, gap loop until 100% |
| e2e | [references/e2e.md](references/e2e.md) | Playwright browser tests, all routes, agent-browser exploratory, chrome-devtools-mcp debug |
| integration | [references/integration.md](references/integration.md) | module interactions, data flow, test DB/services |
| mutation | [references/mutation.md](references/mutation.md) | mutation testing, surviving mutants, weak assertions |
| visual | [references/visual.md](references/visual.md) | visual regression, screenshot diff vs baseline |

### Flow

1. Run `/deep-thinking` to analyze scope, test goals, and pass/fail criteria before starting
2. Determine the domain from the argument (e.g. `/deep-test api` → follow `references/api.md`)
3. If no domain is given or it is unknown → use `/ask-me` to pick a domain
4. To run every domain → `/run-test all`
5. Follow the Execute + Rules in that domain's reference
6. Fix failures through `/resolve-errors` — never suppress; if the root cause is unclear → gather evidence like `/deep-analyze` (exit code, log, screenshot) before handing off

## Rules

- Always start with `/deep-thinking` and summarize results from real run evidence like `/deep-analyze`; never guess
- Every domain must be pre-checked with the review skill matching its domain before running, per the global rules (`/review-api` for api, `/review-test` for the rest)
- Every domain uses test isolation, cleans up side effects, and reports results per its reference
- Use /review-test if needed
- Use /run-test all if needed
- Use /suggest-next-action if needed
- Use /deep-validate if needed
- Use /follow-tool-playwright if needed
- Use /follow-tool-hurl if needed
- Use /follow-tool-bruno if needed
- Use /follow-tool-stryker-mutator if needed
- Use /use-agent-browser if needed
- Use /use-chrome-devtools if needed
- Use /capture if needed

## Subagents

> Goal: independent work that can be spawned to run in parallel — the profile lives right in this section, no separate file needed

### route-checker — test one API route group and return pass/fail per route with evidence

- **Inputs**: `route-group` (the list of routes it owns, e.g. `GET /api/users`, `GET /api/users/{id}`), `base-url` (target, e.g. `http://localhost:3000`), `method-policy` (safe methods only by default, or `allow-write` once the user confirms), `headers` (optional — auth headers, e.g. `Authorization: Bearer <token>`; the parent must mask before reporting), `timeout`/`slow-threshold` (optional — default timeout and `slow` threshold)
- **Tools**: `exec` — run `bun <skill-dir>/scripts/check-routes.ts` or the `scripts/check-routes.ps1` fallback (only `bun *check-routes.ts *` and `*check-routes.ps1 *` are allowed), `read` — read the manifest/results file
- **Execute**: 1) write the group's route list to a temp routes file or pass it via `--routes` 2) run `bun scripts/check-routes.ts --base <base-url> --routes-file <file> --out <result-file>` 3) dynamic segments `{id}` are replaced with `1` by the script 4) classify each route: `ok` (2xx/expected), `redirect` (3xx), `protected` (401/403), `slow` (>3000ms), `critical` (4xx/5xx/timeout/DNS/TLS), `skipped` (non-safe method), `missing` (404) 5) if every route fails with the same pattern → flag it as a group-level issue (e.g. wrong base path), not per-route
- **Output**: a per-route table `| No. | Method | Route | Status | Expected | Time (ms) | Severity | Evidence |` ending with a group summary (tested, skipped, ok, protected, critical, missing) plus the persisted result file path
- **Constraints**: fire only `GET`/`HEAD`/`OPTIONS` unless the parent passes `allow-write` confirmed by the user; never fire at production if the parent did not state confirmation; always mask credentials/tokens — never return real secrets; every route must have a tested or skipped result with a reason — never guess a status; only handle the assigned route group, do not fire routes outside the group; read-only — no `write`/`edit`

## Expected Outcome

- the selected domain is run through its reference workflow to completion
- failures are classified and routed to the suitable fix skill
