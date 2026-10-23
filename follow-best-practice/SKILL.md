---
name: follow-best-practice
description: Write according to best practices for the given context
argument-hint: "[topic]"
related:
  - learn-from-web
  - deep-research
  - search-skills
  - follow-my-techstack
  - review-use-lib-effective
  - update-agents-skills-global

---

## Goal

Write according to best practices for the given context

## Scope

Apply to every workspace and every kind of work (code, workflow, config, documentation) so results are high quality and follow standards

- Checking whether an existing dependency is used the way its owner skill prescribes → `/review-use-lib-effective`

## Execute

### 1. Analyze Context

> Goal: Identify the context, the real stack, and the skill that already owns each dependency

1. Identify the context of the work (code, workflow, config, documentation, etc.)
2. For code: read the package manifest — `package.json` with its lockfile, `Cargo.toml`, `pyproject.toml`, `go.mod`, or the workspace manifests — and enumerate the real dependencies, scripts, and versions; never assume a dep the manifest does not declare
3. For code: identify the language, runtime, and libraries from that manifest plus the imports actually present
4. Map every dependency to the skill that owns it — `/search-skills <keyword>` for `follow-lang-*`, `follow-lib-*`, `follow-tool-*`, `follow-service-*`, with `/follow-my-techstack` as the canonical catalog when the dep is new or the choice is open
5. Read each owner skill's `best-practices/` first (flat `.md` files — recommended patterns, pitfalls, do/don't), then its `references/`/`usecases/` when the API shape matters — that is the harness SSOT for the dep, written from real research
6. Summarize before writing anything: stack, owner skills found with the `best-practices/` files read, and the gaps (a dep with no owner skill, or an owner skill with no `best-practices/`)

### 2. Research Best Practices

> Goal: Research current best practices from credible sources — the owner skill first, the web only for gaps

1. Order of authority: manifest facts → project conventions (`AGENTS.md`, `.devin/rules`, existing code) → the owner skill's `best-practices/` → web sources
2. Follow `/learn-from-web` for systematic learning from web sources — for the gaps only, never re-research what `best-practices/` already answers
3. Follow `/deep-research` when deep information from multiple sources is needed
4. Verify the information is current against the version the manifest installed — a practice for another major version is not a best practice for this repo
5. A dep with no owner skill or no `best-practices/` → research it, then persist the result through `/update-agents-skills-global` (create the skill or backfill the file) instead of leaving it in chat

### 3. Apply Best Practices

> Goal: Apply the learned best practices to improve files per context

1. Read all files that need improvement
2. Analyze what these files need per the best practices of that context
3. Edit the files according to the learned best practices
4. Cite the source of each change — the `best-practices/` file and section, the project convention, or the web source
5. Check consistency with what already exists
6. Update the relevant configuration and settings
7. Document the recommended patterns and conventions

### 4. Verify Implementation

> Goal: Confirm the best practices are fully applied with no regressions

1. Run linter and typecheck to verify
2. Run tests to confirm no regressions
3. Re-read the `best-practices/` of every dep touched — no do/don't may be violated by the final diff
4. Verify the best practices have been fully applied
5. Update documentation if needed
6. Try out the usage per the best practices
7. Record lessons learned

## Rules

### 1. Research Sources

Use reliable sources for best practices

- Official documentation as the primary source
- Community guidelines and style guides
- Well-known blogs and articles
- Widely used GitHub repositories
- Stack Overflow for common issues
- Use `/learn-from-web` as the primary workflow for learning
- Use `/deep-research` when deep information from multiple sources is needed

### 2. Language-Specific Conventions

Follow each language's conventions

- TypeScript: follow TypeScript best practices
- Rust: follow Rust guidelines
- Go: follow Go conventions
- Python: follow PEP 8 and best practices
- Use linters suited to each language

### 3. Library-Specific Patterns

Use patterns suited to each library

- React: use hooks patterns and component patterns
- Vue: use the composition API and best practices
- Prisma: use schema best practices and queries
- Read each library's documentation thoroughly
- Check examples from official sources

### 4. Runtime Considerations

Consider the characteristics of the runtime in use

- Node.js: use async patterns and event loop best practices
- Bun: use Bun-specific APIs and native features
- Deno: follow Deno security and module patterns
- Browser: consider performance and compatibility
- Server: consider security and scalability

### 5. Consistency Maintenance

Keep consistency across the codebase

- Use consistent naming conventions
- Use consistent code style
- Use consistent patterns
- Configure automatic linter and formatter
- Do code review to verify

### 6. Manifest And Owner Skills

Every practice must trace to the manifest or an owner skill — never to memory alone

- Start from the package manifest and its lockfile — the deps, scripts, and versions there are the only facts about the stack
- Every dep in the manifest that a `follow-*` skill owns → read that skill's `best-practices/` before writing code; when the file and generic web advice disagree, the `best-practices/` file wins
- A dep with no owner skill, or an owner skill with no `best-practices/` → research it, then persist it via `/update-agents-skills-global` (new skill or backfilled `best-practices/` file) — a gap that stays in chat is lost
- Project conventions (`AGENTS.md`, `.devin/rules`, existing patterns) outrank generic best practices — apply the practice with a minimal diff, never rewrite the whole file to match a guide

## Expected Outcome

- Results written per the best practices of the context
- High quality and maintainable
- Consistency across the project
- Correct and up-to-date best practices
- Suitable patterns and conventions
- Every dependency touched is covered by its owner skill's `best-practices/`, or the gap is recorded and routed to `/update-agents-skills-global`