# Use Case — Components That Adapt to Their Container

> Make a card/sidebar render correctly in a narrow rail and a wide main column without a viewport-based breakpoint for every placement. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_containment/Container_queries (accessed 2026-10-20)

## 1. Declare the container

```css
.card-list {
  container-type: inline-size;
  container-name: list;
}
```

`container-type: inline-size` makes the element a query container for inline-axis size and applies size containment on that axis — the container must get its width from layout, not from its content.

## 2. Query the container, not the viewport

```css
.card {
  display: grid;
  gap: var(--space-4);
  grid-template-columns: 1fr;          /* narrow: stacked */
}

@container list (min-width: 34rem) {
  .card {
    grid-template-columns: 12rem 1fr;  /* wide: media + body */
    align-items: start;
  }
}
```

Inside `@container` the length refers to the nearest matching query container, so one component works in the sidebar and the main area with no variants.

## 3. Name containers when they nest

```css
.rail { container-type: inline-size; container-name: rail; }

@container rail (max-width: 20rem) {
  .card { font-size: 0.875rem; }
  .card__media { display: none; }
}
```

With nested containers, `container-name` removes the ambiguity — the query targets the intended ancestor.

## 4. Style the container itself from its own size

```css
@container list style(--density: compact) {
  .card { padding: var(--space-2); }
}
```

Style queries read custom properties; combine them with size queries to switch density without new classes.

## Pitfalls

- Forgetting `container-type` → every `@container` rule matches nothing and the component keeps its default layout.
- Expecting the container to size to its content → `inline-size` containment breaks intrinsic sizing; set an explicit width or let the grid/flex parent size it.
- Using `@container` to replace global breakpoints → page-level layout still needs `@media`; container queries are for the component, not the page.
- Querying an unnamed container in a nested tree → reads the nearest one, which may be the wrong ancestor; add `container-name`.

## Related

- `references/apis.md`
- `best-practices/css.md`
- `usecases/design-tokens-with-light-dark.md`
