---
name: refactor
description: Refactor ไฟล์, workspace, หรือ codebase ตาม scope — SRP, boundaries, architecture, consistency
argument-hint: "[@files... | srp | workspace | monorepo | codebase | architecture | clean | layered | concerns | structure | shared | orm | skills]"
related:
  - simplify
  - relocation
  - create-plan-in-dot-devin
  - update-references
  - update-agents-md
  - deep-review
  - deep-validate
  - run-verify
  - check-code-structure
  - check-long-files
  - use-subagents
  - use-astgrep
  - follow-review
  - follow-single-of-source
  - follow-code-quality
  - follow-architecture
---

## Goal

Refactor by scope without changing observable behavior — pick one row from `## Scope`, run its steps, finish green

## Scope

> One scope at a time — never dispatch several scopes in parallel

| Argument | Seen When | Run |
|----------|-----------|-----|
| (none) | scope not given | `### 1` hotspot path |
| `@files...`, `srp` | file >250 lines or one unit holds several reasons to change | `### 2` |
| `workspace` | every file of one workspace | `### 3` → `references/workspace-codebase.md` `## 1` |
| `monorepo` | several workspaces, member boundaries, member adoption | `### 3` → `## 2`–`## 4` |
| `codebase` | whole repo pass | `### 3` → `## 5` |
| `architecture`, `clean`, `layered` | wrong layers, boundaries, dependency direction | `### 4` → `/follow-architecture` |
| `concerns` | one file mixes UI + logic + IO + config | `### 5` |
| `structure` | naming, wrong folder, relative imports, barrel gaps | `### 6` |
| `shared` | duplication across packages | `### 7` → `references/extract-shared.md` |
| `orm` | raw SQL, scattered queries, N+1 | `### 8` → `references/data-access.md` |
| `skills` | the target is a skill package | `/refactor-skills` |

Handed off elsewhere: config drift → `/update-config` · hardcoded values → `/no-hard-code` · ignore/suppression comments → `/no-use-ignore` · shorter/clearer file without touching boundaries → `/simplify` · test suite → `/improve tests` + `/update-tests` · file move only → `/relocation` · batch rename/pattern → `/use-astgrep rewrite` · codebase migration with a rule file → `/migration-with-astgrep`

## Execute

> Bulk scope (many files/workspaces/codebase or several asks at once) → run `/create-plan-in-dot-devin` first, then follow the plan; preparatory refactor before adding a feature goes in its own commit

### 1. Detect Scope

> Goal: know the scope and have a baseline before touching anything

1. Run `/follow-agents-md` + `/follow-review` + read `/follow-code-quality` — apply the code quality convention, run the `review-*` domain that matches the context; if a plan file exists, follow it
2. Map the argument → a `## Scope` row; no argument → hotspots: churn `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` × complexity (churn high + complexity high = best return)
3. Collect evidence before choosing the target — `/scan-codebase`, `/check-long-files`, `/check-code-structure`, `/deep-review`; wide scope → spawn `hotspot-scout` (`## Subagents`) for the baseline
4. Quick path (no argument): baseline → take the top-priority target → `### 2` (or the row the target matches) → `### 9` → `### 10` → report; stop when the target is clean, do not expand the scope

### 2. File And SRP Refactor

> Goal: 1 unit (file, module, class, function) = 1 reason to change, file ≤250 lines (canonical SRP splitter — merged from `/refactor-to-srp`)

1. Read the file(s) → `/deep-review` scoped to them (convention: `/follow-code-quality`) → baseline responsibilities, imports, exports, public API + smells (`references/smells.md`); group responsibilities by reason to change — no real violation → stop + report (`/dont-over-engineer`)
2. Pick the action: several responsibilities → Extract Method → Extract Class/Module → Move Method/Field, one content kind per file (`types.ts`/`constants.ts`/`config.ts`/`schema.ts` or the domain name), keep the public API through a barrel re-export so consumers do not change; wrong place → `/relocation`; complex imports/exports → `/deep-review`; naming → `/rename`; dead exports → remove after `/follow-tool-knip`
3. Independent files → spawn `file-worker` in parallel (`## Subagents`); one split = one concern, no behavior mixed in (Two Hats); highly cohesive code that always changes together → keep it together (minimal split)
4. `/update-references` after every split → `/run-verify` + `/check-long-files` vs baseline (every file ≤250) → `/report-before-after` with the responsibility map

### 3. Workspace And Codebase Refactor

> Goal: order and batch a workspace or the whole codebase without breaking dependents

1. Read `references/workspace-codebase.md` — `## 1` one workspace, `## 2` every workspace in a monorepo, `## 3` split/merge/relocate members, `## 4` recommend members, `## 5` whole codebase
2. Always: baseline → foundation before dependents → refactor files with `### 2` → `/update-references` → `/run-verify` → `/git-commit` checkpoint per batch; >3 failing rounds → stop + report

### 4. Architecture Refactor

> Goal: apply the pattern that fits the target — selection convention is `/follow-architecture` (re-split from the old merged entry)

1. Read `/follow-architecture` + `follow-architecture/references/architecture.md`: detect target → select pattern (`packages/`/`crates/` or several unified `apps/*` → Clean; a single app → Layered; argument `clean`/`layered` → that pattern) → prepare → restructure → verify
2. Pattern decided → read its pattern guide here: Clean → `follow-architecture/references/follow-clean-arch.md`, Layered → `follow-architecture/references/follow-layered-arch.md` (canonical file structures + layer tables live in each guide's `## Guide`); stack-specific structures belong to the owner skill (table in `follow-architecture/references/architecture.md`)
3. Mixed concerns found during a move → `### 5` first; one pattern per target; after each move batch → `/update-references` + `/run-check`

### 5. Separate Of Concerns

> Goal: split a mixed file by concern type — `presentation` (UI/routes/handlers), `domain` (pure rules), `data` (persistence/queries), `io` (http/queue/external), `config` (env/settings), `orchestration` (wiring)

1. Identify: classify each block → concern type with `file:line` evidence → concern map (block → type → target location)
2. Plan: map each concern to its layer (`### 4` decides when the layer is unclear); extract leaf-first — pure domain → data/io → orchestration last; list consumers for `/update-references`
3. Extract one concern at a time: move → target file/module → export through the barrel → `/update-references` + verify green before the next concern; callers keep only orchestration
4. Verify: every unit left with a single concern + `/run-check` + tests → `/report-before-after` (old vs new concern map) — one extraction = one concern, no behavior change, public API preserved

### 6. Structure Refactor

> Goal: physical file/folder layout matches the architecture — naming, split, relocate, barrel imports (merged from `/restructure`)

1. Baseline: evidence ด้วย `/check-code-structure` + `/check-long-files` + `/deep-review` → problem table (No./File/Problem/Target/severity); scope กว้าง → `/create-plan-in-dot-devin`; ไม่พบปัญหา → stop + report
2. Naming: `/rename` ทีละไฟล์ตาม convention ของ project + `/update-references` ทันที; ชื่อ generic (`utils.ts`, `helpers.ts`, `misc.ts`) → แยกตาม concern หรือเปลี่ยนเป็นชื่อ domain
3. Split and align: >250 lines/หลาย responsibility → `### 2`; content ประเภทเดียวรวมกัน (`types.ts`/`constants.ts`/`config.ts`/`schema.ts`); folder มีไฟล์เยอะ (>10-15 flat) → group เป็น subfolder ตาม domain/feature (files that change together stay together); map ไฟล์ → layer/domain ก่อนย้าย — ห้าม mix pattern
4. Relocate: `/relocation` dry-run + confirm ก่อนย้ายจริง; ย้ายทีละชุด + `/update-references` + `/run-check`; แดง → rollback
5. Imports: public API ผ่าน barrel `index` เท่านั้น; alias แทน relative ซับซ้อน; imports ตาม convention (external → alias → relative)
6. Validate: `/run-check` + tests + `/deep-validate` (fail → retry max 3 → stop); layout เปลี่ยน → `/update-agents-md`; `/report-before-after` structure + move table

Layer/placement decisions inside the move → `### 4`; SRP inside one unit → `### 2`; `/update-references` after every rename/move

### 7. Extract To Packages Shared

> Goal: one fact one source — code reused across workspace members moves to `packages/shared`

1. Read `references/extract-shared.md`: inventory duplication (≥2 real consumers) → plan by Clean layers, leaf-first → extract the canonical version → rewire consumers → verify the package is a leaf
2. `/use-lib-effective` before creating anything new; never extract for a hypothetical future consumer

### 8. Data Access Refactor

> Goal: data access on one type-safe ORM with a repository boundary, behavior preserved

1. Read `references/data-access.md`: `## ORM Workflow` (select → models/relations → queries → migrations → tests) and `## Repository Pattern` (interfaces, adapters, mappers, `QuerySpec`, `UnitOfWork`)
2. drizzle specifics → `/follow-lib-drizzle`; schema/migration review → `/deep-review` (domain `review-database`); boundary validation → `/follow-tool-data-validation`

### 9. Update References

> Goal: no broken references left

1. Run `/update-references` for relative paths/imports and global references/skills; grep again to prove no old path/name remains
2. Structure/paths changed → `/update-agents-md`; broken references → `/resolve-errors`; docs/config/rules now stale → `/update-project`

### 10. Verify And Report

> Goal: prove the refactor is safe, then summarize

1. Run `/run-verify` (lint, typecheck, test, build) + `/check-code-structure` vs baseline → `/deep-validate` across dimensions; fail → back to the scope step, max 3 rounds
2. Report scope, sub-skills run, changes and status via `/report` → `/report-before-after` when a baseline exists → `/suggest-next-action`

## Subagents

> Goal: independent refactor work that can run in parallel — spawn via `/use-subagents` with the profile inputs; the parent always rewires consumers, checkpoints commits and runs the combined verify

### hotspot-scout — read-only baseline collector (use when the parent wants evidence before choosing targets)

- Inputs: `root` (directory), `focus` (`long-files`/`srp`/`naming`/`all`, default `all`), `threshold` (line count for a long file, default 250)
- Tools: `exec` — git churn + available CLI checks; `read`/`grep`/`find_file_by_name` — line counts, symbols/exports, patterns
- Execute: churn from `git log --format=format: --name-only | sort | uniq -c | sort -rn | head -20` → files over `threshold` → symbols/exports, mixed concerns, relative imports 3+ levels → target list scored churn × severity
- Output: `| No. | File | Churn | Lines | Issues | Priority |` with reasons; totals scanned, targets found, recommended first target
- Constraints: model `sonnet`; only `read`/`exec`/`grep`/`find_file_by_name` — deny `write`/`edit`; report real evidence only; stay inside `root`

### file-worker — refactors one file/scope per instructions and returns a diff summary (spawn in parallel for independent files)

- Inputs: `files` (file/glob), `instructions` (SRP split, naming, import alias, extract function), `conventions` (style/patterns to keep), `verify-cmd` (e.g. `tsc --noEmit <file>`)
- Tools: `read`/`write`/`edit` in scope; `exec` for `verify-cmd`, formatter/linter; `grep` to check importers before changing exports
- Execute: read the file + list its importers → apply the transformations one at a time (one file per verify round) → run `verify-cmd`; fail → revert that scope and report
- Output: `| No. | File | Change | Verified | Notes |` (`ok`/`failed`/`skipped` + error), files changed, exports changed (parent runs `/update-references`), blockers
- Constraints: model `sonnet`; preserve behavior — never mix feature/fix; touch only the given `files`; never commit — the parent checkpoints

## Rules

### 1. Preserve Behavior

- Refactor changes structure only — never observable behavior; a bug found mid-refactor gets its own fix commit first (Two Hats)
- The public API and what consumers see must stay identical — check with `/deep-review` when touching an exported surface

### 2. Safety Net First

- Never refactor uncovered code — no tests → `/update-tests` writes characterization tests locking current behavior, green before and after
- Suspect a weak suite → measure it with `/deep-test mutation` before trusting it

### 3. Small Steps

- One technique at a time (extract, rename, move) → verify green → next; never bundle several transformations into one step
- Keep the build green between steps; `/git-commit` checkpoint every green batch so any step can be reverted

### 4. Minimal Change

- `/dont-over-engineer`; code that may reinvent an existing dep → `/use-lib-effective`, new dep choice → `/follow-my-techstack`; writing new code or seeing duplicates → `/follow-reusable` (reuse > extend > extract > create, rule of three)
- No abstraction without a real consumer; dead code removed only after `/follow-tool-knip`; fix the cause not the symptom (`references/smells.md`) — shotgun surgery → one canonical source (`/follow-single-of-source`)
- Never tune performance in a refactor pass — optimization changes timing; note it for a separate commit

### 5. SRP And Consistency

- 1 unit = 1 reason to change; 1 file = 1 concern ≤250 lines (barrel/index excepted — `/check-long-files`); 1 folder = 1 domain
- A workspace member's public API is its barrel `index`; internal code stays private, no deep imports across members
- Naming, patterns and structure consistent across the whole scope; imports use the project path alias (e.g. `~/*`) — never `../../../`

### 6. Simple Design Order

- Judge the result in this order: it works (tests green) → it communicates intent (naming, no misleading comments) → no duplication → minimal elements; never optimize the later criteria at the cost of an earlier one
- Write for the next reader: a test name states the behavior, a comment only explains what the code cannot say

### 7. Context Aware

- Never guess the scope — unclear → `/ask-me`; one sub-skill at a time in priority order
- Read this `## Rules` block before writing new code too — new code should already be refactor-clean (enforced by global rules)

### 8. Safety And Verification

- Move/delete/rename → `/update-references`; destructive actions → dry run + user confirmation; never force push
- Every refactor ends at `/run-verify` green with no broken references

### 9. Smell → Technique

- Detect smells with evidence (`file:line`), then apply the matching technique from `references/smells.md`; architecture-level smells → `/deep-review` instead of a file refactor

## Expected Outcome

- The chosen scope is finished and provable: files/members sized right, one responsibility each, naming/patterns/structure consistent
- imports/exports clean (alias instead of deep relative paths, barrels as the public API), architecture pattern applied when requested
- No broken references; lint/typecheck/test/build green; before/after report delivered
