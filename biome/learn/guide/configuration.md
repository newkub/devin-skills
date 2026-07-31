# Biome Configuration Guide

## Getting Started

Initialize Biome in your project:

```bash
bunx biome init
```

This creates a `biome.json` file with default configuration.

## Config File Location

Biome looks for configuration in this order:
1. `biome.json` in project root
2. `biome.jsonc` in project root
3. `biome.json` in parent directories
4. Environment variable `BIOME_CONFIG_PATH`

## Basic Configuration

### Enable/Disable Features

```json
{
  "formatter": {
    "enabled": true
  },
  "linter": {
    "enabled": true
  },
  "organizeImports": {
    "enabled": true
  }
}
```

### File Patterns

```json
{
  "files": {
    "ignore": [
      "node_modules",
      "dist",
      "build",
      ".next",
      ".nuxt",
      "*.min.js"
    ],
    "include": ["src", "tests"]
  }
}
```

## Formatter Configuration

### Indentation

```json
{
  "formatter": {
    "indentStyle": "space",
    "indentWidth": 2
  }
}
```

### Line Width

```json
{
  "formatter": {
    "lineWidth": 80
  }
}
```

### Quote Style

```json
{
  "javascript": {
    "formatter": {
      "quoteStyle": "double",
      "jsxQuoteStyle": "double"
    }
  }
}
```

## Linter Configuration

### Recommended Rules

```json
{
  "linter": {
    "rules": {
      "recommended": true
    }
  }
}
```

### Custom Rules

```json
{
  "linter": {
    "rules": {
      "suspicious": {
        "noExplicitAny": "error"
      },
      "style": {
        "noVar": "error"
      }
    }
  }
}
```

### Rule Levels

- `"error"` - Will fail CI
- `"warn"` - Warning only
- `"off"` - Disabled

## Overrides

### Per-Directory Configuration

```json
{
  "overrides": [
    {
      "include": ["tests/**"],
      "linter": {
        "rules": {
          "suspicious": {
            "noExplicitAny": "off"
          }
        }
      }
    }
  ]
}
```

### Per-Language Configuration

```json
{
  "overrides": [
    {
      "include": ["*.ts", "*.tsx"],
      "linter": {
        "rules": {
          "correctness": {
            "noUnusedVariables": "error"
          }
        }
      }
    }
  ]
}
```

## Extending Configs

Share configuration across projects:

```json
{
  "extends": ["@company/biome-config"]
}
```

## Environment Variables

- `BIOME_CONFIG_PATH` - Custom config file path
- `BIOME_LOG_PATH` - Log file location
- `RUST_LOG` - Rust log level (debug, info, warn, error)
