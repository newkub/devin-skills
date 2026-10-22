# Use Case — Compose Components Without Breaking Props

> Props are a reactive proxy, not an object snapshot: the component runs once, so every read has to happen at the moment the value is needed. Source: https://docs.solidjs.com/reference/component-apis/children (accessed 2026-10-20)

## 1. Type props once, never destructure

```tsx
import type { Component, JSX } from "solid-js";

type ButtonProps = {
  variant?: "primary" | "ghost";
  size?: "sm" | "md";
  children: JSX.Element;
} & JSX.ButtonHTMLAttributes<HTMLButtonElement>;

export const Button: Component<ButtonProps> = (props) => {
  // `const { variant } = props` would freeze the first value — never do it
  return <button class={`btn btn--${props.variant ?? "primary"}`}>{props.children}</button>;
};
```

`Component<P>` types the function and keeps `props` as the parameter — destructuring in the signature is the same bug as destructuring in the body.

## 2. Defaults with `mergeProps`, forwarding with `splitProps`

```tsx
import { mergeProps, splitProps } from "solid-js";

export const Button: Component<ButtonProps> = (props) => {
  const merged = mergeProps({ variant: "primary", size: "md" } as const, props);
  const [local, rest] = splitProps(merged, ["variant", "size", "class", "children"]);

  return (
    <button
      {...rest}
      class={`btn btn--${local.variant} btn--${local.size} ${local.class ?? ""}`.trim()}
    >
      {local.children}
    </button>
  );
};
```

`mergeProps` builds a new proxy whose reads fall through to `props`, so a later `variant` change still propagates. `splitProps` lists every key you consume yourself; everything left in `rest` is spread onto the DOM node, which is how `type`, `disabled`, `aria-*`, and event handlers keep working. Spreading `rest` before `class` lets the caller's class join yours instead of replacing it.

## 3. Read props at call time

```tsx
// correct — the handler reads the proxy when the click happens
<button onClick={() => props.onSelect(props.value)}>{props.label}</button>

// wrong — `value` is a snapshot from setup time
const value = props.value;
<button onClick={() => props.onSelect(value)}>{props.label}</button>
```

The same rule applies to `setTimeout`, subscriptions, and promise callbacks: read `props.x` inside the callback, not into a local before it.

## 4. Resolve children before inspecting them

```tsx
import { children, type ParentProps } from "solid-js";

export function Panel(props: ParentProps<{ title: string }>) {
  const resolved = children(() => props.children);
  const count = () => resolved.toArray().length;

  return (
    <section class="panel">
      <h2>{props.title} ({count()})</h2>
      {resolved()}
    </section>
  );
}
```

`children()` returns a memoized accessor over the resolved slot, plus `toArray()` for counting or mapping. Resolve once per component — calling `children()` inside JSX on every read re-creates the structure. Without the helper, `props.children` is still fine for plain pass-through.

## 5. Polymorphic `as` with `Dynamic`

```tsx
import { Dynamic, splitProps, type Component, type JSX } from "solid-js";

type BoxProps = {
  as?: "div" | "section" | "article";
  children: JSX.Element;
};

export const Box: Component<BoxProps> = (props) => {
  const [local, rest] = splitProps(props, ["as", "children"]);
  return (
    <Dynamic component={local.as ?? "div"} {...rest}>
      {local.children}
    </Dynamic>
  );
};
```

`Dynamic` renders a string tag or a component held in a signal. Use it instead of three near-identical components; keep `children` in the split so it is rendered explicitly rather than passed as an attribute.

## 6. Verify

1. Change a prop from a parent — the child text updates without the component function re-running (log once)
2. Forward `disabled`, `type`, `onClick`, and `aria-label` — every one reaches the button
3. Pass a caller `class` — it is appended, not overwritten
4. Pass a getter `value={() => row().name}` — edits are visible after the row changes
5. Wrap two children in `Panel` — the count matches and no extra wrapper element appears
6. Switch `as` from `div` to `section` — the DOM tag changes with no remount of the children

## Pitfalls

- Destructuring `props` anywhere — reactivity dies silently, and nothing in the types warns you.
- Spreading `props` twice instead of `splitProps` — the second consumer overwrites attributes such as `class`.
- `mergeProps(props, defaults)` — order matters; defaults must come first.
- Calling `children()` inside JSX, which resolves the slot on every read.
- Copying `props.value` into a local at setup, then using it in a handler.
- Building the `class` string with `undefined` and leaving a literal `"undefined"` in the attribute.
- Solid 2.0 renames `mergeProps`/`splitProps` to `merge`/`omit` — keep these helpers in one module so the migration is a single-file change.

## Related

- `references/apis.md`
- `best-practices/reactivity.md`
- `usecases/control-flow-and-lists.md`
- `usecases/nested-form-state-with-store.md`
