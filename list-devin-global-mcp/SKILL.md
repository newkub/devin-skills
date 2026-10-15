---
name: list-devin-global-mcp
description: List configured global MCP servers and their tools
argument-hint: "[scope]"
related:
  - report
  - suggest-next-action
  - update-devin
---

## Goal

List the globally configured MCP servers together with their available tools

## Scope

- Read `%APPDATA%\devin\mcp_config.json`
- List MCP servers from the config
- List the tools of each MCP server with `mcp_list_tools`
- Report status and source

## Execute

### 1. Load MCP Config

> Goal: read the config file

1. Read `%APPDATA%\devin\mcp_config.json`
2. If the file is missing → report that there is no global MCP config
3. Check the JSON syntax
4. Extract the `mcpServers` object

### 2. List Servers

> Goal: show the server list

1. Use `mcp_list_servers` to see live servers
2. Compare against the servers in `mcp_config.json`
3. Identify server name, command, args, env
4. Record enabled/disabled when present

### 3. List Tools

> Goal: show each server's tools

1. Use `mcp_list_tools` for each server
2. Identify tool name and description
3. Order by server

### 4. Report

> Goal: summarize the results

1. Do `/report` showing server, command, tools count, status
2. If there is no server → report that global MCP is not configured yet
3. Do `/suggest-next-action` when something needs fixing

## Rules

### 1. Read-Only

- Do not modify `mcp_config.json`
- If a change is needed → use `/update-devin-global-mcp`

### 2. Privacy

- Do not expose secrets, keys, or tokens in the report
- When `env` contains sensitive values → show them as `<redacted>`

### 3. Validation

- Check the JSON syntax before reporting
- If the config has no `mcpServers` → report a wrong or missing format

### 4. Formatting

- Never use `**` bold
- Use backticks for file paths, server names, tool names
- Report as a table via `/report`

## Expected Outcome

- The list of configured global MCP servers
- Each server's tools with names and descriptions
- Status reported per server
- A table-format report with next actions
