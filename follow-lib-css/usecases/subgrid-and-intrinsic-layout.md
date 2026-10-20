# Use Case — Subgrid and Intrinsic Card Layout

> Make cards share row tracks with the grid around them, and stop `1fr` from overflowing on long words. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_grid_layout/Subgrid (accessed 2026-10-20)

## 1. Let the cards share the parent's rows

```css
.card-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(16rem, 1fr));
  gap: 1rem;
}

.card {
  display: grid;
  grid-row: span 3;
  grid-template-rows: subgrid;
}
```

`grid-template-rows: subgrid` adopts the parent's three row tracks, so every title, body, and footer line up across cards without fixed heights or JS measurement.

The card must be a direct grid item and must span as many rows as it inherits. A `span 3` on a card whose content needs two rows leaves a gap, not a stretch.

## 2. Avoid the `1fr` min-content trap

```css
.card-grid {
  grid-template-columns: repeat(auto-fit, minmax(min(16rem, 100%), 1fr));
}

.card__body {
  min-width: 0;
  overflow-wrap: anywhere;
}
```

`1fr` means `minmax(auto, 1fr)`, and the `auto` minimum is the item's min-content width — a long URL or an unbreakable token widens the track and overflows the page. `minmax(0, 1fr)` or `min-width: 0` on the item removes the floor.

Use `min(16rem, 100%)` in the column definition so a 320px viewport does not force horizontal scrolling.

## 3. Keep an intrinsic fallback for older engines

```css
@supports (grid-template-rows: subgrid) {
  .card {
    grid-row: span 3;
    grid-template-rows: subgrid;
  }
}

@supports not (grid-template-rows: subgrid) {
  .card {
    display: flex;
    flex-direction: column;
  }
  .card__footer {
    margin-top: auto;
  }
}
```

The fallback still aligns footers within a card using `margin-top: auto`; only cross-card alignment is lost. Do not bolt on a JS height sync — it reflows on every font load.

## 4. Verify

1. Three cards with different body lengths — titles, bodies, and footers align on the same baselines
2. Add a 60-character unbroken string — no horizontal scroll
3. 320px viewport — single column, no overflow
4. Disable the `subgrid` path in devtools (or test in an engine without it) — the layout degrades, it does not collapse
5. `/follow-tool-lighthouse` — no layout shift when fonts load

## Pitfalls

- Forgetting `grid-row: span N` on the subgrid item, which makes it inherit only one row.
- Using `1fr` without `min-width: 0` and blaming the content for the overflow.
- Applying subgrid to a card whose parent is not a grid — the property is ignored and the card collapses.
- Fixed `min-height` to fake alignment, which breaks as soon as the copy changes.
- `overflow: hidden` on the card to hide the overflow instead of fixing the track minimum.

## Related

- `references/apis.md`
- `best-practices/css.md`
- `usecases/container-queries.md`
- `usecases/cascade-layers-and-nesting.md`
