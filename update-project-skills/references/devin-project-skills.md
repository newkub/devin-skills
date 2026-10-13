# update-devin-project-skills (merged content)

## Goal

Update the existing project-local skills in `.devin/skills/` to match changed project conventions and workspace requirements

## Scope

For updating skills in a project or workspace `.devin/skills/` — to create a new skill, run `/follow-create-devin-project-skills` instead. Not for global skills in `%APPDATA%\devin\skills` (use `/update-devin-global-skills`)

See also: /follow-create-devin-project-skills, /update-devin-global-skills, /update-agents-md

## Execute

### 1. Detect Update Needs

> Goal: Know which skills need updating

1. Read the root and workspace `AGENTS.md`
2. Read `package.json` and all changed scripts
3. Identify workflows or patterns that have changed since the skill was created
4. Check the existing `.devin/skills/` for stale skills
5. If `.devin/skills/` does not exist yet → hand off to `/follow-create-devin-project-skills`

### 2. Apply Updates

> Goal: Bring skills up to date

1. Follow the standards from `/follow-create-devin-project-skills` — structure, naming, content rules
2. Update commands, paths, and conventions to match the current `AGENTS.md` and manifests
3. Remove commands/steps the project no longer has
4. Use English throughout for project-local skills
5. Change only what actually changed — avoid rewriting a whole file unnecessarily
6. Stay under 250 lines — move details to `references/`

### 3. Sync With AGENTS.md

> Goal: Make AGENTS.md reference the skills correctly

1. Update the root and workspace `AGENTS.md` to match the edited skills
2. Check that each skill's `related` entries are not broken
3. Run `/update-dot-devin` if the `.devin/` manifest needs updating

### 4. Validate

> Goal: Confirm the skills are correct

1. Run `/deep-validate`
2. Check that `name` matches the directory name
3. Check that there are no TODO/MOCK/placeholder entries
4. If validation fails → fix (max 3 rounds)

### 5. Report

> Goal: Summarize results

1. Run `/report table` showing skill, status, location
2. Run `/suggest-next-action`

## Rules

### 1. Update Only

- This skill only updates — to create new skills use `/follow-create-devin-project-skills`
- Applies only to `.devin/skills/` — for global skills use `/update-devin-global-skills`

### 2. English Content

- Project-local skills are written in English
- Unless the project specifies another language

### 3. Minimal Changes

- No duplication with global skills
- Change only what actually changed; preserve existing conventions
- Stay under 250 lines; move details to `references/` when needed

### 4. Valid References

- `related` must point to skills that actually exist
- No broken references

## Expected Outcome

- `.devin/skills/` holds up-to-date skills matching current project workflows
- `AGENTS.md` references the skills correctly
- Skills pass `/deep-validate`
- A report table summarizes the results
