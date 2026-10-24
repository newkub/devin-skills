---
name: check-finished
description: Audit session requests - finished or not, evidence, skills used
argument-hint: "[current|last|all|session-id]"
related:
  - check-agents-session
  - enhance-prompt
  - update-agents-skills-global
  - scan-codebase
  - deep-validate
  - report
  - ask-me
  - continue
  - reflex-to-improve-dot-agents-global
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
---

## Goal

Read every user request in a session, decide per requirement whether it was actually finished, show the evidence, and name the skill that should own it — read-only, no execution

## Scope

- Target: the current session by default; `last` for the previous one; `all` for every session in the current repo; an explicit session id when given
- Answers two questions per request: was it finished, and which skill should have handled it
- Not this skill: raw request listing or keyword search → `/check-agents-session`; turning a session into next actions → `/check-agents-session` (`plan`); capturing harness improvements → `/reflex-to-improve-dot-agents-global`; doing the unfinished work → `/continue`

| Argument | Target | First move |
|----------|--------|------------|
| none or `current` | this session | `### 1` from the live context |
| `last` | the previous session | `/check-agents-session` (`requests`) |
| `all` | every session for the current repo | `/check-agents-session` (`sessions` then `requests`) |
| `session-id` | one named session | `/check-agents-session` (`requests`) |

## Execute

### 1. Collect The Prompts

> Goal: a complete, ordered list of what the user asked

1. Extract every user message from the target session; outside the current session read them through `/check-agents-session` (`requests` domain)
2. Keep multi-intent prompts whole here — the split happens in `### 2`
3. Drop pure acknowledgements (`ok`, `thanks`, a mode toggle) unless they changed the plan, and record how many were dropped

### 2. Split Into Requirements

> Goal: one testable unit per single responsibility

1. Normalize each prompt with `/enhance-prompt`: one numbered requirement per single responsibility
2. Recover requirements the user clearly implied (a "new skill X" implies directory, frontmatter, validation) and tag them `implicit`
3. Give every requirement an acceptance test that names the artifact proving it: file path, command, report section, or answer text

### 3. Verify Each Requirement

> Goal: a verdict backed by evidence, never by recollection

1. Search for the evidence: file exists and matches, diff, command output, report row, or the answer itself
2. Assign one status: `done`, `partial`, `not done`, `not verifiable`
3. `partial` names the missing part; `not verifiable` names the reason (no artifact, outside session, needs runtime access)
4. A claim that spans several files or needs type or runtime proof → `/deep-validate` before calling it `done`
5. Intent is not completion — a plan, a promise, or "will do" is `not done`

### 4. Map To Skills

> Goal: answer "which skill should have been used"

1. For each requirement run `/update-agents-skills-global` (`## Conventions → Related Skills`), and `/scan-codebase` when the owner is still unclear
2. Record two values: `skill used` (what actually ran, from the session's tool calls) and `skill should use` (the real owner)
3. A gap is `should use` never ran, or an unrelated skill ran; no owner at all → mark `missing skill`

### 5. Score Completion

> Goal: a per-prompt and per-session verdict

1. Per prompt: every requirement `done` → `finished`; some → `partial`; none → `unfinished`; a question with no testable artifact → `answered`
2. Session score = finished prompts / total prompts, plus the blocked requirements and their blockers

### 6. Report

> Goal: one table that shows status, proof, and the skill gap

1. Run `/report` with columns: No. / Prompt / Requirement / Status / Evidence / Skill Used / Skill Should Use / Next Action
2. Keep No. in session order, continuing 1, 2, 3 across prompts so a requirement can be referenced by row
3. Summary line: prompts, requirements, `finished` / `partial` / `unfinished` / `not verifiable` counts, completion %, and detected skill gaps
4. State the dropped-acknowledgement count so the prompt total is auditable

### 7. Hand Off

> Goal: the audit turns into an action, not a dead report

1. Unfinished rows the user wants next → `/ask-me` (multi-select), then `/continue` on the chosen rows
2. Repeated skill gap or a `missing skill` → `/reflex-to-improve-dot-agents-global`
3. Request list, keyword search, or plan view → `/check-agents-session`

## Rules

1. Read-Only — no file edits, commits, or state changes; the verdict and the table are the only output
2. Requirement, Not Prompt — per-requirement status is the unit; a multi-part prompt never gets one blanket verdict
3. Evidence Or Not Verifiable — cite a path with line, a command result, or a report row; otherwise mark `not verifiable` instead of guessing
4. No Credit For Intent — a plan, promise, or TODO is `not done` until the artifact exists
5. Explain The Gap — every `skill should use` names a real skill; when none owns the requirement, say `missing skill` and stop inventing one
6. Deterministic — same session and same repo state produce the same verdicts and the same completion score

## Expected Outcome

- A `No.`-first table covering every requirement in the session with status, evidence, and the skill that should own it
- A completion score plus the list of unfinished and unverifiable requirements with their blockers
- Unfinished work handed to `/continue` only after the user selects rows, and skill gaps handed to `/reflex-to-improve-dot-agents-global`
