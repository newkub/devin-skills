# Codex / ChatGPT Plugin Reference

## Official Sources

- Build plugins: https://developers.openai.com/codex/plugins/build
- Package your plugin: https://developers.openai.com/plugins/build/plugins
- Quickstart: https://developers.openai.com/plugins/quickstart
- Plugin JSON spec: https://github.com/openai/codex/blob/main/codex-rs/skills/src/assets/samples/plugin-creator/references/plugin-json-spec.md

## Plugin Manifest

File: `.codex-plugin/plugin.json`

Required fields:

- `name`: kebab-case plugin name
- `version`: semver
- `description`: short summary
- `author`: object with `name`, optional `email`/`url`

Optional but recommended:

- `homepage`, `repository`, `license`, `keywords`
- `skills`: path to `skills/` directory
- `hooks`: path to `hooks.json`
- `mcpServers`: path to `.mcp.json`
- `apps`: path to `.app.json`
- `interface`: display name, descriptions, category, capabilities, icons, brand color, default prompts

## Directory Layout

```
plugin/
├── .codex-plugin/
│   └── plugin.json
├── skills/            # reusable workflows (SKILL.md files)
├── .mcp.json          # MCP server definitions
├── .app.json          # registered app/MCP connection
├── hooks.json         # lifecycle hooks
└── README.md
```

## Components

- `skills/`: reusable instructions and workflows.
- `mcpServers`: expose tools through Model Context Protocol.
- `apps`: connect a registered app or MCP server to ChatGPT/Codex.
- `hooks`: lifecycle events for plugin installation/updates.

## Creating A Plugin

### With @plugin-creator

1. Register an app or MCP server in ChatGPT developer mode.
2. In ChatGPT Work: `@plugin-creator` with the app/MCP ID.
3. In Codex CLI: `$plugin-creator` with the ID.
4. Review `.codex-plugin/plugin.json`, `.app.json`, `.mcp.json`.

### Manual

1. Create `.codex-plugin/plugin.json`.
2. Add `skills/`, `.mcp.json`, `.app.json` as needed.
3. Add an `interface` block for the plugin directory UI.

## Testing

1. Open ChatGPT and switch to `Work`.
2. Go to `Plugins` and install from your local/personal marketplace.
3. Start a new Work chat, type `@`, select the plugin.
4. Invoke a tool and verify the MCP/skill response.

## Best Practices

- No secrets in the plugin bundle; use environment variables.
- Use MCP for external APIs; skills for reusable prompts.
- Provide clear `defaultPrompt` examples in the interface.
- Add `category` and `capabilities` for discovery.
- Validate `plugin.json` against the JSON spec before publishing.
