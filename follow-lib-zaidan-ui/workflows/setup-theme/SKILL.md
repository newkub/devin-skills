---
name: follow-lib-zaidan-ui-setup-theme
description: Setup Zaidan UI theme — registry config, Tailwind v4 variables, dark mode
argument-hint: "[scope]"
related:
  - follow-lib-zaidan-ui
  - follow-lib-shadcn-solid
  - run-install
  - run-dev
  - resolve-errors
---

## Goal

Set up the Zaidan UI theme — `components.json` registry config, Tailwind CSS v4 variables, and dark mode on SolidJS

## Scope

Use when setting up the theme for the first time in a Zaidan UI project — covers `components.json`, `registries` config, `globals.css` theme variables, and dark mode via `data-kb-theme`

## Execute

### 1. Prerequisite

> Goal: the project has already set up the Zaidan registry

1. Do `/follow-lib-zaidan-ui` steps 1-2 first — Tailwind CSS v4 and `components.json` must exist
2. Check `components.json`: `style: "kobalte"`, `rsc: false`, `registries` points `@zaidan` → `https://zaidan.carere.dev/r/{style}/{name}.json`
3. Check the `@/` path alias in `tsconfig.json` and the Vite config matches `aliases`
4. If there is no `components.json` yet → run `bunx shadcn@latest init` first

### 2. Configure globals.css Theme Variables

> Goal: define the theme variables in `src/styles/globals.css`

1. Open `globals.css` per the `tailwind.css` path in `components.json`
2. Define the standard CSS variable set in `:root` — `background`, `foreground`, `primary`, `secondary`, `muted`, `accent`, `destructive`, `border`, `input`, `ring`, `radius` (see the full set in the official docs at `https://zaidan.carere.dev/docs`)
3. Map the variables into the Tailwind v4 `@theme` block or the format Zaidan components use — see the official docs
4. Put dark variables in the `[data-kb-theme="dark"]` or `.dark` block — the same complete set as `:root`

### 3. Setup cn Helper

> Goal: confirm the `cn` helper is ready

1. Check `src/lib/utils.ts` has a `cn` that merges `clsx` + `tailwind-merge`
2. Import components with the `@/components/ui/*` alias per `components.json`

### 4. Configure Dark Mode

> Goal: configure the dark mode toggle

1. Use the `data-kb-theme` attribute on `<html>` (Kobalte convention) or the scheme the project defines
2. Add a toggle that sets/removes the attribute and persists it with `localStorage`

### 5. Verify

> Goal: smoke test the theme and components

1. Run `/run-dev` — add a component (`bunx shadcn@latest add @zaidan/button`) and test it
2. Toggle dark mode — colors must change with the variables
3. Run the build — no errors from missing variables/aliases/registry
4. If it breaks → do `/resolve-errors` max 3 rounds, then stop and report

## Rules

- Use the `bunx shadcn@latest` CLI, not `shadcn-solid`
- Always use CSS variables — never hard-code colors in components
- `:root` and the dark block must carry the same complete token set
- `style: "kobalte"` and `rsc: false` must be correct in `components.json`
- Use `/follow-lib-zaidan-ui` for the full reference

## Expected Outcome

- `components.json` registry and `globals.css` variables are fully configured
- Zaidan components render with the correct theme colors in both light/dark
- The `cn` helper and path aliases work
- The build passes with no errors
