---
title: Configuration Page Template
description: Template for docs/references/configuration.md — env vars and config options
---

# Configuration Page Template

```md
---
title: Configuration
description: All configuration options and environment variables
---

# Configuration

## Environment Variables

| No. | Name | Required | Default | Description |
|-----|------|----------|---------|-------------|
| 1 | `<ENV_NAME>` | yes/no | `<default>` | <effect> |

## Config Files

| No. | File | Purpose |
|-----|------|---------|
| 1 | `<file>` | <what it controls> |

## Example

```bash
# .env
ENV_NAME=value
```
```

## Rules

- List only real env vars / config keys found in code (`process.env.*`, `import.meta.env.*`, config schemas)
- Never document secret values — document the key name and where to get it
