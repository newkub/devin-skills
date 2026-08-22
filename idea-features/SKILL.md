---
name: idea-features
description: Generate feature ideas and write them into VitePress docs as markdown via /update-docs
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
  - ASCII
  - UI
  - open-web
  - preview
---

## Goal

Generate new and extended feature ideas for a project and produce a markdown documentation page under `docs/roadmap/idea-features.md` via `/update-docs`.

## Scope

- Analyze the project, packages, existing features, and market trends
- Create prioritized feature ideas for two tables: `Extends` and `New`
- Output is a VitePress markdown page, not an HTML report or chat text
- Report body is in English; feature table cell content may be in the project language (e.g., Thai)
- Do not compare competitors directly; use `/compare-and-idea-features` for that

## Execute

### 1. Internal Analysis (silent — do not show in chat)

> Goal: Understand the project, gaps, market trends, and generate ideas

1. Run `/analyze-project`, read `docs/project/features.md` if it exists, analyze packages, and define scope (silent)
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

### 3. Add Per-Feature Details

> Goal: Each feature is documented with UX and Plan in plain markdown

1. For each feature, generate a concise UX/UI sketch in text/ASCII or bullet form
2. For each feature, generate a short implementation plan with 3-5 bullet steps
3. Under each feature heading, write two sub-sections:
   - `UX/UI` — text or ASCII sketch
   - `Plan` — numbered steps
4. Keep each detail section under 15 lines

### 4. Write Markdown Page

> Goal: Produce the final markdown page

1. Write `docs/roadmap/idea-features.md` with frontmatter:
   ```yaml
   ---
   title: Idea Features
   description: New and extended feature ideas for the project
   ---
   ```
2. Include in the page:
   - Key Findings (bullet list, English)
   - `## Extends` table with 27 columns
   - `## New` table with 27 columns
   - `## Feature Details` — one `### <#> <feature>` per row with `UX/UI` and `Plan`
   - `## Summary` — DB/Files, API/Functions, Components tables
   - `## Architecture` — text diagram
   - `## Next Action` — numbered list
3. Use markdown tables, not HTML
4. Save the file in `docs/roadmap/idea-features.md`

### 5. Update Docs Site

> Goal: Ensure the new page is part of the docs site

1. Run `/update-docs` to update `docs/.vitepress/config.ts` sidebar and references
2. Verify `docs/roadmap/index.md` links to `idea-features.md`
3. If `update-docs` reports missing structure, fix and re-run (max 3)

### 6. Validate

> Goal: Confirm the markdown and docs site are correct

1. Check that `docs/roadmap/idea-features.md` renders in VitePress preview
2. If `package.json` has `dev:docs` or `preview:docs`:
   - Start the docs dev/preview server in the background
   - Run `/open-web <url>` (default `http://localhost:5173` or the configured port)
   - Verify the page renders and sidebar includes it
   - Stop the background server after preview
3. If no docs scripts exist, run `/open-web` with the file URL or skip
4. Verify all tables have valid markdown
5. Verify sidebar includes the page

### 7. Final Chat

> Goal: Only report the file path and top action

1. Reply in chat with the docs path and the top next action
2. Do not paste the full table, analysis, or markdown in chat

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

### 3. Markdown Only

- No HTML reports, no interactive UX, no dropdowns
- Tables are markdown tables
- Feature details are headings and bullet lists
- Use `pre` for ASCII sketches inside markdown

### 4. Language

- Page body, headings, summaries, and next action are in English
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

- Markdown file at `docs/roadmap/idea-features.md`
- Two tables (`Extends` and `New`) with 27 columns and continuous numbering
- Each feature has a markdown section with `UX/UI` and `Plan` sub-sections
- Key findings, summary, architecture diagram, and next action in the page
- Page integrated into VitePress sidebar via `/update-docs`
- Report body in English; table cells may be in the project language
- Final chat message contains only the docs path and top next action