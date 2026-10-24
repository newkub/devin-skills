---
name: learn
description: Learn a concept, tool, or library systematically with research and practice
argument-hint: "[topic]"
related:
  - deep-research
  - follow-best-practice
  - update-examples
  - learn-from-references

---

## Goal

Learn a concept, tool, or library systematically using research and practice to gain deep understanding.

## Scope

Use to learn something new — whether a concept, tool, library, framework, or codebase.

## Execute

### Learn Skills

| Topic | Skill |
|-------|-------|
| Web / Docs | `/learn-from-web` — learn from official docs (DeepWiki, Context7, Web Search), then write comprehensive content |
| CLI tool | `/learn-from-cli` — command surface from `--help`, subcommands, the actual binary |
| Library API | `/check-types-definition` — API surface from `.d.ts` declarations in `node_modules` |
| Codebase | `/learn-from-codebase` — `/deep-analyze` + a learning path and concept map of the codebase |
| Pattern | `/learn-pattern` — extract reusable patterns from real-world code |
| User refs | `/learn-from-references` — extract patterns/conventions from refs the user points to directly (files, repos, docs, skills), then apply them to the current task |
| Slides | `/report-in-slides` — build a Slidev presentation summarizing the knowledge in `.devin/temp/` |

Call the skill from the table according to the topic, then follow the flow inside it — do not execute directly from this table.

### 1. Define Learning Target

> Goal: Define Learning Target

Define the learning target:

1. Identify what you want to learn (concept, tool, library, framework, codebase)
2. Determine the desired depth (overview, intermediate, deep)
3. Identify the main questions you want answered
4. Define the time and scope of learning

### 2. Deep Research

> Goal: Deep Research

Run `/deep-research` to find deep information:

1. Search from NPM, GitHub, DeepWiki, Context7, and WebSearch
2. Read the official documentation of the tool/library being learned
3. Find best practices and common patterns
4. Find examples and tutorials
5. Check version compatibility with the project

### 3. Learn From Sources

> Goal: Learn From Sources

Run `/learn-from-web` to learn from the primary website and `/learn-from-cli` for CLI discovery:

1. Use DeepWiki for GitHub repositories
2. Use Context7 for libraries and frameworks
3. Use Web Search as a fallback
4. Record code examples and configuration examples

### 4. Apply Best Practices

> Goal: Apply Best Practices

Run `/follow-best-practice` to apply the knowledge:

1. Apply the best practices you learned
2. Verify correctness with linter and typecheck
3. Test with the examples you learned
4. Improve based on feedback

### 5. Learn From Code Patterns

> Goal: Learn From Code Patterns

Run `/learn-pattern` to extract reusable patterns

1. Find code patterns from real-world projects
2. Analyze the patterns used in production codebases
3. Identify pattern variants and trade-offs
4. Record the patterns together with their use cases

### 6. Hands-On Practice

> Goal: Hands-On Practice

Practice for real to confirm your understanding

1. Build real usage examples in the project context
2. Try edge cases and error handling
3. Try integration with existing code
4. Compare results against what you learned
5. Run `/update-examples` to create comprehensive examples
6. Record lessons learned and a cheat sheet for future reference

## Rules

### 1. Learning Approach

- Start from the overview before the deep dive
- Use multiple sources to cross-reference
- Practice for real, not just read
- Extract code patterns from real-world projects
- Create examples that are actually usable in the project

### 2. Research Standards

- Run `/deep-research` to find deep information from multiple sources
- Run `/learn-from-web` to learn from the primary website, `/learn-from-cli` for CLI, `/check-types-definition` for API surface
- Check the credibility and freshness of the information
- Record code examples and configuration examples

### 3. Best Practices

- Run `/follow-best-practice` to apply the knowledge according to the standard
- Verify correctness with linter and typecheck
- Run tests to confirm correctness

### 4. Knowledge Retention

- Record the key principles and core concepts
- Record edge cases and common pitfalls
- Create examples for the team
- Share knowledge through documentation

## Expected Outcome

- Deep understanding of the concept, tool, or library
- Complete information from multiple sources
- Recorded code examples and best practices
- Real application of the knowledge with validation
- Lessons learned for future reference
