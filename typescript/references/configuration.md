# TypeScript Configuration Reference

## tsconfig.json Structure

```json
{
  "compilerOptions": { ... },
  "include": [ ... ],
  "exclude": [ ... ],
  "references": [ ... ]
}
```

## Compiler Options

### Target & Module

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `target` | `"ES3"` \| `"ES5"` \| `"ES6/ES2015"` \| `"ES2016"` \| `"ES2017"` \| `"ES2018"` \| `"ES2019"` \| `"ES2020"` \| `"ES2021"` \| `"ES2022"` \| `"ESNext"` | `"ES3"` | ECMAScript target version |
| `module` | `"CommonJS"` \| `"ES6/ES2015"` \| `"ES2020"` \| `"ES2022"` \| `"ESNext"` \| `"AMD"` \| `"UMD"` \| `"System"` \| `"ES2022"` \| `"Node16"` \| `"NodeNext"` | `"CommonJS"` | Module code generation |
| `lib` | `string[]` | Empty | Library files to include |
| `moduleResolution` | `"classic"` \| `"node"` \| `"node16"` \| `"nodenext"` | `"classic"` | Module resolution strategy |
| `moduleDetection` | `"auto"` \| `"force"` | `"auto"` | Detect ES module imports |

### JavaScript Support

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowJs` | `boolean` | `false` | Allow JavaScript files |
| `checkJs` | `boolean` | `false` | Type check JS files |
| `maxNodeModuleJsDepth` | `number` | `0` | Max search depth for JS files |

### Emit Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `outDir` | `string` | - | Output directory |
| `outFile` | `string` | - | Single output file |
| `rootDir` | `string` | - | Root directory of input files |
| `sourceMap` | `boolean` | `false` | Generate source maps |
| `declaration` | `boolean` | `false` | Generate .d.ts files |
| `declarationMap` | `boolean` | `false` | Generate declaration maps |
| `noEmit` | `boolean` | `false` | Skip file emission |
| `noEmitOnError` | `boolean` | `false` | Skip emit on errors |
| `emitDeclarationOnly` | `boolean` | `false` | Only emit declarations |
| `jsx` | `"react"` \| `"react-jsx"` \| `"react-native"` \| `"preserve"` | - | JSX output mode |

### Strict Mode

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `strict` | `boolean` | `false` | Enable all strict checks |
| `noImplicitAny` | `boolean` | `false` | Error on implicit `any` |
| `strictNullChecks` | `boolean` | `false` | Enable null/undefined checks |
| `strictFunctionTypes` | `boolean` | `false` | Function parameter type checking |
| `strictBindCallApply` | `boolean` | `false` | Check bind/call/apply |
| `strictPropertyInitialization` | `boolean` | `false` | Check property initialization |
| `noImplicitThis` | `boolean` | `false` | Error on implicit `this` |
| `alwaysStrict` | `boolean` | `false` | Parse in strict mode |

### Additional Checks

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `noUnusedLocals` | `boolean` | `false` | Error on unused locals |
| `noUnusedParameters` | `boolean` | `false` | Error on unused params |
| `noImplicitReturns` | `boolean` | `false` | Error on missing returns |
| `noFallthroughCasesInSwitch` | `boolean` | `false` | Error on fallthrough |
| `noUncheckedIndexedAccess` | `boolean` | `false` | Include undefined for index access |
| `noPropertyAccessFromIndexSignature` | `boolean` | `false` | Force bracket notation for index signatures |

### Module Resolution

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `baseUrl` | `string` | - | Base directory for module resolution |
| `paths` | `object` | - | Path mapping |
| `rootDirs` | `string[]` | - | List of root directories |
| `typeRoots` | `string[]` | - | List of type roots |
| `types` | `string[]` | - | Type packages to include |
| `allowArbitraryExtensions` | `boolean` | `false` | Allow arbitrary extensions |
| `resolveJsonModule` | `boolean` | `false` | Allow importing .json |

### Source Map Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `sourceRoot` | `string` | - | Source root for source maps |
| `mapRoot` | `string` | - | Location for source maps |
| `inlineSources` | `boolean` | `false` | Include source in source maps |
| `sourceMap` | `boolean` | `false` | Generate .map files |

### Experimental Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `experimentalDecorators` | `boolean` | `false` | Enable decorator support |
| `emitDecoratorMetadata` | `boolean` | `false` | Emit decorator metadata |
| `experimentalSpecifyOutputLanguage` | `boolean` | `false` | Specify output language |
| `preserveSymlinks` | `boolean` | `false` | Preserve symlinks |

### Advanced Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `allowUnreachableCode` | `boolean` | `false` | Allow unreachable code |
| `allowUnusedLabels` | `boolean` | `false` | Allow unused labels |
| `assumeChangesOnlyDirectDependencies` | `boolean` | `false` | Assume only direct changes |
| `assumeChangesOnlyDirectDependenciesAtRoot` | `boolean` | `false` | Root assumption mode |
| `tsBuildInfoFile` | `string` | - | Build info file location |
| `composite` | `boolean` | `false` | Enable project references |
| `incremental` | `boolean` | `false` | Enable incremental compilation |
| `listEmittedFiles` | `boolean` | `false` | List emitted files |
| `listFiles` | `boolean` | `false` | List source files |

### Interop Constraints

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `esModuleInterop` | `boolean` | `false` | Emit ESM interop |
| `forceConsistentCasingInFileNames` | `boolean` | `false` | Enforce case-sensitive imports |
| `isolatedModules` | `boolean` | `false` | Ensure each file is separate |
| `preserveConstEnums` | `boolean` | `false` | Keep const enum declarations |
| `newLine` | `"crlf"` \| `"lf"` | - | Line ending |
| `skipLibCheck` | `boolean` | `false` | Skip library type checking |

## Common Configurations

### Modern Library

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "lib": ["ES2020"],
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "moduleResolution": "bundler",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  },
  "include": ["src"],
  "exclude": ["node_modules", "dist"]
}
```

### React Application

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "jsx": "react-jsx",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "noEmit": true,
    "isolatedModules": true,
    "esModuleInterop": true,
    "allowSyntheticDefaultImports": true,
    "forceConsistentCasingInFileNames": true,
    "skipLibCheck": true,
    "resolveJsonModule": true
  },
  "include": ["src"]
}
```

### Node.js Backend

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "lib": ["ES2020"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src"],
  "exclude": ["node_modules"]
}
```

## Configuration Files

### Base Configuration

```json
// tsconfig.base.json
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true
  }
}

// tsconfig.json
{
  "extends": "./tsconfig.base.json",
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}
```

### Project References

```json
// packages/shared/tsconfig.json
{
  "compilerOptions": {
    "composite": true,
    "outDir": "./dist"
  },
  "include": ["src"]
}

// packages/app/tsconfig.json
{
  "references": [
    { "path": "../shared" }
  ],
  "compilerOptions": {
    "outDir": "./dist"
  },
  "include": ["src"]
}

// root tsconfig.json
{
  "files": [],
  "references": [
    { "path": "./packages/shared" },
    { "path": "./packages/app" }
  ]
}
```

## References

- [TypeScript tsconfig Reference](https://www.typescriptlang.org/docs/handbook/compiler-options.html)
- [TSConfig Builder](https://tsconfig.io/)