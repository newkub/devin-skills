---
name: update-dot-agents-project-scaffold
description: Build the root-only .agents layout — hooks, skills, rules, MCP, references
related:
  - update-dot-agents-project
  - check-monorepo
  - deep-analyze
  - update-agents-md
  - update-astgrep-rules
  - deep-validate
---

## Goal

Create or repair the full project `.agents` layout at the repo root, in dependency order

## Scope

- Single project or monorepo; `.agents/` lives at the root only
- Full tree: [references/project-layout.md](../../references/project-layout.md)
- ast-grep YAML rules stay in `rules/` at the project root, outside `.agents/`

## Execute

### 1. Check Project Type

> Goal: know whether the project is a monorepo

1. Run `/check-monorepo`
2. List every workspace from the root manifest when it is a monorepo
3. Record which workspaces already have their own `AGENTS.md`

### 2. Analyze Project

> Goal: capture the facts the layout must reflect

1. Run `/deep-analyze` for tech stack, structure, and patterns
2. Read the root and workspace manifests
3. Record the lint, typecheck, format, and test commands

### 3. Create The Directory Tree

> Goal: the root-only skeleton exists

1. Create `.agents/hooks/`, `.agents/skills/`, `.agents/rules/`, `.agents/mcp/`, `.agents/references/` at the repo root
2. Create only the folders the project needs — omit `skills/`, `mcp/`, or `references/` when unused
3. Never create `.agents/` in a sub-workspace
4. Never create `.agents/workflows/`

### 4. Fill Domains In Order

> Goal: each domain is written by its owning workflow

1. `/update-dot-agents-project rules` — `.agents/rules/`
2. `/update-dot-agents-project hooks` — `.agents/hooks/`
3. `/update-dot-agents-project skills` — `.agents/skills/` when project-specific skills are needed
4. `/update-dot-agents-project mcp` — `.agents/mcp/mcp_config.json` when MCP servers are needed
5. `/update-dot-agents-project references` — `.agents/references/` when generated tables are wanted
6. Keep this order because hooks and rules consume the analyzed commands and conventions

### 5. Align AGENTS.md

> Goal: agents know the project follows `.agents`

1. Run `/update-agents-md` for the root `AGENTS.md`
2. For a monorepo, run `/update-agents-md` for each workspace
3. State in the root file that every workspace `AGENTS.md` must be followed
4. State where hooks, rules, and MCP live under `.agents/`

### 6. Remove Nested .agents

> Goal: no duplicated config in sub-workspaces

1. List every sub-workspace `.agents/` directory
2. Move wanted content up to the root `.agents/` first
3. Delete the sub-workspace copy after the move
4. Verify no sub-workspace contains `.agents/`

### 7. Update Ast-Grep Rules

> Goal: machine-enforced rules match the project

1. Run `/update-astgrep-rules`
2. Keep `sgconfig.yml` at the project root with `ruleDirs` for `rules/dependencies`, `rules/architecture`, and `rules/glob`
3. Set `languageAliases` for TypeScript and JavaScript, and `devPaths` for every source directory
4. Run `bunx ast-grep scan --inspect summary` to verify the rules parse
5. Run the project scan command

### 8. Validate And Report

> Goal: the layout is complete and working

1. Test one hook by editing a file and checking the output
2. Verify every JSON file parses
3. Run `/deep-validate`
4. Run `/report` with No., Path, Action, Status
5. Run `/suggest-next-action`

## Rules

- `.agents/` lives at the repo root only — no `.agents/` in sub-workspaces
- No `.agents/workflows/` directory
- All content inside `.agents/` is English; `kebab-case` for every file and folder
- `.agents/rules/*.md` and ast-grep `rules/*.yml` coexist — never delete one for the other
- Hooks, MCP, rules, references, and skills follow their own workflows — this scaffold only creates the tree and order
- Never use `**` bold; use backticks for tools, commands, and paths

## Expected Outcome

- The root `.agents` tree exists with the domains the project needs
- Every domain was filled by its owning workflow in the documented order
- No sub-workspace contains `.agents/` and no `.agents/workflows/` exists
- `AGENTS.md`, ast-grep `rules/`, and `sgconfig.yml` are aligned with the layout
- Validation passes and the report lists every created path
