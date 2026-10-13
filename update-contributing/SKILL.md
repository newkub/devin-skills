---
name: update-contributing
description: Update CONTRIBUTING.md to match the project's workflows and conventions
argument-hint: "[scope]"
related:
  - update-docs
  - deep-validate
  - check-reference

---

## Goal

Create or update `CONTRIBUTING.md` so it reflects the project's development approach, conventions, and validation workflows

## Scope

Use for any project that needs a CONTRIBUTING guide

## Execute

### 1. Gather Project Context

> Goal: Collect the project information

1. Read `package.json`, `README.md`, `AGENTS.md`
2. Read `rules/` (ast-grep) or the project rules
3. Read the `docs/` related to development
4. Identify the tech stack, package manager, and scripts

### 2. Identify Contributing Sections

> Goal: Identify the sections

1. Prerequisites (tools, versions)
2. Setup / installation
3. Development workflow (dev, build, test, lint, typecheck)
4. Git conventions (branch, commit message)
5. Code style and rules
6. Validation before PR
7. How to add workspaces/packages
8. Where to get help

### 3. Write Or Update

> Goal: Write or update `CONTRIBUTING.md`

1. Use real project data, never placeholders
2. Use bullet points and example commands
3. Reference `AGENTS.md` and `README.md`
4. Name the real scripts, e.g. `bun run check`, `moon run :build`

### 4. Coordinate With Other Files

> Goal: Coordinate with the other docs

1. Check that the conventions match `AGENTS.md`
2. Check that the scripts match `package.json`
3. Update the links in `README.md` pointing to `CONTRIBUTING.md`

### 5. Validate

> Goal: Check the quality

1. Run `/deep-validate` to check Markdown quality
2. Run `git diff --check` to find whitespace errors
3. Run `/check-reference` to check the links

## Rules

### 1. No Placeholders

- Use real commands, paths, and versions
- Do not add TODO or MOCK without a stated reason

### 2. Conciseness

- No more than 250 lines
- Favour short bullet points

### 3. Cross-References

- Reference `README.md`, `AGENTS.md`, `docs/`
- Use relative links
- Use /update-docs if needed


## Expected Outcome

- `CONTRIBUTING.md` is complete and consistent with the project
- Passes `/deep-validate` and `/check-reference`
- No whitespace errors

