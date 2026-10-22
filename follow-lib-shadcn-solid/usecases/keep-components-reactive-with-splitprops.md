# Use Case — Keep Copied Components Reactive With `splitProps`

> The registry's own components are written with `splitProps` for a reason: `props` is a proxy of getters, so destructuring it freezes the first value. The same rule applies the moment you edit a copied file. Source: https://shadcn-solid.com/docs/components/button (accessed 2026-10-20)

## 1. Destructuring reads once

```tsx
import type { ComponentProps } from "solid-js";

type BadgeProps = ComponentProps<"span"> & {
  count: number;
  tone?: "neutral" | "danger";
};

// Broken: the getters are read once when the component runs
export function Badge(props: BadgeProps) {
  const { count, class: className } = props;
  return <span class={className}>{count}</span>;
}
```

A parent rendering `<Badge count={unread()} />` passes a getter. Reading it into `count` at setup stores the value from that moment; later signal updates never reach the child. This is the single most common React-to-Solid bug in a copied component.

## 2. Split what you own, forward the rest

```tsx
import { splitProps, type ComponentProps } from "solid-js";
import { cn } from "@/lib/utils";

type BadgeProps = ComponentProps<"span"> & {
  count: number;
  tone?: "neutral" | "danger";
};

export function Badge(props: BadgeProps) {
  const [local, rest] = splitProps(props, ["count", "tone", "class"]);

  return (
    <span
      class={cn(
        "inline-flex items-center rounded-full px-2 text-xs",
        local.tone === "danger" && "bg-destructive text-destructive-foreground",
        local.class,
      )}
      {...rest}
    >
      {local.count}
    </span>
  );
}
```

`splitProps` returns a reactive view for the keys you handle and a remainder for everything else (`onClick`, `aria-*`, `id`). Reading `local.tone` inside JSX re-evaluates when the prop changes, because the getter is still intact.

`cn` comes from the alias configured in `components.json` (`aliases.utils`) — the registry files in this package use the same helper, so keep the import path consistent with the project rather than adding a second copy.

## 3. Apply defaults with `mergeProps`

```tsx
import { mergeProps, splitProps } from "solid-js";

export function Badge(props: BadgeProps) {
  const merged = mergeProps({ tone: "neutral" as const }, props);
  const [local, rest] = splitProps(merged, ["count", "tone", "class"]);

  return (
    <span class={cn("rounded-full px-2", local.tone === "danger" && "bg-destructive")} {...rest}>
      {local.count}
    </span>
  );
}
```

`mergeProps` applies the default only while the incoming value is `undefined`, and the result stays reactive. Writing `props.tone ?? "neutral"` in three places works too, but the default then drifts the first time one of them is edited.

## 4. Call `splitProps` once, at the top level

```tsx
// Correct: one split per component setup
const [local, rest] = splitProps(props, ["count", "tone", "class"]);
```

```tsx
// Wrong: a new split on every item and every update
<For each={items()}>
  {(item) => {
    const [local, rest] = splitProps(item, ["label"]);
    return <Row {...rest}>{local.label}</Row>;
  }}
</For>
```

`splitProps` allocates objects; inside a render callback or an effect it runs again on every change and defeats memoization. Split the component's own props at setup, and pass `item` down as a plain prop.

## 5. Keep `children` in the split

```tsx
import { splitProps, type ParentProps } from "solid-js";

type PanelProps = ParentProps<{ title: string; class?: string }>;

export function Panel(props: PanelProps) {
  const [local, rest] = splitProps(props, ["title", "class", "children"]);

  return (
    <section class={cn("rounded-lg border p-4", local.class)} {...rest}>
      <h2 class="text-sm font-medium">{local.title}</h2>
      {local.children}
    </section>
  );
}
```

`local.children` stays reactive because it is still a getter. Reading `props.children` into a variable, or calling it as a function, ends that — Solid children are a value, not a React render prop.

## 6. Verify

1. Toggle a signal passed as a prop — the child's text updates without remounting (a `console.log` at setup fires once)
2. Pass `class="mt-2"` from the parent — it merges with the component's classes instead of replacing them
3. Omit `tone`, then pass `tone={undefined}` — both resolve to the default
4. A `<For>` list that gains an item — existing rows keep their DOM nodes
5. Grep `src/components/ui/` for `= props` destructuring — no hits
6. `/run-test` — a test that renders with a signal and asserts the DOM text changes after `setCount`

## Pitfalls

- Destructuring `props` in the parameter list (`function Badge({ count }: BadgeProps)`) — same freeze, harder to spot.
- Spreading `...rest` after `class` without splitting `class` first, which bypasses `cn` and lets the caller's string replace the whole class list.
- Calling `splitProps` inside `<For>`, an effect, or an event handler.
- Copying a prop into a local (`const tone = local.tone`) and reading the local in JSX.
- Passing `children` through a transform (`local.children.toUpperCase()`) — it is JSX, not a string.
- Adding a `key` to force a re-render instead of fixing the accessor read.
- Using `.map()` instead of `<For>` — every item's DOM is recreated instead of reconciled.

## Related

- `references/apis.md`
- `best-practices/shadcn-solid.md`
- `usecases/add-and-customize-component.md`
- `usecases/forms-with-textfield.md`
