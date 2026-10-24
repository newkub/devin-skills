---
name: update-examples
description: Write and run examples covering every API — docs, tests, onboarding
argument-hint: "[scope]"
related:
  - deep-analyze
  - scan-codebase
  - update-docs
  - run-dev
  - deep-validate
  - report
  - update-tests
  - run-format
  - run-typecheck
  - update-references
  - deep-review
  - follow-tool-vitepress

---

## Goal

Write examples covering every API in the project to serve as docs, tests, and onboarding material

## Scope

Use `/update-examples` for specific tasks and workflows by creating or improving examples in the `examples/` directory of a library or package

## Execute

> Pre-Run: Run `/deep-review` first — examples are written to be run, so the APIs they show must already be reviewed; if findings are blockers, fix or report before writing

### 1. Analyze APIs

> Goal: Find and group all public APIs

1. Run `/deep-analyze` for an overview
2. Use `/follow-tool-vitepress` to gather reference material when the project has a docs site
3. Run `/scan-codebase` to find all public APIs (exports, functions, classes, types)
4. Read the `package.json` exports field to find entry points
5. Read the entry point and index files in each module
6. Identify all APIs from the source code
7. Group APIs by module/domain

### 2. Plan Examples

> Goal: Plan examples by module and use case

1. Create 1 example file per module/domain in `examples/`
2. Each example covers a real use case, not just hello world
3. Include basic usage, advanced usage, edge cases, and error handling
4. Add comments explaining in plain, easy-to-understand language

### 3. Create Structure

> Goal: Create the correct `examples/` structure

1. Create the `examples/` directory — use `apps/examples` for a monorepo, `examples` for a single package
2. Create subdirectories following the project organization
3. Create a `src/` directory in each example subdirectory
4. Create a `README.md` explaining the structure and how to run
5. In a monorepo, reference internal packages with `workspace:*` dependencies

### 4. Write Examples per Module

> Goal: Write examples that are comprehensive and actually runnable

1. Write examples for every module, covering every API
2. Write basic usage for each API
3. Write advanced usage for complex use cases
4. Write edge cases and error handling
5. Use TypeScript as the default language
6. Each example runs with `bun run examples/<name>.ts`
7. Use `console.log` to display results
8. Write `src/index.ts` so that running the example reactively shows everything present, giving an overview

### 5. Write Integration Examples

> Goal: Write examples covering integrations and flows

1. Write end-to-end use case flows
2. Write cross-module integrations
3. Write error handling flows

### 6. Test Examples

> Goal: Run and verify every example works correctly

1. Run every example with `bun run examples/<name>.ts`
2. Check that the output matches expected
3. If there is an error → fix and rerun
4. Run them all at once — single package: `bun run examples/index.ts`; monorepo: `bun --filter 'examples' run examples` or `bun run --cwd apps/examples <script>`

### 7. Validate

> Goal: Check quality and coverage

1. Run the examples to verify they actually work
2. Verify that every API is covered
3. Verify that the code is correct and runnable
4. Format with `/run-format` after writing
5. Check for type errors with `/run-typecheck`

### 8. Update Documentation

> Goal: Connect the examples to the docs

1. Create `examples/README.md` summarizing all examples
2. Link the examples to the API docs
3. Follow `/update-readme-md` to add examples to the Usage section of README.md
4. Update the API Reference with a complete table following the format defined in `/update-readme-md`
5. If example files were moved or renamed → run `/update-references` to fix stale references

## Rules

### 1. Coverage

- Cover every public API
- Each example has a clear single responsibility
- Do not duplicate tests, but complement them
- Both basic and advanced usage

### 2. Quality

- Examples actually run, with no placeholders
- Use the language's and framework's best practices
- Easy to read and understand without consulting docs

### 3. Structure

- Every example must live in a `src/` directory
- Each example has its own file, with comments and the expected output
- Order by modules and complexity

### 4. Documentation

- Include a short description of the input/output
- `examples/README.md` summarizes all examples
- The main README links to the examples

### 5. Maintenance

- Update the examples when the API changes
- Run the examples in CI to catch breaking changes
- Use `/update-examples` to create new ones

### 6. Monorepo

- Use `apps/examples` for a monorepo, `examples` for a single package
- Order examples by module and complexity

### 7. Dependencies

- Use `workspace:*` for internal dependencies in a monorepo

- Use /run-dev if needed
- Use /deep-validate if needed
- Use /report if needed
- Use /update-tests if needed
- Use /update-usage-md if needed
- Use /update-docs if needed


## Expected Outcome

- The `examples/` directory covers every API
- Every example runs and passes typecheck
- `examples/README.md` summarizes all examples
- The main README has a Usage section with examples
- Usable as docs, tests, and onboarding material
- Users can copy-paste and use it immediately
