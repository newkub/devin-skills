---
name: watch-browser-and-test
description: Watch browser, confirm server, then per-route subagents roleplay user testing real actions/flows
argument-hint: "[url|report]"
related:
  - watch-browser
  - watch-browser-and-fix
  - implement-to-production
  - use-agent-browser
  - use-chrome-devtools
  - use-subagents
  - resolve-errors
  - run-dev
  - run-test
  - update-tests
  - create-report-in-dot-devin
  - update-docs
  - report
  - suggest-next-action
  - test-website
  - test-e2e

---

## Goal

Watch a page via `agent-browser` to confirm the web server works, then dispatch subagents split by route to roleplay as real users exercising the app — clicking buttons, links, and forms along their flows — then aggregate a pass/fail report and fix whatever fails

## Scope

Use when you need exploratory/functional testing through a real browser covering every route — unlike `/run-test` (e2e), which runs a pre-written test suite (this skill is manual-style exploration through subagents)

- If you want to review/improve UX/UI on every route → `/deep-review` (domain `review-uxui`)
- If you want to fix console/page errors → `/watch-browser-and-fix`
- If most FAILs are dead UI / unimplemented features (buttons without handlers, mock/placeholder data, TODO) → hand off to `/implement-to-production` instead of fixing point by point
- If a Playwright suite already exists → `/run-test` (e2e)
- Select the browser tool per `/use-chrome-devtools` `## Tool Selection` — interact/debug via `chrome-devtools-mcp` (if registered) or the `agent-browser` CLI; parallel multi-session across subagents → `agent-browser --session <name>`
- If there is no browser MCP server → fall back to `/use-agent-browser` (CLI)

## Execute

### 1. Verify Web Server

> Goal: Confirm the server works before testing

1. Run `/watch-browser` — open the target URL, capture a screenshot, check console/errors
2. If the server is unresponsive → run `/run-dev` or `/resolve-errors`, then return to this step
3. If the app needs auth/seed data → prepare test credentials/fixtures before dispatching

### 2. Discover Routes

> Goal: Know every route that must be tested — never skip any route

1. `agent-browser snapshot -i` to find nav links
2. cross-check route definitions in the codebase
3. Build a checklist of every route — include dynamic routes (a sample param per pattern), nested routes, error routes, and auth-gated routes (log in before testing — they still must be covered)

### 3. Dispatch User-Roleplay Subagents

> Goal: Test for real in parallel across every route — every route needs an agent covering it

Follow `/use-subagents` — spawn subagents covering every route in the checklist (batch 3-5 routes per agent for parallelism, but never drop a route), each roleplaying as a user and each required to:

1. `agent-browser open <route>` then `snapshot -i` to find all interactive elements
2. Try every action found: click buttons/links, submit forms (valid + invalid input), toggle controls, pagination, search, filters
3. follow sensible flows — e.g. list → detail → edit → save → back
4. capture evidence at every step: screenshot before/after each action, console errors, network failures
5. record PASS/FAIL per action with repro steps when FAIL

### 4. Aggregate Results

> Goal: Merge test results from every agent — every route in the checklist must have a result

1. Check the checklist — dispatch more agents for any route without a report (never leave a route untested)
2. Aggregate the report: route → actions tested → PASS/FAIL + evidence
3. dedupe failures that share the same root cause (e.g. a shared component, an API endpoint)
4. Rank severity: Critical (main flow broken), High (action not working), Medium (minor wrong behavior), Low (cosmetic)

### 5. Fix Failures

> Goal: Fix every FAIL at its root cause

1. Fix in order Critical → Low — using evidence from the agents (screenshots, console, repro steps)
2. failures from the same root cause → fix once, don't patch route by route
3. failures that are dead UI / unimplemented features (buttons without handlers, mock data, TODO placeholders) → run `/implement-to-production` to cover the whole scope instead of fixing element by element — then return to retest
4. If a fix touches multiple files → `/resolve-errors` to check lint/typecheck after the fix
5. failures caused by environment/config → report separately, don't fix in code

### 6. Retest

> Goal: Confirm the fixes by testing again

1. `agent-browser reload` then replay only the failed actions
2. All FAILs become PASS → go to Step 7; still FAIL → loop back to Step 5 (max 3 rounds)

### 7. Codify Into Playwright

> Goal: The passing exploratory pass gets promoted into a real e2e suite — suite results are authoritative

1. If everything PASSES → run `/update-tests` to write/update Playwright specs from the flows just tested
2. Run `/run-test` (e2e) against the real suite — the Playwright report is the real test result for `/update-docs`
3. If the suite setup doesn't work → skip it and state in the report that results are exploratory only

### 8. Report

> Goal: Deliver the test results

1. Follow `## Merged Details → report-status` — scenarios pass/fail, failure evidence, flaky signals
2. persist raw exploratory results → `.devin/temp/report/<workspace>/browser-test-<time>.md` per the `/create-report-in-dot-devin` format — state clearly that it is exploratory (not a suite result); the authoritative e2e result = the Playwright report from Step 7
3. List coverage gaps — actions not yet tested (e.g. auth-gated, payment)
4. Close the browser session with `agent-browser close`
5. Run `/suggest-next-action`

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `## Merged Details → report-status` — test watch report (pass/fail, flaky, verdict) |

1. If the argument is `report`/`status` → follow `## Merged Details → report-status` — use the existing session data
2. If not specified → do Steps 1-8 as usual, with Step 8 reading `## Merged Details → report-status` to execute

## Rules

### 1. Server Before Test

- must confirm the server via `/watch-browser` before dispatching — never skip
- a route that 404s/errors on open → FAIL immediately with screenshot evidence

### 2. Real Interactions Only

- agents must truly interact via `agent-browser` (click, type, submit) — never "test" by reading code
- save screenshots/evidence to the OS temp dir (`$env:TEMP`/`os.tmpdir()`) — never commit them to the repo
- every FAIL must have repro steps + screenshot + console errors

### 3. Coverage Discipline

- test every interactive element found in the snapshot — don't pick only the happy path
- include negative cases: invalid form input, empty states, permission denied

### 4. Non-Destructive Testing

- never trigger truly destructive actions (delete data, payments, emails) — mock them or skip and record as untested
- use test data/credentials only

### 5. Loop Limit

- the fix-retest loop runs at most `3` rounds — if still FAILing, stop and report
- `timeout` = `900` seconds per batch, `maxRetries` = `3` per agent crash
- `/watch-browser-test` — the alias is already merged into this skill (the stub was removed; use `/watch-browser-and-test` directly)


## Merged Details

### report-status

##### Goal

Turn the `/watch-browser-and-test` session into a report — test scenarios that passed/failed with failure evidence

##### Scope

- Use when `/watch-browser-and-test` dispatches to `report`/`status` or when invoked after a session ends
- Output: a table in the chat, or a persistent artifact via `/create-report-in-dot-devin`

##### Execute

###### 1. Collect Test Results

> Goal: Aggregate results per scenario

1. Aggregate per scenario: pass/fail, duration, failure point (the step that broke)
2. Aggregate evidence per failure: screenshot, console error, network fail
3. flag flaky signals: sometimes passes, sometimes fails across runs

###### 2. Build Report

> Goal: Answer whether the critical flows work

1. Table: `No.`, `Scenario`, `Result`, `Duration`, `Failure Point`, `Evidence`
2. Summary: pass rate, slowest scenarios, failures by cause
3. Flaky scenarios in a separate section

###### 3. Verdict

> Goal: Judge test health

1. Verdict: `all-pass` / `has-failures` / `flaky`
2. failures → recommend `/resolve-errors` or `/deep-review`, then fix per `## Fix` (flaky)
3. If it must be archived → run `/create-report-in-dot-devin`

##### Rules

- a failure must have evidence (screenshot/console) — not just a status
- separate product bugs from test bugs (selector drift, timing)
- a flaky scenario needs at least 2 runs with differing results before flagging

##### Expected Outcome

- Test report with per-scenario results + flaky signals + verdict
- Use /test-website for the route sweep on the next iteration; an authored suite → /test-e2e

## Expected Outcome

- Every route is roleplay-tested across its interactive elements with evidence
- The report summarizes PASS/FAIL per action + fixes made + retest results
- raw exploratory results are persisted in `.devin/temp/report/<workspace>/` (marked exploratory — not a suite result)
- passing flows are codified into Playwright specs and run for real — the Playwright report is the authoritative e2e result
- fixed failures are retested until they pass, or remaining issues are clearly reported
- coverage gaps and untested areas are identified

