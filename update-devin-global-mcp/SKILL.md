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
  - idea-global-mcp
  - follow-single-of-source
  - use-scripts
  - resolve-errors
  - ask-me
---

## Goal

Keep the global MCP registry at `~/.agents/mcp/mcp_config.json` correct — create a server end to end, then add, update, remove, or sync an entry

## Scope

- Config: `~/.agents/mcp/mcp_config.json` is the source of truth; `%APPDATA%\devin\mcp_config.json` is a client mirror, never the source
- Modes: `create`, `add`, `update`, `remove`, `sync`; default `add`
- Owns the MCP-or-skill decision: a capability that has to execute for more than one client becomes a global MCP here, it is never left as skill prose only (`### 2`)
- The remote dotfiles repo is checked as a reference before editing
- Project scope → `/update-dot-agents-project mcp`; a new server project → `/follow-create-mcp`
- Candidate discovery and scoring → `/idea-global-mcp`; script conventions → `/use-scripts`

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

### 2. Decide MCP Or Skill

> Goal: give executable capability a server, and keep prose in the skill

| Capability | Artifact | Why |
|---|---|---|
| Runs code — script, CLI wrapper, binary, API call with a structured result | global MCP server (this skill) | every MCP client invokes it directly; the agent gets typed tools instead of prose to follow |
| Read-only reference data or catalogs | MCP resource | fetched on demand, never copied into a prompt |
| Judgement, workflow, or conventions with no executable step | skill only | there is nothing for a server to run |
| Single-use command on this machine only | skill or `/use-scripts` | no second client needs it |

1. Capability executes and more than one client needs it → build and register it as a global MCP (`create`); the skill keeps only the pointer to the server and its tools
2. A tool needs an input schema and a deterministic output — a wrapper around prose is not a tool
3. Both a server and a skill describe one capability → the server owns execution, the skill says so (`/follow-single-of-source`)
4. Candidate list or scoring wanted → `/idea-global-mcp`; still ambiguous → `/ask-me`

### 3. Prepare

> Goal: understand the current config before any edit

1. Read `~/.agents/mcp/mcp_config.json`
2. If the file is missing → create it with `{ "mcpServers": {} }` and report that
3. Back up the file to `mcp_config.json.bak`
4. Use `mcp_list_servers` for the live server list when available

### 4. Create Mode

> Goal: build the server, prove it answers, then register it

1. Run `/follow-create-mcp` with the server name, transport, and tools
2. Record the server path, `command`, and `args`
3. Build the binary and smoke-test it before touching the config: `node scripts/mcp-smoke.mjs --command <exe> --args <build-output>`
4. Fix until the smoke test exits 0 — `initialize`, `tools/list`, and one `tools/call` must succeed
5. Run `/deep-validate` on the server project
6. Continue at Edit Config with an `add` operation

### 5. Check Dotfiles Remote

> Goal: use the dotfiles repo as a reference, never as an override

1. Identify the dotfiles owner/repo from the argument or `gh api user -q '.login'`
2. Run `gh repo view <owner>/dotfiles` to confirm it exists
3. Look for an MCP config with `gh api repos/<owner>/dotfiles/contents` or the tree API
4. When found → fetch and decode, then compare with the local file
5. When the dotfiles have no agents MCP config → the local file is the source of truth

### 6. Edit Config

> Goal: change only the requested entry

1. For `add`: insert a key in `mcpServers` with `command`, `args`, `env`
2. For `update`: change only the named fields
3. For `remove`: confirm no other skill depends on the server first
4. For `sync`: merge in the direction the user chose; never overwrite unconfirmed values
5. For `create`: same as `add`, using the values recorded in Create Mode
6. Save pretty-printed JSON with a 2-space indent

### 7. Validate

> Goal: prove the file is schema-correct

1. Parse the JSON, e.g. PowerShell `Get-Content ... | ConvertFrom-Json`
2. Root key `mcpServers` exists and is an object
3. Every stdio server has `command` as a string; every remote server has `url` or `serverUrl`
4. `args` is an array of strings; `env`, `headers`, when present, are objects
5. No secret value is printed in the report

### 8. Test And Report

> Goal: prove the server answers a real call, not just that the entry exists

1. Stdio server: `node scripts/mcp-smoke.mjs --config ~/.agents/mcp/mcp_config.json --server <name>` — exit code 0 is mandatory; it prints `protocolVersion`, `serverInfo`, `toolCount`, and the tool names
2. Prove execution, not just listing: add `--call <tool> --input '<json>'` with a read-only tool; `call.ok` must be `true`
3. Remote server (`url`/`serverUrl`): the script refuses by design — verify from the client (`mcp_list_servers` + `mcp_list_tools`) or an authenticated `initialize` request, and record which method was used
4. Failure → restore `mcp_config.json.bak`, then run `/resolve-errors`; a server is never reported working without a passing test
5. Copy the verified result into the client mirror `%APPDATA%\devin\mcp_config.json`
6. Follow `/report`; table columns: No., Server, Mode, Test (exit code + tool count), Status
7. Use `/follow-secret-manager` when a credential is needed
8. End with `/suggest-next-action` when a tool still needs testing

## Rules

- Always back up `mcp_config.json` before editing; keep `mcp_config.json.bak`
- Executable capability goes into a server, never only into skill prose — the gate in `### 2` decides before either is written
- Never add fields beyond `command`, `args`, `env` for stdio, or `url`/`serverUrl` with `headers` for remote
- Never commit secrets into the config; use env vars and `/follow-secret-manager`
- If the existing config contains a secret → warn the user and redact it
- When the dotfiles config differs from local → ask before merging
- When removing a server → check dependents first
- Never report `create` or `add` as complete until `scripts/mcp-smoke.mjs` exits 0 for a stdio server, or the client lists a remote one
- Test result is evidence: quote the exit code and the tool count, never "should work"

## Expected Outcome

- `~/.agents/mcp/mcp_config.json` is schema-correct with a backup on disk
- Every added or created server passes `scripts/mcp-smoke.mjs` (or a client-level check for remote) and one real tool call answers
- Capabilities that execute live in a server with the skill pointing at it, not duplicated as prose
- Dotfiles differences are reported, never merged silently
- A change report with the mode, test result, status, and next action
