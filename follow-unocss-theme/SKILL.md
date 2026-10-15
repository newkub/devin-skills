---
name: follow-unocss-theme
description: UnoCSS theme — theme.css tokens → uno.config.ts map → theme utilities only → biome lint
related:
  - follow-lib-unocss
  - follow-design-system
  - improve
  - follow-create-biome-plugin
  - run-lint
---

## Goal

Manage the UnoCSS theme end-to-end — `theme.css` is the single source of truth for design tokens → `uno.config.ts` maps tokens per `theme.css` (nested `DEFAULT`/`hover`/`active`/`foreground`) → all UI uses theme utilities straight from the `uno.config.ts` theme (no `dark:` variant, no hardcoded palette, no shortcut layer) → enforced with a Biome plugin + a theme lint script

## Scope

Use for every theme task in a UnoCSS project (v66+/`presetWind4`) — first-time token layer, adding/adjusting tokens, dark mode, and enforcing that the UI always uses theme tokens — one workflow that branches by state (whether `theme.css` exists); first-time UnoCSS setup → run `/follow-lib-unocss` first

## Execute

### 1. Prerequisite And Detect State

> Goal: UnoCSS is ready, and know whether to create, modify, or lint

1. `uno.config.*` with `presetWind4()` is required — if missing → finish `/follow-lib-unocss` first
2. identify the CSS entry point and the project's linter (`biome.jsonc` → Biome path; `eslint.config.*` → ESLint path)
3. `theme.css`/CSS variables + a `theme.colors` map already exist → `### 4. Modify Path`; missing → `### 2-3. Create Path`; argument `lint` → `### 6. Lint`

### 2. Create Path — Token Structure

> Goal: the token model is clear before writing CSS

1. use semantic tokens only — components use `bg-primary`/`text-muted-foreground`, never `bg-blue-500`
2. every surface token has the full sub-keys per role: `DEFAULT`, `hover`, `active`, `foreground` — a missing `foreground` = broken contrast in dark mode
3. full names, no abbreviations (`--color-background` not `--bg`; `--color-muted-foreground` not `--mut`) — readable and greppable
4. store values as **channel components** (`--color-primary: 221 83% 53%`), then the config wraps them with `hsl(var(--color-primary))` → enables `bg-primary/50` (opacity modifier)
5. non-color tokens: `--radius-*`, `--shadow-*`, `--font-*` — map into the theme keys `fontFamily`/`radius`/`shadow`; others (maxWidth, minHeight, fontSize, zIndex, gridTemplateColumns) can go directly into `theme`
6. the standard token set + full examples in `references/tokens.md` — surface set: `background`, `foreground`, `surface{DEFAULT,elevated,foreground}`, `muted{DEFAULT,foreground}`, `border{DEFAULT,hover}`, `accent{DEFAULT,hover,foreground}`, `primary`, `secondary`, `success`, `warning`, `destructive`, `focus`, `overlay`, `skeleton{DEFAULT,shine}`

### 3. Create Path — theme.css And Config Map

> Goal: `theme.css` is the source of truth + `uno.config.ts` maps everything

1. create `theme.css` — light + dark + media fallback (template in `references/tokens.md`)
   - no reset needed: `presetWind4({ preflights: { reset: true } })` (default) already provides `*{box-sizing}`, `body{margin:0}`, and element normalization — repeating it = duplicated CSS
   - keep only tokens, `@font-face`, keyframes, typography scale, link/form-control look
2. `uno.config.ts` — presets/transformers/theme per the examples in `references/tokens.md`: `presetWind4({ dark: 'class' })`, `presetIcons({ scale, extraProperties })`, `presetTypography()`, `transformerDirectives()`, `transformerVariantGroup()`
3. set `content.filesystem` when classes/icons are assembled dynamically — use `globSync` from `node:fs`:

   ```ts
   import { globSync } from "node:fs"
   const sources = globSync("./src/**/*.{tsx,ts}", { cwd: import.meta.dirname })
   export default defineConfig({ content: { filesystem: sources } })
   ```

4. import `theme.css` per framework: Vite `main.ts`/root route, Next.js `app/layout.tsx`, Nuxt `nuxt.config` css array, Astro layout

### 4. Modify Path — Update Existing Theme

> Goal: adjust the existing theme without clobbering

1. read the existing `uno.config.*` — merge `theme`/`rules`/`variants` with what is there; never overwrite the whole file
2. use wind4 theme keys: `font`, `radius`, `shadow`, `breakpoint`, `ease`, `spacing`, `colors` (+ `fontFamily`/`maxWidth`/`zIndex`/`animation` allowed); avoid renamed wind3 names
3. a new token must be added to both the light and dark blocks at once + mapped in `theme.colors`
4. the UI uses **theme utilities directly** — `bg-surface`, `text-muted-foreground`, `border-border`, `rounded-md`, `shadow-lg`, `ring-focus/40`, `bg-primary-hover` … no shortcut layer in the config
   - for layout/sizing values use the normal wind4 utilities (`p-6`, `gap-3`, `max-w-content`)
   - for frequently repeated colors/spacing, **add a token** in `theme`, do not create a shortcut
5. `rules`/`variants` are the last resort only — use the theme first

### 5. Dark Mode

> Goal: dark mode works through CSS variables — the UI needs no `dark:` variant

1. the dark mode switch lives at the CSS variable layer (`theme.css`), not the utility layer — choose a selector: `.dark` class (paired with `presetWind4({ dark: 'class' })`), `[data-theme="dark"]`, or `prefers-color-scheme`
2. with `dark: 'class'` → toggle `.dark` on `<html>`; with `[data-theme]` → set the attribute on `:root` — **never set `dark: 'media'` together with a `.dark` selector** (the selector would never apply)
3. because tokens change value on their own → **the UI must not write `dark:` variants with theme colors**; `dark:` is allowed only for non-theme edge cases (e.g. a media asset)
4. toggle/persist/FOUC guard — inline script before CSS, `localStorage`, then set the class/attribute; snippets in `references/tokens.md`

### 6. Lint — Enforce Theme Usage

> Goal: all UI uses theme tokens matching `uno.config.ts` — deterministic + linter

1. run the theme lint preset (always run when a theme layer exists):

   ```bash
   bun "<skills>/follow-unocss-theme/scripts/theme-lint.ts" <project-root>
   ```

   `--json` for report/CI — exit `1` on Critical/High; checks: token parity (light↔dark), config-map orphans/missing, foreground pairs, palette hardcode, `dark:` redundant, undefined tokens, dark wiring
2. set up linter enforcement:
   - **Biome** → a `.grit` plugin per `references/biome-plugin.md` (forbid `dark:` + palette classes), with scope restricted via `overrides` in `biome.jsonc`
   - **ESLint** → `@unocss/eslint-plugin` flat config (`unocss.configs.flat`) gives `unocss/order` autofix + `unocss/blocklist`
3. extra class checks: dynamic class template literals must be full class names the scanner can see; conflicting utilities (`p-2 p-4`); `content.filesystem` must cover the real extensions; classes with no CSS at all → `scripts/check-dead-classes.ts`

### 7. Verify And Fix

> Goal: the theme is complete, all UI passes lint, no regression

1. run `/run-dev` and test `bg-background`/`bg-surface`/`text-foreground`/`border-border` — the utilities generate in the output
2. toggle dark → every color changes with the dark block with no `dark:` class; reload with no FOUC
3. contrast — `*-foreground` on its base passes WCAG AA in both modes
4. radius consistency — `rounded-[Npx]` values should snap into the theme scale (`scripts/normalize-radius.ts`)
5. icons/assets whose names are assembled dynamically must be visible to the scanner (write the full class `i-mdi:x` where the name is declared), then verify the CSS is generated
6. run `/run-lint` — theme lint + biome/eslint plugin pass; if broken → `/resolve-errors` max 3 rounds, then stop and report
7. theme findings → `/apply` mode `validate`; palette hardcode → map to the semantic token matching the intent only; never change the color itself
8. run `/report` table: `No. | Area | Check | Findings | Status`

## Rules

- `theme.css` is the single source of truth — never hardcode color values in `uno.config.ts` (map through `hsl(var(--*))` / `var(--*)` only) and never hardcode in the UI
- token names must match exactly between `theme.css` and `uno.config.ts`, all of them; use full names, no abbreviations
- **never duplicate the UnoCSS reset** — `presetWind4` preflights already handle `*{box-sizing}`, `body{margin:0}`, and normalization of `button`/`input`/`select`/`textarea`
- the UI uses **theme utilities** from the `uno.config.ts` theme only — no palette classes (`bg-blue-500`, `text-gray-600`) except `black`/`white`/`transparent`; no shortcut layer
- **no `dark:` variant in the UI** — tokens already switch through CSS variables
- the light and dark blocks must carry the identical token set (except non-color tokens that do not change)
- every surface token must have a `*-foreground` pair
- class/icon names assembled from variables must be full names visible to the UnoCSS scanner — never rely on a hand-maintained safelist
- the Biome plugin must restrict scope via `overrides.includes` to the real UI files — never run it on generated files/config
- always run `scripts/theme-lint.ts` first — deterministic, no guessing; use the linter the project already has — never install ESLint when the project uses Biome
- Use /follow-lib-unocss if needed
- Use /follow-lib-css if needed
- Use /run-lint if needed

## Expected Outcome

- `theme.css` holds full-named semantic tokens, complete in both light and dark with foreground pairs, as the single source of truth (no duplicated reset)
- `uno.config.ts` maps `theme.colors`/non-color keys exactly to `theme.css` for every token, via `hsl(var(--*))`/`var(--*)` + `content.filesystem` from `globSync`
- the UI uses theme utilities straight from the `uno.config.ts` theme — no palette hardcoding, no `dark:` variants, no shortcut layer
- every dynamically-assembled class/icon name appears as a full name in source → the scanner generates all CSS
- the Biome plugin (scoped via `overrides`) or the ESLint plugin enforces the rules in the project's linter
- `theme-lint.ts` + `/run-lint` pass — token parity, pairs, wiring, and undefined tokens all clean
- dark mode toggle works + persists + no FOUC; radius values consistently use the theme scale
