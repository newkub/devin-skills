# Use Case — Interactive Dependency Refresh

> Update a workspace's dependencies with review, not a blind "latest": pick what moves, keep majors deliberate, then verify. Source: https://github.com/antfu/taze (accessed 2026-10-20)

## 1. See what would change

```bash
bunx taze                 # report only, current workspace
bunx taze -r              # every workspace in the monorepo
bunx taze --include "vue*,@vue/*"
bunx taze --exclude "@types/*"
```

The report separates patch/minor from major — that distinction is the whole workflow.

## 2. Apply patch/minor, hold majors

```bash
bunx taze -r -w                     # write non-major updates into every package.json
bunx taze -r major -w               # majors explicitly, one run at a time
bunx taze -I                        # or pick interactively, package by package
```

Commit the non-major bump separately from each major migration — one bisectable change per major.

## 3. Verify after writing

```bash
bun install
bun run typecheck && bun test && bun run build
```

`taze -w` only edits the manifest; nothing is installed or validated until you run the install.

## 4. Pin back what broke

```bash
bun add <pkg>@<previous-version> --exact
```

An exact pin for a genuinely broken dependency is honest; a caret pointing at a broken major is not.

## Pitfalls

- `taze major -w` in a monorepo in one shot → many unrelated breakages in one commit, impossible to bisect.
- Updating `@types/*` ahead of the runtime library → typecheck fails on APIs that do not exist yet; keep them in the same run as the lib.
- Forgetting workspace protocol deps (`workspace:*`) → they are skipped by design; bump their version ranges manually.
- Running `taze` in CI and writing files → the pipeline mutates the repo; use it locally, or only report in CI.

## Related

- `references/cli.md`
- `best-practices/taze.md`
- `usecases/ci-drift-report.md`
