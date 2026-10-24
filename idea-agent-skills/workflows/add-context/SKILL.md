---
name: idea-agent-skills-add-context
description: Capture context from a session or user, then add it to an existing skill or a new one
related:
  - idea-agent-skills
  - update-agents-skills-global
  - list-dot-agents-global
  - check-agents-session
  - ask-me
---

## Goal

Take context from a session, a user prompt, or learned information, then place it in the right global skill under `~/.agents/skills` — extend before creating

## Scope

- Use when the user wants to save knowledge, a pattern, or a workflow into the global skills repo
- Target: `~/.agents/skills/<skill-name>/SKILL.md` or its `references/`
- Prefer an existing skill; create a new one only when nothing fits
- Boundary: structural review after the edit → `/review-dot-agents-global-and-fix`

## Execute

### 1. Capture Context

> Goal: know exactly what to save

1. Take the input from the argument, a session summary, a keyword, or a recap of the discussion
2. Run `/check-agents-session requests` when the argument points at session history
3. When the input is a URL, fetch and summarize its title and purpose
4. When the input is broad or unclear → `/ask-me` what to save
5. Refuse secret or token content and point the user to a secret manager

### 2. List Existing Skills

> Goal: find the best fit

1. Run `/list-dot-agents-global skills` to see the current packages
2. Run `/update-agents-skills-global` (`## Conventions → Related Skills`) to find adjacent skills
3. Search the repo case-insensitively for the topic
4. Read the 2 to 4 most relevant `SKILL.md` files
5. Compare `description`, `## Scope`, and `related` before deciding

### 3. Decide Placement

> Goal: choose between extending and creating

1. Tool, library, or framework context → the skill with that name
2. Broad topic or guide → add to `related` or `references/`
3. Workflow or pattern → the skill covering that domain
4. Nothing fits → propose a new skill and confirm with `/ask-me`
5. The context duplicates an existing skill → stop and tell the user

### 4. Add To An Existing Skill

> Goal: the context lands in the right section

1. Open the chosen `SKILL.md`
2. A skill name → add it to `related`
3. A URL or resource → add it to `references/`
4. A requirement or step → add a numbered item under `## Execute` or a bullet under `## Rules`
5. Keep the frontmatter intact and the file at 250 lines or less
6. Re-read the frontmatter and `related` after the edit

### 5. Create A New Skill

> Goal: create only when nothing fits

1. Confirm the decision with `/ask-me`
2. Use `/update-agents-skills-global` to scaffold the package
3. Make `name` equal the directory name in `kebab-case` and keep `description` at 100 characters or less
4. Fill `related` with real skills that the body mentions

### 6. Verify

> Goal: the package still passes the standard

1. Re-read the edited file and confirm the links resolve
2. Run `/review-dot-agents-global-and-fix review` for the touched skills
3. Run `/update-references` when a skill was created, renamed, or removed
4. Report No., Skill, Section, Change

## Rules

- Prefer extending an existing skill over creating a new one
- Never add a duplicate reference
- Do not change a `name` or `description` unless the change is necessary
- Never store a secret, token, or key — refuse and point to a secret manager
- Confirm with the user before creating a new skill
- Never use `**` bold; use backticks for names and paths

## Expected Outcome

- The context lives in the right skill with a clear section and references
- The user knows where the context lives and why
- Any new skill passes the conventions and validation
