# Stryker Mutator Reference

## Version Info

- **Package**: `@stryker-mutator/core` v10.0.0 (published Aug 14, 2026)
- **License**: Apache-2.0
- **Peer Dependencies**: Test runner plugin (e.g. `@stryker-mutator/jest-runner`, `@stryker-mutator/vitest-runner`)
- **Supported Test Runners**: Jest, Mocha, Karma, Jasmine, Vitest, Cucumber, Tap
- **Supported Languages**: JavaScript, TypeScript, React, Angular, Vue, Svelte, Node.js
- **Source**: https://stryker-mutator.io/docs/stryker-js/getting-started/

## Install

```bash
# Using npm init (recommended — runs initializer)
npm init stryker@latest

# Manual install
npm install --save-dev @stryker-mutator/core

# Bun
bun add -D @stryker-mutator/core

# Install test runner plugin
npm install --save-dev @stryker-mutator/jest-runner
npm install --save-dev @stryker-mutator/vitest-runner
npm install --save-dev @stryker-mutator/mocha-runner

# TypeScript checker (optional)
npm install --save-dev @stryker-mutator/typescript-checker
```

## Configuration

### `stryker.config.json`

```json
{
  "$schema": "./node_modules/@stryker-mutator/core/schema/stryker-schema.json",
  "testRunner": "mocha",
  "coverageAnalysis": "perTest"
}
```

### `stryker.config.mjs` (ESM)

```js
// @ts-check
/** @type {import('@stryker-mutator/api/core').PartialStrykerOptions} */
const config = {
  testRunner: 'jest',
  mutator: 'typescript',
  reporters: ['html', 'clear-text', 'progress'],
  coverageAnalysis: 'perTest',
  tempDirName: '.stryker-tmp',
}
export default config
```

### `stryker.config.js` (CommonJS)

```js
// @ts-check
/**
 * @type {import('@stryker-mutator/api/core').PartialStrykerOptions}
 */
module.exports = {
  // Your config here
}
```

### Config file names (auto-discovered)

- `stryker.conf.{json,js,mjs,cjs}`
- `.stryker.conf.{json,js,mjs,cjs}`
- `stryker.config.{json,js,mjs,cjs}`
- `.stryker.config.{json,js,mjs,cjs}`

## CLI Commands

```bash
# Initialize Stryker in a project
npx stryker init

# Run mutation testing
npx stryker run

# Run with custom config file
npx stryker run alternative-stryker.config.json

# Run with trace logging (troubleshooting)
npx stryker run --logLevel trace

# Bun equivalents
bunx stryker init
bunx stryker run
bunx stryker run --logLevel trace
```

## Key Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `testRunner` | `string` | — | Test runner plugin name |
| `mutator` | `string` | `javascript` | Mutator type (`javascript` or `typescript`) |
| `reporters` | `string[]` | — | Reporters (`html`, `clear-text`, `progress`) |
| `coverageAnalysis` | `string` | `perTest` | `off`, `all`, or `perTest` |
| `concurrency` | `number` \| `string` | `n-1` CPU cores | Worker count or percentage |
| `tempDirName` | `string` | `.stryker-tmp` | Temp directory name |
| `mutate` | `string[]` | — | Glob patterns for files to mutate |
| `ignorePatterns` | `string[]` | — | Glob patterns to ignore |
| `checkers` | `string[]` | `[]` | Checker plugins (e.g. `typescript`) |
| `buildCommand` | `string` | — | Build command to run before testing |
| `allowEmpty` | `boolean` | `false` | Allow runs with no tests |
| `cleanTempDir` | `boolean` \| `'always'` | `true` | Clean temp dir behavior |
| `dashboard` | `object` | — | Dashboard reporting options |

## Coverage Analysis

- **`off`**: No optimization. All tests run for each mutant.
- **`all`**: Mutants without coverage reported as `NoCoverage`. Not tested.
- **`perTest`**: Only tests covering a mutant are executed. Tests must run independently and in random order.

## Supported Mutators (30+ types)

- Arithmetic Operator
- Array Declaration
- Assignment Expression
- Block Statement
- Boolean Literal
- Conditional Expression
- Equality Operator
- Logical Operator
- Method Expression
- Object Literal
- Optional Chaining
- Regex
- String Literal
- Unary Operator
- Update Operator

## Reports

- **HTML**: `reports/mutation/html/index.html`
- **Clear text**: Terminal output
- **Dashboard**: https://dashboard.stryker-mutator.io

## CI Integration

```yaml
# GitHub Actions
- name: Run mutation testing
  run: npx stryker run
```

```yaml
# With Bun
- name: Run mutation testing
  run: bunx stryker run
```

## Glob Patterns

```json
{
  "mutate": ["src/**/*.ts"],
  "ignorePatterns": ["src/**/*.spec.ts"]
}
```

Glob patterns are relative to the current working directory. Use double quotes on the command line to prevent shell expansion.

## Sources

- Getting Started: https://stryker-mutator.io/docs/stryker-js/getting-started/
- Config File: https://stryker-mutator.io/docs/stryker-js/config-file/
- Configuration: https://stryker-mutator.io/docs/stryker-js/configuration/
- Jest Runner: https://stryker-mutator.io/docs/stryker-js/jest-runner/
- Vitest Runner: https://stryker-mutator.io/docs/stryker-js/vitest-runner/
