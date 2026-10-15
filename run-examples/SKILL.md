---
name: run-examples
description: Write examples covering every API in the project
argument-hint: "[scope]"
related:
  - deep-review-codebase
  - follow-tool-vitepress
  - deep-analyze
  - update-docs
  - update-references

---

## Goal

Write examples covering every API in the project

## Scope

Use `run-examples` for the specific tasks and workflows it covers (examples)

## Execute

> Pre-Run: Always run `/deep-review-codebase` first — `run-*` must be reviewed/assessed before the main work, never skip; if findings are blockers, fix or report before running (examples)

### 1. Prepare

> Goal: Prepare

1. Use `/follow-tool-vitepress` to gather reference material
2. Run `/deep-analyze` to get an overview

### 2. Analyze APIs

> Goal: Analyze APIs

1. Read the entry point and index files in each module
2. Identify all APIs from the source code

### 3. Create Structure

> Goal: Create Structure

1. Create an `examples/` directory, or use `apps/examples` for a monorepo
2. Create subdirectories matching the project organization
3. Create a `README.md` describing the structure

### 4. Write Examples per Module

> Goal: Write Examples per Module

1. Write examples for every module, covering every API
2. Write basic usage for each API
3. Write advanced usage for complex use cases
4. Write edge cases and error handling

### 5. Write Integration Examples

> Goal: Write Integration Examples

1. End-to-end use case flows
2. Cross-module integration
3. Error handling flows

### 6. Validate

> Goal: Validate

1. Run the examples to confirm they actually work
2. Check that every API is covered
3. Check that the code is correct and runnable

### 7. Update Documentation

> Goal: Update Documentation

1. Follow `/update-readme-md` for updating README.md
2. Add the written examples into the Usage section of README.md
3. Update the API Reference with complete tables in the format defined in `/update-readme-md`

### 8. Update Reference

> Goal: Update Reference

1. Use `/update-references` to update the references

## Rules

### 1. Structure

- Each example has its own file, with comments and the expected output
- Examples must be genuinely runnable and use best practices
- Cover every public API, both basic and advanced usage
- Include a short description explaining input/output
- Order them by module and complexity

### 2. Monorepo

- Use `apps/examples` for a monorepo
- Use `examples` for a single package

### 3. Dependencies

- Use `workspace:*` for internal dependencies in a monorepo
- Use /update-docs if needed


## Expected Outcome

There are examples covering every API
Every example is genuinely runnable
Users can copy-paste and use them immediately