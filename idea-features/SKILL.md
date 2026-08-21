---
name: idea-features
description: Generate feature ideas and produce an interactive HTML report with prioritized tables and per-row UX/Plan dropdowns
allowed-tools:
  - read
  - edit
  - grep
  - glob
  - exec
  - write
  - ask_user_question
triggers:
  - user
  - model
related:
  - suggest-next-action
  - implement-features-to-mvp
  - learn-from-web
  - compare-and-idea-features
  - refactor
  - report-in-html
  - report-uxui-sketch
  - report-plan
---

## Goal

Generate new and extended feature ideas for a project, analyze gaps and user needs, and produce an interactive HTML report with continuously numbered tables and per-row UX/UI and Plan dropdowns.

## Scope

- Analyze the project, packages, existing features, and market trends
- Create prioritized feature ideas for two tables: `Extends` and `New`
- Output is an HTML file generated via `/report-in-html`, not chat text
- Report body is in English; feature table cell content may be in the project language (e.g., Thai)
- Do not compare competitors directly; use `/compare-and-idea-features` for that

## Execute

### 1. Internal Analysis (silent — do not show in chat)

> Goal: Understand the project, gaps, market trends, and generate ideas

1. Run `/analyze-project`, read `.devin/features/<workspace>/features.md`, analyze packages, and define scope (silent)
2. Run `/learn-from-web` to study market trends, user needs, and competitor features from external sources (silent)
3. Analyze `/learn-from-web` output to identify gaps and opportunities (silent)
4. Generate `Extends` and `New` feature ideas (silent)
5. Rank by RICE and compute MVP Score 1-10 (silent)
6. If project access fails, stop and report

### 2. Define Feature Rows

> Goal: Each feature has full metadata for 27 columns

1. Split into two tables: `Extends` and `New`
2. Continuous numbering: `Extends` starts at 1, `New` continues from the last `Extends` number
3. Each table up to 20 rows; total up to 40 rows
4. Sort by impact: 🔴 high first, then 🟡 medium, then 🟢 low
5. Keep descriptions to one line
6. Scope must be clear: package-level, app-level, or cross-package

### 3. Add Per-Row Dropdowns

> Goal: Every feature row exposes UX/UI and Plan details

1. For each feature, generate a concise UX/UI sketch in text/ASCII format
2. For each feature, generate a short implementation plan with 3-5 bullet steps
3. The HTML report must render each row with an expandable dropdown
4. The dropdown has two columns:
   - `UX/UI Sketch` — output of `/report-uxui-sketch` for this feature
   - `Plan` — output of `/report-plan` for this feature
5. Keep dropdown content compact (under 20 lines per column)

### 4. Generate HTML Report

> Goal: Produce the final interactive report

1. Run `/report-in-html` to create a single HTML file
2. Pass all feature data including dropdown content
3. Ensure the HTML report has:
   - Key findings at the top
   - Two tables (`Extends`, `New`) with 27 columns
   - Sort, filter, group, and search for the table
   - Per-row dropdown with `UX/UI Sketch` and `Plan`
   - Summary tables for DB/Files, API, Components
   - Text-based architecture diagram
   - Next action from `/suggest-next-action`
4. Save the file to `reports/idea-features.html` or `.devin/reports/idea-features.html`

### 5. Validate

> Goal: Confirm the report is correct and usable

1. Open the HTML in a browser using `/open-web`
2. Verify sort, filter, search, dropdowns, and theme toggle
3. If validation fails, fix and regenerate (max 3 → stop/report)

### 6. Final Chat

> Goal: Only report the file path and top action

1. Reply in chat with a short message: the HTML path and the top next action
2. Do not paste the full table, analysis, or report in chat

## Rules

### 1. Group By Type With Continuous Numbering

- Two tables: `Extends` and `New`
- Continuous numbering across both tables
- Each table up to 20 rows, total up to 40 rows
- Sort by impact: 🔴 → 🟡 → 🟢
- Description must be one line
- Scope: package-level, app-level, or cross-package

### 2. Column Order (27 columns)

`# | Priority | Impact | Feature | Description | Why | How To | Phase | Effort | Difficult | Scope | Interface | Target | Topics | Deps | Feature Deps | Routing | Components | Types | API | DB | Risk | Breaking | Estimate | MVP Score | KPI | UX/UI`

- Impact: 🔴 high, 🟡 medium, 🟢 low
- Priority: P0, P1, P2, P3 (business order, separate from impact)
- Phase: MVP, v2, v3
- Effort: S, M, L, XL
- Difficult: 🔴 hard, 🟡 medium, 🟢 easy
- Interface: api, cli, web, mobile, library, sdk
- Target: customer, provider, staff, admin, partner, multiple
- Deps: short dependencies, `-` if none
- Feature Deps: prerequisite feature numbers, `-` if none
- Routing: route or command path, `-` if none
- Components: UI or command components, `-` if none
- Types: TS types, `-` if none
- API: endpoints or functions, `-` if none
- DB: tables or files, `-` if none
- Risk: 🔴 high, 🟡 medium, 🟢 low
- Breaking: `yes` or `no`
- Estimate: `1d`, `3d`, `1w`, `2w`
- MVP Score: RICE 1-10
- KPI: metric, `-` if none
- UX/UI: 🔴 needs a lot, 🟡 some, 🟢 use existing

### 3. Per-Row Dropdown

- Every feature row must have an expandable dropdown
- Dropdown has two columns: `UX/UI Sketch` and `Plan`
- `UX/UI Sketch` uses text/ASCII layout or bullet list
- `Plan` uses 3-5 short steps
- Content is concise and specific to that feature

### 4. Language

- Report body, headings, summaries, and next action are in English
- Feature table cell content may be in the project language (e.g., Thai)
- Do not output the full report in chat

### 5. Start With MVP

- Begin with minimum viable version
- Build iteratively, not big bang
- Define MVP scope clearly per feature

### 6. Assess Technical Feasibility

- Estimate effort realistically
- Consider long-term maintenance cost
- Identify likely technical debt

### 7. Direct Execution

- If the user says "do ... now": run `/refactor` and `/realize-implementation`
- If the user asks to implement a specific feature: run `/implement-features-to-mvp`
- If the user asks to implement all missing features: run `/review-codebase`

## Expected Outcome

- Single HTML file at `reports/idea-features.html` or `.devin/reports/idea-features.html`
- Two tables (`Extends` and `New`) with 27 columns and continuous numbering
- Each table row has an expandable dropdown with `UX/UI Sketch` and `Plan`
- Sort, filter, group, and search enabled on the table
- Key findings, summary, architecture diagram, and next action in the report
- Report body in English; table cells may be in the project language
- Final chat message contains only the file path and top next action