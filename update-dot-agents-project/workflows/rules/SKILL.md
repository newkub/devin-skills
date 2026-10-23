---
name: update-dot-agents-project-rules
description: Create and update .agents/rules markdown rules — architecture, dependencies, business
related:
  - update-dot-agents-project
  - deep-analyze
  - check-monorepo
  - update-astgrep-rules
  - update-agents-md
  - deep-validate
---

## Goal

Create and update `<project>/.agents/rules/` with natural-language markdown rules organized as `architecture/<workspace-type>`, `dependencies/`, and `business/`

## Scope

- `.agents/rules/*.md` is agent guidance that every session loads
- Distinct from ast-grep `rules/*.yml` at the project root — those are machine-enforced AST patterns
- Both coexist; never delete one to create the other
- Template: [references/rule-template.md](../../references/rule-template.md)
- Layout: [references/project-layout.md](../../references/project-layout.md)

## Execute

### 1. Analyze Project

> Goal: base every rule on the real project

1. Run `/check-monorepo` to learn the workspace layout and workspace types
2. Run `/deep-analyze` to capture the tech stack, architecture, dependencies, and domain
3. Read `AGENTS.md`, the manifests, and `README.md` for context
4. Read existing `.agents/rules/*.md` to preserve prior intent and update in place
5. Record workspace types, the chosen architecture, notable dependencies, and domain facts

### 2. Create The Directory Structure

> Goal: the folders match the project's workspace types

1. Create `.agents/rules/` when missing
2. Create `.agents/rules/architecture/` with one `kebab-case` subfolder per workspace type, e.g. `web/`, `api/`, `cli/`, `mobile/`, `desktop/`, `docs/`, `lib/`
3. Create `.agents/rules/dependencies/` and `.agents/rules/business/`
4. For a monorepo, cover every workspace type; for a single project, create only the matching type folders
5. Never create an empty file — every `.md` holds a real rule

### 3. Write Architecture Rules

> Goal: each workspace type has its conventions as agent guidance

1. Write `architecture/<type>/<topic>.md` covering layer boundaries, folder structure, import direction, naming, and chosen patterns
2. Pull the architecture from `AGENTS.md`; run `/follow-architecture` when the pattern is unclear
3. Keep one concern per file and each file at 250 lines or less
4. Hand anything machine-checkable by AST to `/update-astgrep-rules` instead of duplicating it here

### 4. Write Dependencies Rules

> Goal: allowed and banned libraries are explicit

1. Write one `dependencies/<dep-or-topic>.md` per notable decision: preferred library, banned packages, version pinning, import source, feature-flag usage
2. Base every rule on real manifest entries — never invent a dependency
3. Point at an existing `/follow-lib-*` or `/follow-tool-*` skill instead of restating it

### 5. Write Business Rules

> Goal: domain knowledge and invariants the agent must respect

1. Write `business/<topic>.md` for terminology, invariants, validation rules, and non-obvious product constraints
2. Derive each rule from `README.md`, specs, or code and state the source
3. Keep product guesses out — codify only facts present in the project

### 6. Validate And Report

> Goal: rules are well-formed, current, and reachable

1. Run `/deep-validate` on `.agents/rules/` — frontmatter parses, files are 250 lines or less, no placeholder, every rule cites a real fact
2. Run `/update-agents-md` so `AGENTS.md` tells agents to follow `.agents/rules/`
3. Fix failures and revalidate at most 3 rounds, then report and stop
4. Run `/report` with No., Path, Rule, Status
5. Run `/suggest-next-action`

## Rules

- Each file has YAML frontmatter (`description`, `globs`, `alwaysApply`) then a markdown body — see the template
- `alwaysApply: true` for rules relevant in every session; scope others with `globs` and a precise `description`
- `kebab-case` for all folder and file names; one concern per file; 250 lines or less
- `.agents/rules/*.md` and ast-grep `rules/*.yml` stay separate — never delete either
- Evidence only — no guessed dependency, version, or invented policy
- Never use `**` bold; use backticks for tools, commands, and paths

## Expected Outcome

- `.agents/rules/architecture/<workspace-type>/`, `.agents/rules/dependencies/`, and `.agents/rules/business/` match the real project
- Every `.md` has valid frontmatter and an evidence-based body of 250 lines or less
- AST-checkable items are delegated to `/update-astgrep-rules`
- `AGENTS.md` tells agents to follow `.agents/rules/` and validation passes
