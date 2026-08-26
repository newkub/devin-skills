# Claude Code Plugin Reference

## Official Sources

- Claude Code plugin docs: https://code.claude.com/docs/en/plugins.md
- Plugin dev toolkit: https://claude.com/plugins/plugin-dev
- Plugin structure spec: https://github.com/anthropics/claude-plugins-official

## Plugin Manifest

File: `.claude-plugin/plugin.json`

Required fields:

- `name`: kebab-case plugin name
- `description`: short summary
- `version`: semver
- `author`: object with `name`

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

```
plugin/
├── .claude-plugin/
│   └── plugin.json
├── commands/          # slash commands (.md)
├── agents/            # subagent definitions (.md)
├── skills/            # agent skills (SKILL.md in subdirs)
├── hooks/             # hooks.json + handlers
├── .mcp.json          # MCP server definitions
└── scripts/           # helper scripts
```

## Components

- `skills/`: user-initiated actions or specialized knowledge. Preferred format.
- `agents/`: autonomous tasks.
- `hooks/`: event-driven automation (pre/post tool use, stop, etc.).
- `commands/`: slash commands (legacy).
- `mcpServers`: external service integration via MCP in `.mcp.json`.

## Best Practices

- Keep core lean, detailed docs in `references/`.
- Use progressive disclosure.
- Security first: no secrets, use env vars.
- Use `${CLAUDE_PLUGIN_ROOT}` for portable paths.
- Only create directories for components you need.

## Testing

Run Claude Code with `--plugin-dir <path>` to load and test locally.
