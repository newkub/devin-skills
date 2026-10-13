---
name: design-cli-prototype
description: Create a CLI explorer prototype (SolidJS+Vite+UnoCSS) in temp, open via /open-web
argument-hint: "[cli-name-or-spec]"
related:
  - design-prototype-in-html
  - design-web-prototype
  - follow-solid-framework
  - follow-lib-solidjs
  - follow-lib-unocss
  - follow-tool-vite
  - learn-from-cli
  - create-files-in-os-temp
  - check-open-ports
  - open-web
  - ask-me
  - report
---

## Goal

Build a real CLI documentation/explorer prototype with SolidJS + TypeScript + Vite + UnoCSS — a typed `Command` schema as the single source of truth, split into Human Mode (visual exploration) + Agent Mode (Markdown/Raw/Copy) — built in OS temp and opened with `/open-web`

## Scope

Use when you need a schema-driven CLI docs site prototype — command syntax explorer, option builder, inspector, terminal preview, agent-consumable markdown

- General single-file HTML UI prototype → `/design-prototype-in-html`
- Production CLI docs site in a real project → `/follow-solid-framework`, not this skill

Full spec: [references/spec.md](references/spec.md)

## Execute

### 1. Gather CLI Spec

> Goal: Know what the CLI offers

1. Take the CLI name + commands from the argument or context; if unspecified → use the default dataset in `references/spec.md` (`run`, `build`, `dev`, `deploy` + `plugins`, `presets`, `config`)
2. A real CLI exists → extract the command surface per `/learn-from-cli`, then map it into the `Command` type
3. Scope unclear (command count, sections, theme) → run `/ask-me`

### 2. Scaffold Project

> Goal: A ready SolidJS app in temp

1. Run `/create-files-in-os-temp` — create `<temp>/cli-prototype-<name>/`
2. Scaffold per `/follow-solid-framework`: `bun create vite` (template `solid-ts`) → `bun add -d unocss` + config per `/follow-lib-unocss`
3. Create the `src/` tree following the component architecture in `references/spec.md` — `data/` (typed schema), `lib/` (builder/parser/markdown-generator/search), `components/`, `routes/`

### 3. Implement Dual Modes

> Goal: human + agent experiences from one schema

1. `data/commands.ts` = typed `Command[]` (name, description, usage, arguments, options, examples, exitCodes, relatedCommands) — the single source every UI derives from
2. Human Mode: `CommandSyntax` (tokenized, hover/click token → inspector), `CommandBuilder` (toggle options/args → live command string), `CommandInspector`, `ExampleTerminal`, `StickyCommandBar` — use `createSignal`/`createMemo`/`createStore` per `/follow-lib-solidjs`
3. Agent Mode: `AgentMarkdown` + `MarkdownToolbar` — generate markdown from the schema via `lib/markdown-generator.ts` programmatically (never hand-write) + Raw (JSON) + Copy
4. `ModeSwitcher` toggles `?mode=human|agent`; builder state serializes into query params (`?preset=production&port=8080`) — shareable
5. Routing: `/commands/<name>`, `/plugins`, `/plugins/<name>`, `/presets`, `/presets/<name>`, `/config` — parse `location.pathname` + query with a lightweight `lib/` router or `@solidjs/router`

### 4. Apply UX Quality Bar

> Goal: meet the spec — responsive, a11y, microinteractions, error states

1. Responsive: desktop `Sidebar | Docs | Inspector`, tablet `Sidebar | Docs`, mobile `Header + Command + Docs + BottomNav` — every hover interaction must have a click/tap equivalent
2. Accessibility: semantic HTML, keyboard nav, focus states, ARIA, accessible dialogs/tooltips, reduced motion, contrast — focus ring via UnoCSS shortcuts
3. UnoCSS: reusable shortcuts (`surface`, `code-surface`, `command-token`, `option-token`, `muted-text`, `interactive`, `focus-ring`, etc.) + variants (`hover:`, `focus:`, `disabled:`, `group-hover:`, `dark:`, `sm:`–`xl:`) — never scatter arbitrary styles
4. Microinteractions + error states per `references/spec.md` — fast, subtle, purposeful

### 5. Run And Open

> Goal: the user sees a working prototype

1. `bun install` → `bun run dev` in the background per `/follow-tool-vite` (or `bun run build` + `bun run preview` for SPA fallback on deep routes)
2. Run `/check-open-ports`; if the port conflicts → change the port
3. Run `/open-web` to open the URL — verify no console errors, every route is reachable, `?mode=agent` renders markdown correctly
4. Run `/report` summarizing the temp path, URL, and covered commands/routes; if the user asks for changes → edit in the same temp folder and refresh

## Rules

- Prototypes are written to OS temp only — never write into the project (unless the user orders it)
- The typed `Command` schema = single source of truth — Human/Agent modes derive from the same schema; never hardcode docs separately
- Agent Mode markdown must always be generated programmatically
- Every hover interaction must have a click/tap equivalent — never rely on hover alone
- UnoCSS is the primary styling approach — shared reusable shortcuts, no scattered arbitrary values
- Animations must be fast + subtle — never sacrifice performance for visual effects
- Always follow the `/follow-solid-framework`, `/follow-lib-unocss`, `/follow-lib-solidjs` conventions
- Always use `/create-files-in-os-temp`, `/open-web`, `/check-open-ports`; use `/ask-me` when needed

## Expected Outcome

- The CLI explorer prototype runs on localhost and opens in the browser — every route/mode works
- Human Mode: explore syntax, build commands, inspect options, and view examples in the terminal
- Agent Mode: markdown/raw output deterministic from the schema + copyable
- No prototype files mixed into the project source
