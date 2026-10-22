---
name: update-references
description: Update all related references when a file is edited, moved, or deleted
argument-hint: "[scope]"
related:
  - use-related-skills
  - search
  - deep-review
  - report
  - deep-validate

---
## Goal

Update all related references when a file is edited, moved, or deleted, covering every location that stores references

## Scope

Use when:
- Editing a file that is referenced by other files
- Moving a file to a new location
- Renaming a file
- Deleting a referenced file
- Renaming a workflow or skill

Covers:
- Global workflows (`~/.codeium/windsurf/global_workflows/`)
- Global skills (`%APPDATA%\devin\skills\` or `~/.codeium/windsurf/skills/`)
- Project codebase (source code, configs, docs)
- `rules/` (ast-grep) at the repo root
- `AGENTS.md` in each workspace
- Workspace workflows (`.devin/workflows/`, `.windsurf/workflows/`)

## Execute

### 1. Identify Changed Files

> Goal: Identify the changed files

1. Identify files edited, moved, renamed, or deleted in the current task
2. Run `git status --porcelain` to see all changed files
3. Identify the change type: move, rename, delete, or content edit

### 1.5 Check File Relations

> Goal: Understand the relationships of the changed files before searching

1. Run `/deep-review` on the changed files to find imports, consumers, and references
2. Record the relation map: target → consumers → severity
3. Use this result as the basis for the search strategy in Step 2

### 2. Search For References

> Goal: Find all related references

1. Search global workflows with `findstr` or `Grep`
2. Search global skills with `findstr` or `Grep`
3. Search the project codebase with `Grep` or `ast-grep`
4. Search `rules/` at the repo root
5. Search `AGENTS.md` of every workspace
6. Search workspace workflows (`.devin/workflows/`, `.windsurf/workflows/`)
7. Search old file names, old paths, import statements, and workflow references

### 3. Update References

> Goal: Update all references according to the change type

#### 3.1 Move File

1. Update all import paths in the codebase
2. Update all file path references in global workflows and skills
3. Update all workflow references

#### 3.2 Rename File

1. Update all import statements in the codebase
2. Update all file name references in global workflows and skills
3. Update all workflow references

#### 3.3 Delete File

1. Remove import statements that reference the deleted file
2. Remove all references in global workflows and skills
3. Fix code that used the deleted file

#### 3.4 Rename Workflow Or Skill

1. Update references in global workflows (`old-name` → `new-name`)
2. Update references in global skills
3. Update references in `AGENTS.md` of every workspace
4. Update references in `rules/` at the repo root
5. Update references in workspace workflows
6. Update references in the project codebase

### 4. Verify Updates

> Goal: Verify the correctness of the updates

1. Search for old references again in every location to confirm none remain
2. Run linting if present
3. Run typecheck if present
4. Run tests if present

## Rules

### 1. Search Strategy

Search references comprehensively:

- Search both absolute and relative paths
- Search both file names and extensions
- Search both import statements and string references
- Search in all file types (.ts, .js, .md, .json, .yml, .jsonc)
- Search in global workflows, global skills, codebase, `rules/`, `AGENTS.md`, workspace workflows

### 2. Update Strategy

Update references correctly:

- Update every reference found, not leaving a single one
- Keep import style consistent
- Keep path format consistent
- Verify that the updates don't introduce syntax errors
- When renaming a workflow, update both `title` and `related_workflows` in referencing files

### 3. Verification

Verify correctness:

- Verify that no old references remain in any location
- Verify that the new references are correct
- Verify that the code still works
- Verify that there are no broken imports

- Use /use-related-skills if needed
- Use /update-references if needed
- Use /code-search if needed
- Use /report if needed
- Use /deep-validate if needed

## Expected Outcome

- All references are fully updated in every location
- No old references remain
- The code still works after the updates
- No linting or type errors
