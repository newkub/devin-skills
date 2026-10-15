---
name: update-dot-devin
description: Build the .devin structure at the repo root (hooks, skills, MCP, rules) — no workflows/
argument-hint: "[scope]"
related:
  - check-monorepo
  - deep-analyze
  - update-devin
  - update-project-skills
  - update-devin-project-rules
  - update-devin-global-skills
  - update-docs
  - run-lint

---

## Goal

Create the `.devin` structure at the repo root for the project workspace — hooks, skills, MCP, and `.devin/rules/` markdown rules — with no `workflows/` directory

## Scope

Use to create the `.devin` structure in any project workspace. `.devin/rules/` holds natural-language markdown rules (architecture, dependencies, business) authored via `/update-devin-project-rules`; ast-grep YAML rules live in `rules/` at the project root — both coexist. For a monorepo, create `.devin` at the root only; each workspace has its own `AGENTS.md`. Do not create `.devin/` in sub-workspaces.

## Execute

### 1. Check Project Type

> Goal: Check the project type to determine the structure

1. Run `/check-monorepo` to check whether the project is a monorepo
2. If it is a monorepo, follow the Monorepo section below
3. If it is not a monorepo, follow the Single Project section

### 2. Analyze Project

> Goal: Analyze the project to see its tech stack, structure, and patterns

1. Run `/deep-analyze` to see the tech stack, structure, and patterns
2. Read `package.json` at both root and workspace level to see all dependencies

### 3. Setup Project Rules And Remove Nested Config

> Goal: create `.devin/rules/` markdown rules and remove `.devin/` from sub-workspaces

1. Run `/update-devin-project-rules` to create/update `.devin/rules/` — `architecture/<workspace-type>/`, `dependencies/`, `business/` (natural-language markdown rules)
2. These `.devin/rules/*.md` are agent guidance and are separate from ast-grep `rules/*.yml` at the project root (Step 7) — keep both, never delete one for the other
3. If a monorepo → delete `.devin/` in every sub-workspace (move wanted content such as skills/hooks/rules up to the root `.devin/` first)
4. `.devin/` lives at the repo root only — sub-workspaces have just `AGENTS.md`

### 4. Setup Hooks

> Goal: Create hooks for Cascade

1. Read https://docs.devin.ai/cli/extensibility/hooks/overview to understand hooks
2. Run `/update-devin-project-hooks` to create `.devin/hooks/` with `run-lint.ts`, `run-typecheck.ts`, and `hooks.json`
3. Follow the Rules section below for the hook format

### 5. Setup Workspace AGENTS.md (Monorepo Only)

> Goal: For a monorepo, create an `AGENTS.md` for each workspace without creating `.devin/` in sub-workspaces

1. Identify all workspaces from the root `package.json` `workspaces` field
2. For each workspace:
   1. Run `/update-agents-md` for that workspace to write its `AGENTS.md`
   2. Reference the dependencies in `<workspace>/package.json` to write workspace-specific instructions
3. Run `/update-agents-md` for the root `AGENTS.md`, stating that each workspace's `AGENTS.md` must be followed
4. Verify that no sub-workspace contains a `.devin/` directory

### 6. Setup Skills And MCP

> Goal: Configure project-local skills and MCP servers

1. Read https://docs.devin.ai/cli/extensibility/skills/overview to understand skills
2. Read https://docs.devin.ai/cli/extensibility/mcp/overview to understand MCP
3. Run `/update-project-skills` to create/update `.devin/skills/`
4. Run `/update-devin-project-mcp` to configure `.devin/mcp_config.json`

### 7. Update Ast-Grep Rules

> Goal: Write ast-grep rules in the `rules/` directory at the project root per the devin rules created

1. Run `/update-astgrep-rules` to create/update ast-grep rules from a re-analysis of the project
2. Canonical layout: `rules/dependencies/`, `rules/architecture/`, `rules/glob/` at the project root (ast-grep YAML — separate from `.devin/rules/*.md` markdown rules authored in Step 3)
3. Update `sgconfig.yml` so `ruleDirs` points to `rules/dependencies`, `rules/architecture`, and `rules/glob`
4. Set `sgconfig.yml` `languageAliases` for TypeScript and JavaScript file extensions
5. Set `sgconfig.yml` `devPaths` for the source directories to scan
6. Run `bunx ast-grep scan --inspect summary` to verify the rules parse
7. Run `bun run scan` to scan the whole codebase

### 8. Remove Workflows Directory

> Goal: Delete the `.devin/workflows/` directory if it exists

1. Check whether the `.devin/workflows/` directory exists
2. If it does, delete the whole directory

### 9. Test And Validate

> Goal: Test and verify

1. Test the hooks by editing code
2. Check exit codes and output
3. Verify the JSON configuration is correct
4. Verify there is no `.devin/workflows/` directory
5. Verify the ast-grep rules in `rules/` at the project root work

## Rules

### 1. No Workflows Directory

- The `.devin/workflows/` directory is forbidden
- If it exists, delete it

### 2. Content Language

- All content inside `.devin/` must be in English

### 3. File Structure

- `.devin/` lives at the repo root only — with `hooks/`, `skills/`, `rules/`, `mcp_config.json` — never `workflows/`
- `.devin/rules/` holds markdown agent-guidance rules; ast-grep YAML rules live in `rules/` at the project root — keep both
- Name files with `kebab-case`
- For a monorepo, each workspace must have its own `AGENTS.md`; do not create `.devin/` in sub-workspaces

### 4. Root-Only .devin

- `.devin/` lives at the repo root only — no `.devin/` in sub-workspaces
- If `.devin/` is found in a sub-workspace → move wanted content up to the root, then delete it

### 5. Rules Update

- Use `/update-devin-project-rules` to write and update `.devin/rules/` markdown rules (architecture, dependencies, business)
- Use `/update-astgrep-rules` to write and update ast-grep rules in `rules/` at the root
- Use `/update-devin-project-hooks` to write and update `.devin/hooks/`
- Use `/update-project-skills` to create `.devin/skills/`
- Use `/update-devin-project-mcp` to configure `.devin/mcp_config.json`
- Use `/update-devin-global-skills` to create/update the global skills the project needs
- Rules must match the dependencies in `package.json`

### 6. AGENTS.md Update

- Use `/update-agents-md` to write `AGENTS.md` for both root and workspaces
- The root `AGENTS.md` must state that each workspace's `AGENTS.md` is to be followed
- Each workspace must have its own `AGENTS.md`

### 7. Hook Format

- Hook configuration format per https://docs.devin.ai/cli/extensibility/hooks/overview
- Use the `post_write_code` event to run lint after writing code
- Run hooks with `bun .devin/hooks/run-lint.ts`

### 8. TypeScript Scripts

- Create scripts in the `.devin/hooks/` directory
- Run them with `bun .devin/hooks/run-lint.ts`
- Parse JSON input from stdin

### 9. Ast-Grep Rules

- Use `/update-astgrep-rules` to create ast-grep rules in `rules/` at the project root
- `sgconfig.yml` must point `ruleDirs` to `rules/dependencies`, `rules/architecture`, and `rules/glob`
- ast-grep rules (YAML) live in `rules/` at the project root; markdown guidance rules live in `.devin/rules/` — both coexist
- `sgconfig.yml` must have `languageAliases` for `ts`, `tsx`, `js`, `jsx`
- `sgconfig.yml` must have `devPaths` for each workspace's source directories

### 10. Sgconfig Configuration

- `sgconfig.yml` must be at the project root
- `ruleDirs` must list all 3 directories: `rules/dependencies`, `rules/architecture`, `rules/glob`
- `languageAliases` must map `ts` and `tsx` to `TypeScript`, and `js` and `jsx` to `JavaScript`
- `devPaths` must list each workspace's source directories for precise scanning
- `testConfigs` is for the ast-grep rules' test directory
- For a monorepo, list `devPaths` for every workspace that has source code

### 11. Workspace-Specific Rules

- For a monorepo, each workspace may have its own ast-grep rules in `rules/` at the project root, using the `files` field to limit scope
- Use the `files` field in ast-grep rules to specify which workspace the rule applies to
- Use the `ignores` field to exclude files that should not be checked
- No `.devin/` in sub-workspaces — write workspace-specific conventions in the workspace `AGENTS.md` instead
- Workspace-specific ast-grep rules live in `rules/` at the project root as YAML, using the `files` field to limit scope

### 12. Hook Scripts Best Practices

- Hook scripts must use the `bun` runtime only, never `node` or `npx`
- Hook scripts must parse JSON input from stdin
- Hook scripts must have the `shebang` `#!/usr/bin/env bun`
- Hook scripts must have `try/catch` for error handling
- Hook scripts must have `process.exit(0)` for success and `process.exit(1)` for failure
- `hooks.json` must set `show_output: true` to show output in the IDE
- Use /update-docs if needed


## Expected Outcome

- `.devin` has complete hooks, skills, MCP, and `rules/` at the root only, with no `workflows/` directory
- `.devin/rules/` (`architecture/<workspace-type>/`, `dependencies/`, `business/`) exists and is authored via `/update-devin-project-rules`
- For a monorepo, each workspace has its own `AGENTS.md` and no `.devin/` in sub-workspaces
- The root `AGENTS.md` tells agents to follow the workspace `AGENTS.md` files
- No `.devin/` in sub-workspaces
- Hooks work per their configured events, using the `bun` runtime
- ast-grep rules live in `rules/` at the project root per the canonical layout
- `sgconfig.yml` is complete: `ruleDirs`, `languageAliases`, `devPaths`
- `bunx ast-grep scan --inspect summary` shows all rules as effective
- `bun run scan` runs and reports results
