# Biome Best Practices

## Installation

Use Bun for faster installation:

```bash
bun add -D @biomejs/biome
```

## Configuration

### Basic Setup

```bash
# Initialize Biome in your project
bunx biome init
```

This creates `biome.json` with recommended defaults.

### Recommended Config

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "files": {
    "ignore": ["node_modules", "dist", ".next", ".nuxt"]
  },
  "formatter": {
    "enabled": true,
    "formatWithErrors": false,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  },
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "semicolons": "always"
    }
  }
}
```

## Integration

### Git Hooks

Use Lefthook for automatic formatting:

```yaml
# .lefthook/pre-commit
pre-commit:
  parallel: false
  commands:
    biome:
      run: bunx biome check --write --staged
      stage_fixed: true
```

### VS Code

Install the Biome extension and configure:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true,
  "[javascript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[typescript]": {
    "editor.defaultFormatter": "biomejs.biome"
  },
  "[json]": {
    "editor.defaultFormatter": "biomejs.biome"
  }
}
```

## Workflow

### Development

```bash
# Format and lint on save
bunx biome check --write ./src

# Check only (no write)
bunx biome check ./src
```

### CI/CD

```bash
# CI mode (non-interactive)
bunx biome ci ./src
```

## Migration

### From ESLint + Prettier

```bash
# Migrate configs
bunx biome migrate eslint --write
bunx biome migrate prettier --write

# Remove old dependencies
bun remove eslint prettier eslint-config-* @typescript-eslint/parser @typescript-eslint/eslint-plugin
```

## Performance

- Use `--staged` for pre-commit hooks (faster)
- Use `--files-ignore-unknown` to skip unsupported files
- Configure `files.ignore` to exclude build artifacts
