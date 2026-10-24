---
name: update-dot-agents-project-skills
description: Create and update project-local skills in .agents/skills per repo conventions
related:
  - update-dot-agents-project
  - update-agents-skills-global
  - update-agents-md
  - deep-validate
---

## Goal

Create and update project-local skills in `<project>/.agents/skills/` with the same package standard as global skills

## Scope

- Target: `<project>/.agents/skills/<skill-name>/SKILL.md`
- Project-local only — anything generally useful → `/update-agents-skills-global`
- The global convention is canonical; this workflow only pins the project path and validation

## Execute

### 1. Identify The Skill

> Goal: know which skill to create and where it belongs

1. Take the skill name from the argument or the current context
2. When unclear → `/ask-me`
3. Verify the skill is truly project-specific; otherwise hand off to `/update-agents-skills-global`
4. Scan the codebase for the workflows and patterns the skill will cover

### 2. Check For Duplicates

> Goal: no duplication with existing skills

1. Check `.agents/skills/` and `~/.agents/skills/` for a skill with the same purpose
2. Run `/update-agents-skills-global` (`## Conventions → Related Skills`) when an overlap is possible
3. Read `AGENTS.md` and the existing project skills to match conventions and commands

### 3. Create The Structure

> Goal: the package starts in the right shape

1. Create `.agents/skills/<skill-name>/SKILL.md`
2. Use `kebab-case`; the frontmatter `name` equals the directory name
3. Add `scripts/` or `src/` only when the skill ships code
4. Keep `SKILL.md` at 250 lines or less; split into `references/` only with a clear reason
5. Put enforceable conventions in ast-grep `rules/` at the project root instead of embedding them

### 4. Write SKILL.md

> Goal: the document follows the repo standard

1. Complete frontmatter: `name`, `description` of 100 characters or less, `argument-hint`, `related`
2. Sections in order: `## Goal` → `## Scope` → `## Execute` → `## Rules` → `## Expected Outcome`
3. Write the content in English
4. Use the project's real commands and paths from `package.json`, `AGENTS.md`, or existing scripts
5. Use backticks for tools, commands, paths, and skill names
6. Keep Execute at 10 steps or fewer, each with a `> Goal:` line and a numbered list

### 5. Sync With The Project

> Goal: the skill is wired into project artifacts

1. Run `/update-agents-md` so `AGENTS.md` references the skill when it is a primary workflow
2. Confirm every `related` target exists in the project or global set
3. Sync hooks and MCP through `/update-dot-agents-project hooks` and `/update-dot-agents-project mcp`
4. Run the scaffold workflow only when the `.agents` tree itself changes

### 6. Validate And Report

> Goal: the package passes the standard

1. Run `/deep-validate` — frontmatter, sections, length, placeholders, links
2. Confirm `related` has no missing, self, duplicate, or circular entries
3. Fix and recheck at most 3 rounds, then report and stop
4. Run `/report` with No., Skill, File, Status
5. Run `/suggest-next-action`

## Rules

- Create only project-specific skills — for general skills use `/update-agents-skills-global`
- Do not duplicate a global skill
- `name` equals the directory name in `kebab-case`; `description` is 100 characters or less
- No file over 250 lines and no placeholder or mock content
- Use the project's real commands — never hardcode a command the project lacks
- Never use `**` bold; use backticks for names and paths

## Expected Outcome

- The skill lives in `.agents/skills/<skill-name>/` with a valid `SKILL.md`
- Sections, frontmatter, and length match the global standard
- `AGENTS.md` and `related` are in sync, with no duplication of a global skill
- `/deep-validate` passes and the report lists the created path
