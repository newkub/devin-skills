# Post-Merge Verify

Use after merging results from `use-subagents` or after complex implementation — deeper verification than the normal validate pass

## Execute

### 1. Run Automated Checks

> Goal: all automated checks pass

1. Run `/run-verify` to execute lint, format, and quality checks
2. Run `/run-test` to execute unit/integration tests
3. If the project has a `package.json` with a typecheck script, run `bun check` (Bun ≥ 1.4) or the appropriate command
4. Record the result of each check with evidence

### 2. Check References

> Goal: references are not broken

1. Run `/check-reference` to find broken references
2. If the project has skills/workflows referencing each other, verify `related` is correct
3. Verify that moved/deleted/merged files are referenced correctly

### 3. Scan Codebase

> Goal: check codebase structure and quality

1. Run `/scan-codebase` to find files over 250 lines, orphan files, or structural issues
2. Verify there are no circular dependencies between modules
3. Verify the file structure matches the defined architecture

## Rules

### Stop On Failure

- If `/run-test` or `/run-verify` fails → stop immediately
- If `/deep-validate` finds Critical or High findings → stop immediately
- If `/check-reference` finds broken references → stop immediately
- To continue, run `/resolve-errors` then re-verify

### Evidence

- Every finding needs evidence: file path, line number, or command output
- Never cite verify results that were not actually run
