# Context Awareness

## Purpose

Windsurf เข้าใจ codebase ของคุณผ่าน context awareness system

## Overview

Context awareness ช่วยให้ Windsurf:
- Understand project structure
- Access relevant code automatically
- Maintain context across sessions
- Provide accurate suggestions

## Default Context

Windsurf automatically includes:

**Open Files**
- Files currently open in editor
- Active file gets highest priority

**Recently Edited**
- Files edited recently
- Based on recency and relevance

**Git Repository**
- Repository structure
- Git history context
- Branch information

**File Relationships**
- Import/require statements
- File dependencies
- Module structure

## Fast Context

### How It Works

Fast Context ใช้ SWE-grep models เพื่อ:
- Index codebase efficiently
- Find relevant files quickly
- Understand code relationships
- Provide targeted context

### Using Fast Context

1. Click Fast Context button in Chat/Cascade
2. Select files to include
3. Windsurf automatically suggests relevant files
4. Add or remove files as needed

### Benefits

- Faster responses
- More accurate suggestions
- Reduced token usage
- Better relevance

## Knowledge Base (Beta)

Add external documentation to context:

### Setup

1. Settings > Windsurf > Context Awareness
2. Enable "Knowledge Base"
3. Add documentation sources:
   - Local files
   - URLs
   - Git repositories

### Best Practices

- Add official documentation
- Include API references
- Add internal docs
- Keep knowledge base updated

## Chat-Specific Context Features

### @-Mentions

Add specific context to chat:
- `@file` - Specific file
- `@folder` - Entire folder
- `@terminal` - Terminal output
- `@web` - Web search results
- `@previous` - Previous conversation

### Persistent Context

Context persists across:
- Multiple messages in same chat
- Related conversations
- Session duration

### Inline Citations

Windsurf cites sources:
- Shows which files were used
- Links to relevant code
- Provides transparency

## Remote Indexing

Index remote repositories:

### Adding a Repository

1. Settings > Windsurf > Context Awareness
2. Add remote repository URL
3. Configure access credentials
4. Index automatically

### Security Guarantees

- Encrypted storage
- Access controls
- Audit logging
- Data isolation

## Windsurf Ignore

Control what gets indexed:

### .codeiumignore

```
# Ignore node_modules
node_modules/

# Ignore build artifacts
dist/
build/
*.min.js

# Ignore test files
**/*.test.js
**/*.spec.ts
```

### Global .codeiumignore

Create global ignore file:
- `~/.codeiumignore` (Linux/macOS)
- `%USERPROFILE%\.codeiumignore` (Windows)

## FAQ

**Does Windsurf index my codebase?**
- Yes, locally on your machine
- Data stays on your device
- Not sent to cloud for indexing

**Can I disable indexing?**
- Yes, in settings
- Or use .codeiumignore

**How often is context updated?**
- Real-time for open files
- Periodic for repository
- Manual refresh available

## Summary

| Feature | Description |
|---------|-------------|
| **Default Context** | Automatic codebase awareness |
| **Fast Context** | Quick file selection |
| **Knowledge Base** | External documentation |
| **@-Mentions** | Add specific context |
| **Remote Indexing** | Index remote repos |
| **Windsurf Ignore** | Exclude files |
