# Use Case — Theme Tokens and Dark Mode

> Define the token layer once, map it into Tailwind v4, and make dark mode a token swap. Source: https://zaidan.carere.dev/docs/faq (accessed 2026-10-20)

## 1. Import Tailwind and register the dark variant

```css
/* src/styles/globals.css */
@import "tailwindcss";

@custom-variant dark (&:where([data-kb-theme="dark"], [data-kb-theme="dark"] *));
```

The custom variant is what makes `dark:` utilities respond to Kobalte's `data-kb-theme` attribute instead of the `.dark` class. Without it, every `dark:` class in a copied component stays inert.

## 2. Put the raw values in `:root`

```css
:root {
  --background: oklch(1 0 0);
  --foreground: oklch(0.145 0 0);
  --card: oklch(1 0 0);
  --card-foreground: oklch(0.145 0 0);
  --primary: oklch(0.205 0 0);
  --primary-foreground: oklch(0.985 0 0);
  --muted: oklch(0.97 0 0);
  --muted-foreground: oklch(0.556 0 0);
  --radius: 0.625rem;
}

[data-kb-theme="dark"] {
  --background: oklch(0.145 0 0);
  --foreground: oklch(0.985 0 0);
  --card: oklch(0.205 0 0);
  --card-foreground: oklch(0.985 0 0);
  --primary: oklch(0.922 0 0);
  --primary-foreground: oklch(0.205 0 0);
  --muted: oklch(0.269 0 0);
  --muted-foreground: oklch(0.708 0 0);
}
```

Every colour a component uses must exist in both blocks. A token added only to `:root` renders as the light value on a dark background — visible as unreadable text, not as a build error.

## 3. Map tokens into Tailwind's theme

```css
@theme inline {
  --color-background: var(--background);
  --color-foreground: var(--foreground);
  --color-card: var(--card);
  --color-card-foreground: var(--card-foreground);
  --color-primary: var(--primary);
  --color-primary-foreground: var(--primary-foreground);
  --color-muted: var(--muted);
  --color-muted-foreground: var(--muted-foreground);
  --radius-lg: var(--radius);
}
```

`@theme inline` keeps the utilities pointing at the variable rather than copying its value, which is what lets a theme swap at runtime actually repaint.

## 4. Use the utilities, never the raw variable

```tsx
<div class="rounded-lg border border-muted bg-card p-4">
  <h2 class="text-card-foreground">Title</h2>
  <p class="text-muted-foreground">Supporting copy</p>
  <button class="bg-primary text-primary-foreground">Save</button>
</div>
```

`bg-[var(--card)]` compiles but bypasses the theme map, so a later token rename leaves an orphan. Use the generated utility names.

## 5. Merge classes with `cn`

```tsx
import { cn } from "@/lib/utils";

export function Badge(props: { class?: string; children: JSX.Element }) {
  return (
    <span class={cn("rounded-md bg-muted px-2 py-1 text-xs", props.class)}>
      {props.children}
    </span>
  );
}
```

Appending strings ends in `"bg-muted bg-primary"` with both present and CSS order deciding the winner. `cn` resolves the conflict deterministically.

## 6. Verify both themes and the focus ring

1. `/run-dev`, toggle `data-kb-theme` on `<html>` in devtools — every surface, border, and text must change
2. Check contrast on `muted-foreground` over `card` in dark mode — that pair is the usual failure
3. Tab through a dialog: the focus ring must be visible in both themes, not a 1px outline lost against the background
4. Reload with dark stored — no light flash before the attribute is applied
5. `/run-build` — the `@theme inline` block must survive; a postcss ordering mistake drops it silently

## Pitfalls

- Defining tokens in `@theme` directly with fixed colours, which makes runtime theme switching impossible.
- A `dark:` class in a component while a token already handles the swap, producing two competing sources of truth.
- Hardcoding `#fff`/`#000` in a component override, which ignores both themes.
- Toggling a `.dark` class while the components expect `data-kb-theme`, so half the UI responds and half does not.

## Related

- `references/apis.md`
- `best-practices/zaidan-ui.md`
- `usecases/configure-registry-and-add-components.md`
