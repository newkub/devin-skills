---
name: refactor
description: Refactor files, workspaces, or a codebase — verify before, plan, restructure, verify after
argument-hint: "[@files... | srp | concerns | structure | workspace | monorepo | codebase | shared | orm | architecture | clean | layered | skills]"
related:
  - run-verify
  - run-check
  - deep-validate
  - report-before-after
  - check-long-files
  - deep-review
  - update-tests
  - create-plan-in-dot-agents
  - use-lib-effective
  - follow-best-practice
  - follow-architecture
  - update-agents-skills-global
  - update-references
  - use-subagents
  - simplify
---

## Goal

Restructure without changing observable behavior — every target carries `file:line` evidence, green before and green after, with the `### 1` baseline re-measured at `### 5`

## Scope

> One scope at a time; several match → priority `skills` > `architecture` > `concerns`/`srp` > `structure` (fix the boundary before the layout). A bare `monorepo` matches two rows (batch work vs layout) — run `/ask-me` to pick before starting

| Argument | Seen When | Run |
|----------|-----------|-----|
| (none), `@files...`, `srp` | file >250 lines, one unit holds several reasons to change, or new code that must start SRP-shaped | `### 3` file/SRP |
| `concerns` | one file mixes UI + logic + IO + config | `### 3` concerns |
| `structure` | naming, wrong folder, deep relative imports, barrel gaps | `### 3` structure |
| `workspace`, `monorepo` (batch work), `codebase` | many files, member boundaries, whole-repo pass | `### 2` plan → `### 3` batches |
| `shared` | duplication across packages | `### 3` shared |
| `orm` | raw SQL, scattered queries, N+1 | `### 3` orm |
| `architecture`, `clean`, `layered`, `monorepo` (layout) | wrong layers, boundaries, dependency direction, repo-level layout | `### 3` architecture → `/follow-architecture` |
| `skills` | the target is a skill package | `/update-agents-skills-global refactor` |

Out of scope here — handed off; every `/skill` mention below is either the `related` pipeline, `/report` at `### 5`, or this table:

| Out of scope | Owner |
|--------------|-------|
| config drift | `/update-config` |
| hardcoded secret, URL, or magic string | `/no-hard-code` |
| ignore comment to remove | `/no-use-ignore` |
| shorter/clearer file, boundaries untouched | `/simplify` |
| event semantics, queue operations, transport | `/improve events`, `/improve queues`, `/improve realtime` |
| test suite work | `/update-tests` |
| pure file move, pure naming, batch pattern rewrite | `/relocation`, `/rename`, `/use-astgrep rewrite` |
| performance tuning | `/deep-optimize` |
| circular dependency graph | `/follow-tool-madge` |
| ORM setup, payload/schema validation boundary | `/follow-lib-drizzle`, `/follow-tool-data-validation` |
| `AGENTS.md`, ast-grep rules, `.devin/rules` persistence | `/update-agents-md`, `/update-astgrep-rules`, `/update-dot-agents-project` |
| error recovery, user decision, single-source convention | `/resolve-errors`, `/ask-me`, `/follow-single-of-source` |

## Execute

### 1. Baseline And Evidence
> Goal: start from green and name the targets with `file:line` — never refactor on a broken or unmeasured baseline, never on a hunch

1. Read the project `AGENTS.md` conventions (line cap, import alias, folder layout) before judging any structure; confirm a clean tree (`git status`) — pre-existing changes → record them first, so every diff below shows only this refactor
2. Run `/run-verify` (lint, typecheck, test, build) FIRST — red → resolve to green before touching anything
3. Collect candidates into one table `file:line | smell | technique | scope`: `/check-long-files` (size), `/deep-review` dimension `code-quality` (SRP, duplication, dead exports, complexity — it owns the detectors) and dimension `architecture` for a repo/package scope (its `N/A condition` is a single-file scope)
4. Read the table before planning: empty table and no new code → nothing to refactor, report and stop; new code only → jump to `### 3` file/SRP with no baseline
5. Safety net: target's public behavior has no tests → run `/update-tests` to lock current behavior with characterization tests
6. Record the baseline for the after-comparison: `git rev-parse HEAD` (the sha `### 5` diffs against), `/check-long-files` line counts, `/deep-review` finding count, suite and lint status

### 2. Plan
> Goal: know what moves and in what order before moving it

1. Bulk scope (workspace/monorepo/codebase or several asks at once) → run `/create-plan-in-dot-agents` with the `### 1` table; a preparatory refactor before a feature goes in its own commit
2. Order the work before moving it: foundation → dependents within a chain, smallest reversible unit first, each item ending green on its own
3. Not bulk but irreversible or wide-reaching (moves, splits, renames across call sites) → run `/report-before-after` for the plan and expected before→after, which confirms before any edit
4. While planning run `/use-lib-effective` to reuse existing deps and patterns before writing anything new — the `### 1` table is the evidence, plan from it instead of re-scanning
5. Before designing the target shape run `/follow-best-practice` for the stack the target lives in — the manifest's owner skills' `best-practices/` define the layout, API style, and error handling a refactored module must land on; cite the practice each structural decision follows
6. Architecture decision needed → plan it through `/follow-architecture` (the architecture SSOT — pattern selection, Clean/Layered guides, monorepo layout, workspace file structures); still unclear → run `/ask-me`

### 3. Refactor
> Goal: one unit = 1 reason to change; one technique per step → `/run-check` green → checkpoint commit; red → revert that step only

Technique matrix → `## Guide`; take the technique from the `### 1` table before touching code:

1. `file/SRP` — group responsibilities by reason to change → Extract Method → Extract Class/Module → Move Method/Field; one content kind per file (`types.ts`/`constants.ts`/`schema.ts` or the domain name); keep the public API through a barrel so consumers don't change; new or just-written code (global rules `## 1` sends every create/update here) → judge the shape directly (1 reason to change, ≤250 lines, one content kind) with no baseline table; no real violation → stop (`/simplify guard`)
2. `concerns` — classify each block with `file:line` evidence (presentation/domain/data/io/config/orchestration) → extract leaf-first, one concern at a time, callers keep only orchestration
3. `structure` — naming via `/rename`; >250-line or multi-responsibility files → item 1; folder >10–15 flat files → group by domain; relocate via `/relocation` (dry-run + confirm); public API through the barrel, alias imports instead of `../../../`
4. `workspace/monorepo/codebase` — order foundation → dependents → applications; work one workspace/batch at a time with verify + checkpoint after each; independent files → parallel via `/use-subagents` (read in parallel, edit sequentially, no overlapping scope); nothing skipped silently — report anything not done with the reason
5. `shared` — extract only with ≥2 real consumers → the project's shared package or folder (`packages/shared`, `src/shared`), layer-correct leaf-first; rewire consumers one at a time via `/update-references`; verify the package is a leaf (`/follow-tool-madge`); coincidental similarity stays duplicated
6. `orm` — move data access onto the project's one type-safe ORM behind a repository boundary (interfaces use business types, never import the ORM); drizzle → `/follow-lib-drizzle`; boundary validation → `/follow-tool-data-validation`
7. `architecture` — do not restructure layers here; run `/follow-architecture` and return for the file-level passes it exposes

### 4. Update References
> Goal: no broken path or name remains after the restructure

1. Run `/update-references` for paths/imports and global references, then prove the result: `rg "<old-path>|<old-name>"` returns no hit
2. Layout changed → run `/update-agents-md`; a broken reference → run `/resolve-errors`

### 5. Verify After
> Goal: prove behavior is unchanged vs the `### 1` baseline

1. Run `/run-verify` against the `### 1` baseline — always; add `/deep-validate` when the scope is bulk (`workspace`/`monorepo`/`codebase`) or `architecture`; red → back to `### 3`, max 3 rounds → stop and report the remaining gap
2. Prove the public surface did not move: `git diff <baseline-sha>` on every barrel/`index` in the change set, plus any new one from `git status --short` — an added, removed, or re-signatured export is a behavior change, not a refactor
3. Persist what was learned: a structural rule to keep → run `/update-astgrep-rules`; a project convention → run `/update-dot-agents-project`; nothing reusable → say so and skip
4. Run `/report` on scope, changes and status with the before→after table against the `### 1` baseline — its `### 4. Finalize` already routes the next action, so the next-action call is never duplicated

## Guide

> Smell → technique matrix. Detect with `file:line` evidence only; fix the cause, never mask the symptom; architecture-level smells → `/deep-review` + `/follow-architecture` instead of a file refactor

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
| Refused Bequest | Replace Inheritance with Composition |
| Temporal Coupling / Hidden Sequence | Combine into one unit, or make the order explicit at a single entry point |
| Comment Explains Bad Code | Extract Method / Rename so the comment becomes unnecessary |
| Dead Code | Remove after the `code-quality` dimension confirms no consumer |

## Rules

- Evidence Before Structure — every target enters the work from the `### 1` table with `file:line`; a hunch is not a target, and an empty table ends the task
- Preserve Behavior — structure only, never observable behavior; public API stays identical (proven at `### 5`; Two Hats: a bug found mid-refactor gets its own fix commit first)
- Safety Net First — never refactor uncovered code (enforced at `### 1`); Small Steps — one technique per step, checkpoint every green batch
- Minimal Change — `/simplify guard`; reuse > extend > extract > create (`/use-lib-effective` `### 5` internal reuse + dep leverage); no abstraction without a real consumer; no new dependency; never tune performance in a refactor pass
- SRP And Consistency — 1 unit = 1 reason to change, 1 file = 1 concern ≤250 lines, 1 folder = 1 domain; naming/patterns/structure consistent across the scope; member public API is its barrel
- Best-Practice Shaped — the target shape comes from `/follow-best-practice` for the libs/framework in the change set (manifest owner skills' `best-practices/`), never from a personal preference; an invented pattern mid-refactor is a finding, not a refactor
- Simple Design Order — works → communicates intent → no duplication → minimal elements, in that order
- Context Aware — never guess the scope: unclear → `/ask-me`; destructive actions → dry run + confirm; every refactor ends green at `### 5`
- Formatting — never use `**` bold; backticks for emphasis and identifiers, headings for structure

## Expected Outcome

- Every target traced to `file:line` evidence and closed: files/members sized right, one responsibility each, naming/patterns/structure consistent, imports/exports clean; code that global rules route here already starts that shape
- Public surface identical — no barrel or index in the change set gains, loses, or re-signatures an export
- Architecture (when requested) applied through `/follow-architecture` — pattern real in code, no circular deps; resulting shape matches the stack's `best-practices/` (via `/follow-best-practice`), every structural decision citing the practice it follows
- No broken references; `/run-verify` green vs baseline (`/deep-validate` too for bulk or architecture scope); recurring smells persisted as rules; before/after report delivered
