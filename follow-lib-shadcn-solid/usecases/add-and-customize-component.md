# Use Case — Add and Customize a Component

> Pull a component into the repo, then change it like your own source — because it is. Source: https://shadcn-solid.com/docs (accessed 2026-10-20)

## 1. Initialize once per project

```sh
bunx shadcn-solid@latest init
```

Pick `TailwindCSS` or `UnoCSS`, then confirm `components.json` points at the right global CSS, aliases (`@/components`, `@/lib/utils`), and base color. A wrong alias here is the source of every "module not found" after adding a component.

## 2. Add only what you use

```sh
bunx shadcn-solid@latest add button card dialog
bunx shadcn-solid@latest add --all      # whole registry, rarely what you want
```

`--all` drops dozens of files into `src/components/ui/` that you then own and must maintain; add per component instead.

## 3. Use the copied source directly

```tsx
// src/routes/dashboard.tsx
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function StatsCard(props: { title: string; value: number }) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>{props.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p class="text-3xl font-semibold">{props.value}</p>
        <Button variant="outline" size="sm">View details</Button>
      </CardContent>
    </Card>
  );
}
```

Components live in `src/components/ui/` as plain SolidJS — no library import, no version bump required to change behaviour.

## 4. Add a variant with `cva`

```tsx
// src/components/ui/button.tsx
import { cva } from "class-variance-authority";

const buttonVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        outline: "border border-input bg-background hover:bg-accent",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        success: "bg-emerald-600 text-white hover:bg-emerald-700", // added
      },
      size: {
        sm: "h-8 px-3",
        md: "h-10 px-4",
        lg: "h-11 px-8",
      },
    },
    defaultVariants: { variant: "default", size: "md" },
  },
);
```

Extending the existing `cva` config keeps `variant`/`size` type-safe at every call site.

## 5. Track upstream changes deliberately

```sh
bunx shadcn-solid@latest diff button
```

`diff` shows what the registry version changed since you copied it. Apply only the parts that fix a real bug — a wholesale overwrite (`add button --overwrite`) discards your customizations.

## Pitfalls

- Editing `components.json` aliases after adding components leaves imports pointing at paths that no longer resolve.
- Using `--overwrite` on a component you customized silently reverts your variants.
- Importing from a package instead of `@/components/ui/*` — this registry is copy-to-own, there is no runtime dependency.
- Reaching for `@zaidan/*` components in the same project: they come through the `shadcn` CLI with a Kobalte/Corvu + Tailwind v4 setup, a different registry from this one.
- Hard-coding colors (`bg-blue-500`) instead of theme utilities, which breaks dark mode and rebranding.
- Modifying Kobalte primitives directly instead of wrapping them in `src/components/ui/`.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/shadcn-solid.md`
- `usecases/theme-and-dark-mode.md`
