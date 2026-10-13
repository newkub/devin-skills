# Analyzer Structure And Coverage

## Required Analyzer Files

Verify that `src/domain/analyzers/` has all 5 analyzer files:

- `user-facing.ts` — UX, accessibility, UI patterns
- `security.ts` — security vulnerabilities, auth, input validation
- `backend-data.ts` — data layer, API, database
- `infrastructure.ts` — deployment, CI/CD, config
- `code-arch.ts` — code quality, architecture, patterns

If an analyzer file is missing → flag as `High` severity

## CategoryResult Contract

Verify that every analyzer returns a `CategoryResult` with these fields:

- `status` — `pass` | `fail` | `warn`
- `score` — a number 0-100
- `findings` — an array of finding objects

If an analyzer does not return `CategoryResult` → flag as `High` severity

## Review Workflow Map

Verify that every analyzer has a `reviewWorkflow` map:

- Map from category to `/deep-review` or references
- Specify the action to take when an issue is found

If `reviewWorkflow` is missing → flag as `Medium` severity

## Shared Utilities

Verify that analyzers use shared utilities from `src/adapters/`:

- Never duplicate utility code between analyzer files
- Use shared helpers for file reading, pattern matching, and scoring

If duplicated code is found → flag as `Medium` severity

## Category Coverage

Verify that there are 60+ categories from `/run-review`:

- Read `run-review` to learn the full category list
- Verify that the analyzers cover all categories

If category coverage is incomplete → flag as `Medium` severity

## Domain Coverage

Verify that all 5 domains are present:

- `user-facing`
- `security`
- `backend-data`
- `infrastructure`
- `code-arch`

If a domain is missing → flag as `High` severity

## Evidence Format

Every finding must include:

- File path, e.g. `tools/review-codebase/src/domain/analyzers/security.ts`
- Line number
- The code snippet that is problematic
