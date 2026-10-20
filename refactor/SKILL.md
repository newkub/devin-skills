---
name: refactor
description: Refactor files, workspaces, or a codebase — verify before, plan, restructure, verify after
argument-hint: "[@files... | srp | concerns | structure | workspace | monorepo | codebase | shared | orm | architecture | clean | layered | skills]"
related:
  - run-verify
  - create-plan-in-dot-devin
  - use-lib-effective
  - deep-review-codebase
  - update-tests
  - update-references
  - run-check
  - use-subagents
  - follow-tool-knip
  - dont-over-engineer
  - follow-architecture
  - deep-validate
  - refactor-skills
  - simplify
  - use-astgrep
---

## Goal

Restructure without changing observable behavior — green before, green after, proven by `/report-before-after` vs the baseline

## Scope

> One scope at a time; several match → priority `skills` > `architecture` > `concerns`/`srp` > `structure` (fix the boundary before the layout)

| Argument | Seen When | Run |
|----------|-----------|-----|
| (none), `@files...`, `srp` | file >250 lines or one unit holds several reasons to change | `### 3` file/SRP |
| `concerns` | one file mixes UI + logic + IO + config | `### 3` concerns |
| `structure` | naming, wrong folder, deep relative imports, barrel gaps | `### 3` structure |
| `workspace`, `monorepo` (batch work), `codebase` | many files, member boundaries, whole-repo pass | `### 2` plan → `### 3` batches |
| `shared` | duplication across packages | `### 3` shared |
| `orm` | raw SQL, scattered queries, N+1 | `### 3` orm |
| `architecture`, `clean`, `layered`, `monorepo` (layout) | wrong layers, boundaries, dependency direction, repo-level layout | `### 3` architecture → `/follow-architecture` |
| `skills` | the target is a skill package | `/refactor-skills` |

Handed off elsewhere: config drift → `/update-config` · hardcoded values → `/no-hard-code` · ignore comments → `/no-use-ignore` · shorter/clearer file without touching boundaries → `/simplify` · event-driven semantics → `/improve events` (messaging/ordering/idempotency; queue ops → `/improve queues`, transport → `/improve realtime`) · test suite → `/update-tests` · file move only → `/relocation` · batch rename/pattern → `/use-astgrep rewrite` · performance → `/deep-optimize` (never in a refactor pass)

## Execute

### 1. Verify Before Refactor

> Goal: start from green — never refactor on top of a broken or unmeasured baseline

1. Run `/run-verify` (lint, typecheck, test, build) FIRST — red → fix with `/resolve-errors` until green before touching anything
2. Safety net: target's public behavior has no tests → `/update-tests` writes characterization tests locking current behavior
3. `/follow-agents-md` for project conventions; record the baseline (`/check-long-files` + `/deep-review-codebase` metrics) for the after-comparison

### 2. Plan

> Goal: know what moves and in what order before moving it

1. `/create-plan-in-dot-devin` for any bulk scope (workspace/monorepo/codebase or several asks at once); a preparatory refactor before adding a feature goes in its own commit
2. While planning run `/use-lib-effective` — reuse existing deps and patterns before writing anything new; duplication candidates via `/follow-tool-knip` + `/follow-tool-jscpd`
3. Architecture decision needed → plan it through `/follow-architecture` (the architecture SSOT — it owns pattern selection, Clean/Layered guides, monorepo layout, workspace file structures); still unclear → `/ask-me`

### 3. Refactor

> Goal: one unit = 1 reason to change; one technique at a time → `/run-check` green → `/git-commit` checkpoint; red → revert that step only

- `file/SRP` — group responsibilities by reason to change → Extract Method → Extract Class/Module → Move Method/Field; one content kind per file (`types.ts`/`constants.ts`/`schema.ts` or the domain name); keep the public API through a barrel so consumers don't change; no real violation → stop (`/dont-over-engineer`)
- `concerns` — classify each block with `file:line` evidence (presentation/domain/data/io/config/orchestration) → extract leaf-first, one concern at a time, callers keep only orchestration
- `structure` — naming via `/rename`; >250-line or multi-responsibility files → file/SRP; folder >10–15 flat files → group by domain; relocate via `/relocation` (dry-run + confirm); public API through the barrel, alias imports instead of `../../../`
- `workspace/monorepo/codebase` — order foundation → dependents → applications; work one workspace/batch at a time with verify + checkpoint after each; independent files → parallel via `/use-subagents` (read in parallel, edit sequentially, no overlapping scope); nothing skipped silently — report anything not done with the reason
- `shared` — extract only with ≥2 real consumers → `packages/shared`, layer-correct leaf-first; rewire consumers one at a time via `/update-references`; verify the package is a leaf (`/follow-tool-madge`); coincidental similarity stays duplicated
- `orm` — move data access onto the project's one type-safe ORM behind a repository boundary (interfaces use business types, never import the ORM); drizzle → `/follow-lib-drizzle`; boundary validation → `/follow-tool-data-validation`
- `architecture` — do not restructure layers here; run `/follow-architecture` and return for the file-level passes it exposes

### 4. Update References

> Goal: no broken path or name remains after the restructure

1. Run `/update-references` for paths/imports and global references; grep again to prove no old path/name remains
2. Layout changed → `/update-agents-md`; broken references → `/resolve-errors`

### 5. Verify After

> Goal: prove behavior is unchanged vs the `### 1` baseline

1. `/run-verify` + `/deep-validate` vs baseline; fail → back to `### 3`, max 3 rounds → stop + report
2. Persist what was learned: a structural rule to keep → `/update-astgrep-rules`; a project convention → `/update-devin-project-rules` (skip with reason when nothing is reusable)
3. Report scope, changes, and status via `/report` → `/report-before-after` vs the `### 1` baseline → `/suggest-next-action`

## Smells → Techniques

> Detect with `file:line` evidence only; fix the cause, never mask the symptom; architecture-level smells → `/deep-review-codebase` + `/follow-architecture` instead of a file refactor

| Smell | Technique |
|-------|-----------|
| Long Method | Extract Method, Replace Loop with Pipeline |
| Large/God Class, Divergent Change | Extract Class/Module per reason to change |
| Duplicated Code | Extract Function/Module (rule of three) |
| Shotgun Surgery | Move to one owner — canonical source (`/follow-single-of-source`) |
| Feature Envy / Message Chain | Move Method/Field, Hide Delegate, Introduce Facade |
| Long Parameter List / Data Clumps | Introduce Parameter Object |
| Primitive Obsession / Data Class / Anemic Model | Replace with domain type, move behavior onto it |
| Switch Sprawl | Replace Conditional with Polymorphism / dispatch table |
| Speculative Generality / Lazy Class / Middle Man | Inline / collapse, call the real collaborator |
| Dead Code | Remove after `/follow-tool-knip` confirms no consumer |

## Rules

- Preserve Behavior — structure only, never observable behavior; public API stays identical (Two Hats: a bug found mid-refactor gets its own fix commit first)
- Safety Net First — never refactor uncovered code (enforced at `### 1`); Small Steps — one technique per step, checkpoint every green batch
- Minimal Change — `/dont-over-engineer`; reuse > extend > extract > create (`/use-lib-effective` `### 5` internal reuse + dep leverage); no abstraction without a real consumer; never tune performance in a refactor pass
- SRP And Consistency — 1 unit = 1 reason to change, 1 file = 1 concern ≤250 lines, 1 folder = 1 domain; naming/patterns/structure consistent across the scope; member public API is its barrel
- Simple Design Order — works → communicates intent → no duplication → minimal elements, in that order
- Context Aware — never guess the scope: unclear → `/ask-me`; destructive actions → dry run + confirm; every refactor ends green at `### 5`

## Expected Outcome

- The chosen scope is finished and provable: files/members sized right, one responsibility each, naming/patterns/structure consistent, imports/exports clean
- Architecture (when requested) applied through `/follow-architecture` — pattern real in code, no circular deps
- No broken references; `/run-verify` + `/deep-validate` green vs baseline; recurring smells persisted as rules; before/after report delivered
