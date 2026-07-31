# Configuration Guide

## Purpose

ตั้งค่า Windsurf ตามความต้องการของคุณ

## Settings Location

Open Settings via:
- `Cmd/Ctrl + ,` (VS Code style)
- Or from menu: File > Preferences > Settings

## AI Model Selection

### Available Models

**Base Model ⚡**
- Fast and efficient
- Good for autocomplete
- Lower cost

**Windsurf Premier 🚀**
- Most capable
- Best for complex tasks
- Higher cost

**Other Models**
- GPT-4o
- Claude 3.5 Sonnet
- Custom BYOK (Bring Your Own Key)

### Switching Models

1. Open Settings
2. Navigate to "Windsurf" > "Models"
3. Select preferred model for each feature:
   - Autocomplete
   - Chat
   - Cascade

## Auto-Execution Modes

Configure how Cascade executes commands:

**Level 0**: Manual approval for all commands
**Level 1**: Auto-run safe commands (read-only)
**Level 2**: Auto-run most commands
**Level 3**: Full auto-execution

Set in Settings > Windsurf > Cascade > Auto-Execution

## Context Awareness

### Default Context

Windsurf automatically includes:
- Open files
- Recently edited files
- Git repository context

### Knowledge Base (Beta)

Enable to add external documentation:
1. Settings > Windsurf > Context Awareness
2. Enable "Knowledge Base"
3. Add documentation sources

### Windsurf Ignore

Create `.codeiumignore` to exclude files:
```
node_modules/
dist/
*.min.js
```

## MCP Configuration

Configure Model Context Protocol servers:

**mcp_config.json**
```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"]
    }
  }
}
```

## Memories & Rules

### Memories

Store persistent context for your project:
- Project-specific knowledge
- Coding conventions
- Architecture decisions

### Rules

Define behavior patterns:
- Auto-apply formatting
- Enforce coding standards
- Custom workflows

## Workspace Settings

**.vscode/settings.json**
```json
{
  "windsurf.model.autocomplete": "base",
  "windsurf.model.chat": "premier",
  "windsurf.autoExecutionLevel": 2
}
```

## Proxy Configuration

### Detect Proxy

Enable automatic proxy detection:
- Settings > Windsurf > Network
- Enable "Detect proxy"

### Manual Proxy

Configure manually:
- Settings > Windsurf > Network
- Set HTTP/HTTPS proxy URL

## Summary

| Setting | Location | Purpose |
|---------|----------|---------|
| **Models** | Settings > Windsurf > Models | Select AI models |
| **Auto-Execution** | Settings > Windsurf > Cascade | Command automation |
| **Context** | Settings > Windsurf > Context | Codebase awareness |
| **MCP** | mcp_config.json | External tools |
| **Proxy** | Settings > Windsurf > Network | Network configuration |
