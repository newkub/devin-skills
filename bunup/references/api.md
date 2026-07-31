# API Reference

Bunup configuration API

## defineConfig

Main configuration function.

```typescript
import { defineConfig } from "bunup";

// Single config
export default defineConfig({
  entry: "src/index.ts",
});

// Multiple configs
export default defineConfig([
  { name: "main", entry: "src/index.ts" },
  { name: "cli", entry: "src/cli.ts" },
]);
```

### Parameters

| Parameter | Type | Description |
|-----------|------|-------------|
| `config` | `BunupConfig` \| `BunupConfig[]` | Configuration object or array |

### Returns

`BunupConfig` \| `BunupConfig[]`

---

## BunupConfig

Main configuration interface.

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `entry` | `string \| string[]` | Auto-detected | Entry point files |
| `outDir` | `string` | `"dist"` | Output directory |
| `format` | `Format \| Format[]` | `"esm"` | Output formats |
| `target` | `"node" \| "browser" \| "bun"` | `"node"` | Target environment |
| `clean` | `boolean` | `true` | Clean output before build |
| `minify` | `boolean` | `false` | Enable minification |
| `minifyWhitespace` | `boolean` | `false` | Minify whitespace |
| `minifyIdentifiers` | `boolean` | `false` | Minify variable names |
| `minifySyntax` | `boolean` | `false` | Minify syntax |
| `watch` | `boolean` | `false` | Watch mode |
| `splitting` | `boolean` | `true` (ESM) | Code splitting |
| `sourcemap` | `SourcemapOption` | `false` | Generate sourcemaps |
| `dts` | `boolean \| DTSOptions` | `true` | TypeScript declarations |
| `dtsOnly` | `boolean` | `false` | Only emit declarations |
| `preferredTsconfig` | `string` | - | Custom tsconfig path |
| `env` | `EnvOption` | `"inline"` | Environment variables |
| `define` | `Record<string, string>` | - | Global constants |
| `banner` | `string` | - | Banner text |
| `footer` | `string` | - | Footer text |
| `drop` | `string[]` | - | Drop function calls |
| `loader` | `Record<string, string>` | - | Custom loaders |
| `publicPath` | `string` | - | Public path prefix |
| `sourceBase` | `string` | - | Base directory for entry |
| `jsx` | `JSXOptions` | - | JSX configuration |
| `external` | `string[]` | - | External packages |
| `noExternal` | `string[]` | - | Force bundle packages |
| `packages` | `"bundle" \| "external"` | - | Default package handling |
| `shims` | `boolean` | `false` | Enable Node.js shims |
| `conditions` | `string[]` | - | Export conditions |
| `ignoreDCEAnnotations` | `boolean` | `false` | Ignore pure annotations |
| `emitDCEAnnotations` | `boolean` | `false` | Emit pure annotations |
| `silent` | `boolean` | `false` | Disable logging |
| `report` | `ReportOptions` | - | Build report |
| `plugins` | `BunupPlugin[]` | - | Plugin array |
| `exports` | `boolean \| ExportsOptions` | `false` | Auto-generate exports |
| `name` | `string` | - | Config name (for filtering) |
| `filter` | `string \| string[]` | - | Filter by config name |

---

## Format

```typescript
type Format = "esm" | "cjs" | "iife";
```

| Value | Description |
|-------|-------------|
| `esm` | ECMAScript modules |
| `cjs` | CommonJS modules |
| `iife` | Immediately Invoked Function Expression |

---

## SourcemapOption

```typescript
type SourcemapOption = "none" | "linked" | "inline" | "external" | boolean;
```

| Value | Description |
|-------|-------------|
| `"none"` | No sourcemaps |
| `"linked"` | Linked .map files |
| `"inline"` | Inline in bundle |
| `"external"` | Separate files |
| `true` | Equivalent to "inline" |

---

## DTSOptions

```typescript
interface DTSOptions {
  splitting?: boolean;
  minify?: boolean;
  resolve?: boolean | string[];
  inferTypes?: boolean;
  tsgo?: boolean;
  entry?: string | string[];
}
```

| Property | Type | Description |
|----------|------|-------------|
| `splitting` | `boolean` | Split declaration files |
| `minify` | `boolean` | Minify declarations |
| `resolve` | `boolean \| string[]` | Resolve external types |
| `inferTypes` | `boolean` | Use tsc for type inference |
| `tsgo` | `boolean` | Use TypeScript native compiler |
| `entry` | `string \| string[]` | Custom declaration entries |

---

## JSXOptions

```typescript
interface JSXOptions {
  runtime?: "automatic" | "classic";
  importSource?: string;
  factory?: string;
  fragment?: string;
  sideEffects?: boolean;
  development?: boolean;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `runtime` | `string` | `"automatic"` | JSX runtime |
| `importSource` | `string` | `"react"` | Import source |
| `factory` | `string` | `"h"` | Factory function |
| `fragment` | `string` | `"Fragment"` | Fragment component |
| `sideEffects` | `boolean` | `false` | Side effects |
| `development` | `boolean` | `false` | Dev mode |

---

## ReportOptions

```typescript
interface ReportOptions {
  gzip?: boolean;
  brotli?: boolean;
  maxBundleSize?: number;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `gzip` | `boolean` | `true` | Gzip size calculation |
| `brotli` | `boolean` | `false` | Brotli size calculation |
| `maxBundleSize` | `number` | - | Size threshold in bytes |

---

## ExportsOptions

```typescript
interface ExportsOptions {
  exclude?: string[];
  excludeCli?: boolean;
  excludeCss?: boolean;
  includePackageJson?: boolean;
  all?: boolean;
}
```

| Property | Type | Default | Description |
|----------|------|---------|-------------|
| `exclude` | `string[]` | - | Exclude from exports |
| `excludeCli` | `boolean` | `true` | Exclude CLI entries |
| `excludeCss` | `boolean` | `true` | Exclude CSS entries |
| `includePackageJson` | `boolean` | `true` | Include package.json |
| `all` | `boolean` | `false` | Wildcard export |

---

## EnvOption

```typescript
type EnvOption = "inline" | "disable" | string | Record<string, string>;
```

| Value | Description |
|-------|-------------|
| `"inline"` | Inline all env vars |
| `"disable"` | Keep as process.env.* |
| `"PREFIX*"` | Inline matching vars |
| `{ key: value }` | Explicit mapping |

---

## BunupPlugin

```typescript
interface BunupPlugin {
  name: string;
  setup(builder: BunupBuilder): void | Promise<void>;
}
```

| Property | Type | Description |
|----------|------|-------------|
| `name` | `string` | Plugin name |
| `setup` | `function` | Setup callback |

---

## BunupBuilder

```typescript
interface BunupBuilder {
  onBuild(callback: BuildCallback): void;
  onEnd(callback: EndCallback): void;
  writeFile(path: string, content: string): void;
}
```

| Method | Description |
|--------|-------------|
| `onBuild` | Register build callback |
| `onEnd` | Register end callback |
| `writeFile` | Write custom file |