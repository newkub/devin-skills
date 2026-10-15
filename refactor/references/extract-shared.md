# Refactor — Extract To Packages Shared

Detail for `/refactor` `### 7. Extract To Packages Shared` — move code reused across workspace members into `packages/shared` so one fact has one source; only for a monorepo with real cross-package duplication (merged from `/refactor-to-packages-shared`)

> Pre-Run: extract only with ≥2 real consumers — never "for the future" (`/dont-over-engineer`); check the catalog with `/use-lib-effective` first — an existing lib doing the job beats a new shared file

## 1. Inventory

> Goal: know every duplication and who consumes it

1. `/follow-monorepo` to read layout and conventions
2. Find duplication (`/follow-tool-jscpd`, `sg scan`, manual across utils/types/schemas/components/hooks/constants) → collect candidates with a consumer count
3. Existing `packages/shared`: audit every file for ≥1 external consumer (internal-only does not count → move out or report); missing package: create it per the convention of sibling members (manifest, tsconfig, build)

## 2. Plan

> Goal: layer-correct, leaf-first, every consumer site known

1. Group per Clean layers — `domain/` pure (types/constants/domain logic), `features/` + `ports/` (use cases), `infra/` + `adapters/` (framework/DB/external)
2. Order leaf-first: pure types → domain utils → use cases/ports → infra → genuinely shared UI
3. List every consumer site (imports, re-exports, tests) → `/create-plan-in-dot-devin` + user confirm when >5 units or a critical path is touched

## 3. Extract

> Goal: one canonical implementation in the right layer

1. Take the canonical version from the most complete copy (merge only the deltas) → `packages/shared/src/<layer>/<domain>/`
2. Dependency direction `domain` ← `application` ← `infrastructure` ← entry — `domain` never imports framework/IO
3. Export through a barrel per domain + the root barrel — no deep imports across a boundary
4. Slightly different variants → unify through parameters/config, never keep two versions; keep original license/attribution

## 4. Rewire

> Goal: consumers point at the shared source, local copies disappear

1. Replace each local copy with an import from shared by package name/path alias — one consumer at a time; mechanical work → `/use-astgrep rewrite` (dry-run + confirm)
2. Audit external consumers before deleting each local file — never delete before verify
3. `/update-references` after every batch (barrels, tsconfig paths, package deps)

## 5. Verify

> Goal: shared is a leaf and duplication is gone

1. `/run-verify` as the workspace supports → `/follow-tool-madge`: `packages/shared` is a leaf, no cycle, imports no sibling member, domain layer has no framework/IO import
2. Re-run the duplication scan → only the canonical implementation remains
3. Fail → revert that batch, max 3 rounds → stop + report

## Rules

### 1. Only Real Sharing

- Coincidental similarity (same shape, different domain) stays duplicated — do not merge
- After the refactor exactly one implementation remains (`/follow-single-of-source`)

### 2. Refactor Hats Only

- Never mix a feature or a fix into an extraction; no tests on the candidate → write characterization tests first (`/update-tests`)
- One domain batch → verify → `/git-commit` checkpoint

## Expected Outcome

- `packages/shared` holds the reused code, layer-correct, with an external consumer for every file
- All consumers import through the barrel; no duplicate implementation, no cycle, `/run-verify` green
