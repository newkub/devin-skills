---
name: follow-create-slide-slidev
description: Build and develop Slidev slides standalone or in the D:/newkub/slides monorepo, incl. export
argument-hint: "[scope]"
related:
  - create-slide-in-newkub-slides
  - run-dev
  - ship
  - follow-best-practice
  - deep-review
  - use-mcp
  - update-devin-global-mcp

---

## Goal

Create and develop presentation slides with Slidev (Vite + Vue + Markdown), both as a standalone project (with its own `package.json`) and inside the `D:/newkub/slides` monorepo — technical talks, code walkthroughs, teaching materials, interactive demos, math/diagrams, presenter recording, PDF/PPTX/SPA export

## Scope

- Standalone project: create with `bun create slidev` at the user-specified location, with its own `package.json`
- Newkub slides: use the existing `D:/newkub/slides` Bun workspace — each deck is `apps/{name}/` with its own `package.json` (`@slides/{name}`, scripts `dev`/`build`/`export`, dependency `@slides/shared`); root `package.json` holds the shared Slidev deps and turbo scripts, so add no Slidev dep per app
- If you need the `D:/newkub/slides`-specific flow → use `/create-slide-in-newkub-slides`
- Canonical upstream reference: `skills/slidev/SKILL.md` at https://github.com/slidevjs/slidev (verified against `@slidev/cli` 53.0.0 on 2026-10-24) — this skill merges the feature tables into a single SKILL.md file with no `references/`
- Packages: `@slidev/cli`, `@slidev/theme-seriph`/`@slidev/theme-default`, `vue`, `playwright-chromium` (for `slidev export`) — always confirm the latest versions with `/deep-research` + `/follow-best-practice` (not pinned in this file — per `/update-agents-skills-global`); `mdc` headmatter renamed to `comark` since v52.14
- AI agents drive the deck through Slidev's built-in MCP server (available since Slidev 52.0.0): `slidev mcp [entry]` over stdio, or `http://localhost:<port>/__mcp` while the dev server runs — the global `slidev` server is registered in `%APPDATA%\devin\mcp_config.json` (add or fix it with `/update-devin-global-mcp`)

## Execute

### 1. Choose Project Mode

> Goal: Pick the mode based on the project location

1. Run `/deep-research` + `/follow-best-practice` to confirm the latest versions and patterns, then run `/deep-review` to summarize the tech stack
2. Get the project name and location from the user — if no location is given → use the current directory
3. If creating inside `D:/newkub/slides` → do steps 2-6 (workspace app `apps/{name}` with its own `package.json`)
4. If creating standalone outside `D:/newkub/slides` → check the location is free (ask first if something exists there), then run `bun create slidev@latest {project-name}` + `bun install` — standalone has its own `package.json`; skip step 2

### 2. Verify Root Setup (newkub mode)

> Goal: Verify the workspace root can host a new deck

1. Check that `D:/newkub/slides/package.json` exists and declares `workspaces: ["apps/*", "packages/*"]`
2. Confirm the shared deps are present: `@slidev/cli`, `@slidev/theme-seriph`, `@slidev/theme-default`, `vue`, plus the `turbo` dev dependency
3. If anything is missing, add it at the root and run `bun install` at `D:/newkub/slides`

### 3. Create Slide Project

> Goal: Create Slide Project

1. Newkub mode: create `D:/newkub/slides/apps/{project-name}/` with `slides.md` and a project `package.json` — `name: "@slides/{project-name}"`, scripts `dev: slidev slides.md --open`, `build: slidev build slides.md --out dist`, `export: slidev export slides.md`, `verify: echo "no verify needed"`, and dependency `@slides/shared: workspace:*` (copy `apps/learn-rust/package.json` as the template)
2. Standalone mode: pick a template when the CLI asks (`default`, `seriph`, `apple-basic`, `bricks`, `academic`) — the scaffold creates `package.json`, `slides.md`, `components/`, `layouts/`, `public/`, `styles/` for you
3. If needed, create the subdirectories: `components/`, `layouts/`, `public/`, `styles/`

### 4. Configure Slides

> Goal: Configure Slides

1. Edit `slides.md` to match the desired content
2. Set the headmatter: `theme` per template, `title`/`info` conveying the content, `transition: slide-left` default, `comark: true` — for Thai content add `fonts` with `Noto Sans Thai`
3. Write content with Slidev's Markdown syntax (see `## Rules` → `### 4-6`)
4. First slide uses `layout: cover`, last slide uses `layout: end`, one concept per slide

### 5. Run Dev Server

> Goal: Run Dev Server

1. Newkub mode: run `bun run --filter @slides/{project-name} dev` from `D:/newkub/slides`, or `bunx slidev app/{project-name}/slides.md` — the app script already passes `slides.md` and `--open`
2. Standalone mode: run `bunx slidev` in the project directory (run `/run-dev`)
3. The dev server runs on port 3030 (default)
4. Open the browser to view the slides in real time

### 6. Export Slides (Optional)

> Goal: Export Slides (Optional)

1. Newkub mode: run `bun run --filter @slides/{project-name} export` to export a PDF from `apps/{project-name}` (requires `playwright-chromium` — if export fails with a browser error, install it first)
2. Newkub mode: run `bun run --filter @slides/{project-name} build` to build the static SPA into `apps/{project-name}/dist` — pass `--router-mode hash|memory|history` through the script if the host doesn't support SPA routing
3. Standalone mode uses `bunx slidev build` / `bunx slidev export` in the project directory

### 7. Drive The Deck Through MCP

> Goal: AI agents inspect and edit slides through the real MCP surface, not by guessing at tool names

1. Run `/use-mcp` to confirm the `slidev` server is connected; if it is missing or stale → `/update-devin-global-mcp` to register `{ "command": "bunx", "args": ["@slidev/cli@latest", "mcp", "slides.md"] }`
2. Stdio mode (`slidev mcp slides.md`) reads and writes the markdown files directly — it needs no dev server, and the entry is resolved from the server's working directory, so start it in the deck folder or pass the deck path
3. HTTP mode: while `slidev` runs, point the client at `http://localhost:<port>/__mcp` — this is the only mode that exposes `slidev-goto-slide`
4. Call the server's tool list first, then use the tools rather than hand-editing:

   | Tool | Purpose |
   |------|---------|
   | `slidev-get-info` | Deck overview: entry, title, slide count, files, dev-server URL/position |
   | `slidev-list-slides` | Every slide with number, title, layout, source file |
   | `slidev-get-slide` | Full source of one slide: frontmatter, Markdown, speaker note |
   | `slidev-update-slide` | Rewrite content, speaker note, or frontmatter of a slide |
   | `slidev-insert-slide` | Insert a new slide after an existing one in the same file |
   | `slidev-remove-slide` | Delete a slide |
   | `slidev-move-slide` | Reorder by moving a slide before/after another in the same file |
   | `slidev-goto-slide` | Navigate the live presentation to a slide + click step (dev server only) |

5. Set `mcp: false` in the headmatter only when the deck must not expose the HTTP endpoint — it then answers `403`
6. After edits, re-read with `slidev-list-slides` and confirm the dev server picked the change up

### 8. Ship

> Goal: Deliver the work

1. Run `/ship`
2. If `ship` fails → report the status

## Rules

### 1. Project Location

- Standalone projects are created at the user-specified location and have their own `package.json`
- Newkub mode creates projects in `D:/newkub/slides/apps/{project-name}` only
- Newkub mode keeps Slidev deps at the root `package.json` — the app `package.json` declares only `@slides/shared` plus the `dev`/`build`/`export`/`verify` scripts
- Each project = a folder with `slides.md`, `package.json`, and optionally `components/`, `layouts/`, `public/`, `styles/`
- Use Bun as the package manager per the global rules
- Use Bun shell for automation

### 2. Slidev CLI Usage

- Use `bun create slidev@latest {project-name}` to scaffold a standalone project
- Newkub mode drives each deck through its app script: `bun run --filter @slides/{project-name} dev|build|export`
- Use `bunx slidev` (or `bunx slidev app/{name}/slides.md` from the workspace root) for the dev server
- Use `bunx slidev export` to export PDF/PPTX/PNG (requires `playwright-chromium`)
- Use `bunx slidev build` to build a static SPA
- `slidev --remote` opens remote control, `slidev theme eject` ejects the theme, `slidev mcp [entry]` starts the stdio MCP server, `http://localhost:<port>/__mcp` serves MCP over HTTP
- Newkub mode runs workspace-level commands at `D:/newkub/slides`; app-local commands run in `apps/{name}`

### 3. Headmatter Configuration

- Set `theme` as desired (seriph, default, etc.)
- Set `title` and `info` clearly
- Use `transition` for slide transitions (slide-left, slide-right, fade-out, fade-in, slide-up, slide-down)
- Enable `comark: true` for Comark syntax (formerly `mdc: true` — deprecated since v52.14)
- Canvas: `canvasWidth` + `aspectRatio`; zoom the whole slide with `zoom: 0.8`; scale elements with `<Transform :scale="0.5">`
- SEO/meta: a `seoMeta:` block and `seoMeta.ogImage`, or place `og-image.png` for the OG image; `download: true` makes the build bundle a PDF
- For Thai content, set `fonts: { sans: 'Noto Sans Thai', serif: 'Noto Sans Thai', mono: 'Noto Sans Thai' }` in the headmatter — or import the same font in `styles/index.css` with a Google Fonts `@import` + `font-family` rule

### 4. Markdown Syntax

- Use `---` to separate slides — the first frontmatter block is the headmatter (deck config); what appears after `---` is per-slide frontmatter; or use a ```` ```yaml ```` block frontmatter instead of `---`
- HTML comment `<!-- ... -->` = presenter notes; put `[click]` in notes to mark click points
- Use `layout` for custom layouts (`default`, `two-cols`, `center`, `fact`, `section`, `quote`)
- Layout slots: `::right::`, `::default::` to split content in multi-slot layouts
- Comark syntax (requires `comark: true`): inline attrs such as `{style="color:red"}`, `{.class}`, `{#id}`
- Import slides from other files with `src: ./other.md` — frontmatter merge: the main entry always wins
- Vue components can be used in Markdown; `<style>` in a slide = scoped CSS; `global-top.vue`/`global-bottom.vue` = global layers
- Icons via `<mdi-icon-name />` (Iconify); draggable elements via `v-drag`
- No more than 5 bullet points per slide

### 5. Animation Transitions

#### Click Animations

- Use `v-click` for basic click animations; `v-after` shows with the previous click; `v-click.hide`/`v-after.hide` hide after clicking
- Use the `v-clicks` component to apply v-click to all children (supports `depth`, `every` props)
- Use the `at` prop for positioning (relative '+1', '-1' or absolute 1, 2), and array values `[2, 4]` for enter/leave indices
- Use `v-switch` to switch content by click count; `clicks` frontmatter sets a custom total, `clickAnimation` sets the default preset
- Use directive modifiers such as `v-click.scale`, `v-click.fade.right`, `v-click.none` — built-in presets: fade, fade-in, up, down, left, right, scale, none
- Create custom presets with CSS rules for `.slidev-vclick-anim-{presetName}`; direction-aware styles use `forward:`/`backward:` prefixes, e.g. `forward:delay-300`
- Rough markers (hand-drawn highlight): `v-mark.underline`, `v-mark.circle`, etc.
- Drawing mode: press `C` while presenting, or configure `drawings:` in the headmatter

#### Motion Animations

- Use `v-motion` for motion effects (powered by @vueuse/motion)
- Define states: `initial`, `enter`, `leave`, `click-N`, `click-N-M`
- Combine with `v-click` on the same element to trigger motion by click states
- Use `preload: false` in the frontmatter if you want to control lazy loading of slide elements

#### Slide Transitions

- Use `transition` in the frontmatter for slide transitions
- Built-in transitions: fade, fade-out, slide-left, slide-right, slide-up, slide-down, view-transition
- Use the `view-transition-name` CSS property for the View Transitions API
- Create custom transitions with CSS classes (`.my-transition-enter-active`, `.my-transition-leave-to`)
- Use the `|` separator for forward/backward transitions (e.g. `go-forward | go-backward`)
- Use the object format for advanced options (name, enterFromClass, enterActiveClass, duration)

### 6. Feature Reference

Compact table (synced from upstream `skills/slidev/SKILL.md` — full docs at https://sli.dev)

| Feature | Usage |
|---------|-------|
| Code: line highlighting | ```` ```ts {2,3} ```` |
| Code: click-based highlighting | ```` ```ts {1\|2-3\|all} ```` |
| Code: line numbers | `lineNumbers: true` or `{lines:true}` |
| Code: scrollable | `{maxHeight:'100px'}` |
| Code: tabs | `::code-group` (requires `comark: true`) |
| Code: Monaco editor | ```` ```ts {monaco} ```` |
| Code: runnable | ```` ```ts {monaco-run} ```` |
| Code: edit files in slide | `<<< ./file.ts {monaco-write}` |
| Code: animations | ```` ````md magic-move ```` |
| Code: TypeScript types hover | ```` ```ts twoslash ```` |
| Code: import snippet | `<<< @/snippets/file.js` |
| Diagram: Mermaid | ```` ```mermaid ```` |
| Diagram: PlantUML | ```` ```plantuml ```` |
| Math: LaTeX | `$inline$` or `$$block$$` |
| Presenter: camera recording | Press `G` while presenting |
| Presenter: timer | `duration: 30min`, `timer: countdown` |
| Presenter: remote control | `slidev --remote` |
| Presenter: navigation API | `$nav`, `useNav()`, `$slidev` composables |
| Export: PDF/PPTX/PNG | `slidev export` (requires `playwright-chromium`) |
| Export: static SPA | `slidev build` + `--router-mode` |
| Export: bundle PDF | `download: true` in the headmatter |
| Export: OG image | `seoMeta.ogImage` or `og-image.png` |
| Tool: VS Code extension | `antfu.slidev` |
| Tool: MCP server | `slidev mcp [entry]` (stdio) or `http://localhost:<port>/__mcp` (HTTP, needs the dev server) |

### 7. Built-in Layouts

| Layout | Purpose |
|--------|---------|
| `cover` | Title/cover slide |
| `center` | Centered content |
| `default` | Standard slide |
| `two-cols` / `two-cols-header` | Two columns (uses `::right::`) |
| `image` / `image-left` / `image-right` | Image layouts |
| `iframe` / `iframe-left` / `iframe-right` | Embed URLs |
| `quote` | Quotation |
| `section` | Section divider |
| `fact` / `statement` | Data/statement display |
| `intro` / `end` | Intro/end slides |

### 8. MCP Server

- Slidev ships a built-in MCP server since v52.0.0 — `@slidev/cli` must be ≥52 and the host needs Node `>=22.12.0`
- Two transports: stdio reads and writes `slides.md` on disk with no dev server; HTTP `http://localhost:<port>/__mcp` needs the dev server and is the only transport exposing `slidev-goto-slide`
- The stdio server resolves its entry relative to its own working directory, so start it in the deck folder or pass the absolute deck path; the global registration in `%APPDATA%\devin\mcp_config.json` is `{ "command": "bunx", "args": ["@slidev/cli@latest", "mcp", "slides.md"] }` — verify or repair with `/use-mcp` + `/update-devin-global-mcp`
- `mcp: false` in the headmatter disables the HTTP endpoint (`403`); never guess tool names, and re-read with `slidev-list-slides` after every mutation

## Expected Outcome

- The Slidev project is created successfully per the chosen mode (standalone or `D:/newkub/slides/apps/{project-name}/`)
- Newkub mode keeps Slidev deps at the workspace root and gives the app only `@slides/shared` plus its `dev`/`build`/`export`/`verify` scripts
- `slides.md` has complete headmatter and content — use the features from `### 6` as appropriate
- The dev server runs on port 3030
- Slides render correctly in the browser
- The deck is drivable through the Slidev MCP server (stdio or HTTP) without hand-editing
- Can export as PDF/PPTX or build as a static SPA

## Resources

- Docs: https://sli.dev · Theme Gallery: https://sli.dev/resources/theme-gallery · Showcases: https://sli.dev/resources/showcases
- Upstream skill source: https://github.com/slidevjs/slidev/tree/main/skills (generated from docs v52.11.3 — re-sync when upstream changes)
