# Use Case — View Transitions and Scroll-Driven Reveals

> Animate between page states and on entry without a scroll listener, and keep both honest under reduced motion. Source: https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-driven_animations (accessed 2026-10-20)

## 1. Opt into cross-document transitions

```css
@view-transition {
  navigation: auto;
}

::view-transition-old(root),
::view-transition-new(root) {
  animation-duration: 300ms;
}
```

`navigation: auto` enables the transition for same-origin navigations in a multi-page app — no router integration, no JS. In an SPA, call `document.startViewTransition(() => update())` instead; the CSS below is identical.

Keep the duration under 400ms. A transition the user waits through is worse than no transition.

## 2. Give a shared element its own name

```css
.hero-thumb {
  view-transition-name: hero;
}
```

`view-transition-name` must be unique per document at capture time. Two elements with the same name abort the transition and log an error — assign it only to the element that actually moves, and remove it from the outgoing copy.

```ts
document.documentElement.style.setProperty("--vt-name", "none");
```

Use a CSS custom property toggle when the same component appears twice (list + detail): enable the name only on the item being opened.

## 3. Reveal on entry with a scroll timeline

```css
@keyframes fade-in {
  from {
    opacity: 0;
    transform: translateY(1rem);
  }
  to {
    opacity: 1;
    transform: none;
  }
}

.reveal {
  animation: fade-in linear both;
  animation-timeline: view();
  animation-range: entry 0% cover 30%;
}
```

`animation-timeline: view()` drives progress from the element's position in the scrollport, so there is no `scroll` listener and no `IntersectionObserver`. The animation runs on the compositor.

## 4. Make both respect reduced motion

```css
@media (prefers-reduced-motion: reduce) {
  .reveal {
    animation: none;
    opacity: 1;
    transform: none;
  }

  ::view-transition-group(*) {
    animation-duration: 1ms;
  }
}
```

Removing only the animation leaves the element at its initial keyframe opacity. Set the final state explicitly in the reduced-motion block.

## 5. Verify

1. Navigate between two pages — the transition runs once, no flash of the old page
2. Two elements with a duplicate `view-transition-name` — the error appears in devtools
3. Scroll slowly up and down — the reveal reverses, it does not replay
4. Reduced motion on — everything is visible immediately
5. `/run-build` — the feature is progressive: an engine without view transitions still navigates normally

## Pitfalls

- A duplicated `view-transition-name`, which silently cancels the whole transition.
- Animating `height` or `top` on scroll, forcing layout on the main thread.
- `animation-range` without `both` fill, so the element snaps back after the range ends.
- Forgetting the reduced-motion branch, leaving content invisible on a slow device.
- Wrapping `startViewTransition` around async work that outlives the callback — the snapshot is taken before the DOM updates.

## Related

- `references/apis.md`
- `best-practices/css.md`
- `usecases/container-queries.md`
- `usecases/cascade-layers-and-nesting.md`
