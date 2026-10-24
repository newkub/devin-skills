---
name: migrate
description: Move a system to a new technology — plan, cut over, verify, roll back
argument-hint: "[from->to | target-version | system]"
related:
  - use-astgrep
  - port
  - compat
  - convert
  - refactor
  - plan
  - deep-research
  - code-search
  - report-before-after
  - run-check
  - run-verify
  - report
  - ship
---

## Goal

Move a system, its data, or its stack to a different technology safely — with a researched path, staged batches, a verification gate per batch, and a rollback that actually works

## Scope

Use when the target is a different system: framework swap (Nuxt to SvelteKit), major-version upgrade with breaking changes, runtime or database replacement, or an API/deprecation sweep. The result is the system living in the new technology, so architecture, dependencies, and data may all change.

Not this skill when only the platform/environment changes and the architecture stays (Windows to Linux, Node to Bun) — use `/port`; when only a format or syntax changes — use `/convert`; when only structure changes inside the same stack — use `/refactor`; when only a version bumps with no breaking change — use `/update-version-to-latest`.

| Change | Goal | Architecture | Skill |
|--------|------|--------------|-------|
| Migrate | system lives in new tech | may change | `/migrate` |
| Port | same software on another platform | preserved | `/port` |
| Convert | same behaviour, different format/syntax | preserved | `/convert` |
| Refactor | same behaviour, better structure | reshaped | `/refactor` |

Before committing to a migration, run `/compat` — the read-only verdict tells you whether the target even supports your runtime, dependencies, and data path.

## Execute

### 1. Classify And Confirm The Move
> Goal: the correct skill owns the work, and the destination is explicit

1. State from, to, and why in one sentence; if the destination is vague → `/ask-me`
2. Check the table in `## Scope` — the change is not a migration → route to `/port`, `/convert`, `/refactor`, or `/update-version-to-latest` and stop
3. Run `/compat` for the target; verdict `Incompatible` or `Unknown` → stop and report the blockers before touching code
4. Read `references/migration-playbook.md` and pick the matching migration type

### 2. Establish Baseline And Safety Net
> Goal: the pre-migration state is measurable and revertible

1. `git status` clean or commit/stash the work; create a working branch per `/follow-git-workflows`
2. Record the baseline: `/run-check` (lint, typecheck) and `/run-verify` (tests, build), plus app smoke
3. Capture the before-state with `/report-before-after` — commands, versions, counts, timings
4. Write the rollback path: revert commit, old branch, and for data migration a tested restore from backup
5. Baseline red → fix or document as accepted before migrating; never migrate on top of unknown failures

### 3. Research The Official Migration Path
> Goal: follow the vendor's documented route instead of inventing one

1. `/deep-research` the official migration guide, changelog, and codemod for this exact from-to pair
2. Record: supported upgrade order (stepping-stone versions), removed/renamed APIs, config changes, breaking defaults, and the recommended codemod
3. Prefer the official codemod over hand-written rules; use ast-grep only for gaps the codemod leaves
4. Verify the codemod/rules still target the release you are moving to — never a version pinned from memory

### 4. Plan In Stages
> Goal: an ordered, independently verifiable plan

1. Order the stages: config and tooling → dependencies → code → data/schema → cutover
2. `/plan` and present the stage table in chat: No./Stage/Change/Verify/Reversible — nothing is applied before the user agrees
3. Each stage must leave the app runnable or explicitly gated; no stage depends on a later stage to compile
4. Identify the irreversible steps (data rewrite, dropped fallback, deleted old service) and put them last

### 5. Inventory The Call Sites
> Goal: know every place that must change

1. `/code-search` with ast-grep for removed/renamed symbols, imports, and deprecated patterns; `/code-search` with ripgrep for config keys, env vars, and strings
2. Split hits into: mechanical rewrite (rule-able), semantic rewrite (needs thought), and runtime/behaviour difference (needs a test)
3. List semantic and behaviour hits explicitly — these are the ones that break silently
4. Exclude generated and vendored files unless the migration genuinely requires them

### 6. Author Rules For The Mechanical Set
> Goal: the repetitive rewrites are automated and reviewable

1. Follow `/use-astgrep` for CLI install and rule semantics — this skill owns the migration workflow, not the rule mechanics
2. Create one rule per concern in `ast-grep-rules/<migration>-<concern>.yml` with `language`, `rule.id`, `pattern`/`regex`, and `fix`/`rewrite`
3. Use `utils.isDefinition`/`isExpression`/`isStatement` to constrain scope; prefer `pattern` over `regex`
4. Test each rule on one representative file before scanning the tree

### 7. Dry Run And Review Matches
> Goal: every auto-fix is intended

1. Scan without `--apply`; record match count, files, and a sample of diffs
2. Review for false positives and missed imports; tighten the rule rather than patching after apply
3. A rule with zero matches is either dead or wrong — confirm which before deleting it
4. Show the match summary; proceed only after it looks correct

### 8. Apply And Verify Per Batch
> Goal: every batch compiles, lints, and tests before the next one

1. Commit the pre-apply state, then scan with `--apply` for one rule at a time
2. Review `git diff --stat` and the actual diff; revert false positives with `git checkout -- <file>` and fix the rule
3. Run `/run-check` and `/run-verify` after each batch — a red batch is reverted or fixed, never carried forward
4. Commit each green batch with a message naming the stage

### 9. Migrate Data And Configuration
> Goal: state moves with the code, or is migrated on its own schedule

1. Back up before any write to a data store; verify the restore path, not just the dump
2. Order schema/data migration so old and new code can run during the overlap window when a live cutover is required
3. Two-phase when possible: dual-write or backfill → verify parity → switch reads → remove the old path later
4. Convert config, env vars, and secrets to the new names; scan for leftovers with ripgrep; never commit secrets

### 10. Validate, Cut Over, And Report
> Goal: the new system is running, the old one is gone or clearly dormant

1. Full `/run-check` + `/run-verify` + a real app smoke on the new stack
2. Scan for leftovers: old imports, deprecated APIs, old config keys, dead shims — each hit is either fixed or justified
3. Cut over per the researched guide; keep the rollback reachable until evidence says the new system holds
4. After the agreed observation window, remove the fallback, old branch, and temporary shims
5. `/report-before-after` for the delta and `/report` for the summary, then `/ship`

## Rules

1. Classify Before Acting — the target is a different system, otherwise route to `/port`, `/convert`, `/refactor`, or `/update-version-to-latest`; a mixed request is split, never blended
2. Evidence And Official Path — every API removal, config change, and upgrade order comes from the official migration guide or changelog with a URL; never invent a stepping-stone version or a codemod flag
3. Safety Gate — clean baseline, branch, rollback command, and data backup exist before the first edit; irreversible steps run last and only after the user confirms
4. Batch Discipline — one rule or one stage per apply, verified green before the next; never a single unreviewed whole-tree rewrite
5. Behaviour Over Compilation — a compiling migration is not a correct one; semantic hits and runtime differences need a test or a smoke that actually exercises them
6. Single Source For Mechanics — rule authoring and CLI usage belong to `/use-astgrep`; this skill defines the migration sequence only
7. No Unverified Exit — no claim of completion without check, verify, and leftover scan output; an unverified cutover is reported as unverified

## Expected Outcome

- Classification recorded, `/compat` verdict cited, official migration guide linked
- Stages planned in chat and applied one green batch at a time
- Mechanical rewrites covered by tested ast-grep rules; semantic changes called out individually
- Data and configuration migrated with a tested restore path
- Baseline and after-state captured, leftover scan clean or justified, rollback documented
- `/report` table (No. first column) listing stages, rules, files changed, and verification status
