---
name: update-dot-agents-project
description: Create and update a project's .agents layout — hooks, MCP, rules, references, skills
argument-hint: "[scaffold|hooks|mcp|rules|references|skills]"
related:
  - check-monorepo
  - deep-analyze
  - update-agents-skills-global
  - update-astgrep-rules
  - update-agents-md
  - deep-validate
  - report
---

## Goal

Create and maintain the project-local `.agents` layout at the repo root — hooks, MCP servers, markdown rules, generated references, and project skills

## Scope

- Target: `<project>/.agents/` mirrors the global `~/.agents` layout — root only, never in sub-workspaces
- Domains: `scaffold`, `hooks`, `mcp`, `rules`, `references`, `skills`
- `.agents/rules/*.md` is natural-language guidance; ast-grep `rules/*.yml` at the project root is machine enforcement — both coexist
- Reference files: [project-layout](references/project-layout.md), [rule-template](references/rule-template.md), [refs-cli](references/refs-cli.md), [refs-output-format](references/refs-output-format.md)
- Boundary: global skills → `/update-agents-skills-global`; global harness review → `/review-dot-agents-global-and-fix`; ast-grep rules → `/update-astgrep-rules`; `AGENTS.md` → `/update-agents-md`

## Execute

### 1. Pick Domain

> Goal: route to the requested project setup pass

| Domain | Use when | Workflow |
|---|---|---|
| `scaffold` | create or repair the whole `.agents` layout | [workflows/scaffold](workflows/scaffold/SKILL.md) |
| `hooks` | create or update `.agents/hooks/` | [workflows/hooks](workflows/hooks/SKILL.md) |
| `mcp` | configure `.agents/mcp/mcp_config.json` | [workflows/mcp](workflows/mcp/SKILL.md) |
| `rules` | author `.agents/rules/` markdown rules | [workflows/rules](workflows/rules/SKILL.md) |
| `references` | generate `.agents/references/` tables | [workflows/references](workflows/references/SKILL.md) |
| `skills` | create or update `.agents/skills/` | [workflows/skills](workflows/skills/SKILL.md) |

1. Read the argument; when empty use `scaffold`
2. When the domain is unknown → `/ask-me` to pick one
3. Run `/check-monorepo` and `/deep-analyze` before the first write in any domain
4. Pass the remaining arguments through to the chosen workflow

### 2. Report

> Goal: report what changed per domain

1. Follow `/report` so every table starts with `No.`
2. Table columns: No., Path, Action, Status
3. Run `/deep-validate` on the touched `.agents` tree
4. Route the next action via `/suggest-next-action`

## Rules

- `.agents/` lives at the repo root only; each sub-workspace gets `AGENTS.md`, never its own `.agents/`
- No `.agents/workflows/` directory — project workflows belong inside a skill package
- All content inside `.agents/` is English; `kebab-case` for every file and folder
- Never write secrets or tokens into `.agents/mcp/mcp_config.json` — reference env vars
- Markdown rules and ast-grep rules coexist — never delete one to make room for the other
- Never use `**` bold; use backticks for tools, commands, paths, and skill names

## Expected Outcome

- The requested `.agents` domain exists, is current, and matches the real project
- Root-only layout with hooks, MCP, rules, references, and skills where requested
- Validation passes and the report lists every created or updated path
