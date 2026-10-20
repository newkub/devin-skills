---
name: follow-service-claude-agent-sdk-setup-claude-agent-sdk
description: Install the Claude Agent SDK, store ANTHROPIC_API_KEY, and smoke-test query()
related:
  - follow-service-claude-agent-sdk
  - follow-secret-manager
  - open-web-for-config-secret
  - run-verify
  - resolve-errors
  - suggest-next-action
---

## Goal

Install `@anthropic-ai/claude-agent-sdk` and prepare `ANTHROPIC_API_KEY` so `query()` can call the agent — first-time setup

## Scope

- Install the package and make a minimal `query()` call server-side
- Configure the API key via a secret manager
- If already set up → verify only; model/tools/permissions config → `workflows/config-claude-agent-sdk/SKILL.md`

## Execute

### 1. Check Prerequisites

> Goal: Confirm the project is ready and not yet set up

1. Check `package.json` for `@anthropic-ai/claude-agent-sdk` — if present → skip to verify
2. Check env/secrets for `ANTHROPIC_API_KEY`
3. If the key is missing → do `/open-web-for-config-secret` pointing the user to the Anthropic Console

### 2. Install SDK

> Goal: Install the SDK server-side

1. Run `bun add @anthropic-ai/claude-agent-sdk` (or the project's package manager)
2. Confirm the import works with `import { query } from '@anthropic-ai/claude-agent-sdk'`
3. Confirm it runs server-side only — never bundle into a client

### 3. Configure API Key

> Goal: key safe, not committed

1. Store `ANTHROPIC_API_KEY` via `/follow-secret-manager` — never hardcode or commit
2. The SDK reads the env automatically — no need to pass the key in code

### 4. Smoke Test

> Goal: `query()` actually works

1. Run a minimal call:
   ```typescript
   for await (const msg of query({ prompt: 'Say hi', options: { maxTurns: 1 } })) {
     console.log(msg)
   }
   ```
2. Confirm an assistant message comes back without an auth error

### 5. Verify

> Goal: the SDK is ready to use

1. Do `/run-verify` for lint, typecheck
2. If verify fails → do `/resolve-errors` max 3 rounds, then stop and report
3. Success → do `/suggest-next-action`

## Rules

- `ANTHROPIC_API_KEY` required in env — never hardcode
- Server-side only — never bundle into a client
- Use official docs https://docs.claude.com/en/api/agent-sdk when unsure about the API

## Expected Outcome

- SDK installed and `query()` works server-side
- API key stored in the secret manager
- Ready for `workflows/config-claude-agent-sdk/SKILL.md`
