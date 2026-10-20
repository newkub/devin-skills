---
name: new-skills
description: Create a new devin global skill following the repo standard
argument-hint: "[idea or topic]"
related:
  - use-related-skills
  - follow-single-of-source
  - update-devin-global-skills
  - refactor-skills
  - deep-review
  - scan-codebase
  - review-devin-global-harness
  - deep-validate
  - update-references

---

## Goal

Create one new devin global skill from a given idea or topic, without duplicating existing skills.

## Scope

Use only when work requires creating a new skill — updating an existing skill's content → `/update-devin-global-skills`, refactoring an existing skill's structure → `/refactor-skills`

To create skills from dependencies in a package manifest (`package.json`, `Cargo.toml`) that do not yet exist globally → see the flow in [references/create-skills-from-manifest.md](references/create-skills-from-manifest.md) (adjust the path to `%APPDATA%\devin\skills`)

## Execute

### 1. Clarify Idea

> Goal: understand the skill to create

1. Take the idea or topic from the argument or context
2. If unclear → run `/ask-me` first
3. Summarize the Goal, Scope, target audience, and rough Expected Outcome

### 2. Check Duplicates

> Goal: confirm it does not duplicate existing skills

1. Run `/scan-codebase` to find similar skills
2. Run `/use-related-skills` to consider relatedness/extend/rename — covers both "suggest related skills" and "pick another skill to use" (including what was merged from `use-in-another-skills`)
3. If it heavily duplicates → suggest `/update-devin-global-skills` instead

### 3. Research

> Goal: have correct, up-to-date information

1. If the topic is a library/tool → run `/follow-best-practice` or deep research per `/update-devin-global-skills`
2. Store references in `references/`

### 4. Create Skill

> Goal: create `SKILL.md` and the correct directory structure

1. Use `/update-devin-global-skills` to pick the template and write `SKILL.md`
2. Set `name` to match the directory name and `description` to ≤100 characters
3. Add `related` in full
4. If the skill has a lib/package to install → create `references/apis.md` (+ `references/cli.md` if there is a CLI) per `update-devin-global-skills` `## Conventions → Write References` — metadata table `| key | value |` (package, install cmd, stable version, license, docs/repo URL) + API/CLI tables only, no prose
5. If the file exceeds 250 lines → split parts into `references/`

### 5. Validate And Ship

> Goal: the skill is ready to use

1. Run `/review-devin-global-harness` to check conventions
2. Run `/update-devin-harness` to check global rules alignment
3. Run `/deep-validate` to check frontmatter, links, TODO, placeholders
4. Run `/update-references` to sync references across the repo
5. Run `/ship` when the work is done

## Rules

### 1. Single Skill

- Create one skill per invocation (repeatable when several are needed — supports the capability merged from new-skills)
- If several are needed → repeat this flow one at a time, per the `/update-devin-global-skills` standard

### 2. No Duplicate

- Check for duplicates before creating
- If a similar skill exists → suggest extend or update instead

### 3. Standard Conventions

- Has `## Goal`, `## Scope`, `## Execute`, `## Rules`, `## Expected Outcome`
- Use backticks for commands, skill names, paths
- Write content in English, except headings in Title Case

### 4. Prefix Naming Contract

Pick a prefix by a single semantic only — never create a new skill that violates the contract:

| No. | Prefix | Role | Output | Writes files |
|-----|--------|------|--------|--------------|
| 1 | `check-*` | Detector — checks one thing, fast and deterministic | pass/fail + locations | No |
| 2 | `review-*` | Assessor — assesses one dimension | findings + severity + evidence | No |
| 3 | `deep-*` | Orchestrator over multiple steps/dimensions | dispatches to sub-skills | Per sub-skill |

- Never create new `improve-*` or `optimize-*` — fixers are folded into a `## Fix` section in the matching `review-*` (runs only when the user confirms) — the only exception the user approved: `improve-writing` (writing-quality criteria SSOT, the same precedent as `improve-usage-md` which stays top-level); creating a new exception requires editing this contract + `AGENTS.md` with a user override reason only
- One direction: `check` → `review` → `## Fix` — never reverse
- Write any fix as steps in the review skill's `## Fix` section — never create `workflows/fix-*/` or `references/fix-*.md`
- If a new skill overlaps an existing scope → merge into the existing one instead of creating a new one (`/merge`, `/idea-merge`)

### 5. References

- Record external docs in `references/`
- Check markdown links for breakage
- Update `AGENTS.md` if this skill is a primary workflow

- Use /deep-review if needed
- Use /deep-review if needed
- Use `/follow-single-of-source` if needed

## Expected Outcome

- The new skill lives in `%APPDATA%\devin\skills\<name>\`
- `SKILL.md` has complete frontmatter and content consistent with the goal
- References are not broken
- Passes `/deep-validate`
- Works together with `/update-devin-global-skills` in the creation process
