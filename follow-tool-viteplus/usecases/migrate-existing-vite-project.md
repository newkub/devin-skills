# Migrate an Existing Vite Project to Vite+

Use this recipe when a Vite app or library should adopt `vp` for dev/build, tests, packing, lint, format, and task running — with zero behavior change.

## 1. Preconditions

- Git working tree is clean; the current branch is recoverable
- Vite is at least 7 and Vitest at least 4 (upgrade first if not)
- Node satisfies `^22.18.0 || ^24.11.0 || >=26.0.0` when Vitest 5 will run under `vp test`
- Baseline is green: `build`, `test`, and `lint` pass before touching anything

## 2. Record the Baseline

```bash
# adjust to the project's scripts
bun run build
bun run test
bun run lint
```

Save the outputs (bundle sizes, test counts, lint warnings). The migration is only done when the same checks pass afterward.

## 3. Install and Inspect

```bash
# global CLI (Windows)
irm https://vite.plus/ps1 | iex
# or project-local
vp add -D vite-plus

vp --version
vp toolchain
```

## 4. Run the Migration

```bash
vp migrate
# non-interactive (CI or scripted)
vp migrate --no-interactive
# broader migration (framework shims, tsconfig baseUrl, editor settings)
vp migrate --full
```

The migration rewrites imports to `vite-plus` / `vite-plus/test`, adds the Vite core alias to the overrides, and converts supported legacy configs into the single `vite.config.ts`.

Commit this step on its own — it is the mechanical part.

## 5. Consolidate Config

Move remaining options into the matching block:

| Concern | Block |
|---|---|
| dev server, proxy, aliases, env prefix | `server` / `resolve` / `envPrefix` |
| production build | `build` |
| preview server | `preview` |
| formatter options | `fmt` |
| lint rules + `typeAware`/`typeCheck` | `lint.options` |
| `vp check` step defaults | `check` |
| test environment and setup files | `test` |
| library bundling (entry, format, dts) | `pack` |
| workspace task graph | `run` |
| staged-file checks | `staged` |

Then delete the files the single config now owns — typically a standalone test config, a standalone bundler config, a standalone lint config, a standalone format config, and task-runner config, plus their dependencies from `package.json`.

Do this as a separate commit; keep deletions reviewable.

## 6. Verify Parity

```bash
vp check
vp test
vp build
vp preview
```

Compare with the baseline:

- same test count and results
- same or smaller bundle output
- no new lint errors; formatting diff is mechanical only
- dev server serves the same routes and proxy behavior

Only then proceed to hooks and CI.

## 7. Hooks, Editor, CI

```bash
vp hooks enable
vp hooks status
```

- `staged: { '*': 'vp check --fix' }` runs on staged files
- Editor: install the Vite Plus Extension Pack and set `"editor.defaultFormatter": "oxc.oxc-vscode"` with nested Oxc configs disabled
- CI: add `setup-vp` before install/build; run `vp check`, `vp test`, `vp build` and `vp pack` when the project is a library

## 8. Rollback

If parity fails:

1. Revert the config-consolidation commit — the migration commit stays
2. Compare `vp check` output against the old lint/format commands to find the mismatched rule
3. Fix the block (or restore the one legacy tool the project still needs) before retrying

Never keep two active stacks as a "temporary" rollback — either the project is on Vite+ or it is not.
