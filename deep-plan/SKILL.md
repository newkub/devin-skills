---
name: deep-plan
description: Deep planning orchestrator — analyze every dimension, then produce a scored, executable plan
argument-hint: "[topic|scope]"
related:
  - deep-thinking
  - deep-analyze
  - deep-research
  - idea-features
  - prioritize
  - deep-review
  - deep-validate
  - create-plan-in-dot-agents
  - refactor
  - implement-to-production
  - ask-me
  - report
  - suggest-next-action

---

## Goal

Own the deep analyze→plan workflow: think, gather evidence across every dimension, then produce a decision-complete, scored, correctly-ordered plan — the plan content is delivered in chat by default; persisting it to a file is owned by `/create-plan-in-dot-agents`, which calls this skill

## Scope

- Called directly for planning thinking, or by `/create-plan-in-dot-agents` as the plan generator before file persistence
- Covers all plan types: new features, refactors, migrations, multi-item work
- Produces: feature list + scores, file-change table, task graph, risks, test strategy, assumptions, acceptance criteria — as content, not as a file
- Deviates from the plain `follow-*`/tool template because it is a `deep-*` orchestrator: `/deep-thinking` first, evidence per dimension, report at the end (spec: `update-agents-skills-global` `## Conventions → Templates` row `deep-*`)

## Execute

### 1. Deep Think

> Goal: frame the problem before gathering evidence

1. Run `/deep-thinking` — objectives, sub-problems, assumptions, success criteria
2. Identify the dimensions to analyze (structure, deps, data flow, UX, risk — per topic); unclear scope → run `/ask-me`
3. Read the relevant context, design docs, and prior reports; if it doesn't exist → note it as an unknown, never invent it

### 2. Deep Analyze

> Goal: real findings from the code — no guessing

1. Run `/deep-analyze` — structure, patterns, conventions, symbols, call sites, duplications, with file:line evidence
2. Read the target files for real with the read tool — never guess APIs or file paths
3. Read `refactor/SKILL.md` and `implement-to-production/SKILL.md` (incl. its `## TDD Loop`) before drafting — the plan must respect the standards the executor applies: SRP/≤250 lines, preserve public API, one fact one source, test-first cycles, and the verify gates (`/ship verify-only`, `/run-verify`)

### 3. Deep Research (If Needed)

> Goal: dependency choices + pattern decisions that are verified

Run `/deep-research` when choosing new deps or new patterns:

- Library choice: official docs first + ≥2 sources — rejected alternatives need clear reasons
- A new dep must be published ≥7 days + version-pinned — no floating/`latest`
- Pattern choice: official docs / framework docs / production patterns — not random blog posts

### 4. Generate And Score Features

> Goal: a systematic feature list with priority scores

1. Run `/idea-features <topic>` — split `New`/`Extends` based on the existing codebase
2. Compute Score per `## Rules → 1. Scoring` — `Score = (Impact + Effect) / (Risk × Phase)`
3. Order features by Score high → low
4. Check dependencies between features — a depended-on feature must come first

### 5. Order And Refine

> Goal: a plan that is correctly ordered and passes the quality gate

1. Run `/prioritize` — Foundation → Dependencies → High impact → Critical path → High risk; arrange phases Foundation → Core → Polish → Test + task graph
2. Run `/deep-review then-fix` on the drafted plan content
3. Run `/deep-review` to check plan quality — if there are findings, fix and re-review until clean (max 3 rounds)
4. Run `/deep-validate` to check for placeholders and missing steps — leave no TBD in tasks
5. If a requirement has multiple high-risk options → write out options/risks then `/ask-me`

### 6. Report The Plan

> Goal: deliver the decision-complete plan

1. Report via `/report` — ordered task tables with evidence, scores, and the critical path; every finding states its source file:line
2. Cover every identified dimension or explicitly report what was left open as an unknown
3. If the plan must persist → hand the content to `/create-plan-in-dot-agents` (it owns the `.devin/temp/plan/` file, template, and open-in-editor step)
4. Run `/suggest-next-action` — typical follow-through: `/implement-to-production`, `/refactor`, or `/create-plan-in-dot-agents`

## Rules

### 1. Scoring

- Use only the formula `Score = (Impact + Effect) / (Risk × Phase)` — scale: Impact/Effect High=10, Medium=6, Low=3; Risk High=3, Medium=2, Low=1; Phase multiplier MVP=1.0, v2=1.5, v3=2.0, Done=0.5
- Round to 1 decimal place; rank features by score high → low; equal scores → lower Risk first
- Show the scale and the formula with the reported plan; every feature row must have a real score

### 2. Plan Quality

- Every task must fully specify: `File` (path + action), `What` (API signature/types), `How` (pattern), `Deps` (existing/new + version + publish age), `Why` (+ rejected alternatives), `Acceptance` (measurable), `Risk` (impact + rollback)
- Never use placeholders, `TBD`, or steps that cannot be implemented — the plan must be executable without further questions
- Tasks must be written so `/implement-to-production` can execute them as-is (and `/refactor` when the task is structural)
- Reuse first: a pattern repeated ≥3 places → add an extraction task; a migration with shared code → order shared → consumers → delete dead

### 3. Boundaries

- This skill produces plan content only — never writes plan files; `/create-plan-in-dot-agents` is the sole owner of `.devin/temp/plan/` persistence (`/follow-single-of-source`)
- This skill is not an alias — it owns the whole generate-and-score workflow; `/create-plan-in-dot-agents` calls it and adds only file/template/persistence steps
- Execution of an accepted plan belongs to `/implement-to-production` and `/refactor`, never to this skill

## Expected Outcome

- A decision-complete, scored, critical-path-ordered plan delivered in chat — every claim backed by file:line evidence
- All dimensions covered or open unknowns stated explicitly
- No placeholders; tasks executable as-is by `/implement-to-production`/`/refactor`
- Plan persisted only when the caller needs a file, via `/create-plan-in-dot-agents`
