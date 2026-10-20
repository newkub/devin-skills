---
name: follow-service-claude-agent-sdk
description: Use @anthropic-ai/claude-agent-sdk to build AI agents — query, tools, MCP, sessions
argument-hint: "[target-or-scope]"
related:
  - run-verify
  - run-test

---

## Goal

Use @anthropic-ai/claude-agent-sdk to build AI agents — query, tools, MCP, sessions

## Scope

- Setup: SDK install, `ANTHROPIC_API_KEY`, smoke query → `workflows/setup-claude-agent-sdk/SKILL.md`
- Config: model, tools, permissions, sessions config → `workflows/config-claude-agent-sdk/SKILL.md`
- Verify: API key valid, minimal query responds → `workflows/verify-connection/SKILL.md`
- Package metadata (version, licence, docs) → `references/package-manifest.md`

## Execute

### Workflows

> Goal: dispatch to the workflow matching the topic

| Topic  | Workflow |
|--------|----------|
| Setup  | `workflows/setup-claude-agent-sdk/SKILL.md` — SDK install, `ANTHROPIC_API_KEY` |
| Config | `workflows/config-claude-agent-sdk/SKILL.md` — model, tools, permissions, sessions config |
| Verify | `workflows/verify-connection/SKILL.md` — API key valid, minimal query responds |

Read `workflows/<name>/SKILL.md` per topic and follow the flow there — do not execute from this table directly

### 1. Setup And Usage

> Goal: Use it correctly per the official docs

Latest: `@anthropic-ai/claude-agent-sdk@0.3.283` (verified 2026-09-26) — renamed from the `claude-code` SDK; the entry point is `query()`

1. Use the `query()` function as the entry point — a streaming async iterator
2. Set `options`: model, allowedTools, mcpServers, systemPrompt
3. Use `tool()` + `createSdkMcpServer` for in-process custom tools
4. Manage sessions with `sessionId`/`resume` for multi-turn

### 2. Verify

> Goal: Confirm correct usage

1. Do `/run-verify` for lint, typecheck
2. Do `/run-test` if relevant tests exist
3. Check the latest official docs before using an uncertain API (service claude agent sdk)

## Rules

- ANTHROPIC_API_KEY required in env — never hardcode
- Control tools explicitly with `allowedTools`/`disallowedTools`
- Server-side only — never bundle into a client
- Set `maxTurns`/`permissionMode` appropriate to the use case

## Expected Outcome

- Library used correctly per best practices (service claude agent sdk)
- No known security/performance pitfalls (service claude agent sdk)
- Lint, typecheck, tests pass
