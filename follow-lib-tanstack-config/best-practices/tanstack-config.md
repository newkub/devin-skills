# TanStack Config — Best Practices

Package maintenance contract — shared lint, dual-build, Changesets publishing, package layout

## Recommended Patterns

- Install the scoped package you need (`@tanstack/eslint-config`, `@tanstack/vite-config`, `@tanstack/publish-config`); `@tanstack/config` is deprecated
- Keep pnpm as the only package manager — the toolchain assumes pnpm workspaces and `pnpm dlx`
- Put shipping code in `src/` and every test in `tests/`, so the Nx cache is not invalidated by test edits
- Define the five cached scripts per package: `test:eslint`, `test:types`, `test:lib`, `build`, `test:build`
- Keep `"type": "module"`, an explicit `exports` map, and the legacy `main`/`module`/`types` fields
- Spread `tanstackConfig` first, then append package-specific rule blocks
- Build new packages with tsdown; treat `@tanstack/vite-config` as the legacy path
- Gate the build on `publint --strict` and verify the packed tarball, not `dist/`
- Record release intent with a changeset in the PR that changes the package
- Publish with npm trusted publishing so no long-lived token lives in the repo

## Common Pitfalls

- Installing the deprecated `@tanstack/config` umbrella, which only re-exports the scoped packages
- Substituting bun or npm for pnpm — the documented commands and workspace layout assume pnpm
- Putting tests in `src/`, which ships them and can invalidate the Nx cache on test-only edits
- Expecting framework plugins from `tanstackConfig`; it is framework-agnostic by design
- Dual ESM/CJS output with module-level mutable state, causing the dual-package hazard
- A missing `files` allowlist, publishing test fixtures and source maps
- Publishing from a stale `dist` because the release job skipped the build
- Adding a top-level `types` field while `exports` exists and expecting it to be used
- Long-lived npm tokens in repository secrets when trusted publishing is available

## Perf Notes

- Let Nx run `affected` in PRs and `run-many` only in release, so unchanged packages skip work
- Cache lint, types, lib tests, build, and build tests separately — a failure names the stage
- Prefer ESM-only output when the dependency graph allows it; skip CJS instead of shipping a broken `require`
- Exclude source maps from the tarball when consumers do not need them

## Do / Don't

| Do | Don't |
|----|-------|
| install the scoped config package | install the deprecated umbrella |
| pnpm workspaces | mixed package managers |
| tests in `tests/` | tests inside `src/` |
| `publint --strict` in `test:build` | publish on a local build only |
| tsdown for new packages | new package on the legacy Vite build |
| changeset in the PR | ad-hoc version bumps |
| OIDC trusted publishing | long-lived npm token |
