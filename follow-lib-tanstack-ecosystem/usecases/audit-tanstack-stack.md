# Use Case — Inventory the TanStack Packages Already Installed

> Find duplicate roles, split majors, and unused packages before adding another library. Source: https://tanstack.com/libraries (accessed 2026-10-20)

## 1. List every TanStack package

```bash
grep -rn '"@tanstack/' --include=package.json .
```

In a monorepo, group the results by workspace. A package listed in three manifests is either shared intentionally or resolved three times.

## 2. Classify by role, not by name

| Role | Packages |
|------|----------|
| routing | `*-router`, `*-start` |
| server state | `*-query`, `query-core` |
| client state | `*-store` |
| synced collections | `*-db` |
| forms | `*-form` |
| tables | `*-table` |
| virtualization | `*-virtual` |
| timing | `*-pacer` |
| AI | `*-ai` |
| dev-only | `*-devtools`, `devtools-vite` |

Two packages in the same role is the finding worth investigating; two packages in different roles is usually correct.

## 3. Find the split-major case

```bash
npm ls @tanstack/react-query
```

A tree with two versions of the same library breaks context: the provider created by one copy is invisible to hooks imported from the other, and devtools bridges stop working. Force a single version with the package manager's override field, then re-run the app.

## 4. Check framework binding versus core

Apps import the binding (`@tanstack/react-query`), not the core (`@tanstack/query-core`). A direct core dependency in an app usually means someone rebuilt a hook by hand. Keep the core only in a library that genuinely wraps the framework binding.

## 5. Look for packages nothing imports

```bash
bunx knip
```

A TanStack package with no import is either a leftover from a migration or a planned feature that never landed. Both are reasons to remove it from the manifest.

## 6. Write the decision table

| Package | Role | Version | Decision |
|---------|------|---------|----------|
| `@tanstack/react-query` | server state | one version | keep |
| `@tanstack/react-query-devtools` | dev-only | matches | keep as devDependency |
| `@tanstack/react-router` | routing | older major | upgrade or pin deliberately |
| `@tanstack/react-store` | client state | unused | remove |

Keep the table short: one row per package, one decision each.

## 7. Act and verify

1. Remove unused packages and run `/run-install`
2. Deduplicate to one version per library
3. Move devtools packages to `devDependencies`
4. `/run-typecheck` and `/run-test`
5. `/run-dev` — providers still resolve, devtools tabs still appear
6. `/run-build` — the removed packages are gone from the output

## Pitfalls

- Counting packages instead of roles, so a correct two-library setup looks like duplication.
- Removing a package that is only imported by a type-only path the grep missed.
- Forcing one version without checking that each workspace's peer range accepts it.
- Leaving devtools in `dependencies` because the app imported it once in production code.
- Auditing only the root manifest in a monorepo and missing workspace-level installs.

## Related

- `references/apis.md`
- `best-practices/tanstack-ecosystem.md`
- `usecases/integrate-a-new-library.md`
- `usecases/evaluate-maturity-and-lock-versions.md`
