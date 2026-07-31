---
description: Setup Biome in a new project
---

# Setup Biome

## 1. Install Biome

```bash
bun add -D @biomejs/biome
```

## 2. Initialize Configuration

```bash
bunx biome init
```

This creates `biome.json` with recommended defaults.

## 3. Configure Biome

Edit `biome.json` to customize:

```json
{
  "$schema": "https://biomejs.dev/schemas/1.9.0/schema.json",
  "files": {
    "ignore": ["node_modules", "dist"]
  },
  "formatter": {
    "enabled": true,
    "indentStyle": "space",
    "indentWidth": 2,
    "lineWidth": 80
  },
  "linter": {
    "enabled": true,
    "rules": {
      "recommended": true
    }
  }
}
```

## 4. Format Existing Code

```bash
bunx biome check --write ./src
```

## 5. Setup Git Hooks (Optional)

Install Lefthook:

```bash
bun add -D lefthook
bunx lefthook install
```

Create `.lefthook/pre-commit`:

```yaml
pre-commit:
  parallel: false
  commands:
    biome:
      run: bunx biome check --write --staged
      stage_fixed: true
```

## 6. Setup Editor Integration (Optional)

### VS Code

Install Biome extension and add to `.vscode/settings.json`:

```json
{
  "editor.defaultFormatter": "biomejs.biome",
  "editor.formatOnSave": true
}
```

## 7. Add Scripts to package.json

```json
{
  "scripts": {
    "format": "biome format --write ./src",
    "lint": "biome lint ./src",
    "check": "biome check ./src",
    "ci": "biome ci ./src"
  }
}
```

## 8. Verify Setup

```bash
bun run check
```

If no errors, Biome is setup correctly!
