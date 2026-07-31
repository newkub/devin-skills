# Programmatic API

## Node.js API

```javascript
import { aube } from '@endevco/aube'
```

### `aube.install(options?)`

Install dependencies.

```javascript
await aube.install({
  cwd: process.cwd(),
  prod: false,
  lockfileOnly: false
})
```

### `aube.add(packages, options?)`

Add dependencies.

```javascript
await aube.add(['react', 'react-dom'], {
  cwd: process.cwd(),
  dev: true
})
```

### `aube.remove(packages, options?)`

Remove dependencies.

```javascript
await aube.remove(['lodash'], {
  cwd: process.cwd()
})
```

### `aube.update(options?)`

Update dependencies within range.

```javascript
await aube.update({
  cwd: process.cwd()
})
```

### `aube.run(script, options?)`

Run a package.json script with auto-install.

```javascript
await aube.run('test', {
  cwd: process.cwd()
})
```

### `aube.list(options?)`

List installed packages.

```javascript
const packages = await aube.list({
  cwd: process.cwd()
})
```

## Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `cwd` | `string` | `process.cwd()` | Working directory |
| `prod` | `boolean` | `false` | Production only |
| `dev` | `boolean` | `false` | Dev dependencies only |
| `lockfileOnly` | `boolean` | `false` | Update lockfile only |
| `store` | `string` | `~/.local/share/aube/store` | Store path |

## Return Values

```javascript
// Success
{ success: true, stdout: '', stderr: '' }

// Error
{
  success: false,
  code: 1,
  stderr: 'error message'
}
```

## TypeScript Types

```typescript
interface AubeOptions {
  cwd?: string
  prod?: boolean
  dev?: boolean
  lockfileOnly?: boolean
  store?: string
  registry?: string
}

interface AubeResult {
  success: boolean
  code?: number
  stdout?: string
  stderr?: string
}
```