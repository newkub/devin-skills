# Use Case — Audit the Generated Project Before Building On It

> Verify structure, versions, and tooling in the scaffold so later work is not built on stale or unused output. Source: https://tanstack.com/cli/latest (accessed 2026-10-20)

## 1. Read the generated structure

1. Route files under `src/routes/` with a root route and the generated `routeTree.gen.ts`
2. Config files: `vite.config.ts`, `tsconfig.json`, formatter/linter config
3. `package.json` scripts — `dev`, `build`, `test`, `lint`, `typecheck`

Confirm the framework the CLI actually picked matches what the prompts implied. A wrong framework answer is cheap to fix now and expensive after the first feature.

## 2. Check versions against the docs

```bash
bun outdated
```

Scaffold output can lag patch releases. Anything far behind gets updated with the project's normal update workflow before feature work starts, not after.

## 3. Remove the add-ons you will not use

For each unwanted add-on:

1. Uninstall its packages
2. Delete the generated config block (and the plugin entry in `vite.config.ts` if present)
3. Remove its registration from the root route or provider tree
4. Delete its keys from `.env.example` and `.env`
5. `bun install` and re-run the dev server

## 4. Keep generated files generated

`routeTree.gen.ts` is written by the router plugin on every dev run. Hand edits are overwritten silently, so any change belongs in the route files it is derived from.

## 5. Record a green baseline

```bash
# through the project's own scripts
bun run typecheck
bun run lint
bun run test
```

A green baseline on the untouched scaffold means any later failure is yours. Skipping this step makes the first feature get blamed for pre-existing breakage.

## Pitfalls

- Editing `routeTree.gen.ts` directly; the next dev run discards it.
- Uninstalling a package but leaving its provider in the root route, which throws at boot.
- Leaving an add-on's key in `.env.example` after removal, so the next developer fills a variable nothing reads.
- Applying repo-wide formatting to the fresh scaffold in the same commit as the first feature, hiding every real change in the diff.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/scaffold-with-add-ons.md`
