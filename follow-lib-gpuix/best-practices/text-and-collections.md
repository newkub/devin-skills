# Best Practices — Text And Collections

Text is a native node, not DOM text; long collections are virtualized by a
native list. Both change how you structure a component.

## 1. Text Is A Closed Box

`<text>` maps to one native text element:

- Adjacent `<text>` siblings merge into one line.
- A `<text>` child of another `<text>` is treated as a nested div, not an inline
  span.
- `white-space: pre` is unsupported; newlines inside a string do not become
  separate lines.
- Text does not inherit `color`. A `<text>` inside a colored container renders in
  the default color unless it sets its own.

Build multi-line content as a flex column of separate `<text>` elements:

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
  <text style={{ color: '#e4e4e7', fontSize: 14 }}>Build finished</text>
  <text style={{ color: '#a1a1aa', fontSize: 12 }}>2 warnings, 0 errors</text>
</div>
```

Styling, selection, and events work on `<text>` directly — it is selectable and
takes `onClick`, `onLayout`, and the rest of the event surface.

## 2. Rich Content Has Native Elements

Do not rebuild a Markdown renderer or a diff viewer in JSX when the native
element already exists. Their layout is a Rust implementation and far cheaper.

| Element | Purpose | Key props |
|---------|---------|-----------|
| `<markdown>` | GitHub-flavoured Markdown: headings, lists, tables, quotes, fenced code, strikethrough, task lists, autolinks | `source`, `onLinkClick` |
| `<code>` | Syntax-highlighted code block | `code`, `language`, `theme` |
| `<diff>` | Unified diff, flows by default | `patch`, `wordDiff`, `maxLines`, `collapsedPaths`, `onToggleFile`, `onShowMore`, `onLineClick` |

All three accept a `theme` prop whose fields layer over the built-in dark theme.
Layout numbers live under `theme.metrics` (line heights, gutter widths, heading
scale), so retuning the design is a React re-render, not a native rebuild.

```tsx
<markdown source={readme} onLinkClick={(e) => open(e.value)} />
```

`<diff>` flows by default, which lets a parent list be the only scroller. A
collapsed file removes its rows instead of hiding them, so a collapsed 10k-line
file costs one row. Use `maxLines` plus `onShowMore` for a "show more" affordance.

Pass `scroll` with a bounded height only for a dedicated full-window viewer; that
path virtualizes from `theme.metrics.diffLineHeight` without measuring. Never nest
it inside another scroller.

## 3. Virtual Lists Need Bounded Space

`<virtual-list>` retains every row in React and Rust but builds, lays out, and
paints only rows near the viewport. It needs a bounded height or bounded flex
space, or it has nothing to scroll inside.

```tsx
<virtual-list
  alignment="bottom"
  followTail
  estimatedItemHeight={180}
  style={{ flexGrow: 1, minHeight: 0 }}
>
  {messages.map((message) => (
    <Message key={message.id} message={message} />
  ))}
</virtual-list>
```

| Prop | Default | Purpose |
|------|---------|---------|
| `alignment` | `"top"` | `"bottom"` for chat-style initial position |
| `followTail` | `false` | Follow appended rows until the user scrolls away |
| `overdraw` | `512` | Extra pixels built outside the viewport |
| `estimatedItemHeight` | none | Height hint; required with `itemCount` |

Rows may have different heights and need no measurement work from you. A row is
measured when it enters the viewport; the measurement replaces the estimate, and
the scrollbar converges as you scroll. A retained descendant change marks its
direct row for remeasurement, so a streaming row grows correctly. Keyed
append/remove/reorder keeps measurements for unchanged ids.

## 4. One Host Root Per Row

Each direct host child is one virtual row. Give it a stable key and a single host
root:

```tsx
<virtual-list style={{ height: 500 }}>
  {messages.map((message) => (
    <div key={message.id} style={{ paddingBottom: 24 }}>
      <Message message={message} />
    </div>
  ))}
</virtual-list>
```

A row may contain nested `div`, `text`, `markdown`, `code`, `diff`, `input`, and
`textarea`. Those children must not scroll: nested scrolling is unsupported.
Focusable rows stay active when they move offscreen, so keyboard input and native
editor state survive scrolling.

## 5. Scroll Containers Versus Virtual Lists

A plain container with `overflow: "scroll"` builds every child — correct for
short lists and for fat content, wrong for thousands of rows.

| Work | Plain scroll container | `<virtual-list>` children | `<virtual-list>` + `itemCount` |
|------|------------------------|---------------------------|--------------------------------|
| All rows retained | yes | yes | only near the viewport |
| Row heights | measured | measured | estimated until mounted |
| Row content | free | any host element | rendered by your windowing code |

Keep `overdraw` near one extra viewport. Put fat content in one native node
(`<markdown>`, `<code>`, `<diff>`) rather than in many small JSX nodes.

`<virtual-list>` is the only element that virtualizes. A surface where you own
the scroll math needs `itemCount` and `estimatedItemHeight`, because React never
mounts offscreen rows and native has nothing to measure.

## 6. Programmatic Scrolling

`scrollTo`, `scrollToItem`, `scrollIntoView`, and `getScrollOffset` on the
renderer cover the common cases. `onScroll` reports deltas; `onScrollChange`
reports absolute offsets and fires on `overflow: "scroll"` containers, not on
`<virtual-list>`. Use `onVisibleRange` on a `<virtual-list>` instead — a plain
container never reports which rows are visible.

## 7. Selection And Highlighting

Text selection works natively across `<text>`, `<code>`, `<markdown>`, and
`<diff>` without extra props. `onSelectionChange` is registered once on the
window when you call `render()`, not per element.

Highlighting reaches those same nodes at no extra cost, but native can only see
what it built: a `<virtual-list>` never builds offscreen rows, so a highlight for
an offscreen match is not painted until the row mounts.

## Pitfalls

- Nesting `<text>` and expecting inline layout.
- Relying on inherited `color` for text.
- Giving `<virtual-list>` only content height with no bounded parent.
- Putting a second scroller inside a virtual row.
- Mapping a large list into `div`s inside a plain scroller.
- Expecting `onScrollChange` from a `<virtual-list>`.

## Related

- [apis.md](../references/apis.md)
- [styling-and-events.md](styling-and-events.md)
- [runtime-and-rendering.md](runtime-and-rendering.md)
- [usecases/chat-transcript.md](../usecases/chat-transcript.md)
