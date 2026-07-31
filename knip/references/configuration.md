# Configuration

Configuration options สำหรับ Knip

## Config File

สร้างไฟล์ `knip.config.{js,ts,json}` ใน root ของ project

## Basic Configuration

```javascript
export default {
  entry: ['src/index.ts'],
  project: ['**/*.ts'],
}
```

## Common Options

| Option | Type | Description |
|--------|------|-------------|
| `entry` | array | Entry files |
| `project` | array | Project file patterns |
| `ignore` | array | Patterns to ignore |
| `include` | array | Types to check |
| `exclude` | array | Types to exclude |

## Ignore Files

```javascript
export default {
  ignore: [
    '**/*.test.ts',
    '**/__tests__/**',
    '**/node_modules/**',
  ]
}
```

## Check Specific Types

```javascript
export default {
  include: [
    'unusedFiles',
    'unusedDependencies',
    'unusedExports',
    'dupImports',
    'types',
  ]
}
```

## Strict Mode

```javascript
export default {
  // Throw error in CI
  strict: true,
}
```

## Ignore Dependencies

```javascript
export default {
  ignoreDependencies: ['eslint', 'prettier'],
}
```

## Ignore Patterns

```javascript
export default {
  ignore: [
    'src/generated/**',
    '**/*.d.ts',
  ]
}
```