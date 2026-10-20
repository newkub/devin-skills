# TanStack Config — Best Practices

Package build/publish toolchain — exports map, types, pack verification

## Recommended Patterns

- Applies to packages you publish; application projects should use their own bundler instead
- Define entry points and emit ESM, CJS and `.d.ts` together so both `import` and `require` consumers work
- Keep the `exports` map explicit with `import`, `require` and `types` conditions pointing at built files
- Add the built output (not `src`) to `files` in `package.json`
- Gate publishing on `npm pack --dry-run` plus a publint-style check in CI
- Keep the config minimal — extend the provided preset instead of re-specifying every option
- Confirm the current config file/field name from the docs before wiring scripts, the format is young

## Common Pitfalls

- Shipping `src` in the tarball while `exports` points at `dist` — consumers get broken imports
- Omitting the `types` condition makes TypeScript fall back to `any` under `moduleResolution: bundler`
- Dual ESM/CJS builds that each keep module-level mutable state create the classic dual-package hazard
- A missing `files` allowlist silently publishes test fixtures and source maps
- Local checks pass while CI publishes from a stale `dist` — always build before pack
- Replacing an existing tsdown/tsup build with this toolchain without a reason adds churn

## Perf Notes

- Emit source maps but exclude them from the tarball if size matters to consumers
- Prefer a single ESM output plus a CJS shim when the dependency graph is large
- Keep type declarations generated from the same build to avoid drift between runtime and types

## Do / Don't

| Do | Don't |
|----|-------|
| explicit `import`/`require`/`types` conditions | one entry without a types path |
| publish built output only | ship `src` in the tarball |
| `npm pack --dry-run` gate | publish on a local build only |
| extend the provided preset | re-declare every option |
| build before pack in CI | pack from a stale `dist` |
