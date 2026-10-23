---
name: use-lib-effective
description: Fully leverage existing dependencies and the preferred stack instead of reinventing
argument-hint: "[need-or-feature]"
related:
  - follow-agents-md
  - follow-my-techstack
  - deep-review
  - review-use-lib-effective
  - deep-research
  - follow-best-practice
  - learn-from-web
  - check-types-definition
  - follow-single-of-source
  - refactor
  - implement-to-production
  - simplify
  - ask-me

---

## Goal

Reduce redundancy and reinvention — before writing new code or adding a dependency, fully leverage what already exists in the manifest and the preferred stack

## Scope

Use when a task is about to: write a new utility/helper, implement a feature a lib likely already provides, add a dependency, or refactor code that an existing lib could replace — main callers: `/refactor`, `/implement-to-production`, general implementation work

- Follow the project's declared stack and dependency rules in `AGENTS.md` → `/follow-agents-md`
- Pick libs per the preferred stack → `/follow-my-techstack`
- Audit deps (outdated, unused, vulnerabilities) → `/deep-review`; audit how effectively the scope uses its libraries → `/review-use-lib-effective`
- Reuse existing internal code before writing new code (DRY) → `### 5` (merged from `/follow-reusable`)

## Execute

### 1. Inventory What Exists

> Goal: Know what the project can already use before considering writing it yourself

1. Read the project's conventions first — `AGENTS.md`/`README.md` dependency policy, internal packages, allowed/forbidden libs → `/follow-agents-md` when `AGENTS.md` exists
2. Read the package manifest (`package.json` + catalog/workspaces, `Cargo.toml`, `go.mod`) — review both installed dependencies and catalog entries
3. Search the codebase for whether that dep is already used and how far its capability is exercised (e.g., `effect` is imported but `Schedule` and `Layer` are unused)
4. Check the monorepo's internal packages/utilities that solve the same problem (`@booking/shared`, `src/utils`, `packages/*`)

### 2. Match Need To Existing Capability

> Goal: Always answer "can what we already have do this?" first

1. Translate the need into a category (e.g., retry → `Schedule` in `effect`; validation → `zod`; dates → `date-fns`)
2. Study the capability of the existing dep: run `/deep-research` for the lib's setup guide, gaps/known limitations and best practices, `/learn-from-web`, DeepWiki (the lib's repo) or context7 (API reference), and run `/check-types-definition` to read the `d.ts` in `node_modules` and learn the ready-to-use API — check the changelog for new features not yet used
3. If the existing dep can do it → use that dep; never hand-roll it and never add a new dep
4. If the dep covers part of it → use the dep as the base and write only the missing part as a thin wrapper
5. If several deps can do it → pick per `/follow-my-techstack`

### 3. Choose From Preferred Stack

> Goal: When a new dep is needed, pick one that matches the canonical stack

1. Run `/follow-my-techstack` to get the category's Default pick
2. If the pick has a `follow-lib-*` / `follow-tool-*` / `follow-service-*` skill → invoke that skill to use the lib correctly (never guess the API)
3. If it is not in the catalog and has no skill → run `/deep-research` to compare candidates before deciding

### 4. Apply Effectively

> Goal: Use the chosen lib correctly and cover every capability needed

1. Read the docs via context7, `/learn-from-web` or `/check-types-definition` when unsure about the API surface
2. Use the lib's features fully (e.g., `Effect.retry`+`Schedule` instead of a handwritten retry loop; connection pooling, tree-shaking, lazy loading, feature flags)
3. Delete code that reinvents what the lib already does — when refactoring → add it as a finding in the report
4. If you find duplicate deps (two doing the same thing) → flag it in the report for the user to decide; do not delete them yourself
5. Effective usage patterns: HTTP client → pooling/retry/cache; ORM → query optimization/connection mgmt; UI → tree-shaking/lazy loading; testing → parallel/isolation; dynamic imports for code splitting
6. Record complex usage patterns as examples/conventions when needed

### 5. Reuse Internal Code (merged from `/follow-reusable`)

> Goal: before writing a new function/component/hook/util, find and reuse the implementation already in the codebase (DRY)

1. Search before write — keyword/symbol via `rg` or `/code-search`; structural search via `/search-with-astgrep` when names differ but logic is the same; survey shared locations (`utils/`, `shared/`, `common/`, `lib/`, `hooks/`, and internal packages `packages/*`, `@org/*` in a monorepo)
2. Detect duplication — run `jscpd` (`/follow-tool-jscpd`) in scope; classify candidates: identical / near-duplicate / same pattern different domain
3. Choose reuse strategy — strict order `reuse > extend > extract > create`:
   - Direct reuse: import/compose the existing implementation when the signature matches the use case
   - Extend: add a parameter/option or compose so the existing unit covers the new use case — never fork/copy-and-modify
   - Extract: same logic in ≥3 places (rule of three; 2 duplicates are still tolerable) → extract to one canonical location per `/follow-single-of-source`
   - Create new: only when nothing existing fits, or forcing reuse couples the wrong domain — must be justified in the report
4. Apply and wire — import from the canonical path using the codebase's existing import style; replace duplicated blocks at every call site found in step 2; run `/update-references` when the implementation moves; a pattern reusable across contexts → record via `/generalize`
5. Verify and report — `/run-verify` (lint, typecheck, tests green as before; behavior preserved); report every reuse decision (reused `<symbol>`, extracted `<path>`, dedup findings) with file:line

## Rules

### 1. Existing Installed First

- Priority order: built-in functions > installed deps > monorepo shared packages > catalog defaults > new deps from research
- Never write helpers that duplicate the capability of an existing dep (e.g., sleep, retry, deepEqual, date formatting)
- Choose actively maintained libs; consider bundle size for frontend; wrap an external lib with an internal abstraction when needed

### 2. Skill Before Guess

- Every time you use a lib that has a `follow-lib-*`/`follow-tool-*`/`follow-service-*` skill → invoke that skill
- No skill → official docs only; never guess the API from memory

### 3. Evidence Of Reinvention

- When a refactor finds code that reinvents a lib → note it in the report with file:line and the lib that can replace it
- When adding a new dep → state why the existing ones were insufficient

### 4. No New Dep Without Check

- Before `add`ing any dep → complete steps 1-3 first
- Respect the dependency policy the project declares in `AGENTS.md` → `/follow-agents-md`
- A new version must have been published for ≥7 days, and check peer constraints
- Use /deep-research dependencies if needed
- Use /follow-best-practice if needed
- Use /simplify guard if needed
- Use /ask-me if needed

### 5. Internal Reuse Discipline

- `reuse > extend > extract > create` — create new is the last resort with a justification in the report
- Reuse must stay in the same domain — never couple code across domains just because the shapes look alike (coincidental duplication)
- Preserve behavior — consolidation is a refactor; no observable behavior change; no over-abstracting without real consumers (`/simplify guard`)


## Expected Outcome

- No code duplicating the capability of an installed dep
- No new code duplicating an existing internal implementation — every reuse decision (reuse/extend/extract/create) is justified in the report
- Every new dep is justified by the catalog or research
- Libs are used to their appropriate capability, not just imported while you keep hand-rolling code
- The report lists reinvention findings and dedup opportunities
