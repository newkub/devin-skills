---
title: Safety And Security Checks
description: Safety and security validation rules for subagents
---

# Safety And Security Checks

## Secrets Check

Check that `AGENT.md` contains no hardcoded secrets or credentials:

- API keys
- passwords
- tokens
- private keys
- connection strings

### Patterns To Flag

- The words `password`, `secret`, `token`, `api_key` followed by a real value
- Strings that look like base64 or unusually long hex
- If found → flag as Critical

## Permissions Deny Risky Paths

`permissions` must specify `deny` for risky system paths:

- `%APPDATA%` outside scope
- `C:\Windows`
- `C:\Program Files`
- `C:\Program Files (x86)`
- `/etc`, `/usr`, `/bin` (for Linux/macOS)
- `~/.ssh`
- `~/.aws`

### Rules

- If `permissions` is missing → flag as High
- If `permissions` exists but has no `deny` → flag as High
- If `deny` does not cover risky paths → flag as High

## Allowed-Tools Appropriateness

`allowed-tools` must fit the subagent's scope:

- Never grant overly broad tools such as `*` or `all`
- Never grant risky tools such as `exec` when the subagent doesn't need to run commands
- If `allowed-tools` is too broad → flag as Medium

## Severity Mapping

| Finding | Severity |
|---|---|
| secrets/credentials hardcoded | Critical |
| Missing `permissions` or `deny` | High |
| `deny` does not cover risky paths | High |
| `allowed-tools` overly broad | Medium |

## Evidence Format

Record each finding with:

- file path of `AGENT.md`
- line number where it was found
- the risky content
- recommended action, e.g. remove the secret, add a `deny` path
