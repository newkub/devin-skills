---
name: report-readme-html
description: Build a README.html report in a temp dir with Element Plus + Tailwind, opened via /open-web
argument-hint: "[file]"
related:
  - report-in-html
  - report
  - update-docs
  - open-web
  - create-files-in-os-temp
---

## Goal

Build a single-file interactive `README.html` report in the OS temp dir — Element Plus + Tailwind CSS, a 7-tab system with search, sorting, grouping, and expand/collapse — then open it with `/open-web`

## Scope

Summarize the project README/docs as a temporary HTML report — never written to the project root (temp only)

- 7 tabs: Features, Dependencies, Architecture, API Endpoints, Database Schema, Environment Variables, Getting Started
- Generic single-file HTML report (non-README data) → `/report-in-html`
- Permanent docs → use `/update-docs` instead

## Execute

### 1. Collect Data

> Goal: Have complete data before rendering

1. Read `README.md` (argument `file` → use that file) + `package.json`/`Cargo.toml` + the project structure
2. Summarize per-tab data: features, deps (name/version/license/type), architecture tree, API endpoints, db schema, env vars, getting-started steps

### 2. Build HTML In Temp

> Goal: single-file HTML in the temp dir

1. Run `/create-files-in-os-temp` — create `<temp>/readme-report/README.html`
2. Vue 3 via unpkg CDN (`vue.global.prod.js`) + Element Plus JS (`index.full.min.js`) + CSS (base + dark) — the JS must be loaded too, and call `app.use(ElementPlus)` before mount
3. Tailwind CSS browser build + `tailwind.config = { darkMode: 'class' }`
4. Build `<el-tabs>` with 7 panes per Scope

### 3. Tab Content Patterns

> Goal: each tab has a clear structure

1. Features — `<el-collapse>` per category + `<el-table>` 7 cols (feature/status/category/description/benefit/priority/module), `sortable` + `<el-input>` search
2. Dependencies — `<el-table>` 6 cols (library `<el-link>`/version/license/type/security/source) + `<el-tag>` color coding
3. Architecture — `<el-tree>` or nested `<el-collapse-item>` grouped by layers
4. API Endpoints — one `<el-card>` per endpoint (method/path/description/params) + search
5. Database Schema — table per entity (columns, types, relations)
6. Environment Variables — table (name/required/description/example) — never put real secret values
7. Getting Started — numbered steps + code blocks

### 4. Open And Report

> Goal: Open the result for the user

1. Run `/open-web` on the temp HTML file path
2. Run `/report` summarizing the path + tab coverage

## Rules

- Write to the temp dir only — never write `README.html` into the project root
- Single self-contained file — all assets from CDN, no build needed
- Never put real secrets/env values in the Environment Variables tab
- Use `/open-web` to open the result — do not call `Start-Process` directly when `/open-web` works

- Use `/report-in-html` for a generic interactive report
- Always use `/create-files-in-os-temp`, `/open-web`
- Use `/update-docs` when permanent docs are wanted instead

- Final report via `/report-review` — one chat table (No./Action/Evidence/Severity/Risk/Priority/Owner skill/Status); the generated `README.html` in temp is this skill's artifact, not a review report file

## Expected Outcome

- `README.html` in temp, opened in the browser via `/open-web`
- All 7 tabs with search/sort/group
- No report files left in the project
