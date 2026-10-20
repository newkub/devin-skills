---
name: update-project-skills
description: Create and update project skills in .devin/skills/ per the update-devin-global-skills standard
argument-hint: "[scope]"
related:
  - deep-analyze
  - update-devin-global-skills
  - check-monorepo
  - deep-validate
  - update-docs
  - report

---

## Goal

Create and update project-level skills in the project's `.devin/skills/` by analyzing dependencies, workflows, and gaps, then writing according to `/update-devin-global-skills`

## Scope

Use to create or update skills in the project's `.devin/skills/` directory — covering project-needs analysis, template selection, and creating `SKILL.md` plus sub-files. Excludes editing global skills or the project's source code

## Execute

### 1. Prepare Project Context

> Goal: Know the project structure, dependencies, and existing skills

1. Detect the AI tool in use (Devin, Claude Code, Cursor, ...) and select the matching template from `templates/`
2. Check whether the project has a `.devin/skills/` directory:
   - If yes → read all existing skills
   - If no → create the `.devin/skills/` directory
3. Run `/deep-analyze` to analyze the tech stack, dependencies, and workflows
4. Run `/check-monorepo` if the project is a monorepo to identify workspaces
5. Record the project context: stack, dependencies, existing skills, gaps

### 2. Identify Needed Skills

> Goal: Identify the skills the project needs

1. Analyze dependencies from `package.json`, `Cargo.toml`, `go.mod`, `pyproject.toml`, or `requirements.txt`
2. Extract the dependencies that have a skill pattern in the Devin ecosystem
3. Run `/list-devin-global-skills` or scan `%APPDATA%\devin\skills` to see what exists globally
4. For each dependency:
   - If a matching global skill exists → reference the global skill instead of creating a new one
   - If no matching global skill exists and the project needs one → use `/update-devin-global-skills` to create it in `%APPDATA%\devin\skills\`, then reference it in the project
5. Skip dependencies without a skill pattern
6. Analyze project workflows and conventions that should become skills
7. Check the project's `AGENTS.md` for workflows that lack a skill
8. Compile the list of skills to create or update, with priorities

### 3. Create Or Update Skills

> Goal: Create or update skills in `.devin/skills/` per the standard

1. For each skill in the list:
   - Run `/update-devin-global-skills` to create or update the skill package
   - Use `.devin/skills/<skill-name>/SKILL.md` as the target path
   - Select the template based on the skill's prefix
   - Write `SKILL.md` following the `Goal` → `Scope` → `Execute` → `Rules` → `Expected Outcome` standard
2. If a skill has dependencies → create a complete `references/`
3. If a skill has a CLI or web → create a `src/` directory
4. Run `/deep-validate` for each skill after creation
5. If validation fails → fix and revalidate (max 3 → stop/report)

### 4. Update Project AGENTS.md

> Goal: The project `AGENTS.md` references the new skills

1. Run `/update-agents-md` to update the project's `AGENTS.md`
2. Add the new skills to the `### Skills` section of `AGENTS.md`
3. Verify `AGENTS.md` references every created skill
4. If the project has no `AGENTS.md` → run `/update-agents-md` to create one

### 5. Validate And Report

> Goal: Project skills are usable and pass validation

1. Run `/deep-validate` to check the `.devin/skills/` structure and references
2. Run `/follow-tool-madge` if `related` fields were added
3. Run `/report` summarizing:
   - newly created skills
   - updated skills
   - validation results
   - suggested next actions

## Rules

### 1. Follow Write Devin Skills

- Every skill must be written per `/update-devin-global-skills`
- Use the template matching the skill's prefix
- `SKILL.md` must not exceed 250 lines
- Every sub-file must not exceed 250 lines

### 2. Project Skills Directory

- Create skills only in the project's `.devin/skills/`
- Never edit global skills in `%APPDATA%\devin\skills\`
- Never edit the project's source code

### 3. No Commit

- `update-project-skills` does not commit changes
- If used standalone → run `/git-commit` after this skill finishes
- If used within `/update-project` → commit per the `/update-project` workflow

### 4. Global Skills First

- Check global skills before creating a project skill
- Do not create skills that duplicate global skills
- If a matching global skill exists → reference it instead of creating a new one
- If no matching global skill exists and the project needs one → create a new global skill with `/update-devin-global-skills`
- Skip dependencies without a matching skill pattern
- Use /update-docs if needed

## Expected Outcome

- The `.devin/skills/` directory is created if missing
- Required skills are created or updated per the `/update-devin-global-skills` standard
- Every skill passes `/deep-validate`
- The project `AGENTS.md` references all new skills
- A summary report of created/updated skills and next actions

## Common Mistakes

- Forgetting to check whether a dependency already has a skill in the system
- Creating skills that already exist globally
- Not using `/update-devin-global-skills` when creating
- Not checking folder structure after creation

## Anti-Patterns

- Creating skills without checking existing dependencies
- Creating skills manually, outside the standard
- Skipping `/learn` (web) before writing content
- Not checking content quality before delivery
