# Styling And Events

GPUIX accepts CSS-shaped objects, but the engine is Taffy plus GPUI. Treat the
style prop as a typed API, not as a stylesheet.

## 1. Text Needs Its Own Color

GPUI does not inherit `color` from a parent. A `<text>` without a color paints
black and disappears on a dark background.

```tsx
<text style={{ color: '#e2e2e2' }}>Count: {count}</text>
```

Put color on every `<text>`, or wrap it in a local component that does it for
you. `<code>`, `<diff>`, and `<markdown>` need the same treatment through their
own style props.

## 2. Flex Is Opt-In

A `div` is block. `flexDirection`, `gap`, `alignItems`, and `alignSelf` are
ignored until `display: "flex"` is set.

```tsx
<div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
```

A flex child that must shrink needs `minWidth: 0`. Without it the child keeps
its content width and overflows instead of truncating.

## 3. Numbers And Units

- Sizes are numbers in logical pixels. Percentages are strings such as `"100%"`.
- Shorthands are not parsed. `padding`, `margin`, and widths take single
  numbers; `"0 16px"`, `"1px solid #fff"`, and `calc()` are ignored.
- Invalid values are dropped per property. The rest of the style object still
  applies, so a silent miss is the usual failure mode.
- `boxShadow` is an object, not a string.
- `position: "fixed"` behaves like `"absolute"`. GPUI has no scrolling
  document to pin against.

## 4. State Styles

Hover, active, focus, and disabled are nested style objects on the same
element, not selectors:

```tsx
<div
  style={{
    backgroundColor: '#232323',
    cursor: 'pointer',
    hover: { backgroundColor: '#2c2c2c' },
    active: { backgroundColor: '#2a2a2a' },
  }}
/>
```

Headless primitives accept a style function with their component state, which
is how you style open, checked, and highlighted parts:

```tsx
style={(state) => ({
  backgroundColor: state.open ? '#334155' : '#1e293b',
})}
```

`state` values belong to the primitive. Read them from its props type rather
than assuming Radix field names.

## 5. Events Live In JS

Rust knows only whether an element has a listener (`setEventListener`). The
closure stays in a JS registry keyed by `(elementId, eventType)`, and the native
side calls back with `(id, type, payload)`.

Consequences:

- Handlers are plain functions. There is no capture string, no delegated
  selector, and no synthetic event pooling.
- A handler that closes over stale state is the same bug as in any React or
  Solid app. Use the functional state form.
- Payload field names differ per event. Read them from the event table in
  `references/apis.md` instead of guessing DOM names.

## 6. Interaction Semantics To Know

| Behavior | Rule |
|----------|------|
| Click | `onClick` fires on primary-button mouse-up |
| Other buttons | `onAuxClick`; read `event.isRightClick` |
| Pointer capture | A node with both `onMouseDown` and `onMouseMove` captures the pointer |
| Capture arming | Capture arms on the press, so put all gesture listeners on the element the user grabs |
| Release outside | Without capture, a release outside the element ends the click |
| Right-button drag | Never captured |
| Mouse leave | Also fires when the pointer leaves the window |
| Layout | `onLayout` reports after the frame that laid the element out |
| Scroll | `onScroll` is wheel input; `onScrollChange` is the resulting offset |

Drag gestures:

```tsx
<div
  style={{ cursor: 'grab', active: { cursor: 'grabbing' } }}
  onMouseDown={beginDrag}
  onMouseMove={moveDrag}
  onMouseUp={endDrag}
/>
```

A full-window overlay mounted after the press cannot take over the drag. It did
not exist when capture armed.

## 7. No Buttons, No Nested Text

- There is no `<button>`. Use `<div onClick>` with `cursor: "pointer"` and a
  focus handle when keyboard access matters.
- Do not nest `<text>` inside `<text>`. Adjacent `<text>` siblings merge into
  one line; a `<text>` child renders as a nested div.
- `<input>` has no default inner padding. Set `padding` on it or pad the
  wrapper.

## Pitfalls

- Copying a CSS layout and expecting gap, flex direction, or shorthand values
  to work without `display: "flex"` and numeric unit fixes.
- Using `onMouseMove` without `onMouseDown` for a drag. The pointer is not
  captured, so the drag dies at the element edge.
- Styling a `<text>` through its parent. Color does not cascade.
- Relying on DOM event fields (`event.target`, `event.currentTarget`). GPUIX
  payloads carry coordinates, buttons, modifiers, and values.

## Related

- [apis.md](../references/apis.md)
- [overlays-and-focus.md](overlays-and-focus.md)
- [runtime-and-rendering.md](runtime-and-rendering.md)
