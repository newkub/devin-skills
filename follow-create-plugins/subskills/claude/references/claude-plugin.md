# Claude Code Plugin Reference

## Official Sources

- Create plugins: https://code.claude.com/docs/en/plugins.md
- Plugins reference (full schema): https://code.claude.com/docs/en/plugins-reference.md
- Plugin marketplaces: https://code.claude.com/docs/en/plugin-marketplaces.md
- Plugin dev toolkit: https://claude.com/plugins/plugin-dev
- Plugin structure spec: https://github.com/anthropics/claude-plugins-official

## Plugin Manifest

File: `.claude-plugin/plugin.json`

- `name`: kebab-case plugin name — เป็น namespace ของ skills (`/plugin-name:skill-name`)
- `description`: short summary (shown in plugin manager)
- `version`: optional semver — ถ้าตั้งไว้ users จะได้ update เมื่อ bump เท่านั้น
- `author`: optional object with `name`
- Optional: `homepage`, `repository`, `license`, `keywords`

Example:

```json
{
  "name": "my-first-plugin",
  "description": "A greeting plugin",
  "version": "1.0.0",
  "author": { "name": "Your Name" }
}
```

## Directory Layout

All component directories live at the plugin root — only `plugin.json` goes inside `.claude-plugin/`:

```
plugin/
├── .claude-plugin/
│   └── plugin.json
├── skills/            # <name>/SKILL.md per skill (preferred)
├── commands/          # flat .md slash commands (legacy — use skills/)
├── agents/            # custom agent definitions (.md)
├── hooks/             # hooks.json + handler scripts
├── monitors/          # monitors.json — background monitors
├── bin/               # executables added to Bash tool PATH
├── .mcp.json          # MCP server definitions
├── .lsp.json          # LSP server configurations
├── settings.json      # default settings (`agent`, `subagentStatusLine`)
├── scripts/           # helper scripts
└── README.md
```

Single-skill plugins can place `SKILL.md` at the plugin root directly.

## Components

- `skills/`: model-invoked skills; invoked as `/plugin-name:skill-name`; supports `$ARGUMENTS`.
- `agents/`: autonomous subagent definitions.
- `hooks/`: event-driven automation (SessionStart, pre/post tool use, stop, etc.).
- `commands/`: slash commands (legacy format).
- `.mcp.json`: external service integration via MCP.
- `.lsp.json`: language servers — keys are language names with `command`, `args`, `extensionToLanguage`; users must have the server binary installed.
- `monitors/monitors.json`: array of `{ name, command, description }` — each stdout line becomes a notification to Claude.
- `bin/`: executables exposed on PATH while plugin is enabled (not allowed in claude.ai org-distributed plugins).
- `settings.json`: default settings applied when plugin is enabled; `agent` activates a plugin agent as the main thread.

## Scaffolding And Testing

- `claude plugin init <name>` — scaffolds `~/.claude/skills/<name>` with manifest + starter `SKILL.md` (loads as `<name>@skills-dir`, no marketplace needed).
- `claude --plugin-dir <path>` — load a plugin dir, `.zip`, or folder-of-plugins for the session.
- `claude --plugin-url <url>` — fetch and load a hosted `.zip` archive.
- `/reload-plugins` — pick up plugin changes without restarting.
- `claude plugin validate <path>` — validate before submitting (`--strict` fails on warnings).
- `/plugin` manager — Errors tab shows load failures (e.g., missing LSP binary).

## Best Practices

- Keep core lean, detailed docs in `references/`.
- Use progressive disclosure.
- Security first: no secrets, use env vars.
- Use `${CLAUDE_PLUGIN_ROOT}` for portable paths.
- Only create directories for components you need.
- Plugin skills are always namespaced — change `name` in `plugin.json` to change the prefix.

## Distribution

- Local/skills-dir: `claude plugin init`, `--plugin-dir`, `--plugin-url`.
- Marketplace: `.claude-plugin/marketplace.json` catalog; see plugin-marketplaces docs.
- Public submission: claude.ai admin-settings directory form (Team/Enterprise) or platform.claude.com/plugins/submit — approved plugins pin a commit SHA in `anthropics/claude-plugins-community`.

