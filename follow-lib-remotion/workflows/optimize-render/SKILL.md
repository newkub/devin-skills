---
name: follow-lib-remotion-optimize render
description: Optimize Remotion render — performance, codecs, lambda notes
argument-hint: "[scope]"
related:
  - follow-lib-remotion
  - run-bench
  - report-before-after
  - resolve-errors
---

## Goal

Improve Remotion render performance — cut render time, pick suitable codecs/flags, and cloud rendering notes

## Scope

Use when rendering is slow or scalable renders are needed — covers baseline timing, component optimization, CLI flags, and Lambda/Cloud Run notes (must measure before and after)

## Execute

### 1. Baseline

> Goal: measure the current render time before optimizing

1. time the current render: `bunx remotion render MyComp` — record duration and output size
2. identify the bottleneck: composition complexity, large assets, codec, concurrency — run `/deep-optimize`
3. use `--log=verbose` to inspect render phases if more detail is needed

### 2. Optimize Composition

> Goal: reduce per-frame cost in components

1. avoid expensive computation in the render body — precompute outside the component or memoize
2. use `<OffthreadVideo>` for large videos — extracts frames offthread without blocking
3. optimize assets before rendering — compress images/videos, resize to fit the output resolution
4. use `lazyComponent` for compositions that don't need to render now
5. avoid large `defaultProps` payloads — props are serialized on every render

### 3. Tune Render Flags

> Goal: pick suitable codec and concurrency

1. `--codec`: `h264` (default, balanced), `h265` (smaller but slower), `vp9` (web), `gif`, `png` sequence
2. adjust `--concurrency` to the available CPU cores — the default is fairly good; try raising it if rendering is slow
3. `--every-nth-frame` for GIF/draft renders — fewer frames to render
4. `--scale` to lower output resolution for preview/draft renders
5. see the full flags in the official docs `https://remotion.dev/docs/cli/render` — never guess flag names

### 4. Cloud Rendering Notes

> Goal: choose a cloud option when local rendering isn't enough

1. `@remotion/lambda` (AWS Lambda) — highest scale, renders in parallel across many functions; suits large volume
2. `@remotion/cloudrun` (Google Cloud Run) — container-based, more control than lambda
3. `@remotion/vercel` — integrates with Vercel
4. cloud rendering requires credentials/infrastructure setup — see the official docs and `/follow-secret-manager` for keys; never commit them

### 5. Verify And Compare

> Goal: measure after optimizing vs the baseline

1. re-render with the new settings — compare duration and output size against the baseline with `/report-before-after`
2. check output quality — optimization must not drop quality beyond what is acceptable
3. if there is no improvement → revert that point and report

## Rules

- Measure the baseline first, always — never optimize without the original numbers
- Change one point at a time — keep each optimization's effect separable
- Preserve output quality — inspect the output after every change
- `--concurrency` too high = memory pressure — raise it gradually
- Use `/follow-lib-remotion` for the full reference

## Expected Outcome

- Render time reduced vs the baseline with real numbers
- Codec/flags suited to the use case (draft vs production)
- Cloud rendering option clearly stated if scaling is needed
