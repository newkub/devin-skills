# Use Case — Add Add-Ons to an Existing Project

> Compose a new capability into a live TanStack project with `tanstack add`, without regenerating or overwriting it. Source: https://tanstack.com/cli/latest/docs/cli-reference (accessed 2026-10-20)

## 1. Confirm the project was scaffolded by the CLI

```bash
cat .cta.json
```

`add` reads the recorded framework and mode to pick the right files and hooks. If `.cta.json` is missing, the project was created by hand or by an older version — either add the file to match reality first or wire the library manually with its `setup-*` workflow.

## 2. Read the add-on before accepting it

```bash
bunx @tanstack/cli create --addon-details drizzle --framework React --json
```

The output lists the files, dependencies, hooks, env vars, `dependsOn`, and `conflicts` the add-on will merge. Check that every dependency it requires is already satisfied and that nothing it conflicts with is installed.

## 3. Run the add

```bash
bunx @tanstack/cli add clerk drizzle
bunx @tanstack/cli add tanstack-query,tanstack-form
```

Both the space-separated and comma-separated forms work. Only `add-on` ids are valid here — deployment, toolchain, and template ids belong to `create`.

## 4. Resolve conflicts deliberately

```bash
bunx @tanstack/cli add clerk --forced
```

When `add` reports a conflict, read what it names before forcing. `--forced` installs the add-on anyway; forcing past an unknown conflict leaves two integrations writing the same provider or config key, and the failure surfaces later as a runtime error with no clear owner.

## 5. Merge the side effects

1. `bun install` — the add-on added dependencies
2. Fill the new keys in `.env.example` and `.env`
3. Apply any `gitignorePatterns` it declared
4. Check that its `integrations` entries actually landed in `__root.tsx` or `vite.config.ts`

## 6. Verify the integration

1. `/run-dev` — the app boots with the new provider mounted
2. Exercise the feature the add-on enables (a query fires, the session renders)
3. `/run-typecheck`
4. Commit the add-on merge separately from feature work

## Verify

- `chosenAddOns` in `.cta.json` includes the new ids
- The provider or plugin appears exactly once in the root route or Vite config
- Every env key the add-on declared is present in `.env.example`
- Typecheck and dev server pass before any feature edit

## Pitfalls

- Running `create` over an existing project — use `add`, or accept that `create` needs `--force` and overwrites files.
- Passing a deployment or toolchain id to `add`; it only accepts add-on ids.
- Forcing past a conflict without reading it, leaving duplicate providers or competing config keys.
- Adding two add-ons that serve the same concern (two auth or two styling setups); they fight over the same hook.
- Skipping `bun install` so the new import resolves in the editor but fails at build.
- Committing the add-on merge together with a feature, which makes a later revert all-or-nothing.

## Related

- `references/cli.md`
- `best-practices/tanstack-cli.md`
- `usecases/scaffold-with-add-ons.md`
- `usecases/audit-generated-project.md`
