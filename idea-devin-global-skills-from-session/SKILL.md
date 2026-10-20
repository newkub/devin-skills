---
name: idea-devin-global-skills-from-session
description: Mine the current session for repeated or manual workflows, then propose skill candidates
argument-hint: "[min-candidates]"
related:
  - idea
  - add-context-to-devin-global-skills
  - update-devin-global-skills
  - report

---

## Goal

Analyze the current session for repeated or multi-step manual patterns, then propose them as skill candidates — turn proven ad-hoc work into reusable workflows

## Scope

- Use when the session has work that is multi-step, repeated, or likely useful again — e.g. creating skills in batches, specific git workflows, manual checklists
- Analyze from: user requests, command sequences, file edit patterns, repeated fixes
- Proposals only — never create skills without confirm

## Execute

### 1. Mine Session Activity

> Goal: collect what was done in the session

1. Review user requests and the work actually done in the session — use `/list-request-devin-session` if a list is needed
2. Find repeated command sequences (git workflows, validation scripts, batch operations)
3. Find manual multi-step processes that should become a single workflow

### 2. Identify Candidates

> Goal: separate skill-worthy patterns from one-time work

1. Skill-worthy: repeatable in other projects, has a clear trigger, multiple steps, has rules/gotchas
2. Not skill-worthy: one-time work, one-off fixes, things an existing skill already covers
3. Compare against existing skills — propose extending an existing one instead of creating a new one when they overlap

### 3. Draft Proposals

> Goal: create a proposal per candidate

For each, state:
- `name` kebab-case per prefix conventions
- `description` ≤100 characters
- `trigger` when it should be used
- `related` skills that actually exist
- Evidence from the session: the steps/commands actually performed that the skill would cover

### 4. Present

> Goal: let the user choose

1. Use `/report table` with columns: `No.`, `Skill`, `Solves`, `Session Evidence`, `Related`
2. Order by reusability × frequency observed in the session
3. If there's a follow-on action from a previous idea → use `/follow-your-suggestion`
4. Ask the user to pick which to create — don't create on your own

## Rules

### 1. Session Evidence Only

- Propose only patterns actually seen in the session — never guess hypothetical needs
- Cite the real steps/commands performed as evidence

### 2. No Duplicates

- Check existing skills before proposing — use the `/idea` flow for general gap analysis
- If it overlaps with an existing one → propose extending that skill

### 3. User-Driven

- Never create a skill the user hasn't selected
- Proposals must be clear enough to decide — name + description + trigger

## Expected Outcome

- A list of skill candidates with evidence from the real session
- Each ready with name, description, trigger, related
- User picks and continues creation via `/update-devin-global-skills` or `/add-context-to-devin-global-skills`
