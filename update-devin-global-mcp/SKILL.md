---
name: update-devin-global-mcp
description: Add, update, remove, or sync global MCP servers in devin mcp_config.json with dotfiles check
argument-hint: "[scope]"
related:
  - update-devin
  - follow-create-mcp
  - create-devin-global-mcp
  - update-chezmoi
  - report
  - suggest-next-action

---

## Goal

Update the global MCP servers in `%APPDATA%\devin\mcp_config.json`, checking the dotfiles remote repo for a config to sync or reference

## Scope

- Read `%APPDATA%\devin\mcp_config.json`
- Check the remote dotfiles repo for a relevant `mcp_config.json`
- Add, update, or remove a server in `mcpServers`
- Back up the config before editing
- Validate the JSON syntax and schema
- To create a new server and register it right away → hand off to `/create-devin-global-mcp`

## Execute

### 1. Prepare

> Goal: Understand the current config

1. Read `%APPDATA%\devin\mcp_config.json`
2. If the file is missing → create it with `{ "mcpServers": {} }`
3. Back up the file to `mcp_config.json.bak`
4. Use `mcp_list_servers` to see the live servers when available

### 2. Check Dotfiles Remote

> Goal: Check whether the dotfiles repo has a relevant mcp config

1. Identify the dotfiles owner/repo from the argument or `gh api user -q '.login'`
2. Run `gh repo view <owner>/dotfiles` to confirm the repo exists
3. Look for `mcp_config.json` in the dotfiles with `gh api repos/<owner>/dotfiles/contents` or the tree API
4. If a devin-related file is found (e.g. `dot_devin/mcp_config.json` or `AppData/Roaming/devin/mcp_config.json`) → fetch the content and decode the base64
5. If only `dot_codeium/windsurf/mcp_config.json` is found → report it as Codeium/Windsurf config, separate from devin, and do not auto-sync
6. Compare the dotfiles config (if any) with the local config
7. If the dotfiles have no devin mcp config → the local file is the source of truth

### 3. Determine Operation

> Goal: Identify what to do

1. Take the server name and action from the user: `add`, `update`, `remove`, `sync`
2. For `add` → take command, args, env
3. For `update` → take the fields to change
4. For `remove` → confirm that no other skill depends on that server
5. For `sync` → ask for the direction: dotfiles → local or local → dotfiles

### 4. Edit Config

> Goal: Edit the JSON file

1. Use `write` or `edit` to modify the JSON
2. For `add`: add a key to `mcpServers` with `command`, `args`, `env`
3. For `update`: change the specified fields
4. For `remove`: delete the key from `mcpServers`
5. For `sync`: merge in the chosen direction without overwriting unconfirmed values
6. Save the JSON pretty-printed with a 2-space indent

### 5. Validate

> Goal: Check correctness

1. Check the JSON syntax with PowerShell `ConvertFrom-Json`
2. Check that the root key `mcpServers` exists
3. Check that each server has `command` as a string
4. Check that `args` is an array of strings
5. Check that `env`, when present, is an object
6. Do not expose secrets in the JSON unless required

### 6. Test And Report

> Goal: Confirm it works

1. Run `mcp_list_servers` or `mcp_call_tool` after the edit
2. Run `mcp_list_tools` for the server that changed
3. Run `/report` with a summary of the changes
4. If dotfiles exist → run `/update-chezmoi` or report that a sync is still needed
5. Run `/suggest-next-action` if a tool needs testing

## Rules

### 1. Backup

- Always back up `%APPDATA%\devin\mcp_config.json` before editing
- Keep the backup at `mcp_config.json.bak`

### 2. Schema

- The server shape must be:
  ```json
  {
    "mcpServers": {
      "server-name": {
        "command": "...",
        "args": ["..."],
        "env": { "KEY": "VALUE" }
      }
    }
  }
  ```
- Never add fields beyond `command`, `args`, `env`

### 3. Security

- Never commit secrets into `mcp_config.json`
- Use env vars for tokens/keys
- If the config already contains a secret → warn the user and redact it

### 4. Dotfiles

- Check the remote dotfiles before editing, as a reference
- If the dotfiles have a devin mcp config that differs from local → ask the user before merging
- If there are no dotfiles, or no devin mcp config there → the local file is the source of truth

### 5. Safety

- When removing a server → check the dependents first
- If the server is broken after the change → revert from the backup

- Use /follow-create-mcp if needed
- Use /update-devin if needed


## Expected Outcome

- `%APPDATA%\devin\mcp_config.json` is schema-correct
- The MCP servers work as expected
- A backup exists before the edits
- The remote dotfiles were checked and reported
- A change report with the next action

