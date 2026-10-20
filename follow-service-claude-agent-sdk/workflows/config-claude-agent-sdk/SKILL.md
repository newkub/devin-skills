---
name: follow-service-claude-agent-sdk-config-claude-agent-sdk
description: Set/edit query() options — model, tools, permissions, MCP servers, sessions
related:
  - follow-service-claude-agent-sdk
  - follow-secret-manager
  - deep-review
  - run-verify
  - run-test
  - learn-from-web
---

## Goal

Set/edit `query()` options of `@anthropic-ai/claude-agent-sdk` — model, tools, permissions, MCP servers, and sessions — merging with the existing config

## Scope

- Covers the `options` object, custom tools (`tool()` + `createSdkMcpServer`), and session resume
- If not installed/API key missing → do `workflows/setup-claude-agent-sdk/SKILL.md` first

## Execute

### 1. Read Current Config

> Goal: Know the current options before editing

1. Read the `query()` call sites and the options passed
2. Do `/deep-review` with the `config` dimension if config lives separately in other files
3. If no `query()` is found → do `workflows/setup-claude-agent-sdk/SKILL.md` first

### 2. Configure Model And Prompt

> Goal: model/system prompt match the use case

1. Set `options.model` per the use case — verify the latest model names from the official docs before use
2. Set `options.systemPrompt` for the agent's behavior
3. Set `options.maxTurns` and `options.cwd` suitably for the task

### 3. Configure Tools And Permissions

> Goal: the agent accesses only the tools it needs

1. Define `allowedTools`/`disallowedTools` explicitly — never enable every tool without need
2. Set `permissionMode` to match the use case (`default`, `acceptEdits`, `bypassPermissions`, etc. — see official docs)
3. Custom tools → use `tool()` + `createSdkMcpServer`, then pass via `options.mcpServers`
4. External MCP servers → declare in `options.mcpServers` per the SDK schema

### 4. Configure Sessions

> Goal: multi-turn conversations work correctly

1. Use `sessionId`/`resume` in options to resume an existing session
2. Manage session lifecycle — store the session id per user/conversation

### 5. Verify

> Goal: config works with the real agent

1. Run a test `query()` with the new options — confirm tools are allowed/denied as set
2. Do `/run-verify` and `/run-test` if relevant tests exist
3. If broken → revert the key just changed, then report the diff

## Rules

- Control tools explicitly with `allowedTools`/`disallowedTools` — least privilege
- Set `maxTurns`/`permissionMode` appropriate to the use case — never `bypassPermissions` unless required
- Secrets in `mcpServers` config go through `/follow-secret-manager`
- Use official docs https://docs.claude.com/en/api/agent-sdk for uncertain options, or `/learn-from-web`

## Expected Outcome

- Model, tools, permissions correct per least privilege
- Custom tools/MCP servers work
- Session resume works — lint, typecheck, tests pass
