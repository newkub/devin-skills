# README.html Report Skeleton

Deliverable: single-file `README.html` in `<temp>/readme-report/` — Vue 3 + Element Plus + Tailwind (CDN), opened via `/open-web`.
Source: [README.md / argument file + package manifest + project structure]
Date: [YYYY-MM-DD]

## Required Tabs (7)

1. Features — `<el-table>` cols: feature / status / category / description / benefit / priority / module; `<el-collapse>` per category; `sortable` + `<el-input>` search.
2. Dependencies — `<el-table>` cols: library (`<el-link>`) / version / license / type / security / source; `<el-tag>` color coding.
3. Architecture — `<el-tree>` or nested `<el-collapse-item>` grouped by layers.
4. API Endpoints — one `<el-card>` per endpoint: method / path / description / params; with search.
5. Database Schema — table per entity: columns, types, relations.
6. Environment Variables — table: name / required / description / example.
7. Getting Started — numbered steps + code blocks.

## Fill Rules

- All seven panes must exist and carry data read from the sources — no empty tab.
- Write to the temp dir only; never place `README.html` in the project root; single self-contained file, all assets from CDN.
- JS must load Element Plus and call `app.use(ElementPlus)` before mount; Tailwind browser build sets `darkMode: 'class'`.
- Environment Variables tab uses placeholder examples only — never real secret values.
- Search, sort, and group controls are wired on every tabular pane.
