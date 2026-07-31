# Configuration

tsdown configuration options reference.

## defineConfig

```typescript
import { defineConfig } from 'tsdown';

export default defineConfig(options);
```

## Configuration Options

### entry

Entry point(s) for the library.

```typescript
{
  entry: './src/index.ts',  // Single entry
  // or
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
}
```

| Type | Default | Description |
|------|---------|-------------|
| `string \| Record<string, string>` | - | Entry file(s) |

### format

Output formats to generate.

```typescript
{
  format: ['esm', 'cjs'],  // Multiple formats
  // or
  format: ['esm', 'cjs', 'iife', 'umd'],
}
```

| Type | Default | Description |
|------|---------|-------------|
| `('esm' \| 'cjs' \| 'iife' \| 'umd')[]` | `['esm', 'cjs']` | Output formats |

**Available formats:**
- `esm` - ES Modules
- `cjs` - CommonJS
- `iife` - Immediately Invoked Function Expression
- `umd` - Universal Module Definition

### dts

Generate TypeScript declarations.

```typescript
{
  dts: true,  // Enable
  // or
  dts: {
    sourcemap: true,  // Generate .d.ts.map
  },
}
```

| Type | Default | Description |
|------|---------|-------------|
| `boolean \| DtsOptions` | `false` | Enable declaration generation |

### outDir

Output directory for bundled files.

```typescript
{
  outDir: './dist',
}
```

| Type | Default | Description |
|------|---------|-------------|
| `string` | `'dist'` | Output directory |

### clean

Clean output directory before build.

```typescript
{
  clean: true,
}
```

| Type | Default | Description |
|------|---------|-------------|
| `boolean` | `false` | Clean before build |

### sourcemap

Generate source maps.

```typescript
{
  sourcemap: true,
  // or
  sourcemap: 'inline',
}
```

| Type | Default | Description |
|------|---------|-------------|
| `boolean \| 'inline'` | `false` | Generate source maps |

### external

Mark dependencies as external (don't bundle them).

```typescript
{
  external: ['react', 'lodash'],
  // or
  external: [/^react/],
}
```

| Type | Default | Description |
|------|---------|-------------|
| `(string \| RegExp)[]` | `[]` | External dependencies |

### minify

Minify output files.

```typescript
{
  minify: true,
}
```

| Type | Default | Description |
|------|---------|-------------|
| `boolean` | `false` | Minify output |

### target

Target environment for the bundle.

```typescript
{
  target: 'es2020',
  // or
  target: ['chrome90', 'node16'],
}
```

| Type | Default | Description |
|------|---------|-------------|
| `string \| string[]` | `'esnext'` | Target environment |

### plugins

Add plugins to the build pipeline.

```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';

export default defineConfig({
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: './src' },
      ],
    }),
  ],
});
```

| Type | Default | Description |
|------|---------|-------------|
| `Plugin[]` | `[]` | Build plugins |

### tsconfig

Custom TypeScript config path.

```typescript
{
  tsconfig: './tsconfig.build.json',
}
```

| Type | Default | Description |
|------|---------|-------------|
| `string` | `'tsconfig.json'` | TypeScript config path |

### watch

Enable watch mode for development.

```typescript
{
  watch: true,
}
```

| Type | Default | Description |
|------|---------|-------------|
| `boolean` | `false` | Watch mode |

## Complete Example

```typescript
import { defineConfig } from 'tsdown';
import alias from '@rollup/plugin-alias';
import path from 'path';

export default defineConfig({
  // Entry points
  entry: {
    index: './src/index.ts',
    utils: './src/utils/index.ts',
  },
  
  // Output formats
  format: ['esm', 'cjs'],
  
  // TypeScript declarations
  dts: {
    sourcemap: true,
  },
  
  // Output directory
  outDir: './dist',
  
  // Clean before build
  clean: true,
  
  // Source maps
  sourcemap: true,
  
  // External dependencies
  external: ['react', 'react-dom'],
  
  // Target environment
  target: 'es2020',
  
  // TypeScript config
  tsconfig: './tsconfig.json',
  
  // Plugins
  plugins: [
    alias({
      entries: [
        { find: '@', replacement: path.resolve(__dirname, './src') },
      ],
    }),
  ],
});
```

## Configuration Priority

1. CLI flags (highest priority)
2. tsdown.config.ts
3. package.json (if using tsdown field)
4. Default values (lowest priority)

## Type Definitions

```typescript
interface TsdownOptions {
  entry?: string | Record<string, string>;
  format?: ('esm' | 'cjs' | 'iife' | 'umd')[];
  dts?: boolean | DtsOptions;
  outDir?: string;
  clean?: boolean;
  sourcemap?: boolean | 'inline';
  external?: (string | RegExp)[];
  minify?: boolean;
  target?: string | string[];
  plugins?: Plugin[];
  tsconfig?: string;
  watch?: boolean;
}

interface DtsOptions {
  sourcemap?: boolean;
}
```
