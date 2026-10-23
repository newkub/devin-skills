---
name: update-devin-global-rules
description: Maintain global_rules.md — add/update/reorder machine-wide agent rules and sync reverse refs
argument-hint: "[add|update|remove|audit] [rule-topic]"
triggers:
  - user
  - model
related:
  - update-devin
  - review-dot-agents-global-and-fix
  - update-agents-skills-global
  - update-devin-global-subagents
  - update-dot-agents-project
  - update-astgrep-rules
  - check-reference
  - update-references
  - use-related-skills
  - new-skills
  - deep-validate
  - report-before-after
  - ship
  - ask-me
---

## Goal

Keep the machine-wide agent rules file (`global_rules.md`) correct, enforceable, and in sync with the skills it cites — the single owner of global rules content, while `/review-dot-agents-global-and-fix` keeps the rules/skills/subagents layers aligned

## Scope

- Owns `global_rules.md` only — project-level `.devin/rules/*.md` → `/update-dot-agents-project`; project ast-grep `rules/` → `/update-astgrep-rules`; cross-layer alignment (rules vs skills vs subagents) → `/review-dot-agents-global-and-fix`, which delegates the rules edit here
- `/update-devin global-rules` dispatches here
- Argument routes the work: `add` a new rule · `update` an existing rule · `remove` a rule · `audit` (read-only health check) — no argument → `/ask-me`
- Boundary with `/review-dot-agents-global-and-fix`: this skill edits the rules file and syncs reverse references; harness owns detecting that layers disagree

## Execute

### 1. Read And Understand Intent

> Goal: know the current rules and what the change really means

1. Read the rules file — canonical path on this machine: `%USERPROFILE%\.codeium\windsurf\memories\global_rules.md` (the `global-rules:` entry in the skills repo `AGENTS.md` records the source; other installs keep it in dotfiles/chezmoi — check there before creating a second copy)
2. For each existing section record: number, title, the skills/commands it cites, and its intent — never edit blind
3. Capture the requested change as one falsifiable rule: what agent behavior changes, when it triggers, which skill enforces it

### 2. Check Duplicate And Ownership

> Goal: no duplicate rule, right owner skill

1. A rule covering existing behavior → update that section instead of adding a twin
2. The behavior is really owned by one skill's workflow → the skill should own it; the global rule stays only if every session must obey it regardless of task
3. Run `/use-related-skills` — the rule must cite a real skill that exists (missing → create it first via `/new-skills`)

### 3. Audit Before Editing (always)

> Goal: the file is healthy before this change lands

1. Every `/<skill>` and section cited in the file still exists → `/check-reference`
2. Grep the skills repo for `global_rules` reverse references — every file citing a section title/number is logged as a sync target
3. Findings → fix in this run or report them; `audit` argument stops after this step with the report

### 4. Edit The Rule

> Goal: minimal, idempotent, backup first

1. Copy the file to a timestamped backup beside it before editing
2. Append new rules as the next number — never renumber existing sections unless the user confirms (24+ skill files cite section numbers, renumbering ripples everywhere)
3. One `## N. Title` section per rule, terse bullets: trigger → required action (run `/skill …`) → exception/reporting clause; write it as an instruction an agent can execute, not an aspiration
4. `update`/`remove` → edit only that section; `remove` must leave no reverse reference pointing at it

### 5. Sync Reverse References

> Goal: the rest of the ecosystem cites the truth

1. Rule renamed/moved/removed → `/update-references` across the skills repo so no file cites a dead section
2. New rule whose enforcement lives in a skill → confirm that skill mentions the global rule back (its `## Rules`/`## Scope`); update the skill via `/update-agents-skills-global` if not
3. Skills repo `AGENTS.md` `global-rules:` entry still names this file's source path — fix if drifted

### 6. Validate

> Goal: the edit is safe

1. `/deep-validate` the file — numbering sequential, every cited skill has a real dir, no TODO/placeholder, no duplicate intent
2. `/review-dot-agents-global-and-fix` when the change touches layer contracts (skills/subagents must follow suit)
3. If the file is git-tracked (dotfiles repo) → `git diff` review of the edit; otherwise re-read the file end-to-end

### 7. Report And Ship

> Goal: change is visible and delivered

1. `/report-before-after` — the section edited, the reverse refs synced, validation results
2. Skills-repo changes (AGENTS.md, wired skills) → `/ship`; the rules file itself is machine config outside the skills repo — never commit it into a project repo

## Rules

- The file is global machine config — edit in place with a backup; content must never leak into project repos
- Every rule is enforceable by citing a real skill/command with an explicit trigger — vague rules ("write good code") are rejected
- Numbering is a stable contract — append, don't renumber; renumbering needs user confirmation and a full `/update-references` pass
- Minimal + idempotent: one rule per topic, no twins, no reformatting of untouched sections
- `/review-dot-agents-global-and-fix` remains the alignment layer above this skill — this skill never edits skills/subagents directly, it routes via `/update-agents-skills-global` / `/update-devin-global-subagents` owners

## Expected Outcome

- `global_rules.md` carries the requested rule(s), sequentially numbered, backup taken, each backed by a real enforcing skill
- No reverse reference in the skills repo cites a dead/renamed section
- `/deep-validate` clean; skills/subagents layers updated by their owner skills when a rule requires it
- A before-after report and a shipped skills-repo sync commit
