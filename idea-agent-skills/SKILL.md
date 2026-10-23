---
name: idea-agent-skills
description: Generate, mine, or capture ideas for agent skills — new, from session, add context
argument-hint: "[new|from-session|add-context] [scope]"
related:
  - follow-single-responsibility
  - check-my-global-cli
  - review-dot-agents-global-and-fix
  - update-agents-skills-global
  - check-agents-session
  - use-related-skills
  - ask-me
  - deep-research
  - report
---

## Goal

Turn observations into skill proposals — new ideas, session-mined candidates, or captured context placed into the right skill

## Scope

- Modes: `new`, `from-session`, `add-context`; default is `new`
- Sources: the global skills repo at `~/.agents/skills`, the current session, or context the user provides
- Proposals only — creation happens through `/update-agents-skills-global` after the user selects
- Boundary: rule-level review → `/review-dot-agents-global-and-fix`; session listing → `/check-agents-session`

## Execute

### 1. Pick Mode

> Goal: route to the right idea workflow

| Mode | Use when | Workflow |
|---|---|---|
| `new` | find new skills, merges, renames, or extractions | [workflows/new](workflows/new/SKILL.md) |
| `from-session` | mine the current session for repeatable workflows | [workflows/from-session](workflows/from-session/SKILL.md) |
| `add-context` | save context into an existing skill or a new one | [workflows/add-context](workflows/add-context/SKILL.md) |

1. Read the argument; when empty use `new`
2. When the mode is unknown → `/ask-me` to pick one
3. Pass the remaining scope argument through to the workflow

### 2. Gather Evidence

> Goal: every proposal rests on real data

1. Run `/check-my-global-cli` when tool coverage or a missing CLI is part of the question
2. Use `/check-agents-session` when the evidence lives in past sessions
3. Use `/use-related-skills` to find overlaps before proposing anything new
4. Use `/deep-research` only when best practice is genuinely unclear
5. Never cite a skill, file, or command that does not exist

### 3. Present Proposals

> Goal: the user can decide each idea without extra reading

1. Follow `/report` so every table starts with `No.`
2. One responsibility per row per `/follow-single-responsibility`
3. Each row carries name, description of 100 characters or less, trigger, evidence, and related skills
4. Ask which proposals to implement with `/ask-me` — never create on your own

### 4. Hand Off

> Goal: the chosen proposals become real skills

1. Hand the selected proposals to `/update-agents-skills-global`
2. Run `/review-dot-agents-global-and-fix` after creation to catch structural findings
3. Run `/update-references` when a proposal renames, merges, or removes a skill

## Rules

- Proposals only — never create, rename, or delete a skill without an explicit selection
- Evidence only — cite the real skill, command, or session step behind each idea
- No duplicates — extend an existing skill when the overlap is real
- Rename or merge proposals must include their migration steps
- Never use `**` bold; use backticks for names and paths

## Expected Outcome

- A numbered proposal table with evidence and related skills
- A clear user selection before any skill is created
- Selected proposals implemented through `/update-agents-skills-global` and re-reviewed
