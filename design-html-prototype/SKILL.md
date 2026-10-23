---
name: design-html-prototype
description: Create an interactive HTML prototype/mockup from a design brief — single-file, /open-web
argument-hint: "[brief-or-feature]"
related:
  - follow-devin-global-skills
  - design-web-prototype
  - design-cli-prototype
  - design-tui-prototype
  - report-in-html
  - report-prompt-uxui-web-design
  - visualize-in-web
  - open-web
  - create-files-in-os-temp
  - ask-me
  - follow-web-standard
---

## Goal

Create an interactive design prototype as single-file HTML — rendered per `/report-in-html` conventions (Tailwind CDN + Vue 3, theme toggle, interactive components) — opened with `/open-web` from a temp dir

## Scope

Use when you need a UI/flow prototype before real implementation — screen mockups, user flows, component states, responsive layouts

- Need a prompt for AI image/design generation → `/report-prompt-uxui-web-design`
- Need a visual report from existing data → `/visualize-in-web` or `/report-in-html` directly
- Multi-route/production-quality interactive app prototype (SolidJS + Vite) → `/design-web-prototype`
- CLI or TUI prototype to be discussed in chat only → `/design-cli-prototype` / `/design-tui-prototype`
- Production UI → implement in the real project, not this skill

## Execute

### 1. Load Skills

> Goal: build on the conventions that already exist, not from memory

1. Run `/follow-devin-global-skills` — list global (`%APPDATA%\devin\skills`) and project (`.agents/skills/`) skills matching the brief's domain
2. Read the ones this prototype must obey: `/report-in-html` (single-file conventions), `/follow-web-standard` (native elements), `/follow-lib-css`, `/follow-design-system`
3. Project `AGENTS.md` → read its `### Skills` section; reuse the project's existing visual language instead of a generic one

### 2. Gather Brief

> Goal: Know what to prototype

1. Run `/ask-me` first — mandatory before any draft: scope (one screen or several), device targets, fidelity (lo-fi vs hi-fi), and the interactions that must really be clickable
2. If the argument is a feature/route → fold those answers into requirements: screens, components, interactions, states; `dont-ask-me` → state the assumptions it would have asked and proceed
3. Specify the needed mock data — realistic sample data, not lorem ipsum

### 3. Build Prototype

> Goal: A single-file HTML that actually works

1. Run `/create-files-in-os-temp` — create `<temp>/prototype/index.html`
2. Follow `/report-in-html` conventions: `<!DOCTYPE html>` + Tailwind CDN + Vue 3 (`vue.global.js`) + dark mode toggle
3. Use interactive elements as the prototype requires: tabs, modals, drawers, hover states, form inputs, transitions — Vue `v-if`/`v-for`/`v-model`/`@click`; prefer native elements (`<dialog>`, `popover` attribute, native form validation) per `/follow-web-standard`
4. Multiple screens → a sticky nav/tab bar switching screens within the single file (no separate files)
5. Mobile view → responsive + device frame (rounded border + width, e.g. `max-w-[390px]`) when the brief specifies it
6. Annotations are allowed — a badge/note marking it as a prototype (e.g. "mock data", "not wired")

### 4. Open And Iterate

> Goal: the user can view and keep editing it

1. Run `/open-web` to open the file in temp
2. Run `/report` summarizing the path + covered screens/states
3. If the user asks for changes → edit the same file in temp, then refresh

## Rules

- Write prototypes to temp only — never write into the project (unless the user orders it)
- Always run `/follow-devin-global-skills` first — the project/stack skills own the markup, styling, and design-system conventions; never invent a parallel set
- It must be genuinely interactive — not a static image/screenshot
- Single file — all assets via CDN, mock data inline
- Fidelity per brief — lo-fi wireframe (gray boxes, fast) or hi-fi (per the design system) — default hi-fi-lite: real components, restrained styling

- Always follow `/report-in-html` conventions for the HTML
- Always use `/open-web`, `/create-files-in-os-temp`
- Always start with `/ask-me` — never build before the brief is confirmed; `dont-ask-me` → record the assumed answers before building

## Expected Outcome

- Interactive prototype open in the browser — the user can really click and toggle states
- The skills read first are listed, and the markup/styling follows the conventions they already define
- Easy to share/iterate (one file in temp)
- No prototype files mixed into the project source
