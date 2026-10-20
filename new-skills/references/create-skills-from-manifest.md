# create-skills-from-manifest (merged content)

## Goal

Create the skills missing from the dependencies in the package manifest that do not yet exist in the global

## Scope

Covers reading the package manifest, checking the global skills, and creating the missing skills

## Execute

### 1. Read Package Manifest

> Goal: Read Package Manifest

1. Read `package.json` or `Cargo.toml` from the workspace
2. Extract the list of dependencies that have skills in the Devin global skills
3. Filter to only the dependencies that have official skills

### 2. Check Skills In Global

> Goal: Check Skills In Global

1. Read the list of skills in `%APPDATA%\devin\skills`
2. Compare the dependencies with the existing skills
3. Identify the skills that do not yet exist in the global

### 3. Create Missing Skills

> Goal: Create Missing Skills

1. Run `/update-devin-global-skills` for each missing skill
2. Create the folder structure per the standard
3. Write the SKILL.md index and content files
4. Use `/learn` (web) before writing the content

### 4. Update Test Specs

> Goal: Create/update `<workspace>/specs/` for test specs

1. Run `/update-specs` to create/update `specs/overview.md` and `specs/SPEC.md`
2. Check that the spec files match the project type and dependencies
3. If it fails → retry (max 3 → stop/report)

### 5. Validate And Finalize

> Goal: Validate And Finalize

1. Verify that all skills have been created
2. Use `/deep-review-codebase` for every file
3. Verify the folder structure is correct
4. Use `/update-references` if there are file operations

## Rules

### 1. Package Manifest Detection

Check the package manifest type:

- `package.json` for JavaScript/TypeScript projects
- `Cargo.toml` for Rust projects
- `pyproject.toml` or `requirements.txt` for Python projects

### 2. Skills Mapping

Map the dependencies to the skills available in the Devin global skills:

- Read the skills list from `%APPDATA%\devin\skills`
- Check whether the dependency has an official skill
- Filter to only the dependencies that have skills in the system

### 3. Global Skills Location

Location of the global skills:

- `%APPDATA%\devin\skills`
- Check each skill folder
- Read SKILL.md to confirm the skill actually exists

### 4. Batch Creation

Create skills in a batch:

- Create all the missing skills at once
- Use `/update-devin-global-skills` for each skill
- Maintain consistency throughout

### 5. Error Handling

Handle errors:

- Skip dependencies that have no skills
- Skip skills that already exist
- Record the skills that failed to be created

- Use /use-scripts if needed
- Use /check-reference if needed
- Use /report-config-files if needed

## Expected Outcome

- All skills from the dependencies are created in the global
- The folder structure is correct per the standard
- The content is high quality and complete
- No duplicate skills

## Common Mistakes

- Forgetting to check whether the dependency has a skill in the system
- Creating skills that already exist in the global
- Not using `/update-devin-global-skills` to create them
- Not checking the folder structure after creation

## Anti-Patterns

- ❌ Creating skills without checking the existing dependencies
- ❌ Creating skills manually without following the standard
- ❌ Skipping `/learn` (web) before writing the content
- ❌ Not checking the content quality
