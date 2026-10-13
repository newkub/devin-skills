# Clean Architecture Validation Rules

## Required Directories

Verify that `tools/review-codebase/` has all 4 layers of directories:

- `src/domain/` — business logic, analyzers, types
- `src/application/` — use cases, orchestration
- `src/adapters/` — shared utilities, external integrations
- `src/presentation/` — CLI entry point, user-facing output

If any directory is missing → flag as `High` severity

## Entry Points

Verify that all entry points are present:

- `src/presentation/cli.ts` — the main CLI entry point
- `src/index.ts` — barrel export for workspace imports

If an entry point is missing → flag as `Critical` severity

## File Naming

Verify that every file uses `kebab-case`:

- Correct examples: `user-facing.ts`, `code-arch.ts`, `deep-review.ts`
- Wrong examples: `UserFacing.ts`, `userFacing.ts`, `user_facing.ts`

If a file does not use `kebab-case` → flag as `Low` severity

## Bun Native APIs

Verify that Bun native APIs are used instead of Node.js APIs:

- `Bun.file` — read a file, instead of `fs.readFile`
- `Bun.spawn` — run a subprocess, instead of `child_process`
- `Bun.write` — write a file, instead of `fs.writeFile`

If Node.js APIs are used instead of Bun → flag as `Medium` severity

## Dependency Direction

Verify that the dependency direction is correct:

- `presentation` → `application` → `domain`
- `adapters` → `domain`
- `domain` must never import from any other layer

If a dependency points the wrong way → flag as `High` severity

## Evidence Format

Every finding must include:

- File path, e.g. `tools/review-codebase/src/domain/analyzers/security.ts`
- Line number
- The code snippet that is problematic
