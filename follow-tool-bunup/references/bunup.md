# bunup Reference

> Blazing-fast build tool for TypeScript libraries, powered by Bun's native bundler.

## Install

```sh
bun add --dev bunup
```

## Version

- Latest stable: `0.16.32`
- License: MIT
- Requires: Bun (runtime), TypeScript `>=4.5.0` (peer dependency)

## Peer Dependencies

| Package      | Version   |
| ------------ | --------- |
| `typescript` | `>=4.5.0` |

## Quick Start

Create a TypeScript file:

```ts
// src/index.ts
export function greet(name: string): string {
  return `Hello, ${name}!`;
}
```

Build it instantly:

```sh
bunx bunup
```

Outputs to `dist/` with ESM and `.d.ts` types.

Multiple formats:

```sh
bunx bunup --format esm,cjs
```

Generate and sync package exports automatically:

```sh
bunx bunup --exports
```

## Default Entry Points

Bunup auto-detects common entry points:

- `index.ts`, `index.tsx`
- `src/index.ts`, `src/index.tsx`
- `cli.ts`, `src/cli.ts`, `src/cli/index.ts`

Override with explicit file paths:

```sh
bunx bunup src/index.ts src/plugins.ts
```

## Config File

Create `bunup.config.ts` in the project root:

```ts
import { defineConfig } from "bunup";

export default defineConfig({
  entry: ["./src/index.ts"],
  format: ["esm", "cjs"],
  dts: true,
});
```

### Multiple Configurations

Export an array of configurations (each requires a `name`):

```ts
import { defineConfig } from "bunup";

export default defineConfig([
  {
    entry: "src/index.ts",
    name: "node",
    format: "esm",
    target: "node",
  },
  {
    entry: "src/browser.ts",
    name: "browser",
    format: ["esm", "iife"],
    target: "browser",
    outDir: "dist/browser",
  },
]);
```

### Filtering Configurations

```sh
bunup --filter main
bunup --filter main,browser
```

### Custom Config Path

```sh
bunup --config ./configs/custom.bunup.config.ts
bunup -c ./configs/custom.bunup.config.ts
```

### Disable Config File

```sh
bunup --no-config
```

## CLI Options

| Option          | Alias | Type     | Default | Description                          |
| --------------- | ----- | -------- | ------- | ------------------------------------ |
| `--format`      | `-f`  | `string` | `esm`   | Output format: `esm`, `cjs`, `iife`, or comma-separated |
| `--entry`       | `-e`  | `string` | auto    | Entry point(s)                        |
| `--out-dir`     | `-o`  | `string` | `dist`  | Output directory                      |
| `--target`      | `-t`  | `string` | -       | Target: `browser`, `node`             |
| `--exports`     | -     | `bool`   | `false` | Generate and sync package exports     |
| `--watch`       | -     | `bool`   | `false` | Watch mode for development            |
| `--config`      | `-c`  | `string` | -       | Path to config file                   |
| `--filter`      | -     | `string` | -       | Filter configs by name                |
| `--no-config`   | -     | `bool`   | `false` | Disable config file loading           |
| `--packages`    | -     | `string` | -       | `bundle` or `external`                |
| `--external`    | -     | `string` | -       | Packages to exclude from bundle       |
| `--no-external` | -     | `string` | -       | Packages to force into bundle         |

## Output Formats

- esm: ECMAScript modules (default)
- cjs: CommonJS modules
- iife: Immediately Invoked Function Expression (for browser)

### File Extensions

Extensions are determined by format and `package.json` `type` field:

When `"type": "module"`:

| Format | JS Extension   | DTS Extension     |
| ------ | -------------- | ----------------- |
| `esm`  | `.js`          | `.d.ts`           |
| `cjs`  | `.cjs`         | `.d.cts`          |
| `iife` | `.global.js`   | `.global.d.ts`    |

When `"type": "commonjs"` or unspecified:

| Format | JS Extension   | DTS Extension     |
| ------ | -------------- | ----------------- |
| `esm`  | `.mjs`         | `.d.mts`          |
| `cjs`  | `.js`          | `.d.ts`           |
| `iife` | `.global.js`   | `.global.d.ts`    |

## Dependency Handling

| Dependency Type    | Default Behavior          | Result                              |
| ------------------ | ------------------------- | ----------------------------------- |
| `dependencies`     | Excluded from bundle      | Installed when users install library |
| `peerDependencies` | Excluded from bundle      | Users must install separately       |
| `devDependencies`  | Included only if imported | Bundled when code uses them         |

Force all dependencies into bundle:

```sh
bunup --packages bundle
```

Keep all dependencies external:

```sh
bunup --packages external
```

## Build Scripts

```json
{
  "name": "my-package",
  "scripts": {
    "build": "bunup",
    "dev": "bunup --watch",
    "build:watch": "bunup --watch"
  }
}
```

## Scaffold

Spin up a ready-to-publish TypeScript or React component library:

```sh
bunx @bunup/cli@latest create
```

## Source

- Docs: https://bunup.dev
- GitHub: https://github.com/bunup/bunup
- npm: https://www.npmjs.com/package/bunup
