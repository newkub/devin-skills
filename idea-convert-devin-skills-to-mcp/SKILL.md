---
name: idea-convert-devin-skills-to-mcp
description: Generate ideas and a draft to convert Devin skills into an MCP server (tools/resources/prompts)
argument-hint: "[skill-name|family]"
related:
  - create-devin-global-mcp
  - deep-review
  - check-my-global-cli
  - create-plan-in-dot-devin
  - deep-validate
  - report
---

## Goal

Generate ideas and a draft for converting Devin skills into an MCP server — map skill capabilities to MCP primitives (tools, resources, prompts) per the standard

## Scope

Use when you want skills to be accessible from other MCP clients or to integrate skill logic into the MCP ecosystem:

- Survey skills/families that contain executable logic (scripts, CLIs, data-returning checks)
- Assess which skills are suitable as an MCP tool/resource/prompt
- Write a draft MCP server design (don't actually implement until the user confirms → `/follow-your-suggestion`)
- Support single skills, skill families (`check-*`, `run-*`), and the whole repo

## Execute

### 1. Select Skills

> Goal: Identify the skills to evaluate

1. If the argument specifies a skill/family → use it directly; if not → ask the user or survey the whole repo
2. Read each skill's `SKILL.md` + `src/`, `scripts/`, `references/`
3. Select 1-5 skills per round — if more, run `/create-plan-in-dot-devin`

### 2. Map Skill To MCP Primitives

> Goal: Each skill gets the correct primitive; don't force everything to be a tool

| Skill characteristic | MCP primitive |
|---------------------|---------------|
| executable action — script/CLI that runs and returns a result | `tool` |
| reference documents/read-only data (`references/`, catalogs) | `resource` |
| pure workflow/instructions (Goal/Execute/Rules) | `prompt` |
| dispatcher that routes to multiple actions | `prompt` + multiple `tools` |

1. Skills that are pure workflow (no executable code) → shouldn't be an MCP tool — they're a `prompt` or shouldn't be converted at all
2. Skills with `src/`/`scripts/` → wrap as a `tool` — input schema from CLI args, output from stdout/exit code
3. `references/*.md`, catalogs → `resource` for the client to fetch itself

### 3. Evaluate Conversion Candidates

> Goal: Assess which skills are worth making into MCP

1. Use criteria:
   - Has real executable logic (script/CLI/binary) — not pure prompt
   - Structured, reusable results (JSON, findings, paths)
   - Useful across AI tools/clients that support MCP
   - Stateless, or state manageable via the MCP lifecycle
2. Score 1-5 per criterion then total: High (≥14), Medium (9-13), Low (<9)
3. Low → skip — skills that are pure instructions are better left as skills

### 4. Group Into Servers

> Goal: Group tools into servers by concern

1. Combine tools of the same domain into one server, e.g. `check-*` ast-grep metrics → `code-metrics` server
2. Server name in the form `<domain>-mcp` or `devin-<domain>`; never one server combining everything
3. Set transport: `stdio` (default, local) — `http` only when remote is needed
4. Choose implementation: Bun/TypeScript SDK `@modelcontextprotocol/sdk` (per the repo's tech stack)

### 5. Draft MCP Servers

> Goal: Write a draft design per server

1. Per server, specify:
   - `name`, `description`, transport
   - tools: `name`, `description`, input schema (zod/JSON Schema), output shape — map from the skill's Execute steps
   - resources: URI pattern for references/catalogs
   - prompts: workflow instructions from SKILL.md (abbreviated Goal/Execute/Rules)
2. Draft the `mcp.json`/`server.json` config entry for registration
3. Run `/report` table: `No.`, `Server`, `Tool/Resource/Prompt`, `Source Skill`, `Priority`, `Notes`

### 6. Validate And Suggest

> Goal: Verify and present the next direction

1. Run `/deep-validate` to check the draft — complete schema, no duplicate tool names, appropriate transport
2. Run `/deep-review` if available — review the draft against MCP best practices
3. Check that it doesn't duplicate already-installed MCP servers (`/check-my-global-cli` or `.devin/config.json` mcpServers)
4. If the draft passes and the user confirms, convert → run `/create-devin-global-mcp` per the draft (this skill is idea/draft only — implementation lives in `/create-devin-global-mcp`); if there are no candidates → `/suggest-next-action`

## Rules

### 1. Conversion Criteria

- Never convert a pure-instructions skill into a tool — that's a prompt, not an executable capability
- Don't duplicate existing MCP servers — check what's installed first
- One tool = one action with clear input/output; don't wrap a whole workflow into a single tool
- Tool names `snake_case` and meaningful: `<verb>_<noun>` e.g. `check_long_files`

### 2. Draft Quality

- Input schema must cover every flag/arg the source skill actually uses
- Output must be structured (JSON) — don't return raw prose if the consumer is an agent
- Specify error cases: exit codes, missing deps, timeout
- Store drafts in `.devin/temp/plan/<workspace>/` or the report — don't write server code until confirmed
- When conversion is confirmed → always follow `/create-devin-global-mcp` (never implement an MCP server yourself in this skill)
- Use /deep-review if necessary

## Expected Outcome

- A list of skills suitable for conversion with scores and primitive mapping
- Draft MCP server designs (tools/resources/prompts + config) for High priority
- A summary table of server → source skills → next action
