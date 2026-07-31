# Configuration Reference

## turbo.json Overview

`turbo.json` is the main configuration file for Turborepo. Place it in the root of your monorepo.

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "tasks": {}
}
```

## Global Options

### Global Dependencies

Files that affect all tasks' cache keys.

```json
{
  "globalDependencies": ["tsconfig.json", ".env"]
}
```

### Global Environment Variables

Environment variables that affect all tasks' cache keys.

```json
{
  "globalEnv": ["NODE_ENV", "PACKAGE_VERSION"]
}
```

### Cache Directory

```json
{
  "cacheDir": ".turbo/cache"
}
```

### Concurrency

```json
{
  "concurrency": "10"  // or "50%" for percentage
}
```

### UI Mode

```json
{
  "ui": "stream"  // or "tui"
}
```

## Task Options

### dependsOn

Task dependencies.

```json
{
  "tasks": {
    "build": {
      "dependsOn": ["^build"]
    }
  }
}
```

### inputs

Files that affect task hash.

```json
{
  "tasks": {
    "test": {
      "inputs": ["src/**/*.ts", "test/**/*.ts"]
    }
  }
}
```

### outputs

Files to cache.

```json
{
  "tasks": {
    "build": {
      "outputs": ["dist/**", ".next/**"]
    }
  }
}
```

### env

Environment variables that affect task hash.

```json
{
  "tasks": {
    "build": {
      "env": ["DATABASE_URL"]
    }
  }
}
```

### cache

Enable/disable caching.

```json
{
  "tasks": {
    "dev": {
      "cache": false
    }
  }
}
```

### persistent

Mark as long-running task.

```json
{
  "tasks": {
    "dev": {
      "persistent": true
    }
  }
}
```

### interactive

Accept stdin input.

```json
{
  "tasks": {
    "test:watch": {
      "interactive": true,
      "persistent": true
    }
  }
}
```

### outputLogs

Log output mode.

```json
{
  "tasks": {
    "build": {
      "outputLogs": "new-only"
    }
  }
}
```

| Value | Description |
|-------|-------------|
| `full` | Show all logs |
| `hash-only` | Show only hashes |
| `new-only` | Show only cache misses |
| `errors-only` | Show only errors |
| `none` | Hide all logs |

## Remote Cache Options

```json
{
  "remoteCache": {
    "enabled": true,
    "signature": false,
    "timeout": 30,
    "apiUrl": "https://vercel.com"
  }
}
```

## Complete Example

```json
{
  "$schema": "https://turborepo.dev/schema.json",
  "globalDependencies": [".env"],
  "globalEnv": ["NODE_ENV"],
  "cacheDir": ".turbo/cache",
  "concurrency": "10",
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "inputs": ["$TURBO_DEFAULT$", "src/**"],
      "env": ["DATABASE_URL"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "lint": {
      "dependsOn": ["^build"]
    }
  },
  "remoteCache": {
    "enabled": true
  }
}
```