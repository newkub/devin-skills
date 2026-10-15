---
name: update-devin-project-rules
description: Create and update .devin/rules/ markdown rules (architecture, dependencies, business) per project
argument-hint: "[category|workspace-type]"
related:
  - deep-analyze
  - check-monorepo
  - refactor
  - follow-my-techstack
  - update-agents-md
  - update-dot-devin
  - update-astgrep-rules
  - deep-validate
  - report
---

## Goal

Create and update the project's `.devin/rules/` directory with Devin CLI natural-language markdown rules, organized as `architecture/<workspace-type>`, `dependencies/`, and `business/`, so agents follow the project's real conventions

## Scope

Use to author or refresh `.devin/rules/*.md` — human/agent guidance rules the Devin CLI loads for every session. These are distinct from ast-grep `rules/*.yml` at the project root: `.devin/rules/` holds natural-language conventions an agent reasons about, while ast-grep `rules/` holds machine-enforceable AST patterns (see `/update-astgrep-rules`). Both coexist — never delete one to create the other. Excludes editing global skills and the project source code.

Layout:

```text
.devin/rules/
├─ architecture/
│  ├─ web/         # one folder per workspace type
│  ├─ cli/
│  └─ api/
├─ dependencies/   # allowed/banned libraries + usage conventions
└─ business/       # domain rules, terminology, invariants
```

## Execute

### 1. Analyze Project

> Goal: base every rule on the real project, not guesses

1. Run `/check-monorepo` to learn the workspace layout and workspace types
2. Run `/deep-analyze` to capture the tech stack, chosen architecture, dependencies, and domain
3. Read `AGENTS.md` (architecture decision), the manifests (`package.json`/`Cargo.toml`/`go.mod`/`pyproject.toml`), and `README.md`/`FEATURES.md` for business context
4. Check the existing `.devin/rules/` — if present, read every `.md` to preserve prior intent and update in place
5. Record: workspace types, chosen architecture per workspace, notable dependencies, business/domain facts

### 2. Create Directory Structure

> Goal: the folders match the project's workspace types

1. Create `.devin/rules/` if missing
2. Create `.devin/rules/architecture/` with one subfolder per workspace type detected in Step 1 (e.g. `web/`, `cli/`, `api/`, `mobile/`, `desktop/`, `docs/`) — use `kebab-case` folder names
3. Create `.devin/rules/dependencies/` and `.devin/rules/business/`
4. For a monorepo, cover every workspace type; for a single project, create only the matching type folder(s)
5. Do not create empty files — every `.md` must hold a real rule

### 3. Write Architecture Rules

> Goal: each workspace type has its conventions as agent guidance

1. For each workspace type, write `architecture/<type>/<topic>.md` covering: layer boundaries, folder structure, import direction, naming, and patterns chosen for that type
2. Pull the architecture from `AGENTS.md`; run `/follow-architecture` when the pattern is unclear (Clean for multi-app, Layered for a single app); a rule that only holds after the layout moves → run `/refactor` first, then write the rule
3. One concern per file (e.g. `architecture/web/structure.md`, `architecture/api/layering.md`) — keep each file focused and ≤250 lines
4. Write rules an agent reasons about; anything machine-checkable by AST → hand to `/update-astgrep-rules` instead of duplicating here

### 4. Write Dependencies Rules

> Goal: allowed/banned libraries and how to use them are explicit

1. Write one `dependencies/<dep-or-topic>.md` per notable dependency decision: preferred library over alternatives, banned/deprecated packages, version pinning, import source, feature-flag usage
2. Base every rule on the real manifest entries found in Step 1 — never invent a dependency
3. Reference `/follow-my-techstack` and `/follow-lib-*`/`/follow-tool-*` guidance; a global skill already covering a lib → point to it rather than restating it

### 5. Write Business Rules

> Goal: domain knowledge and invariants the agent must respect

1. Write `business/<topic>.md` for domain terminology, business invariants, validation/tolerance rules, and non-obvious product constraints
2. Derive these from `README.md`, `FEATURES.md`, specs, and existing code — state the source in each rule
3. Keep product/strategy guesses out; only codify facts present in the project

### 6. Validate And Report

> Goal: rules are well-formed, current, and reachable

1. Run `/deep-validate` on `.devin/rules/` — frontmatter parses, files ≤250 lines, no placeholder/TODO, every rule cites real project facts
2. Run `/update-agents-md` so `AGENTS.md` notes that agents must follow `.devin/rules/`
3. Fix failures and revalidate (max 3 → stop and report)
4. Run `/report` summarizing the folders and files created/updated with a `No. | Path | Rule | Status` table, then `/suggest-next-action`

## Rules

### 1. Markdown Rule Format

- Each file is Devin/Cursor-style: YAML frontmatter (`description`, `globs`, `alwaysApply`) then a markdown body — see `references/rule-template.md`
- `alwaysApply: true` for rules relevant in every session; scope others with `globs` and a precise `description`
- Body uses backticks for tools/commands/paths/skills; no `**` bold; content in English

### 2. Coexist With ast-grep

- `.devin/rules/*.md` = natural-language agent guidance; ast-grep `rules/*.yml` = machine enforcement — keep them separate, never delete either to make room for the other
- A rule that can be expressed as an AST pattern belongs in ast-grep, not here

### 3. Evidence Only

- Every rule cites something real in the project (manifest, `AGENTS.md`, code, docs) — no guessed dependencies, versions, or invented policy
- No TODO/MOCK/placeholder — flag uncertainty explicitly or omit the rule

### 4. Structure And Naming

- Folders: `architecture/<workspace-type>/`, `dependencies/`, `business/` only — add subfolders under these, not beside them
- `kebab-case` for all folder and file names; one concern per file; every file ≤250 lines
- Update in place when the file exists; never wipe the directory for a partial refresh

### 5. No Commit

- This skill does not commit; if run standalone → `/git-commit` after it finishes; within `/update-dot-devin`/`/update-project` → commit per that workflow

## Expected Outcome

- `.devin/rules/architecture/<workspace-type>/`, `.devin/rules/dependencies/`, `.devin/rules/business/` exist and match the real project
- Every `.md` has valid frontmatter + a focused, evidence-based rule body, ≤250 lines
- Architecture/dependency/business conventions are captured as agent guidance; AST-checkable items delegated to `/update-astgrep-rules`
- `AGENTS.md` tells agents to follow `.devin/rules/`
- `/deep-validate` passes and a report lists every created/updated rule
