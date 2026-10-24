# Best Practices — Overlays And Focus

Menus, dialogs, tooltips, and keyboard focus without a DOM: paint order replaces
`z-index`, a layer stack replaces the browser's top-layer rules, and focus handles
are kept alive by element ids.

## 1. Paint Order Is Tree Order

GPUIX has no `z-index` and no top layer. Elements paint in tree order, so a
later sibling paints over an earlier one.

A `position: "absolute"` card nested inside a composer still paints under a
`<virtual-list>` that comes later in the tree. You will see the list through the
menu, and clicks will land on the list.

Solutions, in order of preference:

| Need | Use |
|------|-----|
| Menu/tooltip/dialog content | `SelectContent`, `ComboboxContent`, `<anchored deferred>` |
| Full-window modal | `<anchored fill="window">` |
| Content owned by another subtree | `createPortal(children, target)` |
| Above a `<virtual-list>` | `<anchored>`, never a portal |

A portal changes where elements live in the tree; it does not change paint order.
If the target sits before the list, the portal content still paints below it.

## 2. Every Overlay Needs An Opaque Fill

A layer with a transparent background does not save GPU work: the layers below
still paint every frame, and a fully transparent child on a blurred window can
punch through the compositor to the desktop.

- Give the surface a solid color (`#232323`), not an alpha color (`#23232399`).
- A raw `<anchored>` with no fill paints `#1A1A1A` by default.
- `backgroundColor: "transparent"` is correct only for a full-window host layer
  that contains its own opaque popup, as `Dialog.Portal` does.
- Item rows inside a menu need the same solid fill, or a solid hover fill.

## 3. Occlusion And Pointer Events

`<anchored>` occludes by default and has an `occlude` prop; menus and tooltips
need no extra settings. A plain `div` that paints a fill or is positioned blocks
clicks and hovers behind it, but the wheel still passes through.

The wheel does not bubble like a DOM event. GPUI hit-tests one flat list of
painted boxes, so the wheel reaches any scroller behind the element, not only an
ancestor. Set `pointerEvents: "auto"` on a modal backdrop to swallow it too.

`pointerEvents: "none"` inserts no hitbox at all. It does not disable that
element's own listeners, does not inherit, and children keep their own hitboxes.
Use it on a filled child of a click target (switch thumb, radio dot, check icon)
or the child eats the parent's click.

## 4. Dismissal Is A Stack

Every open Dialog popup, Select, Combobox, and Tooltip joins one layer stack per
window. Escape closes only the most recently opened layer, even when nothing is
focused. Escape is a default action, so a handler can keep the layer open:

```tsx
<Dialog.Popup
  onKeyDown={(event) => {
    if (event.key === 'escape' && dirty) event.preventDefault()
  }}
/>
```

A custom overlay joins the same stack with `DismissableLayer`, mounted only while
it is open:

```tsx
{open && (
  <DismissableLayer onEscapeKeyDown={() => setOpen(false)}>
    <anchored deferred>{/* overlay */}</anchored>
  </DismissableLayer>
)}
```

Framework-free code calls `pushDismissLayer(renderer, layer, { previousFocus })`
and invokes the returned function on close. A layer mounted inside another is
always above it, even when both open in one commit.

## 5. Focus Follows Stable Ids

Element ids are stable numbers, so `gpui::FocusHandle`s survive re-renders. Two
consequences:

- Only nodes with a keyboard or focus listener get a focus handle; they still add
  no tab order. Set `tabIndex={0}` (or `-1` for programmatic focus) explicitly.
- Inputs and textareas are tab stops automatically; adding `tabIndex` to them
  creates duplicate stops.

`autoFocus` focuses on mount. `initialFocus` on `Dialog.Popup` wins over an
`autoFocus` inside the popup, so pass the field as `initialFocus` instead:

```tsx
<Dialog.Popup initialFocus={searchRef} finalFocus={composerRef}>
```

When the popup closes, focus returns to the trigger, else to whatever was focused
when it opened. Nested dialogs return focus to the outer dialog's target.

## 6. Trap Tab Yourself In Custom Panels

`Dialog.Popup` traps Tab and Shift+Tab. For your own panel, prevent the default
and move focus within the panel:

```tsx
function onKeyDown(event: KeyEvent) {
  if (event.key !== 'tab' || !panel) return
  event.preventDefault()
  if (event.modifiers?.shift) renderer.focusPreviousWithin?.(panel.id)
  else renderer.focusNextWithin?.(panel.id)
}
```

Key events dispatch to the focused element, then walk ancestors, so an Escape or
shortcut handler on a container works without attaching listeners per row.

## 7. Keyboard Dimming

While any element holds keyboard focus, every other focusable element renders at
40% opacity. This is deliberate: it shows where typing goes. Opt out per element
with `style.keyboardFocusDim: false`, or per window with
`render(<App />, { keyboardFocusDim: false })`.

Do not fight it with custom opacity — disable the dim where the effect is wrong.

## Pitfalls

- Assuming `z-index` exists; unknown style keys are dropped silently.
- Portaling a menu to fix paint order while the portal target paints early.
- Skipping `minWidth: 0` on a flex overlay panel, so it refuses to shrink.
- Mounting `DismissableLayer` permanently, which pushes a dismissed layer back on
  the stack.
- Handling Escape in two layers at once, closing both.
- Adding `tabIndex` to `<input>` and `<textarea>`.

## Related

- [apis.md](../references/apis.md)
- [styling-and-events.md](styling-and-events.md)
- [text-and-collections.md](text-and-collections.md)
- [usecases/headless-controls-and-overlays.md](../usecases/headless-controls-and-overlays.md)
