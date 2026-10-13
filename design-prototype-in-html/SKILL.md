---
name: design-prototype-in-html
description: Create an interactive HTML prototype/mockup from a design brief — single-file, /open-web
argument-hint: "[brief-or-feature]"
related:
  - report-html
  - report-prompt-uxui-web-design
  - visualize-in-web
  - open-web
  - create-files-in-os-temp
  - ask-me
---

## Goal

Create an interactive design prototype as single-file HTML — rendered per `/report-html` conventions (Tailwind CDN + Vue 3, theme toggle, interactive components) — opened with `/open-web` from a temp dir

## Scope

Use when you need a UI/flow prototype before real implementation — screen mockups, user flows, component states, responsive layouts

- Need a prompt for AI image/design generation → `/report-prompt-uxui-web-design`
- Need a visual report from existing data → `/visualize-in-web` or `/report-html` directly
- Production UI → implement in the real project, not this skill

## Execute

### 1. Gather Brief

> Goal: Know what to prototype

1. If the argument is a feature/route → gather requirements: screens, components, interactions, states
2. Unclear → run `/ask-me` (scope: one screen or several, device targets, fidelity)
3. Specify the needed mock data — realistic sample data, not lorem ipsum

### 2. Build Prototype

> Goal: A single-file HTML that actually works

1. Run `/create-files-in-os-temp` — create `<temp>/prototype/index.html`
2. Follow `/report-html` conventions: `<!DOCTYPE html>` + Tailwind CDN + Vue 3 (`vue.global.js`) + dark mode toggle
3. Use interactive elements as the prototype requires: tabs, modals, drawers, hover states, form inputs, transitions — Vue `v-if`/`v-for`/`v-model`/`@click`
4. Multiple screens → a sticky nav/tab bar switching screens within the single file (no separate files)
5. Mobile view → responsive + device frame (rounded border + width, e.g. `max-w-[390px]`) when the brief specifies it
6. Annotations are allowed — a badge/note marking it as a prototype (e.g. "mock data", "not wired")

### 3. Open And Iterate

> Goal: the user can view and keep editing it

1. Run `/open-web` to open the file in temp
2. Run `/report` summarizing the path + covered screens/states
3. If the user asks for changes → edit the same file in temp, then refresh

## Rules

- Write prototypes to temp only — never write into the project (unless the user orders it)
- It must be genuinely interactive — not a static image/screenshot
- Single file — all assets via CDN, mock data inline
- Fidelity per brief — lo-fi wireframe (gray boxes, fast) or hi-fi (per the design system) — default hi-fi-lite: real components, restrained styling

- Always follow `/report-html` conventions for the HTML
- Always use `/open-web`, `/create-files-in-os-temp`
- Use `/ask-me` when needed

## Expected Outcome

- Interactive prototype open in the browser — the user can really click and toggle states
- Easy to share/iterate (one file in temp)
- No prototype files mixed into the project source
