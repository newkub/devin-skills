---
name: update-readme-md
description: Generate a complete README.md from a standard template using real project data
argument-hint: "[scope]"
related:
  - update-docs
  - deep-review
  - deep-analyze
  - learn-from-codebase
  - create-plan-in-dot-devin
  - convert-to-lang-en

  - deep-validate
  - report
  - capture
  - run-docs
---

## Goal

Generate a complete `README.md` and `LICENSE.md` using a standard template and real data from the project, for the root and the workspaces in a monorepo

## Scope

Covers generating `README.md` for the root and every workspace in a monorepo, and setting up `LICENSE.md` with the package manifest license field — idempotent: safe to re-run without side effects

See also: /capture

## Execute

### 1. Learn The Codebase

> Goal: study the actual codebase before writing — never write from guesswork

1. Always run `/learn-from-codebase` first — internally it runs `/deep-analyze` (tech stack, structure, entry points, data flow)
2. Use what you learned to write a real README — every claim must have a source from verified code/docs, not boilerplate
3. Then do the prepare step per `references/prepare.md` (detect project type, status, CONTRIBUTING/LICENSE/CHANGELOG)

### 2. Read Sample READMEs

> Goal: read example READMEs per the standard

1. Read `references/sample-readme-overview.md` for the overall README structure
2. Read `references/sample-readme-workflows.md` for the workflows part
3. Read `references/sample-readme-contribution.md` for the contribution part
4. Read `references/sample-readme-releases.md` for the releases part
5. Identify the sections needed for the current project

### 3. Write Root README

> Goal: write the main README of the monorepo

See `references/write-readme.md`

### 4. Generate Flow Diagram

> Goal: draw an ANSI flow diagram of the operation for the README

See `references/generate-sketch.md`

### 5. Draw Usage ANSI

> Goal: draw supporting ANSI for the Usage section instead of capturing images

See `references/capture-images.md`

### 6. Update Workspaces READMEs

> Goal: update the README of every workspace in the monorepo

See `references/update-workspaces.md`

### 7. Setup License

> Goal: set up LICENSE.md and the package manifest license field for the root

See `references/setup-license.md`

### 8. Validate

> Goal: check quality and update references

See `references/validate.md`

## Rules

### 1. Section Order And Format

Arrange sections in the following order:

- `Status Callout`: at the very top — use `>` for the project status only
- `Hero Section`: `#` Title, Description, Badges (left-aligned, excluding the License badge) — no ANSI below the badges
- `Flow Diagram`: ```text codeblock showing an ANSI flow diagram of the operation (input → process → output or the main lifecycle) — placed above Get Started without a heading — never draw a file structure/tree here
- `## Get Started`: plain numbered steps with no `###` subsections — each step has a title + codeblock
- `## Features`: Markdown table with 5 columns (Icon, Feature, Description, Benefit, Usage) — see `references/features-table.md`
- `## Usage`: `### Usage via ...` for each access method — see `references/usage-section.md`
- `## Contributing`: present only if `CONTRIBUTING.md` exists — keep it short, pointing readers to `CONTRIBUTING.md`
- `## License`: present only if `LICENSE.md` exists — a separate section at the very bottom, no badge (root only)

### 2. Status Callout

- Use `>` for the project status only — no description or other emoji
- Default: `in development` (if there is no `CHANGELOG.md`)
- If `CHANGELOG.md` exists → switch to `active`
- Colors: `in development` = red, `active` = green
- Format: `> ![Status](https://img.shields.io/badge/status-in_development-red)` or `> ![Status](https://img.shields.io/badge/status-active-brightgreen)`

### 3. Report ANSI

- Flow Diagram (above Get Started) = `flow diagram only` — show the operation/step sequence/data flow — never draw a file structure or UI mockup there
- No ANSI below the logo/badges in the Hero section — ANSI lives in the Flow Diagram + Usage section only
- No ANSI codeblock at the very bottom of the README

### 4. Get Started Format

- Use a plain numbered list with no `###` subsections
- Each step: `N. Title — context` followed by a codeblock
- Be concise, no long descriptions

### 5. Table Column Specs

- `Features`: 5 columns (Icon, Feature, Description, Benefit, Usage) — see `references/features-table.md`
- `Development > Tech Stack`: 4 columns (Layer, Technology, Version, Description)
- `Development > How It Work`: a diagram as a text codeblock
- `Development > Architecture`/`Workflows`/`Skills`: file structure codeblock (tree format with `#` comments)
- `Development > Scripts`: JSON codeblock with comments

### 6. Content Standards

- Run `/convert-to-lang-en` — the entire README.md is in English
- Use real data from `/deep-analyze` and actually runnable code
- No placeholders except the banner image
- No `## Information`, `## Key Concepts`, `## Tech Stack` as separate sections

### 7. Features Writing Standards

- Coverage: cover every feature from the source code, with no omissions
- Concise Rows: keep each row concise; include all rows, no long Descriptions
- Business-Focused: write business value, not just technical details

### 8. Usage Content Types

- Web: `<details>` accordion + text instructions + ANSI drawing
- API: code block with import and function call + references table
- CLI: bash code block `command --help` + ANSI drawing of the `--help` output
- SDK: code block with install + import + usage + references table
- TUI: `<details>` accordion + text instructions + ANSI drawing
- Desktop / Browser Extension: text instructions + ANSI drawing

See details: `references/usage-section.md`

### 9. Usage ANSI Drawing

- Use ANSI box-drawing characters to draw the layout/output instead of capturing real images
- Every line in the ANSI codeblock must have the same length
- Use a ` ```text ` codeblock (not ` ```ansi `)
- Fixed width, e.g. 60 characters

See details: `references/capture-images.md`

### 10. Usage Accordion

- `Usage via Web` and `Usage via TUI` must wrap their content in `<details>` + `<summary>`
- Inside the accordion: text instructions + ANSI drawing
- Each `<details>` block needs a blank line before opening and before closing

See details and examples: `references/usage-section.md`

### 11. API References (Inline)

- No separate `## API References` section
- Put the references table in the relevant `### Usage via ...` section
- Columns: api, description, options, default
- Show public API only

### 12. Contributing Section

- Rename `## Development` to `## Contributing`
- Present only if `CONTRIBUTING.md` exists at the root
- Keep it short, 1-2 lines, pointing readers to `CONTRIBUTING.md`
- If there is no `CONTRIBUTING.md` → no `## Contributing` section
- Run `/update-contributing` first if you need to create it

### 13. License Section

- Present only if `LICENSE.md` exists at the root
- If there is no `LICENSE.md` → no `## License` section

### 14. Icons

- Use the iconify CDN: `![icon](https://api.iconify.design/<set>:<name>.svg?color=%23<hex>&width=16)` — must always include `?color=%23<hex>`
- Never use emoji in tables — use icon sets: `mdi`, `lucide`, `material-symbols`, `tabler`, `ph`, `iconoir`
- Center the Icon column with `:---:` — each icon must use a distinct color
- Color guidance: `1976d2` (blue/core), `388e3c` (green/in scope), `d32f2f` (red/out scope), `f57c00` (orange/warning), `7b1fa2` (purple/UI), `c2185b` (pink/features), `303f9f` (indigo/concepts), `0097a7` (teal/CLI), `00796b` (dark green/build), `ffa000` (amber/content)
- Never use a ` ```ansi ` codeblock in the README — use ` ```text ` for ANSI/box-drawing drawings only

### 15. License Selection

Choose a license by project type:

- MIT: for libraries and templates
- Apache-2.0: for projects that need patent protection
- BSD-3-Clause: for projects that want flexibility
- Proprietary: for closed-source commercial products
- CC-BY-4.0: for documentation

See details: `references/setup-license.md`

### 16. Example Templates

See templates:

- `templates/readme-template.md` — a full README example
- `templates/usage-via-cli.md` — CLI `--help` ANSI template
- `templates/usage-via-web.md` — Web accordion template
- `templates/usage-via-tui.md` — TUI accordion template

- Use /deep-review if needed
- Use /report if needed
- Use /deep-validate if needed
- Use /run-docs if needed
- Use /update-docs if needed

### 17. Plan Always

- Always run `/create-plan-in-dot-devin` before starting any README writing/update — to clearly define scope, sections, and per-workspace work


## Expected Outcome

- A complete README.md using real data from `/deep-analyze`, with no placeholders except the banner image
- Section order: Status > Hero (no ANSI) > Flow Diagram (ANSI) > Get Started > Features > Usage (with ANSI) > Contributing (if exists) > License (if exists)
- The flow diagram shows the real operation (input → process → output) — not a file structure
- `## Get Started` uses a plain numbered list with no `###` subsections
- `## Features` has 5 columns (Icon, Feature, Description, Benefit, Usage)
- `## Usage` covers every access method with ANSI drawing
  - CLI: shows the `command --help` ANSI output
  - Web/TUI: content wrapped in a `<details>` accordion
- No separate `## API References` — references live in the Usage section
- `## Contributing` present only if `CONTRIBUTING.md` exists
- `## License` present only if `LICENSE.md` exists
- Every line of ANSI box-drawing has the same length (borders aligned)
- No ANSI below the logo/badges and no ANSI at the very bottom
- `LICENSE.md` is correct and complete
- The license in the package manifest matches `LICENSE.md`

