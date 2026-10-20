---
name: learn-from-references-and-improve-skills
description: Learn from references and update skills to match — use /improve coverage to fill gaps
argument-hint: "[refs-source] [target-skill(s)]"
related:
  - learn-from-web
  - learn-from-codebase
  - learn-from-cli
  - check-types-definition
  - improve
  - update-devin-global-skills
  - check-reference
  - deep-validate
  - update-references
  - report
---

## Goal

Learn from reference sources (official docs, URLs, local files, codebase, CLI, type declarations), then sync that knowledge into the target skills — fix stale claims, fill in what is missing, update versions — until the skill matches the source of truth

## Scope

Use when there is new/newer reference material (e.g., docs that were just updated, release notes, API reference, a codebase that changed) and the relevant skills need to catch up — **it differs from the other `learn-from-*` skills in that this one "writes back into the skills"**, not just extracting knowledge; it is not a pure coverage check (use `/improve coverage`) and not a review (use `/deep-review-codebase`)

## Execute

### 1. Collect References

> Goal: Gather all reference sources the user provided or that are relevant

1. Take refs from the user — URLs, file paths, directory, repo, package name, or topic
2. Route according to the source type:
   - URL/docs/topic → run `/learn-from-web` step 1-2 (official docs → DeepWiki → Context7 → Web Search)
   - Local files/directory → read directly with `read`/`grep`
   - Codebase → run `/learn-from-codebase` step 1
   - CLI binary → run `/learn-from-cli`
   - `.d.ts` API surface → run `/check-types-definition`
3. If the refs are unclear → ask the user first (which source, which target skill)

### 2. Extract Knowledge

> Goal: Extract verifiable claims from the sources

1. Build a claims table: `claim | type | source` — types: `api`, `version`, `config`, `pattern`, `deprecation`, `breaking-change`
2. Always capture the version + date of the source (e.g., `v66.10.5, verified YYYY-MM-DD`)
3. Separate "verified facts" from "inference" — inference must be clearly flagged
4. Record the source URLs/paths for every claim — every claim must be traceable back to its source

### 3. Audit Target Skills

> Goal: Compare the obtained knowledge against the current skill content, find drift

1. Identify the target skills (user-specified, or match from the claims → the relevant `follow-*`/`skill`)
2. Read the `SKILL.md` + all `references/` + `best-practices/` + `workflows/` of each target
3. Build a drift table: `skill | file | claim | status` — statuses:
   - `stale` — old information/version lower than the source
   - `wrong` — contradicts the source
   - `missing` — the source has it but the skill does not
   - `ok` — already matches
4. Order by priority: `wrong` > `stale` > `missing`

### 4. Update Skills

> Goal: Sync the skill content to match the source according to conventions

1. Fix `stale`/`wrong` first — minimal edit, do not rewrite the whole file
2. Fill in `missing` only where relevant to the skill's scope — do not dump the entire reference
3. Every edit must follow the `/update-devin-global-skills` conventions: complete frontmatter, section order, backticks, ≤250 lines/file, no TODO/MOCK/placeholder
4. New content that is long detail → write it into `references/` instead of `SKILL.md` (Write References spec)
5. Update version strings together with `verified YYYY-MM-DD` when verified from the actual source

### 5. Ensure Coverage

> Goal: The updated skills are comprehensively covered, with no gaps left

1. Run `/improve coverage` on every target skill just edited — fill in the `references/`/`examples`/edge-cases still missing from as-yet-unused claims
2. Check every file created/edited via `/check-reference` — claims match the source, no dangling links

### 6. Validate

> Goal: Confirm the changes comply with the repo conventions

1. Run `/deep-validate` to check the repo-wide conventions (frontmatter, whether `related` actually resolves, line limits)
2. Run `/update-references` if new files/folders were added
3. Check the `related` of every skill touched — every entry exists and is mentioned in the body

### 7. Report

> Goal: Summarize what changed from what

1. Run `/report` table: `Skill | Source | Claims Updated | Gaps Filled | Status`
2. Attach a drift summary: the number of stale/wrong/missing fixed and the claims remaining (out of scope)
3. Suggest next actions if there are other skills likely affected by the same source

## Rules

### 1. Source Of Truth

- References are the truth — the skill must follow the source, not the other way around
- Every claim written into a skill must be traceable back to its source — never guess
- If sources conflict with each other → choose official/current and record the conflict in the report

### 2. Minimal Diff

- Edit only the points that drifted — do not rewrite the whole skill unless necessary
- Do not change the skill's structure/frontmatter/style if it is unrelated to the claims
- Do not touch skills that are not in the target list

### 3. Conventions

- Every file touched must pass the `/update-devin-global-skills` conventions and `/check-reference`
- New files in `references/`/`best-practices/` must be referenced from `SKILL.md` (not orphans)
- Use `/learn-from-web` `/learn-from-codebase` `/learn-from-cli` `/check-types-definition` as source adapters — do not rewrite logic

## Expected Outcome

- Target skills fully synced with the reference sources — no stale/wrong claims left
- Gaps fully filled via `/improve coverage`, references not dangling
- Every change traceable back to its source, with version/date clearly stated
- The report clearly shows the before/after drift
