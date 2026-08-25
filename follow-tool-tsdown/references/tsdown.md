# tsdown Reference

> The elegant bundler for libraries powered by Rolldown.

## Install

```sh
bun add -D tsdown
```

Other package managers:

```sh
bun add -D tsdown
pnpm add -D tsdown
yarn add -D tsdown
```

## Version

- Latest stable: `0.22.14` (npm)
- License: MIT
- Requires: Node.js `^22.18.0 || ^24.11.0 || >=26.0.0` (build-time only; output can target lower versions)

## Peer Dependencies

- `typescript` (recommended if not using `isolatedDeclarations`)
- Optional: `tsx` or `unrun` for config loading on older Node.js

## Quick Start

Create source files:

```ts
// src/index.ts
import { hello } from './hello.ts'
hello()
```

```ts
// src/hello.ts
export function hello() {
  console.log('Hello tsdown!')
}
```

Create config:

```ts
// tsdown.config.ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
})
```

Build:

```sh
tsdown
```

Output written to `dist/index.mjs`.

## Config File

Supported filenames (searched in order):

- `tsdown.config.ts`
- `tsdown.config.mts`
- `tsdown.config.cts`
- `tsdown.config.js`
- `tsdown.config.mjs`
- `tsdown.config.cjs`
- `tsdown.config.json`

Also supports `tsdown` field in `package.json`.

### Basic Config

```ts
import { defineConfig } from 'tsdown'

export default defineConfig({
  entry: ['./src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  clean: true,
})
```

### Multiple Configurations

```ts
import { defineConfig } from 'tsdown'

export default defineConfig([
  {
    entry: 'src/entry1.ts',
    platform: 'node',
  },
  {
    entry: 'src/entry2.ts',
    platform: 'browser',
  },
])
```

### Custom Config Path

```sh
tsdown --config ./path/to/config
tsdown -c ./path/to/config
```

### Disable Config File

```sh
tsdown --no-config
```

### Config Loaders

```sh
tsdown --config-loader auto    # default
tsdown --config-loader native  # Node.js 22.18+, Deno, Bun
tsdown --config-loader tsx     # requires tsx
tsdown --config-loader unrun   # requires unrun
```

## Auto-Detection

| When tsdown detects...                              | It will...                          |
| --------------------------------------------------- | ----------------------------------- |
| `dependencies`/`peerDependencies`/`optionalDeps`    | Externalize them (not bundled)      |
| `devDependency` imported in code                    | Bundle it into output               |
| `types` or `typings` field in `package.json`        | Enable `.d.ts` generation           |
| `isolatedDeclarations` in `tsconfig.json`           | Use fast oxc-transform path for dts |
| `engines.node` in `package.json`                    | Infer compilation target            |
| `type: "module"` in `package.json`                  | Use `.js` extension for ESM output  |
| No `entry` specified, but `src/index.ts` exists     | Use it as default entry point       |
| `platform: "node"` (default)                        | Enable `fixedExtension` (`.mjs`/`.cjs`) |
| `exports: true`                                     | Generate `exports` field in `package.json` |

## CLI Commands

```sh
tsdown              # Build
tsdown --watch      # Watch mode (alias: -w)
tsdown --version    # Print version
tsdown --help       # Print help
tsdown --no-config  # Disable config file
```

## Build Scripts

```json
{
  "name": "my-tsdown-project",
  "type": "module",
  "scripts": {
    "build": "tsdown",
    "build:watch": "tsdown --watch",
    "dev": "tsdown --watch"
  },
  "devDependencies": {
    "tsdown": "^0.22.14"
  }
}
```

## Key Options

| Option        | Type               | Default     | Description                       |
| ------------- | ------------------ | ----------- | --------------------------------- |
| `entry`       | `string \| string[]` | `src/index.ts` | Entry point(s)                  |
| `format`      | `string \| string[]` | `esm`       | Output format: `esm`, `cjs`, `iife`, `umd` |
| `dts`         | `boolean \| object` | auto        | Generate type declarations        |
| `outDir`      | `string`           | `dist`      | Output directory                  |
| `clean`       | `boolean`          | `true`      | Clean dist before build           |
| `minify`      | `boolean`          | `false`     | Minify output                     |
| `treeshake`   | `boolean`          | `true`      | Tree shaking                      |
| `target`      | `string`           | auto        | Compilation target                |
| `platform`    | `string`           | `node`      | `node`, `browser`, `neutral`      |
| `bundle`      | `boolean`          | `true`      | Set `false` for unbundle mode     |
| `exports`     | `boolean`          | `false`     | Generate package exports          |
| `publint`     | `boolean`          | `false`     | Run publint validation            |
| `attw`        | `boolean`          | `false`     | Run attw type validation          |
| `plugins`     | `array`            | `[]`        | Rolldown/Rollup/unplugin plugins  |

## Plugins

```ts
import SomePlugin from 'some-plugin'
import { defineConfig } from 'tsdown'

export default defineConfig({
  plugins: [SomePlugin()],
})
```

Supports Rolldown plugins, Rollup plugins, unplugin, and some Vite plugins.

## Scaffold

```sh
npm create tsdown@latest
pnpm create tsdown@latest
yarn create tsdown@latest
bun create tsdown@latest
```

Templates include React, Vue, Solid, Svelte, and pure TypeScript.

## Migration from tsup

```sh
bunx tsdown-migrate
```

Compatible with tsup's main options for seamless migration.

## Source

- Docs: https://tsdown.dev
- GitHub: https://github.com/rolldown/tsdown
- npm: https://www.npmjs.com/package/tsdown
