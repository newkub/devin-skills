---
name: report-prompt-uxui-web-design
description: Generate a web UX/UI design prompt — 4-col card grid, all routes, mobile view per card
argument-hint: "[scope-or-routes-file]"
related:
  - report-uxui
  - report-uxui-all-routes
  - scan-codebase
  - visualize-in-web
  - report
---

## Goal

Generate a full-scope web UX/UI design prompt (desktop, tablet, mobile) that specifies the layout as a 4-column card grid — the number of cards equals the number of app routes, each card shows the UX/UI in mobile view with route, page name, and description covering every route, and the app name sits on the first line of the prompt

## Scope

- Use when a ready-to-use prompt is needed to generate/design the whole-app web UX/UI overview — the prompt must cover desktop, tablet, and mobile
- The output is prompt text (in a ```text block) embedding the real route list from the codebase — not drawing the UI itself (sketch drawing uses `/report-uxui`, route tables use `/report-uxui-all-routes`)
- If the user wants a real render → send the prompt to `/visualize-in-web` or capture via `/record-video-web-with-agents-browser`

## Execute

### 1. Collect App Info And Routes

> Goal: Get the app name and every route

1. Run `/scan-codebase` to find the app name (`package.json` `name`, `index.html` `<title>`, or the brand in the layout) and the framework/router used
2. Run `/report-uxui-all-routes` to collect all routes — page routes, dynamic patterns, auth-required
3. If the argument points to a routes/routes.md file → use it instead of scanning
4. Every route needs: `path`, `page/component name`, `description` (one line — summarized from the real page content, never guessed)

### 2. Compose Prompt

> Goal: Write the prompt fully per spec — mandatory structure

1. Write the app name as the very first line of the prompt
2. The prompt body must state these specs (none may be missing):
   - Design the web UX/UI fully for desktop, tablet, and mobile
   - Present as a 4-column card grid (`grid-template-columns: repeat(4, 1fr)`) — cards per row shrink with viewport (desktop 4, tablet 2, mobile 1)
   - Number of cards equals the total number of routes — 1 card = 1 route
   - Each card shows the UX/UI as a mobile view (mobile viewport preview of that route)
   - Each card has: route path, page name, description — covering every route
3. Embed the entire real route list into the prompt as a table or list — no placeholders like "route1, route2, ..."

### 3. Emit Prompt

> Goal: Deliver the ready-to-use prompt in chat

1. Put the whole prompt in a single ```text block — copy-paste ready
2. Run `/report` to summarize: `No.`, `Route`, `Page`, `Description` for every embedded route
3. State the routes/cards count and the app name used
4. If the user wants to see the result → offer `/visualize-in-web` to render the grid per this prompt

## Rules

### 1. Prompt Structure Contract

- The first line of the prompt = the app name only (no other heading before it)
- All 3 viewports must be stated: desktop, tablet, mobile
- Card count = route count always — never merge several routes into one card or skip any route
- Each card must have a mobile UXUI preview + route + page + description, complete

### 2. Routes Completeness

- Routes must come from the real codebase (`/scan-codebase` + `/report-uxui-all-routes`) — never guess or sample
- Dynamic routes (`[id]`, `:id`, `$slug`) keep their original pattern in the route path
- If routes > 24 → still show every route, but warn the grid will be long

### 3. Formatting

- The prompt lives in a single ```text block — do not split into multiple blocks
- Use backticks for `route-path`, `page-name`, `app-name` in the prompt content
- No bold markers; the report summary follows `/report` conventions

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status), no report files; the generated prompt stays in chat

## Expected Outcome

- A ready-to-use prompt requesting a full desktop/tablet/mobile web UX/UI design as a 4-col card grid
- App name on top; cards exactly matching the route count; each card with mobile UXUI + route + page + description
- The complete route list embedded in the prompt — no placeholders
