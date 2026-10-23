---
name: update-dot-agents-project-mcp
description: Configure and update MCP servers in .agents/mcp/mcp_config.json per project
related:
  - update-dot-agents-project
  - resolve-errors
  - report
---

## Goal

Configure and update MCP servers for a project in `<project>/.agents/mcp/mcp_config.json`

## Scope

- Project config: `<project>/.agents/mcp/mcp_config.json`
- Global config: `~/.agents/mcp/mcp_config.json` — mirror a server there only when it is shared by every project
- Use when a project needs browser, search, database, or GitHub tooling through MCP

## Execute

### 1. Detect MCP Needs

> Goal: learn which servers the project actually needs

1. Read `package.json` and `AGENTS.md`
2. Identify the tools and services that need MCP
3. Read the global `~/.agents/mcp/mcp_config.json` to avoid duplicates
4. Record which servers are project-scoped and which are global

### 2. Write The Project Config

> Goal: a valid config with only the needed servers

1. Create `.agents/mcp/mcp_config.json` when missing
2. Use the schema `{ "mcpServers": { "<name>": { "command": "...", "args": [], "env": {} } } }`
3. Use `bunx` for package-based servers — it never prompts, so no `-y` flag
4. Pin package versions instead of `@latest` when the project ships to production
5. Reference env vars for credentials; never inline a token or key

### 3. Register Shared Servers Globally

> Goal: shared servers are configured once

1. Add a server to `~/.agents/mcp/mcp_config.json` only when every project needs it
2. Use an absolute path or a package name
3. Never duplicate a server that already exists in either config

### 4. Validate

> Goal: confirm every server starts

1. Parse every JSON file to confirm syntax
2. Start each new server once and confirm it responds
3. Check for tool-name collisions with existing servers
4. Fix failures with `/resolve-errors` and rerun

### 5. Report

> Goal: summarize the server state

1. Run `/report` with No., Server, Transport, Status
2. State the scope of each server: project or global
3. Document startup steps in `README.md` or `AGENTS.md`
4. Run `/suggest-next-action`

## Rules

- Never store secrets, tokens, or keys in a config file — use env vars or a secret manager
- Prefer local packages or `bunx`; state clearly when a global install is required
- Every `mcpServers` entry has `command`, `args`, and `env`
- No duplicate server names across project and global config
- Never use `**` bold; use backticks for servers, commands, and paths

## Expected Outcome

- `.agents/mcp/mcp_config.json` is valid and holds only the servers the project needs
- Every new server starts and responds
- Shared servers are registered once at the global level
- No secret is stored in any config
