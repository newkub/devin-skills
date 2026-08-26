# Rolldown (Rust-based JS Bundler, Rollup-compatible) Reference

## Install

```bash
# Using various package managers
bun add -D rolldown
pnpm add -D rolldown
yarn add -D rolldown
bun add -D rolldown
```

Verify installation:

```bash
./node_modules/.bin/rolldown --version
```

Check CLI options:

```bash
./node_modules/.bin/rolldown --help
```

## Version Info

- Latest release channel: `1.x.x`
- Rust-based bundler, Rollup-compatible
- Prebuilt binaries for Tier 1 platforms: Linux x64/arm64 glibc, Windows x64, Apple x64/arm64
- Tier 2: Windows arm64, Linux s390x, Linux ppc64le
- Wasm build available for unsupported platforms

## CLI Usage

Bundle directly from command line:

```bash
./node_modules/.bin/rolldown src/main.js --file bundle.js
```

Add to `package.json` scripts:

```json
{
  "name": "my-rolldown-project",
  "type": "module",
  "scripts": {
    "build": "rolldown src/main.js --file bundle.js"
  },
  "devDependencies": {
    "rolldown": "^1.0.0"
  }
}
```

Run with:

```bash
npm run build
```

## Config File

Config files can be `.js`, `.cjs`, `.mjs`, `.ts`, `.mts`, or `.cts`. Use `defineConfig` for type safety:

```js
// rolldown.config.js
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
  },
});
```

Use the config with `-c` flag:

```json
{
  "scripts": {
    "build": "rolldown -c"
  }
}
```

## Multiple Builds in One Config

```js
import { defineConfig } from 'rolldown';

export default defineConfig([
  {
    input: 'src/main.js',
    output: {
      format: 'esm',
    },
  },
  {
    input: 'src/worker.js',
    output: {
      format: 'iife',
      dir: 'dist/worker',
    },
  },
]);
```

## Library Configuration

For libraries, set `external` to exclude dependencies from the bundle:

```js
import { defineConfig } from 'rolldown';

export default defineConfig({
  input: 'src/index.ts',
  output: {
    dir: 'dist',
    format: 'esm',
    sourcemap: true,
  },
  external: ['react', 'react-dom'],
});
```

## Built-in Plugins

Rolldown provides built-in plugins implemented in Rust:
- `BundleAnalyzerPlugin` — analyze bundle size
- `ReplacePlugin` — replace variables in code
- `esmExternalRequirePlugin` — ESM external require handling

## JavaScript API

Compatible with Rollup's API, separating `input` and `output` options:

```js
import { rolldown } from 'rolldown';

const bundle = await rolldown({
  input: 'src/main.js',
});

await bundle.generate({
  format: 'esm',
});

await bundle.write({
  file: 'bundle.js',
});
```

Concise `build` API (same options as config file):

```js
import { build } from 'rolldown';

await build({
  input: 'src/main.js',
  output: {
    file: 'bundle.js',
  },
});
```

## Watcher API

Compatible with Rollup's `watch`:

```js
import { watch } from 'rolldown';

const watcher = watch({/* option */});

watcher.on('event', () => {});

await watcher.close();
```

## Key Configuration Options

### Input Options

- `input` — entry point(s)
- `external` — dependencies to exclude from bundle
- `plugins` — custom transformations
- `platform` — target platform
- `treeshake` — dead code elimination
- `resolve` — module resolution settings
- `transform` — transform settings

### Output Options

- `file` — output file path
- `dir` — output directory
- `format` — `esm`, `cjs`, `iife`, `umd`
- `sourcemap` — generate sourcemaps
- `minify` — minify output
- `entryFileNames` — entry chunk file naming
- `chunkFileNames` — chunk file naming
- `assetFileNames` — asset file naming
- `exports` — export mode
- `preserveModules` — preserve module structure

## For Library Bundling

For TypeScript libraries, use `tsdown` (built on Rolldown) instead of direct Rolldown:

```bash
bun add -D tsdown
```

See https://tsdown.dev/ for details.

## Source

- https://rolldown.rs/guide/getting-started
- https://rolldown.rs/reference/
- https://rolldown.rs/builtin-plugins/
