# Writing Quality

Contract for `/simplify review` — assess written artifacts against seven criteria with evidence, report via `/report-review`, then fix every finding.

## When To Use

Any written artifact: `SKILL.md`, `README.md`, docs, prompts, rules, reports, commit/PR text.

Boundary: USAGE.md surface parity → `/improve usage-md`; instruction detail only → `/write-explicit`; whole-file condensation → `/simplify docs`; skill package mechanics → `/update-agents-skills-global`.

## 1. Criteria

| No. | Criterion | Passes when |
|-----|-----------|-------------|
| 1 | Clear | One idea per sentence/step; the reader answers "what do I do, when, with what result?" without guessing |
| 2 | Concise | No filler, no restated content; cutting a sentence loses no meaning |
| 3 | Explicit | Every instruction states action + condition + measurable outcome; no "handle", "appropriate", "if possible" |
| 4 | Bounded | The text states what it covers, what it does not, and where out-of-scope questions go |
| 5 | Terminology | Plain standard words over jargon; a technical term is defined once at first use and used identically everywhere; backticks for `tools`, `commands`, `paths`, `skill-name` |
| 6 | Ordered | Dependencies before dependents; most important information first; steps in exact execution order |
| 7 | Followable | Active voice with stated actor; no unstated prerequisites; every step verifiable; a reader with only this text completes the task |

## 2. Evidence Only

- Every finding quotes the offending text with location (`file:line` or section) — no evidence, no finding
- Judge the writing, not the opinion: never inject new facts, steps, or style preferences the target's purpose does not require

## 3. Preserve Meaning 1:1

- Rewording keeps every number, command, name, link, and claim identical — rewording that changes behavior is a bug
- Unknown facts → leave the text and flag it; do not guess

## 4. Severity

| No. | Severity | Meaning |
|-----|----------|---------|
| 1 | Critical | Reader cannot follow the text as written — missing step, wrong order, ambiguous action |
| 2 | High | Criterion fails and causes misunderstanding or rework — implicit condition, undefined jargon, unstated boundary |
| 3 | Medium | Weak criterion — wordy, inconsistent terminology, sub-optimal ordering |
| 4 | Low | Style-only tightening |

## 5. Pipeline

1. Scope the target and record the reader and purpose (follow steps / understand / act) — they calibrate every criterion
2. Run `/deep-thinking` → `/deep-analyze` before judging
3. Grade every criterion pass/weak/fail; a finding is real only if you can state what the reader would misunderstand, redo, or stall on
4. Report one `/report-review` table: No., Criterion, Severity, Finding, Evidence, Action — ordered by impact on the reader
5. Fix every finding in context, preserving intent and facts 1:1; re-read against the criteria, max 3 rounds per finding
6. Structural problems (sections out of order, mixed concerns) → `/refactor`, not rewording
7. Finish with `/deep-validate` (structure/links) and `/suggest-next-action`

## Expected Outcome

- Every criterion checked with evidence; findings shown in one `/report-review` table
- All findings fixed without changing meaning; unresolved ones reported with reason
- Target passes all 7 criteria and `/deep-validate`
