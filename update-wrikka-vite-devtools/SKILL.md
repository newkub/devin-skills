---
name: update-wrikka-vite-devtools
description: Maintain the wrikka-vite-devtools plugin — build, architecture, RPC surface, pkg.pr.new shipping
argument-hint: "[scope]"
allowed-tools:
  - exec
  - read
related:
  - use-wrikka-vite-devtools
  - follow-tool-vite-devtools
  - follow-tool-tsdown
  - follow-tool-pkg-new
  - git-commit-and-push
  - run-build
  - run-check
  - update-references
  - report-before-after
---

## Goal

Update and maintain the `wrikka-vite-devtools` plugin repo itself — source changes, build verification,
RPC/option surface, docs sync, and shipping a pkg.pr.new preview — with minimal diff per the repo's own standards

## Scope

- In: the repo at `%APPDATA%\devin\skills\wrikka-vite-devtools\` (a git submodule of `devin-skills`): `src/`, `scripts/`, build configs, `README.md`, `USAGE.md`, `.github/workflows/`
- Out: mounting the plugin in a host project → `/use-wrikka-vite-devtools`; upstream Devframe behaviour → `/follow-tool-vite-devtools` (`### 8`)
- The repo's `AGENTS.md` is the SSOT for layering, bundling constraints, and code conventions — read it before editing, never restate it here

## Execute

### 1. Read The Original First

> Goal: understand intent and the current surface before changing anything

1. Read `wrikka-vite-devtools/AGENTS.md` (architecture + Rules) and `USAGE.md` (option/RPC surface)
2. Read `src/protocol.ts` before touching any RPC — it is the single source of truth for server handlers and the overlay's plain-TS mirror
3. Check `git status` in the submodule — the repo may carry in-progress work; do not clobber it

### 2. Apply The Change

> Goal: minimal, idempotent edits that follow the repo layering

1. One change per pass; follow the layering `vite.ts → add-ons.ts → devframe.ts → rpc/*` documented in `AGENTS.md`
2. A new RPC context gets its own `src/rpc/<context>.ts`, kebab-case `name` on `defineRpcFunction`, zod `args`/`returns`, `jsonSerializable: true`
3. A new public option goes through `UseWrikkaViteDevtoolsOptions` → `DevframeOptions`, both JSDoc'd
4. Never edit upstream `@devframes/*` in `node_modules` as a fix — work around it in-repo and note the constraint in `AGENTS.md`

### 3. Verify The Build

> Goal: every gate passes before shipping

1. Run `/run-build` (`bun run build`) and `/run-check` (`bun run typecheck`) in the repo — both must be clean
2. Build order is load-bearing (`pkg` → `overlay` + CSS inline → `client`; `tsdown clean:true` wipes `dist`)
3. `bun run playground` → hub at `http://localhost:5199/__devframes/`; pick element → comment → run flips to `done`
4. `curl` the MCP endpoint with an `Origin` header — `tools/list` contains every `wrikka-vite-devtools_*` id from `USAGE.md`

### 4. Sync Docs

> Goal: docs match the real surface

1. Update `README.md` / `USAGE.md` tables when the option or RPC surface changes — renamed RPC ids must update `USAGE.md` §5
2. Run `/update-references` so no doc or skill points at a removed name
3. Consumers: `/use-wrikka-vite-devtools` mirrors the mount workflow — keep the two consistent

### 5. Ship

> Goal: preview release published and pointers bumped

1. Run `/git-commit-and-push` in the submodule — CI (`.github/workflows/publish.yml`) publishes a pkg.pr.new preview for the new sha (see `/follow-tool-pkg-new`)
2. Bump the `devin-skills` parent gitlink after the submodule commit lands
3. Report with `/report-before-after` (what changed, gates passed, preview ref for hosts)

## Rules

- The overlay bundle stays ONE self-contained file (`codeSplitting: false` + CSS inlined by `scripts/inline-overlay-css.ts`) — sibling assets 404 under the hub's `__page-script` base
- `src/overlay/main.tsx` must export a callable `default` behind the `window.__WRIKKA_VITE_DEVTOOLS_OVERLAY__` guard
- The browser bundle stays free of `zod` — protocol types are mirrored in plain TS (`src/overlay/api.ts`)
- Files ≤250 lines, one responsibility each; no speculative exported symbols
- Never commit without the user asking; this skill edits the submodule only

Use /follow-tool-tsdown if bundler config changes
Use /run-dev if the playground must stay up for manual checks

## Expected Outcome

- `bun run build` and `bun run typecheck` pass; playground shows a full comment→agent→done loop
- `README.md` / `USAGE.md` match the real option and RPC surface
- Preview release published through pkg.pr.new and consumable via `/use-wrikka-vite-devtools`
