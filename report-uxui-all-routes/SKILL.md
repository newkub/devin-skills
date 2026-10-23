---
name: report-uxui-all-routes
description: Build a report of all app/website routes in a markdown table for UX/UI
argument-hint: "[scope]"
related:
  - report-uxui
  - deep-review

  - suggest-next-action
  - ask-me
  - report
  - run-dev
---
## Goal

Build a report of all routes of an app or website in a markdown table, for planning UX/UI, navigation, and tab structure

## Scope

- For apps/websites with tabs or multi-screen navigation
- Supports file-based routing, config-based routing, or a manual route list
- Identifies route/screen, tab group, method, purpose, actions, entry points
- Combine with `/report-uxui` to produce the complete wireframe
- For an ANSI table per the context, use `/report`
- References: [Website Framework Routing Conventions](references/frameworks.md)

## Execute

### 1. Detect Route Source

> Goal: Find routes from the project or context

1. If there is a project → read `package.json`, then scan routes per the steps in [references/route-scanner.md](references/route-scanner.md)
2. If there is no project → read the context from the prompt, references, or `AGENTS.md`
3. Identify the framework (Next.js, Nuxt, SvelteKit, SolidStart, Capacitor, etc.)
4. Identify the tab/switcher structure if present

### 2. Collect Routes

> Goal: Gather every route

1. Scan route files or read the route config
2. Identify page routes, API routes, modal routes, and nested routes
3. Identify dynamic segments such as `[id]`
4. Separate public routes from protected/authenticated routes

### 3. Add UX Metadata

> Goal: Add data for UX/UI planning

1. State each route's tab group (e.g. `Session`, `Customize`)
2. State each screen's purpose/goal
3. State the primary actions on each screen
4. State the navigation pattern: bottom tab, top tab, drawer, stack

### 4. Format As Markdown Table

> Goal: Summarize the routes in a table

1. Use `/report`
2. Columns: No., Tab/Screen, Route, Method, Tab Group, Purpose, Primary Actions, Notes
3. Order by Tab Group, then Route
4. Use symbols `✅` `❌` `⚠️` for status

### 5. Validate And Report

> Goal: Verify completeness

1. Check every tab has routes
2. Check primary actions are clearly stated
3. Check conflicts/duplicates
4. Run `/suggest-next-action` at the end of the report

## Rules

### Route Extraction

- Convert file paths to URL paths per the framework's convention
- Do not count `layout`, `error`, `loading`, `template` files as routes
- Keep dynamic segments with their real notation (`[]`, `()`, `[...]`)
- State the HTTP method correctly per convention for API routes

### UX Metadata

- Every route must have a `Tab Group` or be marked standalone
- Every route must have a short `Purpose`
- `Primary Actions` stated clearly, using `[]` for tap/click
- Use `Notes` for state, loading, or edge cases

### Table Format

- Use the standard markdown table format
- Use clear headers
- The `No.` column is first, starting at 1
- Order by `Tab Group`, then `Route` alphabetically
- Use backticks for `route`, `method`, `paths`

### Report UX/UI

- Summarize key findings at the top before details
- Use `/report` for comparison tables with multiple columns
- Use bullets or numbered lists for point summaries
- Use symbols `✅` `❌` `⚠️` for status indicators
- Always run `/suggest-next-action` at the end of the report

### Source Accuracy

- Reference routes from the real codebase or the context the user gave
- Never invent routes that do not exist
- If context is missing → state the gaps and ask the user with `/ask-me`

- Use /deep-review if needed
- Use /run-dev if needed

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files

## Expected Outcome

- A markdown table of all routes grouped by Tab Group
- UX metadata per route (purpose, actions, notes)
- A navigation pattern summary
- A list of gaps or routes needing verification
- A suggested next action
