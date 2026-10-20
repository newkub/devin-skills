# Use Case — Monorepo Dead-Code Gate per Workspace

> Audit every workspace without one package's entry points hiding another's dead weight. Source: https://knip.dev/features/workspaces (accessed 2026-10-20)

## 1. One config, explicit workspaces

```json
// knip.json (repo root)
{
  "$schema": "https://unpkg.com/knip@5/schema.json",
  "workspaces": {
    "apps/web": {
      "entry": ["src/main.tsx", "src/routes/**/*.tsx", "vite.config.ts"],
      "project": ["src/**/*.{ts,tsx}"]
    },
    "apps/api": {
      "entry": ["src/index.ts"],
      "project": ["src/**/*.ts"]
    },
    "packages/*": {
      "entry": ["src/index.ts", "src/**/*.test.ts"],
      "project": ["src/**/*.ts"]
    }
  },
  "ignoreWorkspaces": ["examples/*"],
  "ignoreDependencies": ["@types/*", "typescript"]
}
```

Per-workspace `entry` is the whole point: a shared `entry` makes every package look used from everywhere.

## 2. Run scoped

```bash
bunx knip --workspace apps/web          # one workspace
bunx knip --workspace packages/ui       # library surface only
bunx knip --dependencies                 # only dependency drift
```

## 3. Fail the PR, not the release

```yaml
- name: Dead code
  run: bunx knip --no-progress --workspace apps/web --workspace apps/api
```

Gate the apps first — they have a real entry point. Libraries often expose types consumed outside the repo, so start those as advisory (`continue-on-error: true`) and tighten later.

## 4. Fix in a reviewed commit

```bash
bunx knip --workspace packages/ui --include dependencies
bunx bun pm remove <reported-package>
bunx tsc --noEmit -p packages/ui
```

## Pitfalls

- Default single-workspace scan in a monorepo → root `dependencies` look unused and real dead code hides behind cross-imports.
- `ignoreWorkspaces` too broad → the gate passes while a whole app rots.
- Removing a dependency a bundler plugin loads implicitly (`@vitejs/plugin-react` referenced only in config) → list the config file in `entry` instead of ignoring the dep.
- Gating libraries as hard failures on day one → CI blocks unrelated work; make it advisory until the backlog is zero.

## Related

- `references/apis.md`
- `best-practices/knip.md`
- `usecases/remove-dead-code.md`
