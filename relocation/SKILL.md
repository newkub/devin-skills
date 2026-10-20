---
name: relocation
description: Move files and folders to appropriate locations by domain and responsibility
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - update-references
  - use-scripts
---

## Goal

Move files and folders to appropriate locations by domain and responsibility along with updating all import paths

## Scope

Covers moving files/folders and updating all references

## Execute

### 1. Identify File Responsibilities

> Goal: Identify File Responsibilities

1. Analyze the domain or responsibility of each file:
   - `domain`: business logic and entities
   - `ui`: components and layouts
   - `utils`: helper functions and utilities
   - `types`: type definitions and interfaces
   - `api`: API endpoints and handlers
2. Check the dependencies of each file
3. Identify files that are in an inappropriate location

### 2. Plan Relocation Strategy

> Goal: Plan Relocation Strategy

1. Determine the target folder for each file by responsibility
2. Check the dependency direction before moving:
   - high-level modules depend on low-level modules
   - domain depends on shared types, not the other way around
3. Plan the move order to avoid circular dependencies
4. Record the mapping of old path → new path

### 3. Execute File Relocation

> Goal: Execute File Relocation

1. Run `use-scripts` to move files to the appropriate folders
2. Move files in the planned order
3. Check that no files are left behind in the original location
4. Run `/deep-review-codebase` to create barrel exports and configure import aliases for the new folders if necessary

### 4. Update Import Paths

> Goal: Update Import Paths

1. Run `/update-references` to update all references
2. Search for import paths that reference the moved files
3. Update import paths to match the new locations
4. Check that all import paths are correct

### 5. Validate Changes

> Goal: Validate Changes

1. Run type check to confirm the import paths are correct
2. Run build to check that there are no errors
3. Check that there are no new circular dependencies
4. Run `/deep-review-codebase` (architecture dimension) to confirm the new structure

## Rules

### 1. Responsibility-Based Relocation

Move files by domain or responsibility:

- Move by business domain, not by file type alone
- Group by a clear feature or module
- Keep the dependency direction correct
- Avoid moving files across layers unnecessarily

### 2. Dependency Direction

Keep the dependency direction correct:

- high-level modules depend on low-level modules
- domain layers depend on shared types, not the other way around
- UI layers depend on domain layers, not the other way around
- Avoid circular dependencies between folders

### 3. Import And Export Strategy

Update import paths and barrel exports correctly:

- Update import paths immediately after moving files
- Use barrel exports and import aliases to simplify import paths
- Avoid complex deep imports
- Check every import path that references the moved files
- Create `index.ts` for folders that have multiple files
- Use `/deep-review-codebase` to handle barrel exports and import aliases

## Expected Outcome

- Files are in appropriate locations according to responsibility
- Concise and correct import paths
- Correct dependency direction
- No circular dependencies
- Consistent and well-organized structure

## Common Mistakes

Common mistakes:

- Not updating import paths after moving files
- Moving files without analyzing dependencies
- Creating circular dependencies between folders
- Not using barrel exports and import aliases for new folders
- Moving files across layers unnecessarily

## Anti-Patterns

Patterns that should not be done:

- ❌ Moving files without updating import paths
- ❌ Moving files randomly without criteria
- ❌ Creating circular dependencies between folders
- ❌ Not checking dependencies before moving
- ❌ Leaving orphan files behind after moving
