# taze Reference

> A modern CLI tool that keeps your dependencies fresh in any repo and monorepo.

## Install

No installation required — use via `npx` or `bunx`:

```sh
bunx taze
npx taze
```

Optional install as dev dependency:

```sh
bun add -D taze
bun add -D taze
pnpm add -D taze
```

## Version

- Latest stable: `21.1.0`
- License: MIT

## Peer Dependencies

No required peer dependencies. Works with npm, yarn, pnpm, and bun.

## CLI Usage

```sh
npx taze [mode] [options]
```

### Modes

| Mode      | Description                                      |
| --------- | ------------------------------------------------ |
| `major`   | Check up to major updates (default)              |
| `minor`   | Check up to minor updates                        |
| `patch`   | Check up to patch updates                        |
| `latest`  | Always update to latest version                  |

```sh
npx taze              # Default: major updates
npx taze minor        # Check up to minor updates
npx taze patch        # Check up to patch updates
npx taze latest       # Update to latest versions
```

### Options

| Option                | Alias | Description                                              |
| --------------------- | ----- | -------------------------------------------------------- |
| `-r`                  | `--recursive` | Scan subdirectories for monorepo support       |
| `-w`                  | `--write`     | Write changes to `package.json`                |
| `-i`                  | `--install`   | Run install after bumping                      |
| `-I`                  | `--interactive` | Interactive mode to select packages to update |
| `--json`              | -     | Output as JSON (for agents and CI)                       |
| `--force`             | -     | Fetch latest package info without cache                  |
| `--cwd`               | -     | Specify current working directory                        |
| `--include`           | -     | Only include specified packages                          |
| `--exclude`           | -     | Exclude specified packages                               |
| `--ignorePaths`       | -     | Ignore paths for `package.json` lookup                   |
| `--ignoreOtherWorkspaces` | - | Ignore `package.json` in other workspaces            |
| `--silent`            | -     | Suppress output                                          |
| `--timeout`           | -     | Request timeout in milliseconds                          |

### Monorepo Usage

```sh
npx taze -r             # Recursive for monorepos
npx taze -r -w          # Recursive + write
npx taze -r -w -i       # Recursive + write + install
npx taze latest -r -w -i  # Update to latest, recursive, write, install
```

### JSON Output (for agents)

```sh
npx taze -r --json
```

## Configuration

Create `taze.config.js` (or `.ts`) in the project root:

```js
import { defineConfig } from 'taze'

export default defineConfig({
  // ignore packages from bumping
  exclude: [
    'webpack'
  ],
  // fetch latest package info from registry without cache
  force: true,
  // write to package.json
  write: true,
  // run `bun install` or `yarn install` right after bumping
  install: true,
  // ignore paths for looking for package.json in monorepo
  ignorePaths: [
    '**/node_modules/**',
    '**/test/**',
  ],
  // ignore package.json that in other workspaces
  ignoreOtherWorkspaces: true,
  // override with different bumping mode for each package
  packageMode: {
    'typescript': 'major',
    'unocss': 'ignore',
    // regex starts and ends with '/'
    '/vue/': 'latest'
  },
  // exclude packages from the maturity period filter
  maturityPeriodExclude: [
    'react',
    '@myorg/*',
  ],
  // disable checking for "overrides" package.json field
  depFields: {
    overrides: false
  }
})
```

### Configuration Options

| Option                   | Type      | Default | Description                              |
| ------------------------ | --------- | ------- | ---------------------------------------- |
| `exclude`                | `array`   | `[]`    | Packages to ignore from bumping          |
| `include`                | `array`   | `[]`    | Only include these packages              |
| `force`                  | `boolean` | `false` | Fetch without cache                      |
| `write`                  | `boolean` | `false` | Write changes to `package.json`          |
| `install`                | `boolean` | `false` | Run install after bumping                |
| `recursive`              | `boolean` | `false` | Monorepo recursive mode                  |
| `interactive`            | `boolean` | `false` | Interactive selection mode               |
| `ignorePaths`            | `array`   | -       | Paths to ignore for `package.json` lookup |
| `ignoreOtherWorkspaces`  | `boolean` | `true`  | Ignore other workspace `package.json`    |
| `packageMode`            | `object`  | `{}`    | Per-package bumping mode override        |
| `maturityPeriodExclude`  | `array`   | `[]`    | Exclude from maturity period filter      |
| `depFields`              | `object`  | -       | Control which dep fields to check        |

## GitHub Actions Support

Taze also checks GitHub Actions used in `.github/workflows/*.{yml,yaml}`, composite actions, and reusable workflow calls. Reports newer versions alongside npm dependencies.

## Package Scripts

```json
{
  "scripts": {
    "prepare": "bunx taze latest -w -r -i"
  }
}
```

## Features

- Built-in first-class monorepo support
- No installation required (`npx taze`)
- Safe by default — updates within allowed version range
- Interactive mode to select which packages to update
- Respects `package.json` `engines` field and package manager config
- Updates GitHub Actions in workflows
- Updates Node.js version in `.node-version` and `.nvmrc`
- Agents-compatible JSON output

## Source

- GitHub: https://github.com/antfu-collective/taze
- npm: https://www.npmjs.com/package/taze
