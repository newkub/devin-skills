---
name: review-devin-global-skills
description: Review global Devin skills with a Clean Architecture Bun CLI
allowed-tools:
  - read
  - write
  - edit
  - find_file_by_name
  - grep
  - exec
  - ask_user_question
triggers:
  - user
  - model
related:
  - follow-create-bun-cli
  - follow-clean-architecture
  - follow-devin-skills-md
  - review-issue
  - check-circular-dependencies
  - suggest-next-action
---

## Goal

Review the global Devin skills repository for structural, reference, and content issues using automated checks, then create manual review issues for anything that requires human judgment.

## Scope

All `SKILL.md` files and subdirectories under the skills repository. Covers frontmatter, section structure, directory and file naming, file length, missing skill references, and overall content quality.

## Execute

### 1. Run Automated Checks
> Goal: Find structural and reference issues automatically

1. record the target skills directory (default: the parent `skills/` directory)
2. run `bun run src/presentation/cli.ts all` to run every check at once
3. run `bun run src/presentation/cli.ts frontmatter` to validate frontmatter
4. run `bun run src/presentation/cli.ts content-structure` to validate section structure
5. run `bun run src/presentation/cli.ts file-structure` to validate package structure
6. run `bun run src/presentation/cli.ts long-files` to find files over 250 lines
7. run `bun run src/presentation/cli.ts missing-skills` to find broken skill references
8. group findings by severity and fix safe issues in priority order: Critical → High → Medium → Low
9. re-run all checks until no Critical or High issues remain

### 2. Review Issues Manually
> Goal: Catch quality gaps that scripts miss

1. run `find_file_by_name **/SKILL.md` to list all skill definitions
2. read every `SKILL.md` or a representative sample and compare against `follow-devin-skills-md`
3. identify duplicates, missing context, outdated references, and unclear instructions
4. create review issues with `review-issue` for findings that need human judgment

## Rules

- Checker logic lives in `src/modules/review/domain/operations/`; each operation is a pure function under 250 lines
- Application use cases live in `src/modules/review/application/`
- Adapters live in `src/adapters/` and implement the ports in `src/modules/review/ports.ts`
- The CLI entry point is `src/presentation/cli.ts`
- The public library API is exported from `src/index.ts`
- Default review root is the parent `skills/` directory; override with `--root <path>`
- All checks must report `file:line: message` for every finding
- Do not delete or rename the original `improve-*` or `optimize-*` skills unless explicitly asked
- Keep `SKILL.md` files under 250 lines

## Expected Outcome

- A repeatable, validated review of the skills repository
- Clean Architecture source tree with domain, application, adapter, and presentation layers
- Actionable issue reports with file paths and line numbers
- Manual review issues created for high-risk or judgment-based findings
