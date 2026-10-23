# APIs / Configuration Reference

| key | value |
| --- | --- |
| package | `@qoder-ai/qodercli` (legacy npm) / native standalone binary |
| install cmd (recommended) | `curl -fsSL https://qoder.com/install -o /tmp/qoder-install.sh && bash /tmp/qoder-install.sh` (macOS/Linux); `irm https://qoder.com/install.ps1 -OutFile $env:TEMP\qoder-install.ps1; & $env:TEMP\qoder-install.ps1` (Windows PowerShell) |
| install cmd (npm) | `npm install -g @qoder-ai/qodercli` (Node ≥ 20, slower) |
| stable version | `1.1.71` (local check 2026-10-15) |
| license | proprietary (Qoder) |
| docs | https://docs.qoder.com/cli/overview |
| config dir | `~/.qoder` (`QODER_CONFIG_DIR`) |
| settings files | `~/.qoder/settings.json`, `<project>/.qoder/settings.json`, `<project>/.qoder/settings.local.json` |
| session store | `~/.qoder/projects/<project>/<session-id>.jsonl` + `<session-id>/state.json` |
| auth | `/login` (browser/PAT) or `QODER_PERSONAL_ACCESS_TOKEN` |
| PAT page | https://qoder.com/account/integrations |

## Environment Variables

| var | default | purpose |
| --- | --- | --- |
| `QODER_PERSONAL_ACCESS_TOKEN` | unset | PAT auth; wins over `/login` when set |
| `QODER_CONFIG_DIR` | `~/.qoder` | custom user config root |
| `QODER_MCP_LAZY` | unset (`1` enables) | lazy MCP loading (same as `mcp.lazyLoad`) |

## Settings Keys (`settings.json`)

| key | type | default | notes |
| --- | --- | --- | --- |
| `outputStyle` | string | none | active output style (restart) |
| `language` | string | none | preferred AI response language (restart) |
| `agent` | string | none | main-thread agent name (restart) |
| `general.enableAutoUpdate` | boolean | `true` | auto-upgrade on/off |
| `general.defaultPermissionMode` | enum | `default` | `default`/`accept_edits`/`auto`/`bypass_permissions`/`dont_ask` |
| `general.plan.enabled` | boolean | `true` | disable to remove `/plan` |
| `ui.theme` | string | none | color theme |
| `ui.autoThemeSwitching` | boolean | `true` | light/dark by terminal bg |
| `ui.language` | enum | `en` | `auto`/`zh-CN`/`en` (immediate) |
| `ui.maxTurns` | enum | `1000` | `1000`/`2000`/`3000`/`unlimited`; not for `-p` |
| `ui.hideBanner` | boolean | `false` | hide startup banner |
| `model.name` | string | none | conversation model |
| `model.reasoningEffort` | enum | none | `low`/`medium`/`high` |
| `tools.useRipgrep` | boolean | `true` | ripgrep for content search |
| `tools.shell.inactivityTimeout` | number | `300` | no-output timeout (s) |
| `tools.core` | string[] | none | built-in tool allowlist (restart) |
| `tools.exclude` | string[] | none | tools to exclude from discovery (restart) |
| `security.folderTrust.enabled` | boolean | `true` | gate for project/local config (restart) |
| `security.disableYoloMode` | boolean | `false` | forbid `bypass_permissions` (restart) |
| `security.blockGitExtensions` | boolean | `false` | block Git-sourced extensions (restart) |
| `security.environmentVariableRedaction.enabled` | boolean | `false` | mask key-like env (restart) |
| `mcpServers` | object | `{}` | MCP server configs (restart) |
| `mcp.allowed` / `mcp.excluded` | string[] | none | MCP server allow/blocklist (restart) |
| `mcp.enableAllProjectMcpServers` | boolean | `false` | auto-approve project MCP (restart) |
| `mcp.enabledProjectMcpServers` | string[] | none | approve project servers by name |
| `mcp.lazyLoad` | boolean | `false` | expose only `mcp_list`/`mcp_get`/`mcp_call` meta tools |
| `permissions.allow` / `ask` / `deny` | string[] | none | rule syntax `Tool(target)`, e.g. `Bash(npm run test:*)` |
| `autoMode.allow` / `soft_deny` / `environment` | string[] | none | soft guidance for `auto` classifier (global settings only) |
| `statusLine.type` | string | `command` | only `command` supported |
| `statusLine.command` | string | `""` | shell cmd; session JSON on stdin |
| `statusLine.padding` | number | `0` | horizontal padding |

## Permission Modes

| mode | aliases | behavior |
| --- | --- | --- |
| `default` | — | safe reads/internal auto; sensitive actions confirm |
| `accept_edits` | `acceptEdits` | auto-approve safe in-dir file edits; shell/external still checked |
| `auto` | — | agent/AI classifier decides authorization |
| `bypass_permissions` | `yolo`, `bypassPermissions`, `--yolo`, `--dangerously-skip-permissions` | skip prompts; path-shape guards remain |
| `dont_ask` | `dontAsk` | never prompt; anything that would ask is denied |
| `plan` (legacy) | — | maps to `default` + Plan work state |

Decision order: deny rules → tool safety checks → ask rules → allow/mode auto-allow. `ask` consumed: TUI=prompt, Headless=deny, SDK=`canUseTool` callback, ACP=`requestPermission` RPC. Non-default modes apply only in trusted dirs.

## MCP Transport Types

| type | fields | connects |
| --- | --- | --- |
| `stdio` (default) | `command`, `args`, `env`, `cwd` | subprocess stdin/stdout |
| `sse` | `url`, `headers` | Server-Sent Events over HTTP |
| `http`/`streamable-http` | `url`, `headers` | HTTP JSON-RPC (+ optional streaming) |
| `ws` | `tcp` (host/port) | WebSocket/TCP |
| `sdk` | — | in-process built-in |
| common optional | `timeout`, `description`, `trust`, `includeTools`, `excludeTools`, `disabled`, `alwaysAllow`, `oauth`, `qoder_url` | — |

## Built-in Skills (slash-invoked)

| command | purpose |
| --- | --- |
| `/simplify` | review changed code for reuse/quality/efficiency, parallel fix perspectives |
| `/debug` | enable session debug logs, tail log, diagnose |
| `/security-scan` | Qoder cloud security scan (L2 lightweight / L3 deep) |
| `/quest` | workflow orchestrator guiding feature dev via subagents |
| `/mcp-config` | interactively add/update/remove MCP server config |
| `/loop` | repeatedly run a prompt/command at fixed intervals |
| `/run` | start and drive the real app to observe changes |
| `/verify` | run the app and verify changes achieve expected behavior |
| `/remember` | review Auto-Memory, promote to instructions, find stale/dup entries |
| `/batch` | bulk multi-file changes via parallel agents in isolated worktrees |
| `/run-skill-generator` | generate a project-level run/debug skill |
| `/workflow-authoring` | reference for writing Workflow scripts |
