# Deep Test — Website Domain

Click-through every route and element in a real browser — pick the tool by context, then promote invariants into authored tests (merged from `/test-website` and `/watch-browser-and-test`)

Signals: dev/staging/production URLs, route manifests, sitemaps, nav links; post-implement and pre-release sweeps

- Codified regression suite → `/deep-test e2e`; deep WCAG/axe → `/deep-test a11y`; docs usage examples → `/deep-test usage`; isolated component render → `/deep-test component`; continuous watch + fix console errors → `/watch-browser fix`
- This domain picks the tool — it is not a tool manual; commands and don'ts come from `/use-agent-browser`, `/use-playwriter`, `/use-chrome-devtools` as chosen

## 1. Select Tool

> Goal: pick the browser tool that fits the context — capabilities overlap, the difference is context

| Context | Tool |
|---|---|
| Default — dev/staging/public, reproducible, never touches the user's browser | `/use-agent-browser` (`open`/`snapshot -i`/`click @e1`/`console`/`errors`) |
| Needs the user's login state / cookies / extensions | `/use-playwriter` (`session new` + `state.page` + `snapshot`) |
| The target should already be a permanent authored suite | `/deep-test e2e` → `/follow-tool-e2e` or `/follow-tool-playwright` (dispatch and stop) |
| Sweep found a bug needing deep console/network/CSS/perf inspection | `/use-chrome-devtools` (hand off the investigation, then return) |

1. Site needs auth but no usable login state exists → ask the user: log in in Chrome and use playwriter, or set up `storageState` via `/follow-tool-playwright`
2. Never default to playwriter just because it "feels familiar" — it touches the user's real Chrome and always carries cost/risk

## 2. Discover Routes And Setup

> Goal: have the route list and a ready browser session

1. Take URLs from the argument or derive them from the sitemap/routes manifest/nav links — unclear → `/ask-me`
2. Testing local dev → run `/run-dev` first, then wait for the port to be ready
3. Set up per the tool chosen in step 1 — `agent-browser`: `agent-browser open <base-url> --session test`; `playwriter`: per `/use-playwriter` (`session new --tab-group test` + `state.page = await context.newPage()`)

## 3. Route Sweep

> Goal: visit every route with evidence

```bash
# agent-browser (default)
agent-browser --session test open "<base>/<route>" && agent-browser --session test wait --load networkidle && agent-browser --session test snapshot -i && agent-browser --session test console
```

```js
// playwriter — 1 route per -e call
await state.page.goto('https://<host>/<route>', { waitUntil: 'domcontentloaded' })
await waitForPageLoad({ page: state.page, timeout: 8000 })
console.log('URL:', state.page.url())
console.log('Logs:', await getLatestLogs({ page: state.page, sinceLastCall: true }))
await snapshot({ page: state.page }).then(console.log)
```

1. Record per route: HTTP status, final URL (redirects), console errors, `[PAGE ERROR]`, missing/empty content
2. Snapshot for blockers (cookie modal, login wall, error page) first — dismiss, then re-snapshot
3. Broken route (4xx/5xx/wrong redirect) → record severity and continue; never halt the whole sweep

## 4. Interact And States

> Goal: every interactive element really works

1. On every route: click nav links, menus, tabs, dialogs per snapshot locators — never guess selectors; take them from snapshot output
2. Forms: submit both valid + invalid — verify validation messages, loading/disabled states, success feedback
3. Check for dead UI: `onClick` that does nothing, `href="#"`, "coming soon" — record as a finding (wire it or remove it per `/implement-to-production`)
4. Check states: loading, error (retry), empty, success — after every action read `getLatestLogs` + re-snapshot
5. Click timeout → snapshot for an overlay/modal blocker — never `{ force: true }`/`dispatchEvent`

## 5. Collect Findings And Report

> Goal: summarize per route with evidence

1. Consolidate findings as a route table — Route/Status/Console Errors/Dead UI/State Issues/Severity
2. Severity: Critical (route broken, form submit fails, console errors), High (dead interactive element, missing error state), Medium (missing empty/loading, minor UI), Info
3. Report with `/report-review` (a table in chat); failures that must be fixed → `/resolve-errors`; persist evidence → `.devin/temp/report/<workspace>/website-test-<time>.md`
4. Promote invariants — permanent expectations (login works, checkout never 500s, critical route renders) → write them as authored tests in the repo via `/follow-tool-playwright` or `/follow-tool-e2e` (test infra exists → write now; not yet → propose to the user); purely exploratory one-off checks may be discarded
5. Cleanup per tool — `agent-browser`: `agent-browser close --session test` + delete temp profiles/files; `playwriter`: close only the pages you created, remove your own listeners — never `browser.close()`/`context.close()`

## 6. Roleplay Mode (user-roleplay subagents per route)

> Goal: dispatch subagents split by route to roleplay as real users exercising the app — clicking buttons, links, and forms along their flows — then aggregate a pass/fail report and fix whatever fails (merged from `/watch-browser-and-test`; use when exploration must cover every real action/flow, not just a sweep)

1. Server first — confirm the target works via `/watch-browser` (open, screenshot, console/errors); unresponsive → `/run-dev` or `/resolve-errors`; needs auth/seed data → prepare test credentials/fixtures before dispatching
2. Route checklist — never skip any route: `agent-browser snapshot -i` for nav links, cross-check route definitions in code, include dynamic routes (a sample param per pattern), nested, error, and auth-gated routes
3. Dispatch per `/use-subagents` — batch 3-5 routes per agent (parallel multi-session via `agent-browser --session <name>`), each agent required to: open route → `snapshot -i` → try every action (click buttons/links, submit forms valid + invalid, toggles, pagination, search, filters), follow sensible flows (list → detail → edit → save → back), capture evidence at every step (screenshot before/after, console errors, network fails), record PASS/FAIL per action with repro steps
4. Aggregate — every route in the checklist must have a result (dispatch more agents for missing ones); dedupe failures sharing a root cause (shared component, API endpoint); rank severity: Critical (main flow broken), High (action not working), Medium (minor wrong behavior), Low (cosmetic)
5. Fix FAILs in order Critical → Low using agent evidence — same root cause → fix once, not route by route; dead UI / unimplemented features (handlers missing, mock data, TODO) → `/implement-to-production` for the whole scope, then return to retest; multi-file fix → `/resolve-errors` for lint/typecheck; environment/config failures → report separately, don't fix in code
6. Retest — reload, replay only the failed actions; all PASS → step 7; still FAIL → loop back to step 5 (max `3` rounds)
7. Codify into Playwright — when everything passes, run `/update-tests` to write specs from the flows just tested, then `/deep-test e2e` against the real suite — the Playwright report is the authoritative e2e result; suite setup broken → skip and state results are exploratory only
8. Report — scenarios pass/fail table (`No.`, `Scenario`, `Result`, `Duration`, `Failure Point`, `Evidence`), flaky signals in a separate section (≥ 2 runs with differing results), verdict `all-pass` / `has-failures` / `flaky`; persist → `.devin/temp/report/<workspace>/browser-test-<time>.md` marked exploratory (not a suite result); list coverage gaps (untested actions, e.g. auth-gated, payment); close session, then `/suggest-next-action`

## Rules

### 1. Tool Rules Apply

- Always follow the `## Rules` of the chosen tool — `agent-browser`: prefer `@ref`, wait before interact, capture on failure; `playwriter`: snapshot before screenshot, observe→act→observe, never damage the user's browser, absolute artifact paths

### 2. Explore Then Assert

- Sweep ad-hoc first (exploration is disposable) → promote the invariants into authored tests; never let an important expectation vanish with the session

### 3. Evidence Required

- Every finding needs evidence: URL + snapshot excerpt/console log + severity — never vague claims

### 4. Non-Destructive

- Never submit real data with side effects (payment, delete, publish) without confirm; always use test data

### 5. Full Coverage Over Depth

- Cover every route before going deep — sweep wide first, then interact-deep on key routes

### 6. Roleplay Rules (Mode 6)

- agents must truly interact via the browser (click, type, submit) — never "test" by reading code
- test every interactive element found in the snapshot — not only the happy path; include negative cases (invalid input, empty states, permission denied)
- every FAIL needs repro steps + screenshot + console errors; screenshots/evidence go to the OS temp dir — never committed
- never trigger truly destructive actions (delete data, payments, emails) — mock or skip and record as untested; test data/credentials only
- fix-retest loop max `3` rounds; `timeout` = `900` seconds per batch, `maxRetries` = `3` per agent crash
- separate product bugs from test bugs (selector drift, timing)

## Expected Outcome

- The tool is chosen by context (agent-browser default, playwriter when login state is required)
- Every route is visited with URL/status/console evidence
- Key interactive elements are really clicked/submitted with state verification
- Findings table complete with severity + evidence per route
- Invariants promoted into authored tests or proposed to the user if infra does not exist yet
- Session/browser left clean at the end, per the tool used
- Roleplay Mode: every route roleplay-tested across its interactive elements with evidence; PASS/FAIL per action + fixes + retest results; passing flows codified into Playwright as the authoritative result
