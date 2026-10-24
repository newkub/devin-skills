---
name: idea-global-mcp
description: Find skills, CLIs, hooks, and services that should run as global MCP servers
argument-hint: "[skills|cli|hooks|services|all|<name>]"
related:
  - update-devin-global-mcp
  - idea-convert-devin-skills-to-mcp
  - check-my-global-cli
  - update-agents-skills-global
  - follow-single-of-source
  - follow-create-mcp
  - use-scripts
  - report
  - suggest-next-action
  - ask-me
---

## Goal

Find capabilities that should execute as a global MCP server instead of living as skill prose — scan every source, score the candidates, dedupe against the live registry, and hand confirmed rows to the skill that builds and registers them

## Scope

- Read-only: produces a scored candidate list and a draft shape, never builds a server, edits `mcp_config.json`, or deletes a skill
- Sources: global skills (`~/.agents/skills/`), installed CLIs, hooks and subagents (`~/.agents/hooks/`, `~/.agents/agents/`), project `.agents/`, and external services the skills already call
- Registry to dedupe against: `~/.agents/mcp/mcp_config.json` — the decision rule itself is the SSOT in `/update-devin-global-mcp` `### 2`
- Argument: one source (`skills`, `cli`, `hooks`, `services`, `all`) or one skill/tool name; default `all`
- Skill-to-MCP draft design for a pure skill candidate → `/idea-convert-devin-skills-to-mcp`; build and register → `/follow-create-mcp` then `/update-devin-global-mcp create`
- Authoring policy that decides where new capability is written → `/update-agents-skills-global` `### 6`

## Execute

### 1. Resolve Scope And Baseline

> Goal: fix what to scan and what already exists

1. Read `~/.agents/mcp/mcp_config.json`; record every server name, transport, and `command` or `url`
2. Build the coverage map for stdio servers: `node update-devin-global-mcp/scripts/mcp-smoke.mjs --config ~/.agents/mcp/mcp_config.json --server <name>` — keep `toolCount` and the tool names
3. Remote servers (`url`/`serverUrl`) have no local process; record them by name and note their tools are listed by the client
4. Select the sources from the argument; empty or `all` → every source
5. State in one line that the run is read-only and the registry version in use

### 2. Inventory Candidate Capabilities

> Goal: collect every capability that executes or answers with data

| Source | Command or location |
|---|---|
| Skills | `ls -d */{scripts,src}`; `rg -n 'bun run scripts/\|node scripts/\|npx \|bunx \|cargo run' --glob '*/SKILL.md'` |
| CLIs | `/check-my-global-cli` inventory (`references/global-cli-commands.md`, `references/tool-map.md`) |
| Hooks and subagents | `~/.agents/hooks/`, `~/.agents/agents/` — every hook or agent that shells out |
| Project | `.agents/mcp/mcp_config.json`, `.agents/skills/` |
| Services | remote servers already registered; APIs the skills call by hand |

1. Record per capability: name, what it executes, input, output shape, current artifact (prose, script, CLI, hook)
2. More than ~20 rows → `/use-scripts` to parse the SKILL.md files into one table; never print raw file dumps
3. Drop pure documentation, conventions, and workflow-only skills — no executable step means no tool
4. A capability that only judges or routes → keep it a skill, note it, and do not score it

### 3. Score Candidates

> Goal: rank by whether a server is worth owning

Score each criterion 1–5, total 5–25:

1. Executes real logic — code, binary, or API call, not prose
2. Structured, deterministic output — JSON, paths, or an exit code
3. Reuse — more than one MCP client or workspace needs it
4. Stable input schema — arguments can be typed without guessing
5. Lifecycle — stateless, or state manageable through the MCP lifecycle

Bands: High ≥ 20, Medium 13–19, Low < 13.

1. Any candidate scoring 1 on criterion 1 → drop it, whatever the total
2. Tie-break: higher reuse first, then the simpler input schema

### 4. Dedupe Against The Registry

> Goal: never propose a second owner for a capability that already has one

1. Match each candidate against the registry tool names and against the covered CLIs and skills
2. `covered` — an existing server already exposes the capability; quote the server and tool name
3. `overlap` — the same capability is split between a server and skill prose; the server owns execution (`/follow-single-of-source`) and the skill becomes the pointer
4. `new` — no owner anywhere; this is the candidate to build
5. Two skills describing one executable capability → merge first via `/idea-merge`, then score the merged capability once

### 5. Shape The Server

> Goal: group tools so each server owns one concern

1. Group `new` capabilities by domain → one server per domain, named `<domain>-mcp` or `devin-<domain>`
2. One tool = one action, `snake_case` `<verb>_<noun>`; input schema from the real arguments; output JSON
3. Reference catalogs → resource; workflow instructions → prompt; both still belong to their server
4. Draft per server: name, `stdio` transport, tools (name, description, input schema, output), resources, env secrets
5. Skill-only candidates → `/idea-convert-devin-skills-to-mcp` for the primitive mapping and design
6. A skill that describes a capability now living in a server → rewrite it as a pointer through `/update-agents-skills-global` `### 6`

### 6. Validate, Report, Hand Off

> Goal: prove the draft and route it

1. Check every tool name is unique and `snake_case`, every schema is complete, and no secret literal appears
2. Run `/report` with columns: `No.`, `Capability`, `Source`, `Score`, `Artifact`, `Existing owner`, `Action`
3. Sort High → Medium → Low, then reuse descending; continuous numbering from 1
4. Ask `/ask-me` which rows to build — nothing is built without that answer
5. Confirmed new server → `/follow-create-mcp`, then `/update-devin-global-mcp create`; existing server gaining a tool → `/update-devin-global-mcp add`
6. No candidates at all → `/suggest-next-action`

## Rules

### 1. Read-Only

- Never build, register, edit a config, or delete a skill in this run
- Registration and the smoke test belong to `/update-devin-global-mcp`; this skill stops at the draft
- A confirmed row is a handoff, not permission to write inside this run

### 2. Executable Or Nothing

- A tool must execute and return structured data; a wrapper around prose is not a tool
- Pure instruction skills stay skills — never score them as conversion candidates
- Reference data → resource; workflow → prompt; judgement → skill only

### 3. Evidence Before Score

- Every score cites the file, script, or CLI that proves the capability executes
- A capability not found in the registry is `new`; never assume coverage from a similar name
- Existing coverage must quote the server and the tool name, not just the server

### 4. One Owner

- Server and skill describing the same capability → the server owns execution, the skill points at it
- Never propose a server whose tools duplicate an installed server
- The same capability reached from two sources → merge before proposing

### 5. Deterministic

- Same registry and same skills → the same candidates and the same scores
- Thresholds are fixed: High ≥ 20, Medium 13–19, Low < 13
- Fixed order: band, then reuse descending, then name

## Expected Outcome

- A scored candidate table across skills, CLIs, hooks, subagents, and services
- Every row marked `covered`, `overlap`, or `new` against the live registry, with the evidence quoted
- Draft server shapes for confirmed rows, and skill-only conversions routed to `/idea-convert-devin-skills-to-mcp`
- Nothing registered, edited, or deleted; a handoff to `/update-devin-global-mcp` plus a next action
