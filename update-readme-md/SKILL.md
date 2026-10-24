---
name: update-readme-md
description: Generate a complete README.md from a standard template using real project data
argument-hint: "[scope]"
related:
  - update-docs
  - deep-review
  - deep-analyze
  - learn-from-codebase
  - create-plan-in-dot-agents
  - convert-to-lang-en
  - deep-validate
  - report
  - run-docs
  - update-contributing
  - update-license-md
  - update-references
  - all
  - check-should-update
---

## Goal

Generate a complete `README.md` and `LICENSE.md` using a standard template and real data from the project, for the root and the workspaces in a monorepo

## Scope

Covers generating `README.md` for the root and every workspace in a monorepo, and setting up `LICENSE.md` with the package manifest license field — idempotent: safe to re-run without side effects. See also: /use-agents-capture

## Execute

### 1. Learn And Prepare

> Goal: study the codebase and gather facts before writing — never write from guesswork

1. Always run `/learn-from-codebase` first — internally it runs `/deep-analyze` (tech stack, structure, entry points, data flow); read manifest files, source code, config files
2. Run `/check-should-update` — if there are no git changes → skip and report; run `/run-release` if there is a release tag (auto-generates `CHANGELOG.md`)
3. Read `package.json` to determine the project type: `cli-sdk` or `app` — if it cannot be read → stop and report
4. Detect: `CHANGELOG.md` → status (`in development`/`active`); `CONTRIBUTING.md` → `## Contributing` section; `LICENSE.md` → `## License` section

### 2. Sample README Patterns

> Goal: follow the standard example patterns (from the sample READMEs)

1. Hero: optional centered `<div>` — logo, `#` title, `<h3>` subtitle, description, badge row (stars/release/license/issues), anchor nav (`Introduction · Features · Installation · Usage · Reference`), 16:9 banner image
2. Callouts: GitHub alerts — `[!TIP]` quick start, `[!NOTE]` coverage, `[!WARNING]` beta, `[!IMPORTANT]` version, `[!CAUTION]` breaking changes
3. Topic/workflow tables: `| Topic | Description |` for a reference index; `| Category | Workflows |` per group (Core, Architecture, Framework, Utility); Configuration lists config paths (`.windsurf/rules`, `biome.jsonc`, `tsconfig.json`) + env variables in a bash codeblock
4. Release history: one `<details>` per version — `<summary><strong>vX.Y.Z</strong> (date)</summary>` + 2-column HTML table (icon + `<h3>` + paragraph | highlight bullets)
5. Contribution flow: 4 numbered steps — Setup (fork, clone, add upstream) → Development (branch, standards, commit) → Submit PR → Sync (fetch + merge upstream)

### 3. Write Root README

> Goal: write the main README of the monorepo

1. Write following `## Template` below; use Prepare data: status → `>` callout, `CONTRIBUTING.md` → `## Contributing`, `LICENSE.md` → `## License`
2. If the data is incomplete → stop and report; don't use placeholders; if the write fails → retry (max 3 → stop/report)

### 4. Generate Flow Diagram

> Goal: draw an ANSI flow diagram of the operation for the README

1. From `/deep-analyze`, identify the main flow — input → process → output or a lifecycle (e.g. `describe → compose → run → result`)
2. Draw with box-drawing (`─`, `│`, `▶`, `▼`) — every line the same length (fixed width, e.g. 60 chars) — a ` ```text ` codeblock above Get Started without a heading
3. File structure/tree belongs only in `Development > Architecture` — never in this position; if the flow fails → retry (max 3 → stop/report)

### 5. Draw Usage ANSI

> Goal: draw supporting ANSI for the Usage section instead of capturing images

1. Follow Rule `### 6. Usage Content` per access method — Web/TUI wrap in a `<details>` + `<summary>` accordion (summary = short flow/screen description, inside: text instructions + ANSI drawing)
2. CLI: bash codeblock `bunx <package> --help` (or `<cli-binary> --help`) + ANSI of the `--help` output — include Usage, Options, Commands/Subcommands
3. Use ` ```text ` codeblocks (not ` ```ansi `), fixed width, pad spaces so right borders align — no `/use-agents-capture` for the README

### 6. Update Workspaces READMEs

> Goal: update the README of every workspace in the monorepo

1. Run `/all workspace` to update the README of all workspaces with the same template as the root, but no `## License`/`## Contributing` (use the root ones)
2. Workspace README includes Status, Hero, Flow Diagram, Get Started, Features, Usage — if a workspace has no `package.json` → skip and report; if the update fails → retry (max 3 → stop/report)

### 7. Setup License

> Goal: set up LICENSE.md and the package manifest license field for the root

1. Check the existing `LICENSE.md` and identify the current license type; choose by project type per Rule `### 9. License Selection` — verify suitability with the business model and dependencies
2. Write `LICENSE.md` from the license template via `/update-license-md` — update the copyright holder name; never include a year in the copyright
3. Set the manifest `license` field (`package.json`/`Cargo.toml`) to the matching SPDX identifier — workspaces do not duplicate `LICENSE.md`
4. If you don't create `LICENSE.md` → no `## License` section in the README

### 8. Validate

> Goal: check quality and update references

1. Run `/deep-review` + `/update-references` to check quality and update references at the same time
2. Verify sections per `## Rules` — especially Features 5 columns; if validation fails → revise and recheck (max 3 → stop/report)
3. Checklist: status callout · hero without ANSI (`#` title first line, no `>` description at top — status badge only) · flow diagram above Get Started · Get Started plain numbered · Features 5 columns · Usage with ANSI + inline references · Contributing/License conditionals · no bottom ANSI · aligned ANSI borders

## Rules

### 1. Section Order And Format

- `Status Callout`: at the very top — `>` for the project status only
- `Hero Section`: `#` Title, Description, Badges (left-aligned, excluding the License badge) — no ANSI below the badges
- `Flow Diagram`: ```text codeblock of the operation flow (input → process → output or the main lifecycle) — above Get Started without a heading — never a file structure/tree
- `## Get Started`: plain numbered list with no `###` subsections; each step `N. Title — context` followed by a codeblock; concise, no long descriptions
- `## Features`: 5-column table (Icon, Feature, Description, Benefit, Usage) — see `### 5. Features Row And Writing`
- `## Usage`: `### Usage via ...` per access method — see `### 6. Usage Content`
- `## Contributing`: present only if `CONTRIBUTING.md` exists — short, pointing readers to `CONTRIBUTING.md`
- `## License`: present only if `LICENSE.md` exists — a separate section at the very bottom, no badge (root only)
- ANSI lives only in the Flow Diagram + Usage sections — none below the logo/badges, none at the very bottom; the Flow Diagram never shows a file structure or UI mockup

### 2. Status Callout

- Use `>` for the project status only — no description or other emoji
- Default `in development` (no `CHANGELOG.md`) → red `> ![Status](https://img.shields.io/badge/status-in_development-red)`; if `CHANGELOG.md` exists → `active` → green `> ![Status](https://img.shields.io/badge/status-active-brightgreen)`

### 3. Table Column Specs

- `Development > Tech Stack`: 4 columns (Layer, Technology, Version, Description)
- `Development > How It Work`: a diagram as a text codeblock · `Development > Scripts`: JSON codeblock with comments

### 4. Content Standards

- Run `/convert-to-lang-en` — the entire README.md is in English
- Use real data from `/deep-analyze` and actually runnable code; no placeholders except the banner image; no `## Information`, `## Key Concepts`, `## Tech Stack` as separate sections

### 5. Features Row And Writing

- Icon: centered `:---:`, iconify CDN with `?color=%23<hex>&width=16` · Feature: short name · Description: what it does · Benefit: business value (e.g. Saves time, Reduces errors) · Usage: short example (`generate()` or `bunx my-app generate`) — example row in `## Template`
- Coverage: cover every feature from the source code, with no omissions · Concise Rows: keep each row concise, no long Descriptions · Business-Focused: write business value, not just technical details

### 6. Usage Content

- `## Usage` has a `### Usage via ...` for each access method the project supports: Web, API, CLI, SDK, TUI, Desktop, Browser Extension
- Web: `<details>` + `<summary>` accordion (blank lines around `<details>`) + text instructions (what to press where) + ANSI layout
- API: codeblock with runnable import + call + references table `| api | description | options | default |`
- CLI: bash codeblock `command --help` + ANSI of the `--help` output · SDK: install + import + usage + table · TUI: accordion with shortcuts (e.g. `↑`/`↓` select, `Enter` confirm, `q` quit) + ANSI screen · Desktop/Extension: text + ANSI when appropriate
- No separate `## API References` section — the references table lives in the relevant `### Usage via ...`, public API only

### 7. Icons

- Use the iconify CDN: `![icon](https://api.iconify.design/<set>:<name>.svg?color=%23<hex>&width=16)` — must always include `?color=%23<hex>`
- Never use emoji in tables — use icon sets: `mdi`, `lucide`, `material-symbols`, `tabler`, `ph`, `iconoir` — each icon must use a distinct color
- Color guidance: `1976d2` (blue/core), `388e3c` (green/in scope), `d32f2f` (red/out scope), `f57c00` (orange/warning), `7b1fa2` (purple/UI), `c2185b` (pink/features), `303f9f` (indigo/concepts), `0097a7` (teal/CLI), `00796b` (dark green/build), `ffa000` (amber/content)
- Never use a ` ```ansi ` codeblock in the README — use ` ```text ` for ANSI/box-drawing drawings only

### 8. Contributing And License Sections

- Rename `## Development` to `## Contributing`; present only if `CONTRIBUTING.md` exists at the root; keep it short, 1-2 lines; run `/update-contributing` first if you need to create it
- `## License` present only if `LICENSE.md` exists at the root — otherwise no section

### 9. License Selection

- MIT: libraries and templates · Apache-2.0: needs patent protection · BSD-3-Clause: flexibility · Proprietary: closed-source commercial · CC-BY-4.0: documentation
- Always use the correct SPDX identifier; no year in the copyright; templates via `/update-license-md`

### 10. Plan Always

- Always run `/create-plan-in-dot-agents` before starting any README writing/update — to clearly define scope, sections, and per-workspace work
- Use `/deep-review`, `/report`, `/deep-validate`, `/run-docs`, `/update-docs` as needed

## Template

Full README example — the former `templates/usage-via-cli|web|tui.md` sub-templates follow the same shape as their sections here:

````markdown
> ![Status](https://img.shields.io/badge/status-in_development-red)

# gen-password

Short description — Longer description.

![TanStack Start](https://img.shields.io/badge/TanStack_Start-1.168-1976d2)

```text
┌──────────────────────────────────────────────────────────┐
│  options ──▶ charset ──▶ random ──▶ password             │
│  crypto.getRandomValues ──▶ "Xk9$mP2#vQr7&nL4w" ──▶ copy │
└──────────────────────────────────────────────────────────┘
```

## Get Started

1. Install Tools — `mise install` + `bun install`
   ```bash
   mise install
   bun install
   ```

## Features

| Icon | Feature | Description | Benefit | Usage |
|:---:|:--------|:------------|:--------|:------|
| ![icon](https://api.iconify.design/mdi:rocket.svg?color=%23303f9f&width=16) | Password Generation | Generate strong random passwords | Saves time and removes weak passwords | `generate()` or `bunx gen-password generate` |

## Usage

### Usage via Web

<details>
<summary>Web app click flow & layout</summary>

Open the app at `http://localhost:3001`. Click the password display to randomize and copy.

```text
┌──────────────────────────────────────────────────────────┐
│  gen-password — Password Generator  ·  Length 16/32      │
│  Click to randomize & copy → Xk9$mP2#vQr7&nL4w           │
└──────────────────────────────────────────────────────────┘
```

</details>

### Usage via CLI

```bash
bunx gen-password --help
```

```text
┌──────────────────────────────────────────────────────────┐
│  $ bunx gen-password --help                              │
│  USAGE: gen-password <command> [options]                 │
│  COMMANDS                                                │
│    generate    Generate a random password                │
│  OPTIONS                                                 │
│    --length    Length of the password      [default: 16] │
│    --help      Show this help message                    │
└──────────────────────────────────────────────────────────┘
```

## Contributing

See CONTRIBUTING.md for development setup, conventions, and validation workflows.

## License

MIT License — see LICENSE.md
````

## Expected Outcome

- A complete README.md using real data from `/deep-analyze`, with no placeholders except the banner image
- Section order: Status > Hero (no ANSI) > Flow Diagram (ANSI — real operation input → process → output, not a file structure) > Get Started (plain numbered) > Features (5 columns) > Usage (with ANSI) > Contributing (if exists) > License (if exists)
- `## Usage` covers every access method with ANSI drawing — CLI shows the `command --help` ANSI output; Web/TUI wrapped in a `<details>` accordion
- References tables live in the Usage section — no separate `## API References`
- `## Contributing` present only if `CONTRIBUTING.md` exists; `## License` present only if `LICENSE.md` exists; the manifest license matches `LICENSE.md`
- Every ANSI line has the same length (borders aligned); no ANSI below the badges and none at the very bottom
