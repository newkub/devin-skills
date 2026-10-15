# Turborepo — Best Practices

Monorepo task orchestration — pipeline caching and dependency graphs

## Recommended Patterns

- `turbo.json` pipelines: `build`, `test`, `lint`, `typecheck`, `dev` — `dependsOn: ["^build"]` for upstream deps
- `outputs` declarations — cache correctness depends on the declared outputs; a miss = stale artifacts
- `inputs`/`$TURBO_DEFAULT$` — cache invalidation based on source files, not timestamps
- `turbo run build --filter=...` scopes tasks per workspace — `--filter=pkg...` includes dependents
- Remote caching (Vercel/self-hosted) for teams — a shared cache = lighter CI

## Common Pitfalls

- `dependsOn` differs: `^build` = deps build first (topological), `build` = this package's build finishes first — pick correctly
- `dev`/`watch` tasks = `cache: false` + `persistent: true` — caching persistent tasks breaks everything
- Env vars: `env`/`globalEnv` declarations — undeclared envs don't invalidate the cache = stale builds
- `.env` files → `globalDependencies` or per-task `inputs` — otherwise env changes don't trigger a rebuild
- Pipeline vs package scripts: turbo runs package scripts — the scripts must exist in each workspace's package.json

## CI Integration

- `--affected`/`--filter=[HEAD^]` runs only changed-affected packages — lighter CI
- `turbo prune` for Docker — a partial monorepo copy into the image
- Remote cache + signature checks — verify cache hits, not silently stale

## Do / Don't

| Do | Don't |
|----|-------|
| `^` prefix for dep-graph ordering | flat dependsOn for everything |
| declare outputs+env+inputs | trust default cache keys |
| `--filter` scope CI runs | build the whole monorepo every commit |
| persistent tasks `cache:false` | cache dev servers |
