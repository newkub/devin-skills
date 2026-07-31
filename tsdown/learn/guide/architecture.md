# Architecture

## สถาปัตยกรรมของ tsdown

## High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                     User Interface                           │
│  (CLI, Config, API)                                          │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Configuration Layer                        │
│  - tsdown.config.ts                                          │
│  - tsconfig.json                                             │
│  - package.json                                              │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                  Plugin System                               │
│  - Rollup plugins                                            │
│  - unplugin                                                  │
│  - Vite plugins                                              │
│  - Custom plugins                                            │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                   Rolldown Core                              │
│  - Module resolution                                         │
│  - Tree shaking                                              │
│  - Code transformation                                       │
│  - Bundling                                                  │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                 Output Generation                             │
│  - Format generation (ESM, CJS, IIFE, UMD)                   │
│  - Declaration generation (Oxc)                              │
│  - Source map generation                                     │
└────────────────────┬────────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────────┐
│                      Output                                  │
│  - dist/*.mjs                                                │
│  - dist/*.cjs                                                │
│  - dist/*.d.ts                                               │
└─────────────────────────────────────────────────────────────┘
```

## Core Components

### 1. Configuration Layer

```typescript
interface Config {
  entry: string | Record<string, string>;
  format: ('esm' | 'cjs' | 'iife' | 'umd')[];
  dts: boolean;
  outDir: string;
  clean: boolean;
  sourcemap: boolean;
  external: (string | RegExp)[];
  minify: boolean;
  target: string | string[];
  plugins: Plugin[];
  tsconfig: string;
}
```

**Responsibilities:**
- Load and validate configuration
- Merge default and user configuration
- Provide type-safe configuration API

### 2. Plugin System

```typescript
interface Plugin {
  name: string;
  resolveId?: (id: string) => string | null;
  load?: (id: string) => string | null;
  transform?: (code: string, id: string) => string | null;
  generateBundle?: () => void;
}
```

**Plugin Pipeline:**
```
Source → Plugin 1 → Plugin 2 → ... → Plugin N → Output
```

**Supported Plugin Types:**
- Rollup plugins (via adapter)
- unplugin (universal)
- Vite plugins (subset)
- Custom plugins

### 3. Rolldown Integration

**Why Rolldown?**
- Written in Rust (performance)
- Module bundling expertise
- Tree shaking
- Code splitting
- Modern JavaScript support

**Integration Points:**
```typescript
// Rolldown options mapped to tsdown config
{
  input: entry,
  output: {
    format: format,
    dir: outDir,
    sourcemap: sourcemap,
  },
  external: external,
  plugins: plugins,
}
```

### 4. TypeScript Integration

**Type Processing Flow:**
```
Source Files → TypeScript Compiler → Type Extraction → Declaration Generation
```

**Oxc Integration:**
```typescript
// Oxc for fast declaration generation
const declarations = oxc.generateDeclarations({
  source: code,
  types: typeInformation,
});
```

**Benefits:**
- Faster than tsc
- Better error messages
- Modern TypeScript support

### 5. Format Generation

**ESM Generation:**
```javascript
export { default as foo } from './foo.js';
export { bar } from './bar.js';
```

**CJS Generation:**
```javascript
'use strict';
Object.defineProperty(exports, '__esModule', { value: true });
const foo_1 = require('./foo.cjs');
const bar_1 = require('./bar.cjs');
exports.foo = foo_1.default;
exports.bar = bar_1.bar;
```

**IIFE Generation:**
```javascript
(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global.myLib));
}(this, (function (exports) {
  'use strict';
  // ...
})));
```

## Data Flow

### Build Process

```
1. Load Configuration
   ↓
2. Resolve Entry Points
   ↓
3. Build Dependency Graph
   ↓
4. Apply Plugins (transform phase)
   ↓
5. Type Checking
   ↓
6. Tree Shaking
   ↓
7. Code Transformation
   ↓
8. Generate Multiple Formats
   ↓
9. Generate Declarations
   ↓
10. Write Output Files
```

### Watch Mode

```
File Change Detected
   ↓
Debounce (300ms)
   ↓
Invalidate Affected Modules
   ↓
Rebuild Affected Modules
   ↓
Update Output Files
   ↓
Notify User
```

## Performance Optimizations

### 1. Parallel Processing
- Multiple formats built in parallel
- Declaration generation in parallel

### 2. Caching
- File system cache
- Module graph cache
- Type information cache

### 3. Incremental Builds
- Only rebuild changed modules
- Reuse dependency graph
- Skip unchanged files

### 4. Rust Performance
- Rolldown core in Rust
- Oxc for fast type processing
- Minimal JavaScript overhead

## Extension Points

### Custom Plugins
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [
    {
      name: 'my-plugin',
      transform(code, id) {
        // Custom transformation
        return modifiedCode;
      },
    },
  ],
});
```

### Custom Resolvers
```typescript
import { defineConfig } from 'tsdown';

export default defineConfig({
  plugins: [
    {
      name: 'my-resolver',
      resolveId(id) {
        if (id.startsWith('my:')) {
          return id.replace('my:', './src/');
        }
        return null;
      },
    },
  ],
});
```

## Error Handling

```
Build Error
   ↓
Parse Error Type
   ↓
Provide Context
   ↓
Suggest Fixes
   ↓
Exit with Error Code
```

**Error Types:**
- Configuration errors
- Type errors
- Module resolution errors
- Plugin errors
- File system errors
