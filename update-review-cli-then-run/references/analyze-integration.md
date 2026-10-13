# Analyze Integration Rules

## Workspace Imports

Verify that `tools/review-codebase` imports analyzers from `tools-analyze` via workspace:

- Use the workspace protocol, e.g. `"tools-analyze": "workspace:*"`
- Import from `tools-analyze` instead of copying code
- Check in the `package.json` of `tools/review-codebase`

If there is no workspace import → flag as `High` severity

## No Duplicated Logic

Verify that there is no duplicated analyzer logic in `tools/review-codebase/src/`:

- Never copy analyzer functions from `tools-analyze`
- Never re-implement logic already present in `tools-analyze`
- Check in `src/domain/analyzers/` and `src/adapters/`

If duplicated logic is found → flag as `Medium` severity

## Dependency Check

Verify that `tools-analyze` is a dependency of `tools/review-codebase`:

- Read `tools/review-codebase/package.json`
- Check that `dependencies` includes `tools-analyze`
- Check that the version uses the `workspace:*` protocol

If the dependency is missing → flag as `High` severity

## Import Path Validation

Verify that import paths are correct:

- Imports from `tools-analyze` use a barrel export or a direct path
- There are no broken imports or missing modules
- Check with `bun run` or typecheck

If broken imports are found → flag as `High` severity

## Evidence Format

Every finding must include:

- File path, e.g. `tools/review-codebase/package.json`
- Line number
- The code snippet that is problematic
