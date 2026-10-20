---
name: follow-service-claude-agent-sdk-verify-connection
description: Verify the Claude Agent SDK connects — key valid, model available, query responds
related:
  - follow-service-claude-agent-sdk
  - follow-secret-manager
  - report
---

## Goal

Confirm after setup/config that the Claude Agent SDK really connects to the Anthropic API — key valid, model available, query responds

## Scope

- Used when `/follow-service-claude-agent-sdk` dispatches to `verify`/`verify-connection`
- Read-only: check only — do not change config

## Execute

### 1. Check API Key

> Goal: `ANTHROPIC_API_KEY` exists and has the right format

1. Check the env var has a value (do not print it)
2. Check the key is not a placeholder (`sk-ant-...` format)

### 2. Smoke Test Query

> Goal: the API really responds

1. Run a minimal SDK call — e.g. a short query or a model list if the SDK supports it
2. Confirm the response is not 401/403 (auth) or 429 (rate limit)
3. Record rough latency as a baseline

### 3. Report

> Goal: Summarize connection status

1. Use `/report` columns: `No.`, `Check`, `Result`, `Evidence`
2. Verdict: `connected` / `auth-failed` / `rate-limited` / `unreachable`

## Rules

- Use minimal queries only — control token cost
- Do not print the API key
- Auth failure → recommend `/follow-secret-manager` — do not fix it yourself

## Expected Outcome

- Connection verdict with model/latency evidence
