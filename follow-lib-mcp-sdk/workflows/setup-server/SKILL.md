---
name: follow-lib-mcp-sdk-setup-server
description: Setup MCP server — McpServer, tools/resources/prompts registration
argument-hint: "[server-name]"
related:
  - follow-lib-mcp-sdk
  - run-install
  - run-verify
  - run-test
  - resolve-errors
---

## Goal

Create an MCP server with `@modelcontextprotocol/sdk` — the `McpServer` instance and basic tools/resources/prompts registration

## Scope

Use when setting up an MCP server for the first time — covers install, the server instance, `registerTool`/`registerResource`/`registerPrompt`, and a smoke test with the MCP Inspector

## Execute

### 1. Install SDK

> Goal: install the SDK and prepare the project

1. install `bun add @modelcontextprotocol/sdk` plus `zod` for input schemas
2. if already present → just verify the version (idempotent)
3. create an entry file such as `src/server.ts` or `src/index.ts`
4. if unsure about the API → check the official docs at `https://modelcontextprotocol.io` or the SDK's GitHub repo

### 2. Create McpServer Instance

> Goal: create the basic server instance

```ts
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js'

const server = new McpServer({
  name: 'my-server',
  version: '1.0.0',
})
```

1. specify `name` and `version` clearly — keep the version matching the spec
2. one instance per server — register all capabilities on this instance

### 3. Register Tools And Resources

> Goal: register tools, resources, prompts

1. `server.registerTool(name, { description, inputSchema }, handler)` — inputSchema is a Zod raw shape; returns a handle for `.update()`/`.remove()` (the shorthand `server.tool()` still works)
2. handlers always return the `{ content: [{ type: 'text', text }] }` format — errors become `{ isError: true, content: [...] }`, don't throw
3. `server.registerResource(name, uri, { description }, handler)` for resources
4. `server.registerPrompt(name, { description, argsSchema }, handler)` for prompts
5. every tool/prompt needs a clear `description` — the LLM uses it to pick the tool

### 4. Connect Transport

> Goal: wire the transport so the server runs

1. Local: `StdioServerTransport` — `await server.connect(new StdioServerTransport())`
2. Remote: `StreamableHTTPServerTransport` — HTTP+SSE transport deprecated (backward compat only)
3. transport/deploy details → run the `deploy-mcp` workflow

### 5. Verify With Inspector

> Goal: test the server with the MCP Inspector

1. run `bunx @modelcontextprotocol/inspector <command>` pointed at the server entry
2. test listing tools, calling a tool, and reading a resource in the Inspector UI
3. run `/run-verify` and `/run-test` for lint/typecheck/unit tests
4. if it breaks → run `/resolve-errors` max 3 rounds then stop and report

## Rules

- every tool must have a clear `description` — the LLM uses it to pick the tool
- always return the `{ content: [{ type: 'text', text }] }` format
- handle errors as `isError: true` responses, don't throw
- always define inputSchema as a zod raw shape
- use `/follow-lib-mcp-sdk` for the full reference and elicitation
- use `/run-install` if the install must go through a runner skill

## Expected Outcome

- the MCP server runs over the stdio transport
- tools/resources/prompts are fully registered and callable through the Inspector
- errors return properly formatted `isError` responses
- lint/typecheck/unit tests pass
