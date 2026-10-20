# Use Case — Cascade Layers and Native Nesting

> Put reset, base, components, and utilities in a declared order so overrides stop depending on selector weight. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/@layer (accessed 2026-10-20)

## 1. Declare the order once, at the top

```css
@layer reset, base, components, utilities;
```

Declaration order beats specificity: a rule in `utilities` wins over a more specific rule in `components`. That is the whole point — after this line, `.card__title` in `components` can override `#sidebar .title` from a legacy sheet only if that sheet is also layered earlier.

Third-party CSS imported into a named layer keeps it from outranking your components:

```css
@import url("vendor.css") layer(vendor);
@layer reset, vendor, base, components, utilities;
```

## 2. Put each concern in its own layer

```css
@layer base {
  :where(h1, h2, h3) {
    text-wrap: balance;
  }
}

@layer components {
  .card {
    container-type: inline-size;
    border: 1px solid var(--border);
  }
}

@layer utilities {
  .visually-hidden {
    position: absolute;
    clip-path: inset(50%);
  }
}
```

`:where()` in the base layer keeps element defaults at zero specificity, so any component rule wins without `!important`. Layer order already decides the outcome; specificity is now a second, independent lever.

## 3. Nest only where the parent is the scope

```css
@layer components {
  .card {
    padding: 1rem;

    & > .card__title {
      font-weight: 600;
    }

    &:hover {
      border-color: var(--border-strong);
    }

    @container (width > 30rem) {
      padding: 1.5rem;
    }
  }
}
```

`&` is equivalent to `:is(.card)`, so nesting does not change specificity the way Sass did — a nested `& > .card__title` and a flat `.card > .card__title` are equal. Use nesting for locality, not to win specificity battles.

At-rule nesting (`@container`, `@media`, `@supports`) inside a selector is native and keeps the breakpoint next to the rule it affects.

## 4. Verify

1. `@layer` order is identical in every entry stylesheet — a second declaration appends, it does not reorder
2. Remove `!important` occurrences and confirm the visual result is unchanged
3. Browser support: layers and nesting are Baseline; a legacy build that flattens them must still preserve the order
4. `/follow-tool-lighthouse` — no layout shift from a late-loading base layer

## Pitfalls

- Re-declaring `@layer` with a different order in a second file, which appends new layers instead of reordering existing ones.
- Using a layer for the reset but leaving component CSS unlayered — unlayered styles outrank every layer.
- Relying on nesting to raise specificity; `&` does not add weight.
- Putting the design tokens inside `@layer base` and then trying to override them from `utilities` — custom properties follow the same cascade.
- Importing a vendor sheet without `layer()`, so its `!important` rules win forever.

## Related

- `references/apis.md`
- `best-practices/css.md`
- `usecases/design-tokens-with-light-dark.md`
- `usecases/subgrid-and-intrinsic-layout.md`
