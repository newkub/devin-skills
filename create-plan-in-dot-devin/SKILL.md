---
name: create-plan-in-dot-devin
description: Canonical analyze+plan — deep analysis, then an implementation-ready plan in .devin/temp/plan/
argument-hint: "[topic|scope] [chat-only]"
related:
  - idea-features
  - deep-thinking
  - deep-analyze
  - deep-research
  - prioritize
  - deep-validate
  - deep-review
  - deep-review-then-fix
  - report-uxui
  - report-architecture-diagram
  - update-gitignore
  - implement-to-production
  - create-github-issue
  - ask-me
  - suggest-next-action
---

## Goal

Analyze the problem/context deeply and produce a readable, implementation-ready plan with scoring and progress tracking — canonical for all analyze+plan work (merged `/deep-plan`; starts with `/deep-thinking`, then analyzes like `/deep-analyze`) — written to `.devin/temp/plan/<workspace>/<title-date>.md` with the plan file opened in the editor

## Scope

- Takes a request or topic — use for all kinds of planning: new features, refactors, migrations, multi-item work
- Default: persist to a file — if the caller clearly specifies `chat-only` → answer with the plan in chat, skipping Steps 6-8 (no file created)
- Use `/idea-features` to generate systematic features + score them per `references/scoring.md`
- Every task specifies File/What/How/Deps/Acceptance/Risk in full — the plan must be implementable without further questions

## Execute

### 1. Capture And Prepare

> Goal: Gather context and prepare the workspace path

1. Take `<topic>` from the argument or the current session's context
2. Read the relevant context, design, and reports; if the scope is ambiguous → run `/ask-me`
3. Confirm the target workspace with the user if it is not clear
4. Determine `<workspace>` = the directory name of the target workspace
5. Check that `.devin/temp/plan/<workspace>/` exists — create it if missing
6. Run `/update-gitignore` if `.devin/temp` is not yet ignored — plan artifacts are temp files and should not be committed

### 2. Deep Analyze

> Goal: Have real findings from the code before writing the plan — no guessing

1. Run `/deep-thinking` — objectives, sub-problems, assumptions, and success criteria
2. Run `/deep-analyze` — structure, patterns, conventions, symbols, call sites, duplications, with file:line evidence
3. Read the target files for real with the read tool — never guess APIs or file paths

### 3. Deep Research (If Needed)

> Goal: Get dependency choices + pattern decisions that are verified

Run `/deep-research` when choosing new deps or new patterns:

- Library choice: official docs first + ≥2 sources — rejected alternatives need clear reasons
- A new dep must be published ≥7 days + version-pinned — no floating/`latest`
- Pattern choice: official docs / framework docs / production patterns — not random blog posts

### 4. Generate And Score Features

> Goal: Have a systematic feature list with priority scores

1. Run `/idea-features <topic>` — split `New`/`Extends` based on the existing codebase
2. Compute Score per `references/scoring.md` — `Score = (Impact + Effect) / (Risk × Phase)`
3. Order features by Score high → low
4. Check dependencies between features — a depended-on feature must come first
5. For each feature run `/report-uxui` (icon + short description) if a visual is needed

### 5. Order And Refine

> Goal: Get a plan that is correctly ordered and passes the quality gate

1. Run `/prioritize` — Foundation → Dependencies → High impact → Critical path → High risk; arrange phases Foundation → Core → Polish → Test + task graph
2. Run `/deep-review-then-fix` on the drafted plan content
3. Run `/deep-review` to check plan quality — if there are findings, fix and re-review until clean (max 3 rounds)
4. Run `/deep-validate` to check for placeholders and missing steps — leave no TBD in tasks
5. If a requirement has multiple high-risk options → write out options/risks then `/ask-me`

### 6. Check For Duplicate

> Goal: Avoid writing duplicate plans

1. Search `.devin/temp/plan/<workspace>/` for files whose names resemble the current `<topic>`
2. If an unfinished plan exists → update the original or create a new revision based on context
3. Record the chosen title — use the form `<short-kebab-title>-<YYYY-MM-DD>.md`

### 7. Build Plan Body

> Goal: Assemble the plan content with all sections — see `references/plan-template.md`

1. Write `## Goal` — summarize the desired outcome in 1-3 lines
2. Write `## Architecture` — an ANSI diagram or references to the relevant architecture; use `/report-architecture-diagram` if a new drawing is needed
3. Write `## Idea Features` — features + scoring table per the Features Table section of `references/plan-template.md`
4. Write `## File Changes` — the `No. | File | Action | What | How | Acceptance | Risk` table from Step 5
5. Write `## TODO` — tasks table tracked with a `Status` column
6. Write `## Task Graph` — dependencies between tasks + critical path
7. Write `## Risks` — table of risk, impact, mitigation
8. Write `## Test Strategy` — required coverage, fixtures, regression
9. Write `## Assumptions And Unknowns` — what was assumed and the open questions
10. Write `## Acceptance Criteria` — checkbox list
11. Write `## Execution Order` — numbered list ordered by critical path

### 8. Create And Open Plan File

> Goal: Create the plan file and open it for the user

1. Write the file to `.devin/temp/plan/<workspace>/<title>-<YYYY-MM-DD>.md`
2. Open the file in the IDE — if the environment supports it, use the `code .devin/temp/plan/<workspace>/<file>` command or an available editor
3. Tell the user the file location and summarize the plan
4. Recommend `/implement-to-production` as the next step
5. Use `/create-github-issue` if the plan should go to a GitHub issue
6. Use `/suggest-next-action` if the next action is unclear

## Rules

### 1. Plan Quality

- Every task must fully specify: `File` (path + action), `What` (API signature/types), `How` (pattern), `Deps` (existing/new + version + publish age), `Why` (+ rejected alternatives), `Acceptance` (measurable), `Risk` (impact + rollback)
- Never use placeholders, `TBD`, `TODO`, or steps that cannot be implemented — the plan must be executable without further questions
- Every claim needs evidence from Step 2 (file:line) — never guess APIs or paths
- Reuse first: a pattern repeated ≥3 places → add an extraction task; a migration with shared code → order shared → consumers → delete dead
- A new dependency must be version-pinned + published ≥7 days + with the reason for choosing it

### 2. Plan File UX

- Use clear heading levels + tables for comparison
- Do not use bold markers `**` in the body — use headings/bullets instead
- Center ANSI diagrams with `<div align="center">`
- Every line in an ANSI codeblock must have equal length
- Use ` ```text ` codeblocks for diagrams
- No separate `## Information`, `## Key Concepts`, or `## Tech Stack` sections

### 3. Scoring

- Use only the formula `Score = (Impact + Effect) / (Risk × Phase)` — see `references/scoring.md`
- Round to 1 decimal place; equal scores → lower Risk first
- Every feature must have `Icon` as the first column

### 4. File Safety

- Write only inside `.devin/temp/plan/<workspace>/` — never touch source code
- `.devin/temp` must be in `.gitignore` before creating files — if not, run `/update-gitignore` (plan artifacts should not be committed)
- Idempotent: re-running must not accidentally create a duplicate plan (see Step 6)
- `chat-only` mode: if the caller specifies it clearly → skip Steps 6-8, create no file, touch no `.devin/temp`
- Never delete old plans without confirmation — keep them as history

### 5. Merged Scope

- Merged from `/deep-plan` (and the old `/deep-analyze-and-plan` — since removed) — the single canonical entry for all analyze+plan work
- `/deep-plan` and `/plan` are alias stubs that forward to this skill
- Planning work that must persist goes through this skill only — never create plan files outside `.devin/temp/plan/`

## Expected Outcome

- An implementation-ready plan complete with features, scoring, File Changes, TODO, Task Graph, Risks, Test Strategy, and Acceptance Criteria
- The plan file is at `.devin/temp/plan/<workspace>/<title>-<YYYY-MM-DD>.md` and opened in the editor
- `.devin/temp` is ignored in `.gitignore`
- No placeholders — every task has evidence, dependencies, and measurable acceptance
- Ready to hand off to `/implement-to-production`
