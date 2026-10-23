---
name: list-dot-agents-global-mcp
description: Inventory global MCP servers and their exposed tools
related:
  - list-dot-agents-global
  - update-devin-global-mcp
  - report

---

## Goal

List the MCP servers registered in `~/.agents/mcp/mcp_config.json` together with the tools each one exposes

## Scope

- Config source: `~/.agents/mcp/mcp_config.json`
- Live tools come from the session's MCP discovery tools, never from guessing
- Boundary: adding or editing a server → `/update-devin-global-mcp`

## Execute

### 1. Load Config

> Goal: read the config file

1. Read `~/.agents/mcp/mcp_config.json`
2. When the file is missing → report that no global MCP config exists
3. Validate the JSON syntax
4. Extract the `mcpServers` object

### 2. List Servers

> Goal: show the configured server list

1. Record each server's name, command, args, and env keys
2. Use the session MCP discovery tool (`mcp_list`) to see which servers are live
3. Compare live servers against the config and mark drift
4. Mark enabled or disabled when the config carries that field

### 3. List Tools

> Goal: show each server's tools

1. Use `mcp_list` and `mcp_get` to collect tool names and descriptions per server
2. Count tools per server
3. Order by server name

### 4. Report

> Goal: summarize the results

1. Follow `/report`; table columns: No., Server, Command, Tools, Status
2. Redact env values as `<redacted>`
3. Add a footer count of servers and tools
4. When nothing is configured → say so plainly and offer `/update-devin-global-mcp` mode `create`

## Rules

- Read-only — never modify `mcp_config.json`
- Never expose secrets, keys, or tokens
- Never use `**` bold; use backticks for paths, servers, and tool names
- Report drift between config and live servers as a finding, not as an error

## Expected Outcome

- A numbered table of every configured MCP server
- Tool names and descriptions per server
- Config-versus-live drift and server/tool totals
