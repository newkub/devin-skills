---
name: update-project-skills
description: Route project skill creation and updates to update-dot-agents-project skills
argument-hint: "[skill-name]"
related:
  - update-dot-agents-project
  - update-project
  - update-agents-skills-global
  - report
---

## Goal

Dispatch project-local skill work to `/update-dot-agents-project skills` — this skill only routes and never duplicates that workflow

## Scope

- Target: `<project>/.agents/skills/` for project-local skills
- Global skills → `/update-agents-skills-global`; the whole `.agents` layout → `/update-dot-agents-project`
- Boundary: this skill keeps the legacy name working for `/update-project`; the canonical workflow lives in [update-dot-agents-project workflows/skills](../update-dot-agents-project/workflows/skills/SKILL.md)

## Execute

### 1. Dispatch

> Goal: route to the canonical project skills workflow

1. Read the argument — skill name, scope, or empty
2. When the request targets `<project>/.agents/skills/` → run `/update-dot-agents-project skills` and pass the argument through
3. When the skill is generally useful beyond this project → run `/update-agents-skills-global` instead
4. When the `.agents` tree is missing or broken → run `/update-dot-agents-project scaffold` first, then `skills`

### 2. Report

> Goal: report what the canonical workflow produced

1. Follow `/report` so every table starts with `No.`
2. Table columns: No., Skill, Path, Status
3. Run `/suggest-next-action` for the next step

## Rules

- The parent only dispatches — never restate the create/update steps from `/update-dot-agents-project skills`
- Project skills live in `.agents/skills/` only, never `.devin/skills/`
- Never edit global skills from this skill
- Never edit project source code
- Never use `**` bold; use backticks for paths and skill names

## Expected Outcome

- The caller lands on `/update-dot-agents-project skills` with the argument intact
- Project skills are created or updated once, by the canonical workflow
