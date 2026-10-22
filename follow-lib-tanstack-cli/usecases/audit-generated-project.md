# Use Case — Audit the Generated Project Before Building On It

> Check the scaffold's recorded shape, versions, and generated files so later work is not built on stale or unused output. Source: https://tanstack.com/cli/latest/docs/cli-reference (accessed 2026-10-20)

## 1. Read `.cta.json` first

```json
{
  "version": 1,
  "projectName": "my-app",
  "framework": "react",
  "mode": "file-router",
  "typescript": true,
  "tailwind": true,
  "packageManager": "bun",
  "chosenAddOns": ["tanstack-query", "clerk"]
}
```

This file records what the CLI believes it generated, and `add-on init` and `template init` read it. If it disagrees with `package.json` or the provider tree, the project was edited outside the CLI and later `add` runs will make wrong assumptions.

## 2. Diff the record against reality

```bash
bunx @tanstack/cli create --addon-details tanstack-query --framework React --json
```

For each entry in `chosenAddOns`, confirm the generated artifacts exist:

| Add-on | Artifact to look for |
|--------|----------------------|
| `tanstack-query` | query client module, provider in the root route, devtools entry |
| `clerk` | provider, middleware, key placeholder in `.env.example` |
| `drizzle` | schema folder, client module, `DATABASE_URL` placeholder |
| `tailwind` | Vite plugin registration and CSS entry |

A missing artifact for a listed add-on means the integration is half-wired even though the dependency is installed.

## 3. Check versions against the docs

```bash
bun outdated
```

Scaffold output can lag patch releases. TanStack packages should already be pinned by `pin-versions`; anything far behind gets updated with the project's normal update workflow before feature work, not after.

## 4. Confirm the generated files stay generated

1. Route files under `src/routes/`, including `__root.tsx`
2. `routeTree.gen.ts` — written by the router plugin on every dev run
3. `vite.config.ts`, `tsconfig.json`, linter and formatter config
4. `package.json` scripts — `dev`, `build`, `test`, `lint`, `typecheck`

`routeTree.gen.ts` is derived output. A hand edit is overwritten silently on the next dev run, so the change belongs in the route files it is generated from.

## 5. Remove an add-on you will not use

1. Remove its packages from `package.json`
2. Delete the generated config block, including the Vite plugin entry
3. Remove the provider or registration from the root route
4. Delete its keys from `.env.example` and `.env`
5. Drop the add-on from `chosenAddOns` in `.cta.json`
6. `bun install`, then re-run the dev server and typecheck

## 6. Record a green baseline

```bash
bun run typecheck
bun run lint
bun run test
```

A green baseline on the untouched scaffold means any later failure is yours. Skipping this step gets the first feature blamed for pre-existing breakage.

## Verify

- Every `chosenAddOns` entry has its artifacts and env keys present
- `.cta.json`, `package.json`, and the provider tree agree
- TanStack packages have no `^` ranges and no peer warnings on install
- Typecheck, lint, and test pass before the first feature commit

## Pitfalls

- Editing `routeTree.gen.ts` directly; the next dev run discards it.
- Removing a package but leaving its provider in the root route, which throws at boot.
- Leaving an add-on's key in `.env.example` after removal, so the next developer fills a variable nothing reads.
- Forgetting to update `chosenAddOns`, so a later `add` run reintroduces the removed integration.
- Applying repo-wide formatting to the fresh scaffold in the same commit as the first feature, hiding every real change in the diff.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/scaffold-with-add-ons.md`
- `usecases/add-add-ons-to-existing-project.md`
