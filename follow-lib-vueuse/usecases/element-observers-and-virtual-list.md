# Use Case — Observe Elements and Virtualize a Feed

> React to visibility and size changes, then render only the rows in view. Source: https://vueuse.org/core/useIntersectionObserver/ (accessed 2026-10-20)

## 1. Observe visibility with a reactive root margin

```ts
// composables/useSentinel.ts
import { useTemplateRef, type MaybeRefOrGetter } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

export function useSentinel(
  onEnter: () => void,
  rootMargin: MaybeRefOrGetter<string> = "200px",
) {
  const target = useTemplateRef<HTMLElement>("sentinel");

  const { isIntersecting, stop } = useIntersectionObserver(
    target,
    ([entry]) => {
      if (entry?.isIntersecting) onEnter();
    },
    { rootMargin },
  );

  return { isIntersecting, stop };
}
```

A reactive `rootMargin` reconfigures the existing observer. Recreating the observer to change one number is the pattern this replaces — and recreating it on every render is why the callback fires repeatedly.

## 2. Measure the container instead of the window

```ts
import { computed, useTemplateRef } from "vue";
import { useElementSize } from "@vueuse/core";

const container = useTemplateRef<HTMLElement>("container");
const { width } = useElementSize(container);
const columns = computed(() => (width.value > 1024 ? 4 : width.value > 640 ? 2 : 1));
```

`useElementSize` wraps a `ResizeObserver`, so a sidebar collapse updates the grid without a window resize event.

## 3. Track scroll for a progress bar

```ts
import { computed, useTemplateRef } from "vue";
import { useScroll } from "@vueuse/core";

const el = useTemplateRef<HTMLElement>("article");
const { y, arrivedState } = useScroll(el, { behavior: "smooth" });
const progress = computed(() => (y.value / (el.value?.scrollHeight ?? 1)) * 100);
```

`arrivedState.bottom` is what a "jump to end" button should read, rather than comparing numbers by hand.

## 4. Virtualize the list VueUse-style

```ts
import { useVirtualList } from "@vueuse/core";

const { list, containerProps, wrapperProps, scrollTo } = useVirtualList(items, {
  itemHeight: 56,
  overscan: 5,
});
```

```vue
<template>
  <div v-bind="containerProps" class="h-96 overflow-auto">
    <div v-bind="wrapperProps">
      <div v-for="row in list" :key="row.index">{{ row.data.title }}</div>
    </div>
  </div>
</template>
```

Bind both prop groups. The wrapper's height is what keeps the scrollbar honest; skipping it makes the list look correct and scroll like a short page. `scrollTo` accepts `behavior`, `block`, and `inline` for an in-place jump instead of a hard scroll.

## 5. Clean up anything you started

```ts
import { tryOnScopeDispose } from "@vueuse/core";

const source = new EventSource("/events");
tryOnScopeDispose(() => source.close());
```

`tryOnScopeDispose` is safe outside a component scope, which is what makes it usable in a plain composable.

## 6. Verify

1. `/run-typecheck` + `/run-test`
2. Scroll to the sentinel — the callback fires once, not on every scroll frame
3. Resize the container — the column count changes
4. Count rendered rows in the virtual list — viewport rows plus overscan only
5. Unmount mid-observer — no `ResizeObserver loop` warnings and no open `EventSource`

## Pitfalls

- Observing a template ref before it is populated, which observes `null` and never fires again.
- Using `useIntersectionObserver` for a one-shot reveal without `stop()`, keeping the observer alive for the page's lifetime.
- Fixed `itemHeight` over variable rows, which produces overlap instead of a growing list.
- Calling VueUse composables inside a `v-for`, creating one observer per row.

## Related

- `references/apis.md`
- `best-practices/vueuse.md`
- `usecases/persisted-prefs-and-dark-mode.md`
