---
name: update-devin-project-mcp
description: Configure and update MCP servers in .devin/mcp_config.json per project requirements
argument-hint: "[server-or-config]"
related:
  - update-devin
  - report
  - resolve-errors

---

## Goal

Configure and update MCP servers for a project in `.devin/mcp_config.json` per project requirements

## Scope

Use when a project needs to integrate with MCP servers such as `agent-browser`, `ast-grep`, or a custom MCP by creating/editing `.devin/mcp_config.json`

## Execute

### 1. Detect MCP Needs

> Goal: learn which MCPs are needed

1. Read `package.json`, `AGENTS.md`
2. Identify the tools/services needing MCP, such as browser, search, database, github
3. Check the global `mcp_config.json` at `%APPDATA%\devin\mcp_config.json`
4. Identify the servers that must be registered

### 2. Create Or Update .devin/mcp_config.json

> Goal: have a correct config

1. Create `C:\...\project\.devin\mcp_config.json` if it doesn't exist
2. Use the schema: `{ "mcpServers": { "<name>": { "command": "...", "args": [...], "env": {...} } } }`
3. Add/update servers:
   - `agent-browser`: `agent-browser mcp --tools core`
   - `ast-grep`: `npx @ast-grep/cli` (if present)
   - `github`: `npx -y @github/github-mcp-server`
4. Use `npx -y` for package-based servers
5. Use `bun` if the project uses bun

### 3. Register Servers In Global Config

> Goal: register in the global config if needed

1. If creating a custom MCP server → update `%APPDATA%\devin\mcp_config.json`
2. Use an absolute path or package name
3. Never commit secrets or tokens

### 4. Validate

> Goal: confirm the MCP works

1. Check the JSON syntax
2. Run `agent-browser mcp --tools core` if present
3. Check the logs that the server starts
4. If it fails → `/resolve-errors`

### 5. Report

> Goal: summarize results

1. Run `/report` showing servers, command, status
2. Run `/suggest-next-action`

## Rules

### 1. No Secrets

- Never put tokens, keys in config files
- Use env vars or a secret manager
- Use `.env` and reference it

### 2. Local First

- Use local packages or `npx -y` first
- If a global install is required → state it clearly

### 3. Validate JSON

- Must have the `mcpServers` object
- Each server has `command`, `args`, `env`
- Check commas, quotes, brackets

### 4. Document

- Record how to start each server in `README.md` or `AGENTS.md`
- Note the servers needing manual setup
- Use /update-devin if needed


## Expected Outcome

- `.devin/mcp_config.json` is correct
- MCP servers can start
- No secrets in config
- Documentation is complete

