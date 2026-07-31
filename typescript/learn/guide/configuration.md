# Configuration

## tsconfig.json Basics

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

## Key Compiler Options

### Target & Module

| Option | Values | Description |
|--------|--------|-------------|
| target | ES2020, ES2022, ESNext | JavaScript version |
| module | CommonJS, NodeNext, ESNext | Module system |
| lib | ES2020, DOM | Built-in APIs |

### Type Checking

| Option | Default | Description |
|--------|---------|-------------|
| strict | true | Enable all strict checks |
| noImplicitAny | true | Error on implicit any |
| strictNullChecks | true | Null/undefined check |
| strictFunctionTypes | true | Function parameter check |

### Output

| Option | Description |
|--------|-------------|
| outDir | Output directory |
| rootDir | Source root directory |
| declaration | Generate .d.ts files |
| sourceMap | Generate source maps |

## Strict Mode

```json
{
  "compilerOptions": {
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true
  }
}
```

## Path Mapping

```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"]
    }
  }
}
```

## Project References

```json
// tsconfig.json
{
  "references": [
    { "path": "./packages/core" },
    { "path": "./packages/utils" }
  ]
}
```

## Environment Variables

```bash
# Via command line
tsc --project tsconfig.prod.json

# Environment-specific configs
tsc -p tsconfig.dev.json
tsc -p tsconfig.prod.json
```

## Key Options Summary

| Option | Type | Description |
|--------|------|-------------|
| strict | boolean | Enable all strict checks |
| esModuleInterop | boolean | Allow default imports |
| skipLibCheck | boolean | Skip .d.ts checking |
| forceConsistentCasingInFileNames | boolean | Case-sensitive |