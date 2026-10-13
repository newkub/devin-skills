---
name: test-website
description: Click-through every route/element in a real browser — pick tool by context (agent-browser default)
argument-hint: "[url-or-routes...]"
allowed-tools:
  - read
  - grep
  - glob
  - exec
  - ask_user_question
related:
  - use-agent-browser
  - use-playwriter
  - use-chrome-devtools
  - follow-tool-playwright
  - follow-tool-e2e
  - test-e2e
  - test-a11y
  - watch-browser-and-test
  - run-dev
  - run-test
  - resolve-errors
  - report

---

## Goal

Test a website with a real-browser click-through — every route, nav, forms, dialogs, states, with console/page error evidence before ship — pick the browser tool by context, then promote invariants into authored tests

## Scope

For exploratory/real-browser website verification — dev server, staging, production URLs; suited to a smoke sweep of every route before release, post-implement verification, and sites that need real login state

- Boundary: codified regression suite → `/test-e2e`; deep a11y → `/test-a11y`; docs usage examples → `/test-usage`; unit/api → `/run-test <domain>`; this job = a real ad-hoc sweep + promoting findings
- This skill picks the tool — it is not a tool manual; tool-specific commands/don'ts/rules are read from `/use-agent-browser` `/use-playwriter` `/use-chrome-devtools` as chosen

## Execute

### 0. Select Tool

> Goal: Pick the browser tool that fits the context — capabilities overlap, the difference is context

| Context | Tool |
|---|---|
| **Default** — dev/staging/public, reproducible, never touches the user's browser | `/use-agent-browser` (`open`/`snapshot -i`/`click @e1`/`console`/`errors`) |
| Needs the user's login state / cookies / extensions | `/use-playwriter` (`session new` + `state.page` + `snapshot`) |
| The target should already be a permanent authored suite | `/test-e2e` → `/follow-tool-e2e` or `/follow-tool-playwright` (not this skill's job — dispatch and stop) |
| Sweep found a bug needing deep console/network/CSS/perf inspection | `/use-chrome-devtools` (hand off the investigation, then return) |

1. If the site needs auth but no usable login state exists → ask the user to choose: log in in Chrome and use playwriter, or set up `storageState` via `/follow-tool-playwright`
2. Never default to playwriter just because it "feels familiar" — playwriter touches the user's real Chrome and always carries cost/risk

### 1. Discover Routes And Setup

> Goal: Have the route list and a ready browser session

1. Take URLs from the argument or derive them from the sitemap/routes manifest/nav links — unclear → `/ask-me`
2. If testing local dev → run `/run-dev` to start the server first, then wait for the port to be ready
3. Set up according to the tool chosen in Step 0 — `agent-browser`: `agent-browser open <base-url> --session test` ; `playwriter`: per `/use-playwriter` Step 1-2 (`session new --tab-group test` + `state.page = await context.newPage()`)

### 2. Route Sweep

> Goal: Visit every route with evidence

For each route — observe → act → observe with the chosen tool:

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
2. snapshot for blockers (cookie modal, login wall, error page) first — dismiss, then re-snapshot
3. broken route (4xx/5xx/wrong redirect) → record severity and continue; never halt the whole sweep

### 3. Interact And States

> Goal: Every interactive element really works

1. On every route: click nav links, menus, tabs, dialogs per snapshot locators — never guess selectors; take them from snapshot output
2. forms: submit both valid + invalid — verify validation messages, loading/disabled states, success feedback
3. Check for dead UI: `onClick` that does nothing, `href="#"`, 'coming soon' — record as a finding (wire it or remove it, per `/implement-to-production` rules)
4. Check states: loading, error (retry), empty, success — after every action read `getLatestLogs` + re-snapshot
5. click timeout → snapshot for an overlay/modal blocker — never `{ force: true }`/`dispatchEvent`

### 4. Collect Findings And Report

> Goal: Summarize per route with evidence

1. Consolidate findings: `[ ]` route table — Route/Status/Console Errors/Dead UI/State Issues/Severity
2. severity: Critical (route broken, form submit fails, console errors), High (dead interactive element, missing error state), Medium (missing empty/loading, minor UI), Info
3. Run `/report` with a table + suggested fixes; failures that must be fixed → `/resolve-errors`
4. **Promote invariants** — checks that are permanent expectations (login works, checkout never 500s, critical route renders) → write them as real authored tests in the repo via `/follow-tool-playwright` or `/follow-tool-e2e` (test infra exists → write now; not yet → propose to the user); purely exploratory one-off checks may be discarded, no obligation to keep them
5. cleanup per tool — `agent-browser`: `agent-browser close --session test` + delete temp profiles/files; `playwriter`: close only the pages you created, remove your own listeners — never `browser.close()`/`context.close()` per the `/use-playwriter` rules

## Rules

### 1. Tool Rules Apply

- Always follow the `## Rules` of the chosen tool — `agent-browser`: prefer `@ref`, wait before interact, capture on failure; `playwriter`: snapshot before screenshot, observe→act→observe, never damage the user's browser, absolute artifact paths

### 1.1 Explore Then Assert

- Sweep ad-hoc first (exploration is disposable) → promote the invariants found into authored tests via `/follow-tool-playwright`/`/follow-tool-e2e` — never let important expectations vanish with the session

### 2. Evidence Required

- Every finding needs evidence: URL + snapshot excerpt/console log + severity — never report vague claims

### 3. Non-Destructive

- Never submit real data with side effects (payment, delete, publish) without confirm; always use test data

### 4. Full Coverage Over Depth

- Cover every route before going deep — sweep wide first, then interact-deep on key routes

- Use /watch-browser-and-test if needed
- Use /test-e2e if needed
- Use /test-a11y if needed
- Use /run-test if needed

## Expected Outcome

- The tool is chosen by context (agent-browser default, playwriter when login state is required)
- Every route is visited with URL/status/console evidence
- Key interactive elements are really clicked/submitted with state verification
- Findings table complete with severity + evidence per route
- Invariants promoted into authored tests (`/follow-tool-playwright`/`/follow-tool-e2e`) or proposed to the user if infra does not exist yet
- Session/browser left clean at the end, per the tool used
