---
name: update-devin-global-mcp
description: Create, add, update, remove, or sync global MCP servers in ~/.agents/mcp/mcp_config.json
argument-hint: "[create|add|update|remove|sync] [server]"
related:
  - follow-create-mcp
  - update-dot-agents-project
  - follow-secret-manager
  - deep-validate
  - report
  - suggest-next-action
---

## Goal

Keep the global MCP registry at `~/.agents/mcp/mcp_config.json` correct — create a server end to end, then add, update, remove, or sync an entry

## Scope

- Config: `~/.agents/mcp/mcp_config.json` is the source of truth; `%APPDATA%\devin\mcp_config.json` is a client mirror, never the source
- Modes: `create`, `add`, `update`, `remove`, `sync`; default `add`
- The remote dotfiles repo is checked as a reference before editing
- Project scope → `/update-dot-agents-project mcp`; a new server project → `/follow-create-mcp`

## Execute

### 1. Pick Mode

> Goal: route the request

| Mode | Use when | Result |
|---|---|---|
| `create` | a new MCP server must be built and registered | server project created, then registered |
| `add` | the server already exists | one new entry in `mcpServers` |
| `update` | fields of an existing server change | edited entry |
| `remove` | the server is no longer used | entry deleted after dependents are checked |
| `sync` | the dotfiles remote differs from local | merged in the chosen direction |

1. Read the argument; when empty use `add`
2. Unknown mode → `/ask-me`

### 2. Prepare

> Goal: understand the current config before any edit

1. Read `~/.agents/mcp/mcp_config.json`
2. If the file is missing → create it with `{ "mcpServers": {} }` and report that
3. Back up the file to `mcp_config.json.bak`
4. Use `mcp_list_servers` for the live server list when available

### 3. Create Mode

> Goal: build the server, then register it

1. Run `/follow-create-mcp` with the server name, transport, and tools
2. Record the server path, `command`, and `args`
3. Run `/deep-validate` on the server project
4. Continue at Edit Config with an `add` operation
5. After registering, test with `mcp_list_servers` and `mcp_call_tool`

### 4. Check Dotfiles Remote

> Goal: use the dotfiles repo as a reference, never as an override

1. Identify the dotfiles owner/repo from the argument or `gh api user -q '.login'`
2. Run `gh repo view <owner>/dotfiles` to confirm it exists
3. Look for an MCP config with `gh api repos/<owner>/dotfiles/contents` or the tree API
4. When found → fetch and decode, then compare with the local file
5. When the dotfiles have no agents MCP config → the local file is the source of truth

### 5. Edit Config

> Goal: change only the requested entry

1. For `add`: insert a key in `mcpServers` with `command`, `args`, `env`
2. For `update`: change only the named fields
3. For `remove`: confirm no other skill depends on the server first
4. For `sync`: merge in the direction the user chose; never overwrite unconfirmed values
5. For `create`: same as `add`, using the values recorded in Create Mode
6. Save pretty-printed JSON with a 2-space indent

### 6. Validate

> Goal: prove the file is schema-correct

1. Parse the JSON, e.g. PowerShell `Get-Content ... | ConvertFrom-Json`
2. Root key `mcpServers` exists and is an object
3. Every server has `command` as a string
4. `args` is an array of strings; `env`, when present, is an object
5. No secret value is printed in the report

### 7. Test And Report

> Goal: confirm the change works

1. Run `mcp_list_servers`, then `mcp_list_tools` for the changed server
2. If the server fails to load → restore the backup and run `/resolve-errors`
3. Follow `/report`; table columns: No., Server, Mode, Status
4. Use `/follow-secret-manager` when a credential is needed
5. End with `/suggest-next-action` when a tool still needs testing

## Rules

- Always back up `mcp_config.json` before editing; keep `mcp_config.json.bak`
- Never add fields beyond `command`, `args`, `env`
- Never commit secrets into the config; use env vars and `/follow-secret-manager`
- If the existing config contains a secret → warn the user and redact it
- When the dotfiles config differs from local → ask before merging
- When removing a server → check dependents first
- Never report `create` as complete until `mcp_list_servers` shows the server and `mcp_call_tool` answers

## Expected Outcome

- `~/.agents/mcp/mcp_config.json` is schema-correct with a backup on disk
- A created server is built, registered, and answers a tool call
- Dotfiles differences are reported, never merged silently
- A change report with the mode, status, and next action
