# esm.sh — Best Practices

ESM CDN imports — pinning, stability and prod-readiness discipline

## Recommended Patterns

- Always pin versions: `https://esm.sh/zod@3.25.76` — bare `esm.sh/pkg` = floating latest = non-reproducible
- Use in temporary Bun/TS scripts or edge workers without node_modules — production web apps should bundle instead
- Subpath + query flags: `?bundle`, `?deps`, `?external`, `?target=es2022` — control the output per runtime
- Shared deps (react/solid) must use `?external=` or pin the same version across every import — otherwise duplicate instances
- `?worker` suffix for modules that must run in a worker context

## Common Pitfalls

- Duplicate React/Solid instances = hooks break — use import maps/`?deps`/`?external` to dedupe
- CDN = a network runtime dependency — offline/CI flaky → vendor or bundle for critical paths
- TS types: esm.sh serves types but `bun`/tsserver needs `?dts` or an additional import map — test the real typecheck
- Version drift: an old pinned script vs a new package.json → sync when upgrading the main dep
- Strong cache headers — changing the pinned version URL = natural cache bust (good)

## Security / Supply Chain

- esm.sh = third-party CDN — code doesn't pass lockfile integrity; pin + check the source when handling sensitive data
- If a package has postinstall/native bindings → esm.sh doesn't run scripts — pure JS/WASM only

## Do / Don't

| Do | Don't |
|----|-------|
| pin `@x.y.z` on every import | `esm.sh/pkg` floating |
| `?deps`/`?external` dedupe shared libs | import two versions of react |
| bundle/vendor for prod | rely on CDN for critical paths |
| `?target=` matching the runtime | assume the default target always works |
