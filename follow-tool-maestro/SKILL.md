---
name: follow-tool-maestro
description: Maestro (mobile.dev) — YAML E2E flows for Android/iOS/web, built-in MCP for agentic UI testing
argument-hint: "[flow-file-or-goal]"
related:
  - deep-test
  - follow-tool-e2e
  - follow-my-techstack
---

## Goal

Write and run mobile/web E2E UI tests with Maestro (Apache-2.0, `mobile-dev-inc/Maestro`) — flat YAML flows driven through the platform accessibility layer, one binary, no drivers/SDK, plus its built-in MCP server for agentic device control

## Scope

Use when a project needs E2E coverage for Android, iOS (simulator), or web UI flows — mobile is Maestro's strength; deep web Playwright suites stay on Playwright (`/follow-tool-playwright`)

- Catalog default for mobile E2E → `follow-my-techstack/references/techstack-catalog.md` (row `E2E Testing`)
- Agentic tester.army alternative → `/follow-tool-e2e`; orchestrating runs → `/deep-test mobile`
- Paid Maestro Cloud and free-but-closed Maestro Studio are outside this skill's default path — CLI + MCP only

## Execute

### 1. Install CLI

> Goal: get the single-binary CLI running

1. Require Java 17+ — verify with `java -version`
2. macOS/Linux/WSL: `curl -fsSL "https://get.maestro.mobile.dev" | bash`; Windows (non-WSL): follow the installer page on maestro.dev docs
3. Verify: `maestro --version`
4. Device targets: Android emulator/device, iOS simulator, browser — physical iOS is not supported

### 2. Write A Flow

> Goal: express one user journey as flat YAML

```yaml
# flows/contacts-add.yaml
appId: com.android.contacts
---
- launchApp
- tapOn: "Create new contact"
- tapOn: "First Name"
- inputText: "John"
- assertVisible: "John"
```

- Commands are a flat list: `launchApp`, `tapOn`, `inputText`, `assertVisible`, `scroll`, `back`, `stopApp`
- Selector by text/id, with `- optional: true` / `- when:` conditionals for flaky-prone UI
- Wait is automatic — do not add sleeps; built-in flakiness tolerance retries views

### 3. Run And Debug

> Goal: iterate until the flow passes deterministically

1. `maestro test flows/contacts-add.yaml` — add `--format JUNIT` for CI artifacts
2. Debug step-by-step: `maestro test --debug flow.yaml`; record: `--record`
3. Run a whole suite: `maestro test flows/` (all `.yaml` files)
4. On failure, inspect the hierarchy dump (`maestro hierarchy`) to pick the right selector

### 4. Agentic Mode (MCP)

> Goal: let the coding agent drive a live device while it builds

1. Start the built-in server: `maestro mcp` — ships inside the CLI, nothing else to install
2. Register it as an MCP server via `/create-devin-global-mcp` so the agent can inspect the screen, tap, scroll, assert on a live emulator
3. Ask the agent to draft a flow, run it until green — the YAML stays in the repo as the CI test

## Rules

### 1. Flows Are The Contract

- One user journey per flow file; keep them independent (no shared state between files)
- Prefer text/id selectors in this order; never encode waits — rely on auto-waiting
- CI runs the same flows as local — no separate harness

### 2. Framework Agnostic

- Same commands for React Native, Flutter, native, hybrid — do not write platform-specific test code when a flow works

### 3. Free Path Only By Default

- Default to CLI + MCP (free, open source); Cloud/Studio only on explicit user request — note: Studio is free but not open source

- See references/ for the flow API and CLI tables

## References

- See `best-practices/flow-authoring.md` for recommended flow-authoring patterns and pitfalls

## Expected Outcome

- Reproducible YAML flows in the repo running on emulator/simulator/browser in minutes
- Agent-assisted authoring via `maestro mcp` without extra installs
- CI gets JUnit output from the exact same flows
