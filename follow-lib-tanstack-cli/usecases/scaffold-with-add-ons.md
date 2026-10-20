# Use Case — Scaffold a Project With Add-Ons

> Create a Start/Router app with only the add-ons the feature list needs, then prove it runs. Source: https://tanstack.com/cli/latest (accessed 2026-10-20)

## 1. Read the current add-on list

```bash
bunx @tanstack/cli create --help
```

The add-on set changes between releases, so take the names from `--help` instead of from an old guide.

## 2. Pick add-ons from the feature list

| Feature in the spec | Add-on |
|---------------------|--------|
| server data with caching | `tanstack-query` |
| persisted relational data | `drizzle` |
| sign-in and session | `clerk` |
| utility-first styling | `tailwind` |
| copy-paste component primitives | `shadcn` |

Every accepted add-on is code you now maintain. Adding one later is cheaper than ripping one out.

## 3. Create the project

```bash
bunx @tanstack/cli create my-app --add-ons clerk,drizzle,tanstack-query
```

The prompts choose the package manager, the framework (React or Solid), and the toolchain. Answer them to match the repo you are joining — a Bun project scaffolded with npm instructions costs a cleanup pass later.

## 4. Wire the environment for the chosen add-ons

```bash
cd my-app && bun install
cp .env.example .env
```

Fill only the keys the selected add-ons read — a database URL and auth keys in this example. A leftover key that stays empty is a hidden runtime failure.

## 5. Prove it runs

1. `/run-dev` — the server must start with no missing-env warnings
2. Open the first route and confirm the add-on wiring works (a query fires, the session renders)
3. `/run-typecheck`
4. On failure → `/resolve-errors` max 3 rounds

## Pitfalls

- Scaffolding at a monorepo root instead of the target workspace, dropping a second lockfile and `node_modules` at the root.
- Accepting every add-on "for later"; the generated config then fights your own tooling.
- Assuming the scaffold matches the latest published versions — diff `package.json` against the docs before building on it.
- Starting the app before `.env` is filled, so the first failure looks like a code bug instead of a missing key.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/audit-generated-project.md`
