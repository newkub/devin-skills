---
name: follow-lib-zaidan-ui-config-tokens
description: Tune Zaidan UI theme tokens — colors, radius, Tailwind v4 mapping
argument-hint: "[scope]"
related:
  - follow-lib-zaidan-ui
  - follow-lib-shadcn-solid
  - follow-design-system
  - improve
  - resolve-errors
---

## Goal

Tune the Zaidan UI theme tokens — color palette, radius, semantic tokens, and Tailwind v4 mapping in `globals.css`

## Scope

Use when editing theme tokens after setup — covers CSS variables, `@theme` mapping, component customization in `src/components/ui/`, and token consistency

## Execute

### 1. Read Current Tokens

> Goal: read the current tokens structure before editing

1. Open `src/styles/globals.css` — inspect the CSS variables in `:root` and the dark block, including the `@theme` mapping
2. Open `components.json` — check the `tailwind.css` path and aliases
3. If no theme exists yet → run the `setup-theme` workflow first; always merge with the original, never overwrite
4. Run `/deep-review` domain `review-config` if unsure the tokens match what the components reference

### 2. Adjust Color And Radius Tokens

> Goal: change the palette and radius to match the design

1. Edit variable values in `:root` and the dark block together — every token must exist in both modes
2. Adjust `--radius` as the single source of corner radius
3. Add new semantic tokens (e.g. `success`, `warning`) following the existing naming convention
4. New tokens must map into `@theme` or the utility layer Tailwind v4 uses — see the official docs at `https://zaidan.carere.dev/docs`

### 3. Customize Component Variants

> Goal: adjust variants in the copied components

1. Open the component in `src/components/ui/` — edit variant classes to reference tokens (e.g. `bg-primary`), not the raw palette
2. Use the `cn` helper for merging classes — never repeat hard-coded overrides in JSX
3. Never edit Kobalte/Corvu primitives source — customize only the copied components

### 4. Verify

> Goal: confirm new and old tokens both work

1. Run dev — test the changed components in both light/dark
2. Check the new utility classes generate correctly in the Tailwind v4 output
3. If it breaks → revert the keys just changed, then report the diff

## Rules

- Edit tokens in one place, `globals.css` — components reference tokens only
- `:root` and the dark block must always carry the same complete set
- Use Tailwind CSS v4 syntax (`@theme`) as Zaidan does — see the official docs
- Never edit Kobalte/Corvu primitives source
- Use `/follow-lib-zaidan-ui` for the full reference

## Expected Outcome

- Theme tokens tuned to the design — palette, radius, and semantic colors complete
- Tokens map correctly into Tailwind v4 utilities
- Dark mode covers all new tokens
- The original config is not clobbered
