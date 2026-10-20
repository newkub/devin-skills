# TanStack Virtual — Best Practices

Windowed rendering — fixed/window scroll, dynamic measurement, grids

## Recommended Patterns

- Give the scroll container an explicit height and `overflow: auto`; a zero-height parent renders nothing
- Set `estimateSize` close to the real row size so the scrollbar does not jump while measuring
- For dynamic rows, attach the measurement ref and the `data-index` attribute together
- Use the virtual item `key` as the list key — not the index — so rows keep identity when data reorders
- Keep `overscan` small (a handful of rows) to avoid rendering invisible work
- Express spacing with the `gap`/`paddingStart` options instead of margins on items
- Use the window virtualizer when the document scrolls, and a container virtualizer for fixed panes
- Trigger infinite loading from the tail item index, guarded by `hasNextPage` and `isFetchingNextPage`

## Common Pitfalls

- A container without height collapses the list to nothing
- Missing `data-index` makes dynamic measurement attach to the wrong row
- Index keys shuffle state (inputs, selection) after sorting or prepending
- Margins on virtual items break offset math and cause jumps
- Virtualizing a short list adds complexity for no benefit
- Ignoring image or font reflow leaves measured heights stale
- Recreating the virtualizer options object every render resets measurement state

## Perf Notes

- Windowed rendering bounds DOM nodes to viewport plus overscan; confirm that count in DevTools
- Memoize row components so recycling does not re-render unchanged rows
- Avoid heavy measurement work in render; let the virtualizer batch it

## Do / Don't

| Do | Don't |
|----|-------|
| fixed height + overflow auto | auto-height scroll parent |
| accurate `estimateSize` | wildly wrong estimate |
| `data-index` with the measure ref | measure without the index |
| stable virtual item keys | index keys on reorder |
| `gap`/`paddingStart` | margins on items |
