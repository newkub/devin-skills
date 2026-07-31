# Configuration Options

Complete list of Bunup configuration options

## Entry Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `entry` | `string \| string[]` | `--entry` | Auto-detected |

## Output Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `outDir` | `string` | `--out-dir`, `-o` | `"dist"` |
| `format` | `Format \| Format[]` | `--format`, `-f` | `"esm"` |
| `clean` | `boolean` | `--clean`, `--no-clean` | `true` |

## Build Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `target` | `string` | `--target`, `-t` | `"node"` |
| `minify` | `boolean` | `--minify`, `--no-minify` | `false` |
| `minifyWhitespace` | `boolean` | `--minify-whitespace` | `false` |
| `minifyIdentifiers` | `boolean` | `--minify-identifiers` | `false` |
| `minifySyntax` | `boolean` | `--minify-syntax` | `false` |
| `splitting` | `boolean` | `--splitting`, `--no-splitting` | `true` (ESM) |

## Source Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `sourcemap` | `boolean \| string` | `--sourcemap` | `false` |
| `sourceBase` | `string` | `--source-base` | - |
| `publicPath` | `string` | `--public-path` | - |

## TypeScript Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `dts` | `boolean \| DTSOptions` | `--dts` | `true` |
| `dtsOnly` | `boolean` | `--dts-only` | `false` |
| `preferredTsconfig` | `string` | `--preferred-tsconfig` | - |

### DTS Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `dts.splitting` | `boolean` | `--dts.splitting` | `false` |
| `dts.minify` | `boolean` | `--dts.minify` | `false` |
| `dts.resolve` | `boolean \| string[]` | `--dts.resolve` | `false` |
| `dts.inferTypes` | `boolean` | `--dts.infer-types` | `false` |
| `dts.entry` | `string \| string[]` | `--dts.entry` | - |

## Environment Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `env` | `EnvOption` | `--env` | `"inline"` |
| `define` | `Record<string, string>` | `--define.<key>` | - |

## JSX Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `jsx` | `JSXOptions \| string` | `--jsx.*` | - |

### JSX Sub-options

| Option | CLI |
|--------|-----|
| `jsx.runtime` | `--jsx.runtime` |
| `jsx.importSource` | `--jsx.import-source` |
| `jsx.factory` | `--jsx.factory` |
| `jsx.fragment` | `--jsx.fragment` |
| `jsx.sideEffects` | `--jsx.side-effects` |
| `jsx.development` | `--jsx.development` |

## Package Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `packages` | `string` | `--packages` | - |
| `external` | `string[]` | `--external` | - |
| `noExternal` | `string[]` | `--no-external` | - |
| `shims` | `boolean` | `--shims` | `false` |
| `conditions` | `string[]` | `--conditions` | - |

## Code Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `banner` | `string` | `--banner` | - |
| `footer` | `string` | `--footer` | - |
| `drop` | `string[]` | `--drop` | - |
| `loader` | `Record<string, string>` | `--loader.<key>` | - |
| `ignoreDCEAnnotations` | `boolean` | `--ignore-dce-annotations` | `false` |
| `emitDCEAnnotations` | `boolean` | `--emit-dce-annotations` | `false` |

## Output Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `silent` | `boolean` | `--silent`, `-q` | `false` |
| `report` | `ReportOptions` | `--report.*` | - |

### Report Options

| Option | CLI | Default |
|--------|-----|---------|
| `report.gzip` | `--report.gzip` | `true` |
| `report.brotli` | `--report.brotli` | `false` |
| `report.maxBundleSize` | `--report.max-bundle-size` | - |

## Plugin Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `plugins` | `BunupPlugin[]` | - | - |

## Export Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `exports` | `boolean \| ExportsOptions` | `--exports` | `false` |

### Exports Options

| Option | CLI | Default |
|--------|-----|---------|
| `exports.exclude` | `--exports.exclude` | - |
| `exports.excludeCli` | `--exports.exclude-cli` | `true` |
| `exports.excludeCss` | `--exports.exclude-css` | `true` |
| `exports.includePackageJson` | `--exports.include-package-json` | `true` |
| `exports.all` | `--exports.all` | `false` |

## Config Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `name` | `string` | `--name` | - |
| `filter` | `string \| string[]` | `--filter` | - |

## Watch Options

| Option | Type | CLI | Default |
|--------|------|-----|---------|
| `watch` | `boolean` | `--watch` | `false` |

## Hooks

| Option | Type | Description |
|--------|------|-------------|
| `onSuccess` | `string \| Function \| CommandOptions` | Run after successful build |