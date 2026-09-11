# Codex / ChatGPT Plugin Reference

## Official Sources

- Package your plugin: https://developers.openai.com/codex/plugins/build
- Build skills: https://developers.openai.com/plugins/build/skills
- Build MCP server: https://developers.openai.com/plugins/build/mcp-server
- Quickstart: https://developers.openai.com/plugins/quickstart
- Submission: https://developers.openai.com/plugins/deploy/submission
- Public examples: https://github.com/openai/plugins (figma, notion, build-web-apps)

## Manifest Formats

### Portable Agent Plugins manifest (preferred)

File: `plugin.json` at the **plugin root**.

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/plugin.schema.json",
  "name": "my-plugin",
  "version": "0.1.0",
  "description": "Bundle reusable skills and MCP servers.",
  "author": { "name": "Your team", "email": "team@example.com", "url": "https://example.com" },
  "homepage": "https://example.com/plugins/my-plugin",
  "repository": "https://github.com/example/my-plugin",
  "license": "MIT",
  "keywords": ["research", "crm"],
  "extensions": {
    "com.openai": {
      "apps": "./.app.json",
      "hooks": "./hooks/hooks.json",
      "interface": {
        "displayName": "My Plugin",
        "shortDescription": "Reusable skills and MCP servers",
        "longDescription": "Distribute skills and MCP servers together.",
        "developerName": "Your team",
        "category": "Productivity",
        "capabilities": ["Read", "Write"],
        "websiteURL": "https://example.com",
        "privacyPolicyURL": "https://example.com/privacy",
        "termsOfServiceURL": "https://example.com/terms",
        "defaultPrompt": ["Use My Plugin to summarize new CRM notes."],
        "brandColor": "#10A37F",
        "composerIcon": "./assets/icon.png",
        "logo": "./assets/logo.png",
        "screenshots": ["./assets/screenshot-1.png"]
      }
    }
  }
}
```

- `name` kebab-case is the plugin identifier and component namespace.
- `skills/` and `mcp.json` are auto-discovered — no `skills`/`mcpServers` fields needed in a portable manifest.
- `extensions.com.openai` holds OpenAI-specific settings (`apps`, `hooks`, `interface`). If present as an object, it **replaces** the `.codex-plugin` overlay entirely — the two are not merged.
- Paths must start with `./`, resolve relative to plugin root, and stay inside it.

### Compatibility fallback

`.codex-plugin/plugin.json` (legacy Codex layout, what `@plugin-creator` scaffolds). Still supported; declare `apps`, `hooks`, `interface`, `skills` inside it. New packages should prefer the portable root manifest.

## Directory Layout

```
plugin/
├── plugin.json          # portable manifest (root)
├── skills/              # <name>/SKILL.md
├── mcp.json             # bundled MCP servers (portable schema)
├── .app.json            # registered app/MCP server mappings
├── hooks/
│   └── hooks.json       # lifecycle hooks (default discovery)
├── assets/              # icons, logo, screenshots
├── .codex-plugin/
│   └── plugin.json      # OPTIONAL compat overlay
└── README.md
```

## mcp.json (Portable MCP)

```json
{
  "$schema": "https://agent-plugins.org/schemas/1.0.0/mcp.schema.json",
  "mcpServers": {
    "docs": { "type": "streamable-http", "url": "https://example.com/mcp" }
  }
}
```

For public submission the MCP server must be a public HTTPS endpoint. `.mcp.json` (dotfile, no `type` field) is the legacy format — don't just rename it.

## Hooks

- Codex discovers `hooks/hooks.json` by default; override with `extensions.com.openai.hooks` (single path, array of paths, or inline object — replaces discovery, does not add).
- Hook commands get env `PLUGIN_ROOT` and `PLUGIN_DATA` (`CLAUDE_PLUGIN_ROOT`/`CLAUDE_PLUGIN_DATA` also set for compatibility).
- Plugin-bundled hooks are non-managed: Codex skips them until the user reviews and trusts the hook definition.
- Per-plugin MCP policy via `.codex/config.toml`: `[plugins."name".mcp_servers.<server>]`.

## Marketplaces And Testing

- Repo marketplace: `$REPO_ROOT/.agents/plugins/marketplace.json` (legacy `.claude-plugin/marketplace.json` also read).
- Personal marketplace: `~/.agents/plugins/marketplace.json`; plugins commonly under `~/.codex/plugins/`.
- Entry fields: `name`, `source` (`local`/`url`/`git-subdir`/`npm` with `./`-prefixed `path`), `policy.installation` (`AVAILABLE`/`INSTALLED_BY_DEFAULT`/`NOT_AVAILABLE`), `policy.authentication` (`ON_INSTALL`), `category`.
- CLI: `codex plugin marketplace add <owner/repo|git-url|local-path> [--ref] [--sparse]`, `list`, `upgrade`, `remove`.
- Installed copies land in `~/.codex/plugins/cache/<marketplace>/<plugin>/<version>/`.
- Enable/disable per repo: `.codex/config.toml` → `[plugins."name@marketplace"] enabled = true`.
- Publish to workspace (admin): chatgpt.com/plugins → Personal → Publish.

## Creating A Plugin

### With @plugin-creator

1. Register the MCP server in ChatGPT developer mode (Settings → Security and login → Developer mode; chatgpt.com/plugins → +). Copy the `plugin_asdk_app...` technical ID from the URL.
2. In ChatGPT Work: `@plugin-creator`; in Codex CLI: `$plugin-creator` — pass the ID.
3. Review `.codex-plugin/plugin.json`, `.app.json`, `.mcp.json`; add `skills/` as needed; ask it to also generate a personal marketplace entry for local testing.

### Manual

1. Create root `plugin.json` with the Agent Plugins `$schema`.
2. Add `skills/<name>/SKILL.md`, `mcp.json`, `.app.json`, `hooks/hooks.json` as needed.
3. Wire into a marketplace (see above) and restart the ChatGPT desktop app to install.

## Best Practices

- No secrets in the plugin bundle; use environment variables.
- Use MCP for external APIs; skills for reusable prompts.
- Provide clear `defaultPrompt` examples in `interface`.
- Add `category` and `capabilities` for discovery.
- Keep visual assets under `./assets/`.
