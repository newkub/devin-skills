# Use Case — Configure the Registry and Add Components

> Point the shadcn CLI at the Zaidan registry, then add components that land as owned source. Source: https://zaidan.carere.dev/docs (accessed 2026-10-20)

## 1. Prerequisites the CLI will not fix for you

1. Tailwind CSS v4 installed (`tailwindcss` + `@tailwindcss/vite`) with the plugin registered in `vite.config.ts`
2. The `@/` alias present in both `tsconfig.json` (`paths`) and the Vite config (`resolve.alias`) — the alias must resolve at build time, not only in the editor
3. `bunx shadcn@latest init` already run, producing `components.json`

A missing alias is the most common failure: `init` succeeds, `add` writes the file, and the import fails at build with "Cannot find module '@/components/ui/button'".

## 2. Set the registry in `components.json`

```json
{
  "style": "kobalte",
  "rsc": false,
  "tailwind": {
    "css": "src/styles/globals.css"
  },
  "aliases": {
    "components": "@/components",
    "utils": "@/lib/utils",
    "ui": "@/components/ui",
    "lib": "@/lib",
    "hooks": "@/hooks"
  },
  "registries": {
    "@zaidan": "https://zaidan.carere.dev/r/{style}/{name}.json"
  }
}
```

`style: "kobalte"` is what makes `{style}` resolve to the SolidJS variants. Leave it at `new-york` and the CLI fetches React components that do not compile under Solid.

## 3. Add components

```bash
bunx shadcn@latest add @zaidan/button
bunx shadcn@latest add @zaidan/card @zaidan/dialog @zaidan/input
```

Files land in `src/components/ui/`. They are now yours — no package to upgrade, no `node_modules` copy to patch.

## 4. Import through the alias

```tsx
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
```

Relative imports (`../../components/ui/button`) break the moment a file moves and drift from the alias the CLI used when generating the component's own internal imports.

## 5. Verify the add actually works

1. `/run-dev` — the component renders, not a white screen
2. Keyboard: Tab reaches the button, Enter activates it, Escape closes the dialog
3. `/run-typecheck` — Kobalte props are typed; a `any` here means the registry served a React component
4. `/run-build` — the alias resolves in production, not only in dev
5. Confirm no `shadcn` or `@zaidan` entry was added to `dependencies`; this is copy-to-own, not a runtime package

## Pitfalls

- Running `bunx shadcn-solid@latest add` in the same project — two CLIs write the same `src/components/ui/` with different primitives.
- Fetching a component before `components.json` has `registries`, so the CLI reports an unknown registry and adds nothing.
- Editing files inside `src/components/ui/` before checking they compile, then blaming the registry for a local typo.
- Adding a `block` (a multi-component composition) when a `card` plus `dialog` would do, then maintaining a layout you do not own.

## Related

- `references/apis.md`
- `best-practices/zaidan-ui.md`
- `usecases/theme-tokens-and-dark-mode.md`
