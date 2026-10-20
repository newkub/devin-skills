# Use Case — Per-Icon Imports and a Bundle Budget

> Keep icon payload proportional to the icons actually used: import single icons, register them explicitly, and fail the build when the count drifts. Source: https://iconify.design/docs/icons/icon-bundles/ (accessed 2026-10-20)

## 1. Import one icon, not the set

```bash
bun add @iconify/react @iconify-icons/lucide
```

```tsx
// src/icons/register.ts
import { addIcon } from "@iconify/react";
import home from "@iconify-icons/lucide/home";
import search from "@iconify-icons/lucide/search";

addIcon("lucide:home", home);
addIcon("lucide:search", search);
```

Each module under `@iconify-icons/*` contains exactly one icon, so a bundler keeps the imported ones and drops the rest. Registering a whole `icons.json` instead pulls every glyph in the set into the bundle.

## 2. Register before the first render

```tsx
// src/main.tsx
import "./icons/register";
import { createRoot } from "react-dom/client";

createRoot(document.getElementById("root")!).render(<App />);
```

An icon registered after the component mounts renders an empty box on first paint and fills in later — a visible flash that looks like a network problem and is really an import-order problem.

## 3. Keep one source of truth per icon

```ts
export const iconNames = ["lucide:home", "lucide:search"] as const;
export type IconName = (typeof iconNames)[number];
```

```tsx
import { Icon } from "@iconify/react";
import type { IconName } from "./icons/names";

export function IconBadge({ name }: { name: IconName }) {
  return <Icon icon={name} height={16} aria-hidden="true" />;
}
```

The union comes from the same list that drives the imports, so a typo becomes a type error instead of a missing glyph in production.

## 4. Put a ceiling on how many icons ship

```ts
// scripts/check-icon-budget.ts
const css = await Bun.file("dist/assets/index.css").text();
const classes = new Set(css.match(/\.i-[a-z0-9-]+/g) ?? []);

if (classes.size > 40) {
  throw new Error(`Icon classes over budget: ${classes.size}`);
}
```

Run it after `/run-build`. A raw count is crude, but it catches the real failure: someone adds a set package and the CSS grows by hundreds of rules in a release nobody reviewed for size.

## 5. Prune sets you no longer reference

```bash
bun remove @iconify-json/tabler
```

```bash
rg 'i-tabler-|icon-\[tabler--' src
```

An installed set that no class references still costs install time, and it silently satisfies a class that nobody intended to keep. Remove the package and search for leftovers in the same change.

## 6. Verify

1. `/run-build` — the bundle delta matches the number of icons added, not the size of the set
2. Grep the built CSS for `.i-` classes — every class corresponds to a name in the source list
3. Delete one `addIcon` call — that icon disappears instead of falling back to the API
4. `/report-bundle` — the icon payload is under budget and does not dominate the chunk
5. `/run-test` — the budget script runs in CI and fails on a regression

## Pitfalls

- Registering a full `icons.json` for two icons, which is the same cost as the set it was supposed to replace.
- Registering icons inside a component module that is code-split, so the registration runs after first paint.
- Typing `icon` as `string` and losing the compile-time check that the name is registered.
- Leaving the budget script out of CI, where it only ever runs on the machine of whoever remembered it.
- Removing a set package while a class string still references it, so the icon vanishes with no build error.

## Related

- `references/apis.md`
- `best-practices/icons.md`
- `usecases/runtime-icon-component.md`
- `usecases/offline-icons-unocss.md`
- `usecases/custom-icons-from-svg-files.md`
