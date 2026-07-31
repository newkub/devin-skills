# Configuration

## Overview

Bun มีหลายวิธีในการตั้งค่า ตั้งแต่ environment variables ไปจนถึง configuration files

## Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `BUN_INSTALL` | Path สำหรับ global installation | `~/.bun/install/global` |
| `BUN_CONFIG_TOKENS` | Authentication tokens สำหรับ private registries | - |
| `BUN_CONFIG_PRELOAD_SCRIPT` | Script ที่จะ preload ก่อนรัน | - |
| `NODE_ENV` | Environment mode | `development` |
| `TZ` | Timezone | System timezone |

```bash
export BUN_INSTALL=/custom/path
export BUN_CONFIG_TOKENS="registry.example.com=token123"
export NODE_ENV=production
```

## bunfig.toml

`bunfig.toml` เป็น configuration file หลักของ Bun วางไว้ที่ root ของ project หรือ home directory

### Example Configuration

```toml
[install]
globalPath = "~/.bun/install/global"
cacheDir = "~/.bun/install/cache"
lockfile = "bun.lockb"
registry = "https://registry.bunjs.org"

[install.scopes]
"@myorg" = "https://registry.example.com"

[install.lockfile]
print = "yarn"

[test]
preload = ["./test/setup.ts"]

[run]
shell = "bash"
```

### Configuration Options

#### [install]

| Option | Type | Description |
|--------|------|-------------|
| `globalPath` | string | Path สำหรับ global packages |
| `cacheDir` | string | Path สำหรับ cache |
| `lockfile` | string | Lockfile format (`bun.lockb`, `yarn.lock`, `package-lock.json`) |
| `registry` | string | Default registry URL |
| `frozenLockfile` | boolean | ไม่อัปเดต lockfile |

#### [install.scopes]

| Option | Type | Description |
|--------|------|-------------|
| `@scope` | string | Registry URL สำหรับ scope |

#### [test]

| Option | Type | Description |
|--------|------|-------------|
| `preload` | array | Files ที่จะ preload ก่อน test |

#### [run]

| Option | Type | Description |
|--------|------|-------------|
| `shell` | string | Shell ที่จะใช้ |

## package.json Scripts

```json
{
  "scripts": {
    "dev": "bun run src/index.ts",
    "build": "bun build src/index.ts --outdir dist",
    "test": "bun test",
    "lint": "bunx eslint .",
    "format": "bunx prettier --write ."
  }
}
```

## TypeScript Configuration

### tsconfig.json

```json
{
  "compilerOptions": {
    "target": "ESNext",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "jsx": "react-jsx",
    "types": ["bun-types"]
  }
}
```

### bun-types

```bash
bun add -d bun-types
```

## Environment-Specific Configuration

### Development

```bash
# .env.development
NODE_ENV=development
DEBUG=true
```

### Production

```bash
# .env.production
NODE_ENV=production
DEBUG=false
```

## Best Practices

- ใช้ bunfig.toml สำหรับ project-wide configuration
- ใช้ environment variables สำหรับ sensitive data
- ใช้ .env files สำหรับ environment-specific settings
- commit bun.lockb สำหรับ consistency
- ใช้ TypeScript สำหรับ type safety
