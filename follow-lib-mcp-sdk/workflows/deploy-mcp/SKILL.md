---
name: follow-lib-mcp-sdk-deploy-mcp
description: Deploy MCP server — transport options, remote hosting, client config
argument-hint: "[platform]"
related:
  - follow-lib-mcp-sdk
  - follow-secret-manager
  - check-secrets
  - resolve-errors
---

## Goal

Deploy an MCP server — pick the transport, host a remote server, and configure clients so they can connect

## Scope

Use when deploying an already-built MCP server — covers stdio vs Streamable HTTP transports, remote hosting options, client registration (Claude Desktop, Devin, IDEs), and auth notes

## Execute

### 1. Choose Transport

> Goal: pick the transport matching the deployment model

1. `StdioServerTransport` — local servers the client spawns itself (Claude Desktop, IDE extensions); no hosting needed, just distribute the command
2. `StreamableHTTPServerTransport` — remote servers that many clients connect to over HTTP; requires hosting + auth
3. the old HTTP+SSE transport is deprecated — backward compat only; never use it for new servers
4. if you can't decide → stop and report the trade-offs

### 2. Prepare Server For Hosting

> Goal: configure the server for remote deployment

1. audit env vars/secrets — run `/check-secrets env-vars`; secrets go through `/follow-secret-manager`, never committed
2. use `process.env.PORT` — platforms assign the port themselves
3. for Streamable HTTP: decide session management (stateful `sessionIdGenerator` vs stateless) per the use case — see the official docs
4. add auth for the remote server (OAuth/bearer token) — the MCP spec defines the auth requirements; never expose a remote server without auth

### 3. Deploy

> Goal: host the server on the chosen platform

1. Node/Bun-compatible platforms (VPS, Docker, serverless that supports HTTP) — build/run per the runtime used
2. for stdio distribution: publish an npm package or distribute a script — clients run `npx`/`bunx <pkg>` themselves
3. check the official docs at `https://modelcontextprotocol.io` for the latest hosting patterns

### 4. Register With Clients

> Goal: add the server to client configs

1. Stdio client config (e.g. Claude Desktop `claude_desktop_config.json`):

   ```json
   {
     "mcpServers": {
       "my-server": { "command": "bunx", "args": ["my-mcp-server"] }
     }
   }
   ```

2. Remote: the client points at the Streamable HTTP endpoint URL + auth credentials
3. run `/update-devin-global-mcp` if this is a Devin global MCP config

### 5. Verify

> Goal: test that clients really connect to the server

1. restart/reload the client and check the server shows up in the tools list
2. call one tool through the client — the response is correct
3. check the logs for no errors; verify auth works for remote
4. if it breaks → run `/resolve-errors` then report

## Rules

- a remote server must always have auth — never expose an MCP endpoint unprotected
- never commit credentials/client configs that contain secrets
- stdio for local single-user, Streamable HTTP for remote multi-client — never use the new SSE transport
- use `/follow-lib-mcp-sdk` for the full reference

## Expected Outcome

- the transport is chosen correctly for the deployment model
- the server hosts/distributes successfully with auth (if remote)
- clients connect and can really call the tools
- secrets are handled correctly
