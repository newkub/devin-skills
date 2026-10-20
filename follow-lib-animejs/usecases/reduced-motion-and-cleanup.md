# Use Case — Respect Reduced Motion and Clean Up on Unmount

> Keep the end state when the user asks for less motion, and never leave an animation running on a removed element. Source: https://animejs.com/documentation/getting-started (accessed 2026-10-20)

## 1. Detect the preference once, at module scope

```ts
export const prefersReducedMotion = () =>
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
```

Query the media feature on demand instead of caching a boolean at import time — the user can change the OS setting while the tab is open, and `matchMedia()` is cheap.

## 2. Snap to the end state instead of animating

```ts
import { animate, utils } from "animejs";

export function reveal(targets: string | HTMLElement[]) {
  if (prefersReducedMotion()) {
    utils.set(targets, { opacity: 1, y: 0, scale: 1 });
    return () => {};
  }

  const animation = animate(targets, {
    opacity: [0, 1],
    y: [24, 0],
    duration: 600,
    ease: "outQuad",
  });

  return () => animation.revert();
}
```

The reduced-motion branch must apply the final values, not skip the block. Skipping leaves elements at `opacity: 0` and the page looks empty — the most common reduced-motion bug.

`utils.set()` writes the values immediately with no interpolation, which is exactly the intent.

## 3. Tie the lifetime to the component

```tsx
import { useEffect, useRef } from "react";
import { reveal } from "./reveal";

export function Hero({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!ref.current) return;
    const dispose = reveal(ref.current.querySelectorAll(".reveal"));
    return dispose;
  }, []);

  return <div ref={ref}>{children}</div>;
}
```

Returning the disposer from `useEffect` means a route change, an HMR update, or a StrictMode double-mount all revert the inline styles the animation wrote. Without it, the next render starts from a half-animated state.

In Vue the same shape is `onMounted` + `onScopeDispose(dispose)`; in Solid, `onMount` + `onCleanup`.

## 4. Verify

1. Enable the OS reduced-motion setting, reload — content is visible immediately, no fade
2. Toggle the setting with the tab open and re-mount the component — the new branch applies
3. Navigate away mid-animation — no console error about a missing node
4. `/run-test` on the component — assert `opacity: 1` in the reduced-motion case

## Pitfalls

- `if (prefersReducedMotion()) return;` before applying end values, leaving invisible content.
- Reading `matchMedia` once at module scope, so the preference never updates.
- Awaited animations (`await animation`) in an unmount handler, which throws after the element is gone.
- Calling `.cancel()` when you need `.revert()` — cancel stops the animation but leaves the last written inline styles in place.

## Related

- `references/apis.md`
- `best-practices/animejs.md`
- `usecases/timeline-choreography.md`
- `usecases/scroll-linked-progress.md`
