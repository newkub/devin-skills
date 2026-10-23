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

---

## Goal

Create and develop presentation slides with Slidev (Vite + Vue + Markdown), both as a standalone project (with its own `package.json`) and inside the `D:/newkub/slides` monorepo — technical talks, code walkthroughs, teaching materials, interactive demos, math/diagrams, presenter recording, PDF/PPTX/SPA export

## Scope

- Standalone project: create with `bun create slidev` at the user-specified location, with its own `package.json`
- Newkub slides: use the existing `D:/newkub/slides` with a single `package.json` at the root — each project has only `slides.md`; don't create a new `package.json`
- If you need the `D:/newkub/slides`-specific flow → use `/create-slide-in-newkub-slides`
- Canonical upstream reference: `skills/slidev/SKILL.md` at https://github.com/slidevjs/slidev (generated from docs v52.11.3) — this skill merges the feature tables into a single SKILL.md file with no `references/`

- Packages: `@slidev/cli`, `@slidev/theme-seriph`/`@slidev/theme-default`, `vue`, `playwright-chromium` (for `slidev export`) — always confirm the latest versions with `/deep-research` + `/follow-best-practice` (not pinned in this file — per `/update-agents-skills-global`); `mdc` headmatter renamed to `comark` since v52.14

## Execute

### 1. Choose Project Mode

> Goal: Pick the mode based on the project location

1. Run `/deep-research` + `/follow-best-practice` to confirm the latest versions and patterns, then run `/deep-review` to summarize the tech stack
2. Get the project name and location from the user — if no location is given → use the current directory
3. If creating inside `D:/newkub/slides` → do steps 2-5 (shared root `package.json`)
4. If creating standalone outside `D:/newkub/slides` → check the location is free (ask first if something exists there), then run `bun create slidev@latest {project-name}` + `bun install` — standalone has its own `package.json`; skip step 2

### 2. Verify Root Setup (newkub mode)

> Goal: Verify Root Setup

1. Check that `D:/newkub/slides/package.json` already exists
2. If not, create the root `package.json` with dependencies:
   - `@slidev/cli`
   - `@slidev/theme-seriph`
   - `@slidev/theme-default`
   - `vue`
3. Run `bun install` at the root

### 3. Create Slide Project

> Goal: Create Slide Project

1. Newkub mode: create the `D:/newkub/slides/{project-name}/` directory with `slides.md` — don't create a `package.json`
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

1. Newkub mode: run `bunx slidev {project-name}/slides.md` at the root directory
2. Standalone mode: run `bunx slidev` in the project directory (run `/run-dev`)
3. The dev server runs on port 3030 (default)
4. Open the browser to view the slides in real time

### 6. Export Slides (Optional)

> Goal: Export Slides (Optional)

1. Use `bunx slidev export {project-name}/slides.md` to export as PDF (requires `playwright-chromium` — if export fails with a browser error, install it first)
2. Use `bunx slidev build {project-name}/slides.md --out dist/{project-name}` to build a static SPA — use `--router-mode hash|memory|history` if the host doesn't support SPA routing
3. Standalone mode uses `bunx slidev build` / `bunx slidev export` in the project directory

### 7. Ship

> Goal: Deliver the work

1. Run `/ship`
2. If `ship` fails → report the status

## Rules

### 1. Project Location

- Standalone projects are created at the user-specified location and have their own `package.json`
- Newkub mode creates projects in `D:/newkub/slides` only
- Newkub mode has a single `package.json` at the root — no per-project `package.json`
- Each project = a folder with `slides.md` and optionally `components/`, `layouts/`, `public/`, `styles/`
- Use Bun as the package manager per the global rules
- Use Bun shell for automation

### 2. Slidev CLI Usage

- Use `bun create slidev@latest {project-name}` to scaffold a standalone project
- Use `bunx slidev {project}/slides.md` to run the dev server for that newkub project
- Use `bunx slidev` for the dev server in a standalone project
- Use `bunx slidev export` to export PDF/PPTX/PNG (requires `playwright-chromium`)
- Use `bunx slidev build` to build a static SPA
- `slidev --remote` opens remote control, `slidev theme eject` ejects the theme, `slidev mcp` or `http://localhost:<port>/__mcp` for AI agents
- Newkub mode always runs commands at the root directory `D:/newkub/slides`

### 3. Headmatter Configuration

- Set `theme` as desired (seriph, default, etc.)
- Set `title` and `info` clearly
- Use `transition` for slide transitions (slide-left, slide-right, fade-out, fade-in, slide-up, slide-down)
- Enable `comark: true` for Comark syntax (formerly `mdc: true` — deprecated since v52.14)
- Canvas: `canvasWidth` + `aspectRatio`; zoom the whole slide with `zoom: 0.8`; scale elements with `<Transform :scale="0.5">`
- SEO/meta: a `seoMeta:` block and `seoMeta.ogImage`, or place `og-image.png` for the OG image; `download: true` makes the build bundle a PDF
- For Thai content, use the `Noto Sans Thai` font via the `fonts` config in the headmatter:
  ```yaml
  fonts:
    sans: 'Noto Sans Thai'
    serif: 'Noto Sans Thai'
    mono: 'Noto Sans Thai'
  ```
- Or import the same font in `styles/index.css` with the Google Fonts `@import url(...)` + `font-family` rule

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

- Use `v-click` for basic click animations
- Use `v-after` to show when the previous v-click triggers
- Use `v-click.hide` or `v-after.hide` to hide after clicking
- Use the `v-clicks` component to apply v-click to all children (supports `depth`, `every` props)
- Use the `at` prop for positioning (relative '+1', '-1' or absolute 1, 2)
- Use array values `[2, 4]` for enter/leave indices
- Use `v-switch` to switch content by click count
- Use the `clicks` frontmatter for a custom total clicks count
- Use the `clickAnimation` frontmatter for the default animation preset
- Use directive modifiers such as `v-click.scale`, `v-click.fade.right`, `v-click.none`
- Built-in presets: fade, fade-in, up, down, left, right, scale, none
- Create custom presets with CSS rules for `.slidev-vclick-anim-{presetName}`
- Direction-aware styles: `forward:`/`backward:` prefixes, e.g. `forward:delay-300`
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
| Presenter: ruby text | `notesAutoRuby:` |
| Presenter: slide hooks | `onSlideEnter()`, `onSlideLeave()` |
| Presenter: navigation API | `$nav`, `useNav()`, `$slidev` composables |
| Export: PDF/PPTX/PNG | `slidev export` (requires `playwright-chromium`) |
| Export: static SPA | `slidev build` + `--router-mode` |
| Export: bundle PDF | `download: true` in the headmatter |
| Export: remote assets | remote URLs are cached automatically during build |
| Export: OG image | `seoMeta.ogImage` or `og-image.png` |
| Export: SEO meta | `seoMeta:` block |
| Tool: side editor | click the edit icon in dev mode |
| Tool: VS Code extension | `antfu.slidev` |
| Tool: format | `bun fmt` (built-in, Markdown/TS) or `vp fmt` — no Prettier plugin needed |
| Tool: eject theme | `slidev theme eject` |
| Tool: MCP server | `slidev mcp` or the `/__mcp` endpoint |

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

## Expected Outcome

- The Slidev project is created successfully per the chosen mode (standalone or `D:/newkub/slides/{project-name}/`)
- Newkub mode has no per-project `package.json` — only the root `package.json` is used
- `slides.md` has complete headmatter and content — use the features from `### 6` as appropriate
- The dev server runs on port 3030
- Slides render correctly in the browser
- Can export as PDF/PPTX or build as a static SPA

## Resources

- Documentation: https://sli.dev
- Theme Gallery: https://sli.dev/resources/theme-gallery
- Showcases: https://sli.dev/resources/showcases
- Upstream skill source: https://github.com/slidevjs/slidev/tree/main/skills (generated from docs v52.11.3 — re-sync when upstream changes)
