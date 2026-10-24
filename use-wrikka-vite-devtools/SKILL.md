---
name: use-wrikka-vite-devtools
description: Mount the Devframe hub, add-ons, MCP and comment→agent overlay via the wrikka-vite-devtools plugin
argument-hint: "[vite-config-or-scope]"
allowed-tools:
  - exec
  - read
related:
  - follow-tool-vite
  - follow-tool-vite-devtools
  - follow-tool-pkg-new
  - check-types-definition
  - run-dev
  - report
  - suggest-next-action
---

## Goal

Use the `wrikka-vite-devtools` Vite plugin in a host project to mount a Devframe hub with the add-on set
(`inspect`, `og`, `a11y`, `git`, `assets`, `terminals`; opt-in: `data-inspector`, `code-server`, `unocss`),
an in-app comment overlay that starts an agent CLI on submit, and an aggregate MCP endpoint at `<base>__mcp`

## Scope

- In: installing and mounting the plugin in any Vite project, verifying hub/overlay/MCP, day-to-day options
- Out: developing or maintaining the plugin itself → `/update-wrikka-vite-devtools`; general Vite dev-server config → `/follow-tool-vite`; general Devframe docs → `/follow-tool-vite-devtools` (`### 8`); full option/RPC reference → the plugin repo's `USAGE.md`
- Source repo: `%APPDATA%\devin\skills\wrikka-vite-devtools\` (git submodule, pkg.pr.new preview releases — not published to npm)

## Execute

### 1. Install In The Host Project

> Goal: the plugin package is available

1. Get a preview ref from the plugin repo (latest pushed sha) — run `/follow-tool-pkg-new` for the URL pattern
2. `bun add -D "wrikka-vite-devtools@https://pkg.pr.new/wrikka/wrikka-vite-devtools@<ref>"`
3. Check `@devframes/plugin-code-server` is installed only if planning `plugins: 'all'` (optional peer)

### 2. Add To vite.config.ts

> Goal: the plugin mounts before the framework so the overlay injects first

```ts
import { useWrikkaViteDevtools } from 'wrikka-vite-devtools/vite'

export default defineConfig({
  // must come before framework plugins (solid/vue/react) so the overlay injects first
  plugins: [useWrikkaViteDevtools()],
})
```

Options: `base` (`/__devframes/`), `plugins` (keys or `'all'`), `mcp` (`'auto'|true|false`), `auth`,
`build`, `quiet`, `overlay` (`false` drops the in-page pill; the hub Comments tab stays), `agent` (`{ driver: 'auto'|'claude'|'codex'|'opencode', autoRun }`),
`skillsRoots` (extra harness skill dirs) — check types with `/check-types-definition` when unsure

### 3. Run And Verify

> Goal: hub, overlay and MCP all respond

1. Run `/run-dev` (port free check included) then verify:
   - `http://localhost:<port>/__devframes/` — hub UI; every frame at `<base><id>/` must return 200
   - Overlay pill (mode picker / Comment / Pins / hub link + badge) loads bottom-right on an app page;
     it never mounts inside hub or dock documents
   - In SSR apps (TanStack Start / Solid Start / Nuxt / SvelteKit) the dev-only
     `wrikka-vite-devtools:ssr-inject` middleware inserts `<base>embedded.js` before `</body>` of the
     streamed HTML (Vite's `transformIndexHtml` never runs)
2. pick element → submit comment → status flips `queued` → `running` → `done`; logs stream on `agent-logs`
3. Hub `Comments` tab — Inbox (poll, filters, Re-run, streamed logs), New comment, Ideas, Diagnostics
4. MCP: `POST <base>__mcp` with an `Origin` header matching the Vite server; `tools/list` aggregates
   `wrikka-vite-devtools_*` ids plus `devframes_plugin_*`, `devframes_service_git_*`

### 4. Report

> Goal: summarize the mount result

1. Show results with `/report` (No., Resource, Status, URL/ID)
2. Run `/suggest-next-action` at the end

## Rules

### 1. Mount Constraints

- Only pass `plugins: 'all'` when `@devframes/plugin-code-server` is installed (optional peer)
- `unocss` is dock-only — it iframes `@unocss/vite`'s inspector at `/__unocss/`; it is not a devframe
- Services (`@devframes/service-{open,git,shiki}`) are self-provided by the plugins — never pass `services` into hub options
- MCP `tools/call` arguments are positional — a single-object RPC signature arrives as `{"arg0": {…}}`;
  a flat object fails with `DF0043`
- Hub dock icons load at runtime from `api.iconify.design` — offline blanks the glyph; the in-page pill is immune (inline SVG)

### 2. Safety

- Never disable `auth` on a shared or non-localhost machine
- Agent runs are driven from `process.cwd()` of the dev server — keep it the intended project
- Do not stack `@vitejs/devtools` on top — the project already has a dock; see `/follow-tool-vite-devtools` boundaries

Use /follow-tool-vite-devtools if needed (layers, Kit, Devframe `### 8`)
Use /follow-tool-vite plugins if needed

## Expected Outcome

- A host project gets the devtools hub, MCP tools and the comment→agent overlay with a single plugin line, no extra wiring
- Hub, pill and MCP verified live before reporting done
