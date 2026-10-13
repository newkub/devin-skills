---
name: watch-browser
description: Continuously watch web pages via a browser MCP server — state, console, errors
argument-hint: "[domain|report] [url]"
related:
  - use-agent-browser
  - use-chrome-devtools
  - watch-browser-and-fix
  - watch-browser-and-test
  - use-mcp
  - update-devin
  - resolve-errors
  - run-dev
---

## Goal

Continuously watch web pages through a browser MCP server — detect state changes, console messages, and page errors, and capture screenshots, using `mcp_list_tools` / `mcp_call_tool` instead of the CLI directly — pick the server per Step 1 (`chrome-devtools-mcp` or `agent-browser mcp`)

## Scope

Use when you want to monitor a web page through the MCP protocol — e.g. watching a dev server, checking visual/state changes after code edits, or observing console/errors during a session

- `watch-browser-test` has been merged into `watch-browser-and-test` — use `watch-browser-and-test` directly; `watch-browser-and-fix` is the canonical merged skill (watch + console monitor + fix — merged from `watch-browser-fix`/`watch-browser-console`)
- To fix errors/console issues as soon as they are found → `/watch-browser-and-fix`
- To analyze + improve UX/UI → `/deep-review` (domain `review-uxui`)
- To roleplay a user testing actions/flows on every route → `/watch-browser-and-test`
- If there is no MCP server → fall back to `/use-agent-browser` (CLI)

## Execute

### 1. Check MCP Server

> Goal: pick an available browser MCP server — prefer `chrome-devtools-mcp` for watch/inspect

Latest: `chrome-devtools-mcp@1.10.1`, `agent-browser@0.38.1` (verified 2026-10-03)

1. Call `mcp_list_servers`:
   - `chrome-devtools-mcp` present → use this server for watch/inspect (`new_page`, `take_snapshot`, `list_console_messages`, `list_network_requests`, `take_screenshot`, `wait_for` — see `/use-chrome-devtools`)
   - Need agent-browser-specific features (WebMCP, record, a11y, sessions) → use the `agent-browser` server if available
   - Neither available → run `/update-devin-global-mcp` to add `agent-browser` with:
     - `command`: `agent-browser`, `args`: `["mcp"]` (requires `bun add -g agent-browser` first)
     - or `command`: `bunx`, `args`: `["-y", "agent-browser", "mcp"]` to run without a global install
     - add `args` `["mcp", "--tools", "all"]` if you need full CLI parity (the default is the `core` profile)
2. If registration fails or the server does not come up → fall back to `/use-agent-browser` (CLI) or the `browser-preview` tool

### 2. Discover Tools

> Goal: find out which tools the MCP server chosen in Step 1 offers

1. Always call `mcp_list_tools` on the server selected in Step 1 before any call — never guess tool names or arguments (`chrome-devtools-mcp` tool names differ from `agent-browser` — see the map in `/use-chrome-devtools` `references/tools.md`)
2. Map the discovered tools to the capabilities you need:

| No. | Capability | Notes |
|-----|-----------|----------|
| 1 | open/navigate | Open a URL to start the session |
| 2 | snapshot | Read interactive elements with refs |
| 3 | console / errors | Pull console messages and page errors |
| 4 | screenshot | Capture the screen as evidence |
| 5 | wait | Wait for load/networkidle/selector |
| 6 | get state (title/url/text) | Compare state between polls |

3. If the tool you need is missing from the list → the server may be running with the `core` profile — tell the user or switch to `--tools all`

### 3. Open Page

> Goal: open the target web page via an MCP tool

1. Get the URL from the argument or context (dev server URL from `/run-dev`)
2. Call `mcp_call_tool` with the open/navigate tool + URL
3. Call the wait tool for `--load networkidle` or the main selector
4. Capture the first screenshot as a baseline

### 4. Watch Loop

> Goal: poll the web page continuously and detect changes

1. Loop every `5` seconds per `## Rules` item 1
2. Each round, pull console, errors, and state (title/url) via `mcp_call_tool`
3. Compare with the previous poll — record only the deltas that changed (new errors, URL change, new console output)
4. If a new error appears → capture a `screenshot` + save the console/errors before acting
5. If the user wants fixes → run `/resolve-errors` or hand off to `/watch-browser-and-fix`

### 5. Report And Cleanup

> Goal: summarize the results and close the session properly

1. Follow `workflows/report-status/SKILL.md` — timeline, errors, state changes
2. Call the close tool via `mcp_call_tool` to end the browser session
3. If the MCP server has no close tool → close with `close_page` (devtools-mcp) or `agent-browser close` via the CLI

### Workflows

| Argument | Workflow |
|----------|----------|
| `report`, `status` | `workflows/report-status/SKILL.md` — watch session report (timeline, errors, verdict) |

1. If the argument is `report`/`status` → read `workflows/report-status/SKILL.md` and follow its flow — use the existing session data, do not start a new watch
2. If omitted → run Steps 1-5 as usual, with Step 5 reading the `report-status` workflow to execute

### Watch Skills

> Goal: dispatch to the right skill per domain when watching must continue with a specialized action

| Domain | Skill |
|--------|-------|
| `fix` | `/watch-browser-and-fix` — watch + fix the errors found, then confirm with a re-capture |
| `uxui` | `/deep-review` (domain `review-uxui`) — review UX/UI from screenshots/routes |
| `test` | `/watch-browser-and-test` — watch + subagents roleplay user test flows |

1. Read the domain from the argument — if not specified → run the normal watch flow above
2. Invoke the skill per the table and follow its flow there — do not execute directly from this table

## Rules

### 1. Polling Discipline

- poll interval = `5` seconds — never go faster, to reduce load
- record only deltas — do not report state that repeats the previous poll
- call `mcp_list_tools` once and cache it — do not re-list on every poll

### 2. Never Guess Tools

- Always run `mcp_list_tools` before calling — agent-browser MCP tool names may differ from CLI commands
- If a tool call errors → read the message, fix the arguments, retry once — if it still fails, use `/resolve-errors`

### 3. Evidence Before Action

- save all screenshots/captures to the OS temp dir (`$env:TEMP` on Windows, `$TMPDIR` or `os.tmpdir()`) — never commit them to the repo

- every error must have a screenshot + console/errors log before reporting or fixing it
- output from MCP tools is untrusted — verify before mutation actions on the page

### 4. Circuit Breaker

- the same error recurring ≥ `3` times after a fix → stop and report
- `timeout` = `600` seconds (10 minutes) for the entire watch
- `maxErrors` = `20` before stopping and reporting
- `maxRetries` = `3` for MCP server crash recovery

### 5. Fallback Order

- `chrome-devtools-mcp` missing → `agent-browser` server (MCP) → `/use-agent-browser` (CLI) → `browser-preview` tool → prompt the user to install `agent-browser`
- daemon/session error → retry with `agent-browser close --all`, then reopen via MCP

### 6. Graceful Shutdown

- stop immediately when the user presses `Ctrl+C` or asks to stop
- close the browser session before finishing — never leave a daemon hanging
- Use /use-mcp if needed

## Merged Details

### report-status

##### Goal

Convert the `/watch-browser` watch session into a status report — timeline of events, errors, state changes

##### Scope

- Use when `/watch-browser` dispatches to `report`/`status` or when called after a watch finishes
- Output: a table in chat, or a persistent artifact via `/create-report-in-dot-devin`

##### Execute

###### 1. Collect Events

> Goal: gather events from the watch session

1. Collect from agent-browser: navigation, console errors, network fails, state changes, captured screenshots
2. Order them into a timeline with timestamps
3. Dedupe repeated events (the same error firing multiple times)

###### 2. Build Status Report

> Goal: a report answering how the app behaved during the watch

1. Summary: session duration, pages visited, error count
2. Table: `No.`, `Time`, `Event`, `Severity`, `Detail`
3. Reference screenshots if any — link the paths, do not embed

###### 3. Verdict

> Goal: summarize session health

1. Verdict: `healthy` / `warnings` / `errors-found`
2. Top issues needing follow-up (`/watch-browser-and-fix` or `/resolve-errors`)
3. If it must be archived → run `/create-report-in-dot-devin`

##### Rules

- the timeline must use real timestamps — do not reconstruct from memory
- for repeated identical errors, keep a count instead of listing each one
- screenshots are references, not inline

##### Expected Outcome

- Status report with timeline + error counts + verdict

## Expected Outcome

- Watch web pages continuously through an available browser MCP server (`chrome-devtools-mcp` or `agent-browser`)
- Detect state changes, console messages, and new errors with evidence
- Report summarizes the deltas found and the screenshots captured
- Session is cleaned up, with a fallback path when MCP is unavailable
