---
name: improve-writing
description: Improve writing: clear, concise, explicit, bounded, ordered, easy to follow — then fix all findings
argument-hint: "[target]"
related:
  - improve
  - write-explicit
  - simplify
  - deep-review-codebase
  - report-review
  - update-devin-global-skills
  - suggest-next-action
---

## Goal

Answer "what should improve in this writing" for any target (skill, doc, prompt, report, rules) — assess it against the canonical writing criteria below with evidence, report findings via `/report-review`, then fix every finding immediately through `/deep-review-codebase <target> writing then-fix`

## Scope

Use when prose or instructions must be reviewed for quality before or after shipping — the SSOT for writing-quality criteria (clear, concise, explicit, bounded, terminology, ordering, followability)

- Any written artifact: `SKILL.md`, `README.md`, docs, prompts, rules, report text, commit/PR descriptions
- Route away: USAGE.md surface parity → `/improve usage-md` (`improve-usage-md`); rewriting instructions only → `/write-explicit`; condensing a whole file's structure → `/simplify`; create/update skill package mechanics → `/update-devin-global-skills`
- Full scope → review domain map: `improve/references/scope-map.md` row `writing`

## Execute

### 1. Scope The Target

> Goal: Know exactly what writing is under review

1. Take `target` from argument — file, folder, or document; if missing → the file(s) just changed in this session; if unclear → `/ask-me`
2. Identify the reader and purpose (follow steps / understand a concept / take action) — record both, they calibrate every criterion below
3. Run the deep pre-pass `/deep-thinking` → `/deep-analyze` before judging (review-* convention)

### 2. Assess Against Criteria

> Goal: Findings with evidence, one per criterion violation

1. Check the target against every criterion in `### 1. Writing Criteria` — each finding must quote the violating text (file:line or section)
2. Grade each criterion pass/weak/fail; a finding is only real if you can state what the reader would misunderstand, redo, or stall on
3. Do not rewrite while checking — review first, fix only in step 4

### 3. Report Findings

> Goal: One prioritized table before fixing

1. Report via `/report-review` — No., Criterion, Severity, Finding, Evidence, Action; no report files
2. Order by impact on the reader: fail + blocks following > fail + confuses > weak > style
3. Continue to fixing immediately — this family fixes without waiting for confirm (unless the user asked for confirm-first → `/deep-review-codebase <target> writing then-fix` directly)

### 4. Fix All Findings

> Goal: Every finding resolved in context

1. Send findings to `/deep-review-codebase <target> writing then-fix fix all` (`fix all` = no per-finding confirm) — preserve intent and facts 1:1; never change meaning, numbers, commands, or skill names while rewording
2. Structural problems (sections out of order, mixed concerns) → reorder or split with `/refactor`, not rewording
3. Re-read the fixed text against each criterion until all pass, max 3 rounds per finding
4. Run `/deep-validate` for structure/links, then `/suggest-next-action`

## Rules

### 1. Writing Criteria

- Clear — one idea per sentence/step; the reader answers "what do I do, when, with what result?" without guessing
- Concise — no filler, no restated content; cutting a sentence never loses meaning (heavy condensation of a whole file → `/simplify`)
- Explicit — action + condition + measurable outcome on every instruction; no "handle", "appropriate", "if possible" (instructions detail → `/write-explicit`)
- Bounded — the text states what it covers and what it does not, and where out-of-scope questions go (`## Scope` in skills)
- Terminology — plain standard words over jargon; a technical term is defined once at first use, then used identically everywhere (backticks for `tools`, `commands`, `paths`, `skill-name`)
- Ordered — dependencies come before dependents; most important information first (progressive disclosure); steps in exact execution order
- Followable — active voice with stated actor; no unstated prerequisites; every step is verifiable; a reader with only this text completes the task

### 2. Evidence Only

- Every finding quotes the offending text with location — no evidence, no finding
- Judge the writing, not the opinion: do not inject new facts, steps, or style preferences the target's purpose does not require

### 3. Preserve Meaning 1:1

- Rewording keeps every number, command, name, link, and claim identical — rewording that changes behavior is a bug
- Unknown facts → leave the text and flag it, do not guess

### 4. Severity

- Critical: reader cannot follow the text as written (missing step, wrong order, ambiguous action)
- High: criterion fails and causes misunderstanding or rework (implicit condition, undefined jargon, unstated boundary)
- Medium: weak criterion — wordy, inconsistent terminology, sub-optimal ordering
- Low: style-only tightening

- Use /write-explicit if needed
- Use /simplify if needed
- Use /update-devin-global-skills if needed

## Expected Outcome

- Every criterion checked with evidence; findings shown in one `/report-review` table
- All findings fixed in context without changing meaning — max 3 rounds per finding, unresolved ones reported with reason
- Target passes all 7 criteria and `/deep-validate`
- No files created except the fixes themselves
