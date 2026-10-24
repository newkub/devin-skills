---
name: new-skills
description: Create a new devin global skill following the repo standard
argument-hint: "[idea or topic]"
related:
  - follow-single-of-source
  - update-agents-skills-global
  - deep-review
  - scan-codebase
  - review-dot-agents-global-and-fix
  - deep-validate
  - update-references
  - add-to-global-skills
  - reflex-to-improve-dot-agents-global

---

## Goal

Create one new devin global skill from a given idea or topic, without duplicating existing skills.

## Scope

Use only when work requires creating a new skill — updating an existing skill's content → `/update-agents-skills-global`, refactoring an existing skill's structure → `/update-agents-skills-global refactor`, promoting an artifact that already exists (project skill, CLI tool, session) → `/add-to-global-skills`, deciding at the end of a task whether anything is worth improving in any dot-agents layer → `/reflex-to-improve-dot-agents-global`

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
2. Run `/update-agents-skills-global` (`## Conventions → Related Skills`) to consider relatedness/extend/rename — covers both "suggest related skills" and "pick another skill to use"
3. If it heavily duplicates → suggest `/update-agents-skills-global` instead

### 3. Research

> Goal: have correct, up-to-date information

1. If the topic is a library/tool → run `/follow-best-practice` or deep research per `/update-agents-skills-global`
2. Store references in `references/`

### 4. Create Skill

> Goal: create `SKILL.md` and the correct directory structure

1. Use `/update-agents-skills-global` to pick the template and write `SKILL.md`
2. Set `name` to match the directory name and `description` to ≤100 characters
3. Add `related` in full
4. If the skill has a lib/package to install → create `references/apis.md` (+ `references/cli.md` if there is a CLI) per `update-agents-skills-global` `## Conventions → Write References` — metadata table `| key | value |` (package, install cmd, stable version, license, docs/repo URL) + API/CLI tables only, no prose
5. If the file exceeds 250 lines → split parts into `references/`

### 5. Validate And Ship

> Goal: the skill is ready to use

1. Run `/review-dot-agents-global-and-fix` to check conventions
2. Run `/review-dot-agents-global-and-fix` to check global rules alignment
3. Run `/deep-validate` to check frontmatter, links, TODO, placeholders
4. Run `/update-references` to sync references across the repo
5. Run `/ship` when the work is done

## Rules

### 1. Single Skill

- Create one skill per invocation (repeatable when several are needed — supports the capability merged from new-skills)
- If several are needed → repeat this flow one at a time, per the `/update-agents-skills-global` standard

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
| 2 | `review-*` | Assessor entry — one of the nine survivors (`review`, `review-issues`, `review-gaps`, `review-test`, `review-github-pr`, `review-github-issue`, `review-by-all-stakeholder`, `review-dot-agents-global-and-fix`, `review-use-lib-effective`); a new dimension is a matrix row, not a skill. Eleven `review-*` preset doors also exist but are deep orchestrators (engine pipeline), owned by `references/presets.md` — never assessors | findings + severity + evidence | No |
| 3 | `deep-*` | Orchestrator over multiple steps/dimensions | dispatches to sub-skills | Per sub-skill |

- Never create new `improve-*` or `optimize-*` — fixers live in `deep-review-codebase-everything` (`### 7. Fix` + `references/review.md` `## Domain Map` fix owner, runs only when the user confirms) — the only exception the user approved: `improve-usage-md`; creating a new exception requires editing this contract + `AGENTS.md` with a user override reason only
- Two user-approved lifecycle exceptions (2026-10-24): `add-to-global-skills` (artifact → global package promotion) and `reflex-to-improve-dot-agents-global` (end-of-task decision across every dot-agents layer — skill, rule, subagent, hook, MCP, project scaffold — that hands each confirmed item to its layer owner) — each is a single named skill, never a prefix family, so no sibling `add-*`/`reflex-*` skill may be created; a third exception needs this contract + `AGENTS.md` edited with a user override reason
- One direction: `check` → `review` → `### 7. Fix` (`deep-review-codebase-everything/SKILL.md`) — never reverse
- A new review dimension → a new row in `deep-review-codebase-everything/references/review.md` (`## Dimension Matrix`, including its `Check` statement) + a scope-map label, never a new `review-*` assessor dir; a new domain door goes through the preset map instead (next rule); write any fix as a route in `deep-review-codebase-everything/references/review.md` `## Domain Map`, never `workflows/fix-*/` or `references/fix-*.md`
- Ninth survivor override — the user explicitly requested `review-use-lib-effective` (2026-10-22) as the assessor for the `lib-usage` dimension, paired with `/use-lib-effective`; it resolves its matrix row and delegates checks to `/deep-review`, never duplicates the `follow-lib-*` catalog, and never becomes a preset
- A new preset door (the twelve rows in `deep-review-codebase-everything/references/presets.md` `## Preset Map`: the engine plus eleven `review-*` doors) is allowed only when it spans at least two matrix rows and owns a domain-level confirm + fix sequence that the matrix routing cannot express — it is named `review-<domain>`, reuses the `deep-review-codebase-everything` pipeline, stays a single `SKILL.md`, and the general `/deep-review` gains its door + alias; a single-row rename stays a `<label>` call, never a preset
- Every `design-*` opens with `/ask-me` before drafting or building (convention: `update-agents-skills-global` `## Conventions → Templates` row `design-*`)
- If a new skill overlaps an existing scope → merge into the existing one instead of creating a new one (`/merge-files`, `/idea-merge`)

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
- Works together with `/update-agents-skills-global` in the creation process
