---
name: follow-lib-tanstack-cli
description: Use the TanStack CLI — scaffold Start/Router apps, compose add-ons, and inspect the catalog/docs
argument-hint: "[template] [add-ons]"
related:
  - follow-lib-tanstack-ecosystem
  - run-dev
  - resolve-errors
---

## Goal

Use the TanStack CLI to scaffold, extend, and inspect TanStack Start/Router projects — templates, add-ons, deployment, and machine-readable catalog/docs lookups

## Scope

For creating a TanStack app or composing add-ons into one — not for wiring a single library into an existing non-TanStack project (use the per-library `setup-*` workflows instead)

- part of TanStack ecosystem — selection/dispatch lives in `/follow-lib-tanstack-ecosystem`
- References: [TanStack CLI — Best Practices](best-practices/tanstack-cli.md), [apis](references/apis.md), [cli](references/cli.md)

## Execute

### 1. Inspect The Catalog

> Goal: choose from the installed CLI's real add-ons, not from an old guide

```bash
bunx @tanstack/cli create --list-add-ons --framework React --json
bunx @tanstack/cli create --addon-details drizzle --framework React --json
bunx @tanstack/cli libraries --group state
bunx @tanstack/cli ecosystem --category database
```

- add-on IDs, options, dependencies, and conflicts change between releases — always read them from the CLI
- `--json` is the automation path for scripts and agents
- `libraries --group` accepts `state`, `headlessUI`, `performance`, `tooling`

### 2. Create The Project

> Goal: one reproducible command with the framework, package manager, deployment, and add-ons the spec needs

```bash
bunx @tanstack/cli create my-app \
  --package-manager bun \
  --framework React \
  --deployment cloudflare \
  --add-ons drizzle,tanstack-query \
  -y
```

- default output is a TanStack Start app with SSR; `-y` uses defaults for remaining prompts
- `--blank` = one route, no starter UI, examples, Tailwind, devtools, test stack, or Intent setup
- `--router-only` = file-based Router without Start (add-ons, deployment, and template are disabled)
- `--template <id-or-url>`, `--build-tool rsbuild`, `--toolchain biome`, `--no-examples`
- `--no-git`, `--no-install`, `--target-dir <path>`, `--force`, `--add-on-config '<json>'`
- `.cta.json` records the generated app shape, add-ons, and deployment — keep it committed

### 3. Extend An Existing Project

> Goal: add a capability without regenerating the project

```bash
bunx @tanstack/cli add clerk drizzle
bunx @tanstack/cli add tanstack-query,tanstack-form
```

- `add` merges files, dependencies, hooks, and env keys into the current project
- `--forced` only after reading the conflict; forcing past an unknown conflict leaves a half-wired integration
- use `add` instead of re-running `create` over a live project

### 4. Post-Scaffold

> Goal: the project runs and its dependency set is intentional

1. `cd my-app && bun install` unless the scaffold used `--no-install`
2. Fill the generated `.env.example` keys for the chosen add-ons
3. `bunx @tanstack/cli pin-versions` — drops `^` from TanStack packages and adds missing peers
4. `/run-dev` — the server must start with no missing-env warnings
5. `/run-typecheck` — the untouched scaffold must be green
6. Commit the untouched scaffold as a baseline before feature work

### 5. Verify

> Goal: prove generation, add-ons, and runtime agree

1. `.cta.json` lists the add-ons and deployment actually present in `package.json`
2. The first route renders and each add-on's wiring fires (a query runs, the session renders)
3. Removed or declined add-ons left no provider, plugin, or env key behind
4. On failure → `/resolve-errors` max 3 rounds

### Use Cases

| Scenario | Use case |
|----------|----------|
| Create an app with only the add-ons the spec needs | `usecases/scaffold-with-add-ons.md` |
| Audit the generated structure, versions, and `.cta.json` | `usecases/audit-generated-project.md` |
| Add an add-on to a project that already exists | `usecases/add-add-ons-to-existing-project.md` |
| Find libraries and read docs from the terminal | `usecases/discover-libraries-and-docs.md` |
| Choose a blank, router-only, or template baseline | `usecases/minimal-scaffolds-and-templates.md` |

## Rules

- Inspect `--list-add-ons` and `--addon-details` before choosing — never hardcode an old add-on list
- Use `add` for existing projects; `create` is for a new target directory
- `--router-only` disables add-ons, deployment, and templates — do not pass them together
- Every add-on is files, dependencies, hooks, and env keys you now maintain — accept only what the spec uses
- Commit the untouched scaffold before customizing so later diffs stay readable
- Scaffold output can lag patch releases — check versions and `pin-versions` after generation
- `--json` for automation; human output for the final review
- See best-practices/ for the pattern and pitfall checklist

## Expected Outcome

- A scaffold that matches the spec, with every add-on intentional and wired
- A green baseline (install, env, dev server, typecheck) before feature work starts
