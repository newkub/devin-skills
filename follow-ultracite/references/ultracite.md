# Ultracite Reference

## Overview

Ultracite is a production-grade, zero-configuration preset for ESLint, Biome, and Oxlint. It provides hundreds of preconfigured rules tuned for modern JavaScript and TypeScript. When used with Biome, it extends Biome's configuration with battle-tested linting and formatting rules.

## Install

```bash
bun add -D ultracite @biomejs/biome
```

Initialize with interactive setup:

```bash
npx ultracite init
```

Ultracite detects your package manager automatically. You can also use `pnpm dlx`, `yarn dlx`, or `bunx`.

## Version Info

- **ultracite latest stable:** `7.10.6`
- **@biomejs/biome (bundled):** `2.5.9`
- **License:** MIT
- **Source:** https://github.com/haydenbleasel/ultracite
- **Docs:** https://www.ultracite.ai/

## Peer Dependencies

- `oxfmt` `>=0.1.0` (optional)
- `oxlint` `^1.79.0` (optional)

When using Ultracite with Biome, `@biomejs/biome` must be installed as a dev dependency.

## Configuration

### Biome preset (core only)

```json
{
  "extends": ["ultracite/biome/core"]
}
```

### Biome preset with framework extensions

```json
{
  "extends": [
    "ultracite/biome/core",
    "ultracite/biome/react",
    "ultracite/biome/next"
  ]
}
```

### Available Biome presets

Ultracite publishes config presets under the `ultracite/biome/*` export path. Each preset is a `biome.jsonc` file that can be extended.

The `ultracite/biome/core` preset is the base. Framework-specific presets add rules for that framework.

### ESLint presets

Ultracite also publishes ESLint presets under `ultracite/eslint/*`:

```javascript
import config from "ultracite/eslint/core";

export default config;
```

### Oxlint presets

Oxlint presets are available under `ultracite/oxlint/*`:

```typescript
import { defineConfig } from "oxlint";
import config from "ultracite/oxlint/core";

export default defineConfig(config);
```

## CLI Commands

| Command | Description |
|---------|-------------|
| `ultracite init` | Initialize Ultracite (interactive by default) |
| `ultracite check [files...]` | Lint without writing changes |
| `ultracite fix [files...]` | Lint and auto-fix |
| `ultracite doctor` | Verify setup and diagnose config issues |

```bash
# Initialize
npx ultracite init

# Check (lint only)
npx ultracite check

# Fix (lint and auto-fix)
npx ultracite fix

# Diagnose setup
npx ultracite doctor
```

### Init flags for non-interactive use

| Flag | Description |
|------|-------------|
| `--linter <linter>` | Toolchain: `biome`, `eslint`, or `oxlint` |
| `--pm <pm>` | Package manager to use |
| `--editors <editors...>` | Editors to configure (`universal` for `.vscode/settings.json`) |
| `--agents <agents...>` | AI agents to enable (`universal` for `AGENTS.md`) |
| `--frameworks <frameworks...>` | Frameworks in use |
| `--type-aware` | Enable type-aware linting |
| `--install-skill` | Install reusable Ultracite skill |
| `--skip-install` | Configure without installing |
| `--quiet` | Suppress interactive prompts |

## Package.json Scripts

```json
{
  "scripts": {
    "lint": "ultracite check",
    "lint:fix": "ultracite fix"
  }
}
```

## Key Features

- **Subsecond performance:** Built around Rust-based tooling for near-instant analysis
- **Zero-config by design:** Hundreds of preconfigured rules, override anything when needed
- **AI-ready:** Generates ruleset and context files for Claude Code, Copilot, Cursor, Gemini
- **Monorepo ready:** One unified toolchain configuration across every package

## Important Notes

- Biome resolves `ultracite/biome/core` from `node_modules`, so Ultracite must be installed locally (not via `npx` cache)
- `ultracite doctor` verifies that Ultracite resolves correctly
- The bare `"extends": ["ultracite"]` form is broken since the package has no root export; always use `ultracite/biome/core`

## Source

- https://github.com/haydenbleasel/ultracite
- https://github.com/haydenbleasel/ultracite/blob/main/packages/cli/README.md
- https://www.ultracite.ai/
