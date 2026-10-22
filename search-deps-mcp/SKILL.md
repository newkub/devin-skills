---
name: search-deps-mcp
description: Decide which dependencies and MCP servers belong global vs project
argument-hint: "[scope]"
allowed-tools:
  - exec
  - grep
  - glob
  - find_file_by_name
related:
  - list-dependencies
  - search-mcp
  - list-devin-global-mcp
  - update-devin-project-mcp
  - update-devin-global-mcp
  - download-program
  - run-install
  - follow-tool-mise
  - follow-my-techstack
  - list-workspaces
  - report
  - ask-me
  - suggest-next-action
---

## Goal

Inventory every dependency in the project's package manifests and every MCP server it uses, then decide per item whether it belongs in the global toolchain or the project — with a reason, the evidence it is actually used, and the install command — without installing anything

## Scope

The `-mcp` suffix is honored literally: packages from manifests and MCP servers from config are inventoried in one pass and judged by the same placement question

| Question | Owner |
|---|---|
| Which dependency and MCP servers exist, and where should each live | this skill (inventory + placement) |
| Full dependency analysis: unused, duplicate, outdated, vulnerable | `/list-dependencies` |
| Find new libraries for a feature | `/search-npm-libraries` |
| Find MCP servers worth adopting | `/search-mcp` |
| Install a global OS tool or CLI | `/download-program`, `/follow-tool-mise` |
| Install project dependencies | `/run-install` |
| Register a project MCP server | `/update-devin-project-mcp` |
| Register a global MCP server | `/update-devin-global-mcp` |

- Read-only advisor: no install, no manifest edit, no MCP config edit
- Default library choices still come from `/follow-my-techstack` — placement never overrides the catalog

## Execute

### 1. Resolve Scope And Manifests

> Goal: know every file that declares a dependency

1. Take `scope` from the argument — project root, workspace, or monorepo; unclear → `/ask-me`
2. Enumerate workspaces with `/list-workspaces`; read the root manifest plus every workspace manifest (`package.json`, `Cargo.toml`, `pyproject.toml`, `go.mod`)
3. Record dependency sections separately: `dependencies`, `devDependencies`, `peerDependencies`, `optionalDependencies`; Rust `[dependencies]`/`[dev-dependencies]`/`[build-dependencies]`
4. Note the package manager and lockfile — a lockfile is what makes CI reproducible
5. Read `AGENTS.md` and the techstack catalog when present

### 2. Inventory Dependencies

> Goal: one row per dependency, with type and declared version

1. Collect name, declared range, section, and declaring workspace
2. Flag duplicates declared in several workspaces with different ranges
3. Flag workspace-internal packages — never global candidates
4. Flag `peerDependencies` — always consumed by the host project, never installed globally
5. Do not judge yet; usage evidence comes next

### 3. Detect Real Usage

> Goal: placement follows how the item is actually invoked

1. Imported by source (`rg`, or `/follow-tool-knip` when configured) → project dependency
2. Invoked only from `package.json` scripts, CI workflows, Makefile/justfile/task runner → project devDependency so CI gets the pinned version
3. Invoked by a human across repositories and never imported → global candidate
4. Configured through a config file (biome, eslint, tsconfig plugins, vitest) → project devDependency
5. No import, no script, no config hit → mark `unused`, recommend removal rather than relocation
6. Record the evidence location for each row: source `file:line`, script name, workflow job, or config path

### 4. Inventory MCP Servers

> Goal: the same row shape for servers

1. Read project config: `.devin/mcp_config.json`, `.mcp.json`, and any project-level config the runtime documents
2. Read the global set via `/list-devin-global-mcp` (`%APPDATA%\devin\mcp_config.json`)
3. Flag servers declared in both places — project config wins for reproducibility; the duplicate is a finding
4. Flag servers declared but never used in the current session, and servers used but not declared anywhere
5. Do not list available tools here; `/list-devin-global-mcp` owns that

### 5. Classify Global vs Project

> Goal: one recommendation per row from the `## Decision Rules` table

1. Apply the rules in order — an earlier rule wins over a later one
2. Assign confidence: `high` (import/script/config evidence), `medium` (usage inferred from naming or docs), `low` (declared only)
3. A package that is both human-run and CI-run → `both`: project devDependency for CI, global install only as a convenience
4. An MCP server that touches project data or credentials → project, regardless of how generic the server is
5. A `low`-confidence row is reported as a question, not a recommendation — never guess

### 6. Report

> Goal: one table the user can act on

1. Report via `/report` in chat (no files): `No. | Item | Kind | Declared in | Used by | Placement | Confidence | Reason | Install command`
2. `Kind` = `package` or `mcp`; `Placement` = `global` / `project` / `both` / `none` (unused or one-off)
3. Order: project-critical first, then `both`, then global convenience, then `none`
4. Summary line: packages scanned, MCP servers scanned, counts per placement, duplicates, unused items
5. Include the exact command per row, e.g. `mise use -g <tool>@latest`, `bun add -d <pkg>`, or the JSON server entry for MCP
6. State the assumption when a manifest has no usage evidence and the user declined `/ask-me`

### 7. Hand Off Installs

> Goal: the advisor never mutates the machine

1. Global OS tool or standalone CLI → `/download-program` or `/follow-tool-mise`
2. Project packages → `/run-install`; monorepo-wide tools go to the root workspace, single-workspace tools stay in that workspace
3. Project MCP server → `/update-devin-project-mcp`; global MCP server → `/update-devin-global-mcp`
4. Duplicated or unused dependency → `/list-dependencies` for the full analysis, then its fix owner
5. Close with `/suggest-next-action`

## Decision Rules

> First matching rule wins

| No. | Signal | Placement |
|---|---|---|
| 1 | Imported by source, tests, or a config plugin | `project` (runtime or dev per section) |
| 2 | Run by CI or a script that must be reproducible | `project` devDependency, even when also installed globally |
| 3 | `peerDependency` or workspace-internal package | `project` (host-provided) — never global |
| 4 | Version-sensitive: compiler, bundler, deploy CLI, ORM CLI, native bindings | `project` so the version is locked |
| 5 | Human-run across repositories and never imported | `global` through mise or the OS package manager |
| 6 | One-off exploration or migration | `none` — run through `bunx`/`npx`/`uvx` without installing |
| 7 | MCP server exposing project data, schema, credentials, or an internal API | `project` |
| 8 | MCP server generic across repos (browser, git, filesystem, web search) | `global` |
| 9 | Declared in both global and project config | `project`; report the duplicate |
| 10 | No import, script, config, or session evidence | `none` — unused, recommend removal |

- Never recommend `npm install -g` for a versioned CLI: global npm installs bypass the lockfile and audit — use mise
- Anything CI runs must exist in a manifest + lockfile; convenience installs never substitute
- A global install must never be the only source of a package a build depends on

## Examples

| Item | Placement | Reason |
|---|---|---|
| `typescript` | project devDependency | compiler version must match `tsconfig` and CI |
| `@biomejs/biome` | project devDependency | config + version pinned per repo |
| `wrangler` | project devDependency | deploy reproducibility |
| `turbo` in a monorepo | root devDependency | pipeline definition shared by all workspaces |
| `ast-grep` (`sg`) | `both` | global for editor/agent use, project devDependency when CI scans |
| `ripgrep` (`rg`), `gh` | global | OS-level tools, never imported by code |
| MCP browser/git server | global | useful across every project |
| MCP database or internal API server | project | holds project-specific schema, URL, credentials |

## Rules

### 1. Read-Only Advisor

- Never install, edit a manifest, or edit an MCP config here — every change routes to its owner in Step 7
- Never restate `/list-dependencies` analysis or `/search-mcp` discovery; link and move on

### 2. Evidence Decides Placement

- Placement follows actual usage, not intuition: an import beats a convention, a CI script beats a preference
- Every row carries its evidence location and a confidence; a declared-only row is a question, not a verdict

### 3. Reproducibility First

- If a build, test, or deploy needs it, it belongs in the project with a locked version
- Global is a convenience layer for humans, never a build input

### 4. Monorepo Placement

- Used by two or more workspaces → root workspace devDependency
- Used by one workspace → that workspace only
- No hoisting when it would pull a heavy or version-conflicting package into unrelated workspaces

### 5. Proportionate Output

- Scope larger than ~100 rows → group by section (`runtime`, `build`, `lint/test`, `deploy`, `mcp`) and summarize per group
- Use `/deep-review` if the question turns into architecture or supply-chain risk
- Use `/suggest-next-action` to close the run

## Expected Outcome

- Every manifest dependency and MCP server in scope has a row with `global` / `project` / `both` / `none`, a reason, evidence, and confidence
- Duplicates, unused items, and servers declared in both global and project config are flagged
- No install or config edit happens here; each item is routed to its owner skill with the exact command
- The summary states scanned counts, placement counts, and any low-confidence item left as a question
