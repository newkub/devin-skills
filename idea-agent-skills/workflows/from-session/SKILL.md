---
name: idea-agent-skills-from-session
description: Mine the current session for repeated or manual workflows, then propose skills
related:
  - idea-agent-skills
  - check-agents-session
  - update-agents-skills-global
  - report
---

## Goal

Analyze the current session for repeated or multi-step manual patterns and propose them as skill candidates

## Scope

- Use when the session contains work that is multi-step, repeated, or likely useful again
- Evidence: user requests, command sequences, file edit patterns, repeated fixes
- Proposals only — never create a skill without confirmation

## Execute

### 1. Mine Session Activity

> Goal: collect what was actually done

1. Review the user requests and the work performed in the session
2. Run `/check-agents-session requests` when a structured request list is needed
3. Find repeated command sequences — git workflows, validation scripts, batch operations
4. Find manual multi-step processes that should become one workflow

### 2. Identify Candidates

> Goal: separate skill-worthy patterns from one-time work

1. Skill-worthy: repeatable in other projects, clear trigger, multiple steps, real rules or gotchas
2. Not skill-worthy: one-time work, one-off fixes, or anything an existing skill already covers
3. Compare against existing skills; when they overlap, propose extending the existing one

### 3. Draft Proposals

> Goal: one complete proposal per candidate

1. `name` in `kebab-case` following the prefix conventions
2. `description` of 100 characters or less
3. `trigger` describing when the skill applies
4. `related` targets that actually exist
5. Evidence: the exact steps or commands from the session the skill would cover

### 4. Present

> Goal: the user chooses what to create

1. Use `/report`; columns: No., Skill, Solves, Session Evidence, Related
2. Order by reusability times frequency observed in the session
3. Ask the user to pick — never create on your own

## Rules

- Propose only patterns observed in the session — never guess a hypothetical need
- Cite the real steps and commands as evidence
- Check existing skills first; propose an extension when the overlap is real
- Show a proposal only when name, description, and trigger are all decided
- Never use `**` bold; use backticks for names and commands

## Expected Outcome

- A numbered list of skill candidates with session evidence
- Each candidate ready with name, description, trigger, and related skills
- A user selection that continues through `/update-agents-skills-global`
