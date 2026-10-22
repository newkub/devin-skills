# Use Case — Scaffold a Project With Add-Ons

> Create a Start app with only the add-ons the spec needs, then prove it runs. Source: https://tanstack.com/cli/latest/docs/cli-reference (accessed 2026-10-20)

## 1. Read the catalog from the installed CLI

```bash
bunx @tanstack/cli create --list-add-ons --framework React --json
bunx @tanstack/cli create --addon-details drizzle --framework React --json
```

Add-on IDs, options, dependencies, and conflicts change between releases, so take them from the CLI output instead of an old guide. `--json` is the path for scripts and agents; drop it for the final human review.

## 2. Map features to add-ons

| Feature in the spec | Add-on | What it generates |
|---------------------|--------|-------------------|
| cached server data | `tanstack-query` | query client, provider, devtools wiring |
| persisted relational data | `drizzle` | schema folder, client, database env key |
| hosted sign-in | `clerk` | provider, middleware, key placeholders |
| utility-first styling | `tailwind` | Vite plugin and CSS entry |
| copy-paste primitives | `shadcn` | `components.json` and base styles |

Every accepted add-on is files, dependencies, hooks, and env keys you now maintain. Adding one later with `tanstack add` is cheaper than removing one.

## 3. Create with explicit flags

```bash
bunx @tanstack/cli create my-app \
  --package-manager bun \
  --framework React \
  --deployment cloudflare \
  --add-ons tanstack-query,drizzle,clerk \
  -y
```

- explicit flags make the command reproducible; prompts ask for anything omitted
- `-y` accepts the defaults for every remaining option
- default output is a TanStack Start app with SSR; `--router-only` gives a file-based SPA without Start
- `.cta.json` records framework, mode, package manager, add-ons, and deployment — keep it committed

## 4. Install and fill the environment

```bash
cd my-app
bun install
```

Open `.env.example` and fill only the keys the selected add-ons read — a database URL plus the auth keys for this set. A leftover key that stays empty fails at runtime with an error that points at the wrong file.

## 5. Pin TanStack versions

```bash
bunx @tanstack/cli pin-versions
```

This removes `^` from TanStack packages and adds missing peer dependencies, so the generated app cannot drift into a mix of minor versions on the first install.

## 6. Prove it runs

1. `/run-dev` — the server starts with no missing-env warnings
2. Open the first route and confirm each add-on's wiring fires (a query runs, the session renders)
3. `/run-typecheck` — the untouched scaffold must be green
4. On failure → `/resolve-errors` max 3 rounds
5. Commit the untouched scaffold as the green baseline before feature work

## Verify

- `.cta.json` lists exactly the add-ons and deployment present in `package.json`
- No declined add-on left a provider, Vite plugin, or env key behind
- `pin-versions` ran, so TanStack dependencies have no `^` range
- The baseline commit exists and contains no application changes

## Pitfalls

- Scaffolding at a monorepo root instead of the target workspace, dropping a second lockfile and `node_modules` at the root.
- Accepting every add-on "for later"; the generated config then fights your own tooling.
- Assuming scaffold output matches the latest published versions — check `package.json` and run `pin-versions`.
- Starting the app before `.env` is filled, so the first failure looks like a code bug instead of a missing key.
- Passing `--add-ons`, `--deployment`, or `--template` together with `--router-only`, which disables all three.
- Hardcoding add-on IDs in automation; read them from `--list-add-ons --json` each run.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/audit-generated-project.md`
- `usecases/add-add-ons-to-existing-project.md`
