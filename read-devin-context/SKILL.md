---
name: read-devin-context
description: Read and summarize all devin context before starting work
argument-hint: "[scope]"
related:
  - reset-context
  - follow-context-engineering
  - update-devin-global-skills
  - ask-me
---

## Goal

Summarize devin context (global rules, skills, mcp, hooks, plugins, etc.) to prepare for the task and reduce wrong decisions

## Scope

Read both global and project context that affects how devin works, including `global_rules.md`, skills, mcp config, hooks, plugins

## Execute

### 1. Discover Context Paths

> Goal: Find context directories in the environment

1. Check for global context:
   - Windows: `%APPDATA%\devin`, e.g. `C:\Users\<user>\AppData\Roaming\devin`
   - Linux/macOS: `~/.config/devin` and `~/.devin`
2. Check for windsurf context:
   - `C:\Users\<user>\.codeium\windsurf\memories\global_rules.md`
   - `C:\Users\<user>\.codeium\windsurf\skills`
3. Check for project context:
   - `.devin/`, `.windsurf/`, `.devin/skills/`, `.devin/mcp.json`, `.devin/hooks/`, `rules/`, `sgconfig.yml`
4. If an important path is not found → report and skip

### 2. Read Global Rules

> Goal: Read global rules

1. Read `global_rules.md` from windsurf memories or the project `AGENTS.md`
2. Summarize the step order, restrictions, and required references
3. If the file does not exist → report that no global rules were found

### 3. Read Skills

> Goal: Read skills context

1. List skills in `%APPDATA%\devin\skills` (global skills)
2. List skills in `C:\Users\<user>\.codeium\windsurf\skills` (windsurf skills)
3. List project skills in `.devin/skills/` or `.windsurf/skills/` if any
4. If there is a skill matching the task, point to it and read only the essential main `SKILL.md`

### 4. Read MCP Config

> Goal: Read mcp configuration

1. Read `%APPDATA%\devin\mcp_config.json`
2. Check for `.mcp.json` or `mcp/` in the project
3. List mcp server names, commands, urls, and disabled status
4. Do not expose secrets or credentials

### 5. Read Hooks

> Goal: Read hooks that may affect work

1. List files in `%APPDATA%\devin\hooks`
2. List files in `cli/plugins/*/hooks/` or `cli/plugins/cache/*/hooks/`
3. List hooks in the project `.devin/hooks/`
4. Read important hook files (`*.ps1`, `*.mjs`, `*.json`) but do not read binaries

### 6. Read Plugins

> Goal: Read plugins/extensions

1. List files/folders in `%APPDATA%\devin\cli\plugins\cache`
2. List `.devin/extensions` or `plugins/` in the project
3. Summarize plugin names and versions if obtainable

### 7. Summarize Context

> Goal: Summarize context for use

1. Create a summary table: context type | location | status | key points
2. Identify context that is missing or may be outdated
3. Run `ask-me` if a conflict is found or a context decision is needed

## Rules

### Path Discovery

- Use `glob` or `exec` to find directories before reading
- Check that the path really exists before `read`
- Support Windows, Linux, macOS paths

### Safety

- Do not read binaries, cache, logs, or sensitive files
- Do not expose secrets or credentials from `mcp_config.json`
- If a file is longer than 250 lines, read the header and summarize

### Output

- Summarize as a table or concise bullet points
- Identify context that is not found or missing
- Do not modify context in this step

- Use /reset-context if needed
- Use /follow-context-engineering if needed
- Use /update-devin-global-skills if needed (devin context)

## Expected Outcome

- A list of all context with location and status
- A summary of key points from global rules, skills, mcp, hooks, plugins
- No important context is missing without being reported
