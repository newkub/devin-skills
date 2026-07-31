# Model Context Protocol (MCP)

## Purpose

MCP (Model Context Protocol) ช่วยให้ Windsurf เชื่อมต่อกับ external tools และ services

## Overview

MCP เป็น protocol ที่:
- Connects AI to external data sources
- Provides standardized tool interface
- Enables custom integrations
- Extends Windsurf capabilities

## Adding MCP Servers

### One-Click Install via Deeplink

คลิก deeplink จาก MCP registry:
- Automatically installs server
- Configures settings
- Ready to use immediately

### Manual Configuration

Create or edit `mcp_config.json`:

```json
{
  "mcpServers": {
    "filesystem": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-filesystem", "/path/to/allowed"]
    },
    "brave-search": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-brave-search"]
    },
    "github": {
      "command": "npx",
      "args": ["-y", "@modelcontextprotocol/server-github"]
    }
  }
}
```

## Popular MCP Servers

### Filesystem

Access local files:
```json
{
  "filesystem": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-filesystem", "/allowed/path"]
  }
}
```

### Brave Search

Web search capability:
```json
{
  "brave-search": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-brave-search"]
  }
}
```

### GitHub

GitHub integration:
```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "your_token"
    }
  }
}
```

### Postgres

Database access:
```json
{
  "postgres": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-postgres", "postgresql://user:pass@localhost/db"]
  }
}
```

## Remote HTTP MCPs

Connect to HTTP-based MCP servers:

```json
{
  "remote-server": {
    "url": "https://api.example.com/mcp",
    "headers": {
      "Authorization": "Bearer token"
    }
  }
}
```

## Config Interpolation

Use environment variables in config:

```json
{
  "github": {
    "command": "npx",
    "args": ["-y", "@modelcontextprotocol/server-github"],
    "env": {
      "GITHUB_TOKEN": "${GITHUB_TOKEN}"
    }
  }
}
```

## Admin Controls (Teams & Enterprises)

### MCP Registry

Control which MCP servers are available:
- Whitelist approved servers
- Block unauthorized servers
- Enforce security policies

### MCP Whitelist

Configure allowed servers:
```json
{
  "allowedServers": [
    "filesystem",
    "brave-search",
    "github"
  ]
}
```

### How Server Matching Works

1. User requests MCP server
2. Check against whitelist
3. Verify configuration
4. Initialize connection

### Configuration Options

- `allowedServers` - List of allowed servers
- `blockedServers` - List of blocked servers
- `requireApproval` - Require admin approval

### Common Regex Patterns

Match server names:
```json
{
  "allowedPatterns": [
    "^@modelcontextprotocol/server-",
    "^company-internal-"
  ]
}
```

## Best Practices

1. **Security** - Only use trusted MCP servers
2. **Tokens** - Use environment variables for secrets
3. **Scoping** - Limit filesystem access to necessary paths
4. **Testing** - Test MCP servers before production use
5. **Monitoring** - Monitor MCP server usage

## Troubleshooting

**Server not starting**
- Check command and args
- Verify dependencies installed
- Check logs for errors

**Permission denied**
- Verify filesystem path permissions
- Check token validity
- Review admin controls

**Connection timeout**
- Check network connectivity
- Verify server URL
- Increase timeout settings

## Summary

| Feature | Description |
|---------|-------------|
| **One-Click Install** | Easy setup via deeplink |
| **Manual Config** | mcp_config.json |
| **Popular Servers** | Filesystem, Search, GitHub, DB |
| **Remote HTTP** | Connect to web APIs |
| **Admin Controls** | Whitelist, security policies |
