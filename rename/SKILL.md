---
name: rename
description: Rename identifiers, files, directories, or skills in batch with reference updates
argument-hint: "[old-name] [new-name] or <pattern> <replacement> [path]"
related:
  - update-references
  - code-search
  - review-devin-global-harness
  - resolve-errors
  - report
  - use-astgrep
  - fix
---

## Goal

Rename identifiers (variable, function, type, class, interface, enum) in code with ast-grep and update all references safely

## Scope

Rename code identifiers with ast-grep, or rename files/skills/directories with context updates: `name`, `description`, `related`, `AGENTS.md`, `global_rules.md`, paths — including mass/batch file rename by pattern (merged from the old `/batch-rename-files`)

## Execute

### 1. Identify Rename Target

> Goal: Identify the identifier to rename and the scope of the change

1. Identify the old identifier and the desired new name
2. Identify the type: variable, function, type, class, interface, enum, property
3. Identify the language: TypeScript, JavaScript, Rust, Python, etc.
4. Check that the new name does not conflict with an existing identifier
5. If the new name duplicates an existing identifier → stop and report

### 2. Search All References

> Goal: Find all references to the old identifier before renaming

1. Use `ast-grep run -p '$OLD_NAME' --lang <lang> <path>` to find every occurrence
2. Use `grep_search` to search config files, markdown, and non-code files
3. Classify references: definition, call site, type annotation, import/export
4. Record the number of references found to verify after the rename
5. If no references are found → stop and report

### 3. Rename With Ast-grep

> Goal: Use ast-grep to rename the identifier in both definition and usage

1. Batch rewrite multiple files → run `/use-astgrep rewrite` (dry-run + diff preview + confirm built in) instead of running `--rewrite` directly:
   ```sh
   ast-grep run -p 'oldName' --rewrite 'newName' --lang ts <path>
   ```
2. Use interactive mode to review every change before applying — `-i`/`--interactive` or the `/use-astgrep rewrite` flow:
   ```sh
   ast-grep run -p 'oldName' --rewrite 'newName' --lang ts -i <path>
   ```
3. For renames that must match only a specific type (e.g. functions only), create a YAML rule (apply via the `/use-astgrep rewrite` rule-file flow):
   ```yaml
   id: rename-function
   language: TypeScript
   rule:
     pattern: oldName($$$ARGS)
   fix: newName($$$ARGS)
   ```
4. For renames that must match several patterns at once, use the YAML doc separator (`---`) to define multiple rules in a single file:
   ```yaml
   id: rename-def
   language: TypeScript
   rule:
     pattern: function oldName($$$ARGS) { $$$BODY }
   fix: function newName($$$ARGS) { $$$BODY }
   ---
   id: rename-call
   language: TypeScript
   rule:
     pattern: oldName($$$ARGS)
   fix: newName($$$ARGS)
   ```
5. Run `ast-grep scan --config <rule.yml> --update` to apply all rules
6. If ast-grep does not match some cases → use `edit` or `multi_edit` to fix manually

### 4. Update Non-Code References

> Goal: Update references in files that ast-grep does not cover

1. Run `/update-references` to update references in config files, markdown, JSON, YAML
2. Search again with `grep_search` to confirm that no old name remains
3. Update documentation that references the old identifier
4. Update test files that reference the old identifier
5. Update comments that reference the old identifier

### 5. Validate Changes

> Goal: Check that the rename is complete and does not break code

1. Run `grep_search` to search for the old name again → it must not be found (except in git history or unrelated comments)
2. Run typecheck: `bun check` (Bun) or `tsc --noEmit`, or the `typecheck` script
3. Run lint: `biome lint` or `bun run lint`
4. Run tests: `bun run test` or `vitest run`
5. If validation fails → run `/resolve-errors` and fix until it passes (max 3 attempts → stop/report)

### 6. Rename File Or Skill

> Goal: Rename a file, directory, or skill with context updates

1. If renaming a skill → rename the directory with `git mv`
2. Update `name` in the frontmatter to match the directory name
3. Update `description` if the changed name changes the meaning
4. Update `related` if any skill was renamed
5. Update the whole body: `/<old-name>` → `/<new-name>`, paths, and markdown links
6. Update `AGENTS.md` and `global_rules.md` if they contain slash references
7. Run `/update-references` across the repo
8. Run `/review-devin-global-harness` to confirm completeness

### 7. Batch Rename Files By Pattern

> Goal: Rename many files by pattern — preview + collision handling + reference updates

1. Take a pattern + replacement — literal/regex (`-replace`), case transforms, numbering; specify scope: recursive, include/exclude patterns
2. Always preview the `old → new` mapping for every file first (dry-run default); flag issues: collisions (multiple files map to the same name), no-ops, case-only (Windows case-insensitive fs needs two-phase via temp name), locked files (check locked files with handle/Resource Monitor)
3. Confirm before renaming — `git mv` in the repo to preserve history; collisions → two-phase (temp name first); error >0 in critical scope → stop the whole batch
4. Always run `/update-references` — imports, requires, config, docs; search the old filename with `/code-search`; reference updates that are AST patterns → `/use-astgrep rewrite`
5. Verify: build/tests/lint pass; `/report` summarizes renamed / skipped / failed + undo path (`git revert`)

## Rules

### 1. Ast-grep First

Use ast-grep as the primary tool for renaming:

- Use the `--rewrite` flag for quick ad-hoc renames
- Use a YAML rule with the `fix` field for complex renames or ones that must match only a specific type
- Use the `--interactive` flag when every change must be reviewed before applying
- Use meta-variables (`$OLD`, `$$$ARGS`) to capture and replay in the fix
- Use `transform` for case conversion (e.g. camelCase → PascalCase)
- Refer to `/use-astgrep` for detailed ast-grep usage

### 2. Match All Occurrence Types

A rename must cover every usage pattern:

- Function: definition, call site, type reference, import/export
- Variable: declaration, usage, destructuring, reassignment
- Type/Interface: definition, type annotation, generic parameter, import/export
- Class: definition, instantiation, type reference, import/export
- Enum: definition, member access, import/export
- Property: definition, access, destructuring, optional chaining

### 3. Safety And Scope Control

Prevent renaming the wrong thing:

- Use `kind: identifier` in the rule to restrict to identifier nodes only
- Use `constraints` to filter only the identifiers wanted
- Use `files` and `ignores` in the rule to limit the scope
- Check that the new name does not duplicate an existing identifier before renaming
- Use `--interactive` when unsure whether every match is correct

### 4. YAML Rule For Complex Rename

Use a YAML rule when ad-hoc `--rewrite` is not enough:

- Use the YAML doc separator (`---`) to define multiple rules in a single file
- Separate rules for definition and call site clearly
- Use `transform` for case conversion or string manipulation
- Use `rewriters` for nested transformation
- Keep rules in `rules/` if they need to be reused

### 5. Batch File Rename

- Preview the complete `old → new` mapping before executing — do not rename without confirming; collisions/no-ops must be resolved first
- Use `git mv` in the repo — history must not be lost; case-only rename on Windows must be two-phase via temp
- `/update-references` is mandatory every time after a mass rename — verify no old name remains before finishing

### 6. Validation Checklist

Verify after every rename:

- Search for the old name with `grep_search` → it must not be found in code files
- Typecheck passes
- Lint passes
- Tests pass
- The number of new references matches the number of old references recorded

## Expected Outcome

- The identifier is renamed completely across every occurrence
- No broken references in code, config, and docs
- Typecheck, lint, and tests pass
- The rename history can be tracked via git diff
