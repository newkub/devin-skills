# Remotion — Best Practices

Programmatic video — compositions, determinism, and render discipline

## Recommended Patterns

- Drive everything with `useCurrentFrame()` + `useVideoConfig()` — the frame is the source of truth; never rely on wall-clock time
- Use remotion's `interpolate()`/`spring()` for animation curves — no CSS animations/transitions (non-deterministic at render time)
- Split `<Composition>` per output (aspect/duration) — pass props via `defaultProps` + `calculateMetadata` for dynamic duration
- Assets: `staticFile()` for public/ assets — never hardcode URLs outside the static-file mechanism
- Use `<Sequence>` to organize timing layers — explicit from/durationInFrames instead of nested conditionals

## Common Pitfalls

- Determinism: every frame must render to the same result — `Math.random()` must be remotion's seeded `random('seed')`
- `setTimeout`/`setInterval`/`Date.now()` in the render path = broken frames — use frame math only
- `delayRender`/`continueRender` for async assets — the render times out if an asset never finishes loading without cancel
- Audio/video sources through `<Audio>`/`<Video>`/`<OffthreadVideo>` — don't use raw HTML media tags (offthread = frame-accurate)
- Fonts: `loadFont()` from `@remotion/google-fonts` — system fonts differ per render machine

## Perf / Render Notes

- `<OffthreadVideo>` for video sources (frame-exact) but slower — `<Video>` (main thread) is fast but not exact; choose by sync requirement
- `renderMedia` concurrency: too high exhausts RAM — tune `--concurrency` to the machine
- Preview (Remotion Studio) vs render parity — test a real render before shipping a template

## Do / Don't

| Do | Don't |
|----|-------|
| frame-driven math only | `Date.now()`/timers in the render |
| `interpolate`/`spring` deterministic | CSS transitions/animations |
| `random('seed')` seeded | raw `Math.random()` |
| `<OffthreadVideo>` frame-accurate | raw `<video>` tag |
