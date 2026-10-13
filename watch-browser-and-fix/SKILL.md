---
name: watch-browser-and-fix
description: Open a browser, continuously watch console/errors, fix them, and confirm the web server
argument-hint: "[url|report]"
related:
  - watch-browser
  - watch-browser-and-test
  - use-chrome-devtools
  - resolve-errors
  - run-dev
  - run-program

---

## Goal

Open a browser and continuously watch console messages and page errors, fix every error found at its root cause, then confirm the web server works — merged from `/watch-browser-fix` + `/watch-browser-console` — use `chrome-devtools-mcp` when it is registered (its tools cover everything needed for watch+fix) or the `agent-browser` CLI as a fallback per `/use-chrome-devtools` `## Tool Selection`

## Scope

Use for browser automation that needs to monitor a web page, catch and fix console/page errors, and ensure the web server keeps working

- If the focus is console watching only, without fixes → do Steps 1-3 + the watch loop only
- If you want to roleplay a user testing actions/flows on every route → `/watch-browser-and-test`
- If you want to analyze UX/UI from screenshots → `/deep-review`

## Execute

### 1. Select Browser Tool

> Goal: Prepare a ready-to-use browser tool — prefer the registered MCP

1. `mcp_list_servers` — if `chrome-devtools-mcp` is present → use that server per `/use-chrome-devtools` (`new_page` + `list_console_messages` + `list_network_requests` + `take_screenshot` + `get_css_styles` cover watch+fix), then skip to Step 2, replacing `agent-browser` commands with the matching MCP tools
2. No MCP available → check `agent-browser --help`; if not installed → `bun add -g agent-browser` then `agent-browser install`
3. If installation fails or `daemon` errors occur → use the `browser-preview` tool instead

### 2. Open Browser And Clear State

> Goal: Open the browser in a clean state before watching

1. Start the dev server if needed (`npm run dev`, `bun dev`, etc.)
2. Open the URL with `agent-browser open <url> --headed` — if it won't open → `browser-preview`
3. Use `agent-browser console --clear` and `agent-browser errors --clear`
4. Use `agent-browser screenshot` to save a baseline

### 3. Watch Console And Errors

> Goal: Monitor continuously and catch errors as they occur

1. Use `agent-browser console` to view console messages
2. Use `agent-browser errors` to view page errors
3. Use `agent-browser snapshot -i` to view interactive elements
4. Repeat every `5` seconds, checking for new console/errors — record only the changed delta
5. New error → capture the stack trace + screenshot before acting

### 4. Identify Root Cause

> Goal: Know what causes the error

1. Classify the error: runtime, network, auth, build, environment
2. Check file/line from the stack trace
3. Check network requests with `agent-browser network` (or `list_network_requests`/`get_network_request` in devtools-mcp) — response status/body if the error comes from an API
4. CSS/layout errors → `get_css_styles` (devtools-mcp) to view matched/overridden rules — if `agent-browser` can't do it, use `evaluate_script` or inspect the element instead
5. Run `/deep-debug` if tracing is needed

### 5. Fix Errors

> Goal: Fix the errors found at their root cause

1. Before fixing → checkpoint with `git stash` (rollback safety)
2. Fix the root cause, don't suppress — run `/resolve-errors`
3. If the fix creates new errors → `git stash pop` to restore, then re-analyze
4. If it's an environment issue → `/ask-me`; a build issue → `/resolve-errors` then rebuild
5. If it can't be fixed immediately → record a workaround and keep watching

### 6. Confirm And Re-capture

> Goal: Confirm the errors are gone and the server works

1. Reload with `agent-browser reload`, then check `console`/`errors` again
2. Use `agent-browser screenshot` to save the post-fix state
3. If the web server is down → `/run-dev` or `/run-program`
4. Check the `/` route and other critical routes — return to Step 3 and keep watching until the timeout

### 7. Report

> Goal: Summarize the results

1. Follow `### report-status` — console messages grouped, issues found vs fixed, before/after evidence
2. persist raw results → `.devin/temp/report/<workspace>/browser-fix-<time>.md` per the `/create-report-in-dot-devin` format
3. Close the browser with `agent-browser close`

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `### report-status` — watch/fix report (grouped errors, found vs fixed, verdict) |

1. If the argument is `report`/`status` → follow `### report-status` — use the existing session data
2. If not specified → do Steps 1-7 as usual

## Rules

### 1. Continuous Monitoring

- poll interval = `5` seconds — never poll faster than this
- record only the delta — don't re-report state identical to the previous poll
- always run `agent-browser console --clear` / `errors --clear` before starting a new watch

### 2. Capture Before Fix

- save screenshots to the OS temp dir (`$env:TEMP`/`os.tmpdir()`) — never commit them to the repo
- require a screenshot + console/errors log before reporting or fixing — no fixing without evidence

### 3. Root Cause Fix

- fix the root cause, not suppression — if suppression is truly necessary, record a TODO with the reason
- don't use `// @ts-ignore` or `eslint-disable` without need
- before fixing with `/resolve-errors` → `git stash` checkpoint; if the fix creates new errors → `git stash pop`

### 4. Circuit Breaker

- the same error recurring ≥ `3` times after a fix → stop and report that the fix didn't work — record the error fingerprint (file + line + message)
- new errors growing after a fix → stop after `3` rounds
- `maxErrors` = `20` before stop and report

### 5. Timeout And Retry Limits

- `timeout` = `600` seconds (10 minutes) for the whole session
- `maxRetries` = `3` for `agent-browser` crash recovery

### 6. Graceful Shutdown

- stop immediately when the user presses `Ctrl+C` — close with `agent-browser close` before finishing; don't leave the daemon running
- save the final state before stopping

### 7. Fallback Order

- no `chrome-devtools-mcp` → `agent-browser` CLI → `browser-preview` tool → ask the user to install
- environment issue → `/ask-me`; build issue → `/resolve-errors`

## Merged Details

### report-status

#### Goal

Report the watch/fix session — console messages grouped, errors found vs fixed, verdict with evidence

#### Execute

1. group console messages by type (error, warning, info) and source (file/component)
2. table of `No.`, `Error`, `Type`, `Status` (new/recurring/fixed), `Evidence` (screenshot/stack)
3. verdict: `clean` (no errors), `fixed` (found and all fixed), `partial` (remaining + reason)
4. persist → `.devin/temp/report/<workspace>/browser-fix-<time>.md` per `/create-report-in-dot-devin`

## Expected Outcome

- Console/errors are watched continuously with delta tracking
- Errors are caught and fixed at the root cause with before/after screenshots
- The web server still works after the fixes — critical routes pass
- fixes that cause recurring errors are rolled back via the `git stash` mechanism
- No TODO/MOCK/placeholder
