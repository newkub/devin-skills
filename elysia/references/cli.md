# cli

## index.md

# CLI Reference

Elysia uses Bun runtime, no dedicated CLI needed.

## Bun Commands

```bash
bun run src/index.ts
bun --watch src/index.ts
bun test
```

## Project Init

```bash
bun create elysia my-app
```

## Options

| Flag | Description |
|------|-------------|
| `--watch` | Hot reload |
| `--port` | Set port |
| `--hostname` | Set host |

## Development

```bash
bun --watch src/index.ts
```

## Production

```bash
bun build ./src/index.ts --outdir=dist
bun run dist/index.js
```

---

