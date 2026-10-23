---
name: review-dot-agents-global-and-fix-update
description: Keep global rules, skills, and subagents aligned after a change
related:
  - review-dot-agents-global-and-fix
  - update-agents-skills-global
  - update-references

---

## Goal

Keep `AGENTS.md`, the skill packages, and the subagents in `~/.agents` aligned and free of conflicts after renames, merges, or bulk changes

## Scope

- Layers: global rules (`~/.agents/AGENTS.md`), skills (`~/.agents/skills`), subagents (`~/.agents/agents`)
- Update order is rules → skills → subagents
- Boundary: a full review first → `/review-dot-agents-global-and-fix` domain `review`

## Execute

### 1. Inventory

> Goal: read every layer before changing any

1. Read `~/.agents/AGENTS.md`
2. `/list-dot-agents-global` domain `skills` → current package list and counts
3. `/list-dot-agents-global` domain `agents` → current subagent list
4. Record versions, last updated, and critical rules

### 2. Update Each Layer

> Goal: update one layer at a time, in order

1. Rules: edit `AGENTS.md` directly — this skill owns alignment, not rule wording
2. Skills: `/update-agents-skills-global` for the packages that changed
3. Subagents: `/update-devin-global-subagents` for the profiles that changed
4. Record the result of each step

### 3. Detect Misalignment

> Goal: find what no longer agrees

1. Compare rule statements against skill Scope and subagent instructions
2. `/scan-codebase` for references across the repo
3. Check skill and subagent names in `AGENTS.md` and in every skill `related`
4. `/review-dot-agents-global-and-fix` domain `review` argument `broken-refs`
5. Identify layers lagging behind the rules

### 4. Resolve Conflicts

> Goal: remove the conflict at its source

1. Rules versus a skill → adjust the skill, or change the rule when the rule is wrong
2. Subagent calls a missing skill → update the subagent
3. Skill references rules that no longer exist → add or drop the reference
4. `/update-references` to sync the repository
5. `/use-related-skills` to find overlaps before adding a new package

### 5. Validate

> Goal: prove the layers agree

1. `/deep-validate` against `AGENTS.md`
2. `/check-agents-lint` for rule-level findings across the changed packages
3. Recheck subagent frontmatter when a profile changed
4. `git diff --check` for whitespace errors

### 6. Report

> Goal: summarize alignment status

1. `/report` table columns: No., Layer, Status, Changes, Issues
2. List anything still outstanding and why
3. Close with `/suggest-next-action`

## Rules

- Rules before skills before subagents; never skip a layer
- Change only what conflicts or lags behind
- `name` in frontmatter must match the directory; `related` must exist
- Back up `AGENTS.md` before a bulk edit and commit one layer at a time
- Never use `**` bold

## Expected Outcome

- Rules, skills, and subagents aligned with no broken references
- No duplicated or conflicting rules
- An alignment report showing per-layer status and remaining issues
