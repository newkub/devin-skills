# Knip — Best Practices

Unused files/deps/exports detection — config precision for monorepos

## Recommended Patterns

- One `knip.json`/`knip.ts` per repo root — precise `entry` + `project` patterns per workspace (entry is where knip traces from)
- Declare all real entry points: config files, scripts, app entry, test files — a missing entry = a flood of false "unused"
- Workspaces: a `workspaces` map in the config or rely on auto-detect from the package manager — verify coverage
- `--production` mode for deps needed at runtime — compare devDeps separately
- CI: `knip --exit-code` fails the build — run it as a dedicated job, not on every PR (slow)

## Common Pitfalls

- False positives from dynamic imports/plugins (vite plugins, drizzle models, barrel re-exports) — put them in `entry`/`ignore` or `ignoreDependencies`
- Barrel files: knip understands re-exports, but an `index.ts` that exports * must be an entry
- `ignoreBinaries`/`ignoreDependencies` for tools invoked via scripts, not imports (husky, turbo, changesets)
- Monorepo: run at the root only — per-package runs miss cross-workspace usage
- Config evolves — new entry types (a new scripts dir) need entry patterns added, or knip flags the whole dir

## Report Interpretation

- `unused files` → delete candidates; `unused deps` → uninstall; `unused exports` → dead code; `unlisted deps` → missing package.json entries (a real bug)
- Duplicate exports/enum members = hygiene issues at lower severity

## Do / Don't

| Do | Don't |
|----|-------|
| entry patterns covering every entrypoint | rely on auto-detect then wonder about false positives |
| `ignoreDependencies` for script-invoked tools | uninstall a dep just because knip flagged it |
| run at the monorepo root | per-package knip runs |
| baseline→ratchet in CI | strict mode day one on a legacy repo |
