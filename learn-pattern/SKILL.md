---
name: learn-pattern
description: Learn from patterns found in codebases, competitors, or real-world implementations
argument-hint: "[target]"
related:
  - scan-codebase
  - use-astgrep
  - deep-research
  - bench-competitors
  - follow-best-practice
  - learn
  - generalize

---

## Goal

Extract knowledge and reusable patterns from existing code, competitors, or real-world implementations to apply them in the project

## Scope

Use to learn from patterns found in the current codebase, competitor code, open-source projects, or real implementations, in order to extract and apply them

## Execute

### 1. Define Pattern Target

> Goal: Define Pattern Target

Define the learning target:

1. Identify the type of pattern you want to learn (architecture, design, code, UX, data flow)
2. Identify the source to study: current codebase, competitor code, open-source project, or reference implementation
3. Determine the depth: overview, intermediate, deep
4. Identify the context in which you want to apply the pattern

### 2. Discover Patterns

> Goal: Discover Patterns

Find patterns from the specified source:

1. Run `/scan-codebase` to find code patterns in the current codebase
2. Run `/scan-codebase` to scan for recurring structures
3. Run `/use-astgrep` for AST-based pattern discovery
4. If studying from open-source, run `/deep-research` to find reference projects
5. If studying from a competitor, run `/bench-competitors` to analyze the competitor's patterns

### 3. Extract And Document Patterns

> Goal: Extract And Document Patterns

Extract and document the patterns found:

1. Group the patterns by type (structural, behavioral, creational)
2. Record each pattern together with: name, description, code example, use case, pros/cons
3. Identify the contexts where the pattern is suitable and unsuitable
4. Record variations and alternative approaches
5. Identify related anti-patterns to avoid

### 4. Validate Patterns

> Goal: Validate Patterns

Verify correctness and compatibility:

1. Check that the pattern complies with the `/follow-best-practice` of the tech stack in use
2. Compare against the official documentation by running `/learn` (web)
3. Check version compatibility with the current project
4. Test the pattern against a real use case in the project
5. Check that the pattern does not conflict with the existing architecture

### 5. Apply Patterns

> Goal: Apply Patterns

Apply the patterns in the project:

1. Run `/generalize` to make the pattern generic for reuse
2. Adapt the pattern to the project context and conventions
3. Implement it where appropriate, following `/deep-review`
4. If more than 10 files must be edited, run `/use-scripts` for batch transformations
5. Run `/run-verify` to check quality after implementing

### 6. Document And Share

> Goal: Document And Share

Produce documentation and share the knowledge:

1. Create pattern documentation in `docs/development/patterns/`
2. Write examples for each pattern by running `/update-examples`
3. Update `AGENTS.md` if the pattern is a project-wide convention
4. Share with the team through documentation or code review

## Rules

### Pattern Discovery

- Use `/scan-codebase` to find patterns in the codebase
- Use `/use-astgrep` for AST-based structural pattern matching
- Use `/scan-codebase` for quick pattern scanning
- Look for both positive patterns (good) and anti-patterns (bad)

### Pattern Documentation

- Each pattern must have: name, description, code example, use case, pros/cons
- Identify the suitable and unsuitable contexts
- Record variations and alternatives
- Use language that is easy to understand, not academic terminology

### Validation Standards

- Run `/learn` (web) to cross-reference with official docs
- Run `/follow-best-practice` to check the standards
- Test the pattern against a real use case before adopting
- Always check version compatibility

### Application Discipline

- Run `/generalize` to make it reusable and not overly specific
- Adapt the pattern to the project context, do not copy it directly
- If more than 10 files must be edited, run `/use-scripts`
- Always run `/run-verify` after implementing

### Non-Duplication

- Use `/learn` to learn a general concept or tool
- Use `/learn` (web) to learn from official documentation
- Use `/extract-pattern` to write pattern rules from the given data
- This workflow focuses specifically on extracting and applying patterns from real-world code

## Expected Outcome

- Patterns extracted from real code, together with documentation
- Clear code examples and use cases
- Patterns validated against official docs and best practices
- Real application of the patterns in the project with quality checks
- A pattern library for the team in `docs/development/patterns/`

