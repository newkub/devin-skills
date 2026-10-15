# Anime.js — Best Practices

Recommended patterns, pitfalls and perf notes for Anime.js

## Recommended Patterns

- Use the main API `animate(targets, params)` + `stagger()` for sequences — don't hand-build a timeline when a stagger suffices
- Animate only `transform` (`translateX/Y`, `scale`, `rotate`) and `opacity` — GPU-accelerated, doesn't trigger layout
- Keep the animation object in a reference for `pause()`/`cancel()`/`seek()` — don't recreate the animation every frame
- Use the lib's `utils.$()`/`utils.random()` helpers instead of writing your own

## Common Pitfalls

- Never animate `width`/`height`/`top`/`left` if avoidable — layout thrash; use `scale`/`clip-path` instead
- SPA frameworks: capture the target at mount — anime binds DOM nodes directly; animating after a component unmounts = leak → cancel in cleanup
- `stagger` on many elements → limit the count / use `from: 'center'` to reduce perceived jank
- Animation state is not serializable — don't store the animation object in reactive state (Solid signal/store) — keep it in a plain ref

## Perf Notes

- Use `will-change: transform` only on elements actually animated — never on the whole page
- Infinite loops (`loop: true`) → set `autoplay: false` and play only while visible (IntersectionObserver)
- Scroll-driven → use the built-in scroll observer/`onScroll` instead of a scroll listener that recomputes every frame

## Do / Don't

| Do | Don't |
|----|-------|
| `animate()` + `stagger()` for list reveals | manual `setTimeout` chains |
| transform/opacity only | animate layout properties |
| cancel animation in cleanup | leave animations running after unmount |
| `createTimeline()` when the sequence is complex | nesting `onComplete` callbacks many levels deep |
