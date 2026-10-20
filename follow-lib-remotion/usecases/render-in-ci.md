# Use Case — Render a Video in CI

> Produce the same MP4 on a headless runner from a props file, then prove the artifact is real. Source: https://www.remotion.dev/docs/cli/render (accessed 2026-10-20)

## 1. Keep input props in a file

```json
{
  "product": "Acme",
  "accent": "#22d3ee",
  "features": ["Fast", "Typed", "Offline", "Free"]
}
```

```sh
bunx remotion render src/index.tsx Promo out/promo.mp4 --props=props.json
```

Passing props as a file avoids shell quoting problems — inline JSON with quotes breaks on Windows runners.

## 2. Choose codec and concurrency for the runner

```sh
bunx remotion render src/index.tsx Promo out/promo.mp4 \
  --props=props.json \
  --codec=h264 \
  --concurrency=2 \
  --log=verbose
```

`--concurrency` controls how many browser tabs render in parallel; the default targets a workstation and over-subscribes small CI runners. Drop it to 1–2 on 2-core machines.

## 3. Use the same command locally

```sh
bunx remotion render Promo out/promo.mp4 --props=props.json
bunx remotion still Promo out/cover.png --frame=45 --props=props.json
```

`still` renders one frame — cheap enough to use as a thumbnail step or a visual regression check.

## 4. Verify the artifact before uploading

```sh
test -s out/promo.mp4
ffprobe -v error -show_entries format=duration,size -of json out/promo.mp4
```

A zero-byte file passes `ls` and fails `test -s`; duration from `ffprobe` catches a render that silently produced a one-frame video.

## 5. Cache what makes renders slow

```yaml
- uses: actions/cache@v4
  with:
    path: |
      node_modules
      ~/.cache/remotion
    key: remotion-${{ hashFiles('bun.lock') }}
```

The Chromium download and the asset cache live outside `node_modules`; caching them removes most of the cold-start cost.

## 6. Wire it into a workflow

```yaml
- run: bun install --frozen-lockfile
- run: bunx remotion render src/index.tsx Promo out/promo.mp4 --props=props.json --concurrency=2
- run: test -s out/promo.mp4
- uses: actions/upload-artifact@v4
  with:
    name: promo
    path: out/promo.mp4
```

## Pitfalls

- Relying on the interactive Studio flags in CI — always pass `--no-open` for anything that would launch a browser.
- Rendering with the default concurrency on a 2-core runner causes OOM kills that look like random render failures.
- Missing system fonts on Linux produce a different typeface than the local machine; bundle fonts and reference them explicitly.
- Skipping the artifact check: a failed render can still exit 0 in some pipelines when the error is swallowed by a wrapper.
- Not caching the Chromium download, adding minutes to every run.
- Uploading before verifying duration, so a truncated video ships as a release asset.

## Related

- `references/apis.md`
- `references/cli.md`
- `best-practices/remotion.md`
- `usecases/scene-sequence.md`
