# Use Case — Headless Controls And Overlays

> Wrap GPUIX primitives into local components, then keep Escape and focus on the window layer stack. Source: https://gpuix.dev/docs (accessed 2026-10-23).

## 1. Treat Primitives As Unstyled Parts

Every control imports from its own namespace entry point. Nothing ships a theme.

| Import | Parts |
| --- | --- |
| `@gpuix/react/button` | `Button`, `buttonProps` |
| `@gpuix/react/select` | `Root`, `Trigger`, `Value`, `Content`, `Item`, `Group` |
| `@gpuix/react/combobox` | `Root`, `Input`, `Content`, `List`, `Item`, `Empty` |
| `@gpuix/react/tooltip` | `Provider`, `Root`, `Trigger`, `Content` |
| `@gpuix/react/dialog` | `Root`, `Trigger`, `Portal`, `Backdrop`, `Popup`, `Title`, `Description`, `Close` |
| `@gpuix/react/floating` | `FloatingLayer`, `renderSlot` |

The Solid adapter exposes the same namespaces, and `DismissableLayer` is exported from both `@gpuix/react` and `@gpuix/solid`.

## 2. Wrap Trigger And Content In One Local File

```tsx
// components/ui/select.tsx
import * as React from 'react'
import * as SelectPrimitive from '@gpuix/react/select'

export const Select = SelectPrimitive.Root
export const SelectValue = SelectPrimitive.Value
export const SelectGroup = SelectPrimitive.Group

export const SelectTrigger = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Trigger>,
  SelectPrimitive.SelectTriggerProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Trigger
    ref={ref}
    {...props}
    style={(state) => ({
      width: 220,
      height: 36,
      padding: 8,
      backgroundColor: state.open ? '#334155' : '#1e293b',
      borderRadius: 8,
      ...(typeof style === 'function' ? style(state) : style),
    })}
  />
))

export const SelectContent = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Content>,
  SelectPrimitive.SelectContentProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Content
    ref={ref}
    sideOffset={6}
    {...props}
    style={{
      width: 220,
      maxHeight: 240,
      overflowY: 'scroll',
      padding: 4,
      backgroundColor: '#0f172a',
      borderRadius: 8,
      ...style,
    }}
  />
))

export const SelectItem = React.forwardRef<
  React.ElementRef<typeof SelectPrimitive.Item>,
  SelectPrimitive.SelectItemProps
>(({ style, ...props }, ref) => (
  <SelectPrimitive.Item
    ref={ref}
    {...props}
    style={(state) => ({
      padding: 8,
      opacity: state.disabled ? 0.4 : 1,
      backgroundColor: state.highlighted
        ? '#334155'
        : state.selected
          ? '#1e3a5f'
          : '#0f172a',
      ...(typeof style === 'function' ? style(state) : style),
    })}
  />
))
```

The `style` callback receives `open`, `disabled`, `highlighted`, and `selected`. Forward an incoming `style` that may itself be a function, or the wrapper drops the caller's state styles.

## 3. Pass `items` So The Closed Trigger Shows A Label

```tsx
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from './components/ui/select'

const models = [
  { value: 'sonnet', label: 'Sonnet' },
  { value: 'opus', label: 'Opus' },
]

<Select items={models} value={model} onValueChange={setModel}>
  <SelectTrigger>
    <SelectValue placeholder="Select a model" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      {models.map((item) => (
        <SelectItem key={item.value} value={item.value}>
          {item.label}
        </SelectItem>
      ))}
    </SelectGroup>
  </SelectContent>
</Select>
```

Keyboard navigation reads the mounted `SelectItem` children. Without `items`, `SelectValue` renders the raw value instead of the label.

## 4. Build A Dialog From Parts

```tsx
import * as Dialog from '@gpuix/react/dialog'

<Dialog.Root>
  <Dialog.Trigger>Settings</Dialog.Trigger>
  <Dialog.Portal>
    <Dialog.Backdrop style={{ backgroundColor: '#00000080' }} />
    <Dialog.Popup style={{ width: 420, padding: 16, backgroundColor: '#232323' }}>
      <Dialog.Title>Settings</Dialog.Title>
      <Dialog.Close>Done</Dialog.Close>
    </Dialog.Popup>
  </Dialog.Portal>
</Dialog.Root>
```

| Part | Behavior |
| --- | --- |
| `Root` | `open`, `defaultOpen`, `onOpenChange`, `modal` (default `true`), `disablePointerDismissal` |
| `Trigger` | Tab stop; click, Enter, or Space opens |
| `Portal` | Full-window deferred layer, follows resize in the same frame, paints over `<virtual-list>` |
| `Backdrop` | Press closes the dialog |
| `Popup` | Moves focus in on open and out on close; modal keeps Tab inside |
| `Close` | Tab stop; click, Enter, or Space closes |

A modal popup blocks both clicks and the wheel behind it.

## 5. Choose The Focus Return Target

`initialFocus` and `finalFocus` on the Popup behave like Base UI, with one difference: the unset default focuses the popup itself, not the first tabbable element.

```tsx
<Dialog.Popup initialFocus={searchRef} finalFocus={composerRef}>
```

GPUI only has a tab order after the popup paints, so focusing the popup and letting the first Tab walk that order is the reliable default. `initialFocus` beats an `autoFocus` inside the popup. A dialog opened from state, with no `Trigger`, still returns focus because the popup records the previously focused element before mounting.

## 6. Keep Escape On The Top Layer

Every open dialog, select, combobox, and tooltip joins one layer stack per window. Escape closes only the most recently opened layer, even when nothing is focused. It is a default action, so an `onKeyDown` can keep it open:

```tsx
<Dialog.Popup
  onKeyDown={(event) => {
    if (event.key === 'escape' && dirty) event.preventDefault()
  }}
/>
```

A custom overlay joins the same stack with `DismissableLayer`, mounted only while it is open:

```tsx
import { DismissableLayer } from '@gpuix/react'

{open && (
  <DismissableLayer onEscapeKeyDown={() => setOpen(false)}>
    <anchored deferred>{/* overlay */}</anchored>
  </DismissableLayer>
)}
```

`DismissableLayer` also takes `initialFocus()` and `finalFocus(previous)`, both returning an element id or `null`. Outside React, call `pushDismissLayer(renderer, layer, { previousFocus })` and run the returned function when the layer closes.

## 7. Trap Tab Inside A Custom Panel

`Dialog.Popup` already traps Tab. For your own panel, prevent the default and wrap within it:

```tsx
function onKeyDown(event: KeyEvent) {
  if (event.key !== 'tab' || !panel) return
  event.preventDefault()
  if (event.modifiers?.shift) renderer.focusPreviousWithin?.(panel.id)
  else renderer.focusNextWithin?.(panel.id)
}
```

## Pitfalls

- `SelectContent` and `Dialog.Popup` need an opaque `backgroundColor`. A translucent fill repaints everything behind it on each frame.
- A raw `<anchored>` defaults to `#1A1A1A`; wrapping primitives already set their own surface, so do not stack both.
- Mount `DismissableLayer` conditionally. A layer that stays mounted keeps stealing Escape from the layer above it.
- Escape handling must not call `preventDefault` unconditionally, or a saved dialog can never be dismissed by keyboard.
- Do not build a dialog from `<div>` plus manual focus calls. `Dialog.Portal` handles deferred painting, resize, wheel blocking, and focus return.
- The default `initialFocus` differs from Base UI. Pass a ref explicitly when a form field must have focus on open.

## Related

- [apis.md](../references/apis.md)
- [overlays-and-focus.md](../best-practices/overlays-and-focus.md)
- [styling-and-events.md](../best-practices/styling-and-events.md)
- [chat-transcript.md](./chat-transcript.md)
- [agent-driven-verification.md](./agent-driven-verification.md)
